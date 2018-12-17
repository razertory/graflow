<template>
  <div id="app">
    <v-main></v-main>
  </div>
</template>

<script>
import vMain from '@/components/Main.vue';
export default {
  name: 'App',
  components: {
    vMain
  }
}
</script>

<style>
@import "./assets/css/normalize.css";
@import './assets/css/common.css';
#app {
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
