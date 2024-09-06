<script setup lang="ts">
import main_title from './components/main_title.vue'
import main_btn_nav from './components/main_btn_nav.vue'
import main_home from './components/main_home.vue'

import {pageName} from './config.ts'

</script>

<template>

  <main_title />
  <main_home v-show="pageName == 'home'" />
  <main_history v-show="pageName == 'history'" />
  <main_setup v-show="pageName == 'setup'" />
  <main_btn_nav />

</template>

<style scoped>

</style>
