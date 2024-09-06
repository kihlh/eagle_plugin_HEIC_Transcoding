
import { ItemStatic } from "./config";
import { concurrentNumber, HandleType, have, isPluginCreate, item_list, loadIng, new_ext } from "./config";
import type _magickwand from "../../magickwand/Magick++";
import type * as _fs from "fs";
import type * as _path from "path";

import * as cacheStore from "./cacheStore";
// import type { Eagle:eagle } from "../eagle-plugin";

window.cacheStore = cacheStore;
declare var window: Window & typeof globalThis & {
    // eagle: typeof eagle;
    // ddddd: any;
} & {
    fs: typeof fs,
    magickwand: typeof _magickwand,
    HM_ITEM_DATA_LIST?: ItemStatic[],
    path: typeof _path,
    cacheStore: typeof cacheStore,
};

// declare var eagle: typeof _eagle;
declare var magickwand: typeof _magickwand;
declare var fs: typeof _fs;
declare var path: typeof _path;
// declare var eagle: typeof Eagle;


export async function gcCacheStore() {
    return new Promise<void>((resolve, _reject) => {
        cacheStore.getItemList().then(async (items) => {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];

                if (window.fs.existsSync(item.path)) {
                    if (!(await window.fs.promises.rm(item.path, { "retryDelay": 600, "maxRetries": 50 }).then(() => true).catch(() => false))) {
                        continue;
                    }
                }

                if (!window.fs.existsSync(item.path)) await cacheStore.deleteItem(item.path);
            }
        }).then(resolve).catch(resolve);
    })
}

export async function hide_mian_window() {
    await eagle.window.hide();

    // 执行垃圾回收
    gcCacheStore().finally(close);
    // close();
}

setTimeout(async () => {
    if (have.value) await Sleep(15000);
    gcCacheStore();
}, 15 * 1000);

// export function GetLabelInfo(options:typeof ext_options.value["0"]):string {
//     if(options.quality==0||options.quality==100){
//         return "[ 无损 ]   "+ options.label +" ".repeat(options.label.length>3?3:4);
//     }

//     return "[ 有损 ]   " + options.label +" ".repeat(options.label.length>3?3:4) ;
// }

export async function GetSelected() {
    const selectedList: ItemStatic[] = [];
    if (!isPluginCreate.value) return selectedList;

    if (eagle.app.platform === "darwin")
        await Sleep(600);

    const selected_list_info = (await (eagle?.item?.getSelected()).catch(_ => [])) || [];

    if (!selected_list_info.length && window?.HM_ITEM_DATA_LIST?.length) {
        return (window?.HM_ITEM_DATA_LIST || []);
    }

    for (let index = 0; index < selected_list_info.length; index++) {
        const element = selected_list_info[index];
        // if (!element?.ext?.match(/heic/i)) continue;
        const { size, width, height, filePath, id, ext, name } = element;

        const temp = {
            size, width, height, filePath, id, ext, name,
            thumbnailURL: element.noThumbnail ? (element.size > 1024 * 1024 * 1.5) ? "./assets/icon.ico" : element.filePath : element.thumbnailPath || "./assets/icon.ico",
            new_size: 0,
            path: element.filePath,
            have: null
        };

        selectedList.push(temp);
        if (selectedList.length > 1500) {
            break;
        }
    }
    return selectedList;
}



Sleep(2500).then(() => {

    if (typeof window.eagle != "undefined") {

        window.fs = require("fs");
        window.path = require("path");

        isPluginCreate.value = true;
        process.env['MAGICK_HOME'] = (eagle.plugin.path||"") + "\\magickwand\\win32-x64";
        window.fs = require("fs");
        window.magickwand = require(process.env['MAGICK_HOME'] + "/magickwand.node");

    }

    item_list.value.length = 0;
    GetSelected().then(list => {
        item_list.value.push(...list);
        loadIng.value = false;
    });

});


export function predictElementSize(type: string, item: ItemStatic): number {
    const { width, height, ext, size } = item;

    switch (type.toUpperCase()) {
        case "JPEG":
            if (ext.match(/jpe?g/i)) {
                item.size_estimate = size;
                break;
            }
            item.size_estimate = (width * height * 2) / 10;
            break;
        case "PNG":
            if (ext.match(/png/i)) {
                item.size_estimate = size; break;
            }
            item.size_estimate = width * height * 2;
            break;

        case "WEBP":
            if (ext.match(/webp/i)) {
                item.size_estimate = size; break;
            }

            item.size_estimate = (width * height * 2) / 10;
            break;

        case "BMP":
            if (ext.match(/bmp/i)) {
                item.size_estimate = size; break;
            }
            item.size_estimate = width * height * 2;
            break;


        case "HEIC":
            if (ext.match(/heic/i)) {
                item.size_estimate = size; break;
            }
            // color depth 18-bit
            item.size_estimate = width * height * 2;
            break;

        default:
            return NaN;
    }

    return item.size_estimate;
}

export function formatFileSize(fileSize: number) {
    if (fileSize < 1 || isNaN(fileSize) || fileSize > 1024 * 1024 * 1024 * 1024 * 5) {
        return "0B";
    }
    if (fileSize < 1024) {
        return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
        let temp = fileSize / 1024;
        return temp.toFixed(2) + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
        let temp = fileSize / (1024 * 1024);
        return temp.toFixed(2) + 'MB';
    } else {
        let temp = fileSize / (1024 * 1024 * 1024);
        return temp.toFixed(2) + 'GB';
    }
}

