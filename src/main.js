import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import store from "./store";
// progress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import "default-passive-events";
import "./plugins/element.js";
import vuetify from "@/plugins/vuetify";
// 引入Echart
import echarts from "echarts";

import "@/icons"; // icon
import "@/permission.js"; //

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$nProgress = NProgress;

new Vue({
  Vuex,
  router,
  store,
  axios,
  vuetify,
  echarts,
  NProgress,
  render: h => h(App)
}).$mount("#app");
