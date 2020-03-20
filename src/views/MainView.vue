<template>
  <div>
    <!-- 表头导航 -->
    <!--     <el-header style="padding:0px;">
      <page-header />
    </el-header> -->
    <!-- 变换服务页面 -->
    <!--     <el-container class="router-page-container"> -->
    <router-view :key="key" v-if="IsRouterAlive" />
    <!--     </el-container> -->
    <!-- 底部菜单 -->
    <!--     <el-footer>
      <page-footer />
    </el-footer> -->
  </div>
</template>
<script>
/* import PageHeader from "../layout/Header";
import PageFooter from "../layout/Footer"; */

export default {
  name: "app",
  components: {
    /*     PageHeader,
    PageFooter */
  },
  // 暴露 reload 方法，方便后面的组件使用
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      IsRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.IsRouterAlive = false;
      this.$nextTick(function() {
        this.IsRouterAlive = true;
      });
    }
  },
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>
<style scoped>
.router-page-container {
  width: 100%;
}
</style>
