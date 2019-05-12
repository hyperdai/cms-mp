<template>
  <div class="page">
    <div class="page__hd">
      <div class="page__title">任务</div>
      <div class="page__desc">请选择任务完成</div>
    </div>
    <div class="page__bd page__bd_spacing">
      <div class="kind-list">
        <div v-for="(item,index) in list" :key="index">
          <div class="kind-list__item">
            <div :id="index" class="weui-flex,kind-list__item-hd" @click="goTask">
              <div class="weui-flex__item">{{item.create_time}}</div>
              <div class="weui-flex__item">{{item.title}}</div>
              <img class="kind-list__img" :src=" '/static/images/icon_nav_nav.png'">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showModal, get } from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
export default {
  data() {
    return {
      userInfo: '',
      list: []
    };
  },

  components: {},

  methods: {
    async getTask() {
        wx.showLoading({
          title: '加载中'
        })
        const res = await get('task/list',{
            openid: this.userInfo.openId
        })
        this.list = res.data
        console.log(res)
        wx.hideLoading()
    },
    goTask(e) {
      let index = e.currentTarget.id
      let { id, type } = this.list[index]
      wx.navigateTo({
        url: '/pages/'+ type +'/main?id=' + id
      })
    },
    async login () {
      const user = wx.getStorageSync('userInfo')
      const self = this
      if (!user) {
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
            self.getTask()
            console.log('登录成功', userInfo)
            wx.hideLoading()
          },
          fail: function (err) {
            console.log('登录失败', err)
          }
        })
      } else {
        this.userInfo = user
        this.getTask()
      }
    }
  },

  onShow () {
    this.login()
  }
};
</script>

<style scoped>
/*!
 * WeUI v1.1.1 (https://github.com/weui/weui-wxss)
 * Copyright 2017 Tencent, Inc.
 * Licensed under the MIT license
 */

.weui-flex {
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.weui-cells {
  margin-top: 0;
  opacity: 0;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.weui-cells:after,
.weui-cells:before {
  display: none;
}

.weui-cells_show {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.weui-cell:before {
  right: 15px;
}

.kind-list__item {
  margin: 10px 0;
  background-color: #fff;
  border-radius: 2px;
  overflow: hidden;
}

.kind-list__item:first-child {
  margin-top: 0;
}

.kind-list__img {
  width: 30px;
  height: 30px;
}

.kind-list__item-hd {
  padding: 20px;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.kind-list__item-hd_show {
  opacity: 0.4;
}

.kind-list__item-bd {
  height: 0;
  overflow: hidden;
}

.kind-list__item-bd_show {
  height: auto;
}
</style>
