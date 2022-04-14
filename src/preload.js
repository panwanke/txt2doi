
const requests = require("./request");
const { clipboard } = require("electron");

async function getref(text) {
    let res = await requests(text);
    res = res.filter(str => { return !!str; });
    let items = res.map((item) => {
        // console.log("成果获取", item)
        return {
            "title": item.title[0],
            "description": item.DOI,
            "icon": "logo.png",
            "url": item.URL
        };
    }
    );

    // 复制dois
    let dois = items.map((item) => item.description);
    utools.showNotification(`doi复制成功, ${dois.length}条`);
    utools.copyText(dois.join("\n"));

    return items;
}

let getdois = {
    mode: "list",
    args: {
        // 进入插件时调用
        enter: async (action, callbackSetList) => {
            callbackSetList([]);
            const text = await action.payload
            console.log(text)
            if (text === "doi" || text === "getdoi") {
                const res = await clipboard.readText() || ''
                utools.setSubInputValue(res)
            } else {
                utools.setSubInputValue("正在检索，请稍等")
                callbackSetList([{
                    "title": "正在检索，请稍等",
                    "description": "请勿输入",
                    "icon": "logo.png"
                }]);
                const items = await getref(text);
                callbackSetList(items);
            }
        },
        // 子输入框内容变化时被调用 可选 (未设置则无搜索)
        search: async (action, searchWord, callbackSetList) => {
            if (!searchWord) return callbackSetList([]);

            callbackSetList([
                {
                    "title": "开始检索",
                    "description": searchWord,
                    "icon": "logo.png"
                }
            ]);
        },
        // 用户选择列表中某个条目时被调用
        select: async (action, itemData, callbackSetList) => {
            if (itemData.title != "开始检索") {
                window.utools.hideMainWindow()
                const url = itemData.url
                console.log("open url", url)
                await require('electron').shell.openExternal(url)
                // utools.shellOpenExternal(url)
                // window.utools.outPlugin()
            }
            else if (itemData.title === "开始检索") { // 搜索
                // console.log(itemData)
                callbackSetList([]);
                const items = await getref(itemData.description);
                callbackSetList(items);
            }
        },
        // 子输入框为空时的占位符，默认为字符串"搜索"
        placeholder: "输入references (多条目，只输入title即可，加入作者准确率更高)"
    },
};

/**
 * 导出
 */
window.exports = {
    getdois
};
