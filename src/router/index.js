import Vue from "vue";
import Router from "vue-router";
// 营业中心
import Layout from "@/layout/AppMain.vue";

Vue.use(Router); // 注册路由

export const fixedRouter = [
  {
    path: "/",
    name: "home",
    hidden: true,
    meta: {
      title: "主页"
    },
    component: Layout,
    redirect: "businessCenter"
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    meta: {
      title: "登录页面"
    },
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    meta: {
      title: "404"
    },
    component: () => import("@/views/404.vue")
  },
  {
    path: "/401",
    name: "401",
    hidden: true,
    meta: {
      title: "401"
    },
    component: () => import("@/views/401.vue")
  }
];

export const adminRouter = [
  {
    path: "/reservation",
    component: Layout,
    redirect: "/businessCenter",
    name: "reservation",
    meta: { title: "预定管理", requiresAuth: true, roles: [0, 1] },
    children: [
      {
        // 营业中心
        path: "/businessCenter",
        name: "businessCenter",
        meta: {
          title: "营业中心",
          requiresAuth: true
        },
        component: () => import("@/views/Business Center/bussiness_center.vue")
      },
      {
        // 散客预定
        path: "/guestBooking",
        name: "guestBooking",
        meta: { title: "散客预定", roles: [0] },
        component: () =>
          import("@/views/BookingManager/GuestBooking/GuestBooking.vue")
      },
      {
        // 团队预定
        path: "/teamBooking",
        name: "teamBooking",
        meta: { title: "团队预定", roles: [0] },
        component: () =>
          import("@/views/BookingManager/TeamBooking/TeamBooking.vue")
      },
      {
        // 预定查询
        path: "/queryReception",
        name: "queryReception",
        meta: { title: "预定查询", roles: [0] },
        component: () =>
          import("@/views/Reception/QueryReception/QueryReception.vue")
      }
    ]
  },
  {
    path: "/checkin",
    component: Layout,
    redirect: "/guestCheckIn",
    name: "checkin",
    meta: { title: "接待管理", roles: [0, 1] },
    children: [
      {
        // 散客入住
        path: "/guestCheckIn",
        name: "guestCheckIn",
        meta: { title: "散客入住", roles: [0] },
        component: () => import("@/views/Reception/Guest/guest.vue")
      },
      {
        // 团队入住
        path: "/teamCheckIn",
        name: "teamCheckIn",
        meta: { title: "团队入住", roles: [0] },
        component: () => import("@/views/Reception/Team/team.vue")
      },
      {
        // 房间清理
        path: "/cleanRoom",
        name: "cleanRoom",
        meta: { title: "客房清理", roles: [0] },
        component: () => import("@/views/CleanRoom/CleanRoom.vue")
      }
    ]
  },
  {
    path: "/baseinfo",
    component: Layout,
    redirect: "/roomInformation",
    name: "baseinfo",
    meta: { title: "基础资料", roles: [0] },
    children: [
      {
        // 客房资料
        path: "/roomInformation",
        name: "roomInformation",
        meta: { title: "客房资料", roles: [0] },
        component: () =>
          import("@/views/BasicInformation/RoomInformation/RoomInformation.vue")
      },
      {
        // 客人资料
        path: "/guestInformation",
        name: "guestInformation",
        meta: { title: "客人资料", roles: [0] },
        component: () =>
          import(
            "@/views/BasicInformation/GuestInformation/GuestInfomation.vue"
          )
      },
      {
        // 消费项目
        path: "/itemInformation",
        name: "itemInformation",
        meta: { title: "消费项目", roles: [0] },
        component: () =>
          import("@/views/BasicInformation/ItemInformation/ItemInformation.vue")
      },
      {
        // 消费项目
        path: "/payDetailed",
        name: "payDetailed",
        meta: { title: "账单明细", roles: [0] },
        component: () =>
          import("@/views/BasicInformation/PayDetaileds/PayDetailed.vue")
      },
      {
        path: "/about",
        name: "about",
        hidden: true,
        meta: {
          title: "临时页面"
        },
        component: () => import("@/views/about.vue")
      }
    ]
  }
];
export const salesRouter = [
  {
    path: "/reservation",
    component: Layout,
    redirect: "/reservation",
    name: "reservation",
    meta: { title: "预定管理", requiresAuth: true, roles: [0, 1] },
    children: [
      {
        // 营业中心
        path: "/businessCenter",
        name: "businessCenter",
        meta: {
          title: "营业中心",
          requiresAuth: true
        },
        component: () => import("@/views/Business Center/bussiness_center.vue")
      },
      {
        // 散客预定
        path: "/guestBooking",
        name: "guestBooking",
        meta: { title: "散客预定", roles: [0] },
        component: () =>
          import("@/views/BookingManager/GuestBooking/GuestBooking.vue")
      },
      {
        // 团队预定
        path: "/teamBooking",
        name: "teamBooking",
        meta: { title: "团队预定", roles: [0] },
        component: () =>
          import("@/views/BookingManager/TeamBooking/TeamBooking.vue")
      },
      {
        // 预定查询
        path: "/queryReception",
        name: "queryReception",
        meta: { title: "预定查询", roles: [0] },
        component: () =>
          import("@/views/Reception/QueryReception/QueryReception.vue")
      }
    ]
  },
  {
    path: "/checkin",
    component: Layout,
    redirect: "/guestCheckIn",
    name: "checkin",
    meta: { title: "接待管理", roles: [0, 1] },
    children: [
      {
        // 散客入住
        path: "/guestCheckIn",
        name: "guestCheckIn",
        meta: { title: "散客入住", roles: [0] },
        component: () => import("@/views/Reception/Guest/guest.vue")
      },
      {
        // 团队入住
        path: "/teamCheckIn",
        name: "teamCheckIn",
        meta: { title: "团队入住", roles: [0] },
        component: () => import("@/views/Reception/Team/team.vue")
      }
    ]
  }
];
export const cleanRouter = [];

export default new Router({
  mode: "history",
  routes: fixedRouter
});

/* // 路由登录验证
const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  let loginFlag = localStorage.getItem("loginFlag");
  console.log("getFlag：" + loginFlag + "  router.beforeEach.");
  // 检测是否登录过
  if (loginFlag) {
    // 如果跳转的页面是登录页面
    if (to.path === "/login") {
      if (loginFlag) {
        next();
      } else {
        // 获取登录信息
        const userInfo = localStorage.getItem("userdata");
        // 如果存在登录信息就通行
        if (userInfo) {
          next();
        } else {
          // 不存在登录用户信息就重新登录
          next("/login");
        }
      }
    } else {
      // 跳转页面不是登录页面
      // 没有登录，如果跳转的页面是不需要登录的页面就跳转过去
      console.log(to.meta.requireAuth);
      if (!to.meta.requireAuth) {
        next();
      } else {
        // 如果是需要登录的跳转页面就跳转到登录页面
        next("/login");
      }
    }
  } else {
    // 没有登录就跳转到登录页面
    next("/login");
  }
}); */
