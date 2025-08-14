import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

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
    height: 200, 
    borderRadius: 22, 
    overflow: 'hidden', 
    marginBottom: 18, 
    position: 'relative', 
    backgroundColor: '#fff', 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 10, 
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
    bottom: 16, 
    right: 16, 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 10, 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 8, 
    elevation: 4 
  },
  mapUpdated: { 
    position: 'absolute', 
    top: 16, 
    right: 16, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 6, 
    elevation: 2 
  },
  mapUpdatedText: { 
    color: '#6366f1', 
    fontSize: 13, 
    fontWeight: '700', 
    fontFamily: 'Poppins_700Bold' 
  },
  liveIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
});
