<template>
  <!-- 通用工具栏结构 -->
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 插槽  -->
      <el-col>
        <div v-if="showBefore" class="before">
          <!-- 左侧可能没有内容 -->
          <!-- 定义左侧的插槽   匿名和具名的-->
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 右侧内容 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
