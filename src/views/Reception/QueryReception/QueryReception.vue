<template>
  <div>
    <div>
      <el-tabs type="border-card" class="el-tas-class">
        <el-tab-pane label="散客预定">
          <div>
            <el-button @click="guestBookingToReg(guestSelected)">
              散客转入住
            </el-button>
            <el-button @click="deleteGuestBooking(guestSelected)">
              删除订单
            </el-button>
          </div>
          <div class="table-width">
            <v-card-title>
              <v-text-field
                v-model="searchGuestname"
                label="可以检索客人姓名,房间编号，预到时间"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model="guestSelected"
              :headers="guestHeaders"
              :items="guestTableData"
              :search="searchGuestname"
              group-by="linkno"
              item-key="bookingno"
              show-select
              hide-default-footer
              dense
            ></v-data-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="团体预定">
          <div>
            <el-button @click="teamBookingToReg(teamSelected)">
              团体转入住
            </el-button>
            <el-button @click="deleteTeamBooking(teamSelected)">
              删除订单
            </el-button>
          </div>
          <div class="table-width">
            <v-card-title>
              <v-icon>mdi-home-search-outline</v-icon>
              <v-text-field
                v-model="searchTeamname"
                label="可以检索客人姓名,房间编号，预到时间"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model="teamSelected"
              show-select
              :headers="teamHeaders"
              :items="teamTableData"
              :search="searchTeamname"
              group-by="groupno"
              item-key="bookingno"
              hide-default-footer
              dense
            >
            </v-data-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="guest-cancelbooking-dialog">
      <v-dialog
        v-model="guestCancelBookingVisiable"
        persistent
        max-width="1400"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            id="guestCancelBtn"
            color="primary"
            dark
            v-on="on"
            style="display:none;"
            >dialog</v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline">取消订单</v-card-title>
          <v-card-text>
            <div>
              <v-data-table
                v-model="guestCancelSelected"
                show-select
                :headers="guestHeaders"
                :items="guestCancelTableData"
                item-key="bookingno"
                height="200"
                hide-default-footer
                dense
              ></v-data-table>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="guestCancelBookingVisiable = false"
              >取消</v-btn
            >
            <v-btn color="red" @click="guestCancelBookings(guestCancelSelected)"
              >确认删除</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="guestCancelMenoDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">删除理由</v-card-title>
          <v-card-text>
            <el-input
              v-model="guestCancelMeno"
              placeholder="请输入删除理由"
            ></el-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="guestCancelMenoDialog = false"
            >
              取消
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="guestDeleteBookingConfirm(guestCancelMeno)"
            >
              确定删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="team-cancelbooking-dialog">
      <v-dialog v-model="teamCancelBookingVisiable" persistent max-width="1400">
        <template v-slot:activator="{ on }">
          <v-btn
            id="teamCancelBtn"
            color="primary"
            dark
            v-on="on"
            style="display:none;"
            >dialog</v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline">取消订单</v-card-title>
          <v-card-text>
            <div>
              <v-data-table
                v-model="teamCancelSelected"
                show-select
                :headers="teamHeaders"
                :items="teamCancelTableData"
                item-key="bookingno"
                height="200"
                hide-default-footer
                dense
              ></v-data-table>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="teamCancelBookingVisiable = false"
              >取消</v-btn
            >
            <v-btn color="red" @click="teamCancelBookings(teamCancelSelected)"
              >确认删除</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="teamCancelMenoDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">删除理由</v-card-title>
          <v-card-text>
            <el-input
              v-model="teamCancelMeno"
              placeholder="请输入删除理由"
            ></el-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="teamCancelMenoDialog = false"
            >
              取消
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="teamDeleteBookingConfirm(teamCancelMeno)"
            >
              确定删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <guest-occupancy ref="guestOccupancy" />
      <team-occupancy ref="teamOccupancy" />
    </div>
  </div>
