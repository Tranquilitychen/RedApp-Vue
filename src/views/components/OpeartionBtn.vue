<template>
  <div>
    <el-button size="small" @click="saveData">保存</el-button>
    <el-button size="small" @click="exit">退出</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    saveData() {
      this.$emit("saveData");
    },
    exit() {
      this.$emit("closeDialog");
    }
  }
};
</script>
