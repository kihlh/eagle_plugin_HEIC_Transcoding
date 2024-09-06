import type * as _fs from "fs";
import { Sleep } from "./callBackFun";
declare var fs: typeof _fs;

declare var window: Window & typeof globalThis & {
    fs: typeof fs,
};

// user key
export const APP_KEY = "KIIC_HEIC_ENCODE_APP_STORT";
// key
export const INDEX_KEY = "CACHE_PATH";
// 失败添加的重试
export const PATH_KEY_LIST: Set<string> = new Set();


export async function openSql(name?: string, version?: number) {
    return new Promise<IDBRequest<IDBDatabase>>((resolve, reject) => {
        try {
            var storeSql = indexedDB.open(name || APP_KEY, version);

            storeSql.onupgradeneeded = function (event) {
                // @ts-expect-error
                const db = event?.target?.result;

                if (!db) {
                    return reject();
                }

                const objectStore = db.createObjectStore(INDEX_KEY, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("path", "path", { unique: true });
                objectStore.createIndex("size", "size", { unique: false });
            };

            storeSql.onsuccess = function (_event) { resolve(this); };

            storeSql.onerror = reject;
        } catch (error) {
            reject(error);
        }
    });
}

export async function Insert(path: string) {
    PATH_KEY_LIST.add(path);
    return new Promise<{ path: string, size: number }>(async (resolve, reject) => {
        try {

            // await openSql().catch(reject);

            const request = indexedDB.open(APP_KEY, 1);

            const size = await window.fs.promises.stat(path).then((stat) => stat.size).catch(() => 0);

            if (!request) {
                return reject();
            }

            request.onupgradeneeded = function (event) {
                // @ts-expect-error
                const db = event?.target?.result;

                if (!db) {
                    return reject();
                }

                const objectStore = db.createObjectStore(INDEX_KEY, { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("path", "path", { unique: true });
                objectStore.createIndex("size", "size", { unique: false });
            };


            request.onsuccess = async function (event) {
                // @ts-expect-error
                const db = event.target.result;
                const transaction = db.transaction([INDEX_KEY], "readwrite");
                const objectStore = transaction.objectStore(INDEX_KEY);

                if (!objectStore.add) {
                    return reject();
                }
                // 插入数据
                const request = objectStore.add({ size: size, path: path });

                request.onsuccess = function () {
                    PATH_KEY_LIST.delete(path);
                    resolve({ path, size });
                };

                for (const PATH_KEY of PATH_KEY_LIST) {

                    if(!PATH_KEY_LIST.has(PATH_KEY)) continue;
                    // 给dom更新喘气的机会
                    await Sleep(150);
                    const size = await window.fs.promises.stat(path).then((stat) => stat.size).catch(() => 0);

                    const transaction = db.transaction([INDEX_KEY], "readwrite");
                    const objectStore = transaction.objectStore(INDEX_KEY);
                    const request = objectStore.add({ size: size, path: PATH_KEY });
                    request.onsuccess = function () {
                        PATH_KEY_LIST.delete(PATH_KEY);
                    };
                    request.onerror = () => { };
                }

                request.onerror = reject;
            };

            request.onerror = reject;

        } catch (error) {
            reject(error);
        }
    });
}

export async function deleteItem(path: string) {

    return new Promise<boolean>(async (resolve, _reject) => {

        try {
            function resolve_false() {
                resolve(false)
            }

            if (window.fs.existsSync(path)) {
                if (!(await window.fs.promises.rm(path, { "retryDelay": 600, "maxRetries": 50 }).then(() => true).catch(() => false))) {
                    return resolve_false();
                }
            }

            const open_db = await openSql().catch(resolve_false);
            if (!open_db) return resolve_false();

            const db = open_db.result;
            const transaction = db.transaction([INDEX_KEY], "readwrite");
            const objectStore = transaction.objectStore(INDEX_KEY);

            // 使用索引找到并删除记录
            var index = objectStore.index("path");
            var getRequest = index.get(path);
            if (!getRequest) {
                return resolve_false();
            }
            getRequest.onsuccess = function (event) {
                // @ts-expect-error
                const db = event.target?.result;

                if (db) {

                    const deleteRequest = objectStore.delete(db?.id);

                    deleteRequest.onsuccess = function () {
                        resolve(true)
                    };

                    deleteRequest.onerror = resolve_false;

                } else {
                    resolve_false();
                }
            };

            getRequest.onerror = resolve_false;
        } catch (error) {
            resolve(false);
        }
    });

}

export async function getItemList() {
    return new Promise<{ id: number, path: string, size: number }[]>(async (resolve, reject) => {
        try {
            const res: { id: number, path: string, size: number }[] = [];

            const open_db = await openSql().catch(reject);
            if (!open_db) return reject();

            const db = open_db.result;
            const transaction = db.transaction([INDEX_KEY], "readonly");
            const objectStore = transaction.objectStore(INDEX_KEY);

            const cursorRequest = objectStore.openCursor();

            cursorRequest.onsuccess = function (event) {
                // @ts-expect-error
                const cursor = event.target.result;

                if (cursor) {
                    res.push({ id: cursor.value.id, path: cursor.value.path, size: cursor.value.size });
                    cursor.continue();
                } else {
                    resolve(res);
                }
            };

            cursorRequest.onerror = reject;
            open_db.onerror = reject;
        } catch (error) {
            reject(error);
        }
    });
}

