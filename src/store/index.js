import Vue from "vue";
import Vuex from "vuex";
import userInfo from "./modules/userInfo";
import getters from "./getter";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    userInfo
  },
  getters
});
