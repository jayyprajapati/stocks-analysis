<template>
    <div>
        Stock Analysis for {{ symbol }}
    </div>
    <div v-if="timeSeries">
        <CandleStick :timeSeriesData="timeSeries"/>
    </div>

    <div v-if="dailyRsiData">
        <LineChart :rsiData="dailyRsiData" :chartInterval="'Daily'"/>
    </div>
    <div v-if="weeklyRsiData">
        <LineChart :rsiData="weeklyRsiData" :chartInterval="'weekly'"/>
    </div>
    <div v-if="monthlyRsiData">
        <LineChart :rsiData="monthlyRsiData" :chartInterval="'monthly'"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CandleStick from '@/components/CandleStick.vue';
import LineChart from '@/components/LineChart.vue';

export default {
    name: "StockAnalysis",
    // data() {
    //     return {

    //     }
    // },
    components: {
        CandleStick,
        LineChart
    },
    computed: {
        ...mapGetters(['symbol', 'timeSeries', 'dailyRsiData', 'weeklyRsiData', 'monthlyRsiData'])
    },
    mounted() {
        const query = this.symbol ? this.symbol : this.$route.query.symbol;
        
        if(query) {
            // this.symbol = query;
            // if(!this.timeSeries || this.timeSeries.error) {
                this.$store.dispatch('FetchTimeSeries', `${query}.BSE`);
            // }
            const payload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`
            }
            this.$store.dispatch('FetchRSIData', {...payload, interval: "daily"})
            this.$store.dispatch('FetchRSIData', {...payload, interval: "monthly"})
            this.$store.dispatch('FetchRSIData', {...payload, interval: "weekly"})
            

        } else {
            this.$router.push({name: 'home'});
        }
    }
}
</script>