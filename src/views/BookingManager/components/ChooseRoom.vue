<template>
  <div>
    <div class="div-flex-direction-row">
      <div class="table-left">
        <el-table
          v-loading="loading"
          :data="leftTable"
          border
          style="width: 100%"
          height="200"
          @row-click="tableRowClick"
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
          v-for="(item, index) in centerRoom.rooms"
          :key="index"
          class="ma-1"
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
import {
  apiRoomlbData,
  apiRoomData,
  apiRegData,
  apiBookingData
} from "@/request/api";
import { deepClone, judgeNoMix } from "@/utils";
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
      regAllData: [],
      bookingAllData: [],
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
      let p3 = new Promise((resolve, reject) => {
        resolve(apiRegData({}));
      });
      let p4 = new Promise((resolve, reject) => {
        resolve(apiBookingData({}));
      });
      Promise.all([p1, p2, p3, p4])
        .then(res => {
          this.roomlbData = deepClone(res[0]);
          this.roomData = deepClone(res[1]);
          this.regAllData = deepClone(res[2]);
          this.bookingAllData = deepClone(res[3]);
          // 初始化时间
          let bookingDate = new Date(Date.parse(new Date()) + 86400000);
          bookingDate.setHours(12, 0, 0, 0);
          let dtIndate = bookingDate;
          // 默认天数是1
          let dtOutdate = this.getDtOutDate(bookingDate, 1);

          // 左边表格初始化
          this.changeRoomForTime(dtIndate, dtOutdate);
          /* this.initLeftTable(this.roomlbData, this.roomData); */
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 判断有效房间
    changeRoomForTime(date1, date2) {
      this.loading = true;
      // 符合要求的房间
      let roomList = [];
      let allReg = deepClone(this.regAllData);
      let allBooking = deepClone(this.bookingAllData);
      let allRoom = deepClone(this.roomData);

      if (date1 > date2) {
        return this.$message.error("预计入住时间小于预计离开时间，不合法");
      }
      console.log("开始判断");
      // 遍历所有房间
      for (var i = 0; i < allRoom.length; i++) {
        let room = allRoom[i];
        console.log("房间：" + room.roomno);
        if (room.regno != "") {
          // 遍历获取该订单
          console.log("有订单号->" + room.regno);
          let reg = allReg.filter(reg => {
            return reg.regno == room.regno;
          });
          // 一个房间只有一个已住订单。
          // 1. 先查看一下 该房间是否在 该时间段 d1-d2有预定，如果有就跳过，如果没有就继续
          // 入住房间离开时间 小于 预定事件，有交集 pass
          if (new Date(reg[0].dtOutdate) > date1) {
            console.log(date1 + "<" + new Date(reg[0].dtOutdate));
            continue;
          }
        }
        console.log("开始订单判断");
        // 2. 如果是空房间，或者入住房间，没有交集，就查看是否有该房间，时间段内是否有预定
        // 2.1 检索出该房间存在的预订
        let bookingArr = allBooking.filter(booking => {
          return booking.roomno == room.roomno;
        });
        // 2.2 如果当前房间存在预定，则进行预定时间判断
        let flag;
        if (bookingArr.length != 0) {
          for (var j = 0; j < bookingArr.length; j++) {
            let booking = bookingArr[j];
            // 判断新预定的时间段 date1-date2 与 booking的时间段是否有交集
            flag = judgeNoMix(
              date1,
              date2,
              booking.dtIndate,
              booking.dtOutdate
            );
            console.log(
              room.roomno + "->" + "订单号：" + booking.bookingno + ":" + flag
            );
            if (flag == false) {
              break;
            }
          }
        } else {
          // 该房间没有预定
          flag = true;
        }
        if (flag == true) {
          roomList.push(room);
        }
      }
      console.log("符合要求的Room");
      console.log(roomList);
      this.initLeftTable(this.roomlbData, roomList);
    },

    initLeftTable(roomlbData, roomData) {
      this.leftTable = [];
      this.tableData = [];
      for (var i = 0; i < roomlbData.length; i++) {
        // 此处为浅拷贝。
        let roomlbno = roomlbData[i].roomlbno;
        let roomType = roomData.filter(res => {
          res.chooseIndex = false;
          // 改动一下 2020-3-14
          /* return res.roomlbno == roomlbno && res.rstatus == 0; */
          return res.roomlbno == roomlbno;
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
    },
    getDtOutDate(inDate, days) {
      let nowms = Date.parse(inDate);
      let ms = Number(days) * 86400000;
      let outDate = new Date(nowms + ms);
      outDate.setHours(12, 0, 0, 0);
      return outDate;
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
