const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const otpService = require('../services/otpService');
const carbonCalculator = require('../utils/carbonCalculator');
const fareCalculator = require('../utils/fareCalculator');
const modeMapper = require('../utils/modeMapper');
const { journeyPlanSchema, validate } = require('../validators/plan');

/**
 * POST /api/v1/plan
 * Plan a journey with enriched UrbanFlow data
 */
router.post('/', validate(journeyPlanSchema), async (req, res, next) => {
  try {
    const {
      fromPlace,
      toPlace,
      modes = 'BUS,WALK',
      time,
      date,
      numItineraries = 3,
      wheelchair = false,
      optimize = 'QUICK'
    } = req.body;

    // Validate required parameters
    if (!fromPlace || !toPlace) {
      return res.status(400).json({
        success: false,
        error: 'fromPlace and toPlace are required'
      });
    }

    logger.info(`Planning journey: ${fromPlace} → ${toPlace}`);

    // Call OTP service
    const otpResponse = await otpService.planJourney({
      fromPlace,
      toPlace,
      modes,
      time,
      date,
      numItineraries,
      wheelchair,
      optimize
    });

    // Parse OTP response
    const itineraries = otpService.parseOTPResponse(otpResponse);

    // Enrich each itinerary with carbon scores and fares
    const enrichedItineraries = itineraries.map(itinerary => {
      // Calculate total distance
      const totalDistanceMeters = itinerary.legs.reduce(
        (sum, leg) => sum + (leg.distance || 0),
        0
      );
      const totalDistanceKm = totalDistanceMeters / 1000;

      // Calculate carbon metrics
      const carbonSaved = carbonCalculator.calculateCarbonSaved(
        itinerary.legs,
        totalDistanceKm
      );
      const ecoScore = carbonCalculator.getEcoScore(carbonSaved, totalDistanceKm);

      // Calculate fare
      const fareInfo = fareCalculator.calculateTotalFare(itinerary.legs);
      const fareWithDiscount = fareCalculator.applyTransferDiscount(
        itinerary.legs,
        fareInfo.total
      );

      // Enrich each leg with additional data
      const enrichedLegs = itinerary.legs.map(leg => {
        const modeInfo = modeMapper.getModeInfo(leg.mode);
        const legDistanceKm = (leg.distance || 0) / 1000;
        const legCarbonSaved = carbonCalculator.calculateCarbonSaved([leg], legDistanceKm);

        return {
          ...leg,
          ...modeInfo,
          carbonSaved: parseFloat(legCarbonSaved.toFixed(3)),
          emissions: parseFloat(carbonCalculator.calculateLegEmissions(legDistanceKm, leg.mode).toFixed(3)),
          durationMinutes: Math.round((leg.duration || 0) / 60),
          isEcoFriendly: modeMapper.isEcoFriendly(leg.mode)
        };
      });

      return {
        ...itinerary,
        legs: enrichedLegs,
        totalDistance: totalDistanceMeters,
        totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
        carbonSaved: parseFloat(carbonSaved.toFixed(3)),
        ecoScore,
        fare: fareWithDiscount.finalFare,
        fareBreakdown: fareInfo.breakdown,
        transferDiscount: fareWithDiscount.transferDiscount,
        hasTransfer: fareWithDiscount.hasTransfer,
        currency: 'INR',
        formattedFare: `₹${fareWithDiscount.finalFare}`,
        formattedCarbonSaved: `${carbonSaved.toFixed(2)} kg CO₂`
      };
    });

    // Sort by eco-score (highest first)
    enrichedItineraries.sort((a, b) => b.ecoScore.percentage - a.ecoScore.percentage);

    logger.info(`Returning ${enrichedItineraries.length} enriched itineraries`);

    res.json({
      success: true,
      count: enrichedItineraries.length,
      fromPlace,
      toPlace,
      data: {
        itineraries: enrichedItineraries,
        searchParams: {
          modes,
          time,
          date,
          optimize
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Plan API error:', error);
    
    if (error.message.includes('not running')) {
      return res.status(503).json({
        success: false,
        error: 'Routing service temporarily unavailable',
        message: error.message
      });
    }
    
    if (error.message.includes('No routes found')) {
      return res.status(404).json({
        success: false,
        error: 'No routes found',
        message: error.message,
        suggestions: [
          'Try different transport modes',
          'Check if locations are accessible by public transport',
          'Consider walking or cycling for short distances'
        ]
      });
    }
    
    next(error);
  }
});

/**
 * GET /api/v1/plan/modes
 * Get available transport modes with icons and colors
 */
router.get('/modes', (req, res) => {
  try {
    const allModes = modeMapper.getAllModes().map(mode => ({
      key: mode,
      ...modeMapper.getModeInfo(mode)
    }));

    res.json({
      success: true,
      count: allModes.length,
      data: {
        modes: allModes,
        categories: ['transit', 'active', 'private', 'commercial']
      }
    });
  } catch (error) {
    logger.error('Get modes error:', error);
    next(error);
  }
});

/**
 * GET /api/v1/plan/compare
 * Compare carbon impact of different transport modes
 */
router.get('/compare', (req, res, next) => {
  try {
    const { distance } = req.query;
    
    if (!distance) {
      return res.status(400).json({
        success: false,
        error: 'Distance parameter is required'
      });
    }

    const distanceKm = parseFloat(distance);
    if (isNaN(distanceKm) || distanceKm <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Distance must be a positive number'
      });
    }
    const modes = ['bus', 'metro', 'walk', 'bicycle', 'car', 'auto'];
    
    const comparison = carbonCalculator.compareModes(distanceKm, modes);
    
    // Add mode info
    const enrichedComparison = comparison.map(item => ({
      ...item,
      ...modeMapper.getModeInfo(item.mode),
      formattedEmissions: `${item.emissions.toFixed(3)} kg CO₂`,
      formattedSavings: `${item.savings.toFixed(3)} kg CO₂ saved`
    }));

    res.json({
      success: true,
      distance: distanceKm,
      unit: 'km',
      data: {
        comparison: enrichedComparison,
        bestMode: enrichedComparison.reduce((min, item) => 
          item.emissions < min.emissions ? item : min
        ),
        worstMode: enrichedComparison.reduce((max, item) => 
          item.emissions > max.emissions ? item : max
        )
      }
    });
  } catch (error) {
    logger.error('Compare modes error:', error);
    next(error);
  }
});

module.exports = router;
