<template>
    <div class="container mb-4">
        <button class="mb-3" @click="goToHome"><i class="fa-solid fa-house me-1"></i>Home</button>
        <p class="subtitle"><sup>*</sup> The data presented in this application is sourced from publicly available free-tier APIs, and as such, its accuracy and reliability cannot be guaranteed. This project was developed purely for learning purposes.</p>
        <div v-if="stockInfo.error || localCompanyDetails.error"
            class="d-flex justify-content-center align-items-center my-5">
            Oops...something went wrong!!
        </div>
        <div class="company-details-wrapper" v-else>
            <!-- Company Name and stock exchange -->
            <div class="company-title-wrapper company-name-wrapper name">
                <div class="d-flex justify-content-start align-items-center gap-3">
                    <div class="title">{{ stockInfo[0].name }}</div>
                    <a :href="localCompanyDetails.siteUrl" :key="localCompanyDetails.siteUrl"><i
                            class="fa-solid fa-arrow-right visit-site-link"></i></a>
                </div>
                <div class="divider"></div>
                <div class="d-flex justify-content-start gap-1 align-items-center symbol">
                    <div>{{ stockInfo[0].symbol }}</div> &#x2022;
                    <div>{{ stockInfo[0].exchange }}</div> &#x2022;
                    <div>{{ stockInfo[0].country }}</div>
                </div>
                <div class="industry mt-3" :key="companyDetails.industry">
                    {{ localCompanyDetails.industry }}
                </div>
            </div>

            <!-- Latest price -->
            <div class="company-title-wrapper company-latest-price-wrapper name">
                <div class="d-flex justify-content-start align-items-baseline gap-3"
                    :class="latestPriceIndicator == 1 ? 'success' : 'danger'">
                    <div class="d-flex justify-content-start align-items-center gap-3">
                        <div class="title latest-price" :class="latestPriceIndicator == 1 ? 'success' : 'danger'">
                            {{ latestStockPrice.length > 1 ? `₹ ${parseFloat(latestStockPrice[0].close).toFixed(2)}`
                                :
                                (latestStockPrice[0]) }}</div>
                        <i class="fa-solid fa-square-caret-up latest-price-indicator"
                            v-if="latestPriceIndicator == 1"></i>
                        <i class="fa-solid fa-square-caret-down latest-price-indicator"
                            v-else-if="latestPriceIndicator == -1"></i>
                    </div>
                    <div>{{ `${latestPriceIndicator > 0 ? '+' : ''} ${latestPricePercentageDiff}` }}%</div>
                </div>
                <div class="divider"></div>
                <div class="symbol">
                    <div><span class="me-1">Closing Price:</span> {{ latestStockPrice.length > 1 &&
                        formatDate(latestStockPrice[0].datetime) }}</div>
                </div>
            </div>

            <!-- Company description and peers -->
            <div class="company-title-wrapper company-desc-wrapper desc" :key="localCompanyDetails.description">
                <div class="symbol">
                    {{ localCompanyDetails.description }}
                </div>

                <div class="divider"></div>

                Peers:
                <div class="d-flex justify-content-start align-item-center gap-2">
                    <div class="industry mt-3" v-for="peer of localCompanyDetails.peers" :key="peer">
                        {{ peer }}
                    </div>
                </div>
            </div>
        </div>

        <div class="w-100 section-title my-2">
            TimeSeries Chart
        </div>

        <div class="timeseries-wrapper">
            <div class="d-flex justify-content-between align-items-center flex-column gap-2 flex-md-row">
                <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                    <div class="option" :class="{ 'active': activeTimeSeriesChart == 'Candlestick' }"
                        @click="toggleChartView('Candlestick')">Candlestick</div>
                    <div class="option" :class="{ 'active': activeTimeSeriesChart == 'Line' }"
                        @click="toggleChartView('Line')">
                        Line
                    </div>
                </div>
                <div class="chart-options d-flex justify-content-center align-items-center gap-4">
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
                    <div v-if="localTimeSeriesData?.error"
                        class="d-flex justify-content-center align-items-center my-5">
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

        <div class="w-100 section-title my-2">
            Technical Indicators
        </div>

        <!-- Technical Analysis -->
        <div class="technical-indicators">
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

                <div class="mt-3 d-flex flex-column flex-md-row justify-content-between gap-4 align-items-center rsi-details">
                    <div class="d-flex gap-3">
                        <div>Time Period: 14 <i class="ms-1 fa-solid fa-lock"></i></div>
                        <div>Series Type: Open <i class="ms-1 fa-solid fa-lock"></i></div>
                    </div>
                    <div class="d-flex gap-3">
                        <input type="number" v-model="rsiMin" class="rsi-input" step="5" placeholder="RSI Min"
                            name="rsiMin" id="rsiMin">
                        <input type="number" v-model="rsiMax" class="rsi-input" step="5" placeholder="RSI Max"
                            name="rsiMax" id="rsiMax">
                    </div>
                </div>

                <div>
                    <div v-if="RSILoading || Object.keys(localRSIData).length == 0">
                        <loader />
                    </div>
                    <div v-else>
                        <div v-if="localRSIData?.error" class="d-flex justify-content-center align-items-center my-5">
                            OOPS...SOMETHING WENT WRONG
                        </div>
                        <div v-else>
                            <div v-if="localRSIData.values" class="w-100">
                                <LineChart :rsiData="localRSIData" :chartInterval="rsiInterval"
                                    :key="`${rsiInterval}:${rsiMin}:${rsiMax}`" :rsiMin="rsiMin" :rsiMax="rsiMax" />
                            </div>
                        </div>
                    </div>
                </div>
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
                </div>

                <div>
                    <div v-if="SMALoading || timeSeriesLoading"
                        class="d-flex justify-content-center align-items-center w-100">
                        <loader />
                    </div>
                    <div v-else>
                        <div v-if="localSMAData?.error || timeSeries[smaInterval]?.error"
                            class="d-flex justify-content-center align-items-center my-5">
                            OOPS...SOMETHING WENT WRONG
                        </div>
                        <div v-else>
                            <div v-if="localSMAData.values && timeSeries[smaInterval].values" class="w-100">
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
            smaInterval: 'Daily',
            rsiMin: 40,
            rsiMax: 60,
            localCompanyDetails: {},
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
            if (this.timeSeries['Daily']['error']) {
                return ["Error"]
            } else if (Object.keys(this.timeSeries['Daily']).length > 0)
                return [this.timeSeries['Daily']['values'][0], this.timeSeries['Daily']['values'][1]]
            else return ['Loading']
        },
        latestPriceIndicator() {
            if (this.latestStockPrice.length > 1) {
                if (this.latestStockPrice[0].close > this.latestStockPrice[1].close) {
                    return 1
                } else {
                    return -1
                }
            } else {
                return 0
            }
        },
        latestPricePercentageDiff() {
            if (this.latestStockPrice.length > 1) {
                const value1 = parseFloat(this.latestStockPrice[0].close)
                const value2 = parseFloat(this.latestStockPrice[1].close)
                const difference = (value1 - value2);
                const average = (value1 + value2) / 2;
                const percentageDifference = ((difference / average) * 100).toFixed(2);
                return percentageDifference;
            } else {
                return 0
            }
        }
    },
    watch: {
        companyDetails: [{
            handler: 'setLocalCompanyData',
            deep: true
        }]
    },
    methods: {
        toggleChartView(view) {
            this.activeTimeSeriesChart = view
        },
        setLocalCompanyData(value) {
            if(value) {
                this.localCompanyDetails = value
            }
        },
        goToHome() {
            this.$router.push({name: 'home'})
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        },
        toggleTimeSeriesInterval(interval) {
            this.timeSeriesInterval = interval;

            const timeSeriesPayload = {
                symbol: `${this.symbol}.BSE`,
                interval: interval
            };

            if (Object.keys(this.timeSeries[interval]).length == 0 || this.timeSeries[interval].error) {
                this.$store.dispatch('FetchTimeSeries', timeSeriesPayload);
            }

        },
        toggleRsiInterval(interval) {
            this.rsiInterval = interval;
            const TechnicalDataPayload = {
                timePeriod: 14,
                seriesType: 'open',
                symbol: `${this.symbol}.BSE`,
                interval: interval
            }
            if (Object.keys(this.rsiData[interval]).length == 0 || this.rsiData[interval].error) {
                this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "RSI" });
            }

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
            if (Object.keys(this.timeSeries[interval]).length == 0 || this.timeSeries[interval].error) {
                this.$store.dispatch('FetchTimeSeries', timeSeriesPayload);
            }

            if (Object.keys(this.smaData[interval]).length == 0 || this.smaData[interval].error) {
                this.$store.dispatch('FetchTechnicalData', { ...TechnicalDataPayload, function: "SMA" });
            }
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
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
.section-title {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    color: #315098;
    font-size: 24px;
    font-weight: 600;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.divider {
    margin-block: 10px;
    height: 1px;
    width: 100%;
    background: #dfe3e7;

}

.rsi-wrapper {
    // margin-top: 10px;
    background: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 10px;
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
    }
}

