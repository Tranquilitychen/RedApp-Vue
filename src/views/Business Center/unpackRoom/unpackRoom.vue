<template>
  <div>
    <v-card>
      <v-card-title class="headline">拆房</v-card-title>
      <v-card-text>
        <div>
          <el-transfer
            v-model="value"
            :data="transferData"
            target-order="push"
            :titles="['联房房间', '拆房房间']"
            :button-texts="['取消拆房', '拆房']"
            filterable
            filter-placeholder="请输入房间编号"
          >
            <span slot-scope="{ option }">
              <div v-if="option.disabled && option.mainLinkno != '0'">
                主房间-{{ option.label }}
              </div>
              <div v-else>房间-{{ option.label }}</div>
            </span>
          </el-transfer>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="saveUnpackRoom">确定</v-btn>
        <v-btn color="green darken-1" text @click="closeDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { apiUnpackRoomReg } from "@/request/api";
export default {
  props: {
    unpackData: {
      type: Array
    },
    unpackDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      transferData: [],
      value: [],
      mainRoomIndex: 0
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization");
      console.log("unpackData", this.unpackData);
      this.transferData = this.generateData(this.unpackData);
    },
    // 初始化穿梭框的数据
    generateData(unpackData) {
      let data = [];
      // push后返回的是数组的最大值
      console.log(unpackData);
      unpackData.forEach((room, index) => {
        if (room.reg.linkno == room.room.roomno) {
          this.mainRoomIndex = index;
        }
        data.push({
          label: room.room.roomno,
          disabled: room.reg.linkno == room.room.roomno,
          key: index,
          roomInfo: unpackData[index]
        });
      });
      return data;
    },
    saveUnpackRoom() {
      console.log(this.transferData);
      console.log(this.value);
      if (this.value.length == 0) {
        return this.$message.warning("请选择拆除联房的房间编号");
      }
      //两种保存
      // 1. 该订单之前没有联房，在此处创建新联房订单
      // 2. 该订单有联房，在此处添加新联房订单
      let result = [];
      for (var i = 0; i < this.value.length; i++) {
        let roomInfo = this.transferData[this.value[i]];
        // 拆房只有一个主房间 就是不能选择的房间
        // 其他 不是 主房间， 可拆房间
        let obj = {
          regno: roomInfo.roomInfo.reg.regno,
          roomno: roomInfo.roomInfo.reg.roomno,
          linkno: roomInfo.roomInfo.reg.linkno,
          linkid: roomInfo.roomInfo.reg.linkid
        };
        result.push(obj);
      }

      if (result.length + 1 == this.unpackData.length) {
        let roomInfo = this.transferData[this.mainRoomIndex];
        let mainRoomObj = {
          regno: roomInfo.roomInfo.reg.regno,
          roomno: roomInfo.roomInfo.reg.roomno,
          linkno: roomInfo.roomInfo.reg.linkno,
          linkid: roomInfo.roomInfo.reg.linkid
        };
        result.push(mainRoomObj);
      }
      console.log(result);
      // 可以在上面进行修改不必如此，为了查看方便
      result.forEach(res => {
        res.linkno = "";
        res.linkid = 0;
      });
      console.log(result);
      this.apiResult(result);
    },
    apiResult(result) {
      apiUnpackRoomReg({
        jsonUnpack: JSON.stringify(result)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit("unpackReload");
        }
      });
    },
    closeDialog() {
      this.$emit("update:unpackDialog", false);
    }
  }
};
</script>
