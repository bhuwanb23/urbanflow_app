import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * FeedSkeleton Component
 * Loading skeleton for live feed sections
 */
export default function FeedSkeleton({ itemCount = 4 }) {
  return (
    <View style={styles.container}>
      {/* Feed Header Skeleton */}
      <View style={styles.headerContainer}>
        <View style={[styles.headerIcon, { width: 40, height: 40, borderRadius: 20 }]} />
        <View style={styles.headerTextContainer}>
          <View style={[styles.headerTitle, { width: 150, height: 20 }]} />
          <View style={[styles.headerSubtitle, { width: 100, height: 14, marginTop: 4 }]} />
        </View>
      </View>

      {/* Feed Items Skeleton */}
      {[...Array(itemCount)].map((_, index) => (
        <View key={index} style={styles.feedItem}>
          <View style={styles.itemLeft}>
            <View style={[styles.itemIcon, { borderRadius: 16 }]} />
            <View style={styles.itemContent}>
              <View style={[styles.itemTitle, { width: index % 2 === 0 ? '80%' : '70%' }]} />
              <View style={[styles.itemDescription, { width: '90%', marginTop: 6 }]} />
            </View>
          </View>
          
          <View style={styles.itemRight}>
            {index % 3 === 0 && (
              <View style={[styles.badge, { width: 50, height: 20, borderRadius: 10 }]} />
            )}
            <View style={[styles.timestamp, { width: 60, height: 14, marginTop: index % 3 === 0 ? 4 : 0 }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E7E8E9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  headerIcon: {
    backgroundColor: '#F1F5F9',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  headerSubtitle: {
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
  },
  feedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F1F5F9',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    height: 18,
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
  },
  itemDescription: {
    height: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#F1F5F9',
  },
  timestamp: {
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
  },
});
