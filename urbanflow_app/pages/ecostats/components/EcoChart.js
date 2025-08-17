import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { MotiView } from 'moti';

const ecoData = [2.1, 1.8, 2.5, 1.9, 2.3, 2.8, 1.8];
const ecoLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const screenWidth = Dimensions.get('window').width;

export default function EcoChart() {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay: 400 }}
        >
            <Card style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Weekly Eco Impact</Text>
                <BarChart
                    data={{
                        labels: ecoLabels,
                        datasets: [
                            { data: ecoData }
                        ]
                    }}
                    width={screenWidth - 48}
                    height={160}
                    fromZero
                    showValuesOnTopOfBars
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        fillShadowGradient: '#10B981',
                        fillShadowGradientOpacity: 1,
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                        labelColor: (opacity = 1) => `#6B7280`,
                        barPercentage: 0.6,
                        propsForBackgroundLines: {
                            stroke: '#F3F4F6',
                        },
                        propsForLabels: {
                            fontSize: 11,
                        },
                    }}
                    style={{ marginVertical: 8, borderRadius: 8 }}
                    yAxisSuffix=""
                    yLabelsOffset={8}
                    withInnerLines={true}
                    withHorizontalLabels={true}
                />
            </Card>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    chartCard: {
        borderRadius: 18,
        padding: 14,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        fontFamily: 'Montserrat_700Bold',
    },
});
