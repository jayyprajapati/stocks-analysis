<template>
   <div class="mt-1 line-chart-wrapper p-3">
        <div ref="SMALineChart" class="mt-3 smaLineChart"></div>
    </div>
    
</template>

<script>
import * as Plot from '@observablehq/plot';
import * as d3 from "d3";

export default {
    name: "SMALineChart",
    props: ["timeSeriesData", "smaData"],
    computed: {
        timeSeries() {
            return this.timeSeriesData['values'];
        }
    },
    mounted() {
        const SmaLineChartPlaceholder = this.$refs.SMALineChart;
        const data1 = this.smaData['values'];

        const linechartPlot = Plot.plot({
            inset: 6,
            grid: false,
            height: 200,
            width: SmaLineChartPlaceholder.offsetWidth,
            x: {
                type: "time",
                domain: d3.extent(this.timeSeries, d => d.datetime),
                label: "Date",
            },
            y: {
                domain: [d3.min(this.timeSeries, d => d.low) - 20, d3.max(this.timeSeries, d => d.high) + 40], // Start from 0 to max high + 20 for spacing
                label: "Price",
                tickFormat: d => d.toFixed(0),
            },
            marks: [
                Plot.line(data1, {x: "datetime", y: "sma",  strokeWidth:2 , stroke: '#315098'}),
                Plot.line(this.timeSeries, {x: "datetime", y: "close",  strokeWidth:2 , stroke: '#06d6a0'}),
                Plot.areaY(this.timeSeries, {x: "datetime", y2: d3.min(this.timeSeries, d => d.low) - 20, y1: "close",  fillOpacity:0.2 , fill: '#06d6a0'}),
                Plot.crosshairX(this.timeSeries, {x: "datetime", y: "close"}),
                Plot.text(this.timeSeries, Plot.pointerX({
                    px: "datetime", py: "close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums", 
                    text: (d) => [`C: ${(+d.close).toFixed(2)}`, `O: ${(+d.open).toFixed(2)}`, `H: ${(+d.high).toFixed(2)}`, `L: ${(+d.low).toFixed(2)}`].join("   "), 
                    fontWeight: "bold", fontSize: 14, fill: '#5c667a'
                }))
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