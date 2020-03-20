<template>
  <div>
    <v-card>
      <v-card-title>
        客人列表
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="列表过滤"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        height="490px"
        class="table"
        :headers="headers"
        :items="tableData"
        :search="search"
        hide-default-footer
        disable-pagination
        dense
      >
        <template v-slot:item.groupflag="{ item }">
          <v-chip :color="item.groupflag == 'Y' ? '#ffb073' : '#5dcec6'" dark>
            {{ item.groupflag == "Y" ? "团队" : "散客" }}</v-chip
          >
        </template>
        <template v-slot:item.sex="{ item }">
          <div v-if="item.sex == 0">
            男
          </div>
          <div v-else-if="item.sex == 1">
            女
          </div>
          <div v-else>
            {{ item.sex }}
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { apiGuestData } from "@/request/api.js";
import { parseTime } from "../../../utils";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "序",
          value: "guestno",
          width: "80px"
        },
        { text: "散客/团队", value: "groupflag", width: "120px" },
        { text: "顾客名称", value: "guestname", width: "130px" },
        { text: "证件号码", value: "idno", width: "200px" },
        { text: "性别", value: "sex", width: "80px", align: "start" },
        { text: "生日", value: "dtBirthday", width: "120px" },
        { text: "电话", value: "tel", width: "120px" },
        { text: "地址", value: "address", width: "239px" },
        { text: "备注", value: "meno", width: "239px" }
      ],
      tableData: []
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      apiGuestData({}).then(res => {
        console.log(res);
        res.forEach(item => {
          item.dtBirthday = parseTime(new Date(item.dtBirthday), "{y}-{m}-{d}");
        });
        this.tableData = res;
      });
    }
  }
};
</script>
<style scoped>
.table {
  overflow: auto;
}
</style>
