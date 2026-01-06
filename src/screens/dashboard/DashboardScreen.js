import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Components
import StatCard from '../../components/dashboard/StatCard';
import LineChart from '../../components/dashboard/LineChart';
import BarChart from '../../components/dashboard/BarChart';
import TopSitesList from '../../components/dashboard/TopSitesList';
import FilterBar from '../../components/dashboard/FilterBar';
import LoadingStats from '../../components/dashboard/LoadingStats';

// Services & Utils
import { dashboardService } from '../../services/dashboard/dashboardService';
import { getPeriodDates, formatDateForDisplay } from '../../utils/dateHelpers';
import { formatChartData } from '../../utils/chartHelpers';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [period, setPeriod] = useState('month');
    const [errorData, setErrorData] = useState(null);

    // Data State
    const [globalStats, setGlobalStats] = useState(null);
    const [topSites, setTopSites] = useState([]);
    const [typeStats, setTypeStats] = useState([]);
    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });

    const loadDashboardData = useCallback(async (selectedPeriod = period) => {
        try {
            console.log('='.repeat(50));
            console.log('🚀 DASHBOARD: Starting data load');
            console.log('='.repeat(50));

            setErrorData(null);

            const { start, end } = getPeriodDates(selectedPeriod);
            console.log(`📅 Period: ${selectedPeriod} (${start.toISOString()} - ${end.toISOString()})`);

            // Execute all requests in parallel
            console.log('📞 Calling dashboardService methods...');
            const [stats, sites, types, history] = await Promise.all([
                dashboardService.fetchGlobalStats(start, end),
                dashboardService.fetchTopSites(start, end, 5),
                dashboardService.fetchTypeStats(start, end),
                dashboardService.fetchMonthlyData(6) // Always show last 6 months trend
            ]);

            console.log('📦 Data received from service:', {
                stats: stats ? 'OK' : 'NULL',
                avgDuration: stats?.avgDuration,
                sitesCount: sites?.length,
                typesCount: types?.length,
                historyCount: history?.length
            });

            if (!stats && !sites.length && !types.length) {
                console.warn('⚠️ No data received from any service call');
                setErrorData('Aucune donnée reçue du serveur');
                // No return here, as we might have partial data
            }

            setGlobalStats(stats);
            setTopSites(sites);

            // Format type stats for BarChart
            const formattedTypes = types.map((t, i) => ({
                label: t.intervention_type.replace('_', ' '),
                value: parseInt(t.total_interventions),
                // Generate colors or use a palette
                color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
            }));
            setTypeStats(formattedTypes);

            // Format monthly data for LineChart
            // history is [{ month: '2023-01...', count: 10 }]
            const chartData = {
                labels: history.map(h => format(new Date(h.month), 'MMM', { locale: fr })),
                datasets: [{
                    data: history.map(h => parseInt(h.count))
                }]
            };
            setMonthlyData(chartData);

            console.log('✅ Dashboard state updated successfully');

        } catch (error) {
            console.error('='.repeat(50));
            console.error('❌ DASHBOARD ERROR:', error);
            console.error('Error message:', error.message);
            console.error('='.repeat(50));
            Alert.alert('Erreur', 'Impossible de charger les données du tableau de bord');
            setErrorData(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [period]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, [loadDashboardData]);

    const handlePeriodChange = (newPeriod) => {
        setLoading(true);
        setPeriod(newPeriod);
    };

    const formatDuration = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0 min';
        const absMinutes = Math.abs(Math.round(minutes)); // Handle negative values (bad data)

        if (absMinutes < 60) return `${absMinutes} min`;

        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;

        // Pad minutes with leading zero if needed (e.g. 1h05)
        const minsStr = mins < 10 ? `0${mins}` : mins;
        return `${hours} h ${minsStr}`;
    };

    const handleSitePress = (site) => {
        navigation.navigate('SiteDetailsScreen', {
            siteId: site.site_id,
            siteName: site.site_name
        });
    };

    if (loading && !refreshing && !globalStats) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tableau de Bord</Text>
                    <Text style={styles.headerDate}>{formatDateForDisplay(new Date())}</Text>
                </View>
                <LoadingStats />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.mainContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                }
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Tableau de Bord</Text>
                        <Text style={styles.headerDate}>{formatDateForDisplay(new Date())}</Text>
                    </View>
                    <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                        <Text style={styles.refreshBtnText}>Actualiser</Text>
                    </TouchableOpacity>
                </View>

                {errorData && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Erreur: {errorData}</Text>
                        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                            <Text style={styles.retryText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Filter Section */}
                <FilterBar selectedPeriod={period} onPeriodChange={handlePeriodChange} />

                {/* Key Metrics Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statsRow}>
                        <StatCard
                            title="Interventions"
                            value={globalStats?.totalInterventions || 0}
                            icon="wrench"
                            color="#4F46E5"
                            subtitle="Total sur la période"
                        />
                        <StatCard
                            title="Sites Actifs"
                            value={globalStats?.activeSites || 0}
                            icon="domain"
                            color="#10B981"
                        />
                    </View>
                    <View style={styles.statsRow}>
                        <StatCard
                            title="Durée Moyenne"
                            value={formatDuration(globalStats?.avgDuration || 0)}
                            icon="clock-outline"
                            color="#F59E0B"
                            subtitle="Par intervention"
                        />
                        <StatCard
                            title="Taux Complétion"
                            value={`${globalStats?.completionRate || 0}%`}
                            icon="check-circle-outline"
                            color="#EF4444"
                            trend={globalStats?.completionRate > 80 ? 5 : -2} // Mock trend for demo
                        />
                    </View>
                </View>

                {/* Monthly Trend Chart */}
                <LineChart
                    data={monthlyData}
                    title="Évolution des 6 derniers mois"
                />

                {/* Top Sites */}
                <TopSitesList
                    sites={topSites}
                    onSitePress={handleSitePress}
                />

                {/* Intervention Types Distribution */}
                <BarChart
                    data={typeStats}
                    title="Distribution par Type (Top 5)"
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Données mises à jour en temps réel</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Set background to match header to blend status bar
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    refreshBtn: {
        padding: 8,
    },
    refreshBtnText: {
        color: '#4F46E5',
        fontWeight: '600'
    },
    errorContainer: {
        margin: 16,
        padding: 12,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#B91C1C',
        flex: 1,
        fontSize: 12,
    },
    retryButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsGrid: {
        padding: 16,
        paddingBottom: 0,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 12, // StatCard should probably have its own margin but let's check
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 12
    }
});

export default DashboardScreen;
