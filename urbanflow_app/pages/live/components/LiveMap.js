import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const mapImg = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df';

export default function LiveMap() {
  const handleLocationPress = () => {
    console.log('Location button pressed');
  };

  return (
    <MotiView 
      from={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ type: 'timing', duration: 700 }}
    >
      <View style={styles.mapWrap}>
        <Image source={{ uri: mapImg }} style={styles.mapImg} />
        <View style={styles.mapOverlay} />
        
        {/* Location Button */}
        <TouchableOpacity style={styles.mapBtn} onPress={handleLocationPress}>
          <Icon name="crosshairs-gps" size={22} color="#6366f1" />
        </TouchableOpacity>
        
        {/* Update Time */}
        <View style={styles.mapUpdated}>
          <Text style={styles.mapUpdatedText}>Updated 2 mins ago</Text>
        </View>
        
        {/* Live Indicator */}
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  mapWrap: { 
    width: '100%', 
    height: Math.max(180, height * 0.22), 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginBottom: 16, 
    position: 'relative', 
    backgroundColor: '#fff', 
    shadowColor: '#6366f1', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 3 
  },
  mapImg: { 
    width: '100%', 
    height: '100%' 
  },
  mapOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.10)' 
  },
  mapBtn: { 
    position: 'absolute', 
    bottom: Math.max(12, height * 0.015), 
    right: Math.max(12, width * 0.03), 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: Math.max(8, width * 0.02), 
    shadowColor: '#6366f1', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 4 
  },
  mapUpdated: { 
    position: 'absolute', 
    top: Math.max(12, height * 0.015), 
    right: Math.max(12, width * 0.03), 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: Math.max(10, width * 0.025), 
    paddingVertical: Math.max(3, height * 0.004), 
    shadowColor: '#6366f1', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 4, 
    elevation: 2 
  },
  mapUpdatedText: { 
    color: '#6366f1', 
    fontSize: Math.max(11, width * 0.028), 
    fontWeight: '700', 
    fontFamily: 'Poppins_700Bold' 
  },
  liveIndicator: {
    position: 'absolute',
    top: Math.max(12, height * 0.015),
    left: Math.max(12, width * 0.03),
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 10,
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(3, height * 0.004),
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: Math.max(5, width * 0.012),
    height: Math.max(5, width * 0.012),
    borderRadius: Math.max(2.5, width * 0.006),
    backgroundColor: '#fff',
    marginRight: Math.max(4, width * 0.01),
  },
  liveText: {
    color: '#fff',
    fontSize: Math.max(10, width * 0.025),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
});
