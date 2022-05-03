// const axios = require('axios')

// 解析txt
const parsetxt1 = (txts) => {
    const res = txts.split(/\n|\r/g).filter(v => v)
    return res
}
let parsetxt2 = (txts) => {

    const reg = /\n|\r/g
    if (reg.test(txts)) {
        utools.showNotification(`该模式不支持换行符`);
        utools.hideMainWindow();
        throw Error("该模式不支持换行符")
    }

    // https regex
    const reg1 = /[a-zA-z]+:\/\/(.*\/)+([^\s])+/g;
    // inline years regex
    const reg2 = /(?<=[\D\s]{6,})\s?\(?(\d{4}[a-g]?)\)?\s?(?=[\D\s]{6,})/g;
    // volume regex
    const reg3 = /[0-9\s\.\(\)–\-:,]{8,}/g;
    // the titile with end of volume
    const reg4 = /.{10,}?([0-9\s\.\(\)–\-:,]{6,})/g;
    // regex author + year + title without volume
    const reg5 = /.+?(\$\d{4}\$).+?(?=\.)/g;

    let res
    if (reg1.test(txts)) { // https test
        res = txts.replace(reg1, "\.")
    } else {
        res = txts
    }
    // console.log(res)
    if (reg2.test(res)) { // inline years test
        res = res.replace(reg2, (v, args) => {
            return `$${args}$`
        })
    }
    // console.log(res)
    let ress = []
    if (reg3.test(res)) { // volume test
        ress = res.match(reg4)
        res = res.replace(reg3, "\.")
    }
    // console.log(ress)
    // console.log(res)
    if (reg5.test(res)) { // year test
        ress.push(...res.match(reg5))
    }
    // console.log(ress)
    ress = ress.map((v) => {
        return v.replace(/\$(\d{4})\$/g, ` ($1) `).replace(/^[\s\d\.]+|[\s\.]+$/gi, "")
    }).filter(v => v)
    // console.log(ress)

    return ress
}

// 单次请求
let request = async (url, txt) => {
    // console.log(`请求${txt}`)
    if (!txt) return

    // let params = {
    //     "query": txt,
    //     rows: 1,
    // }

    // const res = await axios.get(
    //     url,
    //     { params: params }
    // )
    // console.log(res)
    // const res = await axios.get(`https://api.crossref.org/works?query=Szpunar,+K.+K.,+Khan,+N.+Y.,+%26+Schacter,+D.+L.+(2013a).+Interpolated+memory+tests+reduce+mind+wandering+and+improve+learning+of+online+lectures.+Proceedings+of+the+National+Academy+of+Sciences,+110(16),+6313%E2%80%936317.&rows=1`)

    let txt2 = txt.replace(/[\s\?\&]/g, "+")
    const res = await fetch(`${url}?query=${txt2}&rows=1`, {
        method: 'GET',
    })
    // console.log("res", res.json().then(v => v))

    if (res.status === 200) {
        // let item = res.data.message.items[0];
        let res2 = await res.json()
        // console.log(res2)
        let item = res2.message.items[0];
        return item
    } else {
        throw Error(`status: ${res.status}, message: ${res.message}`)
    }
}
// 解析多个doi
let requests = async (txts1, mode) => {
    let url = "https://api.crossref.org/works";

    let txts
    if (mode === 1) {
        txts = parsetxt1(txts1)
        // console.log(txts)
    } else if (mode === 2) {
        txts = parsetxt2(txts1)
    }
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