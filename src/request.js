// 解析txt
const parsetxt1 = (txts) => {
    const res = txts.split(/\n|\r/g).filter(v => v)
    return res
}
let parsetxt2 = (txts) => {
    const reg = /\n|\r/g
    if (reg.test(txts)) {
        if (typeof utools !== "undefined" && utools.showNotification) {
            try {
                utools.showNotification(`该模式不支持换行符`);
            } catch (e) { console.warn("showNotification error", e); }
        }
        if (typeof utools !== "undefined" && utools.hideMainWindow) {
            try {
                utools.hideMainWindow();
            } catch (e) { console.warn("hideMainWindow error", e); }
        }
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

function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(new Error(`Promise timed out after ${ms} ms`));
        }, ms);
        promise.then((result) => {
            clearTimeout(timeoutId);
            resolve(result);
        }, (error) => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}

// 单次请求
let request = async (url, txt) => {
    // console.log(`请求${txt}`)
    let item = ""
    try {
        let txt2 = txt.replace(/[\s\?\&]/g, "+")
        if (typeof window !== "undefined" && typeof window.fetch !== "function") {
            throw new Error("fetch API 不可用");
        }
        const res = await timeout(60000, fetch(
            `${url}?query.bibliographic=${encodeURI(txt2)}&rows=1`,
            {
                method: 'GET',
                headers: new Headers({ "User-Agent": "GroovyBib / 1.1(https://github.com/Asynchro-Epool; mailto:qq962643013@gmail.com) BasedOnFunkyLib/1.4" }),
            }
        ))
        if (res.status === 200) {
            let res2 = await res.json()
            item = res2.message.items[0];
        } else {
            throw Error(`status: ${res.status}, message: ${res.message}`)
        }
    }
    catch (err) {
        console.log(err)
        if (typeof utools !== "undefined" && utools.showNotification) {
            try {
                utools.showNotification("请求错误: " + err.message);
            } catch (e) { console.warn("showNotification error", e); }
        }
        return { title: "未找到条目或超时" }
    }
    finally {
        if (!item || (Array.isArray(item) && item.length === 0)) {
            return { title: "未找到条目或超时" }
        } else {
            return item
        }
    }
}
// 解析多个doi
let requests = async (txts1, mode) => {
    let url = "https://api.crossref.org/works";
    let txts
    if (mode === 1) {
        txts = parsetxt1(txts1)
    } else if (mode === 2) {
        txts = parsetxt2(txts1)
    }
    if (txts.length === 0 || txts.length > 40) {
        if (typeof utools !== "undefined" && utools.showNotification) {
            try {
                utools.showNotification("条目数量需在 1-40 之间");
            } catch (e) { console.warn("showNotification error", e); }
        }
        return Promise.all([{ title: "条目数量大于40" }]);
    }
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let items = []
    for (let i = 0; i < txts.length; i++) {
        if (txts[i] && txts[i].trim().length > 0) {
            console.log("请求", txts[i]);
            items.push(request(url, txts[i]));
            await wait(800);
        }
    }
    return Promise.all(items)
}

/**
 * 导出请求主接口，便于后续扩展
 */
module.exports = { requests };