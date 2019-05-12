<template>
  <div class="page">
    <div class="page__hd">
      <div class="page__title">{{ title }}</div>
      <div class="page__desc">{{ desc }}</div>
    </div>
    <div class="weui-toptips weui-toptips_warn" v-if="showTopTip">{{ topTip }}</div>
    <div class="page__bd">
      <div class="weui-cells">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <div class="weui-uploader">
              <div class="weui-uploader__hd">
                <div class="weui-uploader__title">图片上传</div>
                <div class="weui-uploader__info">{{ length + '/' + max }}</div>
              </div>
              <div class="weui-uploader__bd">
                <div class="weui-uploader__files" id="uploaderFiles">
                  <div v-for="(item ,index) in files" :key="index">
                    <div class="weui-uploader__file">
                      <image class="weui-uploader__img" :src="item" mode="aspectFill" @click="predivImage" :id="item" wx:if="this.files"/>
                      <div class="delete-icon" @click="deleteImg" :id="item"></div>
                    </div>
                  </div>
                </div>
                <div class="weui-uploader__input-box" v-show="length<3">
                  <div class="weui-uploader__input" @click="chooseImage"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="weui-btn" type="primary" @click="submit">提交</button>
    </div>
  </div>
</template>
<script>
import { showModal, get, post } from '@/util'
import config from '../../config'
export default {
    data() {
        return {
            info: {
                id: '',
                title: '',
                desc: ''
            },
            files: [],
            max: 3,
            showTopTip: false,
            topTip: '',
            userInfo: ''
        }
    },
    computed: {
        title() {
            // 设置页面标题
            wx.setNavigationBarTitle({
                title: this.info.title
            })
            return this.info.title
        },
        desc() { return this.info.desc },
        length() { return this.files ? this.files.length : 0 }
    },
    methods: {
        async getTask () {
            // 获取任务数据
            let info = await get('task/list',{
                id: this.info.id,
                openid: this.userInfo.openId
            })
            console.log(info)
            this.info  = info.data[0]
            let logs = info.logs[0].content
            console.log(logs)
            if (logs) {
                this.files = logs.split('  ')
            }
            console.log(this.files)
        },
        async submit() {
            if (!this.files || !this.files.length) {
                this.showTopTips('请上传图片！')
            } else {
                let content = this.files.join('||')
                console.log(content)
                let res = await post('task/jietu',{
                    content,
                    task_id: this.info.id,
                    openid: this.userInfo.openId
                })
                wx.showModal({
                    title: '提示',
                    content: '数据保存成功！',
                    showCancel: false,
                    success: function(res) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        },
        showTopTips (val) {
            this.topTip = val
            this.showTopTip = true
            setTimeout(() => {
                this.showTopTip = false
            }, 1500)
        },
        chooseImage(e) {
            let _this = this;
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    // 返回选定照片的本地文件路径列表
                    console.log('本地图片', res)
                    if (res.tempFiles[0].size > 1024 * 2 * 1024) {
                        showModal('失败', '图片大小不得超过 2 MB')
                        return
                    }
                    let tempFilePaths = res.tempFilePaths
                    // 将本地资源上传到开发者服务器
                    wx.uploadFile({
                        url: config.upUrl, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        success: function(res){
                            console.log(res)
                            if (res.statusCode == 200) {
                                let imgUrl =  JSON.parse(res.data).data.imgUrl
                                // console.log(imgUrl)
                                if (_this.files) {
                                    _this.files = _this.files.concat(imgUrl);
                                } else {
                                    _this.files = imgUrl;
                                }
                            } else {
                                showModal('失败', '上传失败！')
                            }
                        }
                    })
                    console.log(_this.files)
                }
            });
        },
        predivImage(e) {
            console.log(e);
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.files // 需要预览的图片http链接列表
            });
        },
        deleteImg(e) {
            Array.prototype.indexOf = function(val) { // eslint-disable-line
                if(!this) return -1
                for (let i = 0; i < this.length; i++) {
                    if (this[i] === val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function(val) { // eslint-disable-line
                let index = this.indexOf(val);
                if (index > -1) {
                this.splice(index, 1);
                }
            };
            this.files.remove(e.currentTarget.id);
            console.log(this.files.length)
        }
    },
    mounted() {
        this.files = []
        this.info.id = this.$root.$mp.query.id
        // console.log(this.info.id)
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.userInfo = userInfo
            // 获取列表
            this.getTask()
        } else {
            showModal('提示','微信未授权！请登录！');
        }
    },
}
</script>
<style>
.weui-uploader__file {
  position: relative;
}
.weui-uploader__bd {
  overflow: visible;
}
.delete-icon {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  background: #f43530;
  right: 0;
  top: -20rpx;
  border-radius: 40rpx;
  z-index: 5;
}
.delete-icon::before {
  content: '';
  width: 26rpx;
  height: 4rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
</style>
