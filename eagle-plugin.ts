
///// <reference types="eagle" />

declare namespace eagle {

    export module Type {

        export interface Manifest {
            // uuid 插件唯一id
            id: string;
            // 版本号
            version: string;
            // 适用平台
            platform?: "all" | "mac" | "win";
            // 可执行的平台
            arch?: "all" | "arm" | "x64";
            // 名称
            name: string;
            // log
            logo?: string;
            // 关键词
            keywords?: Array<string>;
            // 开发者模式
            devTools?: boolean;
            // 入口配置
            main: {
                // 入口页面
                url: string;
                //  窗口宽度
                width: number;
                // 窗口高度
                height: number;
                // 窗口最小宽度
                minWidth?: number;
                // 窗口最小高度
                minHeight?: number;
                // 窗口最大宽
                maxWidth?: number;
                // 窗口最小宽
                maxHeight?: number;
                // 窗口是否永远在别的窗口的上面， 默认值为 false。
                alwaysOnTop?: boolean;
                // 无边框窗口 默认值为 true，当为 false 时，将使用无边框窗口，这是一种特殊的窗口模式，它不带有外壳（包括窗口边框、标题栏、工具栏等），只含有网页内容。
                frame?: boolean;
                // 窗口是否可以进入全屏状态，默认值为 true。
                fullscreenable?: boolean;
                // 窗口是否最大化，默认值为 true。
                maximizable?: boolean;
                // 窗口是否可最小化，默认值为 true。
                minimizable?: boolean;
                //  窗口大小是否可调整，默认值为 true。
                resizable?: boolean;
                // 安装后自动打开，默认为 false
                runAfterInstall?: boolean;
                // 窗口是否可以多開，默认值 false
                multiple?: boolean;
                //  窗口背景色，默认值为#FFF。
                backgroundColor?: string;
            }
        }

        // （资源文档文件夹的uuid  前四位是时间带入值  后面的是随机码 共13位) 正则 /[a-zA-Z\d]{13}/
        export type UUID = `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}`;

        // 文件夹
        export interface FolderInfo {
            children: FolderInfo[];
            // 注释
            description: string;
            // 图标大小
            icon: string /*"smile"*/;
            iconColor: string /*"aqua"*/;
            id: UUID;
            modificationTime: number
            name: string;
            password: string;
            passwordTips: string;
            tags: Array<string>;
        }

        // 智能文件夹
        export interface SmartFolder {
            "id": UUID,
            "name": string,
            "description": string,
            "modificationTime": number,
            "conditions": {
                "rules": Array<{
                    "property": string,
                    "method": string,
                    "value": string,
                    // "$$hashKey": "object:6510"
                }>,
                "match": "OR" | "AND",
                "boolean": "TRUE" | "FALSE",
                // "$$hashKey": "object:6501"
            }[],
            "children": FolderInfo[]
        }

        // 标签群组
        export interface TagsGroups {
            id: UUID;
            name: string;
            tags: Array<string>;
        }

        export interface LibraryInfo {
            // eagle版本号
            applicationVersion: string;
            // 根文件夹
            folders: FolderInfo[];
            // 返回最后修改时间 (timestamp)
            modificationTime: BigInt | number;
            // 智能文件夹
            smartFolders: SmartFolder[];
            // 标签群组 所有
            tagsGroups: TagsGroups[];
            // 快速访问
            quickAccess: {
                "type": "folder",
                "id": UUID
            }[];
        }
        // 主题
        export type ThemeName = "Auto" | "LIGHT" | "LIGHTGRAY" | "GRAY" | "DARK" | "BLUE" | "PURPLE";


        export interface PluginAttribute {
            path: string;
            manifest: Manifest
        }

        // 递归地计算出所有的数字 0-N
        type Enumerate<T extends number, R extends number[] = []> = R['length'] extends T ? R[number] : Enumerate<T, [R['length'], ...R]>

        type Alpha = Enumerate<256>;

        type Ratio = Enumerate<101>;

        export interface ColourItem {
            "color": [
                Alpha,
                Alpha,
                Alpha
            ],
            // 百分比
            "ratio": Ratio,
            // "$$hashKey": "object:6620"
        }
    }


    export interface Plugin {
        path?: string;
    }

