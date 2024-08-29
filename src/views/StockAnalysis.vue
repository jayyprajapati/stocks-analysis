<template>
    <div class="container">
        <div v-if="stockInfo.error || companyDetails.error">
            Oops...something went wrong!!
        </div>
        <div class="company-details-wrapper" v-else>
            <div class="company-title-wrapper">
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <div class="title">{{ stockInfo[0].name }}</div>
                    <i class="fa-solid fa-arrow-right visit-site-link"></i>
                </div>
                <div class="d-flex justify-content-start gap-1 align-items-center symbol">
                    <div>{{ stockInfo[0].symbol }}</div> &#x2022;
                    <div>{{ stockInfo[0].exchange }}</div> &#x2022;
                    <div>{{ stockInfo[0].country }}</div>
                </div>
                <div class="industry mt-3">
                    {{ companyDetails.industry }}
                </div>
                
            </div>
            <!-- <div class="title">{{ stockInfo[0].name }}</div>
            <div class="symbol">{{ stockInfo[0].symbol }}</div>
            <div class="symbol">{{ stockInfo[0].country }}</div>
            <div class="symbol">{{ stockInfo[0].exchange }}</div>
            <div class="symbol">{{ companyDetails.description }}</div>
            <div class="symbol">{{ companyDetails.industry }}</div>
            <div class="symbol" v-for="peer of companyDetails.peers" :key="peer">{{ peer }}</div>
            <a :href="companyDetails.site_url" class="symbol">Visit Site</a> -->
        </div>

        <div class="chart-options d-flex justify-content-center align-items-center gap-4">
            <div class="option" :class="{'active': activeTimeSeriesChart == 'Candlestick'}" @click="toggleChartView">Candlestick</div>
            <div class="option" :class="{'active': activeTimeSeriesChart == 'Line'}" @click="toggleChartView">Line</div>
        </div>
        <div v-if="timeSeries && activeTimeSeriesChart == 'Candlestick'" class="w-100">
                <CandleStick :timeSeriesData="timeSeries" />
            </div>
            <div v-if="timeSeries && activeTimeSeriesChart== 'Line'" class="w-100">
                <StockLineChart :timeSeriesData="timeSeries" />
            </div>



        <div class="d-flex justify-content-between align-items-center gap-3">
            <div v-if="dailyRsiData" class="w-100">
                <LineChart :rsiData="dailyRsiData" :chartInterval="'Daily'" />
            </div>
            <div v-if="weeklyRsiData" class="w-100">
                <LineChart :rsiData="weeklyRsiData" :chartInterval="'weekly'" />
            </div>
            <div v-if="monthlyRsiData" class="w-100">
                <LineChart :rsiData="monthlyRsiData" :chartInterval="'monthly'" />
            </div>
        </div>


    </div>

</template>

<script>
import { mapGetters } from 'vuex';
import CandleStick from '@/components/CandleStick.vue';
import LineChart from '@/components/LineChart.vue';
import StockLineChart from '@/components/StockLineChart.vue';

export default {
    name: "StockAnalysis",
    data() {
        return {
            activeTimeSeriesChart: 'Candlestick'
        }
    },
    components: {
        CandleStick,
        LineChart,
        StockLineChart
    },
    computed: {
        ...mapGetters(['stockInfo', 'companyDetails', 'symbol', 'timeSeries', 'dailyRsiData', 'weeklyRsiData', 'monthlyRsiData']),
    },
    methods: {
        toggleChartView() {
            if(this.activeTimeSeriesChart == 'Candlestick') {
                this.activeTimeSeriesChart = 'Line'
            } else {
                this.activeTimeSeriesChart = 'Candlestick'
            }
        }
    },
    mounted() {
        const query = this.symbol ? this.symbol : this.$route.query.symbol;

        if (query) {
            // this.symbol = query;
            // if(!this.timeSeries || this.timeSeries.error) {
            this.$store.dispatch('FetchCompanyDetails', query);
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

.company-title-wrapper {
    background: #fff;
    border-radius: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 20px;
    width: fit-content;
    text-align: left;
    
    .title {
        font-size: 20px;
        color: #26547c;
        font-weight: 800;
    }

    .symbol {
        font-size: 14px;
        color: #a5a5a5;
        font-weight: 600;
    }

    .industry {
        padding: 10px;
        border: 3px solid #a5a5a5;
        border-radius: 100px;
    }
}

.visit-site-link {
    color: #a5a5a5;
    rotate: -45deg;
    font-size: 24px;
    cursor: pointer;

    &:hover {
        color: #ef476f;
    }
}
// .company-details-wrapper {
//     width: 100%;
//     padding: 20px;
//     background: #F5F7F8;
//     border-radius: 20px;
//     box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
//     text-align: left;

//     .title {
//         font-size: 24px;
//         font-weight: 600;
//         color: #0C359E;
//     }

//     .symbol {
//         font-size: 14px;
//         font-weight: 500;
//         color: #00BDAA;

//     }
// }

.chart-options {
    padding: 10px;
}

.option {
    font-size: 16px;
    cursor: pointer;
}
// ef476f
// ffd166
// 06d6a0
// fffcf9
.active {
    color: #00BDAA;
}
</style>