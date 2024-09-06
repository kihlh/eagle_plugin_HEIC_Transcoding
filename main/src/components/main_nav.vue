<script setup lang="ts">
import {pageName} from "../config.ts";

</script>

<template>

  <div id="main_nav">

    <!-- 主页 -->
    <div id="home" @click="pageName = 'home'" :class="pageName == 'home' ? 'active' : ''">
      <div class="select">
        <img src="../assets/btn_icon_home.svg">
        <a>首页</a>
      </div>
      <div class="select_ing_active"></div>
    </div>

    <!-- 历史记录 -->
    <div id="history" @click="pageName = 'history'" :class="pageName == 'history' ? 'active' : ''">
      <div class="select">
        <img src="../assets/btn_icon_history.svg">
        <a>历史</a>
      </div>
      <div class="select_ing_active"></div>
    </div>

    <!-- 设置 -->
    <div id="setup" @click="pageName = 'setup'" :class="pageName == 'setup' ? 'active' : ''">
      <div class="select">
        <img src="../assets/btn_icon_setup.svg">
        <a>设置</a>
      </div>
      <div class="select_ing_active"></div>
    </div>

  </div>


</template>

<style scoped>
#main_nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 13px;
  width: 100vw;
  height: 70px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

#main_nav .selectIng {

  position: absolute;
  width: 84px;
  height: 41px;
  left: 0px;
  top: 0px;

  background: #3D3D3D;
  border-radius: 14px;

}

#main_nav>div {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  min-width: 100%;
  min-height: 100%;
}

#main_nav>div .select {
  width: 50%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

#main_nav>div.active .select a ,  #main_nav>div.active .select_ing_active {
  display: block;
}

#main_nav>div.active .select {
  background: #3D3D3D;
  border-radius: 14px;
  min-width: 60px;
}

#main_nav>div .select a {
  font-weight: 500;font-size: 0.92em;
  line-height: 21px;
  letter-spacing: 0.05em;
  color: #85888B;
  display: none;
  padding-left: 2%;
}

.select_ing_active {
  width: 20px;
  height: 2px;
  left: 32px;
  top: 45px;
  background: #6475ab;
  border-radius: 44px;
  display: none;
}

#main_nav>div.active .select_ing_active,
#main_nav>div.active .select {
  -webkit-animation-name: popIn;
  animation-name: popIn;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
}


</style>
