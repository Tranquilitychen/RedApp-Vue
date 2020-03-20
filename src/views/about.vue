<template>
  <div>
    <div>About Page</div>
    <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
    <v-divider />
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <div class="d-flex flex-row">
      <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
      <div>
        <el-input v-model="msg" placeholder=""></el-input>
      </div>
    </div>
    <div class="d-flex flex-row">
      <v-navigation-drawer
        v-model="drawer"
        :color="color"
        expand-on-hover
        mini-variant
        :src="bg"
        absolute
        dark
      >
        <v-list dense nav class="py-0">
          <v-list-item two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/81.jpg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Application</v-list-item-title>
              <v-list-item-subtitle>Subtext</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="router(this.$router.path)" to="about" link>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>123123</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="router(this.$router.path)"
            link
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-btn @click="drawer = !drawer">1231231</v-btn>
    </div>
    <div v-if="maskloadding">
      <!--  <div class="shadow"> -->
      <v-dialog
        v-model="maskloadding"
        persistent
        scrollable
        overlay-color="#A65353"
      >
        <WaterLodding />
      </v-dialog>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import WaterLodding from "./components/WaterLodding";
export default {
  name: "hello",
  components: {
    WaterLodding
  },
  data() {
    return {
      maskloadding: true,
      msg: "Welcome to Your Vue.js App",
      isCollapse: true,
      drawer: true,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard", to: "payDetailed" },
        { title: "Photos", icon: "mdi-image", to: "itemInformation" },
        { title: "About", icon: "mdi-help-box", to: "guestInformation" }
      ],
      color: "primary",
      colors: ["primary", "blue", "success", "red", "teal"],
      right: true,
      miniVariant: false,
      expandOnHover: false,
      background: false
    };
  },
  mounted() {
    this.drawLine();
  },
  computed: {
    bg() {
      return this.background
        ? "https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        : undefined;
    }
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization");
      let userInfo = this.$store.state.userInfo.userInfo;
      console.log(userInfo);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "在Vue中使用echarts" },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    router(path) {
      console.log(path);
    }
  }
};
</script>
<style scoped>
.shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 998;
  background-color: #000;
  opacity: 0.6;
  display: none;
}
</style>
