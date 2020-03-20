<template>
  <div>
    <el-tabs type="border-card" class="el-tabs-item">
      <el-tab-pane label="消费记录">
        <div class="tab-div-area">
          <div class="reg-info">
            <reg-bill ref="regBillPage" :regBill.sync="regBill" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="押金记录">
        <div class="tab-div-area">
          <div class="security-record">
            <reg-security ref="security" :regSecurity.sync="regSecurity" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客人列表">
        <div class="tab-div-area">
          <div class="guest-list">
            <div>客人列表</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="日志">
        <div class="tab-div-area">
          <div class="daily record">
            <div>日志</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import RegBill from "./RegBillTables/RegBill";
import RegSecurity from "./RegBillTables/RegSecurity";
import { deepClone, parseTime } from "../../utils";
export default {
  components: {
    RegBill,
    RegSecurity
  },
  data() {
    return {
      // 父组件传来的值
      allData: [],
      regBill: [],
      regSecurity: []
    };
  },
  methods: {
    // 父组件触发信息
    trigger() {
      console.log("子组件");
      this.regBill = [];
      if (this.allData.regBill != null) {
        this.regBill = deepClone(this.allData.regBill);
        if (this.regBill.length != 0) {
          this.regBill.forEach(res => {
            console.log(res);
            res.dtOper = parseTime(new Date(res.dtOper));
          });
        }
      }
      this.regSecurity = [];
      if (this.allData.payDetaileds != null) {
        this.regSecurity = deepClone(this.allData.payDetaileds);
        console.log(123123);
        console.log(this.regSecurity);
        if (this.regSecurity.length != 0) {
          this.regSecurity.forEach(res => {
            console.log(res);
            res.dtOper = parseTime(new Date(res.dtOper));
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.tab-div-area {
  width: 400px;
  height: 250px;
  padding: 0px;
  overflow: auto;
}
.el-tabs-item >>> .el-tabs__content {
  padding: 0px;
}
</style>
