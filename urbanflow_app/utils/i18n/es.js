/**
 * Spanish translations (app-wide)
 * Mirrors the legacy pages/route/i18n/es.js content and adds
 * generic namespaces (common, errors, nav) for the rest of the
 * app.
 */

export const es = {
  common: {
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Intentar de nuevo',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    ok: 'OK',
    close: 'Cerrar',
    refresh: 'Actualizar',
    save: 'Guardar',
  },

  nav: {
    planner: 'Planificador',
    live: 'En vivo',
    costats: 'Estadísticas',
    trips: 'Viajes',
    profile: 'Perfil',
  },

  route: {
    title: 'UrbanFlow',
    startJourney: 'Iniciar Viaje',
    goBack: 'Regresar',
  },

  journey: {
    duration: '{duration} • Llegando {arrivalTime}',
    from: 'Desde',
    to: 'Hasta',
  },

  transport: {
    walk: 'Caminando',
    bus: 'Autobús',
    metro: 'Metro',
    bike: 'Bicicleta',
    train: 'Tren',
    car: 'Coche',
    scooter: 'Patinete',
  },

  status: {
    onTime: 'A Tiempo',
    delayed: 'Retrasado',
    cancelled: 'Cancelado',
    available: 'Disponible',
    delayInfo: '{minutes}m de retraso',
  },

  segment: {
    distance: '{distance}',
    stops: '{stops} paradas',
    duration: '{duration}',
    liveTracking: 'SEGUIMIENTO EN VIVO ACTIVO',
    nearbyStation: 'ESTACIÓN CERCANA',
    lane: 'CARRIL {number}',
  },

  occupancy: {
    low: 'Baja ocupación',
    medium: 'Ocupación media',
    high: 'Alta ocupación',
    full: 'Capacidad completa',
  },

  features: {
    accessible: 'Accesible',
    free: 'Gratis',
    electric: 'Eléctrico',
    busy: 'Lleno',
  },

  map: {
    label: 'Vista de Ruta',
    location: 'Mapa de {location}',
  },

  errors: {
    generic: '¡Ups! Algo salió mal',
    routeNotFound: 'No pudimos cargar los detalles de la ruta',
    retryMessage: 'Por favor, inténtalo de nuevo',
    networkError: 'Error de red. Por favor, verifica tu conexión.',
    locationPermission: 'Se requiere permiso de ubicación para el seguimiento en vivo.',
    offline: 'Estás sin conexión',
  },

  accessibility: {
    back: 'Regresar',
    startJourney: 'Iniciar viaje',
    segmentDetails: 'Segmento de {type}: {title}',
    viewDetails: 'Ver detalles de {title}',
    statusBadge: 'Estado: {status}',
    mapPreview: 'Mapa de {location}',
    liveTracking: 'Seguimiento en vivo activo',
  },

  announcements: {
    journeyStarted: 'Viaje iniciado. El seguimiento en vivo está ahora activo.',
    segmentComplete: 'Segmento completado. Pasando al siguiente segmento.',
    approachingDestination: 'Acercándose al destino.',
    delayDetected: 'Retraso detectado en tu ruta.',
  },

  profile: {
    title: 'Mi Perfil',
    sustainabilityImpact: 'Impacto de Sostenibilidad',
    account: 'Cuenta',
    preferences: 'Preferencias',
    city: 'Ciudad',
    editProfile: 'Editar Perfil',
    notifications: 'Notificaciones',
    privacy: 'Privacidad y Seguridad',
    preferredTransport: 'Transporte Preferido',
    mobilityGoals: 'Objetivos de Movilidad',
    languageRegion: 'Idioma y Región',
    logout: 'Cerrar Sesión',
    co2Saved: 'CO₂ Ahorrado',
    treesEquivalent: 'Árboles Equivalentes',
    ecoScore: 'Puntuación Eco',
  },

  planner: {
    title: 'Planifica tu Viaje',
    searchPlaceholder: 'Buscar destino...',
    quickActions: 'Acciones Rápidas',
    popularRoutes: 'Rutas Populares',
    searchErrorTitle: 'Error de Búsqueda',
    searchErrorMessage: 'No se pudieron buscar rutas. Inténtalo de nuevo.',
  },

  live: {
    title: 'Tránsito en Vivo',
    trafficConditions: 'Condiciones de Tráfico',
    recentUpdates: 'Actualizaciones Recientes',
    popularRoutes: 'Rutas Populares',
    transitStatus: 'Estado del Tránsito',
    airQuality: 'Calidad del Aire',
    realtimeActivity: 'Actividad en Tiempo Real',
    viewArchive: 'VER ARCHIVO',
    allClear: 'Todo despejado',
    noActiveAlerts: 'No hay alertas activas ahora mismo',
  },

  ecostats: {
    title: 'Estadísticas Eco',
    achievements: 'Logros',
    weekly: 'Semanal',
    monthly: 'Mensual',
    yearly: 'Anual',
    carbonFootprint: 'Huella de Carbono',
    loadError: 'No pudimos cargar tus estadísticas eco.',
  },

  notifications: {
    title: 'Notificaciones',
    emptyTitle: 'Aún no hay notificaciones',
    emptyMessage: 'Mantente atento a novedades sobre tus rutas, condiciones de tráfico e información de tránsito.',
    today: 'Hoy',
    yesterday: 'Ayer',
    older: 'Anteriores',
  },

  trips: {
    title: 'Tus Viajes',
    subtitle: 'Sigue el historial de tus trayectos',
    savedRoutes: 'Rutas Guardadas',
    recentTrips: 'Viajes Recientes',
    noTrips: 'Aún no hay viajes',
    noTripsMessage: 'Planifica una ruta para empezar a construir tu historial.',
    noSavedRoutes: 'Aún no hay rutas guardadas. ¡Empieza a planificar viajes!',
    seeAll: 'Ver Todo',
    viewAllHistory: 'Ver Todo el Historial',
  },

  intro: {
    title: 'UrbanFlow',
    smartMobility: 'Movilidad Inteligente.',
    zeroCompromise: 'Sin Concesiones.',
    description: 'Navega tu ciudad de forma eficiente reduciendo tu huella de carbono. Enrutamiento inteligente para el commuter moderno.',
    getStarted: 'Comenzar',
  },
};

export default es;
