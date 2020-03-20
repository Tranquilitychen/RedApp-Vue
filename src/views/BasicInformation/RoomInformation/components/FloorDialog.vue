<template>
  <div>
    <el-dialog
      class="dialog-custom"
      title="楼层资料"
      width="500px"
      center
      :visible.sync="dialogFloorVisible"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
    >
      <div class="flex-direction-row">
        <div class="floor-left">
          <el-table
            :data="pageFloorOptions"
            height="240px"
            border
            highlight-current-row
            :row-class-name="floorTableRowClassName"
            @row-click="floorTableRowClick"
          >
            <el-table-column type="index" label="序"></el-table-column>
            <template v-for="(item, index) in floorHeader">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :sortable="item.isSort"
                :key="index"
              ></el-table-column>
            </template>
          </el-table>
        </div>
        <div class="floor-right">
          <div class="floor-right-center">
            <div class="floor-center-input">
              <div style="width:120px;margin:3px 0px;">楼层编码：</div>
              <el-input
                v-model="floorJson.floorno"
                placeholder=""
                disabled
                size="mini"
              ></el-input>
            </div>
            <div class="floor-center-input">
              <div style="width:120px;margin:3px 0px;">楼层名称：</div>
              <el-input
                v-model="floorJson.floorname"
                placeholder=""
                size="mini"
                @change="floornameDatachange"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="floorOpeartionBtn(1)">新增</el-button>
        <el-button @click="floorOpeartionBtn(2)" :disabled="floorDeleteDisable"
          >删除</el-button
        >
        <el-button @click="floorOpeartionBtn(3)">保存</el-button>
        <el-button @click="floorOpeartionBtn(0)">退出</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "../../../../utils/index";
