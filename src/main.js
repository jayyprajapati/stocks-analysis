import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/js/bootstrap.js'
const app = createApp(App);

app.config.globalProperties.$functions = {
    formattedDate: (dateStr, interval) => {
        const date = new Date(dateStr);
        const optionsDailyWeekly = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsMonthly = { month: 'short', year: 'numeric' };
        switch(interval) {
            case 'Daily':
            case 'Weekly':
                return date.toLocaleDateString('en-GB', optionsDailyWeekly);
            case 'Monthly':
                return date.toLocaleDateString('en-GB', optionsMonthly);
            default:
                return dateStr; // Default case if interval doesn't match
        }
    }
}
app.use(store).use(router).mount('#app')
