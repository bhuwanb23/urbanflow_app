import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';

export default function GoalCard({ 
    label, 
    value, 
    progress, 
    subLabel, 
    delay = 0 
}) {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay }}
        >
            <View style={styles.goalCard}>
                <View style={styles.goalRow}>
                    <Text style={styles.goalLabel}>{label}</Text>
                    <Text style={styles.goalValue}>{value}</Text>
                </View>
                <ProgressBar progress={progress} color="#10B981" style={styles.goalProgress} />
                <Text style={styles.goalSubLabel}>{subLabel}</Text>
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    goalCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    goalLabel: {
        color: '#0F172A', // Slate 900
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'Urbanist_700Bold',
    },
    goalValue: {
        color: '#10B981', // Emerald 500
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
    },
    goalProgress: {
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: '#F1F5F9', // Slate 100
    },
    goalSubLabel: {
        color: '#64748B', // Slate 500
        fontSize: 13,
        fontFamily: 'Urbanist_600SemiBold',
    },
});
