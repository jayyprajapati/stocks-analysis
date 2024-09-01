<template>
   <div class="mt-1 line-chart-wrapper p-3">
        <!-- <div class="title">{{ chartInterval }} RSI chart</div> -->
        <div ref="SMALineChart" class="mt-3 smaLineChart"></div>
    </div>
    
</template>

<script>
import * as Plot from '@observablehq/plot';
// import ticker from '@/assets/json/ticker.json';
import * as d3 from "d3";
// import Aapl from '@/assets/csv/Aapl.csv'

export default {
    name: "SMALineChart",
    props: ["timeSeriesData", "smaData"],
    // data() {
    //     return {

    //     }
    // },
    computed: {
        timeSeries() {
            const data = this.timeSeriesData['values'];
            if(this.timeSeriesData.interval == 'Daily') {
                return data.slice(0,150)
            } else if(this.timeSeriesData.interval == 'Weekly') {
                return data.slice(0,100)
            } else {
                return data.slice(0,50)
            }
        }
    },
    mounted() {
        const SmaLineChartPlaceholder = this.$refs.SMALineChart;

        // const AAPL =ticker.slice(-120);
        // const data = this.timeSeriesData['values'];
        const data1 = this.smaData['values'];
        // const parsedTicker = ticker.map(d => ({
        //     ...d,
        //     date: new Date(d.date)
        // }));

        const linechartPlot = Plot.plot({
            inset: 6,
            grid: false,
            height: 200,
            width: SmaLineChartPlaceholder.offsetWidth,
            x: {
                type: "time",
                domain: d3.extent(this.timeSeries, d => d.datetime), // Set x-axis domain based on dates
                // ticks: data.map(d => new Date(d.datetime)), // Show all dates on x-axis
                // tickFormat: "%Y-%m-%d", // Format dates
                label: "Date",
                // tickRotate: -90
            },
            y: {
                domain: [d3.min(this.timeSeries, d => d.low) - 20, d3.max(this.timeSeries, d => d.high) + 40], // Start from 0 to max high + 20 for spacing
                // ticks: d3.range(d3.min(data, d => d.low) - 20, d3.max(data, d => d.high) + 100, 10), // Ticks at every 20 units
                label: "Price",
                tickFormat: d => d.toFixed(0), // Ensure ticks are integers
                grid: false
            },
            marks: [
                
                Plot.line(data1, {x: "datetime", y: "sma",  strokeWidth:2 , stroke: '#315098'}),
                Plot.line(this.timeSeries, {x: "datetime", y: "close",  strokeWidth:2 , stroke: '#06d6a0'}),
                Plot.areaY(this.timeSeries, {x: "datetime", y2: d3.min(this.timeSeries, d => d.low) - 20, y1: "close",  fillOpacity:0.2 , fill: '#06d6a0'}),
                Plot.crosshairX(this.timeSeries, {x: "datetime", y: "close"}),
                Plot.text(this.timeSeries, Plot.pointerX({px: "datetime", py: "close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", text: (d) => [`C: ${(+d.close).toFixed(2)}`, `O: ${(+d.open).toFixed(2)}`, `H: ${(+d.high).toFixed(2)}`, `L: ${(+d.low).toFixed(2)}`].join("   "), fontWeight: "bold", fontSize: 14, fill: '#5c667a'}))
            ]
        })

        SmaLineChartPlaceholder.appendChild(linechartPlot);
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

.smaLineChart {
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