    export interface Library {
        // 返回当前资源库名称 【官方文档发现但是实际未找到】
        name?: string;
        // 返回当前资源库所在路径
        path: string;
        // 返回最后修改时间 (timestamp) 【官方文档发现但是实际未找到】
        modificationTime?: BigInt | number;

        info: () => Promise<Type.LibraryInfo>;
    }

    export var plugin: Plugin;
    export var library: Library;

    // 当前插件是否处于开发者状态
    export var isDev: boolean;

    /**
     * 產生一個 uuid 
     * @description （资源文档文件夹的uuid  前四位是时间带入值  后面的是随机码 共13位) 正则 /[a-zA-Z\d]{13}/
     */
    export var guid: () => Type.UUID;


    module item {

        class Item {
            readonly id: string;             // 文件 ID， 只读
            name: string;                    // 文件名
            readonly ext: string;            // 文件扩展名， 只读
            width: number;                   // 图像宽度
            height: number;                  // 图像高度
            url: string;                     // 来源链接
            readonly isDeleted: boolean;     // 文件是否在垃圾桶中， 只读
            annotation: string;              // 文件注释
            tags?: string[];                  // 文件标签 需要提前创建标签再插入不然会出现严重后果
            folders: string[];               // 所属文件夹 ids
            readonly palettes: Type.ColourItem[];     // 色卡信息， 只读
            readonly size: number;           // 文件大小， 只读
            star: number;                    // 评分信息，0 ~ 5
            readonly importedAt: number;     // 添加时间， 只读
            readonly noThumbnail: boolean;   // 是否有缩略图， 只读
            readonly noPreview: boolean;     // 是否支持双击预览， 只读
            readonly filePath: string;       // 文件所在路径， 只读
            readonly fileURL: string;        // 文件所在路径之链接（file:///）， 只读
            readonly thumbnailPath?: string;  // 缩略图路径， 只读 先判断noThumbnail
            readonly thumbnailURL?: string;   // 缩略图链接（file:///）， 只读 先判断noThumbnail
            readonly metadataFilePath: string; // metadata.json 所在位置， 只读

        }

        interface Item {
            // 存储更改
            save(): Promise<boolean>;
            // 替换文件并刷新
            replaceFile(FilePath: string): Promise<boolean>;
            // 刷新缩略图
            refreshThumbnail(): Promise<boolean>;
            // 设置缩略图
            setCustomThumbnail(FilePath: string): Promise<boolean>;
            // 在全部列表显示此文件
            open(itemId?: string): Promise<void>;
        }

        export type GetSearchOptions = {
            id?: string;                   // 文件 id (可选)
            ids?: string[];                // 文件 id 数组 (可选)
            isSelected?: boolean;          // 正在被选中的文件 (可选)
            isUntagged?: boolean;          // 尚未标签 (可选)
            isUnfiled?: boolean;           // 尚未分类 (可选)
            keywords?: string[];           // 包含关键字 (可选)
            tags?: string[];               // 包含标签 (可选)
            folders?: string[];            // 包含文件夹 (可选)
            ext?: string;                  // 文件格式 (可选)
            annotation?: string;           // 注释 (可选)
            rating?: number;               // 评分，0 ~ 5 (可选)
            url?: string;                  // 来源链接 (可选)
            shape?: "square" | "portrait" | "panoramic-portrait" | "landscape" | "panoramic-landscape";  // 形状 (可选)
        };

        export type ItemList = Array<Item>;

        export var get: (options: GetSearchOptions) => Promise<ItemList>;
        export var getSelected: () => Promise<ItemList>;
        export var getByIds: (itemIds: Type.UUID[]) => Promise<ItemList>;
        export var getById: (itemId: Type.UUID) => Promise<Item>;
        export var getAll: () => Promise<ItemList>;

        export type AddFromURLOptions = {
            name?: string;
            website?: string;
            tags?: string[];
            folders?: Type.UUID[];
            annotation?: string;
        };

        /**
         * 将图片链接添加至 Eagle
         */
        export var addFromURL: (url: string, options: AddFromURLOptions) => Promise<Type.UUID | undefined>;

        export interface AddFromBase64Options {
            name?: string;
            website?: string;
            tags?: string[];
            folders?: string[];
            annotation?: string;
        }

        //   添加 base64 图像至 Eagle
        export var addFromBase64: (base64: string, options: AddFromBase64Options) => Promise<Type.UUID | undefined>;

