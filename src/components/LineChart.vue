<template>
    <div class="mt-1 line-chart-wrapper p-3">
        <!-- <div class="title">{{ chartInterval }} RSI chart</div> -->
        <div ref="lineChart" class="mt-3 rsiLineChart"></div>
    </div>

</template>

<script>
import * as Plot from '@observablehq/plot';
// import ticker from '@/assets/json/ticker.json';
// import rsiData from '@/assets/json/rsiData.json'
import * as d3 from "d3";
import { mapGetters } from 'vuex';
// import { scale } from '@observablehq/plot';
// import Aapl from '@/assets/csv/Aapl.csv'

export default {
    name: "LineChart",
    props: ["rsiData", "chartInterval"],
    // data() {
    //     return {
    //         data: this.rsiData['values']
    //     }
    // },
    computed: {
        ...mapGetters(['symbol'])
    },
    mounted() {
        const lineChartPlaceholder = this.$refs.lineChart;
        // const parsedTicker = ticker.map(d => ({
        //     ...d,
        //     date: new Date(d.date)
        // }));

        const data = this.rsiData['values'];


        const LinePlot = Plot.plot({
            inset: 6,
            width: lineChartPlaceholder.offsetWidth,
            height: 200,
            grid: false,
            x: {
                type: "time", // Explicitly set the x-axis type to 'time'
                label: "Date",
                grid: false
            },
            y: {
                label: `↑ ${this.chartInterval} RSI`,
                domain: [0, 100], // Set the domain to cover the range you want (0 to 100)
                tickFormat: d => d.toFixed(0), // Format ticks to show integers only
                ticks: d3.range(20, 101, 20), // Set tick intervals at 20 (0, 20, 40, 60, 80, 100)
                
            },
            marks: [
                Plot.rectY([{}], { y1: 40, y2: 60, fill: "#ffd166", opacity: 0.4 }),
                Plot.ruleY([40, 60], { stroke: "#ffd166", opacity: 1, strokeWidth: 0.5 }), // Highlight the 40-60 range
                Plot.ruleY([0]), // Add a horizontal line at y = 0
                Plot.line(data, { x: "datetime", y: d => +d.rsi, strokeWidth: 2, stroke: '#315098', strokeLinecap: "round" }), // Convert RSI values to numbers
                Plot.crosshairX(data, { x: "datetime", y: d => +d.rsi }),
                Plot.dot(data, Plot.pointerX({ x: "datetime", y: d => +d.rsi, stroke: "#bf0603" })),
                Plot.text(data, Plot.pointerX({ px: "datetime", py: d => +d.rsi, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`Date: ${(d.datetime)}`, `RSI: ${(+d.rsi).toFixed(2)}`].join("   "), fontWeight: "bold", fontSize: 14, fill: '#5c667a' }),)
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