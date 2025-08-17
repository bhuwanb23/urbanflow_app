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
            <Card style={[styles.statCard, styles.statCardShadow]}>
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
            </Card>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 18,
        padding: 14,
        marginRight: 0,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    statCardShadow: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#6366f1',
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    iconBg: {
        padding: 6,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        color: '#6B7280',
        fontSize: 11,
        marginBottom: 2,
        fontFamily: 'Urbanist_400Regular',
    },
    cardValue: {
        color: '#111827',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    cardChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    cardChangeText: {
        fontSize: 11,
        fontFamily: 'Urbanist_400Regular',
    },
});
