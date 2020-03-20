<template>
  <el-container class="el-flex-direction-column">
    <!-- 操作按钮 -->
    <opeartion-btn
      ref="opeartionbtn"
      @insert="insertRoom"
      @save="saveRoom"
      @delete="deleteRoom"
      @batchInsert="batchInsert"
      @roomlbSetting="roomlbSetting"
      @floorSetting="floorSetting"
      @refresh="refresh"
    />
    <!-- 主页面 -->
    <el-container class="el-body-main">
      <div class="el-left">
        <div class="type-radio">
          <el-radio-group v-model="showTypeRadio" @change="radioChange">
            <el-radio :label="0">按房类</el-radio>
            <el-radio :label="1">按楼层</el-radio>
          </el-radio-group>
        </div>
        <div class="tree-roomlb">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="el-right">
        <div class="el-right-header">
          <div class="el-flex-direction-row right-header">
            <el-select
              v-model="selectValue"
              placeholder="请选择"
              size="mini"
              class="el-select-class"
            >
              <el-option
                v-for="item in selectData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              size="mini"
              v-model="queryCriteria"
              placeholder="请输入查询条件"
              class="el-input-class"
            ></el-input>
            <el-button
              size="mini"
              plain
              @click="unclearQyery(selectValue, queryCriteria)"
              >模糊查询</el-button
            >
          </div>
        </div>
        <div class="el-right-body">
          <el-table
            :data="tableData"
            height="240px"
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
        <div class="el-right-bottom">
          <div class="bottom-single-room">
            <div class="el-flex-direction-row">
              <div class="el-input-label">
                <div class="el-input-prev-label">房间编号：</div>
                <el-input
                  size="mini"
                  placeholder
                  :disabled="!isInsert"
                  v-model="selectRow.roomno"
                  class="el-input-roominfo"
                ></el-input>
              </div>
              <div class="el-input-label">
                <div class="el-input-prev-label">房间类型：</div>
                <el-select
                  v-model="selectRow.roomlbno"
                  placeholder="请选择"
                  size="mini"
                  class="el-input-roominfo"
                >
                  <el-option
                    v-for="item in roomlbOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="el-flex-direction-row">
              <div class="el-input-label">
                <div class="el-input-prev-label">楼层：</div>
                <el-select
                  v-model="selectRow.floorno"
                  placeholder="请选择"
                  size="mini"
                  class="el-input-roominfo"
                >
                  <el-option
                    v-for="item in floorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="el-input-label">
                <div class="el-input-prev-label">电话：</div>
                <el-input
                  size="mini"
                  placeholder
                  v-model="selectRow.tel"
                  class="el-input-roominfo"
                ></el-input>
              </div>
            </div>
            <div class="el-flex-direction-row">
              <div class="el-input-label">
                <div class="el-input-prev-label">床数：</div>
                <el-input-number
                  size="mini"
                  placeholder="请选择"
                  v-model="selectRow.beds"
                  class="el-input-roominfo"
                  controls-position="right"
                  :min="1"
                  :max="10"
                ></el-input-number>
              </div>
            </div>
            <div class="el-flex-direction-row">
              <div class="el-input-label">
                <div class="el-input-prev-label">楼栋编号：</div>
                <el-input
                  size="mini"
                  placeholder
                  v-model="selectRow.buildno"
                  class="el-input-roominfo"
                ></el-input>
              </div>
              <div class="el-input-label">
                <div class="el-input-prev-label">门锁号：</div>
                <el-input
                  size="mini"
                  placeholder
                  v-model="selectRow.doorlockid"
                  class="el-input-roominfo"
                ></el-input>
              </div>
            </div>
            <div class="el-flex-direction-row">
              <div class="el-input-label">
                <div class="el-input-prev-label">备注：</div>
                <el-input
                  size="mini"
                  placeholder
                  v-model="selectRow.meno"
                  style="width:287px;"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <!-- 批量添加 的 Dialog -->
        <div v-if="dialogBatchInsertVisible">
          <batch-dialog
            ref="batchDialog"
            :dialogBatchInsertVisible.sync="dialogBatchInsertVisible"
            :roomlbOptions="roomlbOptions"
            :floorOptions="floorOptions"
          />
        </div>
        <!-- 房间分类设置 的 Dialog -->
        <div v-if="dialogRoomlbVisible">
          <roomlb-dialog
            ref="roomlbDialog"
            :dialogRoomlbVisible.sync="dialogRoomlbVisible"
            :roomlbData="roomlbData"
          />
        </div>
        <!-- 楼层设置 的 Dialog -->
        <div v-if="dialogFloorVisible">
          <floor-dialog
            ref="floorDialog"
            :dialogFloorVisible.sync="dialogFloorVisible"
          />
        </div>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import {
  apiRoomlbData,
  apiFloorData,
  apiRoomData,
  apiInsertSingleRoomData
} from "@/request/api";
import OpeartionBtn from "./components/OpeartionBtn";
import FloorDialog from "./components/FloorDialog";
import BatchDialog from "./components/BatchInsertDialog";
import RoomlbDialog from "./components/RoomlbDialog";
export default {
  components: {
    OpeartionBtn,
    FloorDialog,
    BatchDialog,
    RoomlbDialog
  },
  inject: ["reload"],
  data() {
    return {
      showFlag: false,
      // 房类数据
      roomlbData: [],
      // 房间数据
      roomData: [],
      // 楼层数据
      floorData: [],
      // 树形单选按钮
      showTypeRadio: 0,
      // 树形列表数据
      treeData: [],
      // 树形数据格式
      defaultProps: {
        id: "id",
        children: "children",
        label: "label"
      },
      // 下拉菜单
      selectValue: "1",
      selectData: [
        {
          value: "1",
          label: "房间编码"
        }
      ],
      // 模糊查询条件
      queryCriteria: "",
      // 展示表格数据
      tableData: [],
      oldTableData: [],
      // 表格表头
      header: [
        {
          prop: "roomno",
          label: "房间编号",
          isSort: true,
          width: "130"
        },
        {
          prop: "roomlbname",
          label: "房间类型",
          isSort: true,
          width: "130"
        },
        {
          prop: "floorname",
          label: "楼层",
          isSort: true,
          width: "100"
        },
        {
          prop: "beds",
          label: "床数",
          isSort: true,
          width: "100"
        },
        {
          prop: "tel",
          label: "电话",
          isSort: true,
          width: "160"
        },
        {
          prop: "date",
          label: "备注",
          isSort: true,
          width: "100"
        },
        {
          prop: "date",
          label: "停用",
          isSort: true,
          width: "80"
        }
      ],
      // 选中行
      selectRow: {},
      // 房间信息显示的下拉框
      roomlbOptions: [],
      // 楼层下拉框
      floorOptions: [],
      // 操作按钮中需要被修改的数据
      modifyDatas: {},
      isInsert: false,
      // 批量新增按钮 Dialog 显示
      dialogBatchInsertVisible: false,
      // 房类设置 Dialog 显示
      dialogRoomlbVisible: false,
      // 楼层设置 Dialog 显示
      dialogFloorVisible: false
    };
  },
  created() {
    console.log("BaseINfo");
    console.log(this.$router.options.routes);
    this.initialize();
  },
  methods: {
    initialize() {
      let p1 = new Promise((resolve, reject) => {
        resolve(apiRoomlbData({}));
      });
      let p2 = new Promise((resolve, reject) => {
        resolve(apiRoomData({}));
      });
      let p3 = new Promise((resolve, reject) => {
        resolve(apiFloorData({}));
      });
      Promise.all([p1, p2, p3])
        .then(res => {
          // 0. 为 json 对象添加 updateFlag 属性
          res.filter(res => {
            return res.filter(data => {
              return (data.updateFlag = "");
            });
          });
          console.log(res);
          // 1. 房间分类
          this.roomlbData = res[0];
          // 2. 房间
          this.roomData = res[1];
          // 3. 楼层
          this.floorData = res[2];
          // 树形数据初始化
          this.initTreeData();
          // 表格数据初始化
          this.initTable();
          // selectRow 房间信息初始化
          this.initRoomInfo(this.roomData);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 树形数据初始化
    initTreeData() {
      this.radioChange(0);
    },
    // 表格数据初始化
    initTable() {
      this.tableTypeData(0);
    },
    // selectRow 房间信息初始化
    initRoomInfo(roomData) {
      this.selectRoomlbAndFloor(roomData[0]);
    },
    radioChange(value) {
      // 树形结构数据
      let children = [];
      if (value === 0) {
        for (var i = 0; i < this.roomlbData.length; i++) {
          let obj = {
            id: this.roomlbData[i].roomlbno,
            label: this.roomlbData[i].roomlbname
          };
          children.push(obj);
        }
      } else {
        for (var j = 0; j < this.floorData.length; j++) {
          let obj = {
            id: this.floorData[j].floorno,
            label: this.floorData[j].floorname
          };
          children.push(obj);
        }
      }
      let treeData = [
        {
          id: 0,
          label: value === 0 ? "全部房类" : "全部楼层",
          children: children
        }
      ];
      this.treeData = treeData;
      // 数据表结构数据
    },
    // 树形控件中节点的点击事件
    handleNodeClick(data) {
      this.tableTypeData(data.id);
    },
    // 表格数据显示
    tableTypeData(treeNode) {
      let tableData = [];
      if (treeNode !== 0) {
        // 1.判断是 房类显示 还是 楼层显示
        if (this.showTypeRadio === 0) {
          tableData = this.roomData.filter(res => {
            return res.roomlbno === treeNode;
          });
        } else {
          tableData = this.roomData.filter(res => {
            return res.floorno === treeNode;
          });
        }
      } else {
        tableData = this.roomData;
      }
      this.tableData = tableData;
      this.oldTableData = tableData;
    },
    // 点击表格选中行
    tableRowClick(row, column, e) {
      // 是否可以输入 房间编号
      this.isInsert = false;
      this.selectRoomlbAndFloor(row);
      console.log(row);
    },
    // 房间内容显示中的下拉框
    selectRoomlbAndFloor(row) {
      this.selectRow = row;
      // 1. 房间类型下拉框
      this.roomlbOptions = [];
      for (var i = 0; i < this.roomlbData.length; i++) {
        let obj = {
          value: this.roomlbData[i].roomlbno,
          label: this.roomlbData[i].subname
        };
        this.roomlbOptions.push(obj);
      }
      // 2. 楼层下拉框
      this.floorOptions = [];
      for (var j = 0; j < this.floorData.length; j++) {
        let obj = {
          value: this.floorData[j].floorno,
          label: this.floorData[j].floorname
        };
        this.floorOptions.push(obj);
      }
    },
    // 表格 斑马线样式设置
    tableRowClassName({ row, rowIndex }) {
      row.currentIndex = rowIndex;
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    // 模糊查询点击事件
    unclearQyery(selectValue, queryCriteria) {
      console.log(selectValue);
      console.log(queryCriteria == "");
      if (queryCriteria == "") {
        this.tableData = this.oldTableData;
      } else {
        let queryArr = this.oldTableData.filter(res => {
          return res.roomno == queryCriteria;
        });
        console.log(queryArr);
        console.log(this.oldTableData);
        this.tableData = queryArr;
        this.queryCriteria = "";
      }
    },
    // 判断 roomno 是否已经存在
    roomnoIsDuplicate(roomno) {
      let row = this.roomData.filter(res => {
        return res.roomno === roomno;
      });
      return row.length == 0 ? false : true;
    },
    /******************** 操作按钮 *********************** */
    insertRoom() {
      console.log("insertRoom");
      this.isInsert = true;
      this.selectRow = {};
    },
    saveRoom() {
      // this.isInsert = true 表明当前有修改数据
      console.log(this.selectRow);
      if (this.isInsert) {
        // 判断条件
        // 1. roomno（房间编号） 是否重复
        if (this.roomnoIsDuplicate(this.selectRow.roomno)) {
          this.$message({
            showClose: true,
            message: "房间编号：" + this.selectRow.roomno + " 已存在。",
            type: "error",
            duration: 1000
          });
          return;
        }
        // 2. 房间类别必须选择
        if (this.selectRow.roomlbno === undefined) {
          this.$message({
            showClose: true,
            message: "请为房间：" + this.selectRow.roomno + "选择房间类型。",
            type: "warning",
            duration: 2000
          });
          return;
        }
        // 3. 房间楼层必须选择
        if (this.selectRow.floorno === undefined) {
          this.$message({
            showClose: true,
            message: "请为房间：" + this.selectRow.roomno + "选择楼层。",
            type: "warning",
            duration: 2000
          });
          return;
        }
        // 默认最低的床数为：1
        if (this.selectRow.beds === undefined) {
          this.selectRow.beds = 1;
        }
        apiInsertSingleRoomData({
          jsonRoom: JSON.stringify(this.selectRow)
        }).then(res => {
          console.log(res);
        });
        this.tableData.push(this.selectRow);
        this.isInsert = false;
      } else {
        console.log("空点保存");
      }
    },
    deleteRoom() {
      console.log(this.selectRow);
    },
    batchInsert() {
      console.log("batchInsert");
      this.dialogBatchInsertVisible = true;
    },
    roomlbSetting() {
      console.log("roomlbSetting");
      this.dialogRoomlbVisible = true;
    },
    floorSetting() {
      console.log("floorSetting");
      this.dialogFloorVisible = true;
    },
    refresh() {
      this.reload();
    }
  }
};
</script>
<style scoped>
.el-flex-direction-row {
  display: flex;
  flex-direction: row;
}
.el-flex-direction-column {
  display: flex;
  flex-direction: column;
}
.el-body-main {
  background-color: #bfdbff;
}
.el-left {
  display: flex;
  flex-direction: column;
  margin: 5px;
  height: 450px;
  width: 18%;
}
.type-radio {
  border: 1px solid #6593cf;
  border-radius: 10%;
  background-color: #bfdbff;
}
.tree-roomlb {
  margin-top: 3px;
  height: 500px;
  border: 2px inset #f1efe2;
  background-color: #ffffff;
}
.el-right {
  margin: 5px;
  width: 82%;
}
.el-right-header {
  margin: 1px;
}
.el-right-body {
  margin: 1px;
  border: 2px inset #f1efe2;
  background-color: #18ffec;
}
.el-right-bottom {
  margin: 1px;
  border: 2px inset #f1efe2;
}
.el-select-class {
  width: 120px;
}
.el-input-class {
  width: 200px;
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
/** 选中行颜色 */
.el-table--striped
  >>> .el-table__body
  >>> tr.el-table__row--striped.current-row
  >>> td,
.el-table__body >>> tr.current-row >>> td {
  background-color: #a0cfff;
}
.el-table--striped
  >>> .el-table__body
  >>> tr.hover-row.el-table__row--striped
  >>> td,
.el-table__body >>> tr.hover-row >>> td {
  background-color: #d9ecff !important;
}

.el-input-prev-label {
  width: 80px;
  font-size: 16px;
}
.el-input-roominfo {
  width: 120px;
}
.el-input-label {
  display: flex;
  flex-direction: row;
  margin: 3px;
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
</style>
