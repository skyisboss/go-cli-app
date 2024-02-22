const Mock = require('mockjs')
const { Random } = require('mockjs')

module.exports = {
    'POST /api/logs/list': (req, res) => {
        const { page } = req.body
        const data = Mock.mock({
            'rows|5': [
                {
                    'id|+1': 1,
                    type: '@pick([1,2,3])',
                    username: '@first',
                    content: '@ctitle',
                    created_at: '@datetime',
                },
            ],
        })

        return res.json({
            err: 0,
            msg: '',
            data: {
                rows: data.rows,
            },
        })
    },
}
