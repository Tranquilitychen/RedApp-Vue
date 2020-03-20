<template>
  <div>
    <el-dialog
      class="dialog-custom"
      title="批量生成房间号"
      width="700px"
      center
      :visible.sync="dialogRoomlbVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div>
        <div class="dialog-top">
          <el-table
            :data="pageRoomlbData"
            height="180px"
            border
            highlight-current-row
            :row-class-name="tableRowClassName"
            @row-click="tableRowClick"
          >
            <el-table-column type="index" label="序"></el-table-column>
            <template v-for="(item, index) in header">
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
        <div class="dialog-bottom">
          <div>
            <!-- 第一行 -->
            <el-row :gutter="24">
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">房类编码：</div>
                <el-input
                  v-model="roomlbJson.roomlbno"
                  size="mini"
                  placeholder=""
                  disabled
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">房类名称：</div>
                <el-input
                  v-model="roomlbJson.roomlbname"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">房类简称：</div>
                <el-input
                  v-model="roomlbJson.subname"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
            </el-row>
            <!-- 第二行 -->
            <el-row :gutter="24">
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">
                  床位：
                </div>
                <el-input-number
                  v-model="roomlbJson.beds"
                  size="mini"
                  controls-position="right"
                  :min="1"
                  :max="10"
                  class="el-input-roomlb"
                ></el-input-number>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">早餐份数：</div>
                <el-input-number
                  v-model="roomlbJson.breakfasts"
                  size="mini"
                  controls-position="right"
                  :min="1"
                  :max="10"
                  class="el-input-roomlb"
                ></el-input-number>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">标准房价：</div>
                <el-input
                  v-model="roomlbJson.price"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
            </el-row>
            <!-- 第三行 -->
            <el-row :gutter="24">
              <el-col :span="8" class="flex-direction-row">
                <el-checkbox v-model="longroomflag" @change="checkboxChange"
                  ><div class="el-input-prev-label-long">
                    可开长包房
                  </div></el-checkbox
                >
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">长包房价：</div>
                <el-input
                  v-model="roomlbJson.longprice"
                  size="mini"
                  placeholder=""
                  :disabled="!longroomflag"
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">凌晨房价：</div>
                <el-input
                  v-model="roomlbJson.nlcfprice"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
            </el-row>
            <!-- 第四行 -->
            <el-row :gutter="24">
              <el-col :span="8" class="flex-direction-row">
                <el-checkbox v-model="timeroomflag" @change="checkboxChange"
                  ><div class="el-input-prev-label-long">
                    可开终点房
                  </div></el-checkbox
                >
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">钟点房价：</div>
                <el-input
                  v-model="roomlbJson.timeprice"
                  size="mini"
                  placeholder=""
                  :disabled="!timeroomflag"
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">周末房价：</div>
                <el-input
                  v-model="roomlbJson.weekendprice"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
            </el-row>
            <!-- 第五行 -->
            <el-row :gutter="24">
              <el-col :span="16" class="flex-direction-row">
                <div class="el-input-prev-label-long">钟点房默认时长</div>
                <el-input
                  v-model="roomlbJson.timesHourNum"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
                <div class="el-input-prev-label-long">小时</div>
              </el-col>
              <el-col :span="8" class="flex-direction-row">
                <div class="el-input-prev-label">假日房价：</div>
                <el-input
                  v-model="roomlbJson.holidayprice"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                ></el-input>
              </el-col>
            </el-row>
            <!-- 第六行 -->
            <el-row :gutter="24">
              <el-col :span="15" class="flex-direction-row">
                <div class="el-input-prev-label-long">超时后每</div>
                <el-input
                  v-model="roomlbJson.timesoutTimes"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                  style="width:80px;"
                ></el-input>
                <div class="el-input-prev-label-long">小时收费</div>
                <el-input
                  v-model="roomlbJson.itmesoutPrice"
                  size="mini"
                  placeholder=""
                  class="el-input-roomlb"
                  style="width:80px;"
                ></el-input>
                <div class="el-input-prev-label">元</div>
              </el-col>
              <el-col :span="9" class="flex-direction-row">
                <div class="el-input-prev-label-long">超时不足半小时</div>
                <el-select
                  v-model="roomlbJson.chalfHourflag"
                  size="mini"
                  class="el-input-roomlb"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in halfOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="RoomlbOpeartionBtn(1)">新增</el-button>
        <el-button
          @click="RoomlbOpeartionBtn(2)"
          :disabled="roomlbDeleteDisable"
          >删除</el-button
        >
        <el-button @click="RoomlbOpeartionBtn(3)">保存</el-button>
        <el-button @click="RoomlbOpeartionBtn(0)">退出</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "../../../../utils/index";
