/**
 * 生成二维码的工具类
 */
import QRCode from 'qrcodejs2';
export function bindQRCode(dom, content) {
    new QRCode(dom, {
        text: content,
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
    })
}