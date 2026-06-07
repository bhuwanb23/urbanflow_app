import React from 'react';
import { View, StyleSheet } from 'react-native';
import SegmentItem from './SegmentItem';
import MapPreview from './MapPreview';


/**
 * SegmentList Component
 * Renders all journey segments with optional map preview
 */
export default function SegmentList({ segments, showConnectors: _showConnectors = true }) {
  if (!segments || segments.length === 0) {
    return null;
  }

  const renderSegments = () => {
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      
      return (
        <React.Fragment key={segment.id}>
          <SegmentItem 
            segment={segment} 
            isLast={isLast}
          />
          
          {/* Insert map preview after bus segment (index 1) if available */}
          {index === 1 && segments.length > 2 && (
            <MapPreview />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <View style={styles.container}>
      {renderSegments()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
