<template>
  <div>
    <el-button @click="sanke">散客预定</el-button>
    <div v-if="guestBookingdialogVisible">
      <el-dialog
        title="散客预定"
        :visible.sync="guestBookingdialogVisible"
        width="1000px"
        top="1px"
        :before-close="handleClose"
        :close-on-click-modal="false"
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
        <div>
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
                    <div class="left-label">预定人：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="guestBookingJson.guestname"
                      placeholder=""
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">客人类型：</div>
                    <el-select
                      v-model="guestBookingJson.guesttype"
                      class="input-right"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in guestTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">客人编号：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="guestBookingJson.guestno"
                      placeholder=""
                      :disabled="true"
                    ></el-input>
                  </div>
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">预到时间：</div>
                    <el-date-picker
                      v-model="guestBookingJson.dt_indate"
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
                      v-model="guestBookingJson.intype"
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
                  <div class="flex-direction-row margin-all">
                    <div class="flex-direction-row margin-all">
                      <div class="left-label">联系电话：</div>
                      <el-input
                        class="input-right"
                        style="width:218px;"
                        size="mini"
                        v-model="guestBookingJson.tel"
                        placeholder=""
                      ></el-input>
                    </div>
                  </div>
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label-mini">
                      {{ guestBookingJson.intype == 1 ? "小时：" : "天数：" }}
                    </div>
                    <el-input-number
                      v-model="guestBookingJson.days"
                      size="mini"
                      controls-position="right"
                      :min="guestBookingJson.intype == 1 ? 2 : 1"
                      @change="changeDays"
                    ></el-input-number>
                  </div>
                  <!-- <div class="flex-direction-row margin-all">
                    <div class="flex-direction-row margin-all">
                      <div class="left-label-mini">状态：</div>
                      <el-select
                        style="width:130px;"
                        v-model="guestBookingJson.cstatus"
                        size="mini"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div> -->
                </div>
                <div class="flex-direction-column">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">预离时间：</div>
                    <el-date-picker
                      v-model="guestBookingJson.dt_outdate"
                      type="datetime"
                      placeholder="选择日期时间"
                      @change="dtOutDateChange"
                      default-time="12:00:00"
                      :picker-options="dtOutDatePickerOptions"
                      size="mini"
                    >
                    </el-date-picker>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">保留时间：</div>
                    <el-date-picker
                      v-model="guestBookingJson.dt_keep"
                      type="datetime"
                      placeholder="选择日期时间"
                      @change="dtKeepDateChange"
                      default-time="12:00:00"
                      size="mini"
                    >
                    </el-date-picker>
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
                      v-model="guestBookingJson.guestsource"
                      placeholder=""
                      :disabled="true"
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label-mini">人数：</div>
                    <el-input-number
                      v-model="guestBookingJson.irs"
                      :min="1"
                      size="mini"
                      controls-position="right"
                    ></el-input-number>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">性别：</div>
                    <el-select
                      v-model="guestBookingJson.sex"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sexOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">预定方式：</div>
                    <el-select
                      v-model="guestBookingJson.bookingtype"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in bookingtypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="flex-direction-row">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">证件类型：</div>
                    <el-select
                      v-model="guestBookingJson.idtypeno"
                      class="input-right"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in idtypenoOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">证件号：</div>
                    <el-input
                      class="input-right"
                      style="width:180px;"
                      v-model="guestBookingJson.idno"
                      size="mini"
                    ></el-input>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">出生日期：</div>
                    <el-date-picker
                      v-model="guestBookingJson.dt_birthday"
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </div>
                </div>
                <div class="flex-direction-row">
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">国籍：</div>
                    <el-select
                      v-model="guestBookingJson.countryno"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in countrynoOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label-mini">地区：</div>
                    <el-select
                      v-model="guestBookingJson.areano"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in areanoOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">地址：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="guestBookingJson.address"
                      placeholder=""
                    ></el-input>
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
                      v-model="guestBookingJson.special_memo"
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
                      v-model="guestBookingJson.meno"
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
                    <el-select
                      v-model="guestBookingJson.securitytype"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in securityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex-direction-row margin-all">
                    <div class="left-label">实收押金：</div>
                    <el-input
                      class="input-right"
                      size="mini"
                      v-model="guestBookingJson.security_real"
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
import ChooseRoom from "../components/ChooseRoom";
import { apiInsertBooking } from "@/request/api";
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
      guestBookingdialogVisible: false,
      guestBookingJson: {
        guestname: "",
        guesttype: "0",
        guestno: "",
        secrecyflag: "0",
        dt_indate: "",
        days: "1",
        dt_outdate: "",
        dt_keep: "",
        cstatus: "1",
        bookingtype: "0",
        intype: "0",
        tel: "",
        guestsource: "上门散客",
        irs: "",
        sex: "0",
        idtypeno: "0",
        idno: "",
        dt_birthday: "",
        countryno: "0",
        areano: "0",
        address: "",
        special_memo: "",
        meno: "",
        securitytype: "001",
        security_real: "",
        operid: "",
        isgroup: "0",
        irooms: ""
      },
      statusOptions: [
        { value: "0", label: "未确认" },
        { value: "1", label: "已确认" }
      ],
      intypeOptions: [
        { value: "0", label: "正常" },
        { value: "1", label: "钟点房" },
        { value: "2", label: "长包房" }
      ],
      securityOptions: [
        { value: "001", label: "现金" },
        { value: "002", label: "银行卡" },
        { value: "003", label: "支付宝" },
        { value: "004", label: "微信" }
      ],
      sexOptions: [
        { value: "0", label: "男" },
        { value: "1", label: "女" }
      ],
      bookingtypeOptions: [
        { value: "0", label: "上门预定" },
        { value: "1", label: "电话预定" },
        { value: "2", label: "携程预定" },
        { value: "3", label: "美团预定" }
      ],
      guestTypeOptions: [{ value: "0", label: "普通客人" }],
      idtypenoOptions: [
        { value: "0", label: "身份证" },
        { value: "1", label: "护照" }
      ],
      countrynoOptions: [{ value: "0", label: "中国" }],
      areanoOptions: [{ value: "0", label: "四川省成都市" }],
      chooseRoomTableData: [],
      linkRoomno: "",
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
      }
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      // 初始化是下一天的开始
      let bookingDate = new Date(Date.parse(new Date()) + 86400000);
      bookingDate.setHours(12, 0, 0, 0);
      this.guestBookingJson.dt_indate = bookingDate;
      this.guestBookingJson.dt_outdate = this.getDtOutDate(
        bookingDate,
        this.guestBookingJson.days
      );
      this.guestBookingJson.dt_keep = this.getDtKeep();
      // 初始化，房间选择表格
      /*       this.$refs["chooseRoom"].changeRoomForTime(
        this.guestBookingJson.dt_indate,
        this.guestBookingJson.dt_outdate
      ); */
    },
    sanke() {
      this.guestBookingdialogVisible = true;
      console.log("散客入住");
    },
    // 弹出框右边 X 的点击事件
    handleClose() {
      this.closeDialog();
    },
    // 起始时间Change
    dtIndateChange(value) {
      console.log(this.guestBookingJson.intype);
      if (this.guestBookingJson.dt_indate < Date.now() - 3000) {
        this.timeClearn();
        return this.$message.error("入住时间不能小于当前时间");
      }

      if (this.guestBookingJson.intype == 1) {
        // 表明房间类型为 终点房。钟点房按小时算
        this.guestBookingJson.dt_outdate = this.getDtOutDateForHour(
          this.guestBookingJson.dt_indate,
          this.guestBookingJson.days
        );
        this.guestBookingJson.dt_keep = this.getDtKeep();
      } else if (this.guestBookingJson == 2) {
        // 表明房间类型为 长包房
        this.guestBookingJson.dt_outdate = this.getDtOutDate(
          this.guestBookingJson.dt_indate,
          this.guestBookingJson.days
        );
        this.guestBookingJson.dt_keep = this.getDtKeep();
      } else {
        // 表明房间类型为 普通房间，日期类型不变
        this.guestBookingJson.dt_outdate = this.getDtOutDate(
          this.guestBookingJson.dt_indate,
          this.guestBookingJson.days
        );
        this.guestBookingJson.dt_keep = this.getDtKeep();
        console.log("起始时间：" + value);
      }
      // 父组件调用子组件的方法
      console.log(this.guestBookingJson.dt_indate);
      console.log(this.guestBookingJson.dt_outdate);
      this.$refs["chooseRoom"].changeRoomForTime(
        this.guestBookingJson.dt_indate,
        this.guestBookingJson.dt_outdate
      );
    },
    // 离开时间Change
    dtOutDateChange(value) {
      let short = value - this.guestBookingJson.dt_indate;
      if (short < 0) {
        this.guestBookingJson.dt_outdate = "";
        return this.$message.error("预计离开时间不能小于起始时间");
      }
      // 判断入住类型
      if (this.guestBookingJson.intype == 1) {
        // 表明房间类型为 终点房
        this.guestBookingJson.days = Math.ceil(short / 3600000);
      } else if (this.guestBookingJson == 2) {
        // 表明房间类型为 长包房
        this.guestBookingJson.days = Math.ceil(short / 86400000);
      } else {
        this.guestBookingJson.days = Math.ceil(short / 86400000);
      }
      this.$refs["chooseRoom"].changeRoomForTime(
        this.guestBookingJson.dt_indate,
        this.guestBookingJson.dt_outdate
      );
    },
    changeDays(value) {
      console.log(this.guestBookingJson);
      if (this.guestBookingJson.intype == 1) {
        this.guestBookingJson.dt_outdate = this.getDtOutDateForHour(
          this.guestBookingJson.dt_indate,
          value
        );
      } else {
        // 长包房与普通房计算方式一样
        this.guestBookingJson.dt_outdate = this.getDtOutDate(
          this.guestBookingJson.dt_indate,
          value
        );
      }
      this.$refs["chooseRoom"].changeRoomForTime(
        this.guestBookingJson.dt_indate,
        this.guestBookingJson.dt_outdate
      );
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
      this.guestBookingJson.dt_indate = "";
      this.guestBookingJson.dt_outdate = "";
      this.guestBookingJson.dt_keep = "";
      this.guestBookingJson.days = "";
    },

    // 计算保留时间
    dtKeepDateChange(value) {
      let dtOutDate = this.guestBookingJson.dt_outdate;
      if (value > dtOutDate) {
        this.guestBookingJson.dt_keep = "";
        this.$message.error("保留时间不能大于离开时间");
      }
      this.guestBookingJson.dt_keep = this.getDtKeep();
      console.log(value);
    },
    // 获取保留时间
    getDtKeep() {
      let dtIndate = this.guestBookingJson.dt_indate;
      let ms = Date.parse(dtIndate);
      let keepDate = new Date(ms + 7200000);
      console.log(keepDate);
      return keepDate;
    },
    // =============== 操作按钮 =====================
    saveData() {
      if (this.chooseRoomTableData.length == 0) {
        return this.$message.error("请选择入住房间");
      }
      if (this.guestBookingJson.guestname == "") {
        return this.$message.error("请输入入住人姓名");
      }
      this.saveLoading = true;
      let userInfo = this.$store.state.userInfo.userInfo;

      let result = [];
      for (var i = 0; i < this.chooseRoomTableData.length; i++) {
        let obj = deepClone(this.guestBookingJson);
        obj.irooms = this.chooseRoomTableData.length;
        obj.roomno = this.chooseRoomTableData[i].roomno;
        obj.roomlbno = this.chooseRoomTableData[i].roomlbno;
        obj.price = this.chooseRoomTableData[i].price;
        obj.dt_indate = parseTime(this.guestBookingJson.dt_indate);
        obj.dt_outdate = parseTime(this.guestBookingJson.dt_outdate);
        obj.dt_birthday = parseTime(this.guestBookingJson.dt_birthday);
        obj.dt_keep = parseTime(this.guestBookingJson.dt_keep);
        obj.operid = userInfo.operid;
        obj.security_real = Number(
          this.guestBookingJson.security_real / this.chooseRoomTableData.length
        );
        result.push(obj);
      }

      this.linkRoomno = result.length == 1 ? "" : result[0].roomno;
      console.log(result);
      console.log(this.linkRoomno);
      this.requestSave(result);
    },
    closeDialog() {
      this.guestBookingdialogVisible = false;
    },
    requestSave(result) {
      apiInsertBooking({
        bookingJson: JSON.stringify(result),
        linkRoomno: this.linkRoomno
      }).then(res => {
        console.log("res", res);
        if (res.code == 200) {
          this.$message.success("预定成功");
          this.saveLoading = false;
          this.reload();
        } else {
          this.saveLoading = false;
          this.$message.error(res.code + " : " + res.msg);
        }
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
