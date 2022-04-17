const axios = require('axios')
const { PassThrough } = require('stream')

// 解析txt
let parsetxt = (txts) => {
    // parsing mulit line text

    // deleting http://
    let txts2 = txts.replace(/[([ ]{1,2}https?:\/\/\\S+[)] ]{1,2}/g, "")

    // recognize the journal issue and volume
    let txtSplit = txts.replace(/[\d()_*]+, (.+?[0-9)_*])(?=\.|\Z)/g, "\n").split("\n")
    // console.log("解析text", txtSplit)

    // 去除空行和.
    txtSplit = txtSplit.forEach(item => {
        if (item) {
            return item[0] === "." ? item.slice(1) : item
        }
    })

    return txtSplit
}
// 单次请求
let request = async (url, txt) => {
    // console.log(`请求${txt}`)
    if (!txt) return

    let params = {
        "query": txt,
        rows: 1
    }

    const res = await axios.get(
        url,
        { params: params }
    )

    if (res.status === 200) {
        let item = res.data.message.items[0];
        return item
    } else {
        throw Error(`status: ${res.status}, message: ${res.message}`)
    }
}
// 解析多个doi
let requests = async (txts1) => {
    // console.log("开始解析...")
    let url = "https://api.crossref.org/works";

    let txts = parsetxt(txts1)

    let items = txts.map((txt) => {
        if (txt) {
            console.log("请求", txt)
            return request(url, txt)
        }
    })
    return Promise.all(items)
}

// export default responses
module.exports = requests