<template>
  <div>
    <el-table
      :data="regBill"
      border
      height="250px"
      :default-sort="{ prop: 'itemno', order: 'ascending' }"
      show-summary
    >
      <el-table-column fixed prop="roomno" label="房间" width="60">
      </el-table-column>
      <el-table-column prop="itemno" label="项目编号" width="80">
      </el-table-column>
      <el-table-column
        fixed
        prop="itemname"
        label="项目名称"
        width="120"
      ></el-table-column>
      <el-table-column prop="num" label="数量" width="50"> </el-table-column>
      <el-table-column prop="price" label="单价" width="80"></el-table-column>
      <el-table-column
        prop="discount"
        label="折扣"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="totalprice"
        label="总价"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="dtOper"
        label="录入时间"
        width="160"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    regBill: {
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
