<template>
  <div>
    <div class="div-flex-direction-row">
      <div class="table-left">
        <el-table
          :data="leftTable"
          border
          style="width: 100%"
          height="200"
          @row-click="tableRowClick"
          v-loading="loading"
        >
          <el-table-column type="index" label="序" width="50"></el-table-column>
          <el-table-column prop="subname" label="房间类型" width="80">
          </el-table-column>
          <el-table-column prop="available" label="可用" width="60">
          </el-table-column>
          <el-table-column
            prop="price"
            label="房价"
            width="60"
          ></el-table-column>
          <el-table-column prop="totalChoose" label="已选" width="60">
          </el-table-column>
        </el-table>
      </div>
      <div class="room-center">
        <v-btn
          class="ma-1"
          v-for="(item, index) in centerRoom.rooms"
          :key="index"
          :color="item.chooseIndex ? '#f2bf16' : '#84d435'"
          small
          @click="centerRoomClick(item)"
          >{{ item.roomname }}</v-btn
        >
      </div>
      <div class="choose-right">
        <v-data-table
          height="190px"
          dense
          :headers="headers"
          :items="tableData"
          class="elevation-1"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.roomno }}</td>
                <td>{{ item.beds }}</td>
                <td>
                  <el-input
                    size="mini"
                    v-model="item.price"
                    placeholder=""
                  ></el-input>
                </td>
                <td>{{ item.num }}</td>
                <td>{{ item.breakfasts }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>
<script>
import { apiRoomlbData, apiRoomData } from "@/request/api";
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      roomlbData: [],
      roomData: [],
      leftTable: [],
      centerRoom: [],
      chooseRoom: [],
      headers: [
        {
          text: "房号",
          value: "roomno",
          width: "78px"
        },
        { text: "床数", sortable: false, value: "beds", width: "60px" },
        { text: "实际房价", sortable: false, value: "price", width: "100px" },
        { text: "人数", sortable: false, value: "num", width: "60px" },
        { text: "早餐", sortable: false, value: "breakfasts", width: "60px" }
      ],
      tableData: [],
      loading: true
    };
  },
  created() {
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
      Promise.all([p1, p2])
        .then(res => {
          this.roomlbData = deepClone(res[0]);
          let allRoomData = deepClone(res[1]);
          this.roomData = allRoomData.filter(room => {
            return room.rstatus == 0;
          });
          // 左边表格初始化
          this.initLeftTable(this.roomlbData, this.roomData);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    initLeftTable(roomlbData, roomData) {
      this.loading = true;
      for (var i = 0; i < roomlbData.length; i++) {
        // 此处为浅拷贝。
        let roomlbno = roomlbData[i].roomlbno;
        let roomType = roomData.filter(res => {
          res.chooseIndex = false;
          return res.roomlbno == roomlbno && res.rstatus == 0;
        });
        this.leftTable.push({
          subname: roomlbData[i].subname,
          available: roomType.length,
          price: roomlbData[i].price,
          totalChoose: "0",
          breakfasts: roomlbData[i].breakfasts,
          rooms: roomType
        });
      }
      this.initCenter();
    },
    initCenter() {
      this.centerRoom = this.leftTable[0];
      this.loading = false;
    },
    tableRowClick(row) {
      this.centerRoom = row;
    },
    /**
     * 中间选择房间按钮点击事件（添加房间分类）
     */
    centerRoomClick(item) {
      item.chooseIndex = !item.chooseIndex;
      let totalChooseRoom = this.centerRoom.rooms.filter(res => {
        return res.chooseIndex == true;
      });
      this.centerRoom.totalChoose = totalChooseRoom.length;
      this.upDatatableData(this.leftTable);
      console.log(this.tableData);
      this.$emit("update:chooseRoomTableData", this.tableData);
    },
    // 初始化 tableData
    upDatatableData(templateTableData) {
      this.tableData = [];
      for (var i = 0; i < templateTableData.length; i++) {
        for (var j = 0; j < templateTableData[i].rooms.length; j++) {
          if (templateTableData[i].rooms[j].chooseIndex == true) {
            let obj = {
              roomno: templateTableData[i].rooms[j].roomno,
              roomlbno: templateTableData[i].rooms[j].roomlbno,
              beds: templateTableData[i].rooms[j].beds,
              price: templateTableData[i].price,
              num: templateTableData[i].breakfasts,
              breakfasts: templateTableData[i].breakfasts
            };
            this.tableData.push(obj);
          }
        }
      }
    }
  }
};
</script>
<style scoped>
.div-flex-direction-row {
  display: flex;
  flex-direction: row;
}
.table-left {
  width: 330px;
}
.room-center {
  /*   display: flex;
  flex-direction: row;
  flex-wrap: wrap; */
  width: 280px;
  height: 200px;
  overflow: auto;
}
.choose-right {
  width: 380px;
}
</style>
