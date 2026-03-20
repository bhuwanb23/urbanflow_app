/**
 * Phase 4 Backend Testing Script
 * Tests all GTFS-RT endpoints with mock data
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

async function testEndpoint(name, url) {
  try {
    console.log(`\n${YELLOW}Testing: ${name}${RESET}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url);
    
    if (response.status === 200 && response.data.success) {
      console.log(`${GREEN}✓ SUCCESS${RESET}`);
      
      // Log some details
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          console.log(`  Items returned: ${response.data.data.length}`);
        } else if (typeof response.data.data === 'object') {
          console.log(`  Data keys: ${Object.keys(response.data.data).join(', ')}`);
        }
      }
      
      return true;
    } else {
      console.log(`${RED}✗ FAILED - Unexpected response format${RESET}`);
      return false;
    }
  } catch (error) {
    console.log(`${RED}✗ FAILED - ${error.message}${RESET}`);
    if (error.response) {
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('PHASE 4 BACKEND ENDPOINT TESTING');
  console.log('========================================');
  
  const tests = [
    {
      name: 'Live Vehicles - All',
      url: `${BASE_URL}/live/vehicles`
    },
    {
      name: 'Live Vehicles - By Route (500A)',
      url: `${BASE_URL}/live/vehicles/route/500A`
    },
    {
      name: 'Live Vehicles - Status',
      url: `${BASE_URL}/live/vehicles/status`
    },
    {
      name: 'Live Delays - All',
      url: `${BASE_URL}/live/delays`
    },
    {
      name: 'Live Delays - By Route (500A)',
      url: `${BASE_URL}/live/delays/route/500A`
    },
    {
      name: 'Live Delays - Severe',
      url: `${BASE_URL}/live/delays/severe`
    },
    {
      name: 'Live Alerts - All',
      url: `${BASE_URL}/live/alerts`
    },
    {
      name: 'Live Alerts - Critical',
      url: `${BASE_URL}/live/alerts/critical`
    },
    {
      name: 'Live Alerts - Recent Feed Items',
      url: `${BASE_URL}/live/alerts/recent?limit=5`
    },
    {
      name: 'API Info',
      url: `${BASE_URL}`
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n========================================');
  console.log('TEST SUMMARY');
  console.log('========================================');
  console.log(`${GREEN}Passed: ${passed}/${tests.length}${RESET}`);
  if (failed > 0) {
    console.log(`${RED}Failed: ${failed}/${tests.length}${RESET}`);
  }
  console.log('========================================\n');
  
  if (passed === tests.length) {
    console.log(`${GREEN}🎉 ALL TESTS PASSED!${RESET}`);
    console.log('\nPhase 4 backend is ready for frontend integration.');
  } else {
    console.log(`${YELLOW}⚠️  Some tests failed.${RESET}`);
    console.log('\nMake sure the backend server is running: npm run dev');
  }
}

// Run tests
runTests().catch(console.error);
