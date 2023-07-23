/**
 * 图片处理工具类
 */
/**
 * base64图片转换为图片文件
 * @param base64
 * @param filename
 * @returns {File}
 */
export function base64ToFile(base64, filename) {
    // console.log('filename'+filename)
    // 转base64为可发送的二进制文件
    const bytes = window.atob(base64.split(',')[1])
    const arr = []
    const bytesLength = bytes.length
    for (let i = 0; i < bytesLength; i += 1) {
        arr.push(bytes.charCodeAt(i))
    }
    const blob = new Blob([new Uint8Array(arr)], { type: "image/jpeg" })
    const formData = new FormData();
    formData.append("file", blob, `${filename}.jpg`)
    return formData
}