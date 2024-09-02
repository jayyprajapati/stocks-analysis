<template>
    <div class="mt-1 line-chart-wrapper p-3">
        <div ref="lineChart" class="mt-3 rsiLineChart"></div>
    </div>

</template>

<script>
import * as Plot from '@observablehq/plot';
import * as d3 from "d3";
import { mapGetters } from 'vuex';

export default {
    name: "LineChart",
    props: ["rsiData", "chartInterval", "rsiMin", "rsiMax"],
    computed: {
        ...mapGetters(['symbol'])
    },
    mounted() {
        const lineChartPlaceholder = this.$refs.lineChart;
        const data = this.rsiData['values'];

        const LinePlot = Plot.plot({
            inset: 6,
            width: lineChartPlaceholder.offsetWidth,
            height: 200,
            grid: false,
            x: {
                type: "time",
                label: "Date",
            },
            y: {
                label: `↑ ${this.chartInterval} RSI`,
                domain: [0, 100],
                tickFormat: d => d.toFixed(0),
                ticks: d3.range(20, 101, 20),
                
            },
            marks: [
                Plot.rectY([{}], { y1: this.rsiMin, y2: this.rsiMax, fill: "#ffd166", opacity: 0.4 }),
                Plot.ruleY([this.rsiMin, this.rsiMax], { stroke: "#ffd166", opacity: 1, strokeWidth: 0.5 }),
                Plot.ruleY([0]),
                Plot.line(data, { x: "datetime", y: d => +d.rsi, strokeWidth: 2, stroke: '#315098', strokeLinecap: "round" }),
                Plot.crosshairX(data, { x: "datetime", y: d => +d.rsi }),
                Plot.dot(data, Plot.pointerX({ x: "datetime", y: d => +d.rsi, stroke: "#bf0603" })),
                Plot.text(data, Plot.pointerX({ 
                    px: "datetime", py: d => +d.rsi, frameAnchor: "top-right", fontVariant: "tabular-nums", 
                    text: (d) => [`Date: ${(d.datetime)}`, `RSI: ${(+d.rsi).toFixed(2)}`].join("   "), 
                    fontWeight: "bold", fontSize: 14, fill: '#5c667a' 
                }))
            ]
        });

        lineChartPlaceholder.appendChild(LinePlot);
    }
}
</script>

<style scoped lang="scss">
.rsiLineChart {
    width: 100%;
}

.line-chart-wrapper {

    .title {
        text-align: left;
        font-weight: 600;
        font-size: 16px;
        color: #315098;
        margin-bottom: 20px;
    }
}
</style>