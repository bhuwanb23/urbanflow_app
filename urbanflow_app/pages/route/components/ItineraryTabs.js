import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * ItineraryTabs Component
 * Tabs to sort itineraries by Recommended, Cheapest, Fastest
 */
export default function ItineraryTabs({ sortBy, onSortChange, itineraryCount }) {
  const tabs = [
    { id: 'recommended', label: 'Recommended', icon: 'star' },
    { id: 'cheapest', label: 'Cheapest', icon: 'currency-inr' },
    { id: 'fastest', label: 'Fastest', icon: 'clock-fast' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              sortBy === tab.id && styles.activeTab,
            ]}
            onPress={() => onSortChange(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={16}
              color={sortBy === tab.id ? '#FFFFFF' : '#64748B'}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                sortBy === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {sortBy === tab.id && (
              <View style={styles.indicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{itineraryCount} routes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  indicator: {
    position: 'absolute',
    bottom: -17,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#16a34a',
  },
  countContainer: {
    position: 'absolute',
    right: 24,
    bottom: 16,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    color: '#64748B',
  },
});
