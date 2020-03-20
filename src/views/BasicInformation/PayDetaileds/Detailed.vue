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
        :default-time="['12:00:00', '08:00:00']"
        @change="dateTimeChange"
      >
      </el-date-picker>
    </div>
    <div>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-text-box-search"
            label="过滤列表字段"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="tableData"
          :search="search"
          height="430px"
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
  </div>
</template>
<script>
import { apiAllPayDetailed } from "@/request/api.js";
import { parseTime, deepClone } from "../../../utils";
export default {
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
      }
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
        res.forEach(item => {
          item.dateTime = parseTime(new Date(item.dtOper));
        });
        this.tableData = deepClone(res);
        this.orignData = deepClone(res);
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
      });
      console.log(timeTable);
      this.tableData = deepClone(timeTable);
    }
  }
};
</script>
<style scoped></style>
