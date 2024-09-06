export module _KK_ {
    export var OnputExtList = [
        {
            label: "JPEG",
            value: "JPEG",
            quality: 100,
            describe: "低压缩位图格式",
        }, {
            label: "PNG",
            value: "PNG",
            describe: "透明的无压缩(高压无损)",
            quality: 100
        }, {
            label: "WEBP",
            value: "WEBP",
            describe: "浏览器轻量级格式",
            quality: 100
        }, {
            label: "BMP",
            value: "BMP",
            describe: "win位图格式无压缩",
            quality: 100
        }, {
            label: "APNG",
            value: "APNG",
            describe: "PNG扩展(动画/帧复用)",
            quality: 100
        }, {
            label: "GIF",
            value: "GIF",
            describe: "动画格式(动画需原图支持)",
            quality: 100
        }, {
            label: "SVG",
            value: "SVG",
            describe: "位图将base64化",
            quality: 100
        }, {
            label: "ICO",
            value: "ICO",
            describe: "win常见图标格式(6尺寸)",
            quality: 100
        }
    ];

    export const AppName = "KK图像转码器";

    export function ConfirmReplace(length: number) {
        return `您选择的确定是打算替换掉这%d个源文件吗？`.replace("%d", String(length));
    }

    export const Append = "添加";

    export const Replace = "替换";

    export const Start = "开始";

    export const GetSelected = "获取选中";

    export const Unknown = "未知";
    
    export const not_item_defaultPage = "没有选择可识别的图片，可以在Eagle选中需要的图片点击 [获取选中]";

    export const fileName ="文件名";

    export const originalFormat ="原格式";
    export const originalSize ="原大小";
    export const newSize ="转换后大小";
    
    export const transcodedReg = /(（转码的）)+$/;
    export const transcoded = "（转码的）";

}
