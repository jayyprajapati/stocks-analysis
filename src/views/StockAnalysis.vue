<template>
    <div class="container mb-4">
        <div v-if="stockInfo.error || companyDetails.error">
            Oops...something went wrong!!
        </div>
        <div class="company-details-wrapper" v-else>
            <div class="d-flex justify-content-start gap-3 w-100">
                <div class="company-title-wrapper name">
                    <div class="d-flex justify-content-start align-items-center gap-3">
                        <div class="title">{{ stockInfo[0].name }}</div>
                        <i class="fa-solid fa-arrow-right visit-site-link"></i>
                    </div>
                    <div class="divider"></div>
                    <div class="d-flex justify-content-start gap-1 align-items-center symbol">
                        <div>{{ stockInfo[0].symbol }}</div> &#x2022;
                        <div>{{ stockInfo[0].exchange }}</div> &#x2022;
                        <div>{{ stockInfo[0].country }}</div>
                    </div>
                    <div class="industry mt-3">
                        {{ companyDetails.industry }}
                    </div>

                </div>

                <div class="company-title-wrapper name">
                    <div class="d-flex justify-content-start align-items-center gap-3 success">
                        <div class="title success">{{latestStockPrice[0]}}</div>
                        <i class="fa-solid fa-square-caret-up"></i>
                        <!-- <i class="fa-solid fa-arrow-right visit-site-link"></i> -->
                    </div>
                    <div class="divider"></div>
                    <div class="d-flex justify-content-between gap-1 align-items-start symbol">
                        <div>
                            <div>Last updated on </div>
                            <div class="mt-2">11:10AM, 30 Aug 2024</div>
                        </div>

                        <i class="fa-solid fa-arrows-rotate pointer cursor-pointer"></i>
                    </div>
                    <!-- <div class="industry mt-3">
                    {{ companyDetails.industry }}
                </div> -->

                </div>
            </div>

            <div class="company-title-wrapper desc">
                <div class="symbol">
                    {{ companyDetails.description }}
                </div>

                <div class="divider"></div>

                Peers:
                <div class="d-flex justify-content-start align-item-center gap-2">
                    <div class="industry mt-3" v-for="peer of companyDetails.peers" :key="peer">
                        {{ peer }}
                    </div>
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

        <div class="timeseries-wrapper">
            <div class="d-flex justify-content-between align-items-center">
                <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                    <div class="option" :class="{ 'active': activeTimeSeriesChart == 'Candlestick' }"
                        @click="toggleChartView">Candlestick</div>
                    <div class="option" :class="{ 'active': activeTimeSeriesChart == 'Line' }" @click="toggleChartView">
                        Line
                    </div>
                </div>
                <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                    <div class="option">Interval: </div>
                    <div class="option" :class="{ 'active': timeSeriesInterval == 'Daily' }"
                        @click="toggleTimeSeriesInterval('Daily')">Daily</div>
                    <div class="option" :class="{ 'active': timeSeriesInterval == 'Weekly' }"
                        @click="toggleTimeSeriesInterval('Weekly')">
                        Weekly </div>
                    <div class="option" :class="{ 'active': timeSeriesInterval == 'Monthly' }"
                        @click="toggleTimeSeriesInterval('Monthly')">
                        Monthly </div>
                </div>
            </div>

            <div>
                <div v-if="timeSeriesLoading || Object.keys(localTimeSeriesData).length == 0">
                    <loader />
                </div>
                <div v-else>
                    <div v-if="localTimeSeriesData?.error">
                        OOPS...SOMETHING WENT WRONG
                    </div>
                    <div v-else>
                        <div v-if="localTimeSeriesData.values && activeTimeSeriesChart == 'Candlestick'" class="w-100">
                            <CandleStick :timeSeriesData="localTimeSeriesData" :interval="timeSeriesInterval"
                                :key="timeSeriesInterval" />
                        </div>
                        <div v-if="localTimeSeriesData.values && activeTimeSeriesChart == 'Line'" class="w-100">
                            <StockLineChart :timeSeriesData="localTimeSeriesData" />
                        </div>
                    </div>

                </div>
            </div>


        </div>

        <!-- Technical Analysis -->
        <div class="d-flex justify-content-between gap-3 align-items-center">
            <!-- RSI Chart -->
            <div class="rsi-wrapper w-100">
                <div class="title">
                    Relative Strength Index (RSI)
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                        <div class="option" :class="{ 'active': rsiInterval == 'Daily' }"
                            @click="toggleRsiInterval('Daily')">
                            Daily</div>
                        <div class="option" :class="{ 'active': rsiInterval == 'Weekly' }"
                            @click="toggleRsiInterval('Weekly')">
                            Weekly
                        </div>
                        <div class="option" :class="{ 'active': rsiInterval == 'Monthly' }"
                            @click="toggleRsiInterval('Monthly')">Monthly
                        </div>

                    </div>
                </div>

                <div class="mt-3 d-flex justify-content-between gap-4 align-items-center rsi-details">
                    <div class="d-flex gap-3">
                        <div>Time Period: 14 <i class="ms-1 fa-solid fa-lock"></i></div>
                        <div>Series Type: Open <i class="ms-1 fa-solid fa-lock"></i></div>
                    </div>

                    <!-- <div class="status"
                        :class="latestRsiValue > 60 ? 'success' : latestRsiValue < 40 ? 'danger' : 'warning'">
                        <i class="fa-solid ms-1 fa-circle-check" v-if="latestRsiValue > 60"></i>
                        <i class="fa-solid ms-1 fa-circle-xmark" v-else-if="latestRsiValue < 40"></i>
                        <i class="fa-solid ms-1 fa-circle-exclamation" v-else></i>
                        {{ RSIStatus }}
                    </div> -->
                </div>

                <div>
                    <div v-if="RSILoading || Object.keys(localRSIData).length == 0">
                        <loader />
                    </div>
                    <div v-else>
                        <div v-if="localRSIData?.error">
                            OOPS...SOMETHING WENT WRONG
                        </div>
                        <div v-else>
                            <div v-if="localRSIData.values" class="w-100">
                                <LineChart :rsiData="localRSIData" :chartInterval="rsiInterval" :key="rsiInterval" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div v-if="weeklyRsiData && rsiInterval == 'Weekly'" class="w-100">
                    <LineChart :rsiData="weeklyRsiData" :chartInterval="'Weekly'" />
                </div>
                <div v-if="monthlyRsiData && rsiInterval == 'Monthly'" class="w-100">
                    <LineChart :rsiData="monthlyRsiData" :chartInterval="'Monthly'" />
                </div> -->
            </div>


            <!-- SMA Chart -->
            <div class="rsi-wrapper w-100">
                <div class="title">
                    Simple Moving Average (SMA)
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                        <div class="option" :class="{ 'active': smaInterval == 'Daily' }"
                            @click="toggleSmaInterval('Daily')">
                            Daily</div>
                        <div class="option" :class="{ 'active': smaInterval == 'Weekly' }"
                            @click="toggleSmaInterval('Weekly')">
                            Weekly
                        </div>
                        <div class="option" :class="{ 'active': smaInterval == 'Monthly' }"
                            @click="toggleSmaInterval('Monthly')">Monthly
                        </div>

                    </div>
                </div>

                <div class="mt-3 d-flex justify-content-between gap-4 align-items-center rsi-details">
                    <div class="d-flex gap-3">
                        <div>Time Period: 20 <i class="ms-1 fa-solid fa-lock"></i></div>
                        <div>Series Type: Open <i class="ms-1 fa-solid fa-lock"></i></div>
                    </div>

                    <!-- <div class="status"
                        :class="latestRsiValue > 60 ? 'success' : latestRsiValue < 40 ? 'danger' : 'warning'">
                        <i class="fa-solid ms-1 fa-circle-check" v-if="latestRsiValue > 60"></i>
                        <i class="fa-solid ms-1 fa-circle-xmark" v-else-if="latestRsiValue < 40"></i>
                        <i class="fa-solid ms-1 fa-circle-exclamation" v-else></i>
                        {{ RSIStatus }}
                    </div> -->
                </div>

                <div>
                    <div v-if="SMALoading" class="d-flex justify-content-center align-items-center w-100">
                        <loader />
                    </div>
                    <div v-else>
                        <div v-if="localSMAData?.error">
                            OOPS...SOMETHING WENT WRONG
                        </div>
                        <div v-else>
                            <div v-if="localSMAData.values" class="w-100">
                                <SMALineChart :smaData="localSMAData" :chartInterval="smaInterval"
                                    :timeSeriesData="timeSeries[smaInterval]" :key="smaInterval" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex';
