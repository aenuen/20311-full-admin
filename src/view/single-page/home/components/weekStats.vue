<template>
  <div ref="dom" />
</template>

<script>
import echarts from 'echarts'
import moment from 'dayjs'
import { off, on } from '@/libs/tools'
import labelOptions from '../setting/item_weekStats_options'

export default {
  name: 'WeekStats',
  props: {
    weekData: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      dom: null,
      dateArr: [],
      seriesArr: [],
      labelOptions,
      option: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initDom () {
      const { init } = echarts
      this.dom = init(this.$refs.dom)
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.dateArr = []
    for (let i = 0; i <= 6; i++) {
      this.dateArr.push(moment().subtract(6 - i, 'day').format('YYYY-MM-DD'))
    }
    Object.keys(this.weekData).forEach((key) => {
      let name = ''
      if (key === 'user') {
        name = '新增用户'
      } else if (key === 'sign') {
        name = '签到总数'
      } else if (key === 'post') {
        name = '发帖总数'
      } else if (key === 'comments') {
        name = '回复总数'
      }
      this.seriesArr.push({
        name: name,
        type: 'bar',
        barGap: 0,
        data: this.weekData[key],
        label: this.labelOptions
      })
    })
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.dateArr
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: this.seriesArr
    }
    this.$nextTick(this.initDom)
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
