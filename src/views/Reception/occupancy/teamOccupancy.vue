<template>
  <div>
    <div v-if="teamOccupancydialogVisible">
      <el-dialog
        title="团体入住"
        :visible.sync="teamOccupancydialogVisible"
        width="1000px"
        :before-close="handleClose"
        :close-on-click-modal="false"
        top="1px"
        class="el-dialog-class"
      >
        <!-- 上部操作按钮 -->
        <div>
          <!-- <opeartion @saveData="saveData" @closeDialog="closeDialog" /> -->
          <el-button size="small" @click="saveData" :loading="saveLoading"
            >保存</el-button
          >
          <el-button size="small" @click="closeDialog">退出</el-button>
        </div>
        <!-- 中部房间管理操作按钮 -->
        <div v-if="chooseRoomVisiable">
          <choose-room
            ref="chooseRoom"
            :chooseRoomTableData.sync="chooseRoomTableData"
          />
        </div>
        <!-- 下部主要信息 -->
        <div>
          <div>主要信息</div>
          <div>
            <fieldset>
              <legend>主要信息</legend>
              <div class="flex-direction-row">
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">团队名称：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="teamRegJson.groupname"
                      placeholder=""
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">团队领队：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="teamRegJson.groupleader"
                      placeholder=""
                    ></el-input>
                  </div>
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">抵店时间：</div>
                    <el-date-picker
                      v-model="teamRegJson.dt_indate"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-value
                      @change="dtIndateChange"
                      :picker-options="dtIndatePickerOptions"
                      size="mini"
                    >
                    </el-date-picker>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">入住类型：</div>
                    <el-select
                      v-model="teamRegJson.intype"
                      placeholder="请选择"
                      size="mini"
                      @change="intypeChange"
                    >
                      <el-option
                        v-for="item in intypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label-mini">
                      {{ teamRegJson.intype == 1 ? "小时：" : "天数：" }}
                    </div>
                    <el-input-number
                      v-model="teamRegJson.days"
                      size="mini"
                      controls-position="right"
                      :min="teamRegJson.intype == 1 ? 2 : 1"
                      @change="changeDays"
                    ></el-input-number>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">联系电话：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="teamRegJson.tel"
                      placeholder=""
                    ></el-input>
                  </div>
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">预离时间：</div>
                    <el-date-picker
                      v-model="teamRegJson.dt_outdate"
                      type="datetime"
                      placeholder="选择日期时间"
                      @change="dtOutDateChange"
                      :picker-options="dtOutDatePickerOptions"
                      default-time="12:00:00"
                      size="mini"
                    >
                    </el-date-picker>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label"></div>
                    <div class="input-right"></div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>其他信息</legend>
              <div class="flex-direction-column">
                <div class="flex-direction-row">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">客人来源：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="teamRegJson.guestsource"
                      placeholder=""
                      :disabled="true"
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label-mini">人数：</div>
                    <el-input-number
                      v-model="teamRegJson.irs"
                      :min="1"
                      size="mini"
                      controls-position="right"
                    ></el-input-number>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">房间数：</div>
                    <el-input-number
                      v-model="teamRegJson.irooms"
                      :min="1"
                      size="mini"
                      controls-position="right"
                    ></el-input-number>
                  </div>
                </div>
                <div class="flex-direction-row">
                  <div class="flex-direction-row margin-all">
                    <div style="margin-top:2px;width:70px;">
                      特别说明：
                    </div>
                    <el-input
                      style="width: 180px;"
                      size="mini"
                      v-model="teamRegJson.special_memo"
                      placeholder=""
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div style="margin-top:2px;width:70px;">
                      备注：
                    </div>
                    <el-input
                      style="width: 180px;"
                      size="mini"
                      v-model="teamRegJson.meno"
                      placeholder=""
                    ></el-input>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>押金</legend>
              <div class="flex-direction-column">
                <div class="flex-direction-row">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">付款方式：</div>
                    <!-- v-model="teamRegJson.securitytype" -->
                    <el-select
                      v-model="teamRegJson.securitytype"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">付款金额：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="teamRegJson.security_real"
                      placeholder=""
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label" style="width:130px;">
                      预定时已支付押金：
                    </div>
                    <el-input
                      class="input-right"
                      size="mini"
                      disabled
                      v-model="teamRegJson.alreadySecurity"
                      placeholder=""
                    ></el-input>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/* import Opeartion from "@/views/components/OpeartionBtn"; */
