/**
 * Internationalization (i18n) Configuration
 * Spanish translations for route details screen
 */

export const es = {
  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Intentar de nuevo',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },

  // Route Details
  route: {
    title: 'UrbanFlow',
    startJourney: 'Iniciar Viaje',
    goBack: 'Regresar',
  },

  // Journey Overview
  journey: {
    duration: '{duration} • Llegando {arrivalTime}',
    from: 'Desde',
    to: 'Hasta',
  },

  // Transport Modes
  transport: {
    walk: 'Caminando',
    bus: 'Autobús',
    metro: 'Metro',
    bike: 'Bicicleta',
    train: 'Tren',
    car: 'Coche',
    scooter: 'Patinete',
  },

  // Status
  status: {
    onTime: 'A Tiempo',
    delayed: 'Retrasado',
    cancelled: 'Cancelado',
    available: 'Disponible',
    delayInfo: '{minutes}m de retraso',
  },

  // Segment Details
  segment: {
    distance: '{distance}',
    stops: '{stops} paradas',
    duration: '{duration}',
    liveTracking: 'SEGUIMIENTO EN VIVO ACTIVO',
    nearbyStation: 'ESTACIÓN CERCANA',
    lane: 'CARRIL {number}',
  },

  // Occupancy
  occupancy: {
    low: 'Baja ocupación',
    medium: 'Ocupación media',
    high: 'Alta ocupación',
    full: 'Capacidad completa',
  },

  // Features
  features: {
    accessible: '♿ Accesible',
    free: 'Gratis',
    electric: '🌱 Eléctrico',
    busy: '🔥 Lleno',
  },

  // Map Preview
  map: {
    label: 'Vista de Ruta',
    location: 'Mapa de {location}',
  },

  // Error States
  errors: {
    generic: '¡Ups! Algo salió mal',
    routeNotFound: 'No pudimos cargar los detalles de la ruta',
    retryMessage: 'Por favor, inténtalo de nuevo',
    networkError: 'Error de red. Por favor, verifica tu conexión.',
    locationPermission: 'Se requiere permiso de ubicación para el seguimiento en vivo.',
  },

  // Accessibility Labels
  accessibility: {
    back: 'Regresar',
    startJourney: 'Iniciar viaje',
    segmentDetails: 'Segmento de {type}: {title}',
    viewDetails: 'Ver detalles de {title}',
    statusBadge: 'Estado: {status}',
    mapPreview: 'Mapa de {location}',
    liveTracking: 'Seguimiento en vivo activo',
  },

  // Announcements
  announcements: {
    journeyStarted: 'Viaje iniciado. El seguimiento en vivo está ahora activo.',
    segmentComplete: 'Segmento completado. Pasando al siguiente segmento.',
    approachingDestination: 'Acercándose al destino.',
    delayDetected: 'Retraso detectado en tu ruta.',
  },
};

export default es;
