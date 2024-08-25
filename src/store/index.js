import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    symbol: null,
    rsiMin: 40,
    rsiMax: 60,
    dailyRsiData: null,
    weeklyRsiData: null,
    monthlyRsiData: null,
    timeSeries: null
  },
  getters: {
    symbol: (state) => {
      return state.symbol
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