.timeseries-wrapper {
    margin-top: 10px;
    background: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 10px;
    padding: 20px;
}

.success {
    color: #08a045 !important;
    font-weight: 600;
}

.warning {
    color: #f26419 !important;
    font-weight: 600;
}

.danger {
    color: #c81d25 !important;
    font-weight: 600;
}

.rsi-input {
    padding: 5px;
    border: 1px solid #5c667a;
    border-radius: 3px;
    height: 28px;
    width: 80px;

    :focus {
        outline: unset;
    }
}

button {
    padding: 5px;
    background: #315098;
    color: #fff;
    border: none;
    border-radius: 5px;
}
.company-title-wrapper {
    background: #fff;
    border-radius: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    min-width: 30%;
    padding: 20px;
    text-align: left;
    height: inherit;

    .title {
        font-size: 20px;
        color: #315098;
        font-weight: 600;
        line-height: 20px;
    }

    .symbol {
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

        @media only screen and (max-width: 560px) {
            border-radius: 5px;
            padding: 3px 5px;
        }
    }
}

.latest-price {
    font-size: 42px !important;
    line-height: unset !important;
}

.technical-indicators {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;

    .rsi-wrapper {
        grid-column: span 1;
        grid-row: span 1;

        @media only screen and (max-width: 560px) {
            grid-column: span 2;
        }
    }
}

.latest-price-indicator {
    font-size: 32px;
}

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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;

    .company-name-wrapper,
    .company-latest-price-wrapper {
        grid-column: span 1;
        grid-row: span 1;

        @media only screen and (max-width: 560px) {
            grid-column: span 2;
        }
    }

    .company-desc-wrapper {
        grid-column: span 2;
        // grid-row;
    }

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

.active {
    color: #315098;
    background: #f3f5f7;
    border-radius: 6px;
    font-weight: 600;
}

.subtitle {
    font-size: 12px;
    color: #5c667a;
}
</style>