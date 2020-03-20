import { fixedRouter } from "@/router";

// 相当于 Data 定义属性（全局）
const state = {
  userInfo: {
    operid: "",
    username: "",
    role: "",
    token: "",
    menuList: []
  }
};
// 相当于  Methods 定义方法（全局）,唯一允许更改state的方式
//commit：同步操作，写法：this.$store.commit('mutations方法名',值)
const mutations = {
  // 判断是否有用户进行登录，如果有返回 权限登录所需要的菜单 (有点问题)
  SET_LOGIN_INFO: (state, resultData) => {
    state.userInfo.operid = resultData.operid;
    state.userInfo.username = resultData.username;
    state.userInfo.role = resultData.role;
  },
  SET_ROLE_MENU: (state, router) => {
    console.log(router);
    state.userInfo.menuList = router;
  },
  LOGIN_OUT: state => {
    state.userInfo.operid = "";
    state.userInfo.username = "";
    state.userInfo.role = "";
    state.userInfo.token = "";
    state.userInfo.menuList = [];
  }
};
// 触发改动，当使用一部操作 dispatch的时候
// dispatch：含有异步操作，例如向后台提交数据，写法：
// this.$store.dispatch('action方法名',值)
const actions = {
  generateRoutes({ commit, state }) {
    return;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
