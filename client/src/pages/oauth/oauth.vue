<template>
  <div>
    <!-- 如果只是展示用户头像昵称，可以使用 <open-data /> 组件 -->
    <div class="userInfo" @click="login">
        <open-data type="userAvatarUrl" :onerror="defaultlogo"></open-data>
        <!-- <div><img :src="avatarUrl" alt=""></div> -->
        <open-data type="userNickName"></open-data>
    </div>
    <div class="tips">
      <div>请点击按钮验证身份</div>
    </div>
    <!-- 需要使用 button 来授权登录 -->
    <button v-if="canIUse" open-type="getUserInfo" lang="zh_CN" @click="doLogin">安全身份验证</button>
    <div v-else>请升级微信版本</div>
  </div>
</template>

<script>
import { post, showSuccess, showModal } from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
export default {
  data () {
    return {
      defaultlogo: 'this.onerror=null;this.src="/static/images/unlogin.png"',
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  computed: {
    
  },
  methods: {
    async doLogin (e) {
      console.log(e)
      wx.showLoading({
        title: '加载中'
      })
      // 设置登录地址
      qcloud.setLoginUrl(config.loginUrl)
      // 登录
      await qcloud.login({
        success: function (userInfo) {
          // showSuccess('登录成功')
          // 本地存储
          console.log('登录成功', userInfo)
          wx.setStorageSync('userInfo', userInfo)
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/me/main'
          })
        },
        fail: function (err) {
          console.log('登录失败', err)
        }
      })
      wx.hideLoading()
    }
  },
  onShow () {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              wx.switchTab({
                url: '/pages/me/main'
              })
            }
          })
        }
      }
    })
  }
}
</script>
<style lang="scss">
.tips{
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  text-align: center;
  color: #b3a6a0;
}
.userInfo{
  margin-top: 10rpx;
  text-align: center;
  :first-child{
    border-radius: 50%;
  }
  :last-child{
    text-align: center;
    font-weight: 400;
    color: rgb(0, 189, 189)
  }
}
</style>