<template>
  <div class="schedule">
      <div class="weui-flex topInfo">
      <div> {{ user_name }}</div>
      <div class="weui-flex__item">
        <picker class="weui-btn"
          @change="PickerChange"
          :value="now_term_week-1"
          :range="weekArray">
          <div class="weekTitle">
            第{{ now_term_week }}周
            <i class="iconfont .icon-jiantou_down"></i>
          </div>
        </picker>
      </div>
      <div slot="icon" @click="updateSchedule">
        <i class="iconfont .icon-gengxin">更新</i>
      </div>
    </div>
    <div class="weui-flex">
      <div class="weui-flex__item">
        <div class="th">{{ now_month }}<br>月</div>
      </div>
      <div
        class="weui-flex__item"
        v-for="(item, index) in now_date"
        :key="index">
        <div class="th" :style="item.css">周{{ item.week }}<br>{{ item.time }}</div>
      </div>
    </div>
    <div
      class="weui-flex"
      v-for="(item, index) in list"
      :key="index">
      <div class="weui-flex__item">
        <div class="tr">{{ index*2+1 }}</div>
        <div class="tr">{{ index*2+2 }}</div>
      </div>
      <div
        class="weui-flex__item"
        v-for="(item2, index2) in item"
        :key="index2"
        :id="index+'-'+index2"
        @click="getItemInfo">
        <div class="td" :style="item2['bgc']">
          {{ item2['course'] }}
          <div style="font-size: 0.83em;" v-show="item2['course']">
            @{{ item2['classroom'] }}
          </div>
        </div>
      </div>
    </div>
    <div class="noScheduleInfo">{{ noScheduleInfo }}</div>
    <div class="footerInfo">@TickNet工作室 技术支持</div>
  </div>
</template>

