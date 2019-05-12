const { post } = require('axios')

module.exports = async (ctx, next) => {
    const { openid, userid } = ctx.request.body
    if (openid && userid) {
        await post('https://study-api.ticknet.hnust.cn/api/schedule',
            { userid })
        .then(function (response) {
            ctx.state = response
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}