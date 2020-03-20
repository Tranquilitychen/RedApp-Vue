<template>
  <!-- 批量新增Dialog -->
  <div>
    <el-dialog
      class="dialog-custom"
      title="批量生成房间号"
      width="440px"
      center
      :visible.sync="dialogBatchInsertVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div>
        <div class="prefix">
          <fieldset>
            <legend>编号构成</legend>
            <div class="flex-direction-row">
              <div class="flex-direction-row">
                <div class="">编码前缀：</div>
                <el-input v-model="batchJson.id.prefix" size="mini"></el-input>
              </div>
              <div class="flex-direction-row">
                <div>编码从：</div>
                <el-input
                  v-model="batchJson.id.suffixStart"
                  size="mini"
                ></el-input>
              </div>
              <div class="flex-direction-row">
                <div>到：</div>
                <el-input
                  v-model="batchJson.id.suffixEnd"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="flex-direction-row">
              <div>尾号过滤：</div>
              <el-input
                v-model="batchJson.id.suffixFilter"
                size="mini"
              ></el-input>
            </div>
            <div>多个尾号过滤,请用逗号隔开</div>
          </fieldset>
        </div>
        <div class="suffix">
          <fieldset>
            <legend>房间属性</legend>
            <div class="flex-direction-row">
              <div class="flex-direction-row suffix-size">
                <div style="width:70px;fontSize:13px;margin-top:2px;">
                  房间类型：
                </div>
                <el-select
                  v-model="batchJson.type.roomlbno"
                  placeholder="请选择"
                  size="mini"
                  class="el-select-roominfo"
                >
                  <el-option
                    v-for="item in pageRoomlbOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="flex-direction-row suffix-size">
                <div style="fontSize:13px;margin-top:2px;">楼层：</div>
                <el-select
                  v-model="batchJson.type.floorno"
                  placeholder="请选择"
                  size="mini"
                  class="el-select-roominfo"
                >
                  <el-option
                    v-for="item in pageFloorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="batchInsertRoom(batchJson)">批量生成</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "../../../../utils/index";
import { apiInsertBatchRoomData } from "@/request/api.js";
export default {
  props: {
    dialogBatchInsertVisible: {
      type: Boolean,
      require: true
    },
    roomlbOptions: {
      type: Array,
      require: true
    },
    floorOptions: {
      type: Array,
      require: true
    }
  },
  inject: ["reload"],
  data() {
    return {
      pageFloorOptions: [],
      pageRoomlbOptions: [],
      // 批量资料JSON
      batchJson: {
        id: {
          prefix: "",
          suffixStart: "",
          suffixEnd: "",
          suffixFilter: ""
        },
        type: {
          roomlbno: "",
          floorno: ""
        }
      }
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.pageFloorOptions = deepClone(this.floorOptions);
      this.pageRoomlbOptions = deepClone(this.roomlbOptions);
      console.log(this.pageFloorOptions);
      console.log(this.pageRoomlbOptions);
    },
    /**
     * 批量新增房间（房间号）
     */
    batchInsertRoom(batchJson) {
      console.log(batchJson);
      // 1. 检查输入的字符是否符合规范
      let suffixFilter = batchJson.id.suffixFilter;
      if (batchJson.id.prefix == "") {
        return this.batchMessage("编码前缀不能为空", "warning");
      }
      if (batchJson.id.suffixStart == "" || batchJson.id.suffixEnd == "") {
        return this.batchMessage("编码范围不能为空", "warning");
      }
      if (batchJson.type.roomlbno == "") {
        return this.batchMessage("请选择房间类型", "error");
      }
      if (batchJson.type.floorno == "") {
        return this.batchMessage("请选择楼层", "error");
      }
      // 过滤的字符串
      let splitArray = [];
      if (suffixFilter != "") {
        splitArray = suffixFilter.split(",");
      }
      // 2. 检查批量的编号中是否有已经存在的
      let roomnoArray = [];
      // 2.1 编码前缀与编码后缀组合
      let suffixStartNum = Number(batchJson.id.suffixStart);
      let suffixEndNum = Number(batchJson.id.suffixEnd);
      for (var i = suffixStartNum; i <= suffixEndNum; i++) {
        let suffixNum = i + "";
        let differenceValue =
          batchJson.id.suffixStart.length - suffixNum.length;
        for (var j = 0; j < differenceValue; j++) {
          suffixNum = "0" + suffixNum;
        }
        let roomno = batchJson.id.prefix + suffixNum;
        let filterFlag = splitArray.filter(res => {
          return res === roomno;
        });
        if (filterFlag.length == 0) {
          roomnoArray.push(roomno);
        }
      }
      console.log(roomnoArray);
      // 3. 向后台发送添加请求（重新刷新页面） 或者 添加到表格数据中（保存时再请求后台）
      let postRoomArray = [];
      for (var k = 0; k < roomnoArray.length; k++) {
        postRoomArray.push({
          roomno: roomnoArray[k],
          roomlbno: batchJson.type.roomlbno,
          floorno: batchJson.type.floorno,
          beds: 1
        });
      }
      // 像后端传输的数据
      console.log(postRoomArray);
      this.postApiBatchRoom(postRoomArray);
    },

    postApiBatchRoom(postRoomArray) {
      apiInsertBatchRoomData({
        batchJsonRoom: JSON.stringify(postRoomArray)
      }).then(res => {
        if (res.code == 200) {
          this.batchMessage("批量添加成功", "success");
          this.reload();
        }
      });
    },

    /**
     * 批量添加中的消息提示
     */
    batchMessage(message, type) {
      this.$message({
        showClose: true,
        message: message,
        type: type,
        duration: 1000
      });
    },
    /**
     * 关闭Dialog
     */
    closeDialog() {
      this.$emit("update:dialogBatchInsertVisible", false);
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
.el-select-roominfo {
  margin: 0px 10px;
  width: 100px;
}
.suffix-size {
  width: 180px;
}
</style>
