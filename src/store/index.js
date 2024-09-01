import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    stockList: null,
    symbol: null,
    companyDetails: {},
    timeSeries: {
      Loading: false,
      Daily: {},
      Weekly: {},
      Monthly: {},
    },
    RSIData: {
      Loading: false,
      Daily: {},
      Weekly: {},
      Monthly: {},
      RSIRangeMin: null,
      RSIRangeMax: null
    },
    SMAData: {
      Loading: false,
      Daily: {},
      Weekly: {},
      Monthly: {}
    },
  },
  getters: {
    stockList: (state) => {
      if (state.stockList.error) {
        return state.stockList
      } else {
        return state.stockList['data']
      }
    },
    companyDetails(state) {
      return state.companyDetails
    },
    symbol: (state) => {
      return state.symbol
    },
    stockInfo: (state) => {
      if (state.symbol && !state.stockList.error) {
        return state.stockList['data'].filter((x) => x.symbol == state.symbol)
      } else {
        return { error: true }
      }
    },
    rsiMin: (state) => {
      return state.RSIData.RSIRangeMin
    },
    rsiMax: (state) => {
      return state.RSIData.RSIRangeMax
    },
    timeSeriesLoading: (state) => {
      return state.timeSeries.Loading
    },
    RSILoading: (state) => {
      return state.RSIData.Loading
    },
    SMALoading: (state) => {
      return state.SMAData.Loading
    },
    dailyRsiData: (state) => {
      return state.RSIData.Daily
    },
    weeklyRsiData: (state) => {
      return state.RSIData.Weekly
    },
    monthlyRsiData: (state) => {
      return state.RSIData.Monthly
    },
    dailySmaData: (state) => {
      return state.SMAData.Daily
    },
    weeklySmaData: (state) => {
      return state.SMAData.Weekly
    },
    monthlySmaData: (state) => {
      return state.SMAData.Monthly
    },
    dailyTimeSeries: (state) => {
      return state.timeSeries.Daily
    },
    weeklyTimeSeries: (state) => {
      return state.timeSeries.Weekly
    },
    monthlyTimeSeries: (state) => {
      return state.timeSeries.Monthly
    },
    timeSeries: (state) => {
      return state.timeSeries
    },
    rsiData: (state) => {
      return state.RSIData
    },
    smaData: (state) => {
      return state.SMAData
    }
  },
  mutations: {
    MutateStocksList(state, payload) {
      state.stockList = payload
    },
    MutateCompanyDetails(state, payload) {
      state.companyDetails = payload;
    },
    MutateLoaderState(state, payload) {
      state[payload].Loading = !state[payload].Loading
    },
    MutateRSIData(state, payload) {
      if (payload.error) {
        state.RSIData[payload.interval] = payload
      } else {
        // const interval = payload["meta"]["4: Interval"];
        state.RSIData[payload.interval] = payload;
      }
      this.commit('MutateLoaderState', 'RSIData')
    },
    MutateSMAData(state, payload) {
      if (payload.error) {
        state.SMAData[payload.interval] = payload
      } else {
        state.SMAData[payload.interval] = payload;
      }
      this.commit('MutateLoaderState', 'SMAData')
    },
    MutateTimeSeriesData(state, payload) {
      console.log("mutating time series for..." + payload.interval)
      state.timeSeries[payload.interval] = payload
      this.commit('MutateLoaderState', 'timeSeries')
    },
    MutateSymbol(state, payload) {
      state.symbol = payload
    }
  },
  actions: {
    async FetchStocksList(context, payload) {
      const stocksListEndpoint = `https://api.twelvedata.com/stocks?country=${payload.country}&exchange=${payload.exchange}`;

      const resp = await axios.get(stocksListEndpoint);

      const data = resp.data;

      if (resp.status === 200) {
        context.commit('MutateStocksList', data);
      } else {
        context.commit('MutateStocksList', { error: true });
      }
    },
    async FetchCompanyDetails(context, payload) {
      const companyDetailsEndpoint = process.env.VUE_APP_API_URL + `/stocks/companyDetails?symbol=${payload}`;

      const resp = await axios.get(companyDetailsEndpoint);
      const data = resp.data;
      if (resp.status === 200) {
        context.commit('MutateCompanyDetails', data);
      } else {
        context.commit('MutateCompanyDetails', { error: true })
      }
    },
    async FetchTimeSeries(context, payload) {
      try {
        context.commit('MutateLoaderState', 'timeSeries')
        const timeSeriesEndpoint = `${process.env.VUE_APP_API_URL}/stocks/timeseries?symbol=${payload.symbol}&interval=${payload.interval}`;
        const resp = await axios.get(timeSeriesEndpoint);
        if (resp.status === 200) {
          context.commit('MutateTimeSeriesData', {...resp.data, interval: payload.interval})
        } else {
          context.commit('MutateTimeSeriesData', { error: true, message: resp.data, interval: payload.interval })
        }
      } catch (error) {
        console.error(error)
        context.commit('MutateTimeSeriesData', { error: true, message: error.response.data, interval: payload.interval })
      }
    },
    async FetchTechnicalData(context, payload) {
      console.log(`Hitting API for ${payload.function}`);
      context.commit('MutateLoaderState', `${payload.function}Data`)
      try {
        const TechnicalDataEndpoint = `${process.env.VUE_APP_API_URL}/stocks/get${payload.function}Data?symbol=${payload.symbol}&timePeriod=${payload.timePeriod}&interval=${payload.interval}&seriesType=${payload.seriesType}`;
        const resp = await axios.get(TechnicalDataEndpoint);
        const data = resp.data;
        if (resp.status === 200) {
          context.commit(`Mutate${payload.function}Data`, {...data, interval: payload.interval});
        } else {
          context.commit(`Mutate${payload.function}Data`, { error: true, message: resp.data, interval: payload.interval });
        }
      } catch (error) {
        console.error(error);
        context.commit(`Mutate${payload.function}Data`, { error: true, message: error.response.data, interval: payload.interval });
      }
    },
  },
  modules: {
  }
})
