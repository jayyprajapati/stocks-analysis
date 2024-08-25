<template>
    <div>Analysis:</div>
    <div>
        <span>H: {{ high }}</span> <span>L: {{ low }}</span> <span>O: {{ open }}</span> <span>C: {{ close }}</span>
        <div>
            Trigger: {{ trigger }}
        </div>
        <div>
            stoploss: {{ stopLoss }}
        </div>
    </div>
</template>

<script>

export default {
    name: "ChartAnalysis",
    data() {
        return {
            high: 54,
            low: 30,
            open: 45,
            close: 50
        }
    },
    computed: {
        candleHeight() {
            return Math.abs(this.open - this.close)
        },
        stopLoss() {
            return this.low - this.candleHeight
        },
        trigger() {
            return this.high + 3 * (this.candleHeight)
        }
    }
}
</script>