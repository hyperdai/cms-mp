const { mysql } = require('../qcloud')

async function get(ctx, next) {
    const { openid } = ctx.request.query
    if( openid ) {
        // 获得用户信息
        let userInfo = (await mysql('user')
                        .where('open_id', openid)
                        .select())[0]
        if(userInfo) {
            // 获得用户信息中的班级信息
            userInfo['class'] = (await mysql('class')
                            .where('id',userInfo['class_id'])
                            .select())[0]['name']
        }
        // 获得班级列表
        let clases = await mysql('class').select('name')
        clases.forEach((val, index) => {
            clases[index] = val.name
        })
        if(clases.length) {
            ctx.state.data = {
                data: userInfo,
                clases
            }
        }
    }
}

async function post(ctx, next) {
    const { openid, form } = ctx.request.body
    const { name, number, qq, tel } = form
    console.log(openid, form)
    if (openid && form) {
        let ret = await mysql('user').where('open_id', openid).select()
        let classInfo = await mysql('class').where('name', form.class).select('id')
        const class_id = classInfo[0].id
        if(ret.length){
            try{
                await mysql('user')
                        .where('open_id', openid)
                        .update({
                            class_id,
                            name, number, qq, tel
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
        } else {
            try{
                await mysql('user').insert({
                    open_id: openid,
                    class_id,
                    name, number, qq, tel
                })
                ctx.state.data = {
                    msg: 'new success'
                }
            }catch(e){
                ctx.state = {
                    code: -1,
                    data: {
                        msg: '新增失败:'+e.sqlMessage
                    }
                }
            }
        }
    }
}
module.exports = {
    post,
    get
}