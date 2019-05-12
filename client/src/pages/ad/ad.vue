<template>
  <div class="page">
    <div class="page">
      <div class="page__hd">
        <div class="page__title">广告</div>
        <div class="page__desc">1. 感谢TickNet工作室的技术支持</div>
        <div class="page__desc">2. 欢迎大家关注TickNet工作室更多产品</div>
        <div class="page__desc">3. 扫描微信二维码关注「湖南科技服务号」
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
        imgUrl: ["https://imyour.vip/static/qrcode.jpg"],
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
