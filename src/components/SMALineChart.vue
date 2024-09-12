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
    props: ["timeSeriesData", "smaData", "chartInterval"],
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
                Plot.line(data1, { x: "datetime", y: "sma", strokeWidth: 2, stroke: '#315098' }),
                Plot.line(this.timeSeries, { x: "datetime", y: "close", strokeWidth: 2, stroke: '#06d6a0' }),
                Plot.areaY(this.timeSeries, { x: "datetime", y2: d3.min(this.timeSeries, d => d.low) - 20, y1: "close", fillOpacity: 0.2, fill: '#06d6a0' }),
                Plot.crosshairX(this.timeSeries, { x: "datetime", y: "close" }),
                Plot.ruleX(data1, Plot.pointerX({ x: "datetime", py: "sma", stroke: "#315098" })),
                Plot.dot(data1, Plot.pointerX({ x: "datetime", y: d => +d.sma, stroke: "#bf0603" })),
                Plot.text(this.timeSeries, Plot.pointerX({
                    px: "datetime", py: "close", dy: -17, frameAnchor: "top-right", fontVariant: "tabular-nums",
                    text: (d) => [`Close: ${(+d.close).toFixed(2)}`].join("   "),
                    fontWeight: "bold", fontSize: 14, fill: '#5c667a'
                })),
                Plot.text(data1, Plot.pointerX({
                    px: "datetime", py: d => +d.sma, frameAnchor: "top-right", fontVariant: "tabular-nums",
                    text: (d) => [`${this.$functions.formattedDate(d.datetime, this.chartInterval)}`, `SMA: ${(+d.sma).toFixed(2)}`].join("   "),
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

    @media only screen and (max-width: 560px) {
        padding: 0 !important;
    }

    .title {
        text-align: left;
        font-weight: 600;
        font-size: 16px;
        color: #315098;
        margin-bottom: 20px;
    }
}
</style>