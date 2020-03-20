<template>
  <div>
    <v-card>
      <v-card-title class="headline">客房续住</v-card-title>
      <v-card-text>
        <div class="reg-info">
          <div>
            <fieldset>
              <legend>订单信息</legend>
              <div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>订单号:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.regno"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>状态:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.rstatus"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>入住时间:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.dtIndate"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>离店时间:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.dtOutdate"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>首日房价:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.regPrice"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>居住天数:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.days"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>房间信息</legend>
              <div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>
                      红苹果酒店( {{ roomqtyInfo.roomlbname }} ) 房间种类
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>房间编号：</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.roomno"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>房间价格：</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.roomPrice"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>客人信息</legend>
              <div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>入住人:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.guestname"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>联系电话:</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.tel"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset>
              <legend>续住信息</legend>
              <div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>续住天数:</div>
                    <div>
                      <el-input v-model="roomqtyInfo.roomqty" size="mini" />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>您的退房时间：</div>
                    <div>
                      <el-input v-model="newDtOutdate" disabled size="mini" />
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>续住房费：</div>
                    <div>
                      <el-input
                        v-model="roomqtyInfo.payPrice"
                        disabled
                        size="mini"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="renew-reg-info"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">
          取消
        </v-btn>
        <v-btn color="green darken-1" text @click="roomqty">
          续房
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { deepClone, parseTime } from "../../../utils";
import { apiRoomqtyReg } from "@/request/api";
export default {
  props: {
    renewRegDialog: {
      type: Boolean
    },
    renewRegData: {
      type: Array
    }
  },
  data() {
    return {
      input: "123123123",
      roomqtyInfo: {}
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      let renewRegData = deepClone(this.renewRegData);
      this.initPageInfo(renewRegData);
    },
    initPageInfo(renewRegData) {
      let info = deepClone(renewRegData[0]);
      let now = new Date().getTime();
      let rstatus = "";
      if (info.reg.dtIndate < now) {
        if (info.reg.dtOutdate > now) {
          rstatus = "在住";
        } else {
          rstatus = "逾期";
        }
      } else {
        rstatus = "未入住";
      }
      let obj = {
        regno: info.reg.regno,
        rstatus: rstatus,
        dtIndate: parseTime(new Date(info.reg.dtIndate)),
        dtOutdate: parseTime(new Date(info.reg.dtOutdate)),
        regPrice: info.reg.price,
        days: info.reg.days,
        roomno: info.reg.roomno,
        roomlbname: info.roomlb.roomlbname,
        roomPrice: info.room.price,
        guestname: info.guest.guestname,
        tel: info.guest.tel,
        roomqty: "",
        newDtOutdate: "",
        payPrice: ""
      };
      this.roomqtyInfo = obj;
      console.log(this.roomqtyInfo);
    },
    roomqty() {
      if (this.roomqtyInfo.roomqty == "") {
        return this.$message.warning("请填写续住天数");
      }
      let userInfo = this.$store.state.userInfo.userInfo;
      this.roomqtyInfo.newDtOutdate = this.newDtOutdate;
      console.log("房间续住信息");
      console.log(this.roomqtyInfo);
      console.log(this.renewRegData);
      // 续房不能修改 meno 以及 dtOper
      let orignRoomBill = this.renewRegData[0].regBill.filter(res => {
        return (
          res.itemno == "001" && res.regno == this.renewRegData[0].reg.regno
        );
      });
      console.log("orignRoomBill", orignRoomBill);
      let maxDtOperBill = orignRoomBill[0].regBill;
      let dtOper = orignRoomBill[0].dtOper;
      // 当前时间
      let now = new Date().getTime();
      for (var i = 0; i < orignRoomBill.length; i++) {
        if (now - orignRoomBill[i].dtOper < dtOper) {
          dtOper = orignRoomBill[i].dtOper;
          maxDtOperBill = orignRoomBill[i];
        }
      }
      console.log("最去最近的房租账单");
      console.log(maxDtOperBill);

      let regBill = deepClone(maxDtOperBill);
      // 这里的RegBill 应该是 里现在最近的 RegBill， 与 换房的 bill一样，然后修改换房的 regbillnum以及totalprice
      regBill.num = regBill.num + Number(this.roomqtyInfo.roomqty);
      regBill.totalprice += Number(this.roomqtyInfo.roomqty) * regBill.price;
      regBill.dtOutdate = parseTime(this.newDtOutdate);
      regBill.dtOper = parseTime(now);
      regBill.operid = userInfo.operid;
      regBill.meno = "续房";
      console.log(this.roomqtyInfo);
      console.log(regBill);

      this.resultApi(this.roomqtyInfo, regBill);
    },
    closeDialog() {
      this.$emit("update:renewRegDialog", false);
    },
    resultApi(regjson, resultjson) {
      apiRoomqtyReg({
        regjson: JSON.stringify(regjson),
        resultjson: JSON.stringify(resultjson)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$emit("renewPageReload");
        }
      });
    }
  },
  computed: {
    newDtOutdate() {
      if (this.roomqtyInfo.roomqty == "") {
        return "";
      } else {
        return parseTime(
          new Date(
            new Date(this.roomqtyInfo.dtOutdate).getTime() +
              86400000 * Number(this.roomqtyInfo.roomqty)
          )
        );
      }
    }
  }
};
</script>
<style scoped>
.dialog {
  height: 100%;
  background-color: aquamarine;
}
.dialog-title {
  margin: 0px 10px;
}
.dialog-content {
  height: 90%;
  margin: 0px 10px;
  background-color: antiquewhite;
}
.bill-table-title {
  text-align: center;
}
</style>
