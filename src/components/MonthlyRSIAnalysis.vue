<template>
    <div>
        Monthly RSI Analysis
        <canvas id="monthlyRsiChart"></canvas>
    </div>
</template>

<script>
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
// import rsiData from '@/assets/json/rsiData.json';
import { mapGetters } from 'vuex';

Chart.register(annotationPlugin);


export default {
    name: "MonthlyRSIAnalysis",
    mounted() {
        this.fetchData();
    },
    watch: {
        monthlyRsiData: [{
            handler: 'createChart',
            deep: true
        }]
    },
    computed: {
        ...mapGetters(["symbol", "monthlyRsiData"])
    },
    methods: {
        fetchData() {
            const payload = {
                interval: "monthly",
                seriesType: "open",
                timePeriod: 10
            };

            this.$store.dispatch('fetchRSI', payload)
        },
        createChart() {
            const ctx = document.getElementById("monthlyRsiChart").getContext("2d");

            // Extract dates and RSI values
            const labels = Object.keys(this.monthlyRsiData["Technical Analysis: RSI"]).slice(0, 100);
            const dataPoints = labels.map(
                (date) => parseFloat(this.monthlyRsiData["Technical Analysis: RSI"][date]["RSI"])
            ).slice(0, 100);

            const data = {
                labels: labels.reverse(),
                datasets: [
                    {
                        label: "RSI",
                        data: dataPoints.reverse(),
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        fill: false,
                        tension: 0.1,
                        showLine: true
                    },
                ],
            };

            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                        },
                    },
                },
                plugins: {
                    annotation: {
                        annotations: {
                            box1: {
                                type: 'box',
                                yMin: 40,
                                yMax: 60,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 0
                            },
                        },
                    },
                },
            };

            new Chart(ctx, {
                type: "line",
                data,
                options,
            });
        },
    }
}

</script>