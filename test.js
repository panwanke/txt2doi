const main = document.getElementById('3').innerHTML;
// https regex
const reg = /[a-zA-z]+:\/\/[^\s]*/g;
// inline years regex
const reg2 = /(?<=[\D\s]{6,})\s?\(?(\d{4})\)?\s?(?=[\D\s]{6,})/g;
// apa format regex
const reg3 = /(?!\W)([\D\.\s]{4,})(\(?\d{4}\)?)[\.\s,]+?[\d\D]+?(?=[\d\s\.\(\)–\-:,]{6,})/g
// volume regex
const reg4 = /[0-9\s\.\(\)–\-:,]{8,}/g;
// the titile with end of volume
const reg5 = /\D{10,}([0-9\s\.\(\)–\-:,]{8,})/g;
const apaFormat = (str) => {
    const arr = str.match(reg3);
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

if (reg.test(main)) {
    let match = main.split(reg)
    let res = match.map((v) => {
        return apaFormat(v)
    })
    console.log(res.filter(v => v))
} else if (reg2.test(main)) {

    const match = main.replace(reg2, (v, args) => {
        return `$${args}$`
    })
    let res = match.trim().split(reg4)
    res = res.map((v) => {
        return v.replace(/\$(\d{4})\$/g, ` ($1) `)
    })
    console.log(res.filter(v => v))
} else {
    let match = main.match(reg5)
    console.log(match.filter(v => v).map(v => v.trim()))
}
