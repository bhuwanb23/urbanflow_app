import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * App-level ErrorBoundary
 *
 * Catches uncaught render errors anywhere inside the navigation
 * tree and shows a recovery UI instead of letting the whole app
 * crash. Provides a Try Again button that resets the boundary
 * state so the user can retry the failed screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, info);
      } catch (_) {
        // ignore
      }
    }
    if (typeof console !== 'undefined' && console.error) {
      console.error('ErrorBoundary caught an error:', error, info);
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null, info: null });
    if (typeof this.props.onReset === 'function') {
      try {
        this.props.onReset();
      } catch (_) {
        // ignore
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          info: this.state.info,
          reset: this.handleReset,
        });
      }
      const message =
        (this.state.error && (this.state.error.message || String(this.state.error))) ||
        'Something went wrong.';
      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The app hit an unexpected error. You can try again, or restart the app if the
            problem persists.
          </Text>
          <ScrollView style={styles.errorBox} contentContainerStyle={styles.errorBoxContent}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorText} selectable>
              {message}
            </Text>
          </ScrollView>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Try again"
            onPress={this.handleReset}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
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
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorBox: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    marginBottom: 24,
  },
  errorBoxContent: {
    flexGrow: 1,
  },
  errorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#7F1D1D',
    fontFamily: 'Courier',
  },
  retryButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
