<template>
    <div class="mb-4 mt-1 stock-line-chart-wrapper p-3"> 
        <div class="title">Line Chart chart</div>
    <div ref="stockLineChart" class="linechart mt-2"></div>
    </div>
    
</template>

<script>
import * as Plot from '@observablehq/plot';
// import ticker from '@/assets/json/ticker.json';
import * as d3 from "d3";
// import Aapl from '@/assets/csv/Aapl.csv'

export default {
    name: "StockLineChart",
    props: ["timeSeriesData"],
    // data() {
    //     return {

    //     }
    // },
    mounted() {
        const stockLineChartPlaceholder = this.$refs.stockLineChart;

        // const AAPL =ticker.slice(-120);
        const data = this.timeSeriesData['values'];
        // const parsedTicker = ticker.map(d => ({
        //     ...d,
        //     date: new Date(d.date)
        // }));

        const linechartPlot = Plot.plot({
            inset: 6,
            grid: false,
            width: stockLineChartPlaceholder.offsetWidth,
            x: {
                type: "time",
                // domain: d3.extent(data, d => d.datetime), // Set x-axis domain based on dates
                // ticks: data.map(d => new Date(d.datetime)), // Show all dates on x-axis
                // tickFormat: "%Y-%m-%d", // Format dates
                label: "Date",
                // tickRotate: -90
            },
            y: {
                domain: [d3.min(data, d => d.low) - 20, d3.max(data, d => d.high) + 40], // Start from 0 to max high + 20 for spacing
                // ticks: d3.range(d3.min(data, d => d.low) - 20, d3.max(data, d => d.high) + 100, 10), // Ticks at every 20 units
                label: "Price (₹)",
                tickFormat: d => d.toFixed(0), // Ensure ticks are integers
                grid: true
            },
            marks: [
                
                Plot.line(data, {x: "datetime", y: "close",  strokeWidth:4 , stroke: '#06d6a0', tip: {title: d => `Close: ${d.close}`}}),
                Plot.areaY(data, {x: "datetime", y2: d3.min(data, d => d.low) - 20, y1: "close",  fillOpacity:0.2 , fill: '#06d6a0'}),
                Plot.crosshairX(data, {x: "datetime", y: "close"}),
                Plot.text(data, Plot.pointerX({px: "datetime", py: "close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`C: ${(+d.close).toFixed(2)}`, `O: ${(+d.open).toFixed(2)}`, `H: ${(+d.high).toFixed(2)}`, `L: ${(+d.low).toFixed(2)}`].join("   "), fontWeight: "bold", fontSize: 14, fill: '#5c667a'}))
            ]
        })

        stockLineChartPlaceholder.appendChild(linechartPlot);
    }
}
</script>

<style scoped lang="scss">
.linechart {
    width: 100%;
}

.stock-line-chart-wrapper {

    .title {
        font-weight: 600;
        font-size: 16px;
        color: #315098;
        margin-bottom: 20px;
    }
}
</style>