export function Sleep(awaitTime: number) {
    awaitTime = isNaN(Number(awaitTime)) ? 100 : Number(awaitTime);
    awaitTime = (awaitTime >= 99999999999 || awaitTime <= 0) ? 100 : awaitTime;

    return new Promise(
        (resolve) => setTimeout(resolve, awaitTime)
    );
}

export async function UPSelectedList() {
   
    if (!isPluginCreate.value){
        item_list.value.push(...window?.HM_ITEM_DATA_LIST || []);
        return;
    }

    loadIng.value = true;
    item_list.value.length = 0;
    item_list.value.push(...(await GetSelected()));
    console.log(item_list);

    setTimeout(() => loadIng.value = false, 1000)
}

async function runConcurrentTasks(taskFunctions: Array<() => Promise<any>>, concurrency = 6): Promise<any> {
    const results: any[] = [];
    const executingTasks = new Set();
    const runTask = async (taskFunction: any) => {
        const promise = taskFunction();
        executingTasks.add(promise);

        try {
            const result = await promise;
            results.push(result);
        } catch (error) {
            results.push(error);
        } finally {
            executingTasks.delete(promise);
        }
    };

    for (const taskFunction of taskFunctions) {
        if (executingTasks.size >= concurrency) {
            await Promise.race(executingTasks);
        }
        // 给v8放松下 好处理dom响应
        await Sleep(50);
        runTask(taskFunction);
    }

    await Promise.all(executingTasks);
    return results;
}

async function haveIngTaskItem(path: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (!have.value) {
            return reject();
        }

        if (loadIng.value) {
            await Sleep(100);
        }

        const new_path = `${path?.replace(/^(.+)[.].+$/i, "$1") || ""}_TEMP_CACHE_${ID()}.${new_ext.value.toLowerCase()}`;
        cacheStore.Insert(new_path);

        let resolve_ok = false;
        let img = new magickwand.Magick.Image(path);

        await img.magickAsync(new_ext.value).catch(() => {
            resolve_ok = true;
            reject();
        });

        if (!resolve_ok) {

            await img.writeAsync(new_path).catch(() => {
                resolve_ok = true;
                reject();
            });

            if (!resolve_ok) resolve(new_path);
        }

    });
}

function ID() { return (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase() }

function ItemHavePromiseStatic(item: ItemStatic) {
    return (new Promise<void>(async (resolve, reject) => {
        if (!have.value) {
            return reject();
        }

        if (fs.existsSync(item.path)) {
            const new_path = await haveIngTaskItem(item.path).catch(reject);

            if (fs.existsSync(new_path) && typeof new_path === 'string') {

                if (loadIng.value) {
                    await Sleep(100);
                }

                const size = await fs.promises.stat(new_path).then((stat) => item.new_size = stat.size).catch(reject);

                if (size) {


                    const _item = await eagle.item.getById(item.id);

                    if (HandleType.value == "REPLACE") {
                        await _item?.replaceFile(new_path)?.then(() => {
                            // 刷新绑定
                            item.path = new_path;
                        })?.catch(reject);

                        await fs.promises.rm(new_path, { "retryDelay": 600, "maxRetries": 50 }).catch(reject);
                    } else if(HandleType.value =="APPEND"){

                        let folder = (await eagle.folder.getSelected()?.catch(reject))?.[0];

                        await eagle.item.addFromPath(new_path,{
                            "annotation":_item.annotation || "",
                            "name":(_item.name || ID()) + "（转码的）",
                            "tags": ([] as string[]).concat(...(_item.tags || [])),
                            "folders":folder?[folder?.id]:[],
                            "website": _item.url || ""
                        })?.then(() => {
                            // 刷新绑定
                            item.path = new_path;
                        })?.catch(reject);

                        await fs.promises.rm(new_path, { "retryDelay": 600, "maxRetries": 50 }).catch(reject);

                        // // @ts-expect-error
                        // let folder = (await eagle.folder.getSelected()?.catch(reject))[0];

                        // const data = {
                        //     "path": new_path,
                        //     "name": (_item.name || ID()) + "（转码的）",
                        //     "website": _item.url || "",
                        //     "tags": ([] as String[]).concat(...(_item.tags || [])),
                        //     "annotation": _item.annotation || "",
                        //     "folderId": folder?.id || null,
                        //     // 同域下不需要Token
                        //     // "token": "YOUR_API_TOKEN",
                        // };

                        // const requestOptions: RequestInit = {
                        //     method: 'POST',
                        //     body: JSON.stringify(data),
                        //     redirect: 'follow'
                        // };

                        // await fetch("http://localhost:41595/api/item/addFromPath", requestOptions)
                        //     .then(response => response.json())
                        //     .then(async _result => {

                        //     })?.catch(reject);

                    }
                }


                return resolve();
            }

            return reject();
        } else {
            return reject();
        }
    })).then(d => { item.have = "success"; return d }).catch((r) => { item.have = "fail"; return r });
}

export async function HaveSelectedList() {
    have.value = !have.value;
    await Sleep(100);

    if (!have.value) {
        return;
    }

    if (item_list.value.length) {

        if (HandleType.value=="REPLACE"&&!confirm(`您选择的确定是打算替换掉这${item_list.value.length}个源文件吗？`)) {
            have.value = false;
            return;
        }

        const results = [];
        for (let index = 0; index < item_list.value.length; index++) {
            const item = item_list.value[index];
            item.have = null;
            if (index < concurrentNumber.value) item.have = "have";
            results.push(() => ItemHavePromiseStatic(item));
        }

        let i = await runConcurrentTasks(results, concurrentNumber.value);
        have.value = false;

        return i;

    }

    have.value = false;

    return;
}

