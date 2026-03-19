import { useCallback } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Custom hook for segment animations
 * Manages entrance, exit, and transition animations for route segments
 */
export function useSegmentAnimation(shouldAnimate = true) {
  /**
   * Create animated value for segment entrance
   */
  const createEntranceAnimation = useCallback(() => {
    if (!shouldAnimate) return new Animated.Value(1);
    
    const opacity = new Animated.Value(0);
    const translateY = new Animated.Value(20);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return { opacity, translateY };
  }, [shouldAnimate]);

  /**
   * Animate connector line drawing
   */
  const animateConnector = useCallback((callback) => {
    if (!shouldAnimate) {
      callback?.(1);
      return;
    }

    const progress = new Animated.Value(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: 600,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      callback?.(progress);
    });

    return progress;
  }, [shouldAnimate]);

  /**
   * Pulse animation for live indicators
   */
  const createPulseAnimation = useCallback(() => {
    if (!shouldAnimate) return new Animated.Value(1);

    const scale = new Animated.Value(1);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return scale;
  }, [shouldAnimate]);

  /**
   * Slide animation for segment transitions
   */
  const createSlideAnimation = useCallback((direction = 'left') => {
    if (!shouldAnimate) return new Animated.Value(0);

    const translateX = new Animated.Value(direction === 'left' ? -50 : 50);

    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return translateX;
  }, [shouldAnimate]);

  /**
   * Bounce animation for completed segments
   */
  const createBounceAnimation = useCallback(() => {
    if (!shouldAnimate) return new Animated.Value(1);

    const scale = new Animated.Value(1);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return scale;
  }, [shouldAnimate]);

  /**
   * Shimmer animation for loading states
   */
  const createShimmerAnimation = useCallback(() => {
    if (!shouldAnimate) return new Animated.Value(0.5);

    const opacity = new Animated.Value(0.5);

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return opacity;
  }, [shouldAnimate]);

  return {
    createEntranceAnimation,
    animateConnector,
    createPulseAnimation,
    createSlideAnimation,
    createBounceAnimation,
    createShimmerAnimation,
  };
}

export default useSegmentAnimation;
