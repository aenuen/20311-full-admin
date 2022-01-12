<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12" :md="8" :lg="4"
        v-for="(info, index) in infoCardData" :key="`info-${index}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <info-card
          shadow
          :color="info.color"
          :icon="info.icon"
          :icon-size="36"
          :key="timer1"
        >
          <count-to :end="info.count" count-class="count-style" />
          <p>{{ info.title }}</p>
        </info-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie
            text="发帖统计"
            tip-name="统计内容"
            style="height: 300px;"
            :value="pieData"
            :key="timer2"
          />
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar
            style="height: 300px;"
            text="最近6个月的每月发帖统计"
            :value="barData"
            :key="timer3"
          />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow class="w100">
        <WeekStats
          style="height: 310px;"
          :weekData="weekData"
          :key="timer4"
        />
      </Card>
    </Row>
  </div>
</template>

<script>
import infoCardData from './setting/item_home_infoCardData'
import pieData from './setting/item_home_pieData'
import InfoCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartBar, ChartPie } from '_c/charts'
import WeekStats from './components/weekStats.vue'
import { userDispatch } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'home',
  components: {
    InfoCard,
    CountTo,
    ChartPie,
    ChartBar,
    WeekStats
  },
  data () {
    return {
      timer1: '',
      timer2: '',
      timer3: '',
      timer4: '',
      infoCardData,
      pieData,
      barData: {},
      weekData: {}
    }
  },
  mounted () {
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      userDispatch.use('statistics').then(({
        code,
        data
      }) => {
        if (code === 200) {
          // 1.顶部分类统计
          const { infoCardData } = data
          Object.keys(this.infoCardData).forEach((key) => {
            this.infoCardData[key] = {
              ...this.infoCardData[key],
              count: infoCardData[key]
            }
            this.timer1 = new Date().getTime()
          })
          // 左侧圆盘统计
          const { pieData } = data
          const {
            ask,
            share,
            discuss,
            advise
          } = pieData
          if (pieData) {
            const arr = []
            arr.push({
              name: '提问',
              value: ask || 0
            })
            arr.push({
              name: '分享',
              value: share || 0
            })
            arr.push({
              name: '讨论',
              value: discuss || 0
            })
            arr.push({
              name: '建议',
              value: advise || 0
            })
            this.pieData = arr
            this.timer2 = new Date().getTime()
          }
          // 右侧最近6个月的每月发帖统计
          const { monthData } = data
          if (monthData) {
            const result = {}
            // 补足未有月份
            for (let i = 0; i <= 5; i++) {
              const key = dayjs().subtract(5 - i, 'M').format('YYYY-MM')
              result[key] = monthData[key] || 0
            }
            this.barData = result
            this.timer3 = new Date().getTime()
          }
          // 最近7天的统计
          const { weekData } = data
          if (weekData) {
            this.weekData = { ...weekData }
            this.timer4 = new Date().getTime()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}

.w100 {
  width: 100%;
}
</style>
