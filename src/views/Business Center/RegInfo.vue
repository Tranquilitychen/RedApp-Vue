<template>
  <div class="reg-info-context">
    <div class="div-flex-column">
      <div class="div-flex-row">
        <div class="div-flex-row">
          <div class="left-label">房间编号：</div>
          <div class="under-line">{{ roomReg.roomno }}</div>
        </div>
        <div class="div-flex-row">
          <div class="left-label-mini">状态：</div>
          <div class="under-line">{{ roomReg.sureflag }}</div>
        </div>
      </div>
      <div class="div-flex-row">
        <div class="div-flex-row">
          <div class="left-label">客人姓名：</div>
          <div class="under-line">{{ roomReg.guestname }}</div>
        </div>
        <div class="div-flex-row">
          <div class="left-label-mini">电话：</div>
          <div class="under-line">{{ roomReg.tel }}</div>
        </div>
      </div>
      <div class="div-flex-row">
        <div class="left-label">入住时间：</div>
        <div class="under-line-long">{{ roomReg.dtIndate }}</div>
      </div>
      <div class="div-flex-row">
        <div class="left-label">预离时间：</div>
        <div class="under-line-long">{{ roomReg.dtOutdate }}</div>
      </div>
      <div class="div-flex-row">
        <div class="left-label">联房信息：</div>
        <div class="under-line-long">{{ roomReg.linkid }}</div>
      </div>
      <div class="div-flex-row">
        <div class="div-flex-row">
          <div class="left-label">消费金额：</div>
          <div class="under-line">{{ roomReg.price }}</div>
        </div>
        <div class="div-flex-row">
          <div class="left-label-mini">押金：</div>
          <div class="under-line">{{ roomReg.securityReal }}</div>
        </div>
      </div>
      <div class="div-flex-row">
        <div class="div-flex-row">
          <div class="left-label">消预授权：</div>
          <div class="under-line"></div>
        </div>
        <div class="div-flex-row">
          <div class="left-label-mini">性别：</div>
          <div class="under-line">{{ roomReg.sex }}</div>
        </div>
      </div>
      <div class="div-flex-row">
        <div class="left-label">特别说明：</div>
        <div class="under-line-long">{{ roomReg.specialMemo }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { deepClone } from "../../utils";
export default {
  data() {
    return {
      roomReg: {
        roomno: "",
        sureflag: "",
        guestname: "",
        tel: "",
        dtIndate: "",
        dtOutdate: "",
        linkid: "",
        price: "",
        securityReal: "",
        specialMemo: "",
        sex: ""
      }
    };
  },
  created() {
    console.log(this.regInfoData);
  },
  methods: {
    changeRoomRegData(roomReg) {
      this.roomReg = deepClone(roomReg);
      console.log(this.roomReg.sex != "");
      console.log(this.roomReg.sex != null);
      if (this.roomReg.sex != null) {
        this.roomReg.sex = this.roomReg.sex == "0" ? "男" : "女";
      }
      console.log(this.roomReg);
    }
  }
};
</script>
<style scoped>
.reg-info-context {
  height: 220px;
  overflow: auto;
}
.div-flex-row {
  display: flex;
  flex-direction: row;
}
.div-flex-column {
  display: flex;
  flex-direction: column;
}
.left-label {
  width: 80px;
  margin: 1px;
  font-size: 16px;
}
.left-label-mini {
  width: 50px;
  margin: 1px;
  font-size: 16px;
}
.under-line {
  width: 100px;
  margin: 1px;
  font-size: 16px;
  border-bottom: 1px solid #000000;
}
.under-line-long {
  width: 260px;
  margin: 1px;
  font-size: 16px;
  border-bottom: 1px solid #000000;
}
</style>
