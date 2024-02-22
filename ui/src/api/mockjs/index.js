const delay = require('mocker-api/lib/delay');
// const secured = require('./secured.mock');
// import Mock from 'mockjs';
const Mock = require('mockjs');
// 是否禁用代理

const home = require('./home');
const user = require('./user');
const logs = require('./logs');

const proxy = {
  ...home,
  ...user,
  ...logs,
  
  'POST /api/upload': (req, res) => {
    const {page} = req.body
    setTimeout(() => {
      return res.json({
        err: 0,
        msg: '',
        data: {
          uid: '2',
          name: 'image.png',
          status: 'error',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      })
    }, 5000);
  },
}
module.exports = (delay(proxy, Mock.Random.integer(100, 600)));
