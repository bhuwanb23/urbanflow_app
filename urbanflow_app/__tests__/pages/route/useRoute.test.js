import { renderHook, act } from '@testing-library/react-native';
import { useRoute } from '../pages/route/context/RouteContext';
import { RouteProvider } from '../pages/route/context/RouteContext';

// Mock route data
const mockRouteData = {
  id: 'test-route',
  from: 'Test From',
  to: 'Test To',
  duration: '30 min',
  arrivalTime: '10:00 AM',
  segments: [
    { id: '1', type: 'walk', title: 'Walk', duration: '5 min', status: 'on-time' },
    { id: '2', type: 'bus', title: 'Bus', duration: '15 min', status: 'on-time' },
    { id: '3', type: 'metro', title: 'Metro', duration: '10 min', status: 'on-time' },
  ],
};

describe('useRoute', () => {
  const wrapper = ({ children }) => (
    <RouteProvider>{children}</RouteProvider>
  );

  it('initializes with default route data', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    expect(result.current.currentRoute).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    // Initial progress should be based on segment 0
    const expectedProgress = ((0 + 1) / 3) * 100;
    expect(result.current.progress).toBeCloseTo(expectedProgress);
  });

  it('updates route data when updateRoute is called', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    act(() => {
      result.current.updateRoute(mockRouteData);
    });

    expect(result.current.currentRoute).toEqual(mockRouteData);
    expect(result.current.error).toBeNull();
  });

  it('updates progress when updateProgress is called', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    act(() => {
      result.current.updateProgress(1); // Move to second segment
    });

    expect(result.current.currentSegmentIndex).toBe(1);
    expect(result.current.progress).toBeCloseTo(66.67); // (1+1)/3 * 100
  });

  it('completes segment and moves to next', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    act(() => {
      result.current.completeSegment();
    });

    expect(result.current.currentSegmentIndex).toBe(1);
  });

  it('prevents updating progress beyond last segment', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    // Try to update to non-existent segment
    act(() => {
      result.current.updateProgress(10);
    });

    // Should remain at initial index
    expect(result.current.currentSegmentIndex).toBe(0);
  });

  it('resets progress to beginning', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    // Move to second segment
    act(() => {
      result.current.updateProgress(1);
    });

    expect(result.current.currentSegmentIndex).toBe(1);

    // Reset
    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.currentSegmentIndex).toBe(0);
  });

  it('sets loading state', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('handles errors', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    const errorMessage = 'Test error message';

    act(() => {
      result.current.handleError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
  });

  it('tracks completed segments count', () => {
    const { result } = renderHook(() => useRoute(), { wrapper });

    expect(result.current.completedSegments).toBe(0);

    act(() => {
      result.current.completeSegment();
    });

    expect(result.current.completedSegments).toBe(1);
  });
});
