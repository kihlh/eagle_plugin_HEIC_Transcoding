<script setup lang="ts">

// import {start_main_placeholder,start_main_input} from "../config.ts";

</script>

<template>

  <div class="start_main" style="">
    <a>尚未开发</a>
  </div>


</template>

<style scoped>

.start_iput {
  min-width: 100vw;
  width: 100vw;
  height: 45px;
  display: grid;
  grid-template-columns: 10px 11fr 3fr 10px;
  grid-column-gap: 10px;
}

/*.start_iput_title*/

.start_main > a {
  width: 50vw;
  color: #565656;
  font-size: 12px;
  margin-left: 20px;
  margin-bottom: 10px;
  user-select: none;
  pointer-events: none;
}

.start_iput .url_input {
  box-sizing: border-box;
  height: 100%;
  border: 2px solid #4A4A4A;
  border-radius: 8px;
  background: none;
  color: #b1b1b1;
  padding: 10px;
}

.start_iput .paste {
  display: flex;
  height: 100%;
  border: 2px solid #4A4A4A;
  border-radius: 8px;
  background: none;
  font-size: 14px;
  color: #636363;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-right: 13px;
  min-width: 70px;
}

.start_iput *:focus {
  outline: none;
}

.start_iput input::placeholder {
  color: #323232;
}

.start_iput button:focus {

  cursor: pointer;
}

.start_main{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: flex-start;
}

.start_iput .clear{
  display: flex;
  height: 100%;
  border: 2px solid #4A4A4A;
  border-radius: 8px;
  background: none;
  font-size: 14px;
  color: #636363;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-right: 13px;
  min-width: 70px;
}

.start_iput .analysis {
  box-sizing: border-box;
  height: 100%;
  border: 2px solid #4A4A4A;
  border-radius: 8px;
  background: none;
  color: #636363;
}

.start_iput.start{
  margin: 10px 0 10px 0;
  grid-template-columns: 10px 3fr 3fr 10px !important;
}

input:focus-visible {
  outline-offset: 0px;
}
</style>
