const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'UrbanFlow API',
      version: '1.0.0',
      description: 'Multimodal urban transport API — routes, real-time vehicles, eco-stats, and multi-city support.',
      contact: { name: 'UrbanFlow Team' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Something went wrong' },
          },
        },
        Stop: {
          type: 'object',
          properties: {
            stop_id: { type: 'string' },
            stop_name: { type: 'string' },
            stop_lat: { type: 'number' },
            stop_lon: { type: 'number' },
          },
        },
        Route: {
          type: 'object',
          properties: {
            route_id: { type: 'string' },
            route_short_name: { type: 'string' },
            route_long_name: { type: 'string' },
            route_type: { type: 'integer' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            from: { type: 'object' },
            to: { type: 'object' },
            mode: { type: 'string' },
            distance: { type: 'number' },
            duration: { type: 'number' },
            carbonSaved: { type: 'number' },
            cost: { type: 'number' },
            caloriesBurned: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            read: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        EcoStats: {
          type: 'object',
          properties: {
            period: { type: 'string' },
            trips: { type: 'object' },
            distance: { type: 'object' },
            carbon: { type: 'object' },
            health: { type: 'object' },
            cost: { type: 'object' },
          },
        },
        City: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'delhi' },
            name: { type: 'string', example: 'Delhi NCR' },
            hasData: { type: 'boolean' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            routeId: { type: 'string' },
            lat: { type: 'number' },
            lon: { type: 'number' },
            bearing: { type: 'number' },
            speed: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            severity: { type: 'string', enum: ['INFO', 'WARNING', 'CRITICAL'] },
            title: { type: 'string' },
            description: { type: 'string' },
            routeId: { type: 'string' },
          },
        },
        JourneyPlan: {
          type: 'object',
          properties: {
            fromPlace: { type: 'string' },
            toPlace: { type: 'string' },
            modes: { type: 'string' },
            time: { type: 'string' },
            date: { type: 'string' },
            numItineraries: { type: 'integer' },
            wheelchair: { type: 'boolean' },
            optimize: { type: 'string', enum: ['QUICK', 'SAFE', 'GREEN'] },
          },
        },
      },
    },
    paths: {
      // ── Health & Info ───────────────────────────────────────────
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Server health check',
          responses: {
            200: { description: 'Server is healthy', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, status: { type: 'string' }, uptime: { type: 'number' } } } } } },
          },
        },
      },
      '/api/v1': {
        get: {
          tags: ['System'],
          summary: 'API information',
          responses: { 200: { description: 'API info object' } },
        },
      },
      '/api/stats': {
        get: {
          tags: ['System'],
          summary: 'Server statistics',
          responses: { 200: { description: 'Stats object' } },
        },
      },

      // ── Auth ────────────────────────────────────────────────────
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, name: { type: 'string' }, phone: { type: 'string' } } } } } },
          responses: { 201: { description: 'User registered' }, 400: { description: 'Validation error' } },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
          responses: { 200: { description: 'Login successful, returns token' }, 401: { description: 'Invalid credentials' }, 423: { description: 'Account locked' } },
        },
      },
      '/api/v1/auth/verify': {
        post: {
          tags: ['Auth'],
          summary: 'Verify JWT token',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Token valid' }, 401: { description: 'Invalid/expired token' } },
        },
      },
      '/api/v1/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout (blacklists token)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Logged out' } },
        },
      },
      '/api/v1/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh JWT token',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'New token' } },
        },
      },
      '/api/v1/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string' } } } } } },
          responses: { 200: { description: 'Reset email sent (if account exists)' } },
        },
      },
      '/api/v1/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password with token',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token', 'email', 'password'], properties: { token: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } } },
          responses: { 200: { description: 'Password reset' }, 400: { description: 'Invalid token' } },
        },
      },

      // ── User ────────────────────────────────────────────────────
      '/api/v1/user/profile': {
        get: {
          tags: ['User'],
          summary: 'Get user profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User profile' } },
        },
        put: {
          tags: ['User'],
          summary: 'Update user profile',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string' }, preferences: { type: 'object' } } } } } },
          responses: { 200: { description: 'Profile updated' } },
        },
      },
      '/api/v1/user/preferences': {
        get: {
          tags: ['User'],
          summary: 'Get user preferences',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Preferences object' } },
        },
        put: {
          tags: ['User'],
          summary: 'Update user preferences',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Preferences updated' } },
        },
      },

      // ── Trips ───────────────────────────────────────────────────
      '/api/v1/trips': {
        get: {
          tags: ['Trips'],
          summary: 'List user trips',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
            { in: 'query', name: 'offset', schema: { type: 'integer', default: 0 } },
            { in: 'query', name: 'mode', schema: { type: 'string' } },
            { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
            { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
          ],
          responses: { 200: { description: 'Paginated trip list' } },
        },
        post: {
          tags: ['Trips'],
          summary: 'Create a trip',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/JourneyPlan' } } } },
          responses: { 201: { description: 'Trip created' } },
        },
      },
      '/api/v1/trips/stats': {
        get: {
          tags: ['Trips'],
          summary: 'Trip statistics',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'period', schema: { type: 'string', enum: ['day', 'week', 'month', 'year'], default: 'week' } }],
          responses: { 200: { description: 'Trip stats' } },
        },
      },
      '/api/v1/trips/{id}': {
        get: {
          tags: ['Trips'],
          summary: 'Get trip by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Trip object' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Trips'],
          summary: 'Update a trip',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Trip updated' } },
        },
        delete: {
          tags: ['Trips'],
          summary: 'Delete a trip',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Trip deleted' } },
        },
      },

      // ── Notifications ───────────────────────────────────────────
      '/api/v1/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'List user notifications',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
            { in: 'query', name: 'unreadOnly', schema: { type: 'boolean', default: false } },
            { in: 'query', name: 'type', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Notification list with unread count' } },
        },
      },
      '/api/v1/notifications/settings': {
        get: {
          tags: ['Notifications'],
          summary: 'Get notification settings',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Settings object' } },
        },
        put: {
          tags: ['Notifications'],
          summary: 'Update notification settings',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Settings updated' } },
        },
      },
      '/api/v1/notifications/read-all': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark all notifications as read',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'All marked read' } },
        },
      },
      '/api/v1/notifications/{id}': {
        get: {
          tags: ['Notifications'],
          summary: 'Get notification by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Notification' }, 404: { description: 'Not found' } },
        },
        delete: {
          tags: ['Notifications'],
          summary: 'Delete a notification',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/v1/notifications/{id}/read': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark notification as read',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Marked read' } },
        },
      },

      // ── Stops ───────────────────────────────────────────────────
      '/api/v1/stops': {
        get: {
          tags: ['Transit Data'],
          summary: 'List all stops',
          parameters: [{ in: 'query', name: 'bbox', schema: { type: 'string' }, description: 'minLat,minLon,maxLat,maxLon' }],
          responses: { 200: { description: 'Stop list', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, count: { type: 'integer' }, data: { type: 'array', items: { '$ref': '#/components/schemas/Stop' } } } } } } } },
        },
      },
      '/api/v1/stops/nearby': {
        get: {
          tags: ['Transit Data'],
          summary: 'Find stops near coordinates',
          parameters: [
            { in: 'query', name: 'lat', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'lon', required: true, schema: { type: 'number' } },
            { in: 'query', name: 'radius', schema: { type: 'integer', default: 500 } },
          ],
          responses: { 200: { description: 'Nearby stops' } },
        },
      },
      '/api/v1/stops/{id}': {
        get: {
          tags: ['Transit Data'],
          summary: 'Get stop by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Stop object' }, 404: { description: 'Not found' } },
        },
      },

      // ── Routes ─────────────────────────────────────────────────
      '/api/v1/routes': {
        get: {
          tags: ['Transit Data'],
          summary: 'List all routes',
          responses: { 200: { description: 'Route list', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, count: { type: 'integer' }, data: { type: 'array', items: { '$ref': '#/components/schemas/Route' } } } } } } } },
        },
      },
      '/api/v1/routes/popular': {
        get: {
          tags: ['Transit Data'],
          summary: 'List popular routes',
          responses: { 200: { description: 'Popular routes' } },
        },
      },
      '/api/v1/routes/{id}': {
        get: {
          tags: ['Transit Data'],
          summary: 'Get route by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Route object' }, 404: { description: 'Not found' } },
        },
      },

      // ── Schedule / Shapes ───────────────────────────────────────
      '/api/v1/schedule/{routeId}': {
        get: {
          tags: ['Transit Data'],
          summary: 'Get route schedule',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Schedule' } },
        },
      },
      '/api/v1/shapes/{shapeId}': {
        get: {
          tags: ['Transit Data'],
          summary: 'Get shape GeoJSON',
          parameters: [{ in: 'path', name: 'shapeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Shape GeoJSON' } },
        },
      },

      // ── Search ──────────────────────────────────────────────────
      '/api/v1/search': {
        get: {
          tags: ['Transit Data'],
          summary: 'Fuzzy search stops and routes',
          parameters: [{ in: 'query', name: 'q', required: true, schema: { type: 'string', minLength: 2 } }, { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }],
          responses: { 200: { description: 'Search results' } },
        },
      },

      // ── Journey Planning ────────────────────────────────────────
      '/api/v1/plan': {
        post: {
          tags: ['Journey Planning'],
          summary: 'Plan a journey',
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/JourneyPlan' } } } },
          responses: { 200: { description: 'Itineraries' }, 503: { description: 'OTP unavailable' } },
        },
      },
      '/api/v1/plan/modes': {
        get: {
          tags: ['Journey Planning'],
          summary: 'Available transport modes',
          responses: { 200: { description: 'Modes with icons and colors' } },
        },
      },
      '/api/v1/plan/compare': {
        get: {
          tags: ['Journey Planning'],
          summary: 'Compare carbon emissions across modes',
          parameters: [{ in: 'query', name: 'distance', required: true, schema: { type: 'number', exclusiveMinimum: 0 } }],
          responses: { 200: { description: 'Emission comparison' } },
        },
      },

      // ── Cities ──────────────────────────────────────────────────
      '/api/v1/cities': {
        get: {
          tags: ['Cities'],
          summary: 'List all cities',
          responses: { 200: { description: 'City list', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { cities: { type: 'array', items: { '$ref': '#/components/schemas/City' } } } } } } } } } },
        },
      },
      '/api/v1/cities/switch': {
        post: {
          tags: ['Cities'],
          summary: 'Switch active city',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['cityId'], properties: { cityId: { type: 'string' } } } } } },
          responses: { 200: { description: 'City switched' }, 400: { description: 'Invalid city' } },
        },
      },
      '/api/v1/cities/current/info': {
        get: {
          tags: ['Cities'],
          summary: 'Get current active city',
          responses: { 200: { description: 'Active city info' } },
        },
      },
      '/api/v1/cities/{cityId}': {
        get: {
          tags: ['Cities'],
          summary: 'Get city details',
          parameters: [{ in: 'path', name: 'cityId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'City details' }, 404: { description: 'City not found' } },
        },
      },

      // ── Environment ─────────────────────────────────────────────
      '/api/v1/environment/aqi': {
        get: {
          tags: ['Environment'],
          summary: 'Get air quality index',
          parameters: [{ in: 'query', name: 'location', schema: { type: 'string', default: 'bengaluru' } }],
          responses: { 200: { description: 'AQI data with pollutants' } },
        },
      },

      // ── Traffic ─────────────────────────────────────────────────
      '/api/v1/traffic': {
        get: {
          tags: ['Traffic'],
          summary: 'Get traffic conditions',
          parameters: [{ in: 'query', name: 'area', schema: { type: 'string', default: 'bengaluru' } }],
          responses: { 200: { description: 'Traffic data' } },
        },
      },

      // ── EcoStats ────────────────────────────────────────────────
      '/api/v1/ecostats': {
        get: {
          tags: ['EcoStats'],
          summary: 'Get eco statistics',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'period', schema: { type: 'string', enum: ['day', 'week', 'month', 'year'], default: 'week' } }],
          responses: { 200: { description: 'Eco stats', content: { 'application/json': { schema: { '$ref': '#/components/schemas/EcoStats' } } } } },
        },
      },
      '/api/v1/ecostats/weekly': {
        get: {
          tags: ['EcoStats'],
          summary: 'Weekly eco stats',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Weekly stats' } },
        },
      },
      '/api/v1/ecostats/monthly': {
        get: {
          tags: ['EcoStats'],
          summary: 'Monthly eco stats',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Monthly stats' } },
        },
      },
      '/api/v1/ecostats/achievements': {
        get: {
          tags: ['EcoStats'],
          summary: 'User achievements',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Achievements list' } },
        },
      },
      '/api/v1/ecostats/summary': {
        get: {
          tags: ['EcoStats'],
          summary: 'Compact weekly summary',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Summary object' } },
        },
      },

      // ── Live Vehicles ───────────────────────────────────────────
      '/api/v1/live/vehicles': {
        get: {
          tags: ['Live'],
          summary: 'List active vehicles',
          parameters: [
            { in: 'query', name: 'routeId', schema: { type: 'string' } },
            { in: 'query', name: 'status', schema: { type: 'string' } },
            { in: 'query', name: 'lat', schema: { type: 'number' } },
            { in: 'query', name: 'lon', schema: { type: 'number' } },
            { in: 'query', name: 'radius', schema: { type: 'number' } },
          ],
          responses: { 200: { description: 'Vehicle list with metadata' } },
        },
      },
      '/api/v1/live/vehicles/status': {
        get: {
          tags: ['Live'],
          summary: 'Vehicle service status',
          responses: { 200: { description: 'Service health' } },
        },
      },
      '/api/v1/live/vehicles/route/{routeId}': {
        get: {
          tags: ['Live'],
          summary: 'Vehicles on a specific route',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Route vehicles' } },
        },
      },
      '/api/v1/live/vehicles/{vehicleId}': {
        get: {
          tags: ['Live'],
          summary: 'Get vehicle by ID',
          parameters: [{ in: 'path', name: 'vehicleId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Vehicle object' } },
        },
      },

      // ── Live Delays ─────────────────────────────────────────────
      '/api/v1/live/delays': {
        get: {
          tags: ['Live'],
          summary: 'List delays',
          parameters: [
            { in: 'query', name: 'routeId', schema: { type: 'string' } },
            { in: 'query', name: 'prediction', schema: { type: 'string' } },
            { in: 'query', name: 'minDelay', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'Delay list' } },
        },
      },
      '/api/v1/live/delays/route/{routeId}': {
        get: {
          tags: ['Live'],
          summary: 'Delays on a specific route',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Route delays' } },
        },
      },
      '/api/v1/live/delays/severe': {
        get: {
          tags: ['Live'],
          summary: 'Severe delays (>5 min)',
          responses: { 200: { description: 'Severe delays' } },
        },
      },
      '/api/v1/live/delays/status': {
        get: {
          tags: ['Live'],
          summary: 'Delay service status',
          responses: { 200: { description: 'Service health' } },
        },
      },

      // ── Live Alerts ─────────────────────────────────────────────
      '/api/v1/live/alerts': {
        get: {
          tags: ['Live'],
          summary: 'List alerts',
          parameters: [
            { in: 'query', name: 'severity', schema: { type: 'string' } },
            { in: 'query', name: 'routeId', schema: { type: 'string' } },
            { in: 'query', name: 'cause', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Alert list' } },
        },
      },
      '/api/v1/live/alerts/route/{routeId}': {
        get: {
          tags: ['Live'],
          summary: 'Alerts on a specific route',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Route alerts' } },
        },
      },
      '/api/v1/live/alerts/critical': {
        get: {
          tags: ['Live'],
          summary: 'Critical alerts only',
          responses: { 200: { description: 'Critical alerts' } },
        },
      },
      '/api/v1/live/alerts/recent': {
        get: {
          tags: ['Live'],
          summary: 'Recent alerts feed',
          parameters: [{ in: 'query', name: 'limit', schema: { type: 'integer', default: 5 } }],
          responses: { 200: { description: 'Alert feed' } },
        },
      },
      '/api/v1/live/alerts/status': {
        get: {
          tags: ['Live'],
          summary: 'Alert service status',
          responses: { 200: { description: 'Service health' } },
        },
      },

      // ── Live Predictions ────────────────────────────────────────
      '/api/v1/live/predictions': {
        get: {
          tags: ['Live'],
          summary: 'Generate disruption predictions',
          responses: { 200: { description: 'Predictions per route' } },
        },
      },
      '/api/v1/live/predictions/route/{routeId}': {
        get: {
          tags: ['Live'],
          summary: 'Prediction for a specific route',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Route prediction' } },
        },
      },
      '/api/v1/live/predictions/warning/trip/{tripId}': {
        get: {
          tags: ['Live'],
          summary: 'Trip delay warning',
          parameters: [
            { in: 'path', name: 'tripId', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'scheduledDeparture', required: true, schema: { type: 'string', format: 'date-time' } },
          ],
          responses: { 200: { description: 'Trip warning' } },
        },
      },
      '/api/v1/live/predictions/stats/{routeId}': {
        get: {
          tags: ['Live'],
          summary: 'Historical disruption stats for a route',
          parameters: [{ in: 'path', name: 'routeId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Stats object' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
