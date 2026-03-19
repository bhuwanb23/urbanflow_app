const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');
const logger = require('../utils/logger');

/**
 * GET /api/v1/search
 * Fuzzy search across stops and routes
 * Query params: q (search query), limit (optional, default 10)
 */
router.get('/', (req, res, next) => {
  try {
    const { q, limit } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const searchLimit = limit ? parseInt(limit) : 10;
    const searchIndex = req.dataLoader.getSearchIndex();
    
    // Initialize Fuse.js for fuzzy search
    const fuse = new Fuse(searchIndex, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
      shouldSort: true
    });
    
    const results = fuse.search(q);
    const topResults = results.slice(0, searchLimit).map(result => result.item);
    
    logger.debug(`Search "${q}" returned ${topResults.length} results`);
    
    res.json({
      success: true,
      query: q,
      count: topResults.length,
      data: topResults
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