import {
  apiRoomlbData,
  apiInsRoomlbInfo,
  apiUpdRoomlbInfo,
  apiDelRoomlbForRoomlbno
} from "@/request/api";
export default {
  props: {
    dialogRoomlbVisible: {
      type: Boolean,
      require: true
    },
    roomlbData: {
      type: Array,
      require: true
    }
  },
  inject: ["reload"],
  data() {
    return {
      // 页面 表格 初始数据
      pageRoomlbData: [],
      header: [
        {
          prop: "roomlbno",
          label: "房类编号",
          isSort: true,
          width: "120"
        },
        {
          prop: "roomlbname",
          label: "房间名称",
          isSort: true,
          width: "160"
        },
        {
          prop: "price",
          label: "标准价格",
          isSort: true,
          width: "120"
        },
        {
          prop: "beds",
          label: "床数",
          isSort: true,
          width: "80"
        },
        {
          prop: "breakfasts",
          label: "早餐数量",
          isSort: true,
          width: "120"
        }
      ],
      // 详细信息
      roomlbJson: {
        roomlbno: "",
        roomlbname: "",
        subname: "",
        beds: "",
        breakfasts: "",
        longroomflag: "",
        timeroomflag: "",
        price: "",
        longprice: "",
        nlcfprice: "",
        timeprice: "",
        weekendprice: "",
        timesHourNum: "",
        holidayprice: "",
        timesoutTimes: "",
        itmesoutPrice: "",
        chalfHourflag: ""
      },
      // 删除按钮不可点击
      roomlbDeleteDisable: false,
      // 是否可开长包房
      longroomflag: false,
      // 是否可开钟点房
      timeroomflag: false,
      halfOptions: [
        {
          value: "1",
          label: "按半小时计算"
        },
        {
          value: "2",
          label: "按一小时计算"
        }
      ],
      isDataChange: false
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      apiRoomlbData({}).then(res => {
        this.isDataChange = false;

        this.pageRoomlbData = res;
        this.roomlbJson = this.pageRoomlbData[0];
        this.longroomflag = this.roomlbJson.longroomflag === "Y";
        this.timeroomflag = this.roomlbJson.timeroomflag === "Y";
        console.log(this.roomlbJson);
      });
    },
    /**
     * 楼层 Dialog内的操作按钮的点击事件
     */
    RoomlbOpeartionBtn(code) {
      switch (code) {
        case 1:
          this.roomlbInsert();
          break;
        case 2:
          this.roomlbDelete();
          break;
        case 3:
          this.roomlbSave();
          break;
        case 0:
          this.roomlbExit();
          break;
      }
    },
    roomlbInsert() {
      // 通过将 对象转变为JSON字符串来 进行判断
      // 1. 获取选中行
      let currentObj = this.pageRoomlbData.filter(res => {
        return res.roomlbno == this.roomlbJson.roomlbno;
      });
      // 获取当前行
      // 判断数据是否存在变化，这里可能有问题
      this.isDataChange = !(
        JSON.stringify(this.roomlbJson) == JSON.stringify(currentObj[0])
      );
      if (this.isDataChange) {
        // 如果已经修改，提示是否需要保存
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
            this.roomlbJson.longroomflag =
              this.longroomflag == true ? "Y" : "N";
            this.roomlbJson.timeroomflag =
              this.timeroomflag == true ? "Y" : "N";
            this.saveData(this.roomlbJson);
          })
          .catch(action => {
            if (action === "cancel") {
              // 放弃保存并离开页面
              this.saveInit();
            } else {
              // 停留在当前页面
            }
          });
      } else {
        this.roomlbJson = {
          roomlbno: this.maxRoomlbno(this.pageRoomlbData),
          roomlbname: "",
          subname: "",
          beds: "",
          breakfasts: "",
          longroomflag: "",
          timeroomflag: "",
          price: "",
          longprice: "",
          nlcfprice: "",
          timeprice: "",
          weekendprice: "",
          timesHourNum: "",
          holidayprice: "",
          timesoutTimes: "",
          itmesoutPrice: "",
          chalfHourflag: ""
        };
        /* this.roomlbJson.roomlbno = this.maxRoomlbno(); */
        this.longroomflag = false;
        this.timeroomflag = false;
        this.roomlbDeleteDisable = true;
        this.isDataChange = false;
      }
    },
    roomlbDelete() {
      console.log(this.roomlbJson);
      console.log("delete", this.roomlbJson.roomlbno);
      apiDelRoomlbForRoomlbno({
        roomlbno: this.roomlbJson.roomlbno
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.initialize();
        }
      });
    },
    // ============= 保存的数据 ===========
    saveData(roomlb) {
      // isDataChange 为 true，说明存在变化，需要进行保存或者不保存
      this.isDataChange = this.dataChange();
      if (this.isDataChange) {
        // roomlbDeleteDisable 为 true 说明当前保存操作为 新建 保存 插入数据
        if (this.roomlbDeleteDisable) {
          console.log("新建保存", roomlb);
          apiInsRoomlbInfo({
            roomlbJson: JSON.stringify(roomlb)
          }).then(res => {
            if (res.code == 200) {
              this.initialize();
              this.saveInit();
            }
          });
        } else {
          // 更新保存
          console.log("更新保存", roomlb);
          apiUpdRoomlbInfo({
            roomlbJson: JSON.stringify(roomlb)
          }).then(res => {
            if (res.code == 200) {
              this.initialize();
              this.saveInit();
            }
          });
        }
      } else {
        console.log("空点");
      }
    },
    roomlbSave() {
      let currentObj = this.pageRoomlbData.filter(res => {
        return res.roomlbno == this.roomlbJson.roomlbno;
      });
      let isDataChange = !(
        JSON.stringify(this.roomlbJson) == JSON.stringify(currentObj[0])
      );
      if (this.isDataChange) {
        isDataChange = this.isDataChange;
        console.log(this.isDataChange);
      }
      // 说明数据有变动
      if (isDataChange) {
        if (this.roomlbDeleteDisable) {
          this.roomlbJson.longroomflag = this.longroomflag == true ? "Y" : "N";
          this.roomlbJson.timeroomflag = this.timeroomflag == true ? "Y" : "N";
          console.log("新增数据保存", this.roomlbJson);
          apiInsRoomlbInfo({
            roomlbJson: JSON.stringify(this.roomlbJson)
          }).then(res => {
            if (res.code == 200) {
              this.roomlbDeleteDisable = true;
              this.isDataChange = false;
              this.saveInit();
              this.initialize();
            }
          });
        } else {
          this.roomlbJson.longroomflag = this.longroomflag == true ? "Y" : "N";
          this.roomlbJson.timeroomflag = this.timeroomflag == true ? "Y" : "N";
          console.log(currentObj[0]);
          console.log("更新数据保存", this.roomlbJson);
          apiUpdRoomlbInfo({
            roomlbJson: JSON.stringify(this.roomlbJson)
          }).then(res => {
            if (res.code == 200) {
              this.saveInit();
              this.roomlbDeleteDisable = true;
              this.isDataChange = false;
              this.initialize();
            }
          });
        }
      } else {
        console.log("空点");
      }
    },
    roomlbExit() {
      this.isDataChange = this.dataChange();
      console.log(this.isDataChange);
      if (this.isDataChange) {
        // 如果已经修改，提示是否需要保存
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
            console.log(this.roomlbJson);
            this.roomlbJson.longroomflag =
              this.longroomflag == true ? "Y" : "N";
            this.roomlbJson.timeroomflag =
              this.timeroomflag == true ? "Y" : "N";
            this.saveData(this.roomlbJson);
            // 保存后的页面操作
            this.$emit("update:dialogRoomlbVisible", false);
          })
          .catch(action => {
            if (action === "cancel") {
              // 放弃保存并离开页面
              this.$emit("update:dialogRoomlbVisible", false);
            } else {
              // 停留在当前页面
            }
          });
      } else {
        this.$emit("update:dialogRoomlbVisible", false);
      }
    },
    // =========== 表格所需方法 ===========
    // 表格 斑马线样式设置
    tableRowClassName({ row, rowIndex }) {
      row.currentIndex = rowIndex;
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    tableRowClick(row, column, e) {
      // dataChange
      this.isDataChange = this.dataChange();
      if (this.isDataChange) {
        // 更换选中行时， 如果已经修改，提示是否需要保存
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
            console.log(this.roomlbJson);
            this.roomlbJson.longroomflag =
              this.longroomflag == true ? "Y" : "N";
            this.roomlbJson.timeroomflag =
              this.timeroomflag == true ? "Y" : "N";

            // 保存 房类信息
            this.saveData(this.roomlbJson);
            // 保存后的页面操作
            this.roomlbJson = deepClone(row);
            this.longroomflag = this.roomlbJson.longroomflag === "Y";
            this.timeroomflag = this.roomlbJson.timeroomflag === "Y";
            console.log("点击别行，保存后的操作", this.roomlbJson);
            // 修改 delete不可点击为可点击 false， 修改 isDataChange 为 false
            this.roomlbDeleteDisable = false;
            this.isDataChange = false;
          })
          .catch(action => {
            if (action === "cancel") {
              // 放弃保存并离开页面
              this.roomlbJson = deepClone(row);

              this.longroomflag = this.roomlbJson.longroomflag === "Y";
              this.timeroomflag = this.roomlbJson.timeroomflag === "Y";
              console.log(this.roomlbJson);
              // 修改 delete不可点击为可点击 false， 修改 isDataChange 为 false
              this.roomlbDeleteDisable = false;
              this.isDataChange = false;
            } else {
              // 停留在当前页面
            }
          });
      } else {
        console.log(row);
        this.roomlbJson = deepClone(row);
        this.longroomflag = this.roomlbJson.longroomflag === "Y";
        this.timeroomflag = this.roomlbJson.timeroomflag === "Y";
        console.log(this.roomlbJson);
        // 修改 delete不可点击为可点击 false， 修改 isDataChange 为 false
        this.roomlbDeleteDisable = false;
        this.isDataChange = false;
      }
    },
    dataChange() {
      if (this.isDataChange) {
        return true;
      } else {
        // 获取选中行
        let currentObj = this.pageRoomlbData.filter(res => {
          return res.roomlbno == this.roomlbJson.roomlbno;
        });
        console.log("选中行是否：", currentObj);
        let isDataChange = !(
          JSON.stringify(this.roomlbJson) == JSON.stringify(currentObj[0])
        );
        return isDataChange;
      }
    },
    /**
     * 当前最大的房类id，返回 +1 的Floorno
     */
    maxRoomlbno(array) {
      console.log(array);
      let maxno = 0;
      for (var i = 0; i < array.length; i++) {
        if (Number(array[i].roomlbno) > maxno) {
          maxno = Number(array[i].roomlbno);
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
     * 保存后的 插入 的 初始化操作
     */
    saveInit() {
      this.roomlbJson = {};
      this.longroomflag = false;
      this.timeroomflag = false;
      this.roomlbDeleteDisable = true;
      this.isDataChange = false;
    },
    /**
     * CheckBox 发生改变
     */
    checkboxChange() {
      this.isDataChange = true;
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
.el-table >>> th,
.el-table >>> td {
  padding: 0px;
}
.el-table >>> .warning-row {
  background-color: #ffffff;
}
.el-table >>> .success-row {
  background-color: #ffffd2;
}
.dialog-top {
  margin: 5px 0px;
  border: 3px inset #f1efe2;
}
.dialog-bottom {
  margin: 5px 0px;
  border: 3px inset #f1efe2;
}
.el-input-prev-label-long {
  font-size: 16px;
}
.el-input-prev-label {
  width: 80px;
  font-size: 16px;
}
.el-input-roomlb {
  width: 100px;
}
.el-input-roomlb-small {
  width: 60x;
}
</style>
