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
    background: var(--bg-primary);
    padding: 1.5rem 2rem;
    border-radius: var(--radius-xl);
    color: var(--primary-color);
    font-size: 1.5rem;
    font-weight: 700;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--gray-200);
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
    animation: slideUp 0.6s ease-out;
    
    // &::before {
    //     content: '';
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     height: 3px;
    //     background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    // }
}

.divider {
    margin: 1rem 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
}

.rsi-wrapper {
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-md);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    width: 50%;
    transition: all var(--transition-normal);
    animation: slideUp 0.6s ease-out;
    
    &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }

    .title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
        text-align: center;
        margin-bottom: 1.5rem;
        position: relative;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 50%;
            transform: translateX(-50%);
            width: 3rem;
            height: 2px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 1px;
        }
    }

    .status {
        padding: 0.75rem;
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-md);
        background: var(--gray-50);
    }

    .rsi-details {
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 400;
    }
}

.timeseries-wrapper {
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-md);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    transition: all var(--transition-normal);
    animation: slideUp 0.6s ease-out 0.2s both;
    
    &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }
}

.success {
    color: var(--success-color) !important;
    font-weight: 600;
}

.warning {
    color: var(--warning-color) !important;
    font-weight: 600;
}

.danger {
    color: var(--error-color) !important;
    font-weight: 600;
}

.rsi-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    color: var(--text-primary);
    background: var(--bg-primary);
    transition: all var(--transition-fast);
    width: 80px;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgb(0 102 255 / 0.1);
    }
    
    &::placeholder {
        color: var(--text-tertiary);
    }
}

button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
    
    &:hover {
        background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    i {
        font-size: 1rem;
    }
}

.company-title-wrapper {
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    min-width: 30%;
    padding: 1.5rem;
    text-align: left;
    height: inherit;
    transition: all var(--transition-normal);
    animation: slideUp 0.6s ease-out;
    
    &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }

    .title {
        font-size: 1.25rem;
        color: var(--primary-color);
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 0.5rem;
    }

    .symbol {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 400;
        line-height: 1.5;
    }

    .industry {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-2xl);
        background: var(--gray-50);
        color: var(--text-secondary);
        font-size: 0.75rem;
        font-weight: 500;
        transition: all var(--transition-fast);
        
        &:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        @media only screen and (max-width: 768px) {
            border-radius: var(--radius-md);
            padding: 0.25rem 0.5rem;
        }
    }
}

.latest-price {
    font-size: clamp(2rem, 4vw, 2.5rem) !important;
    line-height: 1.1 !important;
    font-weight: 700 !important;
}

.technical-indicators {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    margin-top: 1rem;

    .rsi-wrapper {
        grid-column: span 1;
        grid-row: span 1;

        @media only screen and (max-width: 768px) {
            grid-column: span 2;
        }
    }
}

.latest-price-indicator {
    font-size: 2rem;
    animation: pulse 2s ease-in-out infinite;
}

.visit-site-link {
    color: var(--text-tertiary);
    transform: rotate(-45deg);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    padding: 0.5rem;
    border-radius: var(--radius-md);

    &:hover {
        color: var(--primary-color);
        background: var(--gray-50);
        transform: rotate(-45deg) scale(1.1);
    }
}

.company-details-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 2rem;
    animation: slideUp 0.6s ease-out 0.3s both;

    .company-name-wrapper,
    .company-latest-price-wrapper {
        grid-column: span 1;
        grid-row: span 1;

        @media only screen and (max-width: 768px) {
            grid-column: span 2;
        }
    }

    .company-desc-wrapper {
        grid-column: span 2;
    }
}

.chart-options {
    display: inline-flex;
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    padding: 0.25rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    gap: 0.125rem;
    
    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
}

.option {
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    font-weight: 500;
    white-space: nowrap;
    
    &:hover {
        color: var(--primary-color);
        background: var(--gray-50);
    }
    
    &.active {
        color: white;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        box-shadow: var(--shadow-sm);
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        padding: 0.375rem 0.75rem;
        font-size: 0.8125rem;
    }
}

.subtitle {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    background: var(--gray-50);
    padding: 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    margin-bottom: 1.5rem;
    
    sup {
        color: var(--warning-color);
        font-weight: 600;
    }
}

// Error states
.error-message {
    color: var(--error-color);
    background: var(--error-color)/5;
    border: 1px solid var(--error-color)/20;
    border-radius: var(--radius-lg);
    padding: 2rem;
    text-align: center;
    font-weight: 500;
}

// Container spacing
.container {
    animation: slideUp 0.6s ease-out;
    
    @media (max-width: 768px) {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>