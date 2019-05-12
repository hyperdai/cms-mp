const { mysql } = require('../qcloud')

async function list(ctx, next) {
    const { id, openid } = ctx.request.query
    if( openid ) {
        const userInfo = await mysql('user').where('open_id', openid).select()
        if(!userInfo.length) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '用户信息不完善'
                }
            }
        }
        const user_id = userInfo[0]['uid']
        const user_class = userInfo[0]['class_id']
        if( user_id && user_class ) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '用户信息不完善'
                }
            }
        }
        let list = []
        let logs = []
        // 查询数据库
        if (id) {
            // 查询任务表单
            list = await mysql('task').where('id', id).select()
            // 查询历史提交数据库
            logs = await mysql('task_submit')
                            .where('task_id',id)
                            .where('user_id',user_id)
                            .orderBy('id', 'desc')
                            .select()
        } else {
            // 查询任务清单
            list = await mysql('task')
                            .where('class_id', user_class)
                            .orderBy('id', 'desc').select()
        }
        // 返回任务列表处理
        list.forEach((obj, index) => {
            for(let val in obj) {
                if(val === 'create_time') {
                    // console.log(list[index][val])
                    let dt = new Date(list[index][val])
                    let date = [
                        [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
                        [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':')
                      ].join(' ').replace(/(?=\b\d\b)/g, '0'); // 正则补零
                    list[index][val] = date
                } else if (val === 'extra') {
                    list[index][val] = obj[val].split('||')
                }
            }
        })
        // 提交记录处理
        if (logs.length) {
            logs.forEach((obj, index) => {
                for(let val in obj) {
                    if (val === 'content') {
                        logs[index][val]= obj[val].replace(/\|/g,' ')
                    }
                }
            })
        }
        ctx.state = {
            code: 0,
            data: {
                data: list,
                logs
            }
        }
    }
}

async function form(ctx, next) {
    const { openid, task_id, content } = ctx.request.body
    if( openid && task_id && content) {
        const userInfo = await mysql('user').select().where('open_id', openid)
        if(!userInfo.length) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '用户信息不完善:'
                }
            }
        }
        let user_id = userInfo[0]['uid']
        let class_id = userInfo[0]['class_id']
        // console.log(task_id, user_id, content )
        try{
            await mysql('task_submit').insert({
                task_id,
                user_id,
                class_id,
                content
            })
            ctx.state.data = {
                msg: 'success'
            }
        }catch(e){
            ctx.state = {
                code: -1,
                data: {
                    msg: '提交失败:'+e.sqlMessage
                }
            }
        }
    }
}

async function jietu(ctx, next) {
    const { openid, task_id, content } = ctx.request.body
    if( openid && task_id && content) {
        const userInfo = await mysql('user').select().where('open_id', openid)
        if(!userInfo.length) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '用户信息不完善:'
                }
            }
        }
        let user_id = userInfo[0]['uid']
        let class_id = userInfo[0]['class_id']
        // console.log(task_id, user_id, content )
        const submitInfo = await mysql('task_submit')
                                    .where('user_id', user_id)
                                    .where('task_id', task_id)
                                    .select()
        if(submitInfo.length) { // 修改
            try{
                await mysql('task_submit')
                        .where('user_id', user_id)
                        .where('task_id', task_id)
                        .update({
                            content
                        })
                ctx.state.data = {
                    msg: 'edit success'
                }
            }catch(e){
                ctx.state = {
                    code: -1,
                    data: {
                        msg: '保存失败:'+e.sqlMessage
                    }
                }
            }
        } else { // 新增
            try{
                await mysql('task_submit').insert({
                    task_id,
                    user_id,
                    class_id,
                    content
                })
                ctx.state.data = {
                    msg: 'success'
                }
            }catch(e){
                ctx.state = {
                    code: -1,
                    data: {
                        msg: '提交失败:'+e.sqlMessage
                    }
                }
            }
        }
    }
}

module.exports = {
    list,
    form,
    jietu
}