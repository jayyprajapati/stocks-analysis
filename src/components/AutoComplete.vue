<template>
    <div class="autocomplete-wrapper my-5 position-relative">
        <div class="mt-5">
            <h1><strong>Your Strategy, Simplified...</strong></h1>
            <p class="subtitle">Empower your decisions with real-time data and in-depth analytics, making every trade
                count.</p>
            <p class="subtitle note"><sup>*</sup>Please allow at least 1 minute between consecutive stock analyses to comply with the API's rate limit. Failing to observe this interval may result in errors during the analysis process.</p>
        </div>
        <div class="d-flex justify-content-start align-items-center mt-5">
            <div class="chart-options d-flex justify-content-center align-items-center gap-4">
                <div class="d-flex justify-content-center align-items-center gap-2">
                    <div class="info">Country</div>
                    <div class="option active">India</div>
                </div>
                <div class="d-flex justify-content-center align-items-center gap-2">
                    <div class="info">Exchange</div>
                    <div class="option active">BSE</div>
                </div>
            </div>
        </div>
        <div class="mt-3 position-relative">
            <input type="text" placeholder="Enter Company Name / Symbol" v-model="searchQuery" :disabled="stockList.error || Object.keys(stockList).length == 0">
            <i class="fa-solid fa-xmark close-btn" v-if="searchQuery" @click="clearSearchQuery"></i>
        </div>

        <div class="search-list" v-if="searchQuery">
            <div v-if="localStockList?.error" class="d-flex justify-content-center align-items-center my-5">
                Oops...Something went wrong!
            </div>
            <div v-else>
                <div v-if="filteredList.length == 0" class="no-result-txt">No result found...</div>
                <div v-else v-for="stock in filteredList" :key="stock.symbol"
                    class="d-flex flex-column flex-md-row gap-2 gap-md-5 justify-content-between stock-item" @click="searchItem(stock.symbol)">
                    <div>{{ stock.name }}</div>
                    <div class="d-flex gap-3 justify-content-md-center justify-content-start">
                        <div class="symbol">{{ stock.symbol }}</div>
                        <div class="exchange">{{ stock.exchange }}</div>
                    </div>

                </div>
            </div>

        </div>
        <img src="../assets/svg/manWithGraph.svg" class="candle-chart-svg" alt="">
        <img src="../assets/svg/chart2.svg" class="chart2-svg" alt="">
    </div>


    <!-- <img src="../assets/svg/stockGraph.svg" class="stock-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/upwardGraph.svg" class="upward-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/search.svg" class="search-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/grow.svg" class="grow-svg" alt=""> -->

    <img src="../assets/svg/lines.svg" class="lines-svg" alt="">
    <img src="../assets/svg/lines2.svg" class="lines2-svg" alt="">

</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
    name: "AutoComplete",
    data() {
        return {
            // localStockList: null,
            searchQuery: ''
        }
    },
    mounted() {
        const payload = {
            country: 'India',
            exchange: 'BSE'
        }
        this.$store.dispatch('FetchStocksList', payload)
    },
    computed: {
        ...mapGetters(['stockList']),
        localStockList() {
            if(this.stockList.error) {
                return this.stockList
            } else {
                return this.stockList['data']
            }
        },
        filteredList() {
            if (!this.searchQuery || this.localStockList?.error) {
                return this.localStockList
            } else {
                const filteredData = this.localStockList.filter((stock) =>
                    stock.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    stock.symbol.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
                return filteredData
            }

        }
    },
    methods: {
        ...mapMutations(['MutateSymbol']),
        clearSearchQuery() {
            this.searchQuery = ''
        },
        searchItem(symbol) {
            this.MutateSymbol(symbol);
            this.$router.push({ name: 'stock_analysis' })
        }
    }
}
</script>

<style scoped lang="scss">
h1 {
    color: #F28080;
    font-weight: 600;

}

input {
    padding: 20px;
    outline: none;
    height: 60px;
    width: 100%;
    border: none;
    background: #fff;
    border-radius: 10px;
    // border-bottom: 3px solid #A9A9A9;
    font-weight: 600;
    font-size: 24px;
    color: #F28080;
    // color: #7BCDD1;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    &::placeholder {
        opacity: 0.5;
        font-weight: 500;
    }

    // position: relative;
}

.autocomplete-wrapper {
    width: 70%;
    position: relative;
    height: 600px;
}

.no-result-txt {
    font-size: 20px;
    color: #7695FF;
    font-weight: 600;
}

.close-btn {
    position: absolute;
    right: 2%;
    top: 30%;
    font-size: 28px;
    color: #F28080;
    cursor: pointer;
}

.subtitle {
    color: #5c667a;
}

.note {
    font-size: 12px;
}

.stock-graph-svg {
    width: 15%;
    rotate: 10deg;
    position: absolute;
    bottom: 25%;
    left: 12%;
    z-index: -1 !important;
}

.upward-graph-svg {
    width: 15%;
    rotate: -5deg;
    position: absolute;
    bottom: 20%;
    right: 12%;
    z-index: -1 !important;
}

.candle-chart-svg {
    width: 30%;
    position: absolute;
    right: 0;
    bottom: 5%;
    @media only screen and (max-width: 560px) {
        display: none;
    }
    // z-index: -1 !important;
}

.lines-svg {
    width: 10%;
    position: absolute;
    top: 20%;
    left: 10%
}

.search-graph-svg {
    width: 5%;
    // rotate: -5deg;
    position: absolute;
    top: 37%;
    left: 18%;
}

.chart2-svg {
    width: 10%;
    position: absolute;
    bottom: 15%;
    right: 25%;

    @media only screen and (max-width: 560px) {
        display: none;
    }
    // z-index: -1;
}

.lines2-svg {
    width: 10%;
    position: absolute;
    top: 20%;
    right: 10%;
}

.grow-svg {
    width: 7%;
    // rotate: -5deg;
    position: absolute;
    top: 20%;
    right: 10%;
}

.search-list {
    max-height: 300px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    top: 0;
    overflow: auto;
    background: white;
    z-index: 10001 !important;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    
}

.stock-item {
    padding: 20px 20px;
    border-bottom: 1px solid #EEEDEB;
    font-weight: 500;
    text-align: left;
    color: #686D76;
    font-size: 16px;
    z-index: 10001 !important;

    @media only screen and (max-width: 560px) {
        padding: 5px;
        justify-content: start;
    }
    .symbol {
        color: #7695FF;
        font-weight: 600;
    }

    .exchange {
        // font-size: 14px;
        color: #B2B2B2;
    }
}

.stock-item:hover {
    color: #65B741;
    // font-weight: 700;
    cursor: pointer;
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

.info {
    color: #5c667a;
}
</style>