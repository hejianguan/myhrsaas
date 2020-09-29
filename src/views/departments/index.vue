<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件   .sync的修饰符表示 会自动从 update:props事件中 自动的将你后面的传的值设置非变量 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      loading: false, // 用来控制显示隐藏进度条
      showDialog: false, // 控制新增弹层的显示或者隐藏
      node: null, // 定义一个node属性 专门来存储当前点击的部门
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { }
    }
  },
  created() {
    this.getDepartments() // 调用获取组织架构接口
  },
  methods: {
    async getDepartments() {
      this.loading = true // 打开弹层
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' } // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.departs = transListToTreeData(result.depts, '')
      this.loading = false // 关闭弹层
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 点击编辑触发的父组件的方法
    editDepts(node) {
      this.showDialog = true // 显示新增组件弹层
      this.node = node // 存储传递过来的node数据
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style>
 .tree-card {
   padding: 30px  140px;
   font-size:14px;
 }
</style>
