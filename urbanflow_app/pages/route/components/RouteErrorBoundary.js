import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { routeTheme } from '../theme/routeTheme';

/**
 * RouteErrorBoundary Component
 * Catches and displays errors in route components with retry option
 */
export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RouteErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Call parent error handler if provided
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon name="alert-circle" size={48} color={routeTheme.colors.error} />
          </View>
          
          <Text style={styles.title}>Oops! Something went wrong</Text>
          
          <Text style={styles.subtitle}>
            We couldn&apos;t load the route details. Please try again.
          </Text>
          
          {__DEV__ && this.state.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              {this.state.errorInfo && (
                <Text style={styles.errorStack}>{this.state.errorInfo.componentStack}</Text>
              )}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Icon name="refresh" size={20} color={routeTheme.colors.onPrimary} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: routeTheme.spacing['2xl'],
    backgroundColor: routeTheme.colors.background,
  },
  iconContainer: {
    marginBottom: routeTheme.spacing.xl,
  },
  title: {
    fontSize: routeTheme.typography.fontSize.xl,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.onSurface,
    fontFamily: routeTheme.typography.fontFamily.headline,
    textAlign: 'center',
    marginBottom: routeTheme.spacing.sm,
  },
  subtitle: {
    fontSize: routeTheme.typography.fontSize.base,
    color: routeTheme.colors.onSurfaceVariant,
    fontFamily: routeTheme.typography.fontFamily.body,
    textAlign: 'center',
    marginBottom: routeTheme.spacing.xl,
    lineHeight: 22,
  },
  errorContainer: {
    width: '100%',
    padding: routeTheme.spacing.md,
    backgroundColor: routeTheme.colors.errorContainer,
    borderRadius: routeTheme.borderRadius.lg,
    marginBottom: routeTheme.spacing.xl,
  },
  errorText: {
    fontSize: routeTheme.typography.fontSize.sm,
    color: routeTheme.colors.onErrorContainer,
    fontFamily: 'monospace',
    marginBottom: routeTheme.spacing.sm,
  },
  errorStack: {
    fontSize: routeTheme.typography.fontSize.xs,
    color: routeTheme.colors.onErrorContainer,
    fontFamily: 'monospace',
    opacity: 0.7,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.sm,
    backgroundColor: routeTheme.colors.primary,
    paddingHorizontal: routeTheme.spacing.xl,
    paddingVertical: routeTheme.spacing.md,
    borderRadius: routeTheme.borderRadius.full,
    ...routeTheme.shadows.md,
  },
  retryButtonText: {
    color: routeTheme.colors.onPrimary,
    fontSize: routeTheme.typography.fontSize.base,
    fontWeight: routeTheme.typography.fontWeight.bold,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
});

export default RouteErrorBoundary;
