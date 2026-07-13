import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { routesAPI } from '../../../utils/api';

/**
 * SearchAutocomplete Component
 * Real-time search with debounce and dropdown results.
 * Calls /routes/search on the backend; falls back to the demo
 * suggestions endpoint if the search API is not yet wired.
 */
export default function SearchAutocomplete({ onLocationSelect, placeholder = "Search stops, routes..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);

      const normalize = (raw) => {
        const list = Array.isArray(raw) ? raw : raw?.data || raw?.results || [];
        return list.map((item, idx) => {
          const name = item.name || item.title || item.stopName || item.routeName || `Result ${idx + 1}`;
          const type = item.type || (item.routeId ? 'route' : item.stopId ? 'stop' : 'area');
          return { id: item.id || item.stopId || item.routeId || `r-${idx}`, name, type };
        });
      };

      let items = [];
      try {
        const response = await routesAPI.searchRoutes({ q: searchQuery });
        items = normalize(response);
      } catch (primaryErr) {
        if (!__DEV__) {
          items = [];
        } else {
          const fallback = await fetch(
            `${require('../../../utils/api').API_CONFIG.BASE_URL}/api/demo/routes`
          )
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          items = normalize(fallback);
        }
      }

      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
    onLocationSelect?.(item);
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
    >
      <Icon 
        name={item.type === 'route' ? 'bus' : 'map-marker'} 
        size={20} 
        color="#16a34a" 
      />
      <Text style={styles.resultText}>{item.name}</Text>
      <Text style={styles.resultType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color="#64748B" />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {loading && <ActivityIndicator size="small" color="#16a34a" />}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon name="close-circle" size={20} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      {showDropdown && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          style={styles.dropdown}
          maxHeight={250}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#0F172A',
    paddingVertical: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  resultText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    color: '#0F172A',
  },
  resultType: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
});
