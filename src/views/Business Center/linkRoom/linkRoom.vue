<template>
  <div>
    <v-card>
      <v-card-title class="headline">联房</v-card-title>
      <v-card-text>
        <div>
          <el-transfer
            v-model="value"
            :data="transferData"
            target-order="push"
            :titles="['未联房的入住房间', '联房房间']"
            :button-texts="['取消联房', '联房']"
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
        <v-btn color="green darken-1" text @click="saveLinkRoom">确定</v-btn>
        <v-btn color="green darken-1" text @click="closeDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { apiLinkRoomReg } from "@/request/api";
export default {
  props: {
    linkRoomData: {
      type: Array
    },
    linkRoomDialog: {
      type: Boolean
    },
    linkChooseRoom: {
      type: Array
    }
  },
  data() {
    return {
      transferData: [],
      value: []
      // 搜索逻辑
      /* filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      } */
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization");
      this.transferData = this.generateData(
        this.linkChooseRoom,
        this.linkRoomData
      );
    },
    // 初始化穿梭框的数据
    generateData(chooseRoom, linkRoomData) {
      let data = [];
      // push后返回的是数组的最大值
      console.log(chooseRoom);
      linkRoomData = linkRoomData.concat(chooseRoom);
      console.log(linkRoomData);
      if (chooseRoom.length == 1) {
        linkRoomData.forEach((room, index) => {
          data.push({
            label: room.room.roomno,
            key: index,
            disabled: room.room.roomno == chooseRoom[0].room.roomno,
            mainLinkno:
              room.room.roomno == chooseRoom[0].room.roomno
                ? room.room.roomno
                : "0",
            roomInfo: linkRoomData[index]
          });
        });
      } else {
        linkRoomData.forEach((room, index) => {
          data.push({
            label: room.room.roomno,
            key: index,
            disabled: room.reg.linkid == chooseRoom[0].reg.linkid,
            mainLinkno:
              room.reg.linkid == chooseRoom[0].reg.linkid &&
              room.room.roomno == chooseRoom[0].reg.linkno
                ? room.room.roomno
                : "0",
            roomInfo: linkRoomData[index]
          });
        });
      }
      console.log(data);
      for (var i = 1; i <= chooseRoom.length; i++) {
        this.value.push(linkRoomData.length - i);
      }
      return data;
    },
    filterMethod() {
      console.log("filterMethod");
    },
    saveLinkRoom() {
      console.log(this.transferData);
      console.log(this.value);
      if (this.value.length == 1) {
        return this.$message.warning("单个房间不能进行联房");
      }
      //两种保存
      // 1. 该订单之前没有联房，在此处创建新联房订单
      // 2. 该订单有联房，在此处添加新联房订单
      let filterLink = [];
      let saveType = 0;
      let linkno = "";
      for (var i = 0; i < this.value.length; i++) {
        let roomInfo = this.transferData[this.value[i]];
        if (roomInfo.mainLinkno != "0") {
          linkno = roomInfo.mainLinkno;
        }
        // 判断该房间信息 是否为 已经联房的房间。已经联房的房间不会再进行联房
        if (roomInfo.disabled) {
          // 说明该房间是主房间
          if (roomInfo.mainLinkno != "0") {
            linkno = roomInfo.mainLinkno;
            if (this.linkChooseRoom.length == 1) {
              saveType = 0;
              filterLink.push(roomInfo.roomInfo);
            } else {
              saveType = 1;
            }
          }
        } else {
          filterLink.push(roomInfo.roomInfo);
        }
      }
      let result = [];
      for (var j = 0; j < filterLink.length; j++) {
        // 说明当前添加的是没有联房的联房信息
        if (saveType == 0) {
          let obj = {
            regno: filterLink[j].reg.regno,
            roomno: filterLink[j].reg.roomno,
            linkno: linkno,
            linkid: "-1"
          };
          result.push(obj);
        } else {
          // 为 存在联房的信息 添加 联房信息
          let obj = {
            regno: filterLink[j].reg.regno,
            roomno: filterLink[j].reg.roomno,
            linkno: linkno,
            linkid: this.linkChooseRoom[0].reg.linkid
          };
          result.push(obj);
        }
      }
      console.log("联房主房间号：" + linkno);
      console.log("saveType:" + saveType);
      console.log(result);
      this.apiResult(result);
    },
    apiResult(result) {
      apiLinkRoomReg({
        jsonLink: JSON.stringify(result)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$emit("linkRoomReload");
        }
      });
    },
    closeDialog() {
      this.$emit("update:linkRoomDialog", false);
    }
  }
};
</script>
