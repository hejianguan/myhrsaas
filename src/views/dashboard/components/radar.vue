<template>
  <!-- 使用echart图表只需要给一个div即可 不过该div应该高和宽 -->
  <div ref="myDiv" class="radar-chart" />
</template>

<script>
// 引入echart插件  按需加载的
var echarts = require('echarts/lib/echarts')
// 引入 雷达图模块
require('echarts/lib/chart/radar')
export default {
//    进行初始化
  mounted() {
    //   此时dom渲染完成
    this.myChart = echarts.init(this.$refs.myDiv)
    // this.myChart相当于定义了一个实例属性
    this.setOption()
  },
  methods: {
    setOption() {
      this.myChart.setOption({
        title: {
          text: '基础雷达图'
        },
        tooltip: {},
        legend: {
          data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
        },
        radar: {
        // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '考勤', max: 100 },
            { name: '工作产出', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '培训新人', max: 100 },
            { name: '修复bug', max: 100 },
            { name: '新技术', max: 100 }
          ]
        },
        series: [{
          name: '优秀员工 VS 自己',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [100, 90, 80, 95, 99, 100],
              name: '优秀员工'
            },
            {
              value: [50, 30, 20, 10, 20, 20],
              name: '自己'
            }
          ]
        }]
      })
    }
  }
}
</script>

<style>
.radar-chart {
    width: 600px;
    height:  400px;
}
</style>
