<template>
    <div class="autocomplete-wrapper my-5">
        <div>
            <h1><strong>Your Strategy, Simplified...</strong></h1>
            <p>Empower your decisions with real-time data and in-depth analytics, making every trade count.</p>
        </div>
        <div class="mt-5 position-relative">
            <input type="text" placeholder="Enter Company Name / Symbol" v-model="searchQuery">
            <i class="fa-solid fa-xmark close-btn" v-if="searchQuery" @click="clearSearchQuery"></i>
        </div>
        
        <div class="search-list" v-if="searchQuery">
            <div v-if="stockList?.error">
                Oops...Something went wrong!
            </div>
            <div v-else>
                <div v-if="filteredList.length == 0" class="no-result-txt">No result found...</div>
            <div v-else v-for="stock in filteredList" :key="stock.symbol" class="d-flex justify-content-between gap-5 stock-item" @click="searchItem(stock.symbol)">
                <div>{{ stock.name }}</div>
                <div class="d-flex gap-3 justify-content-center">
                    <div class="symbol">{{ stock.symbol }}</div> 
                    <div class="exchange">{{ stock.exchange }}</div>
                </div>
                
            </div>
            </div>
            
        </div>
    </div>

    <!-- <img src="../assets/svg/stockGraph.svg" class="stock-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/upwardGraph.svg" class="upward-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/search.svg" class="search-graph-svg" alt=""> -->
    <!-- <img src="../assets/svg/grow.svg" class="grow-svg" alt=""> -->
    <img src="../assets/svg/manWithGraph.svg" class="candle-chart-svg" alt="">
    <img src="../assets/svg/lines.svg" class="lines-svg" alt="">
    <img src="../assets/svg/lines2.svg" class="lines2-svg" alt="">
    <img src="../assets/svg/chart2.svg" class="chart2-svg" alt="">
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
    name: "AutoComplete",
    data() {
        return {
            // stockList: null,
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
        filteredList() {
            if(!this.searchQuery || this.stockList.error) {
                return this.stockList
            } else {
                const filteredData = this.stockList.filter((stock) => 
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
            console.log("search symbol: " + symbol);
            this.MutateSymbol(symbol);
            this.$router.push({name: 'stock_analysis'})
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
    background: transparent;
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
    // min-height: 90vh;
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
    width: 23%;
    position: absolute;
    right: 8%;
    bottom: 5%;
    z-index: -1;
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
    bottom: 10%;
    right: 30%;
    z-index: -1;
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
    z-index: 10000 !important;
    padding: 10px;
    border-radius: 10px;
}

.stock-item {
    padding: 20px 20px;
    border-bottom: 1px solid #EEEDEB;
    font-weight: 500;
    text-align: left;
    color: #686D76;
    font-size: 16px;

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
    font-weight: 700;
    cursor: pointer;
}
</style>