        export interface AddFromPathOptions {
            name?: string;
            website?: string;
            tags?: string[];
            folders?: string[];
            annotation?: string;
        }

        //   从本地文件路径添加文件至 Eagle
        export var addFromPath: (path: string, options: AddFromPathOptions) => Promise<Type.UUID | undefined>;

        export interface AddBookmarkOptions {
            name?: string;
            base64?: string;
            tags?: string[];
            folders?: string[];
            annotation?: string;
        }

        //   添加书签链接至 Eagle
        export var addBookmark: (url: string, options: AddBookmarkOptions) => Promise<Type.UUID | undefined>;

    }

    module folder {
        export class Folder {
            readonly id: Type.UUID;              // 文件夹 id， 只读
            name: string;            // 文件夹名称
            description: string;     // 文件夹描述、介绍
            readonly icon: string;            // 只读，文件夹图标
            readonlyiconColor: string;       // 只读，文件夹图标颜色
            createdAt: number;       // 文件夹创建时间 (timestamp)
            readonly children: Folder[];      // 只读，子文件夹数组

        }

        export interface Folder {
            save(): Promise<void>;
            open(): Promise<void>
            // 静态方法
            getById(folderId: Type.UUID): Promise<Folder>;
        }

        export type FolderList = Folder[];
        // 选中并显示此文件
        export var open: (folderId: Type.UUID) => Promise<void>;
        // 获取最近使用的的文件夹
        export var getRecents: () => Promise<FolderList>;
        // 获取选中
        export var getSelected: () => Promise<FolderList>;
        // 获取id组
        export var getByIds: (folderIds: Type.UUID[]) => Promise<FolderList>;
        // 获取id
        export var getById: (olderId: Type.UUID) => Promise<Folder>;
        // 获取全部(慎用 因为可能会巨大)
        export var getAll: () => Promise<FolderList>;

    }

    module tag {

        export class Tag {
            readonly name: string;
            "count": number;
            "pinyin": string;
            "groups": Type.UUID[]
        }
        // 获取所有
        export var get: () => Promise<Tag[]>;
        // 获取最近
        export var getRecents: () => Promise<Tag[]>;
    }

    // 智能分组 已声明未找到
    module tagGroup {
        export var get: () => Promise<any>;
    }

    module window {
        export var show: () => Promise<void>;
        export var showInactive: () => Promise<void>;
        export var hide: () => Promise<void>;
        export var focus: () => Promise<void>;
        export var minimize: () => Promise<void>;
        export var isMinimized: () => Promise<void>;
        export var restore: () => Promise<void>;
        export var maximize: () => Promise<void>;
        export var unmaximize: () => Promise<void>;
        export var isMaximized: () => Promise<boolean>;
        export var setFullScreen: (flag: boolean) => Promise<void>;
        // 这将使窗口保持长宽比。 Float - 保持的宽高比（宽 / 高） 如：(16/9)
        export var setAspectRatio: (aspectRatio: number) => Promise<void>;
        export var setBackgroundColor: (backgroundColor: `#${number}${number}${number}` | `#${number}${number}${number}${number}${number}${number}`) => Promise<void>;

        export var setSize: (width: number, height: number) => Promise<void>;
        // 获取窗口大小 宽(width),高(height)
        export var getSize: () => Promise<[number, number]>;

        export type Bounds = {

            x: number,
            y: number,
            width: number,
            height: number
        }

        export var setBounds: (setBounds: Bounds) => Promise<void>;
        export var getBounds: () => Promise<Bounds>;

        export var setResizable: (resizable: boolean) => Promise<void>;

        export var isResizable: () => Promise<boolean>;
        export var setAlwaysOnTop: (resizable: boolean) => Promise<void>;
        export var isAlwaysOnTop: () => Promise<boolean>;
        export var setPosition: (x: number, y: number) => Promise<void>;

        export var getPosition: () => Promise<[number, number]>;
        // 设置窗口的不透明度， 超出界限的数值被限制在[0 - 1] 范围内。 (0.0 - 1.0)
        export var setOpacity: (Opacity: number) => Promise<void>;
        export var getOpacity: () => Promise<number>;
        export var flashFrame: (flag: boolean) => Promise<void>;
        // 设置忽略鼠标事件(禁用窗口)
        export var setIgnoreMouseEvents: (ignore: boolean) => Promise<void>;

