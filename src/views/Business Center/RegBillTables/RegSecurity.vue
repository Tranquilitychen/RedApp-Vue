<template>
  <div>
    <el-table
      :data="regSecurity"
      border
      height="250px"
      style="width: 100%"
      :default-sort="{ prop: 'itemno', order: 'ascending' }"
      show-summary
    >
      <el-table-column fixed prop="roomno" label="房间" width="60">
      </el-table-column>
      <el-table-column
        prop="guestno"
        label="客人编号"
        width="80"
      ></el-table-column>
      <el-table-column prop="money" label="押金" width="50"> </el-table-column>
      <el-table-column
        prop="sourcetype"
        label="支付方式"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="paytype"
        label="paytype"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="dtOper"
        label="支付时间"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="operid"
        label="操作员"
        width="80"
      ></el-table-column>
      <el-table-column prop="meno" label="备注" width="160"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    regSecurity: {
      type: Array
    }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
    // 合计表格
  }
};
</script>
<style scoped></style>
