const { requests } = require("./request");

/**
 * 检索并格式化参考文献条目
 * @param {string} text - 输入文本
 * @param {number} mode - 检索模式
 * @returns {Promise<Array>} 格式化后的条目数组
 */
async function getref(text, mode) {
    let res = await requests(text, mode);
    res = res.filter(str => !!str);
    const items = [];
    // 查找重复
    let titles = new Set(res.map(item => item.title && item.title[0]));
    titles = [...titles].filter(Boolean);
    for (let title of titles) {
        const item = res.find(item => item.title && item.title[0] === title);
        if (item && titles.includes(item.title[0])) { // 去除重复item
            const authors = item.author ? item.author.map(v => v["family"]).join(", ") : "";
            const journal = ("container-title" in item) ? item["container-title"] : " ";
            items.push({
                "title": item.title[0],
                "description": `${authors}  ${journal}  ${item.DOI}`,
                "icon": "logo.png",
                "url": item.URL,
                "DOI": item.DOI,
                "mode": 0
            });
        }
    }

    // 复制 dois 并通知
    let dois = items.map((item) => item.DOI);
    if (dois.length > 0) {
        if (typeof utools !== "undefined" && utools.showNotification) {
            try {
                utools.showNotification(`成功复制${dois.length}条doi`);
            } catch (e) { console.warn("showNotification error", e); }
        }
    }
    if (typeof utools !== "undefined" && utools.copyText) {
        try {
            utools.copyText(dois.join("\n"));
        } catch (e) { console.warn("copyText error", e); }
    }
    return items;
}

/**
 * 导出
 */
/**
 * uTools 模板插件应用 window.exports 标准格式
 * https://www.u-tools.cn/docs/developer/information/window-exports.html
 */
window.exports = {
    // key 必须与 plugin.json 中 features.code 一致
    getdois: {
        mode: "list",
        args: {
            // 进入插件时调用
            enter: async (action, callbackSetList) => {
                callbackSetList([]);
                const txt = await action.payload;
                callbackSetList([
                    {
                        "title": "1. 根据换行符分割进行检索",
                        "description": "选择正则模式",
                        "mode": 1,
                        "icon": "logo.png",
                        "txt": txt
                    },
                    {
                        "title": "2. 根据正则进行分割检索",
                        "description": "选择正则模式",
                        "mode": 2,
                        "icon": "logo.png",
                        "txt": txt
                    }
                ]);
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            // search: async (action, searchWord, callbackSetList) => {
            //     if (!searchWord) return callbackSetList([]);
            //     callbackSetList([]);
            // },
            // 用户选择列表中某个条目时被调用
            select: async (action, itemData, callbackSetList) => {
                const mode = itemData.mode;
                const txt = itemData.txt;
                callbackSetList([{
                    "title": "正在检索请稍等",
                    "description": "",
                    "icon": "logo.png"
                }]);
                const items = await getref(txt, mode);
                callbackSetList(items);
            },
            // 子输入框为空时的占位符，默认为字符串"搜索"
            placeholder: "输入references (多条目，只输入title即可，加入作者准确率更高)"
        }
    }
};
