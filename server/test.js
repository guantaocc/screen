

var str = "123456789"

let regxStr = str.replace(/(?!^)(?=(\d{3})+$)/g, ',')

// console.log(regxStr);

var phone = "18379836654"

let ref = phone.replace(/(?=(\d{4})+$)/g, '-')

// console.log(ref)

let formatMobile = (str) => {
  return str.replace(/(?<=\d{3})\d+/, ($0) => {
    // console.log($0);
    return '-' + $0
  }).replace(/(?<=[\d-]{8})\d{1,4}/, ($0) => {
    console.log($0);
    return '-' + $0
  })
}

let formatPassword = (str) => {
  let reg = /((?=.*\d)((?=.*[a-z])|(?=.*[A-Z])))|(?=.*[a-z])(?=.*[A-Z])^[a-zA-Z\d]{6,12}$/
  return reg.test(str)
}

let formatRandom = (str) => {
  // 横向匹配数量
  // return str.match(/ab{2,5}c/g)
  // 纵向匹配字符数组
  return str.match(/a[be][be]c/g)
  // 贪婪模式量词 {m, n}? +? ?? *?
  // (g|c) 惰性匹配
}

let formatId = (str) => {
  return str.match(/id="[^"]*"/)
}

let formatTime = (str) => {
  return str.match(/^([01]\d|2[0-3]):[0-5]\d$/)
}

// 分组引用替换和反向引用
let formatGroup = (group) => {
  return group.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3")
}

const titleize = (str) => {
  return str.toLowerCase().replace(/(?:^|\s)(\w)/g, ($0, $1) => {
    console.log($0, $1);
    return $0.toUpperCase()
  })
}

const formatHTMLStr = (str) => {
  return str.matchAll(/<([^>]+)>(.*?)<\/\1>/g)
}

console.log(formatId('<div id="container" class="main"></div>'));
console.log(formatTime("23:59"));
console.log(formatGroup("2021-11-15"));
// 量词分组为最后一次匹配
console.log(/(\d)+ \1/.test('12345 5'));
console.log(titleize("my name is size"));


let matches = formatHTMLStr("<title>regular expression</title><p>laoyao bye bye</p>")
for (const match of matches) {
  console.log(match);
}
