import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    symbol: "IBM",
    rsiMin: 40,
    rsiMax: 60,
    dailyRsiData: null,
    weeklyRsiData: null,
    monthlyRsiData: null,
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
    }
  },
  mutations: {
    MutateRsiData(state, payload) {
      state[payload.type + "RsiData"] = payload.data
    }
  },
  actions: {
    fetchRSI(context, payload) {
      const RSIEndpoint = 'https://www.alphavantage.co/query?function=RSI&symbol=IBM&interval=weekly&time_period=10&series_type=open&apikey=demo'
      // const RSIEndpoint = `https://www.alphavantage.co/query?function=RSI&symbol=${context.state.symbol}&interval=${payload.interval}&time_period=${payload.timePeriod}&series_type=${payload.seriesType}&apikey=demo`;

      axios.get(RSIEndpoint).then((res) => {
        if(res.status === 200) {
          context.commit('MutateRsiData', {"data":res.data, "type": payload.interval})
        } else {
          console.log("RSI data fetch failed");
        }
      })
    }
  },
  modules: {
  }
})