        /* node_modules/electron/electron.d.ts @ Electron.NativeImage*/
        type NativeImage = any;

        export var capturePage: (rect?: {
            x: number
            y: number
            width: number
            height: number
        }) => Promise<NativeImage>;

        export var setReferer: (Referer: string) => Promise<void>;

    }

    module log {
        export var warn: (object: any) => void;
        export var error: (object: any) => void;
        export var info: (object: any) => void;
        export var debug: (object: any) => void;
    }

    module shell {
        export var beep: () => Promise<void>;
        export var openExternal: (url: string) => Promise<void>;
        export var openPath: (path: string) => Promise<void>;
        export var showItemInFolder: (path: string) => Promise<void>;
    }

    module drag {
        export var startDrag: (filePaths: string[]) => Promise<void>;
    }

    module os {
        export var tmpdir: () => string;
        export var version: () => string;
        export var type: () => string;
        export var release: () => string;
        export var hostname: () => string;
        export var homedir: () => string;
        export var arch: () => string;
    }

    module screen {
        interface Point {
            x: number;
            y: number;
        }

        interface Display {
            id: string;
            name: string;
            width: number;
            height: number;
        }
        export var getCursorScreenPoint: () => Promise<Point>;
        export var getPrimaryDisplay: () => Promise<Display>;
        export var getAllDisplays: () => Promise<Display[]>;
        export var getDisplayNearestPoint: (point: Point) => Promise<Display>;
    }

    module app {
        // 当前 Eagle 应用程序版本
        export var version: string;

        // 当前 Eagle 应用程序 Build Number
        export var build: number;

        // 当前 Eagle 应用程序界面语系
        // 可能的值为: "en", "zh_CN", "zh_TW", "ja_JP", "ko_KR", "es_ES", "de_DE", "ru_RU"
        export var locale: 'en' | 'zh_CN' | 'zh_TW' | 'ja_JP' | 'ko_KR' | 'es_ES' | 'de_DE' | 'ru_RU';

        // 返回操作系统 CPU 架构
        // 可能的值为: "x64", "arm64", "x86"
        export var arch: 'x64' | 'arm64' | 'x86';

        // 返回操作系统平台
        // 可能的值为: "darwin" (macOS), "win32" (Windows)
        export var platform: "darwin" | "windows";

        // 返回环境变量对象
        export var env: { [key: string]: string };

        // 当前应用程序执行路径
        export var execPath: string;

        // 当前插件进程 id
        export var pid: number;

        // 是否当前为 Windows 操作系统
        export var isWindows: boolean;

        // 是否当前为 Mac 操作系统
        export var isMac: boolean;

        // 是否当前应用正在使用 ARM64 运行环境 (如 macOS Rosetta 或 Windows WOW)
        export var runningUnderARM64Translation: boolean;
        export var isDarkColors: () => boolean;
        // 您可以通过名称请求以下路径
        export var getPath: (name: "home" | "appData" | "userData" | "temp" | "exe" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "recent") => Promise<string>;

        /* node_modules/electron/electron.d.ts @ Electron.NativeImage*/
        type NativeImage = any;

        export var getFileIcon: (path: string, options?: {
            size: "small" | "normal" | "large";
        }) => Promise<NativeImage>;

        export var createThumbnailFromPath: (path: string, maxSize: { height: number, width: number }) => Promise<NativeImage>;

    }

    // 在屏幕角落跳出提视窗口，提示用户操作状态。
    module notification {

        type NotificationOptions = {
            title: string // 通知窗口标题
            description: string; // 通知窗口描述
            icon?: string //URL/base64 通知窗口图标，支持链接或 base64 格式（可选）
            mute?: boolean // 提示音效（可选）
            duration?: number// 自动隐藏时间（毫秒）（可选）
        };

        export function show(options: NotificationOptions): void;
    }

    // 创建系统原生应用右键菜单
    module contextMenu {

        type MenuItem = any;
        export function open(menuItems: MenuItem): void;
    }

    // 跳出系统对话框功能，包含打开、保存文件、提示、警报等
    module dialog {

        // 定义文件过滤器类型
        interface FileFilter {
            name: string;
            extensions: string[];
        }

