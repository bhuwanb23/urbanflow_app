import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
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
            <Card style={styles.goalCard}>
                <View style={styles.goalRow}>
                    <Text style={styles.goalLabel}>{label}</Text>
                    <Text style={styles.goalValue}>{value}</Text>
                </View>
                <ProgressBar progress={progress} color="#10B981" style={styles.goalProgress} />
                <Text style={styles.goalSubLabel}>{subLabel}</Text>
            </Card>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    goalCard: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalLabel: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
    },
    goalValue: {
        color: '#10B981',
        fontWeight: '700',
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
    },
    goalProgress: {
        height: 6,
        borderRadius: 6,
        marginBottom: 4,
        backgroundColor: '#E5E7EB',
    },
    goalSubLabel: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Urbanist_400Regular',
    },
});
