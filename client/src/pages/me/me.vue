<template>
  <div>
    <div class="header">
        <div class="userInfo" @click="login">
            <img :src="avatarUrl" alt="">
            <p>{{ nickName }}</p>
        </div>
    </div>
    <div class="menu">
        <navigator class="weui-cell weui-cell_access" url='/pages/editInfo/main'>
            <div class="iconFix" slot="icon">
              <i class="iconfont icon-gerenxinxi"></i>
            </div>
            <div class="weui-cell__bd"> 完善个人信息</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
        <navigator class="weui-cell weui-cell_access" url='/pages/me/main' @click="callMe">
            <div class="iconFix" slot="icon">
              <i class="iconfont icon-fankui"></i>
            </div>
            <div class="weui-cell__bd"> 意见反馈</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
        <navigator class="weui-cell weui-cell_access" url='/pages/ad/main'>
            <div class="iconFix" slot="icon">
              <i class="iconfont .icon-guanggao"></i>
            </div>
            <div class="weui-cell__bd"> 广告</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
        <navigator class="weui-cell weui-cell_access" url='/pages/about/main'>
            <div class="iconFix" slot="icon">
              <i class="iconfont .icon-guanyu"></i>
            </div>
            <div class="weui-cell__bd"> 关于</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator>
    </div>
  </div>
</template>

<script>
import { post, showSuccess, showModal } from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
export default {
  data () {
    return {
      userInfo: {
        avatarUrl: '/static/images/unlogin.png',
        nickName: '点击登录'
      }
    }
  },
  computed: {
    avatarUrl() { return this.userInfo.avatarUrl },
    nickName() { return this.userInfo.nickName }
  },
  methods: {
    callMe() {
      showModal('提示', '联系邮箱：i@hyperdai.com')
    },
    async login () {
      let user = wx.getStorageSync('userInfo')
      const self = this
      if (!user) {
        // showModal('提示', '请授权登录！')
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
            wx.setStorageSync('userInfo', userInfo)
            self.userInfo = userInfo
            console.log('登录成功', userInfo)
            wx.hideLoading()
          },
          fail: function (err) {
            console.log('登录失败', err)
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/oauth/main'
            })
          }
        })
      } else {
        this.userInfo = user
      }
    }
  },
  onShow () {
      this.login()
  }
}
</script>
<style lang="scss">
.header {
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(https://qcloudtest-1254069879.cos.ap-guangzhou.myqcloud.com/jietu/1535637839128-ODgHlC_xJ.jpg);
  background-color: #888;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.userInfo{
  margin-top: 88rpx;
  text-align: center;
  img{
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
  }
  p{
    text-align: center;
    color: #fff;
    font-weight: 400;
  }
}
.menu{
    margin-left: 20rpx;
    .iconFix {
      background-color: #1296db;
      height: 24px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-right: 8px;
    }
    navigator{
        height: 88rpx;
    }
}
</style>