
import { ItemStatic } from "./config";
import { concurrentNumber, HandleType, have, isPluginCreate, item_list, loadIng, new_ext, defaultThumbnailUrl } from "./config";
import type _magickwand from "../../magickwand/Magick++";
import type * as _fs from "fs";
import type * as _path from "path";

import * as cacheStore from "./cacheStore";

import { _KK_ } from './zh_cn'


window.cacheStore = cacheStore;
declare var window: Window & typeof globalThis & {

} & {
    fs: typeof fs,
    magickwand: typeof _magickwand,
    HM_ITEM_DATA_LIST?: ItemStatic[],
    path: typeof _path,
    cacheStore: typeof cacheStore,
    loadThumbnailImagError: typeof loadThumbnailImagError
};

window.loadThumbnailImagError = loadThumbnailImagError;

declare var magickwand: typeof _magickwand;
declare var fs: typeof _fs;
declare var path: typeof _path;

export async function loadThumbnailImagError(item: ItemStatic) {
    if (!item.thumbnailURL) {
        item.thumbnailURL = defaultThumbnailUrl.value;
    }
    if (!item.thumbnailURL.match(/^(([.]+)?[//\\])?assets[//\\]/)) {
        item.thumbnailURL = defaultThumbnailUrl.value;
    }
}

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


export async function GetSelected() {
    const selectedList: ItemStatic[] = [];

    try {

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

            if (
                // jpeg 家族
                !ext?.match(/^[.]?(jpe?g|jfif|pjpeg|pjp)$/i) &&
                // 常见格式
                !ext?.match(/^[.]?(png|apng|avif|webp|heic|gif|svg|bmp|ico|cur|tif|tiff)$/i) &&
                // 摄影图像格式
                !ext?.match(/^[.]?(raw|arw|SRF|SR2)$/i) &&
                // 拉满
                // !ext.match(/^[.]?(AFPHOTO|AFX|AGIF|AGP|AI|APM|APNG|ART|ARW|AVIF|BAY|BIF|BMP|BPG|CDR|CDX|CLIP|CMX|CPC|CR2|CR3|CSL|CT|CUR|DCM|DCR|DCX|DDS|DIB|DICOM|DJVU|DNG|ECW|EMF|EMZ|EXIF|FIG|FLIF|FODG|GBR|GIF|HDR|HEIC|HEIF|ICNS|ICO|INK|J2C|J2K|JFIF|JP2|JPC|JPEG|JPF|JPM|JPX|JXL|JXR|MNG|MP|MPO|NEF|ODG|OTG|PAT|PCT|PCX|PEF|PICT|PNG|PPP|PSB|PSD|PSP|PSPIMAGE|PVT|RAF|RAW|RPF|SKP|SVGZ|TGA|THM|TIFF|WEBP|WMF|WMZ|XPM|XPR)$/i)&&
                // 图像专业格式 |ai|pdf|sai暂时不支持
                !ext?.match(/^[.]?(psd|psb)$/i)
            ) continue;

            const temp: ItemStatic = {
                size, width, height, filePath, id, ext, name,
                thumbnailURL: defaultThumbnailUrl.value,
                new_size: 0,
                path: element.filePath,
                have: null
            };

            // 1.5M以内允许使用源文件作为缩略图
            if (!element.noThumbnail && size <= 1024 * 1024 * 1.5) {
                temp.thumbnailURL = element.thumbnailURL || element.thumbnailPath || element.fileURL || element.fileURL;
            } else {
                temp.thumbnailURL = element.thumbnailURL || element.thumbnailPath || defaultThumbnailUrl.value;
            }

            selectedList.push(temp);
            if (selectedList.length > 1500) {
                break;
            }
        }
    } catch (error) {

    }
    return selectedList;
}



Sleep(2500).then(() => {

    const defaultThumbnailHref = (document.querySelector("#defaultThumbnail") as null | any)?.href || "assets/icon.png";
    defaultThumbnailUrl.value = defaultThumbnailHref;

    if (typeof window.eagle != "undefined") {

        window.fs = require("fs");
        window.path = require("path");

        isPluginCreate.value = true;
        process.env['MAGICK_HOME'] = (eagle.plugin.path || "") + "\\magickwand\\win32-x64";
        window.fs = require("fs");
        window.magickwand = require(process.env['MAGICK_HOME'] + "/magickwand.node");

    }


    GetSelected().then(list => {

        const selectedList = (list?.length ? list : []);

        item_list.value.length = 0;

        for (let index = 0; index < selectedList.length; index++) {
            const element = selectedList[index];

            item_list.value.push(element);
        }

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
        case "APNG":
            if (ext.match(/a?png/i)) {
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

        case "GIF":
            if (ext.match(/GIF/i)) {
                item.size_estimate = size; break;
            }

            item.size_estimate = ((width * height * 2) / 10) * 2;
            break;

        case "SVG":
            if (ext.match(/SVG/i)) {
                item.size_estimate = size; break;
            }
            // svg 处理到位图会转为bs64 大小会增加约0.5倍
            item.size_estimate = ((width * height * 2)) * 1.5;
            break;
        case "ICO": {

            // 常见的icon会有6个尺寸 最大一般为512
            const iconSizeList = [256, 128, 96, 64, 48, 32, 24, 16];

            let size_ico = 0;

            for (let index = 0; index < iconSizeList.length; index++) {
                const iconSize = iconSizeList[index];
                size_ico += ((iconSize * iconSize * 2) / 10);
            }

            item.size_estimate = size_ico;
            break;
        }
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

    if (!isPluginCreate.value) {

        item_list.value.push(...window?.HM_ITEM_DATA_LIST || []);
        return;
    }
    if (loadIng.value) return;
    loadIng.value = true;


    await GetSelected().then(list => {
        item_list.value.length = 0;
        const selectedList = (list?.length ? list : []);
        for (let index = 0; index < selectedList.length; index++) {
            const element = selectedList[index];

            item_list.value.push(element);
        }
        // loadIng.value = false;
    });

    // console.log(item_list);

    setTimeout(() => loadIng.value = false, 600);

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
        try {

            if (!have.value) {
                return reject();
            }

            if (loadIng.value) {
                await Sleep(100);
            }

            if (new_ext.value == "ICO") {

                const new_path = `${path?.replace(/^(.+)[.].+$/i, "$1") || ""}_TEMP_CACHE_${ID()}.${new_ext.value.toLowerCase()}`;
                cacheStore.Insert(new_path);

                let resolve_ok = false;
                let img = new magickwand.Magick.Image(path);
                img.backgroundColor("none");

                const originalWidth = img.size().width();
                const originalHeight = img.size().height();
                const targetWidth = 256;
                const targetHeight = 256;

                let offsetX = (targetWidth - originalWidth) / 2;
                let offsetY = (targetHeight - originalHeight) / 2;

                offsetX && offsetY;

                await img.resizeAsync(`${targetWidth}x${targetHeight}`);
                await Sleep(15);
                await img.extentAsync(`${targetWidth}x${targetHeight}`);

                img.defineValue("icon", "auto-resize", "256,128,96,64,48,32,24,16");
                await Sleep(15);

                await img.magickAsync("icon").catch(() => {
                    resolve_ok = true;
                    reject();
                });
                await Sleep(15);

                if (!resolve_ok) {

                    await img.writeAsync(new_path).catch(() => {
                        resolve_ok = true;
                        reject();
                    });
                    await Sleep(15);

                    if (!resolve_ok) {
                        return resolve(new_path);
                    }
                }


                return reject();
            }

            const new_path = `${path?.replace(/^(.+)[.].+$/i, "$1") || ""}_TEMP_CACHE_${ID()}.${new_ext.value.toLowerCase().replace(/jpeg/i, "jpg")}`;
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

        } catch (error) {
            return reject();
        }

    });
}

function ID() { return (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase() }

async function ItemHavePromiseStatic(item: ItemStatic) {
    const d = await (new Promise<void>(async (resolve, reject) => {
        try {
            // 任务禁止重复
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
                        } else if (HandleType.value == "APPEND") {

                            let folder = (await eagle.folder.getSelected()?.catch(reject))?.[0];

                            await eagle.item.addFromPath(new_path, {
                                "annotation": _item.annotation || "",
                                "name": (_item.name || ID())?.replace(_KK_.transcodedReg || /(（转码的）)+$/, "") + (_KK_.transcoded || "（转码的）"),
                                "tags": ([] as string[]).concat(...(_item.tags || [])),
                                "folders": folder ? [folder?.id] : [],
                                "website": _item.url || ""
                            })?.catch(reject);

                            await fs.promises.rm(new_path, { "retryDelay": 600, "maxRetries": 50 }).catch(reject);

                        }
                    }


                    return resolve();
                }

                return reject();
            } else {
                return reject();
            }

        } catch (r) {
            item.have = "fail";
            return reject(r);
        }

    }))

        .then(() => item.have = "success")
        .catch(() => item.have = "fail");

    return d;

}

export async function HaveSelectedList() {
    have.value = !have.value;
    await Sleep(100);

    if (!have.value) {
        return;
    }

    if (item_list.value.length) {

        if (HandleType.value == "REPLACE" && !confirm(_KK_.ConfirmReplace(item_list.value.length))) {
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