import CandleStick from '@/components/CandleStick.vue';
import LineChart from '@/components/LineChart.vue';
import StockLineChart from '@/components/StockLineChart.vue';
import SMALineChart from '@/components/SMALineChart.vue';
import Loader from '@/components/Loader.vue';

export default {
    name: "StockAnalysis",
    data() {
        return {
            activeTimeSeriesChart: 'Candlestick',
            timeSeriesInterval: 'Daily',
            rsiInterval: "Daily",
            smaInterval: 'Daily'
        }
    },
    components: {
        CandleStick,
        LineChart,
        StockLineChart,
        SMALineChart,
        Loader
    },
    computed: {
        ...mapGetters(['stockInfo', 'companyDetails', 'timeSeries', 'RSILoading', 'symbol', 'dailyTimeSeries', 'weeklyTimeSeries', 'monthlyTimeSeries', 'dailyRsiData', 'weeklyRsiData', 'monthlyRsiData', 'dailySmaData', 'weeklySmaData', 'monthlySmaData', 'SMALoading', 'timeSeriesLoading', 'rsiData', 'smaData']),
        localTimeSeriesData() {
            return this.timeSeries[this.timeSeriesInterval];
        },
        localRSIData() {
            return this.rsiData[this.rsiInterval];
        },
        localSMAData() {
            return this.smaData[this.smaInterval]
        },
        latestStockPrice() {
            if(Object.keys(this.timeSeries['Daily']).length > 0 && !this.timeSeries['Daily']['error'])
                return [this.timeSeries['Daily']['values'][0].close, this.timeSeries['Daily']['values'][1].close]
            else return ['Error']
        }
        // latestRsiValue() {
        //     if (this.rsiInterval == 'Daily' && this.dailyRsiData) {
        //         return this.dailyRsiData.values[0].rsi
        //     }

        //     if (this.rsiInterval == 'Weekly' && this.weeklyRsiData) {
        //         return this.weeklyRsiData.values[0].rsi
        //     }

        //     if (this.rsiInterval == 'Monthly' && this.monthlyRsiData) {
        //         return this.monthlyRsiData.values[0].rsi
        //     }

        //     return 0
        // },
        // RSIStatus() {
        //     if (this.latestRsiValue == 0) {
        //         return 'error'
        //     } else {
        //         if (this.latestRsiValue > 60) {
        //             return 'Consider'
        //         } else if (this.latestRsiValue < 40) {
        //             return 'Avoid'
        //         } else {
        //             return 'Wait'
        //         }
        //     }
        // },
    },
    // watch: {
    //     timeSeries: [{
    //         handler: 'updateTimeSeriesData',
    //         deep: true
    //     }]
    // },
    methods: {
        toggleChartView() {
            if (this.activeTimeSeriesChart == 'Candlestick') {
                this.activeTimeSeriesChart = 'Line'
            } else {
                this.activeTimeSeriesChart = 'Candlestick'
            }
        },
        toggleTimeSeriesInterval(interval) {
            this.timeSeriesInterval = interval;

            const timeSeriesPayload = {
                symbol: `${this.symbol}.BSE`,
                interval: interval
            };

            this.$store.dispatch('FetchTimeSeries', timeSeriesPayload);
        },
        toggleRsiInterval(interval) {
            this.rsiInterval = interval;
            const TechnicalDataPayload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`,
                interval: interval
            }
            this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "RSI" });
        },
        toggleSmaInterval(interval) {
            this.smaInterval = interval;
            const TechnicalDataPayload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`,
                interval: interval
            }
            const timeSeriesPayload = {
                symbol: `${this.symbol}.BSE`,
                interval: interval
            };
            this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "SMA" });
            this.$store.dispatch('FetchTimeSeries', timeSeriesPayload);
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        // updateTimeSeriesData(value) {
        //     if(value) {
        //         this.localTimeSeriesData = value
        //     }

        // }
    },
    async mounted() {
        const query = this.symbol ? this.symbol : this.$route.query.symbol;
        if (query) {
            this.$store.dispatch('FetchCompanyDetails', query);

            const timeSeriesPayload = {
                symbol: `${query}.BSE`,
                interval: 'Daily'
            };

            this.$store.dispatch('FetchTimeSeries', timeSeriesPayload);

            const TechnicalDataPayload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`,
                interval: 'Daily'
            }
            this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "RSI" });
            this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "SMA" });
        } else {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style scoped lang="scss">
.divider {
    margin-block: 10px;
    height: 1px;
    width: 100%;
    background: #dfe3e7;

}

.rsi-wrapper {
    margin-top: 10px;
    background: #fff;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 20px;
    padding: 20px;
    width: 50%;


    .title {
        font-size: 20px;
        font-weight: 600;
        color: #315098;
        text-align: center;
        margin: 20px;
    }

    .status {
        padding: 10px;
        border: 1px solid #dfe3e7;
        border-radius: 6px;
    }

    .rsi-details {
        color: #5c667a;
        font-size: 12px;
        font-weight: 400;
        opacity: 0.8;

        // i {
        //     opacity: 0.4;
        //     // font-size: 10px;
        // }
    }
}

.timeseries-wrapper {
    margin-top: 10px;
    background: #fff;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 20px;
    padding: 20px;
}

.success {
    color: #08a045 !important;
    font-weight: 600;
}

.warning {
    color: #f26419;
    font-weight: 600;
}

.danger {
    color: #c81d25;
    font-weight: 600;
}

.company-title-wrapper {
    background: #fff;
    border-radius: 20px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    min-width: 30%;
    // border: 1px solid #dfe3e7;
    // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 20px;
    // width: fit-content;
    text-align: left;
    height: inherit;

    .title {
        font-size: 20px;
        color: #111a2c;
        font-weight: 600;
        line-height: 20px;
    }

    .symbol {
        // padding-top: 10px;
        font-size: 14px;
        color: #5c667a;
        font-weight: 400;
        line-height: 20px;
    }

    .industry {
        padding: 3px 10px;
        border: 1px solid #dfe3e7;
        border-radius: 100px;
        width: fit-content;
        font-size: 12px;
    }
}

// .desc {
//     width: 60%;
// }

// .name {
//     width: 40%;
// }
.visit-site-link {
    color: #5c667a;
    rotate: -45deg;
    font-size: 24px;
    cursor: pointer;

    &:hover {
        color: #ef476f;
    }
}

.company-details-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
}

.chart-options {
    border: 1px solid #dfe3e7;
    padding: 5px;
    border-radius: 6px;
    width: fit-content;
}

.option {
    font-size: 14px;
    cursor: pointer;
    padding-block: 5px;
    padding-inline: 10px;
    color: #5c667a;
}

// ef476f
// ffd166
// 06d6a0
// fffcf9
.active {
    color: #315098;
    background: #f3f5f7;
    border-radius: 6px;
    font-weight: 600;
}
</style>