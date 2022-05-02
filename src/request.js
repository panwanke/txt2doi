const axios = require('axios')

// 解析txt
const apaFormat = (str, reg) => {
    const arr = str.match(reg);
    // console.log(arr)
    if (arr && arr.length > 1) {
        const arr2 = arr.reduce(
            (pv, cv) => {
                return cv.length > pv.length ? cv : pv;
            }
            , "");
        return arr2;
    } else if (arr) {
        return arr[0];
    }
}
const pattern1 = (str, reg) => {
    const arr = str.match(reg);
    return arr ? arr : []
}
let parsetxt = (txts) => {
    // parsing mulit line text
    const reg = /[a-zA-z]+:\/\/[^\s]*/g;
    // inline years regex
    const reg2 = /(?<=[\D\s]{6,})\s?\(?(\d{4})\)?\s?(?=[\D\s]{6,})/g;
    // apa format regex
    const reg3 = /(?!\W)([\D\.\s]{4,})(\(?\d{4}\)?)[\.\s,]+?[\d\D]+?(?=[\d\s\.\(\)–\-:,]{6,})/g
    // volume regex
    const reg4 = /[0-9\s\.\(\)–\-:,]{8,}/g;
    // the titile with end of volume
    const reg5 = /\D{10,}([0-9\s\.\(\)–\-:,]{8,})/g;
    // regex author + year + title without volume
    const reg6 = /([^\.]{4,})(\(?\d{4}\)?)[\.\s,]+?[\d\D]+?(?=\.)/g;

    let res
    // console.log(txts)
    if (reg.test(txts)) { // https test
        const match = txts.split(reg)

        res = match.map((v) => {
            return apaFormat(v, reg3)
        }).filter(v => v)
        // console.log(res)
        if (res.length === 0) { res = pattern1(txts, reg6) }
        if (res.length === 0) { res = [txts] }
        // console.log(res)
    } else if (reg2.test(txts)) { // inline years test
        const match = txts.replace(reg2, (v, args) => {
            return `$${args}$`
        })
        res = match.trim().split(reg4)
        res = res.map((v) => {
            return v.replace(/\$(\d{4})\$/g, ` ($1) `)
        }).filter(v => v)
        // console.log(res)
    } else if (reg4.test(txts)) { // volume test
        const match = txts.match(reg5)
        res = match.filter(v => v).map(v => v.trim())
        // console.log(res)
    } else {
        res = pattern1(txts, reg6)
        if (res.length === 0) { res = [txts] }
        // console.log(res)
    }

    // if (!res) {
    //     utools.showNotification(`参考文献格式存在问题，请重新尝试`);
    //     throw Error("参考文献格式存在问题")
    // }
    return res
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
    let url = "https://api.crossref.org/works";

    let txts = parsetxt(txts1)
    // console.log("开始解析...", txts1)
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