import {
  apiFloorData,
  apiInsFloorData,
  apiUpdFloorData,
  apiDelFloorForFloorno
} from "@/request/api";
export default {
  props: {
    dialogFloorVisible: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      // 楼层资料Dialog显示
      pageFloorOptions: [],
      floorDeleteDisable: false,
      // 楼层管理中 表格的表头
      floorHeader: [
        {
          prop: "floorno",
          label: "楼层编码",
          isSort: true,
          width: "80"
        },
        {
          prop: "floorname",
          label: "楼层名称",
          isSort: true,
          width: "80"
        }
      ],
      // 楼层管理中的 input框
      floorJson: {
        floorno: "",
        floorname: "",
        currentIndex: 0
      },
      floorDataChange: false
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      console.log("initialize");
      apiFloorData({}).then(res => {
        this.pageFloorOptions = res;
        this.floorJson.floorno = res[0].floorno;
        this.floorJson.floorname = res[0].floorname;
        console.log(this.pageFloorOptions);
      });
    },
    /**
     * 楼层 Dialog内的操作按钮的点击事件
     */
    floorOpeartionBtn(code) {
      switch (code) {
        case 1:
          this.floorInsert();
          break;
        case 2:
          this.floorDelete();
          break;
        case 3:
          this.floorSave();
          break;
        case 0:
          this.floorExit();
          break;
      }
    },
    /**
     * 当前最大的楼层id，返回 +1 的Floorno
     */
    maxFloorno(array) {
      let maxno = 0;
      for (var i = 0; i < array.length; i++) {
        if (Number(array[i].floorno) > maxno) {
          maxno = Number(array[i].floorno);
        }
      }
      maxno++;
      if (maxno > 1000) {
        return "000" + maxno;
      } else if (maxno > 100) {
        return "00" + maxno;
      } else {
        return "0" + maxno;
      }
    },
    /**
     * 楼层Input数据变化
     */
    floornameDatachange(val) {
      this.floorDataChange = true;
    },
    /**
     * 楼层 表格 斑马线样式设置
     */
    floorTableRowClassName({ row, rowIndex }) {
      row.currentIndex = rowIndex;
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    /**
     * 楼层 表格行点击事件
     */
    floorTableRowClick(row, column, e) {
      console.log("rowClick", this.floorJson);
      if (this.floorDataChange) {
        // 楼层变化为 true
        let oldFloorJson = deepClone(this.floorJson);
        this.tableRowSaveConfirm(oldFloorJson, row);
      } else {
        this.floorDeleteDisable = false;
        // 初始化 floorJson
        this.floorJson.floorno = row.floorno;
        this.floorJson.floorname = row.floorname;
        this.floorJson.currentIndex = row.currentIndex;
        console.log(this.floorJson);
      }
    },
    /**
     * 楼层新增按钮事件
     */
    floorInsert() {
      // 数据发生改变了
      if (this.floorDataChange) {
        // 如果数据改变了，点击 Insert 时，提示是否保存
        this.saveConfirm();
      } else {
        let maxno = 0;
        // 0. 获取最大的楼层编号
        console.log(this.pageFloorOptions);
        maxno = this.maxFloorno(this.pageFloorOptions);
        // 1. 清空输入框中的数据
        this.floorJson = {
          floorno: maxno,
          floorname: "",
          currentIndex: 0
        };
        // 2. 编号的禁止输入关闭
        this.floorDeleteDisable = true;
      }
    },
    /**
     * 楼层保存按钮
     */
    floorSave() {
      // 编号的禁止输入标签，说明当前状态为 新增状态
      if (this.floorDeleteDisable) {
        // 保存新增状态
        console.log("新增楼层", this.floorJson);
        // 新增楼层 api
        apiInsFloorData({
          floorJson: JSON.stringify(this.floorJson)
        }).then(res => {
          console.log(res);
          if (res.code == 200) {
            this.refreshPage();
          }
        });
      } else {
        if (this.floorDataChange) {
          // 不是新增只能是更新
          console.log("更新", this.floorJson);
          apiUpdFloorData({
            floorJson: JSON.stringify(this.floorJson)
          }).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.refreshPage();
            }
          });
        }
      }
    },
    /**
     * 楼层删除按钮
     */
    floorDelete() {
      console.log("删除Json：", this.floorJson);
      this.$confirm("此操作将永久删除该项条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          apiDelFloorForFloorno({
            floorno: this.floorJson.floorno
          }).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.refreshPage();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 楼层Dialog退出按钮
     */
    floorExit() {
      if (this.floorDataChange) {
        this.$confirm(
          "检测到未保存的内容，是否在离开页面前保存修改？",
          "确认信息",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "保存",
            cancelButtonText: "放弃修改"
          }
        )
          .then(() => {
            if (this.floorDeleteDisable) {
              // 为true说明保存 新增内容
              console.log("新增内容：", this.floorJson);
              apiInsFloorData({
                floorJson: JSON.stringify(this.floorJson)
              }).then(res => {
                if (res.code == 200) {
                  this.$message.success("删除成功！");
                }
              });
            } else {
              // 更新内容
              console.log("更新内容：", this.floorJson);
              apiUpdFloorData({
                floorJson: JSON.stringify(this.floorJson)
              }).then(res => {
                if (res.code == 200) {
                  this.$message.success("删除成功！");
                }
              });
            }
            this.$emit("update:dialogFloorVisible", false);
          })
          .catch(action => {
            if (action === "cancel") {
              console.log("取消按钮");
              // dataChange 修改为 false
              this.floorDataChange = false;
              // 退出页面
              this.$emit("update:dialogFloorVisible", false);
            } else {
              console.log("x号关闭按钮");
            }
          });
      } else {
        this.$emit("update:dialogFloorVisible", false);
      }
    },
    // 表格行发生变化时，点击新增按钮
    saveConfirm() {
      this.$confirm(
        "检测到未保存的内容，是否在离开页面前保存修改？",
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "保存",
          cancelButtonText: "放弃修改"
        }
      )
        .then(() => {
          // 保存修改
          this.$message({
            type: "info",
            message: "保存修改"
          });
          if (this.floorDeleteDisable) {
            // 为true说明保存 新增内容
            console.log("新增内容：", this.floorJson);
            apiInsFloorData({
              floorJson: JSON.stringify(this.floorJson)
            }).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.refreshPage();
                this.floorInsert();
              }
            });
          } else {
            // 更新内容
            console.log("更新内容：", this.floorJson);
            apiUpdFloorData({
              floorJson: JSON.stringify(this.floorJson)
            }).then(res => {
              if (res.code == 200) {
                this.refreshPage();
                this.floorInsert();
              }
            });
          }
          // dataChange 设置为 false
          this.floorDataChange = false;
          this.floorDeleteDisable = false;
          // 插入操作
          this.floorInsert();
        })
        .catch(action => {
          // 取消 点击
          if (action === "cancel") {
            console.log("取消操作");
            // dataChange 修改为 false
            this.floorDataChange = false;
            // 插入操作
            this.floorInsert();
          } else {
            // 停留在当前页
            console.log("不保存直接退出");
          }
        });
    },
    // 表格行发生变化时，换行
    tableRowSaveConfirm(oldFloorJson, row) {
      this.$confirm(
        "检测到未保存的内容，是否在离开页面前保存修改？",
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "保存",
          cancelButtonText: "放弃修改"
        }
      )
        .then(() => {
          if (this.floorDeleteDisable) {
            // 为true说明保存 新增内容
            console.log("新增内容：", oldFloorJson);
            apiInsFloorData({
              floorJson: JSON.stringify(oldFloorJson)
            }).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.reloadClickRow(row);
              }
            });
          } else {
            // 更新内容
            console.log("更新内容：", oldFloorJson);
            apiUpdFloorData({
              floorJson: JSON.stringify(oldFloorJson)
            }).then(res => {
              console.log(res);
              if (res.code == 200) {
                // dataChange 设置为 false
                this.reloadClickRow(row);
              }
            });
          }
        })
        .catch(action => {
          // 取消 点击
          if (action === "cancel") {
            console.log("取消操作");
            // dataChange 修改为 false
            this.floorDataChange = false;
            // 初始化信息
            this.floorJson.floorno = row.floorno;
            this.floorJson.floorname = row.floorname;
            this.floorJson.currentIndex = row.currentIndex;
          } else {
            // 停留在当前页
            console.log("不保存直接退出");
          }
        });
      console.log("last");
    },
    refreshPage() {
      this.floorDeleteDisable = false;
      this.floorDataChange = false;
      this.initialize();
    },
    reloadClickRow(row) {
      this.floorDeleteDisable = false;
      this.floorDataChange = false;
      apiFloorData({}).then(res => {
        this.pageFloorOptions = res;
        console.log(this.pageFloorOptions);

        this.floorJson.floorno = row.floorno;
        this.floorJson.floorname = row.floorname;
        this.floorJson.currentIndex = row.currentIndex;
      });
    }
  }
};
</script>
<style scoped>
.flex-direction-row {
  display: flex;
  flex-direction: row;
}
.dialog-custom >>> .el-dialog__header {
  background-color: #d3e0f1 !important;
}
.dialog-custom >>> .el-dialog__body {
  padding: 10px 20px;
  background-color: #bfdbff;
}
.dialog-custom >>> .el-dialog__footer {
  background-color: #8db3f4;
}
.floor-left {
  margin-right: 10px;
  height: 240px;
  width: 240px;
  border: 2px inset #f1efe2;
}
.floor-right {
  margin-left: 10px;
  height: 240px;
  width: 260px;
  border: 2px inset #f1efe2;
}
.el-table >>> th {
  padding: 0px;
  font-size: 9px;
}
.el-table >>> td {
  padding: 0px;
}
.el-table >>> .warning-row {
  background-color: #ffffff;
}
.el-table >>> .success-row {
  background-color: #ffffd2;
}
.floor-right-center {
  padding: 60px 0px;
}
.floor-center-input {
  display: flex;
  flex-direction: row;
  margin: 30px 0px;
}
</style>
