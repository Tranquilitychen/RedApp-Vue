<template>
  <el-container class="el-header">
    <el-menu
      :default-active="this.$route.path"
      router
      mode="horizontal"
      class="el-menu-demo"
      @select="handleSelect"
      background-color="#8DB6CD"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="(item, index) in routers">
        <el-submenu
          v-if="!item.hidden"
          :key="item.id"
          :index="index + ''"
          class="el-submenu-demo"
        >
          <template slot="title">
            {{ item.meta.title }}
          </template>
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >
            {{ subItem.meta.title }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      routers: [],
      // 顶部下拉菜单所需参数
      activeIndexMenu: "1",
      tabIndex: 2
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      this.routers = this.$store.state.userInfo.userInfo.menuList;
      console.log("Header.vue ------------------");
      console.log(this.routers);
    },
    // 顶部 导航栏变化
    handleSelect(key, keyPath) {
      console.log(keyPath, key);
    }
  }
};
</script>
<style scoped>
.el-header {
  padding: 0px;
  height: 39px;
  text-align: center;
  line-height: 30px;
  color: #333;
  background-color: #b3c0d1;
}
.divider-style {
  margin: 0px;
}
.el-menu-demo {
  padding: 0px;
}
.el-submenu-demo >>> .el-submenu__title {
  height: 39px !important;
  line-height: 39px !important;
}
</style>
