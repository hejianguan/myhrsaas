<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="list" border="">
              <!-- 序号 只要设置type = index 就表示从1开始的序号 -->
              <el-table-column header-align="center" align="center" label="序号" width="80" type="index" />
              <el-table-column header-align="center" align="center" prop="name" label="角色名称" width="240" />
              <el-table-column header-align="center" prop="description" label="描述" />
              <el-table-column header-align="center" align="center" label="操作">
                <!-- slot-scope 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">{{ $t("table.edit") }} </el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">{{ $t("table.delete") }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件  编辑 新增 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个树形权限的弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 放置一个组件 来显示 权限的树形结构 el-tree  el-table -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        default-expand-all=""
        show-checkbox
        node-key="id"
        :default-checked-keys="selectCheck"
        :check-strictly="true"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      loading: false,
      list: [], // 定义list承接获取的角色数据
      page: {
        // 专门来存放分页的数据
        page: 1,
        pagesize: 10,
        total: 0 // 总条数
      },
      // 专门接收企业数据
      formData: {

      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 切换页码事件
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getRoleList() {
      this.loading = true // 打开状态
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('您是否确定要删除该角色吗').then(() => {
        return deleteRole(id)
      }).then(() => {
        this.$message.success('删除成功')
        this.getRoleList()
      })
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          // 这里需要提前考虑 新增的场景
          if (this.roleForm.id) {
            // 编辑场景
            await updateRole(this.roleForm)
          } else {
            // 新增
            await addRole(this.roleForm)
          }
          this.showDialog = false
          this.getRoleList()
          // 关闭弹层
          // 重新拉取数据
          // 你的表单数据同样要清空
          // 你的校验同样要重置
        }
      })
    },
    btnCancel() {
      this.roleForm = {} // 重置数据
      this.$refs.roleForm.resetFields() // 重置表单
      this.showDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 清空选中的节点
      this.showPermDialog = false
    },
    async btnPermOK() {
      // 调用接口
      // getCheckedKeys 方法 得到是 node-key属性的集合
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.showPermDialog = false
    },
    // 点击分配权限
    async  assignPerm(id) {
      this.roleId = id // 记录点击的角色id
      this.getPermissionList() // 获取所有权限的数据
      // 获取某一个角色的权限点
      const { permIds } = await getRoleDetail(id) // permIds就是角色所拥有的权限的点
      this.selectCheck = permIds
      this.showPermDialog = true // 显示分配权限的弹层
    },
    async  getPermissionList() {
      // 调用接口
      this.permData = transListToTreeData(await getPermissionList({ enVisible: '1' }), '0') // 查询所有开启状态的权限点
    }
  }
}
</script>

<style>

</style>
