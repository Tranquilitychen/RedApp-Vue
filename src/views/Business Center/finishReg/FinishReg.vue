<template>
  <div>
    <v-card>
      <v-card-title>
        <div>收银结账</div>
      </v-card-title>
      <v-card-text>
        <div>
          <div class="regBill-table">
            <div class="bill-table-title">结账区内房间</div>
            <v-data-table
              :headers="headers"
              :items="tableData"
              item-key="roomno"
              show-expand
              class="elevation-1"
              hide-default-footer
              dense
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="padding:0px">
                  <v-data-table
                    :headers="billHeader"
                    :items="item.regBills"
                    hide-default-footer
                    dense
                    dark
                    sort-by="itemno"
                  ></v-data-table>
                </td>
              </template>
            </v-data-table>
          </div>
          <div class="guest-info">
            <fieldset>
              <legend>客人信息</legend>
              <div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>结帐单号：</div>
                    <div>
                      <el-input
                        class="large-input"
                        v-model="infoData.regno"
                        disabled
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>宾客姓名：</div>
                    <div>
                      <el-input
                        v-model="infoData.guestname"
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>结帐房间：</div>
                    <div>
                      <el-input
                        v-model="infoData.roomno"
                        disabled
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <div class="d-flex flex-row">
                    <div>消费金额：</div>
                    <div>
                      <el-input
                        v-model="infoData.price"
                        disabled
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div>已收押金：</div>
                    <div>
                      <el-input
                        v-model="infoData.securityReal"
                        disabled
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div class="room-bill">
            <div>
              <fieldset>
                <legend>消费账单</legend>
                <div>
                  <div class="d-flex flex-row">
                    <div class="d-flex flex-row">
                      <div>应收金额：</div>
                      <div>
                        <el-input
                          v-model="infoData.mustPrice"
                          size="mini"
                        ></el-input>
                      </div>
                    </div>

                    <div class="d-flex flex-row">
                      <div>优惠金额：</div>
                      <div>
                        <el-input
                          v-model="infoData.discount"
                          disabled
                          size="mini"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="d-flex flex-row">
                      <div>实收金额：</div>
                      <div>
                        <el-input
                          v-model="infoData.amountReceviable"
                          size="mini"
                        ></el-input>
                      </div>
                    </div>
                    <div class="d-flex flex-row">
                      <div>找零：</div>
                      <div>
                        <el-input
                          v-model="change"
                          disabled
                          size="mini"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="d-flex flex-row">
                      <div>结账备注：</div>
                      <div>
                        <el-input
                          v-model="infoData.paymeno"
                          size="mini"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary darken-1" dark @click="closeDialog"
          >取消</v-btn
        >
        <v-btn outlined color="primary darken-1" dark @click="closeReg"
          >结账</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="resultDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">消费账单</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column">
            <div class="d-flex flex-row">
              <v-chip class="ma-2 chip-size" label color="primary" outlined>
                <v-icon left>mdi-account-outline</v-icon>
                应收金额
              </v-chip>
              <v-chip class="ma-2 chip-size" color="red" outlined>
                {{ details.showprice }}元</v-chip
              >
            </div>
            <div class="d-flex flex-row">
              <v-chip class="ma-2 chip-size" label color="primary" outlined>
                <v-icon left>mdi-account-outline</v-icon>
                实收金额
              </v-chip>
              <v-chip class="ma-2 chip-size" color="red" outlined
                >{{ details.receviableprice }}元</v-chip
              >
            </div>
            <div class="d-flex flex-row">
              <v-chip class="ma-2 chip-size" label color="primary" outlined>
                <v-icon left>mdi-account-outline</v-icon>
                应该找零
              </v-chip>
              <v-chip class="ma-2 chip-size" color="red" outlined
                >{{ details.change }}元</v-chip
              >
            </div>
            <div class="d-flex flex-row">
              <v-chip class="ma-2 chip-size" label color="primary" outlined>
                <v-icon left>mdi-account-outline</v-icon>
                应退押金
              </v-chip>
              <v-chip class="ma-2 chip-size" color="red" outlined
                >{{ details.security }}元</v-chip
              >
            </div>
            <div class="d-flex flex-row">
              <v-chip class="ma-2 chip-size" label color="primary" outlined>
                <v-icon left>mdi-account-outline</v-icon>
                账单备注
              </v-chip>
              <v-chip class="ma-2 chip-size" color="red" outlined>{{
                details.meno
              }}</v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outlined @click="resultDialog = false"
            >取消</v-btn
          >
          <v-btn color="red darken-1" outlined @click="submitApi"
            >确定结账</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { deepClone } from "../../../utils";
