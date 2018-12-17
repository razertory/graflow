var express = require('express');
var router = express.Router();

const Shcema = require('../src/schema-comparator/graphql/Schema')
const Result = require('../src/schema-comparator/result');

router.post('/', function(req, res) {
    const logHead = `[${Math.floor(Math.random()*10000)+Math.floor(Math.random()*10)*10000}] ${req.method} /compare`;
    //logger --start
    console.info(logHead, "收到请求");
    console.info(logHead, "请求参数：", JSON.stringify(req.body));

    let { oldSchema, newSchema } = req.body;
    let result = {};

    try {
        let old_schema = new Shcema(oldSchema);
        let new_schema = new Shcema(newSchema);
        let changes = new_schema.diff(old_schema);
        let data = new Result(changes).getResult();
        result = {
            code: 0,
            data: data,
            msg: '操作成功！'
        };
    } catch (e) {
        result = { code: 1000, msg: '服务器异常' };
        //logger --error
        console.error(logHead, e);
    }

    res.json(result);
    //logger --end
    console.info(logHead, "响应参数：", JSON.stringify(result));
    console.info(logHead, "请求已关闭\n");
});

module.exports = router;