<template>
    <div class="mb-4 mt-1 candlestick-chart-wrapper p-3"> 
        <div class="title">Candlestick chart</div>
    <div ref="candleStick" class="candlestick mt-2"></div>
    </div>
    
</template>

<script>
import * as Plot from '@observablehq/plot';
import * as d3 from "d3";

export default {
    name: "CandleStick",
    props: ["timeSeriesData", "interval"],
    computed: {
        data() {
            return this.timeSeriesData['values'];
        }
    },
    mounted() {
        const candleStickPlaceholder = this.$refs.candleStick;

        const candlestickPlot = Plot.plot({
            inset: 6,
            grid: false,
            width: candleStickPlaceholder.offsetWidth,
            x: {
                type: "time",
                label: "Date",
            },
            y: {
                domain: [d3.min(this.data, d => d.low) - 20, d3.max(this.data, d => d.high) + 40], // Start from 0 to max high + 20 for spacing
                label: "Price (₹)",
                tickFormat: d => d.toFixed(0),
                grid: true
            },
            color: {
                range: ["red", "green"]
            },
            marks: [
                Plot.ruleX(this.data, {
                    x: "datetime",
                    y1: "low",
                    y2: "high",
                }),
                Plot.ruleX(this.data, {
                    x: "datetime",
                    y1: "open",
                    y2: "close",
                    stroke: (d) => Math.sign(d.close - d.open),
                    strokeWidth: 4,
                }),
                Plot.crosshairX(this.data, {x: "datetime", y: "close"}),
                Plot.text(this.data, Plot.pointerX({
                    px: "datetime", py: "close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", 
                    text: (d) => [`C: ${(+d.close).toFixed(2)}`, `O: ${(+d.open).toFixed(2)}`, `H: ${(+d.high).toFixed(2)}`, `L: ${(+d.low).toFixed(2)}`].join("   "), 
                    fontWeight: "bold", fontSize: 14, fill: '#5c667a'
                }))
            ]
        })

        candleStickPlaceholder.appendChild(candlestickPlot);
    }
}
</script>

<style scoped lang="scss"> 
.candlestick {
    width: 100%;
}

.candlestick-chart-wrapper {

    .title {
        font-weight: 600;
        font-size: 16px;
        color: #315098;
        margin-bottom: 20px;
    }
}
</style>