<template>
  <div>
    <!-- 客房资料操作按钮 -->
    <div class="flex-direction">
      <div v-for="(btn, index) in groupButton" :key="'opeartion' + index">
        <el-button
          :icon="btn.icon"
          :style="{ 'background-color': btn.color, color: btn.fontColor }"
          class="operation-btn"
          @click="selectorMethos(btn.event)"
        >
          <br />
          {{ btn.content }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 操作按钮
      groupButton: [
        {
          type: 1,
          content: "新增",
          icon: "el-icon-search",
          color: "#a2b5cd",
          fontColor: "#000000",
          event: "insert"
        },
        {
          type: 1,
          content: "保存",
          icon: "el-icon-search",
          color: "#a2b5cd",
          fontColor: "#000000",
          event: "save"
        },
        {
          type: 2,
          content: "删除",
          icon: "el-icon-search",
          color: "#00ced1",
          fontColor: "#000000",
          event: "delete"
        },
        {
          type: 3,
          content: "批量新增",
          icon: "el-icon-search",
          color: "#00ced1",
          fontColor: "#000000",
          event: "batchInsert"
        },
        {
          type: 4,
          content: "房类设置",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "roomlbSetting"
        },
        {
          type: 4,
          content: "楼层设置",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "floorSetting"
        },
        {
          type: 5,
          content: "刷新",
          icon: "el-icon-edit",
          color: "#8ee5ee",
          fontColor: "#000000",
          event: "refresh"
        },
        {
          type: 5,
          content: "打印",
          icon: "el-icon-search",
          color: "#8ee5ee",
          fontColor: "#000000",
          event: "doPrint"
        },
        {
          type: 6,
          content: "退出",
          icon: "el-icon-edit",
          color: "#ff6a6a",
          fontColor: "#000000",
          event: "exit"
        }
      ]
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      console.log("OpeartionBtn");
    },
    selectorMethos(value) {
      this[value]();
    },
    insert() {
      this.$emit("insert");
    },
    save() {
      this.$emit("save");
    },
    delete() {
      this.$emit("delete");
    },
    /**
     * 批量新增按钮的点击事件
     */
    batchInsert() {
      this.$emit("batchInsert");
    },
    /**
     * 房类设置按钮的点击事件
     */
    roomlbSetting() {
      this.$emit("roomlbSetting");
    },
    /**
     * 楼层设置按钮的点击事件
     */
    floorSetting() {
      this.$emit("floorSetting");
    },
    /**
     * 刷新按钮
     */
    refresh() {
      this.$emit("refresh");
    },
    doPrint() {
      console.log("doPrint");
    },
    exit() {
      console.log("exit");
    }
  }
};
</script>
<style scoped>
.flex-direction {
  display: flex;
  flex-direction: row;
  border: 1px solid #ffffff;
  background-color: #d3e0f1;
}
</style>
