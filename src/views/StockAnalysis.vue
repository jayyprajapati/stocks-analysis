<template>
    <div class="container">
        <div v-if="stockInfo.error">
                Oops...something went wrong!!
            </div>
        <div class="symbol-desc" v-else>
            <div class="title">{{ stockInfo[0].name }}</div>
            <div class="symbol">{{ stockInfo[0].symbol }}</div>
            <div class="symbol">{{ stockInfo[0].country }}</div>
            <div class="symbol">{{ stockInfo[0].exchange }}</div>
        </div>


        <div v-if="timeSeries">
            <CandleStick :timeSeriesData="timeSeries" />
        </div>

        <div v-if="dailyRsiData">
            <LineChart :rsiData="dailyRsiData" :chartInterval="'Daily'" />
        </div>
        <div v-if="weeklyRsiData">
            <LineChart :rsiData="weeklyRsiData" :chartInterval="'weekly'" />
        </div>
        <div v-if="monthlyRsiData">
            <LineChart :rsiData="monthlyRsiData" :chartInterval="'monthly'" />
        </div>
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
        ...mapGetters(['stockInfo', 'symbol', 'timeSeries', 'dailyRsiData', 'weeklyRsiData', 'monthlyRsiData']),
    },
    mounted() {
        const query = this.symbol ? this.symbol : this.$route.query.symbol;

        if (query) {
            // this.symbol = query;
            // if(!this.timeSeries || this.timeSeries.error) {
            this.$store.dispatch('FetchTimeSeries', `${query}.BSE`);
            // }
            const payload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`
            }
            this.$store.dispatch('FetchRSIData', { ...payload, interval: "daily" })
            this.$store.dispatch('FetchRSIData', { ...payload, interval: "monthly" })
            this.$store.dispatch('FetchRSIData', { ...payload, interval: "weekly" })


        } else {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style scoped lang="scss">

.symbol-desc {
    width: 100%;
    padding: 20px;
    background: #F5F7F8;
    border-radius: 20px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    text-align: left;
    .title {
        font-size: 24px;
        font-weight: 600;
        color: #0C359E;
    }

    .symbol {
        font-size: 14px;
        font-weight: 500;
        color: #00BDAA;

    }
}
</style>