<script>
import { showModal, showSuccess, post, get, currentWeek, getWeekSchedule } from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
import moment from "moment"
export default {
  data() {
    return {
      myInfo: {},
      userInfo: '',
      data: [],
      info: {},
      list: [],
      noSchedule: '',
      bgc: ['#ff9e9f','#ffdf62','#c2b4f6','#c2ec5c',
          '#62e48a','#ffc262','#e4e275','#61e7f0',
          '#ff9e9e','#fdc081','#FFBBFF','#7EC0EE',
          '#DEB887','#EE6363','#EEEEE0','#FA8072',
          '#EE82EE','#D15FEE','#CDCD00','#B0E2FF'],
      weekArray: [],
    };
  },
  computed: {
    // 设置信息
    noScheduleInfo () { return this.noSchedule },
    // 用户姓名
    user_name () { return this.myInfo ? this.myInfo.name : '未知' },
    // 当前学期周
    now_term_week () { return this.info.week ?  this.info.week : 1 },
    // 月份信息
    now_month () { return new Date().getMonth() + 1 },
    // 日期信息
    now_date () {
      let res = [{week: '一', time: ''},{week: '二', time: ''},{week: '三', time: ''},
                {week: '四', time: ''},{week: '五', time: ''},{week: '六', time: ''},
                {week: '日', time: ''},]
      let d = new Date()
      let now_day = d.getDate() // 当前月的第几天
      // now_week取当前星期几,根据表达式，星期一now_week为0，星期天为6
      let now_week = (d.getDay() + 6) % 7
      let month_day = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      for(let i = 0; i < now_week; i++) {
        let day = now_day - (now_week - i)
        res[i]['time'] = day + '日'
        let pre_month = new Date().getMonth() ? new Date().getMonth() : 12
        if(day < 1){
          let distance = day
          let pre_month_day = new Date(d.getFullYear(), pre_month, 0).getDate();
          console.log(pre_month_day)
          res[i]['time'] = (pre_month_day + distance) + '日'
          if(day == 0) {
            res[i]['time'] = pre_month + '月'
          }
        }
      }
      for(let i = now_week; i < 7; i++) {
        let day = now_day + (i - now_week)
        res[i]['time'] = day + '日'
        if (day > month_day) {
          let distance = day - month_day
          res[i]['time'] = distance + '日'
          if(distance == 1) {
            let next_month = (new Date().getMonth() != 11 ? new Date().getMonth()+2 : 1)
            res[i]['time'] = next_month + '月'
          }
        }
      }
      res[now_week].css = 'font-size: 0.75em; background-color: #76EEC6;'
      return res
    }
  },
  methods: {
    // 周课表选择器
    PickerChange (e) {
      if (!this.info.week) return
      this.info.week = Number(e.mp.detail.value) + 1
      this.solveWeekSchedule()
    },
    // 课程详细信息
    getItemInfo (e) {
      let id = e.currentTarget.id.split('-')
      let val = this.list[id[0]][id[1]]
      if (val.length === 0) return
      showModal(val.course,'教室:'+val.classroom+'\r\n周数:'+val.time+"\r\n老师:"+val.teacher )
    },
    // 更新课表信息
    updateSchedule () {
      let _this = this
      wx.removeStorage({
        key: 'schedule',
        success: function(res) {
          _this.getList()
        }
      })
    },
    // 处理课表数据
    solveWeekSchedule () {
      let schedule = getWeekSchedule(this.data, this.info.week)
      let courses = []
      this.list = []
      // 判断本周是否有课
      let flag = false
      for (let i = 1; i<=5; i++) {
        for (let j = 1; j<=7; j++) {
          if (schedule[i][j] && schedule[i][j].course) {
            flag = true
            break
          }
        }
      }
      if (flag) {
        this.noSchedule = ''
      } else {
        this.noSchedule = '本周无课 (^_^)'
        console.log('error', schedule)
        return
      }
      // 本周有课则显示本周的课
      for (let j = 1; j<=5; j++) {
        this.list[j-1] = []
        for (let i = 1; i <=7; i++) {
          let { ...val } = schedule[i][j]
          if (!val.course) {
            this.list[j-1][i-1] = []
            continue
          } else {
            this.list[j-1][i-1] = val
          }
          let pos = courses.indexOf(val.course)
          if(pos > -1) { // 在课程中
            this.list[j-1][i-1].bgc = 'background:' + this.bgc[pos];
          } else {
            pos = courses.length
            if(pos >= 20) continue
            courses.push(val.course)
            this.list[j-1][i-1].bgc = 'background:' + this.bgc[pos];
          }
        }
      }
      console.log(this.list)
    },
    async getList () {
      let schedule = wx.getStorageSync('schedule')
      this.info = []
      this.list = []
      this.data = []
      this.noSchedule = ''
      // console.log(schedule)
      let timeDif = 10000000; // 无穷大
      if(schedule && schedule.time) {
        timeDif = moment().valueOf() - schedule.time;
        timeDif = (timeDif / (1000*60*60*24))
      }
      console.log("时间距离（天）：", timeDif)
      if(timeDif < 7) { // 每7天更新一次课表
        this.data = schedule.data
        schedule.info.week = currentWeek(schedule.info.term_begin)
        this.info = schedule.info
        // console.log("当前周数：", this.info.week)
        this.solveWeekSchedule()
      } else { // 本地没有数据即联网获取
        wx.showLoading({
            title: '加载中'
        })
        let _this = this
        let res = await post('schedule', {
            openid: this.userInfo.openId,
            userid: this.myInfo.number
        })
        wx.hideLoading()
        if (res.code == -1) {
          showModal('提示', '教务网网络拥挤，请重试')
          this.noSchedule = '无数据 (>_<)'
          console.log(res)
          return 
        }
        if (res.code == 3) {
          showModal('提示', '课表查询失败，请在「湖南科技大学企业号」->「学习服务」重新绑定教务网账号')
          this.noSchedule = '无数据 (>_<)'
          console.log(res)
          return 
        }
        if (res.code) {
          showModal('提示', '未知错误，请重试；或反馈给开发者。')
          this.noSchedule = '无数据 (>_<)'
          console.log(res)
          return 
        }
        let flag = false
        for (let i = 1; i<=5; i++) {
          for (let j = 1; j<=7; j++) {
            if (res.data[i][j] && res.data[i][j].length) {
              flag = true
              break
            }
          }
        }
        if (!flag) {
          showModal('提示', '无课表数据')
          this.noSchedule = '无数据 (>_<)'
          console.log(res)
          return 
        }
        wx.showToast({
          title: '获取成功',
          icon: 'success',
          duration: 500,
          mask: true
        });
        this.data = res.data
        res.info.week = currentWeek(res.info.term_begin)
        this.info = res.info
        wx.setStorageSync('schedule', { 
          info: this.info,
          data: this.data,
          time: moment().valueOf() // 时间戳
        })
        console.log(res.data)
        this.solveWeekSchedule()
      }
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
            wx.setStorageSync('userInfo', userInfo)
            self.userInfo = userInfo
            self.getMyInfo(userInfo.openId)
          },
          fail: function (err) {
            console.log('登录失败', err)
            // 跳转确认授权登录
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/oauth/main'
            })
          }
        })
      } else {
        this.userInfo = user
        let myInfo = wx.getStorageSync('myInfo')
        if (myInfo) {
          this.myInfo = myInfo
          this.getList()
        }
        else this.getMyInfo(user.openId)
      }
    },
    async getMyInfo (openid) {
      const myInfo = (await get('myinfo',{ openid })).data
      wx.hideLoading()
      if (!myInfo) {
        // 没有获得个人学号数据，跳转完善信息
        // showModal('提示','检测到您没有完善个人信息！')
        wx.navigateTo({
          url: '/pages/editInfo/main'
        })
      } else {
        // 本地存储
        wx.setStorageSync('myInfo', myInfo)
        console.log('登录成功', myInfo)
        this.myInfo = myInfo
        this.getList()
      }
    },

  },
  onShow () {
    this.login()
    for(let i = 1; i <= 20; i++)
      this.weekArray.push('第'+i+'周')
  }
};
</script>

<style lang="scss">
.schedule {
  padding-right: 0.5em;
  background-color: #f3f8f8;
}
.th {
  text-align: center;
  color: #6d8498;
  height: 3.0em;
  font-size: 0.7em;
}
.tr {
  text-align: center;
  color: #698196;
  height: 3.8em;
  line-height: 3.8em;
}
.td {
  margin: 0.2em;
  height: 10.5em;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 0.7em;
  color:#fff;
  border-radius: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
}
.weekTitle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.topInfo {
  color: #6d8498;
  padding: 0.1em 0.5em 0.2em;
}
.noScheduleInfo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  padding: 0.7em 0 0.5em 0;
  text-align: center;
  color: #698196;
}
.footerInfo{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  padding: 0.5em 0 0.5em 0;
  text-align: center;
}
</style>
