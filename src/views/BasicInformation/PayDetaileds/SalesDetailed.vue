<template>
  <div>
    <div class="block">
      <el-date-picker
        v-model="datetime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        :default-value="new Date()"
        :default-time="['12:00:00', '08:00:00']"
        @change="dateTimeChange"
      >
      </el-date-picker>
    </div>
    <div>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="tableData"
          height="360px"
          dense
          hide-default-footer
          disable-pagination
        >
          <template v-slot:item.money="{ item }">
            <v-chip :color="item.isReceipts == 'Y' ? 'green' : 'red'" dark>{{
              item.money
            }}</v-chip>
          </template>
          <template v-slot:item.isReceipts="{ item }">
            <v-chip :color="item.isReceipts == 'Y' ? 'green' : 'red'" dark>{{
              item.isReceipts == "Y" ? "收入" : "支出"
            }}</v-chip>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <div>
      <v-chip class="ma-2" color="red" outlined>
        <v-icon left>mdi-alpha-s-circle-outline</v-icon>
        收入合计：{{ totalMoney }}
      </v-chip>
      <div class="my-2">
        <v-btn depressed color="error" @click="loginOut">确定交班</v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { apiAllPayDetailed } from "@/request/api.js";
import { parseTime, deepClone } from "../../../utils";
export default {
  inject: ["reload"],
  data() {
    return {
      search: "",
      datetime: "",
      headers: [
        {
          text: "客人编号",
          value: "guestno"
        },
        { text: "房间号", value: "roomno" },
        { text: "收入/支出", value: "isReceipts" },
        { text: "金额", value: "money" },
        { text: "支付方式", value: "sourcetype" },
        { text: "收银类别", value: "paytype" },
        { text: "操作时间", value: "dateTime", width: "300px" },
        { text: "操作员", value: "operid" },
        { text: "备注", value: "meno" }
      ],
      tableData: [],
      orignData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      totalMoney: 0.0
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization： 账单详情");
      apiAllPayDetailed({}).then(res => {
        console.log(res);
        // 1. 先获取 当前人员
        let role = this.$store.state.userInfo.userInfo;
        console.log(role);
        // 先过滤
        let roleDetailed = res.filter(res => {
          return res.operid == role.operid;
        });
        // 遍历
        roleDetailed.forEach(item => {
          item.dateTime = parseTime(new Date(item.dtOper));
          if (item.isReceipts == "Y") {
            this.totalMoney += item.money;
          } else if (item.isReceipts == "N") {
            this.totalMoney -= item.money;
          } else {
            console.log("出错了");
          }
        });
        this.tableData = deepClone(roleDetailed);
        this.orignData = deepClone(roleDetailed);
        console.log("合计：" + this.totalMoney);
      });
    },
    dateTimeChange() {
      console.log(this.datetime);
      let timeTable = this.orignData.filter(res => {
        return (
          new Date(res.dtOper) > this.datetime[0] &&
          new Date(res.dtOper) < this.datetime[1]
        );
      });
      timeTable.forEach(item => {
        item.dateTime = parseTime(new Date(item.dtOper));
        if (item.isReceipts == "Y") {
          this.totalMoney += item.money;
        } else if (item.isReceipts == "N") {
          this.totalMoney -= item.money;
        } else {
          console.log("出错了");
        }
      });
      console.log(timeTable);
      this.tableData = deepClone(timeTable);
      console.log("合计：" + this.totalMoney);
    },
    loginOut() {
      this.$alert("核对无误后请点击确定", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          if (action == "confirm") {
            this.$store.commit("userInfo/LOGIN_OUT");
            this.$message.success("已完成");
            this.reload();
          } else {
            this.$message.info("已取消");
          }
        }
      });
    }
  }
};
</script>
<style scoped></style>
