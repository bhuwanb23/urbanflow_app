import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * ErrorState
 * Reusable error-state block. If `onRetry` is provided, a
 * "Try again" button is rendered. The `compact` prop swaps
 * the layout for an inline variant suitable for list rows.
 */
export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  testID,
}) {
  if (compact) {
    return (
      <View
        style={[styles.row, testID ? { testID } : null]}
        accessibilityRole="alert"
      >
        <Icon name="alert-circle-outline" size={18} color="#B91C1C" />
        <Text style={styles.rowText} numberOfLines={2}>
          {message}
        </Text>
        {onRetry ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
            onPress={onRetry}
            style={styles.rowButton}
          >
            <Text style={styles.rowButtonText}>{retryLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityRole="alert" testID={testID}>
      <View style={styles.iconWrap}>
        <Icon name="cloud-off-outline" size={36} color="#B91C1C" />
      </View>
      <Text style={styles.title}>Couldn’t load this</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          onPress={onRetry}
          style={styles.button}
        >
          <Icon name="refresh" size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{retryLabel}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  rowText: {
    flex: 1,
    color: '#7F1D1D',
    fontSize: 13,
  },
  rowButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  rowButtonText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
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
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#16A34A',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
