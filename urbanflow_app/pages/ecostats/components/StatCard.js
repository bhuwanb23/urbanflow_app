import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function StatCard({ 
    icon, 
    iconBgColor, 
    iconColor, 
    label, 
    value, 
    change, 
    changeColor = "#10B981",
    delay = 0,
    style = {} 
}) {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay }}
            style={style}
        >
            <View style={styles.statCard}>
                <View style={styles.cardIconRow}>
                    <View style={[styles.iconBg, { backgroundColor: iconBgColor }]}>
                        <Icon name={icon} size={20} color={iconColor} />
                    </View>
                </View>
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardValue}>{value}</Text>
                {change && (
                    <View style={styles.cardChangeRow}>
                        <Icon name="arrow-up" size={12} color={changeColor} style={{ marginRight: 2 }} />
                        <Text style={[styles.cardChangeText, { color: changeColor }]}>{change}</Text>
                    </View>
                )}
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        color: '#64748B', // Slate 500
        fontSize: 13,
        marginBottom: 4,
        fontFamily: 'Urbanist_600SemiBold',
    },
    cardValue: {
        color: '#0F172A', // Slate 900
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    cardChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    cardChangeText: {
        fontSize: 12,
        fontFamily: 'Urbanist_600SemiBold',
    },
});