import ChooseRoom from "../components/RegChooseRoom";
import { apiInsRegForBooking } from "@/request/api";
import { deepClone, parseTime } from "@/utils";
export default {
  components: {
    /*     Opeartion, */
    ChooseRoom
  },
  inject: ["reload"],
  data() {
    return {
      saveLoading: false,
      chooseRoomVisiable: true,
      teamOccupancydialogVisible: false,
      teamRegJson: {
        bookingno: "",
        isgroup: "1",
        groupname: "",
        groupleader: "",
        groupno: "",
        dt_indate: "",
        dt_outdate: "",
        intype: "0",
        days: "",
        tel: "",
        guestsource: "上门散客",
        operid: "",
        irs: "1",
        rooms: "",
        special_memo: "",
        meno: "",
        securitytype: "001",
        security_real: ""
      },
      options: [
        { value: "001", label: "现金" },
        { value: "002", label: "银行卡" },
        { value: "003", label: "支付宝" },
        { value: "004", label: "微信" }
      ],
      intypeOptions: [
        { value: "0", label: "正常" },
        { value: "1", label: "钟点房" },
        { value: "2", label: "长包房" }
      ],
      // 预到时间 禁用日期
      dtIndatePickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 86400000;
        }
      },
      // 预离时间 禁用日期
      dtOutDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 86400000;
        }
      },
      chooseRoomTableData: [],
      // 预定单号的信息
      bookingnoData: [],
      linkRoomno: ""
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.teamRegJson.dt_indate = new Date();
      this.teamRegJson.dt_outdate = this.getDtOutDate(
        this.teamRegJson.dt_indate,
        this.teamRegJson.days
      );
    },
    // 弹出框按钮点击事件
    team() {
      this.teamOccupancydialogVisible = true;
    },
    // 弹出框右边 X 的点击事件
    handleClose() {
      /*       this.$confirm("发现内容已修改,确认关闭？")
        .then(res => {
          this.teamOccupancydialogVisible = false;
        })
        .catch(error => {}); */
      this.closeDialog();
    },

    // 起始时间Change
    dtIndateChange(value) {
      console.log(this.teamRegJson.dt_indate.getTime());
      console.log(Date.now());
      if (this.teamRegJson.dt_indate < Date.now() - 3000) {
        this.timeClearn();
        return this.$message.error("入住时间不能小于当前时间");
      }
      if (this.teamRegJson.dt_indate > Date.now() + 3000) {
        this.timeClearn();
        return this.$message.error("入住时间不能大于当前时间");
      }
      if (this.teamRegJson.intype == 1) {
        // 表明房间类型为 终点房。钟点房按小时算
        this.teamRegJson.dt_outdate = this.getDtOutDateForHour(
          this.teamRegJson.dt_indate,
          this.teamRegJson.days
        );
      } else if (this.teamRegJson == 2) {
        // 表明房间类型为 长包房
        this.teamRegJson.dt_outdate = this.getDtOutDate(
          this.teamRegJson.dt_indate,
          this.teamRegJson.days
        );
      } else {
        // 表明房间类型为 普通房间，日期类型不变
        this.teamRegJson.dt_outdate = this.getDtOutDate(
          this.teamRegJson.dt_indate,
          this.teamRegJson.days
        );
        console.log("起始时间：" + value);
      }
      // 父组件调用子组件的方法
      console.log(this.teamRegJson.dt_indate);
      console.log(this.teamRegJson.dt_outdate);
      /*       this.$refs["chooseRoom"].changeRoomForTime(
        this.teamRegJson.dt_indate,
        this.teamRegJson.dt_outdate
      ); */
    },
    // 离开时间Change
    dtOutDateChange(value) {
      let short = value - this.teamRegJson.dt_indate;
      if (short < 0) {
        this.teamRegJson.dt_outdate = "";
        return this.$message.error("预计离开时间不能小于起始时间");
      }
      // 判断入住类型
      if (this.teamRegJson.intype == 1) {
        // 表明房间类型为 终点房
        this.teamRegJson.days = Math.ceil(short / 3600000);
      } else if (this.teamRegJson == 2) {
        // 表明房间类型为 长包房
        this.teamRegJson.days = Math.ceil(short / 86400000);
      } else {
        this.teamRegJson.days = Math.ceil(short / 86400000);
      }
    },
    changeDays(value) {
      console.log(this.teamRegJson);
      if (this.teamRegJson.intype == 1) {
        this.teamRegJson.dt_outdate = this.getDtOutDateForHour(
          this.teamRegJson.dt_indate,
          value
        );
      } else {
        // 长包房与普通房计算方式一样
        this.teamRegJson.dt_outdate = this.getDtOutDate(
          this.teamRegJson.dt_indate,
          value
        );
      }
    },
    // 计算离开时间
    getDtOutDate(inDate, days) {
      let nowms = Date.parse(inDate);
      let ms = Number(days) * 86400000;
      let outDate = new Date(nowms + ms);
      outDate.setHours(12, 0, 0, 0);
      return outDate;
    },
    // 计算离开时间，按小时算
    getDtOutDateForHour(inDate, hours) {
      let nowms = Date.parse(inDate);
      let ms = Number(hours) * 3600000;
      let outDate = new Date(nowms + ms);
      return outDate;
    },
    intypeChange() {
      // 终点房默认时长需要进行修改
      this.timeClearn();
    },
    timeClearn() {
      this.teamRegJson.dt_indate = "";
      this.teamRegJson.dt_outdate = "";
      this.teamRegJson.dt_keep = "";
      this.teamRegJson.days = "";
    },
    // 改变时间格式
    objtimeChangeStr() {},
    // =============== 操作按钮 =====================
    saveData() {
      if (this.chooseRoomTableData.length == 0) {
        return this.$message.warning("请选择入住房间");
      }
      if (
        Number(this.teamRegJson.security_real) == 0 &&
        Number(this.teamRegJson.alreadySecurity) == 0
      ) {
        return this.$message.warning("请输入支付押金");
      }
      this.saveLoading = true;
      let userInfo = this.$store.state.userInfo.userInfo;
      let result = [];
      for (var i = 0; i < this.chooseRoomTableData.length; i++) {
        let obj = deepClone(this.teamRegJson);
        obj.irooms = this.chooseRoomTableData.length;
        obj.roomno = this.chooseRoomTableData[i].roomno;
        obj.roomlbno = this.chooseRoomTableData[i].roomlbno;
        obj.price = this.chooseRoomTableData[i].price;
        obj.dt_indate = parseTime(this.teamRegJson.dt_indate);
        obj.dt_outdate = parseTime(this.teamRegJson.dt_outdate);
        obj.operid = userInfo.operid;
        obj.security_real = Math.ceil(
          (this.teamRegJson.security_real * 1.0 +
            this.teamRegJson.alreadySecurity) /
            this.chooseRoomTableData.length
        );

        // 预订单号
        // 判断房间是否被占用
        if (this.chooseRoomVisiable) {
          // 房间被占用，需要重新选取房间
          if (i < this.bookingnoData.length) {
            obj.bookingno = this.bookingnoData[i].bookingno;
          } else {
            return this.$message.error("您选择的房间,超出了起初的预定数量");
          }
        } else {
          // 房间没有被占用，检索房间号与预订单号
          for (var j = 0; j < this.bookingnoData.length; j++) {
            if (this.bookingnoData[j].roomno == obj.roomno) {
              obj.bookingno = this.bookingnoData[j].bookingno;
              break;
            }
          }
        }

        result.push(obj);
      }
      let dividedSecurity = Math.ceil(
        (this.teamRegJson.security_real * 1.0) / this.chooseRoomTableData.length
      );
      // linkno 联房编号 团体房中联房no 就是
      this.linkRoomno = result[0].roomno;
      console.log(result);
      console.log(this.linkRoomno);
      console.log(dividedSecurity);
      console.log("执行了吗？");
      this.requestSave(result, dividedSecurity);
    },
    closeDialog() {
      this.teamOccupancydialogVisible = false;
    },
    requestSave(result, dividedSecurity) {
      apiInsRegForBooking({
        jsonReg: JSON.stringify(result),
        linkRoomno: this.linkRoomno,
        dividedSecurity: dividedSecurity
      }).then(res => {
        console.log("res", res);
        if (res.code == 200) {
          this.$message.success("团队转预定成功！");
          this.saveLoading = false;
          this.reload();
        } else {
          this.saveLoading = false;
          this.$message.success(res.code + ":" + res.msg);
        }
      });
    }
  },
  watch: {
    chooseRoomTableData(oldVal, newVal) {
      this.teamRegJson.irooms = this.chooseRoomTableData.length;
      console.log(this.teamRegJson.irooms);
    }
  }
};
</script>
<style scoped>
.flex-direction-row {
  display: flex;
  flex-direction: row;
}
.flex-direction-column {
  display: flex;
  flex-direction: column;
}
.margin-all {
  margin: 3px;
}
.left-label {
  margin-top: 2px;
  width: 70px;
}
.left-label-mini {
  margin-top: 2px;
  width: 50px;
}
.input-right {
  width: 100px;
}
.input-right-mini {
  width: 50px;
}
.el-dialog-class >>> .el-dialog__header {
  padding: 10px !important;
}
.el-dialog-class >>> .el-dialog__body {
  padding: 10px !important;
}
</style>
