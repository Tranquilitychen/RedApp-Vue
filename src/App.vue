<template>
  <div id="app">
    <v-app>
      <MainView></MainView>
      <!--       <router-view /> -->
    </v-app>
  </div>
</template>

<script>
import MainView from "@/views/MainView.vue";
export default {
  components: {
    MainView
  }
};
</script>

<style></style>
