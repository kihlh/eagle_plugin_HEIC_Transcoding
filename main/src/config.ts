import { Ref, ref, watch } from 'vue'
import { APP_KEY } from './cacheStore'

export const pageName:Ref<'setup'|"history"|"home"> = ref("home");

export const app_name = ref("HEIC转码");

export const item_list:Ref<ItemStatic[]> = ref([]);

export interface ItemStatic {
    name: string;
    ext:string;
    thumbnailURL:string;
    new_size:number;
    path:string;
    id:string;
    have:"have"|"fail"|"success"|null;
    // item:Item,
    height:number;
    width:number;
    size:number;
    size_estimate?:number;
  }

export const have = ref(false);
export const loadIng = ref(true);
export const HandleType :Ref<"REPLACE"|"APPEND"> = ref(String(localStorage.getItem(`${APP_KEY}_HANDLE_TYPE`)?.match(/^REPLACE|APPEND$/)?.[0]||"") as null|"REPLACE" ||"REPLACE");

watch(HandleType,function(value,_oldValue:any){
    localStorage.setItem(`${APP_KEY}_HANDLE_TYPE`,value);
});

watch(item_list,function(value,_oldValue:any){


    // 定位到处理完成
    if(have.value){
        loadIng.value =true;
        let index = 0;
        for (; index < value.length; index++) {
            const element = value[index];
            if(!element.have){
                break;
            }
        }

        const item_list_dom =  document.querySelector("#app > div:nth-child(2) > div.item_list");
        item_list_dom?.scrollTo(0,(index*25)-35);
        
        loadIng.value =false;
    }

},{"deep":true});

export const new_ext:Ref<"JPEG"|"PNG"|"WEBP"|"BMP"|"HEIC"> = ref(String(localStorage.getItem(`${APP_KEY}_EXT_TYPE`)?.match(/^JPEG|PNG|WEBP|BMP|HEIC$/)?.[0]||"") as null|"JPEG" ||"JPEG");

watch(new_ext,function(value,_oldValue:any){
    localStorage.setItem(`${APP_KEY}_EXT_TYPE`,String(value));
});

export const ext_options = ref([
    {
        label:"JPEG",
        value:"JPEG",
        quality:100
    }, {
        label:"PNG",
        value:"PNG",
        quality:100
    }, {
        label:"WEBP",
        value:"WEBP",
        quality:100
    }, {
        label:"BMP",
        value:"BMP",
        quality:100
    }
    // , {
    //     label:"HEIC",
    //     value:"HEIC",
    //     quality:100
    // }
]);

export const concurrentNumber = ref(6);

export const isPluginCreate = ref(false);

export const main_language = ref({
    
});

