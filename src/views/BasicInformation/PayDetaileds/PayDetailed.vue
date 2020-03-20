<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="#2E6785"
      height="580px"
      dark
      vertical
      @change="changeTabs()"
    >
      <v-tab v-for="item in items" :key="item.tab">
        {{ item.tab }}
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item v-if="taburl == 'detailed'">
          <detailed />
        </v-tab-item>
        <v-tab-item v-if="taburl == 'salesDetailed'">
          <sales-detailed />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script>
import Detailed from "./Detailed";
import SalesDetailed from "./SalesDetailed";
export default {
  components: {
    Detailed,
    SalesDetailed
  },
  data() {
    return {
      tab: "",
      taburl: "",
      items: [
        { url: "detailed", tab: "账单明细", content: "账单明细" },
        { url: "salesDetailed", tab: "营业员交班", content: "营业员交班" }
      ]
    };
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      console.log("initialization");
    },
    changeTabs() {
      this.taburl = this.items[this.tab].url;
      console.log(this.taburl);
      console.log(this.taburl == "detailed");
      console.log(this.taburl == "salesDetailed");
    }
  }
};
</script>
<style scoped>
.v-window-item {
  display: unset !important;
}
</style>
