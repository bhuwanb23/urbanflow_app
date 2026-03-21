/**
 * City Management Routes
 * GET /api/v1/cities - Get all available cities
 * GET /api/v1/cities/:cityId - Get specific city info
 * POST /api/v1/cities/switch - Switch active city
 */

const express = require('express');
const router = express.Router();
const cityManager = require('../utils/cityManager');

/**
 * @route   GET /api/v1/cities
 * @desc    Get all available cities
 */
router.get('/', async (req, res) => {
  try {
    const summary = cityManager.getSummary();
    
    // Validate each city's data
    const citiesWithStatus = await Promise.all(
      summary.cities.map(async (city) => {
        const validation = await cityManager.validateCityData(city.id);
        return {
          ...city,
          hasData: validation.valid,
          dataStatus: validation
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...summary,
        cities: citiesWithStatus
      }
    });
  } catch (error) {
    console.error('Error getting cities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/cities/:cityId
 * @desc    Get specific city configuration and status
 */
router.get('/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityManager.getCity(cityId);

    if (!city) {
      return res.status(404).json({
        success: false,
        error: `City '${cityId}' not found`
      });
    }

    const validation = await cityManager.validateCityData(cityId);

    res.json({
      success: true,
      data: {
        ...city,
        dataStatus: validation
      }
    });
  } catch (error) {
    console.error(`Error getting city ${req.params.cityId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/cities/switch
 * @desc    Switch active city
 */
router.post('/switch', async (req, res) => {
  try {
    const { cityId } = req.body;

    if (!cityId) {
      return res.status(400).json({
        success: false,
        error: 'cityId is required'
      });
    }

    const city = cityManager.setActiveCity(cityId);

    res.json({
      success: true,
      message: `Successfully switched to ${city.displayName}`,
      data: {
        currentCity: city
      }
    });
  } catch (error) {
    console.error('Error switching city:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/cities/current
 * @desc    Get current active city
 */
router.get('/current/info', (req, res) => {
  try {
    const currentCity = cityManager.getCurrentCity();

    if (!currentCity) {
      return res.status(404).json({
        success: false,
        error: 'No active city configured'
      });
    }

    res.json({
      success: true,
      data: currentCity
    });
  } catch (error) {
    console.error('Error getting current city:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
