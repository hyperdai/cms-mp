/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// --- 个人信息编写接口 --- //
// GET获取个人信息
router.get('/myinfo', controllers.myinfo.get)
// POST编辑个人信息
router.post('/myinfo', controllers.myinfo.post)

// --- 任务接口 --- //
// 任务列表
router.get('/task/list', controllers.task.list)
// POST提交表单
router.post('/task/form', controllers.task.form)
// POST提交截图
router.post('/task/jietu', controllers.task.jietu)

// --- 课程表接口 --- //
// POST获取课程表
router.post('/schedule', controllers.schedule)
module.exports = router
