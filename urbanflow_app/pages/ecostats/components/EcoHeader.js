import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function EcoHeader() {
    return (
        <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.headerGradient}
        >
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Your Sustainability Stats</Text>
                    <View style={styles.headerSubtitleRow}>
                        <Text style={{ fontSize: 18, marginRight: 6 }}>🌱</Text>
                        <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Icon name="bell" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingTop: height * 0.04,
        paddingBottom: height * 0.02,
        paddingHorizontal: width * 0.06,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Math.max(20, width * 0.06),
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
        marginBottom: 6,
    },
    headerSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerSubtitle: {
        fontSize: Math.max(12, width * 0.035),
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Urbanist_400Regular',
    },
    settingsButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
