<template>
  <div>
    <!-- 放置年和月 -->
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="changeDate">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px; margin-left: 10px" @change="changeDate">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <!-- 插槽 -->
      <template slot="dateCell" slot-scope="{date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>

      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    // 2020-09-02
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  //   定义一个传入的初始时间
  props: {
    //   设置日历的起始日期
    startDate: {
      type: Date,
      default: () => new Date() // 给默认时间为当前的时间  要求props中的对象的默认值必须用函数返回
    }
  },
  data() {
    //   需要在data中定义当前年的变量
    return {
      currentYear: null,
      currentMonth: null,
      currentDate: null, // 指定当前的时间
      yearList: [] // 年的列表  是根据 当前年 前后各加5年
    }
  },
  created() {
    //  需要知道 当前年是怎么来的   new Date()
    // 要根据startDate这个变量来决定哪个是当前年
    this.currentYear = this.startDate.getFullYear() // 当前年
    // 当前月 也是根据startDate来设定
    this.currentMonth = this.startDate.getMonth() + 1
    // 需要给yearList定义一个数据  是在当前年的基础上 前加5年 后加五年
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
    this.changeDate()
  },
  methods: {
    //   月份改变 年份改变
    changeDate() {
      // 将最新的年月转化 赋值给时间
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>
<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td, /deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
