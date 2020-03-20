<template>
  <div>
    <v-card>
      <v-card-title>
        <div>换房</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4"
            >更换房间编号：{{ swapRoomData.reg.roomno }}</v-col
          >
          <v-col cols="12" sm="6" md="4"
            >更换房间类型：{{ swapRoomData.roomlb.roomlbname }}</v-col
          >
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4"
            ><v-text-field
              v-model="swapRoomno"
              label="调整房间"
              outlined
              dense
              hint="请输入需要更换的房间编号"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="6" md="4"
            ><v-text-field
              v-model="swapPrice"
              label="房价"
              outlined
              dense
              hint="请输入更换房间房价"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-data-table
          dense
          height="200px"
          :headers="headers"
          :items="tableData"
          item-key="name"
          class="elevation-1"
          fixed-header
          hide-default-footer
        ></v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeDialog">取消</v-btn>
        <v-btn color="primary" text @click="checkInfo">保存</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { apiEmptyRoomData, apiSwapRoom } from "@/request/api";
import { deepClone, parseTime } from "../../../utils";
export default {
  props: {
    swapRoomDialog: {
      type: Boolean
    },
    swapRoomData: {
      type: Object
    }
  },
  data() {
    return {
      headers: [
        { text: "房间编号", value: "roomno" },
        { text: "房间名称", value: "roomname" },
        { text: "房间类型", value: "roomlbname" },
        { text: "楼层", value: "floorname" },
        { text: "房价价格", value: "price" },
        { text: "床位", value: "beds" }
      ],
      tableData: [],
      swapRoomno: "",
      swapPrice: 0.0
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      apiEmptyRoomData({}).then(res => {
        this.tableData = res;
      });
    },
    checkInfo() {
      let swapArr = this.tableData.filter(res => {
        return res.roomno == this.swapRoomno;
      });
      if (swapArr.length == 1) {
        // 正常保存
        let swapObj = swapArr[0];
        if (swapObj.price != this.swapPrice) {
          if (swapObj.price < this.swapPrice) {
            this.swapConfirm("输入房价大于更换房间的房价");
          } else {
            this.swapConfirm("输入房价小于更换房间的房价");
          }
        } else {
          // 相等直接进行保存
          this.save();
        }
      } else if (swapArr.length == 0) {
        this.$message.warning("请输入正确更换的房间");
      } else {
        this.$message.warning("房间编号不唯一，系统出错");
      }
    },
    swapConfirm(msg) {
      this.$confirm(msg, "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "放弃修改"
      })
        .then(() => {
          // 确定保存
          this.save();
        })
        .catch(action => {
          this.swapRoomno = "";
          this.swapPrice = 0.0;
          this.$message.info("已放弃换房");
        });
    },
    save() {
      let orign = deepClone(this.swapRoomData);
      console.log(orign);
      // 1. 更换房间订单 Reg -> 订单编号 reg -> roomno 变更为 swapRoomno; 价格变更为 reg -> price
      // 2. 更换房间账单 RegBill -> roomno 以及 regno
      // 3. 更换房间表  旧的 Room ->  rstatus 为0 ，regno 为 ""
      //                新的room ->  rstatus 为1, regno 为 旧的Reg
      // 4. 有日志需要更改下日志
      let orignRoomBill = orign.regBill.filter(res => {
        return res.itemno == "001" && res.regno == orign.reg.regno;
      });
      let userInfo = this.$store.state.userInfo.userInfo;
      let swapJson = {
        flowid: "",
        oldRoomno: orign.reg.roomno,
        newRoomno: this.swapRoomno,
        regno: orign.reg.regno,
        newRegPrice: Number(this.swapPrice),
        newBillFlag: false,
        oldBillNum: 0,
        newBillNum: 0,
        updBillTotalPrice: 0.0,
        insBillTotalPrice: 0.0,
        dtIndate: "",
        dtOutdate: "",
        dtOper: "",
        operid: userInfo.operid
      };
      // 如果换房成功后又给换了回去是真么没有办法了
      console.log(orignRoomBill);
      // 房价消费-房租有可能是一个数组{多次换房},获取其中离现在时间最近的一个房租账单
      let maxDtOperBill = orignRoomBill[0];
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
      swapJson.flowid = maxDtOperBill.flowid;
      // 判断当前时间是否小于入住 dtIndate 时间
      if (now < maxDtOperBill.dtIndate) {
        // 小于入住时间，只更换房间编号
        console.log("房间号在初始化的时候就改变了,价格也变了");
        swapJson.dtOper = parseTime(parseTime(now));
        swapJson.newBillNum = maxDtOperBill.num;
        swapJson.updBillTotalPrice = maxDtOperBill.num * swapJson.newRegPrice;
      } else {
        if (maxDtOperBill.num == 1) {
          // 只用一天也不用进行添加，直接换房就行了,换价格
          swapJson.dtOper = parseTime(parseTime(now));
          swapJson.newBillNum = maxDtOperBill.num;
          swapJson.updBillTotalPrice = 1 * swapJson.newRegPrice;
        } else {
          // 如果有多天就更换 房间的离开时间，添加新的房间编号
          swapJson.newBillFlag = true;
          // 当前时间 - 入住时间 / 天数 向上取整
          let oldBillNum = Math.ceil((now - maxDtOperBill.dtIndate) / 86400000);
          let newBillNum = maxDtOperBill.num - oldBillNum;
          // 换房前的房间价格
          let oldRoomBill = maxDtOperBill.price;

          // 换房之后的房间天数（需要修改的）
          swapJson.oldBillNum = oldBillNum;
          // 换房之后的房间天数（需要新增的）
          swapJson.newBillNum = newBillNum;
          // 更改 房间账单的 房子总价（需要更改的）
          swapJson.updBillTotalPrice = swapJson.oldBillNum * oldRoomBill;
          // 新增 房间账单的 房间总价
          swapJson.insBillTotalPrice =
            swapJson.newBillNum * swapJson.newRegPrice;
          // 新增房间的 入住时间以及 离开时间
          // 更改房间的 离开日期 为 dtOutdate;
          swapJson.dtIndate = new Date(now + 86400000).setHours(12, 0, 0, 0);
          swapJson.dtOutdate = maxDtOperBill.dtOutdate;
          swapJson.dtOper = parseTime(parseTime(now));
        }
      }
      console.log(swapJson);
      console.log("以上截至");
      this.resultSwapRoom(swapJson);
    },
    resultSwapRoom(swapJson) {
      apiSwapRoom({
        swapJson: JSON.stringify(swapJson)
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("换房成功");
          this.$emit("swapRoomReload");
        } else {
          this.$message.success(res.code + " : " + res.msg);
        }
      });
    },
    closeDialog() {
      this.$emit("update:swapRoomDialog", false);
    }
  }
};
</script>
<style scoped></style>
