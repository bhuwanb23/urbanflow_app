import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';

const popularRoutes = [
  { 
    from: 'Home', 
    fromIcon: 'home', 
    fromColor: '#6366f1', 
    to: 'Work', 
    toIcon: 'briefcase', 
    toColor: '#10b981', 
    time: '32 min', 
    progress: 0.65, 
    usual: '25 min', 
    status: 'Moderate traffic', 
    statusColor: '#facc15', 
    barColor: '#facc15' 
  },
  { 
    from: 'Home', 
    fromIcon: 'home', 
    fromColor: '#6366f1', 
    to: 'School', 
    toIcon: 'school', 
    toColor: '#10b981', 
    time: '15 min', 
    progress: 0.2, 
    usual: '18 min', 
    status: 'Light traffic', 
    statusColor: '#22c55e', 
    barColor: '#22c55e' 
  },
  { 
    from: 'Work', 
    fromIcon: 'briefcase', 
    fromColor: '#10b981', 
    to: 'Restaurant', 
    toIcon: 'silverware-fork-knife', 
    toColor: '#f59e42', 
    time: '48 min', 
    progress: 0.85, 
    usual: '30 min', 
    status: 'Heavy traffic', 
    statusColor: '#ef4444', 
    barColor: '#ef4444' 
  },
];

export default function PopularRoutes() {
  const handleRoutePress = (route) => {
    console.log('Route pressed:', route.from, 'to', route.to);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Routes</Text>
      {popularRoutes.map((r, i) => (
        <MotiView 
          key={i} 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', delay: 600 + i * 100 }}
        >
          <TouchableOpacity 
            style={styles.popularCard} 
            onPress={() => handleRoutePress(r)}
            activeOpacity={0.7}
          >
            <View style={styles.popularHeader}>
              <View style={styles.popularRouteRow}>
                <View style={styles.routePoint}>
                  <Icon name={r.fromIcon} size={20} color={r.fromColor} />
                  <Text style={[styles.popularRouteText, { color: r.fromColor }]}>
                    {r.from}
                  </Text>
                </View>
                <Text style={styles.popularArrow}>→</Text>
                <View style={styles.routePoint}>
                  <Icon name={r.toIcon} size={20} color={r.toColor} />
                  <Text style={[styles.popularRouteText, { color: r.toColor }]}>
                    {r.to}
                  </Text>
                </View>
              </View>
              <Text style={styles.popularTime}>{r.time}</Text>
            </View>
            
            <ProgressBar 
              progress={r.progress} 
              color={r.barColor} 
              style={styles.popularBar} 
            />
            
            <View style={styles.popularMetaRow}>
              <Text style={styles.popularUsual}>Usual: {r.usual}</Text>
              <View style={styles.statusContainer}>
                <Text style={[styles.popularStatus, { color: r.statusColor }]}>
                  {r.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: 0.2 
  },
  popularCard: { 
    borderRadius: 18, 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 10, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  popularHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  popularRouteRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1 
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4
  },
  popularRouteText: { 
    fontSize: 15, 
    fontWeight: '700', 
    fontFamily: 'Poppins_700Bold', 
    marginLeft: 6 
  },
  popularArrow: { 
    color: '#9ca3af', 
    fontSize: 17, 
    marginHorizontal: 8 
  },
  popularTime: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold' 
  },
  popularBar: { 
    height: 8, 
    borderRadius: 4, 
    marginVertical: 8, 
    backgroundColor: '#f3f4f6' 
  },
  popularMetaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: 4 
  },
  popularUsual: { 
    fontSize: 13, 
    color: '#9ca3af', 
    fontFamily: 'Urbanist_400Regular' 
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  popularStatus: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold' 
  },
});
