<template>
  <div class="page">
      <div class="page__hd">
        <div class="page__title">{{ title }}</div>
        <div class="page__desc">{{ desc }}</div>
      </div>
      <div class="weui-toptips weui-toptips_warn" v-if="showTopTip">{{ topTip }}</div>
      <div class="page__bd page__bd_spacing">
        <div class="weui-cells__title">表单</div>
        <div v-for="(item ,index) in info.extra" :key="index">
            <div class="weui-cells weui-cells_after-title">
                <div class="weui-cell weui-cell_input">
                    <div class="weui-cell__hd">
                        <div class="weui-label">{{ item }}</div>
                    </div>
                    <div class="weui-cell__bd">
                        <input class="weui-input" :placeholder="item" v-model="content[index]"/>
                    </div>
                </div>
            </div>
        </div>

        <button class="weui-btn" type="primary" @click="submit">提交</button>
        <div class="weui-cells__title" v-show="isShowLogs">历史提交</div>
        <div v-for="(item ,index) in form" :key="index">
            <div class="weui-cells weui-cells_after-title">
                <div class="weui-cell weui-cell_access">
                    <div class="weui-cell__bd">{{ item.content }}</div>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import { showModal, get, post } from '@/util'
export default {
    data() {
        return {
            info: {
                id: '',
                title: '',
                desc: '',
                extra: [],
            },
            content: [],
            form: [],
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
        isShowLogs() { return this.form ? true : false }
    },
    methods: {
        async getTask () {
            // 获取任务数据
            let info = await get('task/list',{
                id: this.info.id,
                openid: this.userInfo.openId
            })
            this.info  = info.data[0]
            this.form = info.logs
            console.log(info)
            this.content = new Array(this.info.extra.length)
            this.content.fill('', 0, this.info.extra.length)

        },
        async submit() {
            let content = this.content
            let flag = true
            for (let val in content) {
                if (!content[val]) {
                    flag = false
                }
            }
            if(!flag) {
                this.showTopTips('请完善表单！')
            } else {
                console.log(this.content)
                // let content = []
                // for(let val in this.content){
                //     content.push(this.content[val])
                // }
                content = content.join('||')
                let res = await post('task/form',{
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
        }
    },
    mounted() {
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

</style>
