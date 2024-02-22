const Mock = require('mockjs');
const fs = require('fs')
// console.log(Mock.mock('@range(1000,999999)'));


// // console.log(names.join('","'));
// // console.log(Mock.mock('@paragraph(1, 3)'));

let content1 = ''
for (let index = 0; index < 5000; index++) {
    let ids = []
    for (let index = 0; index < 100; index++) {
        ids.push(Mock.mock('@integer(1000,999999)'))
    }
    let names = []
    for (let index = 0; index < 10; index++) {
        names.push(Mock.mock('@name'))
    }
    const Keywords = '"' + names.join('","') + '"'
    content1 += `      {Ids: []int{${ids}}, Keywords: []string{${Keywords}}},\r\n`
}

const content = `package watchMessage
func getList() []ListItem {
    list := []ListItem{
${content1}
    }

    return list
}`
const opt = {
  flag: 'w', // a：追加写入；w：覆盖写入
}

fs.writeFile('world.txt', content, opt, (err) => {
  if (err) {
    console.error(err)
  }
})