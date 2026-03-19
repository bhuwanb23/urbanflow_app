import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationHeader = ({ 
  navigation, 
  onFilterPress, 
  stats,
  showStats = true,
  activeFilter,
  onFilterSelect
}) => {
  const [showFilterModal, setShowFilterModal] = React.useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleCloseModal = () => {
    setShowFilterModal(false);
  };

  const handleSelectFilter = (filter) => {
    onFilterSelect?.(filter);
    setShowFilterModal(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {/* <Text style={styles.headerSubtitle}>Stay updated with your journey</Text> */}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Icon name="filter-variant" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={handleCloseModal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Notifications</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterOptions}>
              {['all', 'unread', 'important', 'today'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterOption,
                    activeFilter === filter && styles.filterOptionActive
                  ]}
                  onPress={() => handleSelectFilter(filter)}
                  activeOpacity={0.7}
                >
                  <View style={styles.filterOptionLeft}>
                    <Icon 
                      name={
                        filter === 'all' ? 'view-grid' :
                        filter === 'unread' ? 'email-outline' :
                        filter === 'important' ? 'star' : 'calendar-today'
                      }
                      size={20}
                      color={activeFilter === filter ? '#10B981' : '#64748B'}
                    />
                    <Text style={[
                      styles.filterOptionText,
                      activeFilter === filter && styles.filterOptionTextActive
                    ]}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </View>
                  {activeFilter === filter && (
                    <Icon name="check-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* {showStats && stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.unread || 0}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.important || 0}</Text>
            <Text style={styles.statLabel}>Important</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.today || 0}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
  headerRight: {
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#64748B',
  },
  filterOptionTextActive: {
    fontFamily: 'Urbanist_700Bold',
    color: '#10B981',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
});

export default NotificationHeader;