import { apiCloseReg } from "@/request/api";
export default {
  props: {
    finishRegData: {
      type: Array
    },
    linkRoomRegDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      resultDialog: false,
      input: "",
      headers: [
        { text: "房间号", value: "roomno" },
        { text: "账单编号", value: "regno" },
        { text: "客人姓名", value: "guestname" },
        { text: "入住天数", value: "days" },
        { text: "消费总额", value: "totalprice" },
        { text: "已收押金", value: "security" },
        { text: "", value: "data-table-expand" }
      ],
      billHeader: [
        { text: "编号", value: "itemno", sortable: false },
        { text: "名称", value: "itemname", sortable: false },
        { text: "消费房间", value: "roomno", sortable: false },
        { text: "单价", value: "price", sortable: false },
        { text: "数量", value: "num", sortable: false },
        { text: "总价", value: "totalprice", sortable: false },
        { text: "备注", value: "meno", sortable: false }
      ],
      tableData: [],
      infoData: {
        regno: "",
        roomno: "",
        guestname: "",
        price: 0,
        mustPrice: 0,
        securityReal: 0,
        discount: "",
        amountReceviable: 0,
        change: "",
        paymeno: ""
      },
      resultData: [],
      defaultTable: {
        roomno: "",
        regno: "",
        guestname: "",
        days: 0,
        totalprice: 0.0,
        security: 0.0,
        discount: 0.0,
        regBills: []
      },
      defaultRegBill: {
        itemno: "",
        itemname: "",
        roomno: "",
        price: 0.0,
        num: 0,
        totalprice: 0.0,
        meno: ""
      },
      details: {
        showprice: 0.0,
        receviableprice: 0.0,
        change: 0.0,
        security: 0.0,
        meno: ""
      }
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      let templateArr = deepClone(this.finishRegData);
      console.log(templateArr);
      this.initTableData(deepClone(templateArr));
    },
    initTableData(templateArr) {
      let userInfo = this.$store.state.userInfo.userInfo;
      for (var i = 0; i < templateArr.length; i++) {
        let regBill = templateArr[i].regBill;
        let obj = deepClone(this.defaultTable);
        obj.roomno = templateArr[i].reg.roomno;
        obj.regno = templateArr[i].reg.regno;
        obj.security = templateArr[i].reg.securityReal;
        obj.guestname =
          templateArr[i].reg.isgroup == "0"
            ? templateArr[i].reg.guestname
            : templateArr[i].reg.groupname;

        // 设置 result
        let resultObj = {
          regno: "",
          roomno: "",
          bookingno: "",
          guestno: "",
          flowids: [],
          sourcetype: "",
          operid: "",
          meno: "",
          totalSecurity: 0.0,
          totalRegBill: 0.0
        };
        resultObj.regno = templateArr[i].reg.regno;
        resultObj.roomno = templateArr[i].reg.roomno;
        resultObj.bookingno = templateArr[i].reg.bookingno;
        resultObj.guestno = templateArr[i].reg.guestno;
        resultObj.sourcetype = templateArr[i].reg.securitytype;
        resultObj.operid = userInfo.operid;
        resultObj.meno = "客房结算，退还押金，收取消费金额";
        resultObj.totalSecurity = templateArr[i].reg.securityReal;

        let total = 0.0;
        let days = 0;
        let totalDiscount = 0.0;
        for (var j = 0; j < regBill.length; j++) {
          let regBillObj = deepClone(this.defaultRegBill);
          regBillObj.itemno = regBill[j].itemno;
          regBillObj.itemname = regBill[j].itemname;
          regBillObj.roomno = regBill[j].roomno;
          regBillObj.price = regBill[j].price;
          regBillObj.num = regBill[j].num;
          regBillObj.totalprice = regBill[j].totalprice;
          regBillObj.meno = regBill[j].meno;
          total += Number(regBill[j].totalprice);
          totalDiscount += Number(regBill[j].discount);
          if (regBill[j].itemno == "001") {
            days += regBill[j].num;
          }
          resultObj.flowids.push(regBill[j].flowid);
          obj.regBills.push(regBillObj);
        }
        resultObj.totalRegBill = total;
        obj.days = days;
        obj.totalprice = total;
        obj.discount = totalDiscount;
        this.tableData.push(obj);
        this.resultData.push(resultObj);
      }
      console.log(this.tableData);
      // 初始化 结账信息
      this.initInfoData(this.tableData);
    },
    initInfoData(tableData) {
      // 统计消费金额
      let totalAmount = 0.0;
      // 统计押金
      let totalSecurity = 0.0;
      // 统计优惠金额
      let totalDiscount = 0.0;
      for (var i = 0; i < tableData.length; i++) {
        this.infoData.regno += tableData[i].regno + ",";
        this.infoData.roomno += tableData[i].roomno + ",";
        this.infoData.guestname = tableData[i].guestname;
        totalAmount += Number(tableData[i].totalprice);
        totalSecurity += Number(tableData[i].security);
        totalDiscount += Number(tableData[i].discount);
      }
      this.infoData.price = totalAmount;
      this.infoData.securityReal = totalSecurity;
      this.infoData.mustPrice = totalAmount;
      this.infoData.discount = totalDiscount;
    },
    closeReg() {
      this.infoData.change = this.change;
      if (this.infoData.change >= 0 && this.infoData.amountReceviable != 0) {
        // Details
        this.details.showprice = this.infoData.price;
        this.details.receviableprice = this.infoData.amountReceviable;
        this.details.security = this.infoData.securityReal;
        this.details.change = this.change;
        this.details.meno = this.infoData.paymeno;
        this.resultDialog = true;
      } else {
        if (this.infoData.amountReceviable == "") {
          this.$message.warning("请输入实收金额");
        } else {
          this.$message.warning("实收金额 小于 应收金额");
        }
      }
    },
    closeDialog() {
      this.$emit("update:finishRegDialog", false);
    },
    submitApi() {
      console.log(this.infoData);
      console.log(this.resultData);
      this.closeRegApi(this.infoData, this.resultData);
    },
    closeRegApi(infoData, resultjson) {
      apiCloseReg({
        regjson: JSON.stringify(infoData),
        resultjson: JSON.stringify(resultjson)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("结账成功");
          this.$emit("FinishRegPageReload");
        } else {
          this.$message.error("结账失败 " + res.code + ":" + res.msg);
        }
      });
    }
  },
  computed: {
    change() {
      if (this.infoData.amountReceviable == "") {
        return 0;
      } else {
        return (
          Number(this.infoData.amountReceviable) -
          Number(this.infoData.mustPrice)
        );
      }
    }
  }
};
</script>
<style scoped>
.bill-table-title {
  text-align: center;
}
.large-input {
  width: 600px;
}
.chip-size {
  width: 100px;
}
</style>
