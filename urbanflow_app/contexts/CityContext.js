import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citiesAPI } from '../utils/api';

const CityContext = createContext(null);

const DEFAULT_CITY = { id: 'delhi', displayName: 'Delhi NCR' };

export function CityProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCities = useCallback(async () => {
    try {
      const response = await citiesAPI.getCities();
      if (response?.success && response?.data?.cities) {
        setAvailableCities(response.data.cities);
        const activeCity = response.data.cities.find(c => c.id === response.data.currentCity?.toLowerCase());
        if (activeCity) {
          setCurrentCity({ id: activeCity.id, displayName: activeCity.name });
        }
      }
    } catch {
      setAvailableCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const switchCity = useCallback(async (cityId) => {
    const response = await citiesAPI.switchCity(cityId);
    if (response?.success) {
      const city = availableCities.find(c => c.id === cityId);
      setCurrentCity(city ? { id: city.id, displayName: city.name } : { id: cityId, displayName: cityId });
    }
    return response;
  }, [availableCities]);

  const value = {
    currentCity,
    availableCities,
    loading,
    switchCity,
    refreshCities: loadCities,
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    return {
      currentCity: DEFAULT_CITY,
      availableCities: [],
      loading: false,
      switchCity: async () => {},
      refreshCities: async () => {},
    };
  }
  return ctx;
}

export default CityContext;
