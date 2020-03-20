<template>
  <el-container class="el-footer">
    <el-row style="width:100%">
      <el-col :span="6">【红苹果酒店客房管理系统V1.0】</el-col>
      <el-col :span="6">操作员：{{ opearName }}</el-col>
      <el-col :span="12">{{ date }}</el-col>
    </el-row>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      date: "",
      opearName: ""
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      let userInfo = this.$store.state.userInfo.userInfo;
      console.log(userInfo);
      this.opearName = userInfo.username;
      let now = new Date();
      this.date =
        "今天是： " +
        now.getFullYear() +
        "年" +
        (now.getMonth() + 1) +
        "月" +
        now.getDate() +
        "日" +
        "       当前时间是：" +
        now.getHours() +
        "时" +
        now.getMinutes() +
        "分" +
        now.getSeconds() +
        "秒";
    }
  },
  mounted() {
    let _this = this;
    this.timer = setInterval(() => {
      let now = new Date();
      _this.date =
        "今天是： " +
        now.getFullYear() +
        "年" +
        (now.getMonth() + 1) +
        "月" +
        now.getDate() +
        "日" +
        "       当前时间是：" +
        now.getHours() +
        "时" +
        now.getMinutes() +
        "分" +
        now.getSeconds() +
        "秒";
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
.el-footer {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 20px !important;
  padding: 0px;
  text-align: left;
  line-height: 100%;
  background-color: #d3dce6;
}
</style>
