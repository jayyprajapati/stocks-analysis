<template>
    <div class="autocomplete-wrapper position-relative">
        <div class="hero-content">
            <!-- <div class="hero-badge">
                <i class="fas fa-chart-line"></i>
                <span>Real-time Analytics</span>
            </div> -->
            <h1 class="hero-title">
                Your <span class="highlight">Strategy</span>, Simplified
            </h1>
            <p class="hero-subtitle">
                Empower your trading decisions with real-time data, comprehensive analytics, 
                and actionable insights that make every trade count.
            </p>
            <div class="d-flex justify-content-center align-items-center mt-4">
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
            <div class="features-grid mt-5">
                <div class="feature-item">
                    <i class="fas fa-bolt"></i>
                    <span>Real-time Data</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>Technical Analysis</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-brain"></i>
                    <span>Smart Insights</span>
                </div>
            </div>
            <p class="api-note">
                <i class="fas fa-info-circle"></i>
                Please allow 1 minute between analyses to respect API limits
            </p>
        </div>
        
        <!-- <img src="../assets/svg/manWithGraph.svg" class="candle-chart-svg" alt=""> -->
        <!-- <img src="../assets/svg/chart2.svg" class="chart2-svg" alt=""> -->
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
.autocomplete-wrapper {
    width: 90%;
    max-width: 1200px;
    position: relative;
    min-height: 700px;
    padding: 2rem 0;
}

.hero-content {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeIn 0.8s ease-out;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-2xl);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-md);
    animation: slideUp 0.8s ease-out 0.2s both;
    
    i {
        font-size: 1rem;
    }
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.1;
    margin-bottom: 1.5rem;
    animation: slideUp 0.8s ease-out 0.3s both;
    
    .highlight {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
    }
}

.hero-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0;
    // max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: slideUp 0.8s ease-out 0.4s both;
}

.features-grid {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    animation: slideUp 0.8s ease-out 0.5s both;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
    
    i {
        color: var(--primary-color);
        font-size: 1.25rem;
    }
    
    span {
        color: var(--text-secondary);
        font-weight: 500;
        white-space: nowrap;
    }
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        
        i {
            color: var(--secondary-color);
        }
    }
}

.api-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-tertiary);
    background: var(--gray-50);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    max-width: 500px;
    margin: 0 auto 2rem auto;
    animation: slideUp 0.8s ease-out 0.6s both;
    
    i {
        color: var(--primary-color);
    }
}

// Search input styling
input {
    width: 100%;
    padding: 1.5rem 2rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--bg-primary);
    border: 2px solid var(--gray-200);
    border-radius: var(--radius-xl);
    outline: none;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);
    animation: slideUp 0.8s ease-out 0.7s both;
    
    &::placeholder {
        color: var(--text-tertiary);
        font-weight: 400;
    }
    
    &:focus {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-lg), 0 0 0 3px rgb(0 102 255 / 0.1);
        transform: translateY(-2px);
    }
    
    &:disabled {
        background: var(--gray-50);
        color: var(--text-tertiary);
        cursor: not-allowed;
    }
}

.no-result-txt {
    font-size: 20px;
    color: #7695FF;
    font-weight: 600;
}

.close-btn {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--transition-fast);
    padding: 0.5rem;
    border-radius: var(--radius-md);
    
    &:hover {
        color: var(--error-color);
        background: var(--gray-50);
    }
}

.no-result-txt {
    font-size: 1.125rem;
    color: var(--text-secondary);
    font-weight: 500;
    text-align: center;
    padding: 2rem;
}

// Chart options styling
.chart-options {
    display: inline-flex;
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    padding: 0.25rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    animation: slideUp 0.8s ease-out 0.8s both;
}

.info {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
}

.option {
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    font-weight: 500;
    
    &:hover {
        color: var(--primary-color);
        background: var(--gray-50);
    }
    
    &.active {
        color: var(--primary-color);
        background: var(--primary-color)/10;
        font-weight: 600;
    }
}

// Search dropdown styling
.search-list {
    // position: absolute;
    // top: 100%;
    // left: 0;
    // right: 0;
    max-height: 350px;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    margin-top: 0.5rem;
    animation: slideUp 0.3s ease-out;
    backdrop-filter: blur(10px);
}

.stock-item {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--gray-100);
    font-weight: 500;
    text-align: left;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all var(--transition-fast);
    cursor: pointer;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background: var(--gray-50);
        transform: translateX(4px);
        
        .symbol {
            color: var(--primary-color);
        }
    }
    
    .symbol {
        color: var(--primary-light);
        font-weight: 600;
        transition: color var(--transition-fast);
    }
    
    .exchange {
        color: var(--text-tertiary);
        font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
        padding: 0.75rem 1rem;
    }
}

// Background decorative elements
.candle-chart-svg,
.chart2-svg,
.lines-svg,
.lines2-svg {
    opacity: 0.6;
    z-index: -1;
    pointer-events: none;
    transition: opacity var(--transition-slow);
    
    @media (max-width: 768px) {
        opacity: 0.3;
    }
}

.candle-chart-svg {
    width: 25%;
    position: absolute;
    right: -5%;
    bottom: 10%;
    
    @media (max-width: 768px) {
        display: none;
    }
}

.chart2-svg {
    width: 8%;
    position: absolute;
    bottom: 20%;
    right: 20%;
    
    @media (max-width: 768px) {
        display: none;
    }
}

.lines-svg {
    width: 8%;
    position: absolute;
    top: 25%;
    left: 5%;
    
    @media (max-width: 768px) {
        width: 6%;
        top: 30%;
    }
}

.lines2-svg {
    width: 8%;
    position: absolute;
    top: 25%;
    right: 5%;
    
    @media (max-width: 768px) {
        width: 6%;
        top: 30%;
    }
}
</style>