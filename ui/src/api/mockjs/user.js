const Mock = require('mockjs')
const { Random } = require('mockjs')


module.exports = {
  'POST /api/system/login': (req, res) => {
    const { page } = req.body

    return res.json({
      err: 0,
      msg: '',
      data: {
        username: 'admin',
        email: 'admin@dev.com',
        token: '123',
        authcode: 'https://chart.googleapis.com/chart?cht=qr&chs=380&chl=otpauth://totp/贝壳支付系统:admin?secret=GVKWYEQPGWHQPI265U62R5WJTJXFFS3W&issuer=贝壳支付系统',
      },
    })
  },

  'POST /api/user': (req, res) => {
    const { page } = req.body
    console.log(page)
    const data = Mock.mock({
      'rows|20': [
        {
          'id|+1': 1,
          username: '@ctitle',
          userimg: "@image('40x40')",
          phone: '63977****259',
          email: '@email',
          orders: '@integer(60, 1000)',
          amounts: '@integer(60, 1000)',
          status: '@pick([0,1])',
        },
      ],
    })

    return res.json({
      err: 0,
      msg: '',
      data: {
        total: 20,
        size: 20,
        page: page,
        rows: data.rows,
      },
    })
  },

  'POST /api/system/editPwd': (req, res) => {
    const { page } = req.body

    return res.json({
      err: 0,
      msg: '',
      data: {},
    })
  },
}