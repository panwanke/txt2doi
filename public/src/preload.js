
const requests = require("./request");
// const { clipboard } = require("electron");

async function getref(text, mode) {
    let res = await requests(text, mode);
    // console.log(res);
    res = res.filter(str => { return !!str; });
    const items = [];
    // 查找重复
    let titles = new Set(res.map(item => item.title[0]));
    titles = [...titles];
    // console.log(titles);
    for (let title of titles) {
        // console.log("成果获取", title);
        const item = res.find(item => item.title[0] === title);
        if (titles.includes(item.title[0])) { // 去除重复item
            // console.log(item, ("container-title" in item) ? item["container-title"] : " ");
            const authors = item.author ? item.author.map(v => v["family"]).join(", ") : "";
            const journal = ("container-title" in item) ? item["container-title"] : " "
            items.push({
                "title": item.title[0],
                "description": `${authors}  ${journal}  ${item.DOI}`,
                "icon": "logo.png",
                "url": item.URL,
                "DOI": item.DOI,
                "mode": 0
            })
        }
    };
    // console.log("获取的结果", items);

    // 复制dois
    let dois = items.map((item) => item.DOI);
    if (dois.length > 0) {
        utools.showNotification(`成功复制${dois.length}条doi`);
    }
    utools.copyText(dois.join("\n"));

    return items;
}

let getdois = {
    mode: "list",
    args: {
        // 进入插件时调用
        enter: async (action, callbackSetList) => {
            callbackSetList([]);
            const txt = await action.payload;
            // console.log(txt.split(/\n|\r/g));

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

        //     callbackSetList([
        //     ]);
        // },
        // 用户选择列表中某个条目时被调用
        select: async (action, itemData, callbackSetList) => {
            const mode = itemData.mode;
            const txt = itemData.txt;
            // console.log(mode);
            // console.log(txt);

            callbackSetList([{
                "title": "正在检索请稍等",
                "description": "",
                "icon": "logo.png"
            }]);
            // console.log(itemData.description.split(/\n|\r/g));
            const items = await getref(txt, mode);
            callbackSetList(items);
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
