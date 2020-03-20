<template>
  <div>
    <v-card>
      <v-card-title>
        <div>消费录入</div>
        <v-spacer></v-spacer>
        <v-btn class="ma-2" color="orange darken-2" dark @click="closeDialog">
          <v-icon dark left>mdi-arrow-left</v-icon>Back
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-row">
          <div class="left-item">
            <div>消费项目</div>
            <v-data-table
              height="300px"
              :headers="headers"
              :items="itemData"
              class="elevation-1"
              dense
              hide-default-footer
            >
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="addItemToBill(item)">
                  mdi-table-column-plus-before
                </v-icon>
              </template>
            </v-data-table>
          </div>
          <div class="right-bill">
            <div>房间账单</div>
            <v-data-table
              height="300px"
              :headers="regBillHeader"
              :items="regBillData"
              class="elevation-1"
              dense
              hide-default-footer
            >
              <template v-slot:item.action="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  :disabled="item.disabled"
                  @click="removeItemForBill(item)"
                >
                  mdi-table-column-remove
                </v-icon>
              </template>
              <template v-slot:item.itemname="{ item }">
                <v-chip color="orange" v-if="item.disabled" dark>{{
                  item.itemname
                }}</v-chip>
                <v-chip color="green" v-else dark>{{ item.itemname }}</v-chip>
              </template>
            </v-data-table>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">取消</v-btn>
        <v-btn color="green darken-1" text @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import {
  apiGetAllItems,
  apiRegBillForRegno,
  apiInsRegBills
} from "@/request/api";
import { deepClone, parseTime } from "../../../utils";
export default {
  props: {
    billEnterDialog: {
      type: Boolean
    },
    billEnterData: {
      type: Object
    }
  },
  data() {
    return {
      headers: [
        {
          text: "项目编号",
          align: "start",
          value: "itemno"
        },
        { text: "项目名称", value: "itemname" },
        { text: "单价", value: "price" },
        { text: "当前库存", value: "stock" },
        { text: "操作", value: "action", sortable: false }
      ],
      regBillHeader: [
        {
          text: "房间编号",
          align: "start",
          value: "roomno"
        },
        { text: "消费项目编码", value: "itemno" },
        { text: "消费项目名称", value: "itemname" },
        { text: "数量", value: "num" },
        { text: "单价", value: "price" },
        { text: "折扣", value: "discount" },
        { text: "总金额", value: "totalprice" },
        { text: "操作", value: "action", sortable: false }
      ],
      itemData: [],
      regBillData: [],
      // 默认Bill
      defaultRegBill: {
        roomno: this.billEnterData.reg.roomno,
        regno: this.billEnterData.reg.regno,
        itemno: "",
        itemname: "",
        num: 0,
        price: 0.0,
        discount: 0.0,
        totalprice: 0.0,
        dtOper: "",
        operid: "",
        disabled: false
      },
      orignRegBill: ""
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization");
      apiGetAllItems({}).then(res => {
        console.log(res);
        this.itemData = res;
      });
      // 消费项目
      let p1 = new Promise((resolve, reject) => {
        resolve(apiGetAllItems({}));
      });
      // 账单数据
      let p2 = new Promise((resolve, reject) => {
        console.log("123123");
        resolve(
          apiRegBillForRegno({
            regno: this.billEnterData.reg.regno,
            roomno: this.billEnterData.reg.roomno
          })
        );
      });
      Promise.all([p1, p2])
        .then(res => {
          // 左边表单
          this.itemData = res[0];
          // 右边表单
          console.log(res[1]);
          if (res[1].code == 200) {
            this.regBillData = res[1].data;
            this.regBillData.filter(res => {
              return (res.disabled = true);
            });
            this.orignRegBill = JSON.stringify(this.regBillData);
          } else {
            this.$message.error(res[1].code + " : " + res[1].msg);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    closeDialog() {
      this.$emit("update:billEnterDialog", false);
    },
    // 添加项目到订单
    addItemToBill(item) {
      console.log(this.regBillData);
      let flag = false;
      for (var i = 0; i < this.regBillData.length; i++) {
        if (
          this.regBillData[i].itemno == item.itemno &&
          this.regBillData[i].disabled == false
        ) {
          console.log(this.regBillData[i].num);
          this.regBillData[i].num++;
          this.regBillData[i].totalprice =
            this.regBillData[i].num * this.regBillData[i].price;
          flag = true;
          break;
        }
      }
      // 如果不为真，说明没有找到 消费项目。初次添加
      if (!flag) {
        let obj = {
          roomno: this.billEnterData.reg.roomno,
          regno: this.billEnterData.reg.regno,
          itemno: item.itemno,
          itemname: item.itemname,
          num: 1,
          price: item.price,
          discount: 0.0,
          totalprice: item.price,
          dtOper: parseTime(new Date()),
          operid: "",
          disabled: false
        };
        this.regBillData.push(obj);
      }
      console.log(item);
    },
    removeItemForBill(item) {
      if (item.num != 1) {
        // 数量不为1
        item.num--;
        item.totalprice = item.num * item.price;
      } else {
        let index = this.regBillData.indexOf(item);
        console.log(index);
        this.regBillData.splice(index, 1);
        console.log(this.regBillData);
      }
    },
    save() {
      let json = JSON.stringify(this.regBillData);
      if (json != this.orignRegBill) {
        // 不相等说明需要进行保存操作。
        this.$confirm("感知到数据发生变化，确认进行保存吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            // 需要进行检索,进行匹配 不包括已经存在的订单的订单信息
            let result = deepClone(
              this.regBillData.filter(res => {
                return res.disabled == false;
              })
            );
            // 检索出哪些是需要更新的，哪些是需要插入的
            let orignBill = JSON.parse(this.orignRegBill);
            console.log(orignBill);
            // 检索是否有与 以前的帐单 重复的商品
            for (var i = 0; i < orignBill.length; i++) {
              // 遍历当前新账单
              for (var j = 0; j < result.length; j++) {
                // 说明出现重复，需要添加
                if (result[j].itemno == orignBill[i].itemno) {
                  result[j].num = result[j].num + orignBill[i].num;
                  result[j].totalprice = result[j].num * result[j].price;
                  result[j].updateKbn = "U";
                  break;
                }
              }
            }
            // 再来一次，筛选出新增的
            for (var k = 0; k < result.length; k++) {
              if (result[k].updateKbn == undefined) {
                result[k].updateKbn = "C";
              }
            }
            console.log(result);
            this.resultAddRegBill(result);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消保存!"
            });
          });
      } else {
        this.$message.warning("没有需要保存的项目");
      }
    },
    resultAddRegBill(result) {
      apiInsRegBills({
        regBillJson: JSON.stringify(result)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.$emit("billEnterReload");
        } else {
          this.$message.error(res.code + ":" + res.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.left-item {
  width: 430px;
  margin-right: 30px;
}
.right-bill {
}
</style>
