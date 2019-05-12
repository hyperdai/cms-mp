<template>
  <div class="page">
    <div class="page">
      <div class="page__hd">
        <div class="page__title">关于</div>
        <div class="page__desc">1. 班级云助手(原计一小助手)，公测版V1，小程序版</div>
        <div class="page__desc">2. 免费软件，见
            <p class="weui-agree__link" @click="showNotice">《免责声明》</p>
            ，版权归作者本人所有
        </div>
        <div class="page__desc">3. 于2017年9月内测至今，感谢16计科一班全体同学1年来的大力支持</div>
        <div class="page__desc">4. 本软件还有配套管理后台，如查询、导出记录等功能</div>
        <div class="page__desc">5. 如果你也有兴趣，欢迎联系我，邮箱
            <p class="weui-agree__link">i@hyperdai.com</p> 或 QQ
            <p class="weui-agree__link">1070065962</p>
        </div>
        <div class="page__desc">6. 捐赠：支付宝二维码（上），微信二维码（下）
            <div class="qrcode" v-for="(item ,index) in imgUrl" :key="index">
                <img :src="item" :id="index" @click="selectImg"/>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showModal } from '@/util'
export default {
  data() {
      return {
        imgUrl: ["https://i.imgur.com/AztFUF0.jpg","https://i.imgur.com/claLqMC.jpg"],
      }
  },
  methods: {
    showNotice() {
        showModal('免责声明',
`本软件的著作权归软件作者所有。用户可以自由选择是否使用本软件。如果用户完善个人信息、使用本软件，即表明用户信任该软件作者。
作者本人对任何原因在使用本软件时可能对用户自己或他人造成的任何形式的损失和伤害不承担责任。
如果作者因本软件受到伤害，如脱发等，作者有权采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。`)
    },
    selectImg(e) {
        const url = this.imgUrl[e.currentTarget.id]
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: this.imgUrl // 需要预览的图片http链接列表
        })
    }
  },
  onShow () {
    
  }
}

</script>
<style lang="scss">
.qrcode{
    text-align: center;
    img{
        padding-top: 10rpx;
        height: 500rpx;
        width: 500rpx;
    }
}
</style>
