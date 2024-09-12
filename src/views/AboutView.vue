<template>
  <div class="about container">
    <div class="title">Please spend few mins to understand how this application is structured</div>
    <div class="divider"></div>
    <div class="section">
      <div class="title">Disclaimer</div>
      <div class="desc">The data presented in this application is sourced from publicly available free-tier APIs, and as such, its accuracy and reliability cannot be guaranteed. This project was developed purely for learning purposes.</div>
    </div>
    <div class="section">
      <div class="title">The Goal</div>
      <div class="desc">The aim of this application was to simplify and enhance stock analysis through an improved user interface. During development, we encountered several challenges, particularly with data availability, as free-tier APIs offer limited access. This constraint prevented us from providing the depth of data initially envisioned, such as <strong>comprehensive fundamental analysis</strong>, <strong>detailed company information</strong>, <strong>competitor comparisons</strong>, <strong>recent search history</strong>, and <strong>additional technical indicators</strong>. Certain options, such as <strong>country selection</strong>, <strong>stock exchange preferences</strong>, and <strong>technical indicator filters</strong>, are restricted and cannot be adjusted due to <strong>API call limitations</strong>. These constraints arise from the free-tier API's rate limits and available data, preventing us from offering full flexibility in these areas. Looking ahead, we plan to integrate stock <strong>prediction and recommendation features using AI/ML</strong> to further enhance the application’s capabilities.</div>
    </div>
    <div class="section">
      <div class="title">Frontend flow</div>
      <div class="desc">This application is based on <strong>Vue3</strong> with <strong>vuex store management</strong> to manage the data. The UI/UX of the application was done using <strong></strong> Figma. The graph visualization is done with the help of <strong>D3.js</strong> based library called <strong>observablehq/plot</strong>.</div>
      <div class="tech">
        <img src="../assets/svg/tech/Vue.svg" alt="">
        <img src="../assets/svg/tech/D3.svg" alt="">
        <img src="../assets/svg/tech/Scss.svg" alt="">
        <img src="../assets/svg/tech/Figma.svg" alt="">
      </div>
    </div>
    <div class="section">
      <div class="title">Backend flow</div>
      <div class="desc">The backend, built with <strong>Node.js</strong> and <strong>Express</strong>, integrates <strong>Alpha Vantage</strong> endpoints via <strong>RapidAPI</strong>. <strong>Redis</strong> caches historical stock data for a day to reduce response times, ensuring faster performance for frequently browsed stocks. <strong>MongoDB</strong> stores persistent company details, optimizing repeated queries by minimizing redundant API calls. This setup enhances efficiency by leveraging Redis for short-term caching and MongoDB for long-term storage of static company information.</div>
      <div class="tech">
        <img src="../assets/svg/tech/Node.svg" alt="">
        <img src="../assets/svg/tech/Express.svg" alt="">
        <img src="../assets/svg/tech/Redis.svg" alt="">
        <img src="../assets/svg/tech/MongoDB.svg" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  border: 1px solid #dfe3e7;
  border-radius: 10px;
  padding: 20px;

  .title {
    color: #315098;
    font-weight: 600;
    font-size: 24px;
  }

  .divider {
    margin-block: 10px;
    height: 1px;
    width: 100%;
    background: #dfe3e7;
  }

  .section {
    margin-top: 10px;
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #111a2c;
      padding-block: 10px;
    }

    .desc {
      font-size: 12px;
      color: #5c667a;
    }

    .tech {
      display: flex;
      gap: 20px;
      padding: 5px;
      border: 1px solid #dfe3e7;
      border-radius: 5px;
      width: fit-content;
      margin-block: 10px;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }

  strong {
    color: #315098;
  }
}
</style>
