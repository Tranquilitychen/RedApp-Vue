import { adminRouter, salesRouter, cleanRouter, fixedRouter } from "@/router";
import router from "@/router";
import store from "@/store";
// progress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

var addRouFlag = false;
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!addRouFlag) {
    // 没有登录所以没有值
    let data = {
      operid: "001",
      username: "admin",
      role: "admin",
      token: ""
    };
    store.commit("userInfo/SET_LOGIN_INFO", data);
    let storeInfo = store.state.userInfo.userInfo;
    console.log("permission");
    console.log(storeInfo);
    addRouFlag = true;
    router.addRoutes(adminRouter);
    store.commit("userInfo/SET_ROLE_MENU", fixedRouter.concat(adminRouter));
    router.push({ path: to.path });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});
/* router.beforeEach((to, from, next) => {
  // 1. 获取用户的角色信息
  let storeInfo = store.state.userInfo.userInfo;
  console.log("---------Permission----------");
  console.log(storeInfo);
  console.log(storeInfo != "undefined" && storeInfo.username != "");
  // 判断用户是否登录
  if (storeInfo.role != "" && storeInfo.username != "") {
    // addRouflag说明没有进行路由表的筛选
    if (!addRouFlag) {
      addRouFlag = true;
      // 2. 根据用户的角色 和 需要动态显示的路由，生成符合用户角色的路由
      let menu = [];
      switch (storeInfo.role) {
        case "admin":
          menu = adminRouter;
          break;
        case "sales":
          menu = salesRouter;
          break;
        case "clean":
          menu = cleanRouter;
          break;
      }
      console.log("menu", menu);
      let routerMenu = fixedRouter.concat(menu);
      console.log(routerMenu);
      // 3.将数据存储到 store 中
      store.commit("userInfo/SET_ROLE_MENU", routerMenu);
      console.log("-------------");
      // 4. 生成好的路由进行addRouter
      router.addRoutes(routerMenu);
      // 5. push之后，会重新进入到beforeEach的钩子函数进行进一步判断
      console.log(to.path);
      router.push({ path: to.path });
    } else {
      next();
    }
  } else {
    // 用户没有登录
    if (to.path == "/login") {
      next();
    } else {
      next("/login");
    }
  }
}); */
