import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function TripHistoryCard({ item, index = 0 }) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -30 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ 
        type: 'spring',
        damping: 12,
        delay: index * 100 
      }}
      style={[styles.tripCard, {borderColor: '#E5E7EB', backgroundColor: '#fff'}]}
    >
      <View style={styles.tripCardTop}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            damping: 15,
            delay: index * 100 + 50
          }}
        >
          <View style={styles.tripInfo}>
            <View style={styles.routeDisplay}>
              <Text style={styles.tripFrom}>{item.from}</Text>
              <Icon name="arrow-right" size={12} color="#64748b" style={{marginHorizontal: 4}} />
              <Text style={styles.tripTo}>{item.to}</Text>
            </View>
            <Text style={styles.tripDate}>{item.date}</Text>
          </View>
        </MotiView>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            damping: 12,
            delay: index * 100 + 100
          }}
        >
          <View style={[styles.ecoBadge, {backgroundColor: item.ecoBg}]}>
            <Text style={[styles.ecoBadgeText, {color: item.ecoColor}]}>{item.eco} Eco</Text>
          </View>
        </MotiView>
      </View>
      <View style={styles.tripCardBottom}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            damping: 12,
            delay: index * 100 + 150
          }}
        >
          <View style={styles.tripDetails}>
            {item.modes.map((m, i) => (
              <MotiView
                key={i}
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  damping: 15,
                  delay: index * 100 + 200 + (i * 50)
                }}
              >
                <Icon name={m.name} size={15} color={m.color} style={{marginRight: 4}} />
              </MotiView>
            ))}
            <Text style={styles.tripDuration}>{item.duration}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.tripCost}>{item.cost}</Text>
          </View>
        </MotiView>
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring',
            damping: 12,
            delay: index * 100 + 300
          }}
        >
          <TouchableOpacity>
            <Icon name="dots-vertical" size={16} color="#185a9d" />
          </TouchableOpacity>
        </MotiView>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  tripCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  tripCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripInfo: {
    flex: 1,
  },
  routeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tripFrom: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  tripTo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  tripDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Urbanist_400Regular',
  },
  ecoBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_700Bold',
  },
  tripCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDuration: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 2,
    fontFamily: 'Montserrat_700Bold',
  },
  dot: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 4,
  },
  tripCost: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Montserrat_700Bold',
  },
});