        // 定义 OpenDialogOptions 类型
        type OpenDialogOptions = {
            title?: string;                  // 对话框窗口的标题 (可选)
            defaultPath?: string;            // 对话框的默认展示路径 (可选)
            buttonLabel?: string;            // 「确认」按钮的自定义标签 (可选)
            filters?: FileFilter[];          // 文件过滤器数组 (可选)
            properties?: Array<
                'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' |
                'createDirectory' | 'promptToCreate'
            >;                               // 对话框属性 (可选)
            message?: string;                // macOS 显示在输入框上方的消息 (可选)
        };

        /**
         * 显示打开文件对话框。
         * @param options 
         */
        export function showOpenDialog(options: OpenDialogOptions): Promise<{
            // 文件列表
            filePaths?: string[],
            // 被取消
            canceled: boolean
        }>;

        // 定义文件过滤器类型
        interface FileFilter {
            name: string;
            extensions: string[];
        }

        // 定义保存对话框选项类型
        type SaveDialogOptions = {
            title?: string;                  // 对话框窗口的标题 (可选)
            defaultPath?: string;            // 对话框的默认展示路径 (可选)
            buttonLabel?: string;            // 「确认」按钮的自定义标签 (可选)
            filters?: FileFilter[];          // 文件过滤器数组 (可选)
            properties?: Array<
                'openDirectory' | 'showHiddenFiles' | 'createDirectory'
            >;                               // 对话框属性 (可选)
        };

        // 定义保存对话框结果类型
        interface SaveDialogResult {
            canceled: boolean;               // 对话框是否被取消
            filePath?: string;               // 如果对话框被取消，则为 undefined
        }

        /**
         * 显示打开文件对话框。
         * @param options 
         */
        export function showSaveDialog(options: SaveDialogOptions): Promise<SaveDialogResult>;

        type MessageBoxOptions = {
            message: string;              // 对话框主要内容
            title?: string;               // 对话框标题（可选）
            detail?: string;              // 额外信息（可选）
            buttons?: string[];           // 按钮文本数组（可选）
            type?: 'none' | 'info' | 'error' | 'question' | 'warning'; // 对话框类型（可选）
        };
        
        type MessageBoxResult = {
            response: number;             // 点击按钮的索引
        };
        
        /**
         * 显示讯息对话框
         * @param options 
         */
        export function showMessageBox(options: MessageBoxOptions): Promise<MessageBoxResult>;

        /**
         * 显示错误讯息的对话框。
         * @param title 显示在错误框中的标题
         * @param content 显示在错误框中的文本内容
         */
        export function showErrorBox(title: string, content: string): Promise<void>;

    }

    // event（事件）
    // https://developer.eagle.cool/plugin-api/v/zh-cn/api/event
    /**
     * 插件窗口建立时，Eagle 会主动调用这个方法，你可以使用此方法初始化插件需要的模块。
     * @tips !实测会偶发出现无法加载的情况，所以建议不调用这个 避免导致整个api无法使用 4.0.0(build25)
     * @param callBakc 
     */
    export var onPluginCreate: (callBakc: (plugin: Type.PluginAttribute) => void) => void;
    /**
     * 当用户点击插件面板的插件时，Eagle 会主动调用这个方法
     * @param callBakc 
     */
    export var onPluginRun: (callBakc: () => void) => void;
    /**
     * 插件窗口关闭前 Eagle 会主动调用这个方法
     * @tips 提示：如果你想要阻止窗口被关闭，你可以注册 window.onbeforeunload方法避免窗口被关闭。
     * @param callBakc 
     */
    export var onPluginBeforeExit: (callBakc: () => void) => void;
    /**
     * 插件窗口显示时时，Eagle 会主动调用这个方
     * @param callBakc 
     */
    export var onPluginShow: (callBakc: () => void) => void;
    /**
     * 插件窗口隐藏时时，Eagle 会主动调用这个方法
     * @param callBakc 
     */
    export var onPluginHide: (callBakc: () => void) => void;
    /**
     * 当用户切换资源库时，Eagle 会主动调用这个方法
     * @param callBakc 
     */
    export var onLibraryChanged: (callBakc: (libraryPath: string) => void) => void;
    /**
     * Eagle 主程序主题配色改变是，Eagle 会主动调用这个方法，如果插件支持多种配色主题，你可以使用此方法做出对应的 UI 调整
     * @param callBakc 
     */
    export var onThemeChanged: (callBakc: (theme: Type.ThemeName) => void) => void;

}