</template>
<script>
import {
  apiQueryBookingData,
  apiCancelGuestBooking,
  apiCalcelTeamBooking
} from "@/request/api";
import guestOccupancy from "../occupancy/guestOccupancy";
import teamOccupancy from "../occupancy/teamOccupancy";
import { parseTime, deepClone } from "@/utils";
export default {
  components: {
    guestOccupancy,
    teamOccupancy
  },
  inject: ["reload"],
  data() {
    return {
      teamSelected: [],
      guestSelected: [],
      searchGuestname: "",
      searchTeamname: "",
      guestHeaders: [
        {
          text: "预订单号",
          value: "bookingno",
          filterable: false
        },
        { text: "客人姓名", value: "guestname" },
        { text: "房间编号", value: "roomno" },
        { text: "房间状态", value: "rstatus" },
        { text: "联房编号", value: "linkno" },
        { text: "房间类型", value: "roomlbname", filterable: false },
        { text: "预定交押金", value: "securityReal" },
        { text: "预到时间", value: "dtIndate" },
        { text: "预离时间", value: "dtOutdate", filterable: false },
        { text: "保留时间", value: "dtKeep", filterable: false }
      ],
      teamHeaders: [
        {
          text: "预订单号",
          value: "bookingno",
          filterable: false
        },
        { text: "团体名称", value: "guestname" },
        { text: "房间编号", value: "roomno" },
        { text: "房间状态", value: "rstatus" },
        { text: "团体房编号", value: "groupno" },
        { text: "房间类型", value: "roomlbname", filterable: false },
        { text: "预定交押金", value: "securityReal" },
        { text: "预到时间", value: "dtIndate" },
        { text: "预离时间", value: "dtOutdate", filterable: false },
        { text: "保留时间", value: "dtKeep", filterable: false }
      ],
      guestTableData: [],
      teamTableData: [],
      allTableData: [],
      // --- 取消散客预定 ----
      guestCancelSelected: [],
      guestCancelBookingVisiable: false,
      guestCancelTableData: [],
      guestCancelMenoDialog: false,
      guestCancelMeno: "",
      // --- 取消 团体预定 ----
      teamCancelSelected: [],
      teamCancelBookingVisiable: false,
      teamCancelTableData: [],
      teamCancelMenoDialog: false,
      teamCancelMeno: "",
      // 退还押金总金额
      backSecurity: 0.0
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      apiQueryBookingData({}).then(res => {
        console.log(res);
        this.allTableData = res;
        this.initTableData(res);
      });
    },
    initTableData(data) {
      for (var i = 0; i < data.length; i++) {
        let obj = {
          bookingno: data[i].booking.bookingno,
          guestname: data[i].guest.guestname,
          roomno: data[i].booking.roomno,
          rstatus: data[i].room.rstatus,
          roomlbname: data[i].roomlb.roomlbname,
          securityReal: data[i].booking.securityReal,
          dtIndate: parseTime(new Date(data[i].booking.dtIndate)),
          dtOutdate: parseTime(new Date(data[i].booking.dtOutdate)),
          dtKeep: parseTime(new Date(data[i].booking.dtKeep))
        };
        if (data[i].booking.isgroup != "1") {
          obj.linkno = data[i].booking.linkno;
          this.guestTableData.push(obj);
        } else {
          obj.groupno = data[i].booking.groupno;
          this.teamTableData.push(obj);
        }
      }
    },
    // 顾客预定转入住
    guestBookingToReg(selected) {
      // 判断 linkno 是否未 null, 如果不为空说明是联房入住，选中状态必须相同。
      // 需要去重
      let bookingnoData = [];
      let set = new Set();
      // 之后用于 预定房间的 set，少一次循环而已。
      let roomset = new Set();
      for (var i = 0; i < selected.length; i++) {
        set.add(selected[i].linkno);
        roomset.add(selected[i].roomno);
        // 顺便获取下订单号码
        bookingnoData.push(selected[i]);
        // 还可以顺便获取一下总的押金
      }
      if (set.size > 1) {
        this.$message.error("请选择同一组 linkno 的订单！");
      } else if (set.size == 0) {
        this.$message.error("请选择需要入住的订单号！");
      } else {
        // 遍历取出唯一的key
        let linkno = "";
        for (let item of set.keys()) {
          linkno = item;
        }
        let guestBookingToRegArr = this.allTableData.filter(res => {
          return res.booking.linkno == linkno;
        });
        // 先留一下
        if (guestBookingToRegArr.length > selected.length) {
          return this.$message.warning(
            "您选取的订单数量 与 预定房间数量不符。如继续办理，剩余订单将不在同一组！"
          );
        }
        console.log("guestBookingToRegArr", guestBookingToRegArr);
        // 完善选择房间页面的 table数据
        let tableData = [];
        // 预定房间中，房间状态不正常，房间被占用。
        let useRoomFlag = false;
        // roonset 是 房间编号的set['8301','8201'],这种，不重复的房间编号，进行检索。
        Loop: for (var k = 0; k < guestBookingToRegArr.length; k++) {
          for (let item of roomset.keys()) {
            console.log(item);
            console.log(k);
            // 匹配出 与 预定信息 中 房间 roomno 相同的 信息
            if (guestBookingToRegArr[k].booking.roomno == item) {
              if (guestBookingToRegArr[k].room.rstatus != "0") {
                // 说明房间被占用，提示重新选择房间
                useRoomFlag = true;
                break Loop;
              }
              let obj = {
                roomno: guestBookingToRegArr[k].booking.roomno,
                roomlbno: guestBookingToRegArr[k].roomlb.roomlbno,
                beds: guestBookingToRegArr[k].roomlb.beds,
                price: guestBookingToRegArr[k].booking.price,
                num: guestBookingToRegArr[k].roomlb.breakfasts,
                breakfasts: guestBookingToRegArr[k].roomlb.breakfasts
              };
              tableData.push(obj);
              break;
            }
          }
        }
        console.log(tableData);
        console.log(useRoomFlag);
        /** 以上是判断房间是否被占用 */
        /** 以下是判断完善预定人信息 */
        // 计算选中状态下的房间的所有押金(传入的值不正确，忘记了当初为什么要这么写, 好像是判断房间是否被占用)
        console.log(selected);
        let arrAlreadySecurity = this.allSecurity(selected);
        // 所有预定时选中的房间 roomset
        console.log(roomset);
        // 预定人的信息 guestBookingToReg[0] 就可以 全都一样
        let outdate = this.$refs["guestOccupancy"].getDtOutDate(new Date(), 1);
        // 预定人信息完善
        let guestRegJson = {
          bookingno: "",
          guestname: guestBookingToRegArr[0].guest.guestname,
          guesttype: "0",
          guestno: guestBookingToRegArr[0].guest.guestno,
          secrecyflag: "0",
          dt_indate: new Date(),
          days: guestBookingToRegArr[0].booking.days,
          dt_outdate: outdate,
          intype: "0",
          tel: guestBookingToRegArr[0].guest.tel,
          guestsource: guestBookingToRegArr[0].booking.guestsource,
          irs: guestBookingToRegArr[0].booking.irs,
          sex: guestBookingToRegArr[0].guest.sex,
          idtypeno: guestBookingToRegArr[0].guest.idtypeno,
          idno: guestBookingToRegArr[0].guest.idno,
          dt_birthday: guestBookingToRegArr[0].guest.dtBirthday,
          countryno: guestBookingToRegArr[0].guest.countryno,
          areano: guestBookingToRegArr[0].guest.areano,
          address: guestBookingToRegArr[0].guest.address,
          special_memo: guestBookingToRegArr[0].booking.specialMemo,
          meno: guestBookingToRegArr[0].booking.meno,
          securitytype: "001",
          security_real: "",
          operid: "",
          isgroup: guestBookingToRegArr[0].booking.isgroup,
          irooms: guestBookingToRegArr[0].booking.irs,
          alreadySecurity: arrAlreadySecurity
        };
        console.log("bookingnoData", bookingnoData);
        if (useRoomFlag) {
          // 房间被占用
          this.$refs["guestOccupancy"].guestOccupancyVisiable = true;
          this.$refs["guestOccupancy"].guestRegJson = guestRegJson;
          this.$refs["guestOccupancy"].bookingnoData = bookingnoData;
          // 进入下一个页面后 如果房间没有被入住就不需要重新选择房间（否则会使数据丢失，最好设置未不显示）
          // 但如果预定的房间有入住，就需要重新选择，不用管别的。
          this.$refs["guestOccupancy"].chooseRoomVisiable = true;
          this.$refs["guestOccupancy"].chooseRoomTableData = [];
        } else {
          this.$message.success("房间状态正常，请确认客人信息！");
          this.$refs["guestOccupancy"].guestOccupancyVisiable = true;
          this.$refs["guestOccupancy"].chooseRoomVisiable = false;
          this.$refs["guestOccupancy"].guestRegJson = guestRegJson;
          this.$refs["guestOccupancy"].bookingnoData = bookingnoData;
          this.$refs["guestOccupancy"].chooseRoomTableData = tableData;
        }
      }
    },
    // 团体预定转入住
    teamBookingToReg(selected) {
      // 判断 linkno 是否未 null, 如果不为空说明是联房入住，选中状态必须相同。
      console.log("team", selected);
      // 需要去重
      let bookingnoData = [];
      let set = new Set();
      let roomset = new Set();
      for (var i = 0; i < selected.length; i++) {
        set.add(selected[i].groupno);
        roomset.add(selected[i].roomno);
        bookingnoData.push(selected[i]);
      }
      console.log(set);
      if (set.size > 1) {
        this.$message.error("请选择同一组 groupno 的订单！");
      } else if (set.size == 0) {
        this.$message.error("请选择需要入住的订单号！");
      } else {
        // 遍历取出唯一的key
        let groupno = "";
        for (let teamItem of set.keys()) {
          groupno = teamItem;
        }
        console.log(groupno);
        // 在此处检索会检索出所有 groupno 相同的 信息，所以可以提示是进行单独还是一起
        let teamBookingToRegArr = this.allTableData.filter(res => {
          return res.booking.groupno == groupno;
        });

        if (teamBookingToRegArr.length > roomset.size) {
          this.$message.warning("团体放必须一起入住");
          return "";
        }

        console.log(teamBookingToRegArr);
        // 所有预定时选中的房间 roomset
        console.log(roomset);
        // 选择房间页面的 table
        let tableData = [];
        let useRoomFlag = false;
        Loop: for (var k = 0; k < teamBookingToRegArr.length; k++) {
          for (let item of roomset.keys()) {
            console.log(k);
            if (teamBookingToRegArr[k].booking.roomno == item) {
              // 匹配出 与 预定信息 中 房间 roomno 相同的 信息
              if (teamBookingToRegArr[k].room.rstatus != "0") {
                // 说明房间被占用，提示重新选择房间
                useRoomFlag = true;
                break Loop;
              }
              let obj = {
                roomno: teamBookingToRegArr[k].booking.roomno,
                roomlbno: teamBookingToRegArr[k].roomlb.roomlbno,
                beds: teamBookingToRegArr[k].roomlb.beds,
                price: teamBookingToRegArr[k].booking.price,
                num: teamBookingToRegArr[k].roomlb.breakfasts,
                breakfasts: teamBookingToRegArr[k].roomlb.breakfasts
              };
              tableData.push(obj);
              break;
            }
          }
        }
        console.log(tableData);
        console.log(useRoomFlag);
        /** 以上是判断房间是否被占用 */
        /** 以下是判断完善预定人信息 */
        // 预定人的信息 guestBookingToReg[0] 就可以 全都一样
        console.log(selected);
        let outdate = this.$refs["teamOccupancy"].getDtOutDate(new Date(), 1);
        let teamRegJson = {
          isgroup: teamBookingToRegArr[0].booking.isgroup,
          groupname: teamBookingToRegArr[0].guest.guestname,
          groupleader: teamBookingToRegArr[0].booking.groupleader,
          groupno: teamBookingToRegArr[0].booking.groupno,
          dt_indate: new Date(),
          dt_outdate: outdate,
          days: teamBookingToRegArr[0].booking.days,
          tel: teamBookingToRegArr[0].guest.guestname.tel,
          guestsource: teamBookingToRegArr[0].booking.guestsource,
          operid: "",
          irs: teamBookingToRegArr[0].booking.irs,
          rooms: teamBookingToRegArr[0].booking.roomno,
          special_memo: teamBookingToRegArr[0].booking.specialMemo,
          meno: teamBookingToRegArr[0].booking.meno,
          securitytype: "001",
          security_real: "",
          alreadySecurity: this.allSecurity(selected)
        };
        console.log(teamRegJson);
        console.log("bookingData", bookingnoData);
        if (useRoomFlag) {
          this.$refs["teamOccupancy"].teamOccupancydialogVisible = true;
          this.$refs["teamOccupancy"].teamRegJson = teamRegJson;
          this.$refs["teamOccupancy"].bookingnoData = bookingnoData;
          this.$refs["teamOccupancy"].chooseRoomVisiable = true;
          this.$refs["teamOccupancy"].chooseRoomTableData = [];
        } else {
          this.$refs["teamOccupancy"].teamOccupancydialogVisible = true;
          this.$refs["teamOccupancy"].teamRegJson = teamRegJson;
          this.$refs["teamOccupancy"].bookingnoData = bookingnoData;
          this.$refs["teamOccupancy"].chooseRoomVisiable = false;
          this.$refs["teamOccupancy"].chooseRoomTableData = tableData;
        }
      }
    },
    deleteGuestBooking(selected) {
      if (selected.length == 0) {
        this.$message.warning("请选择需要删除的预定房间！");
        return;
      }
      this.guestCancelTableData = deepClone(selected);
      this.guestCancelSelected = [];
      document.getElementById("guestCancelBtn").click();
    },
    deleteTeamBooking(selected) {
      if (selected.length == 0) {
        this.$message.warning("请选择需要删除的预定房间！");
        return;
      }
      this.teamCancelTableData = deepClone(selected);
      this.guestCancelSelected = [];
      document.getElementById("teamCancelBtn").click();
      console.log("团队取消预定");
    },
    // 散客删除的Dialog
    guestCancelBookings(selected) {
      if (selected.length == 0) {
        this.$message.warning("请选择需要删除的预定信息！");
      } else {
        // 打开 取消备注 框, 显示 退还总价退还押金
        selected.forEach(res => {
          this.backSecurity += res.securityReal;
        });
        this.guestCancelMenoDialog = true;
      }
    },
    // 散客删除的 确认框
    guestDeleteBookingConfirm(value) {
      this.$confirm(
        "取消预订理由：" +
          value +
          "<br/>应退押金：" +
          this.backSecurity +
          "<br/>是否继续删除?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          // 删除理由 value
          // 删除的信息（选中状态） guestCancelSelected
          console.log(this.guestCancelMeno);
          console.log(this.guestCancelSelected);
          this.resultGuestPost(this.guestCancelSelected, this.guestCancelMeno);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 团体房删除的Dialog
    teamCancelBookings(selected) {
      if (selected.length == 0) {
        this.$message.warning("请选择需要删除的预定信息！");
      } else {
        // 打开 取消备注 框, 显示 退还总价退还押金
        selected.forEach(res => {
          this.backSecurity += res.securityReal;
        });
        this.teamCancelMenoDialog = true;
      }
    },
    // 团体房删除的 确认框
    teamDeleteBookingConfirm(value) {
      this.$confirm(
        "取消预订理由：" +
          value +
          "<br/>应退押金：" +
          this.backSecurity +
          "<br/>是否继续删除?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          // 删除理由 value
          // 删除的信息（选中状态） guestCancelSelected
          console.log(this.teamCancelMeno);
          console.log(this.teamCancelSelected);
          this.resultTeamPost(this.teamCancelSelected, this.teamCancelMeno);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // Post Api
    resultGuestPost(jsonBooking, cancelMeno) {
      apiCancelGuestBooking({
        jsonBooking: JSON.stringify(jsonBooking),
        cancelMeno: cancelMeno
      }).then(res => {
        console.log(res);
        if (res.code) {
          // 初始化其他的信息
          this.guestCancelMeno = "";
          this.guestCancelBookingVisiable = false;
          this.guestCancelMenoDialog = false;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.reload();
        } else {
          this.$message({
            type: "success",
            message: "错误编号：" + res.code + " , 错误内容：" + res.msg
          });
        }
      });
    },
    resultTeamPost(jsonBooking, cancelMeno) {
      apiCalcelTeamBooking({
        jsonBooking: JSON.stringify(jsonBooking),
        cancelMeno: cancelMeno
      }).then(res => {
        console.log(res);
        if (res.code) {
          // 初始化其他的信息
          this.teamCancelMeno = "";
          this.teamCancelBookingVisiable = false;
          this.teamCancelMenoDialog = false;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.reload();
        } else {
          this.$message({
            type: "success",
            message: "错误编号：" + res.code + " , 错误内容：" + res.msg
          });
        }
      });
    },
    // -------------------------------
    allSecurity(chooseArr) {
      console.log(chooseArr);
      let security = 0;
      for (var i = 0; i < chooseArr.length; i++) {
        security += chooseArr[i].securityReal;
      }
      console.log(security);
      return security;
    }
  }
};
</script>
<style scoped>
.d-flex-direction-row {
  display: flex;
  flex-direction: row;
}
.table-width {
  height: 470px;
  border: 2px inset #ffffff;
}
.v-text-field-solo {
  margin: 0px;
  padding: 0px;
}
.el-tas-class {
  height: 560px;
  width: 1300px;
}
.el-tas-class >>> .el-tabs__content {
  padding: 0px;
}
</style>
