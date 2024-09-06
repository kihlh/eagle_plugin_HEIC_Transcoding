<script setup lang="ts">

import { item_list, new_ext ,UI,defaultPageImag} from "../config.ts";
import { formatFileSize, predictElementSize, loadThumbnailImagError } from "../callBackFun.ts";

</script>

<template>

  <div class="start_main" style="">
    <div class="tab_names tab_grid">
      <div></div>
      <div><a class="smoothed"> {{UI.fileName||'文件名'}} </a></div>
      <div><a class="smoothed"> {{UI.originalFormat||'原格式'}} </a></div>
      <div><a class="smoothed"> {{UI.originalSize||'原大小'}} </a></div>
      <div><a class="smoothed"> {{UI.newSize||'转换后大小'}} </a></div>
    </div>

    <div class="item_list">

      <div v-show="item_list.length ? false : true" class="not_item_list_defaultPage">
        <div  >
          <img :src="defaultPageImag" id="not_item_list_default_Page_Imag" style="pointer-events: none;" ppp="本图片授权自pixeltrue,允许任何组织或个人免费使用">
          <a> {{UI.not_item_defaultPage||'没有选择可识别的图片，可以在Eagle选中需要的图片点击 [获取选中] '}} </a>
        </div>
      </div>
      <div class="item_form tab_grid" v-for="item in item_list" v-show="item_list.length ? true : false">
        <!-- 缩略图 -->
        <div>
          <img :src="item.thumbnailURL" class="thumbnailImag" :onerror="() => loadThumbnailImagError(item)">
        </div>
        <!-- 名称 -->
        <div class="showPathNameBox smoothed"><a class="showPathName">{{ item.name }}</a></div>
        <!-- 格式 -->
        <div><a class="smoothed">{{ item?.path?.match(/[.]([0-9a-z]+)$/i)?.[1]?.toUpperCase()?.slice(0, 5) || (UI.Unknown||"未知" )}}</a>
        </div>
        <!-- 原大小 -->
        <div><a class="smoothed">{{ formatFileSize(item?.size || 0) }}</a></div>
        <!-- 预估大小 -->
        <div><a class="smoothed">{{ item.new_size ? formatFileSize(item.new_size) : `${predictElementSize(new_ext, item)
          ==
          item.size ? "" : "≈ "}${formatFileSize(item.size_estimate||0) }` }}</a></div>

        <div>
          <div v-show="item.have == 'success'" class="gg-check-o"></div>
          <div v-show="item.have == 'have'" class="gg-spinner-alt"></div>
          <div v-show="item.have == 'fail'" class="gg-danger"></div>

        </div>

      </div>


    </div>

  </div>


</template>

<style scoped>
.not_item_list_defaultPage {
  height: 39vh;
  width: 100vw;
  max-height: 500px;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  top: 200px;
}
.not_item_list_defaultPage>div{
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  color: #8b94af;
  padding-top: 20px;

  -webkit-animation-name: popIn;
  animation-name: popIn;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;

}

.not_item_list_defaultPage img {
  width: 300px;
  object-fit: contain;
}

.thumbnailImag {
  background: white;
  background-image: "url(assets/icon.png)";
}

.showPathNameBox {
  overflow: hidden;
  white-space: nowrap;
  justify-content: flex-start !important;
  padding: 2px 5px;
}

.showPathName {
  max-width: 100%;
  text-overflow: ellipsis;
  padding: 2px 5px;
  white-space: nowrap;
  display: block;
  overflow: hidden;
}

.item_list {
  min-width: 100vw;
  width: 100vw;
  min-height: 20px;
  max-height: calc(100vh - 45px - 70px - 60px);
  padding-bottom: 10px;
  scroll-behavior: smooth;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
}

.item_form>div {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.item_form img {
  width: 25px;
  height: 25px;
  pointer-events: none;
  user-select: none;
  box-shadow: 0 0 5px #0000001a;
  transition: transform .2s;
  border-radius: 5px
}

.tab_grid {
  min-width: 100vw;
  width: 100vw;
  min-height: 20px;
  padding: 3px;

  /*布局*/
  display: grid;
  grid-template-columns: 45px 4fr repeat(2, 1fr) 2fr 45px;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-content: center;
  align-items: center;
}

.item_form {

  /*底部描边*/
  border-bottom-width: 1px;
  border-bottom-color: rgb(255 255 255 / 7%);
  border-bottom-style: solid;

  color: #e3e3e3;
}

.tab_names {

  min-width: 100vw;
  width: 100vw;
  min-height: 20px;
  padding-bottom: 10px;

  /*底部描边*/
  border-bottom-width: 1px;
  border-bottom-color: rgb(8 255 189 / 22%);
  border-bottom-style: solid;

}

.tab_names>div {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
}

.tab_names a {
  color: rgb(43, 105, 89);
  user-select: none;
  pointer-events: none;
  font-weight: 600;
}

.start_iput {
  min-width: 100vw;
  width: 100vw;
  height: 45px;
  display: grid;
  grid-template-columns: 10px 11fr 3fr 10px;
  grid-column-gap: 10px;
}

/*.start_iput_title*/

.start_main>a {
  width: auto;
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

.start_main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: flex-start;
}

.start_iput .clear {
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

.start_iput.start {
  margin: 10px 0 10px 0;
  grid-template-columns: 10px 3fr 3fr 10px !important;
}

input:focus-visible {
  outline-offset: 0px;
}

* {

  user-select: none;
}

::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}

::-webkit-scrollbar-track {
  width: 6px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, .5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
  transition: background-color .3s;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, .3);
}


@keyframes spinneralt {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
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

.gg-spinner-alt::before {
  content: "";
  position: absolute;
  border-radius: 100px;
  animation: spinneralt 1s cubic-bezier(0.6, 0, 0.4, 1) infinite;
  border: 3px solid transparent;
  border-top-color: currentColor;
}

.gg-check-o {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs, 1));
  width: 22px;
  height: 22px;
  border: 2px solid;
  border-radius: 100px;
}

.gg-check-o::after {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  left: 3px;
  top: -1px;
  width: 6px;
  height: 10px;
  border-color: currentColor;
  border-width: 0 2px 2px 0;
  border-style: solid;
  transform-origin: bottom left;
  transform: rotate(45deg);
}

.gg-danger {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs, 1));
  width: 20px;
  height: 20px;
  border: 2px solid;
  border-radius: 40px;
}

.gg-danger::after,
.gg-danger::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-radius: 3px;
  width: 2px;
  background: currentColor;
  left: 7px;
}

.gg-danger::after {
  top: 2px;
  height: 8px;
}

.gg-danger::before {
  height: 2px;
  bottom: 2px;
}
</style>
