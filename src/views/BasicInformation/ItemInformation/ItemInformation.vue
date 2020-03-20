<template>
  <div>
    <div class="item-table">
      <v-data-table
        :headers="headers"
        :items="tableData"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title class="title">消费项目</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on"
                  >添加消费项目</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.itemno"
                          :disabled="editedIndex != -1"
                          label="项目编号"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.itemname"
                          label="项目名称"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="价格"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.stock"
                          label="库存"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                  <v-btn color="blue darken-1" text @click="save">保存</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import {
  apiGetAllItems,
  apiInsItem,
  apiUpdateItem,
  apiDelItem
} from "@/request/api";
export default {
  inject: ["reload"],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "项目编号",
        align: "start",
        sortable: false,
        value: "itemno"
      },
      { text: "项目名称", value: "itemname" },
      { text: "单价", value: "price" },
      { text: "当前库存", value: "stock" },
      { text: "操作", value: "action", sortable: false }
    ],
    tableData: [],
    // 判断是新增还是更新（修改）
    editedIndex: -1,
    editedItem: {
      itemno: "",
      itemname: "",
      price: 0.0,
      stock: 0
    },
    defaultItem: {
      itemno: "",
      itemname: "",
      price: 0.0,
      stock: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "添加消费项目" : "修改项目信息";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      apiGetAllItems({}).then(res => {
        console.log(res);
        this.tableData = res;
      });
    },

    editItem(item) {
      this.editedIndex = this.tableData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.tableData.indexOf(item);
      confirm("您确定要删除当前消费项目?") && this.tableData.splice(index, 1);
    },

    close() {
      this.dialog = false;
      // 局部渲染
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      let result = [];
      if (this.editedIndex > -1) {
        Object.assign(this.tableData[this.editedIndex], this.editedItem);
        // 保存更新
        console.log(this.editedItem);
        result.push(this.editedItem);
        this.apiUpdate(result);
      } else {
        // 保存新增
        this.tableData.push(this.editedItem);
        console.log(this.editedItem);
        result.push(this.editedItem);
        this.apiInsert(result);
      }
    },

    // 添加项目 api
    apiInsert(result) {
      apiInsItem({
        itemJson: JSON.stringify(result)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("添加项目成功");
          this.reload();
        }
      });
    },
    // 更新项目 api
    apiUpdate(result) {
      apiUpdateItem({
        itemJson: JSON.stringify(result)
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("更新项目成功");
          this.reload();
        } else {
          this.$message.error(res.code + " : " + res.msg);
          this.close();
        }
      });
    },
    // 删除项目 api
    apiDelete(itemno) {
      apiDelItem({
        itemno: itemno
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("删除项目成功");
          this.reload();
        } else {
          this.$message.error(res.code + " : " + res.msg);
          this.close();
        }
      });
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 30px;
  color: red;
}
</style>
