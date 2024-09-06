<script setup lang="ts">
import { have, loadIng, new_ext, ext_options, item_list ,HandleType,UI} from "../config.ts";
import { UPSelectedList, HaveSelectedList } from "../callBackFun.ts";

</script>

<template>

  <div id="main_nav">

    <div class="select_list">

      <el-select v-model="new_ext" v-bind:disabled="have" placeholder="Select" style="width: 240px;margin-left: 12px;"  v-show="item_list.length?true:false"   size="large">
      <!-- <el-option v-for="item in ext_options" 
      :key="item.value" 
      :label="item.label" 
      :value="item.value" 
      /> -->

      <el-option
      v-for="item in ext_options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left"  class="smoothed">{{ item.label }}</span>
      <span class="smoothed"
        style="
          float: right;
          color: rgb(80 88 107);
          font-size: 13px;
        "
      >
        {{ item.describe }}
      </span>
    </el-option>

    </el-select>

    <el-radio-group v-model="HandleType" style="margin-left: 30px;" v-bind:disabled="have"  v-show="item_list.length?true:false"  >
      <el-radio value="REPLACE"  class="smoothed" >{{ UI.Replace ||"替换"}}</el-radio>
      <el-radio value="APPEND" class="smoothed" >{{ UI.Append ||"添加"}}</el-radio>
    </el-radio-group>


    </div>

    <div class="button_list">

      <button @click="HaveSelectedList"  >
        <a v-show="have ? false : true"  class="smoothed" >{{ UI.Start ||"开始"}}</a>

        <div v-show="have" center>
          <div class="gg-spinner-alt"></div>
          <!-- <a class="smoothed" style="padding-left: 15px;">可取消</a> -->
        </div>

      </button>

      <button @click="UPSelectedList" v-bind:disabled="have">
        <a v-show="loadIng ? false : true"  class="smoothed">{{ UI.GetSelected||"获取选中"}}</a>
        <div v-show="loadIng" class="gg-spinner-alt"></div>

      </button>
    </div>


  </div>


</template>

<style scoped>

[disabled]{
  pointer-events: none;
}

#main_nav .button_list {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
}

#main_nav {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding-right: 3px;
  margin-bottom: 12px;
  position: fixed;
  bottom: 0px;
  width: 100vw;
}

#main_nav button:nth-child(2) {
  background: #7670d3;
}


#main_nav button>* {
  -webkit-animation-name: popIn;
  animation-name: popIn;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
}

.center,[center]{
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}
#main_nav button {
  width: 110px;
  margin-right: 13px;
  margin-top: -11px;
  height: 50px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgb(88 127 131);
  display: block;
  user-select: auto !important;
  pointer-events: all !important;

  font-size: 15px;
  color: #ffffff;
  background: #7093d3;


  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.gg-spinner-alt {
  transform: scale(var(--ggs, 1));
}

.gg-spinner-alt,
.gg-spinner-alt::before {
  box-sizing: border-box;
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
}

@keyframes spinneralt {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

.gg-spinner-alt::before {
  content: "";
  position: absolute;
  border-radius: 100px;
  animation: spinneralt 1s cubic-bezier(0.6, 0, 0.4, 1) infinite;
  border: 3px solid transparent;
  border-top-color: currentColor;
}


</style>
