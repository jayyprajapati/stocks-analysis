<template>
  <div>
    Stock analysis
    <!-- <canvas id="rsiChart"></canvas> -->
    <div class="chart-view">
      <WeeklyRSIAnalysis />
      <MonthlyRSIAnalysis />
    </div>
    

  </div>
</template>

<script>
// @ is an alias to /src
// import { Chart } from "chart.js/auto";
// import rsiData from '@/assets/json/rsiData.json';
// import annotationPlugin from 'chartjs-plugin-annotation';

import MonthlyRSIAnalysis from "@/components/MonthlyRSIAnalysis.vue";
import WeeklyRSIAnalysis from "@/components/WeeklyRSIAnalysis.vue";

// Chart.register(annotationPlugin);
export default {
  name: 'HomeView',
  // mounted() {
  //   this.createChart();
  // },
  components: {
    MonthlyRSIAnalysis,
    WeeklyRSIAnalysis
  },
  // data() {
  //   return {
  //     rsiData: rsiData["Technical Analysis: RSI"],
  //   };
  // },
//   methods: {
//     createChart() {
//       const ctx = document.getElementById("rsiChart").getContext("2d");

//       // Extract dates and RSI values
//       const labels = Object.keys(rsiData["Technical Analysis: RSI"]).slice(0, 100);
//       const dataPoints = labels.map(
//         (date) => parseFloat(rsiData["Technical Analysis: RSI"][date]["RSI"])
//       ).slice(0, 100);

//       const data = {
//         labels: labels.reverse(),
//         datasets: [
//           {
//             label: "RSI",
//             data: dataPoints.reverse(),
//             borderColor: "rgba(75, 192, 192, 1)",
//             backgroundColor: "rgba(75, 192, 192, 0.2)",
//             fill: true,
//             tension: 0.1,
//           },
//         ],
//         // yHighlightRange : {
//         //   begin: 40,
//         //   end: 60
//         // }
//       };
//       const options = {
//         scales: {
//           y: {
//             beginAtZero: true,
//             min: 0,
//             max: 100,
//             ticks: {
//               stepSize: 20,
//             },
//           },
//         },
//         plugins: {
//           annotation: {
//             annotations: {
//               box1: {
//                 type: 'box',
//                 yMin: 40,
//                 yMax: 60,
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderWidth: 0
//               },
//             },
//           },
//         },
//       };

//       new Chart(ctx, {
//         type: "line",
//         data,
//         options,
//       });
//   },
// } 
}
</script>

<style scoped lang="scss">

.chart-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>