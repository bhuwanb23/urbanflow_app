/**
 * Download Delhi GTFS data from Open Transit Data (OTD) portal
 * Downloads: DTC/DIMTS bus data and DMRC metro data
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const RAW_DIR = path.join(__dirname, '..', '..', 'data', 'delhi', 'raw');
const BUS_ZIP = path.join(RAW_DIR, 'delhi_bus.zip');
const METRO_ZIP = path.join(RAW_DIR, 'delhi_metro.zip');

async function downloadWithSession(url, postData, outputPath, label) {
  try {
    // Step 1: GET the page to get a CSRF token
    const jar = { csrf: null };
    const getResp = await axios.get(url, {
      timeout: 30000,
      headers: { 'User-Agent': 'UrbanFlow/1.0' }
    });
    
    // Extract CSRF token from HTML
    const csrfMatch = getResp.data.match(/csrfmiddlewaretoken['"]\s*value\s*=\s*['"]([^'"]+)/);
    if (csrfMatch) {
      jar.csrf = csrfMatch[1];
      console.log(`Got CSRF token for ${label}`);
    } else {
      // Try another pattern
      const csrfMatch2 = getResp.data.match(/name=['"]csrfmiddlewaretoken['"][^>]*value=['"]([^'"]+)/);
      if (csrfMatch2) {
        jar.csrf = csrfMatch2[1];
        console.log(`Got CSRF token (alt) for ${label}`);
      }
    }
    
    if (!jar.csrf) {
      console.log(`No CSRF token found for ${label}, trying direct download...`);
      // Try direct URL
      const directResp = await axios.get(url, {
        timeout: 60000,
        responseType: 'stream',
        headers: { 'User-Agent': 'UrbanFlow/1.0' }
      });
      const writer = fs.createWriteStream(outputPath);
      directResp.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          const size = fs.statSync(outputPath).size;
          console.log(`Downloaded ${label}: ${size} bytes`);
          resolve(size);
        });
        writer.on('error', reject);
      });
    }
    
    // Step 2: POST the form
    const formData = querystring.stringify({
      ...postData,
      csrfmiddlewaretoken: jar.csrf
    });
    
    const postResp = await axios.post(url, formData, {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'UrbanFlow/1.0',
        'Referer': url,
        'Cookie': getResp.headers['set-cookie']?.join('; ') || ''
      },
      responseType: 'arraybuffer',
      maxRedirects: 5
    });
    
    // Check if response is a ZIP (starts with PK)
    const isZip = postResp.data[0] === 0x50 && postResp.data[1] === 0x4B;
    
    if (isZip) {
      fs.writeFileSync(outputPath, Buffer.from(postResp.data));
      const size = fs.statSync(outputPath).size;
      console.log(`Downloaded ${label}: ${size} bytes`);
      return size;
    } else {
      const text = Buffer.from(postResp.data).toString('utf8').substring(0, 500);
      console.log(`Response for ${label} is not a ZIP: ${text}`);
      return 0;
    }
  } catch (error) {
    console.error(`Error downloading ${label}: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log('=== Downloading Delhi GTFS Data ===\n');
  
  fs.mkdirSync(RAW_DIR, { recursive: true });
  
  const baseUrl = 'https://otd.delhi.gov.in/data/static/';
  const dmrcUrl = 'https://otd.delhi.gov.in/data/staticDMRC/';
  
  const commonFormData = {
    usageType: 'NonCommercial',
    purpose: ['Academia', 'R&D'],
    name: 'UrbanFlow Project',
    email: 'urbanflow@example.com'
  };
  
  // Try downloading bus data
  console.log('\n1. Downloading DTC/DIMTS Bus Data...');
  const busSize = await downloadWithSession(
    baseUrl,
    { ...commonFormData, dataDownloaded: 'all' },
    BUS_ZIP,
    'Delhi Bus GTFS'
  );
  
  if (busSize === 0) {
    // Try individual downloads
    console.log('\nTrying individual file downloads...');
    for (const file of ['stops', 'routes', 'stop_times', 'trips']) {
      const tmpPath = path.join(RAW_DIR, `delhi_bus_${file}.zip`);
      await downloadWithSession(
        baseUrl,
        { ...commonFormData, dataDownloaded: file },
        tmpPath,
        `Delhi Bus ${file}`
      );
    }
  }
  
  // Try downloading DMRC metro data
  console.log('\n2. Downloading DMRC Metro Data...');
  const metroSize = await downloadWithSession(
    dmrcUrl,
    { ...commonFormData, dataDownloaded: 'all' },
    METRO_ZIP,
    'Delhi Metro GTFS'
  );
  
  if (metroSize === 0) {
    console.log('\nTrying individual file downloads for metro...');
    for (const file of ['stops', 'routes', 'stop_times', 'trips']) {
      const tmpPath = path.join(RAW_DIR, `delhi_metro_${file}.zip`);
      await downloadWithSession(
        dmrcUrl,
        { ...commonFormData, dataDownloaded: file },
        tmpPath,
        `Delhi Metro ${file}`
      );
    }
  }
  
  console.log('\n=== Download Complete ===');
  
  // List downloaded files
  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.zip'));
  console.log('\nDownloaded files:');
  for (const f of files) {
    const stat = fs.statSync(path.join(RAW_DIR, f));
    console.log(`  ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

main().catch(console.error);
