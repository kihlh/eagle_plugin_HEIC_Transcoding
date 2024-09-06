import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'



const noAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html) {
      return html
      .replace(`type="module" crossorigin`, "")
      .replace(`src="/`, "src=\"./")
      .replace(`href="/`, "href=\"./");
    }
}}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
    targets: ['defaults', 'not IE 11'],
  }),
  vue(),
  noAttr(),],
  base:"./",
  "build":{
    minify: false,
    // sourcemap:"inline",
  }
})
