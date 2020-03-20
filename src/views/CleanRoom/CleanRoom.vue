<template>
  <div>
    <div>
      <v-btn outlined color="indigo" @click="changeClean(selected)"
        >变为洁房</v-btn
      >
    </div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-home-search"
          label="检索房间信息"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        height="300px"
        v-model="selected"
        :headers="headers"
        :items="tableData"
        :search="search"
        item-key="roomno"
        show-select
        dense
      >
        <template v-slot:item.rstatus="{ item }">
          {{ item.rstatus == 3 ? "脏房" : "不是脏房" }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { apiDirtyRoomData, apiupdCleanRoom } from "@/request/api.js";
export default {
  inject: ["reload"],
  data() {
    return {
      selected: [],
      search: "",
      headers: [
        {
          text: "房间编号",
          align: "start",
          filterable: false,
          value: "roomno"
        },
        { text: "房间名称", value: "roomname" },
        { text: "房间类型", value: "roomlbno" },
        { text: "房间楼层", value: "floorno" },
        { text: "床位", value: "beds" },
        { text: "房间状态", value: "rstatus" }
      ],
      tableData: []
    };
  },

  created() {
    this.initialization();
  },

  methods: {
    initialization() {
      apiDirtyRoomData({}).then(res => {
        this.tableData = res;
        console.log(this.tableData);
      });
    },
    changeClean(selected) {
      console.log(selected);
      this.$confirm("确定清理干净房间嘛？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.apiCleanRoom(selected);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    apiCleanRoom(selected) {
      apiupdCleanRoom({
        roomJson: JSON.stringify(selected)
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("清洁成功");
          this.reload();
        } else {
          this.$message.error(res.code + ":" + res.msg);
        }
      });
    }
  }
};
</script>
<style scoped></style>
