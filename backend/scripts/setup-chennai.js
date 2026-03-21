/**
 * Chennai GTFS Data Setup Script
 * Downloads and processes Chennai MTC GTFS data
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const CHENNAI_DATA_DIR = path.join(__dirname, '../../data/chennai');
const GTFS_DIR = path.join(CHENNAI_DATA_DIR, 'gtfs');
const SHAPES_DIR = path.join(CHENNAI_DATA_DIR, 'shapes');

// Sample Chennai MTC data (to be replaced with real data)
const sampleStops = [
  { stop_id: "CHN001", stop_name: "Anna Nagar", stop_lat: 13.0850, stop_lon: 80.2101 },
  { stop_id: "CHN002", stop_name: "T. Nagar", stop_lat: 13.0418, stop_lon: 80.2341 },
  { stop_id: "CHN003", stop_name: "Mylapore", stop_lat: 13.0339, stop_lon: 80.2619 },
  { stop_id: "CHN004", stop_name: "Adyar", stop_lat: 13.0067, stop_lon: 80.2206 },
  { stop_id: "CHN005", stop_name: "Velachery", stop_lat: 12.9750, stop_lon: 80.2212 }
];

const sampleRoutes = [
  { route_id: "C1", route_short_name: "C1", route_long_name: "Anna Nagar - T. Nagar", route_type: 3, route_color: "0066CC" },
  { route_id: "C2", route_short_name: "C2", route_long_name: "Mylapore - Adyar", route_type: 3, route_color: "00AA00" },
  { route_id: "C3", route_short_name: "C3", route_long_name: "Velachery - Anna Nagar", route_type: 3, route_color: "FF6600" }
];

async function createDirectories() {
  console.log('📁 Creating directories...');
  await fs.mkdir(GTFS_DIR, { recursive: true });
  await fs.mkdir(SHAPES_DIR, { recursive: true });
  console.log('✅ Directories created');
}

async function createAgencyFile() {
  console.log('📝 Creating agency.txt...');
  const content = `agency_id,agency_name,agency_url,agency_timezone,agency_lang,agency_phone
CHENNAI_MTC,"Chennai Metropolitan Transport Corporation",https://www.mtcbus.org,"Asia/Kolkata",en,+91-44-22222222`;
  await fs.writeFile(path.join(GTFS_DIR, 'agency.txt'), content);
}

async function createStopsFile() {
  console.log('📍 Creating stops.txt...');
  const header = 'stop_id,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station';
  const rows = sampleStops.map(s => 
    `${s.stop_id},"${s.stop_name}",,${s.stop_lat},${s.stop_lon},,,0,`
  );
  const content = [header, ...rows].join('\n');
  await fs.writeFile(path.join(GTFS_DIR, 'stops.txt'), content);
}

async function createRoutesFile() {
  console.log('🚌 Creating routes.txt...');
  const header = 'route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url,route_color,route_text_color';
  const rows = sampleRoutes.map(r => 
    `${r.route_id},CHENNAI_MTC,"${r.route_short_name}","${r.route_long_name}",,${r.route_type},,${r.route_color},FFFFFF`
  );
  const content = [header, ...rows].join('\n');
  await fs.writeFile(path.join(GTFS_DIR, 'routes.txt'), content);
}

async function createTripsFile() {
  console.log('🗓️ Creating trips.txt...');
  const header = 'route_id,service_id,trip_id,trip_headsign,direction_id,block_id,shape_id';
  const trips = [];
  
  // Create sample trips for each route
  sampleRoutes.forEach((route, idx) => {
    trips.push(`${route.route_id},WEEKDAY,${route.route_id}_T1,"${route.route_long_name}",0,,${route.route_id}_S1`);
    trips.push(`${route.route_id},WEEKDAY,${route.route_id}_T2,"${route.route_long_name}",1,,${route.route_id}_S1`);
  });
  
  const content = [header, ...trips].join('\n');
  await fs.writeFile(path.join(GTFS_DIR, 'trips.txt'), content);
}

async function createStopTimesFile() {
  console.log('⏰ Creating stop_times.txt...');
  const header = 'trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled';
  const stopTimes = [];
  
  // Create sample stop times
  sampleRoutes.forEach(route => {
    const tripIds = [`${route.route_id}_T1`, `${route.route_id}_T2`];
    tripIds.forEach(tripId => {
      sampleStops.forEach((stop, idx) => {
        const arrival = `0${8 + idx}:00:00`;
        const departure = `0${8 + idx}:01:00`;
        stopTimes.push(`${tripId},${arrival},${departure},${stop.stop_id},${idx + 1},,,`);
      });
    });
  });
  
  const content = [header, ...stopTimes].join('\n');
  await fs.writeFile(path.join(GTFS_DIR, 'stop_times.txt'), content);
}

async function createCalendarFile() {
  console.log('📅 Creating calendar.txt...');
  const content = `service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date
WEEKDAY,1,1,1,1,1,0,0,20240101,20241231
WEEKEND,0,0,0,0,0,1,1,20240101,20241231`;
  await fs.writeFile(path.join(GTFS_DIR, 'calendar.txt'), content);
}

async function createShapes() {
  console.log('🗺️ Creating shape files...');
  
  // Create simple shapes for each route
  for (const route of sampleRoutes) {
    const shapeId = `${route.route_id}_S1`;
    const shapeData = {
      shape_id: shapeId,
      points: sampleStops.slice(0, 3).map((stop, idx) => ({
        lat: stop.stop_lat + (idx * 0.01),
        lon: stop.stop_lon + (idx * 0.01),
        sequence: idx + 1
      }))
    };
    
    await fs.writeFile(
      path.join(SHAPES_DIR, `${shapeId}.json`),
      JSON.stringify(shapeData, null, 2)
    );
  }
}

async function setupChennaiData() {
  try {
    console.log('🚀 Starting Chennai GTFS data setup...\n');
    
    await createDirectories();
    await createAgencyFile();
    await createStopsFile();
    await createRoutesFile();
    await createTripsFile();
    await createStopTimesFile();
    await createCalendarFile();
    await createShapes();
    
    console.log('\n✅ Chennai GTFS data setup complete!');
    console.log(`📁 Data directory: ${CHENNAI_DATA_DIR}`);
    console.log(`📍 Total stops: ${sampleStops.length}`);
    console.log(`🚌 Total routes: ${sampleRoutes.length}`);
    console.log('\nNext steps:');
    console.log('1. Replace sample data with real Chennai MTC GTFS');
    console.log('2. Run: npm run seed (in backend directory)');
    console.log('3. Test: curl http://localhost:3000/api/v1/cities/chennai');
    
  } catch (error) {
    console.error('❌ Error setting up Chennai data:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupChennaiData();
