import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * EmptyState
 * Reusable empty-state block with icon, title, message, and an
 * optional refresh action.
 */
export default function EmptyState({
  icon = 'inbox-outline',
  title = 'Nothing here yet',
  message,
  onRefresh,
  refreshLabel = 'Refresh',
  color = '#64748B',
  iconColor = '#94A3B8',
  iconBg = '#F1F5F9',
  testID,
}) {
  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      testID={testID}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={36} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color }]}>{message}</Text>
      ) : null}
      {onRefresh ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={refreshLabel}
          onPress={onRefresh}
          style={styles.button}
        >
          <Icon name="refresh" size={16} color="#0F172A" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{refreshLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
});
