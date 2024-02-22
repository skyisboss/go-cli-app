const Mock = require('mockjs')
const Random = require('mockjs')

module.exports = {
  'POST /api/home': (req, res) => {
    const { page } = req.body
    const data = Mock.mock({
      'rows|20': [
        {
          'id|+1': 1,
          account: '+639776860260',
          username: "username",
          nickname: "nickname",
          logined: '@pick(["0","1"])',
        },
      ],
    })
    const ranking = Mock.mock({
      'rows|5': [
        {
          'id|+1': 1,
          'ranking|+1': 1,
          title: '@ctitle',
          count_user: '@integer(60, 1000)',
          count_topic: '@integer(60, 1000)',
        },
      ],
    })
    const keyworld =Mock.mock({
      'rows|6': [
        {
          'id|+1': 1,
          'ranking|+1': 1,
          title: '@ctitle',
          count: '@integer(60, 1000)',
          position: '@pick(["up","down"])',
        },
      ],
    })
    const color = ["cyan","orange","grape","green","blue"]
    const category =Mock.mock({
      'rows|5': [
        {
          'id|+1': 1,
          tooltip: '@ctitle',
          value: '',
          color: '',
        },
      ],
    })
    category.rows.map((x,i) => {
      x.color = color[i]
      x.value = 20
      return x
    })
    

    return res.json({
      err: 0,
      msg: '',
      data: {
        client: {
          user: Mock.mock('@integer(60, 1000)'),
          group: Mock.mock('@integer(60, 1000)'),
          channel: Mock.mock('@integer(60, 1000)'),
          account: Mock.mock("@shuffle(['a', 'e', 'i', 'o', 'u', 'i', 'o', 'u'])"),
        },
        spider: {
          status1: Mock.mock('@integer(20, 100)'),
          status2: Mock.mock('@integer(20, 100)'),
          status3: Mock.mock('@integer(20, 100)'),
        },
        send: {
          status1: Mock.mock('@integer(20, 100)'),
          status2: Mock.mock('@integer(20, 100)'),
          status3: Mock.mock('@integer(20, 100)'),
        },
        ranking: ranking.rows,
        keyworld: keyworld.rows,
        category: category.rows,
      },
    })
  },

  'POST /api/system/notify': (req, res) => {
    const { page } = req.body
     const data =Mock.mock({
      'rows|5': [
        {
          'id|+1': 1,
          type: '@pick([1,2,3])',
          desc: '@ctitle',
          unread: '@pick([true,false])',
          created_at: Date.now(),
        },
      ],
    })

    return res.json({
      err: 0,
      msg: '',
      data: {
        unread_count: 999,
        rows: data.rows
      },
    })
  },
  'POST /api/system/notify/update': (req, res) => {
    const { page } = req.body

    return res.json({
      err: 0,
      msg: '',
      data: {},
    })
  },
}
