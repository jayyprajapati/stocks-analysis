import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    stockList: null,
    symbol: null,
    companyDetails: {},
    // stockInfo: null,
    rsiMin: 40,
    rsiMax: 60,
    dailyRsiData: null,
    weeklyRsiData: null,
    monthlyRsiData: null,
    timeSeries: null
  },
  getters: {
    stockList: (state) => {
      if(state.stockList.error){
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
      if(state.symbol && !state.stockList.error) {
        return state.stockList['data'].filter((x) => x.symbol == state.symbol)
      } else {
        return {error: true}
      }
    },
    rsiMin: (state) => {
      return state.rsiMin
    },
    rsiMax: (state) => {
      return state.rsiMax
    },
    dailyRsiData: (state) => {
      return state.dailyRsiData
    },
    weeklyRsiData: (state) => {
      return state.weeklyRsiData
    },
    monthlyRsiData: (state) => {
      return state.monthlyRsiData
    },
    timeSeries: (state) => {
      return state.timeSeries
    }
  },
  mutations: {
    MutateStocksList(state, payload) {
      state.stockList = payload
    },
    MutateCompanyDetails(state, payload) {
      state.companyDetails = payload;
    },
    MutateRSIData(state, payload){
      if(payload.error) {
        state[payload.interval+ 'RsiData'] = payload
      } else {
        const interval = payload["meta"]["4: Interval"];
        state[interval + 'RsiData'] = payload;
      }
    },
    MutateTimeSeries(state, payload) {
      state.timeSeries = payload
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

      if(resp.status === 200) {
        context.commit('MutateStocksList', data);
      } else {
        context.commit('MutateStocksList', {error: true});
      }
    },
    async FetchCompanyDetails(context, payload) {
      const companyDetailsEndpoint  = process.env.VUE_APP_API_URL + `/stocks/companyDetails?symbol=${payload}`;

      const resp = await axios.get(companyDetailsEndpoint);
      const data = resp.data;
      if(resp.status === 200) {
        context.commit('MutateCompanyDetails', data);
      } else {
        context.commit('MutateCompanyDetails', {error: true})
      }
    },
    async FetchTimeSeries(context, payload) {
      const timeSeriesEndpoint = process.env.VUE_APP_API_URL + '/stocks/timeseries?symbol=' + payload ;

      const resp = await axios.get(timeSeriesEndpoint);
      if(resp.status === 200) {
        context.commit('MutateTimeSeries', resp.data)
      } else {
        context.commit('MutateTimeSeries', {error: true})
      }
    },
    async FetchRSIData(context, payload) {
      console.log('Hitting API for RSI');
      
      const RSIEndpoint = process.env.VUE_APP_API_URL + `/stocks/getRSIData?symbol=${payload.symbol}&timePeriod=${payload.timePeriod}&interval=${payload.interval}&seriesType=${payload.seriesType}`;

      const resp = await axios.get(RSIEndpoint);
      const data = resp.data

      if(resp.status === 200){
        context.commit('MutateRSIData', data);
      } else {
        context.commit('MutateRSIData', {error: true, interval: payload.interval})
      }
    }
  },
  modules: {
  }
})
