<template>
  <div class="user main-background">
    <el-container>
      <el-header class="bgc">
        <div class="user-manger-nav left">
          <p>部门列表</p>
          <i class="el-icon-circle-plus-outline" @click="addDepart" v-if="!sync"></i>
        </div>
        <div class="user-manger-nav right">用户列表</div>
      </el-header>
      <el-container class="list-show">
        <el-aside class="list-container left">
          <Tree :departOpera="departOpera" :sync="sync"
          @modifyTree="modifyTree"
          @requestMembers="requestMembers" @handleNodeClick="handleNodeClick" @removeTree="removeTree" ref="tree"></Tree>
        </el-aside>
        <el-main class="list-container right">
          <el-form :model="search" class="clearfix" @submit.native.prevent="queryMsg" :inline="true">
            <el-form-item label="查询" label-width="50px">
              <el-input size="mini" v-model="search.name" placeholder="请输入用户名、姓名" @keyup.enter.native="queryMsg" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="queryMsg">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button type="primary" size="mini" @click="syncUser" v-if="sync">同步部门用户信息</el-button>
              <el-button type="primary" size="mini" @click="addUser" v-if="!sync">+ 新增</el-button>
            </el-form-item>
          </el-form>
          <Table class="table" :options="options" :operates="sync ? syncOperates : operates" :columns="columns"
          @sizeChange="sizeChange" @handleCurrentChange="handleCurrentChange" ref="table"></Table>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      width="500px"
      @close="confirmDepart"
      :title="departmentTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible.dialogDepartVisible">
      <Depart :isAdd="isAdd" :departCode="deptCode" @confirmDepart="confirmDepart" ref="depart"></Depart>
    </el-dialog>
    <el-dialog
      width="550px"
      :title="title"
      @close="closeDialog"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible.dialogAddVisible">
      <Add @cancel="cancleBtn" ref="add"></Add>
    </el-dialog>
    <el-dialog
      title="用户详情"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible.dialogDetailVisible">
      <Detail @close="closeDetail" ref="detail"></Detail>
    </el-dialog>
  </div>
</template>
<script>
import Tree from '@/components/Tree/Tree.vue'
import Table from '@/components/Table/ShtdTable.vue'
import Depart from './Depart.vue'
import Add from './Add.vue'
import Detail from './Detail.vue'
import Departments from '@/services/departments.js'
import Users from '@/services/users.js'
import syncService from '@/services/sync.js'
import { mapState } from 'vuex'
const columns = [
  { prop: 'username', label: '用户名' },
  { prop: 'staffName', label: '姓名' },
  { prop: 'phone', label: '联系方式' },
  { prop: 'deptName', label: '部门' }
]
const departOpera = {
  operation: true
}
export default {
  data () {
    return {
      isAdd: true,
      title: '',
      row: {}, // add数据行信息
      departOpera,
      deptCode: '00', // 部门tree的id,
      columns: columns, // table数据
      departmentTitle: '',
      options: {
        order: true,
        select: false,
        pageTotal: 0,
        pageable: {
          size: 10,
          page: 0
        }
      }, // table数据
      search: {
        name: ''
      },
      dialogVisible: {
        dialogAddVisible: false, // 增加修改人员
        dialogDepartVisible: false, // 增加修改部门
        dialogDetailVisible: false // 人员详情
      },
      operates: [
        {
          label: '',
          type: 'primary',
          icon: 'el-icon-edit',
          circle: true,
          plain: true,
          method: (index, row) => {
            this.modifyPeople(index, row)
          }
        },
        {
          label: '',
          type: 'danger',
          icon: 'el-icon-delete',
          circle: true,
          plain: true,
          method: (index, row) => {
            this.deletePeople(index, row)
          }
        },
        {
          label: '',
          type: 'primary',
          icon: 'el-icon-user',
          circle: true,
          plain: true,
          method: (index, row) => {
            this.detailPeople(index, row)
          }
        }
      ],
      syncOperates: [
        {
          label: '',
          type: 'primary',
          icon: 'el-icon-user',
          circle: true,
          plain: true,
          method: (index, row) => {
            this.detailPeople(index, row)
          }
        }
      ]
    }
  },
  components: {
    Tree,
    Table,
    Depart,
    Add,
    Detail
  },
  mounted () {
    this.$store.dispatch('sync/getType')
  },
  methods: {
    // 增加部门按钮
    addDepart () {
      this.isAdd = true
      this.departmentTitle = '新增部门'
      this.dialogVisible.dialogDepartVisible = this.isAdd = true
    },
    // 保存 取消部门
    confirmDepart (val) {
      this.dialogVisible.dialogDepartVisible = false
      this.$refs.depart.reset()
      if (val) {
        this.$refs.tree.getCategorylist()
      }
    },
    // 同步用户
    syncUser () {
      syncService.get('DEPARTMENT')
        .then(response => {
          this.$message({
            showClose: true,
            message: '同步部门用户信息成功！',
            type: 'success'
          })
          this.options.pageable.page === 0 ? this.requestMembers() : this.options.pageable.page = 0
        })
    },
    // 修改部门按钮
    modifyTree (node) {
      this.isAdd = false
      this.departmentTitle = '修改部门'
      this.dialogVisible.dialogDepartVisible = true
      this.$nextTick(() => {
        this.$refs.depart.getDepart(node.data)
      })
    },
    // 删除部门parentCode重置默认增加到总部门
    removeTree () {
      this.deptCode = '00'
    },
    // 点击部门树操作
    handleNodeClick (node) {
      this.deptCode = JSON.parse(JSON.stringify(node.deptCode))
      this.options.pageable.page = 0
      this.requestMembers()
    },
    // 请求部门下的用户
    requestMembers () {
      Departments.getMembers(this.deptCode, this.options.pageable, this.search.name)
        .then(response => {
          this.$refs.table.configPage(response)
        })
    },
    // 新增用户
    addUser () {
      this.row = {}
      this.title = '新增用户'
      this.dialogVisible.dialogAddVisible = true
      this.$nextTick(() => {
        this.$refs.add.getCascaderData()
      })
    },
    // 新增、修改取消
    cancleBtn (val) {
      this.dialogVisible.dialogAddVisible = false
      if (val) {
        this.requestMembers()
      }
    },
    // 删除用户
    deletePeople (index, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Users.delete(row.id).then(() => {
          this.requestMembers()
          this.$message({
            showClose: true,
            message: '删除用户成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改用户信息
    modifyPeople (index, row) {
      this.row = row
      this.dialogVisible.dialogAddVisible = true
      this.title = '修改用户信息'
      this.$nextTick(() => {
        this.$refs.add.getData(row)
      })
    },
    // 查询用户信息
    queryMsg () {
      this.requestMembers()
    },
    // 打开用户详情页
    detailPeople (index, row) {
      Users.get(row.id).then(response => {
        this.$nextTick(() => {
          this.$refs.detail.getData(response)
        })
      })
      this.dialogVisible.dialogDetailVisible = true
    },
    // 关闭添加的dialog
    closeDialog () {
      this.dialogVisible.dialogAddVisible = false
    },
    closeDetail () {
      this.dialogVisible.dialogDetailVisible = false
    },
    // 翻页
    handleCurrentChange (number) {
      this.options.pageable.page = number
      this.requestMembers()
    },
    // 页码修改
    sizeChange (number) {
      this.options.pageable.size = number
      this.requestMembers()
    }
  },
  computed: {
    ...mapState({
      sync () {
        return this.$store.state.sync.sync
      }
    })
  },
  watch: {
    '$store.state.personal.personalData' (newValue) {
      this.requestMembers()
    }
  }
}
</script>
<style lang="scss">
.user.main-background{
  height: calc(100vh - 51px);
  overflow-y: hidden;
  & .el-container .el-header{
    height:50px !important;
    margin-bottom:12px;
    padding:0;
  }
}
.user .user-manger-nav{
  text-align:center;
  line-height:50px;
  font-size:14px;
  &.left{
    float:left;
    width:300px;
    position: relative;
    & i{
      position: absolute;
      right: 0;
      bottom: 0;
      font-size:16px;
      line-height:50px;
      transition: 0.1s font-size;
      &:hover{
        font-size:20px;
      }
    }
  }
}
.user .list-show{
  padding-left:15px;
  .list-container{
    margin-right: 18px;
    &.left{
      overflow-y: auto;
      max-height: calc(100vh - 245px);
      border:1px solid #EEEEEE;
    }
    .el-table{
      overflow-y: auto;
      max-height: calc(100vh - 320px);
    }
  }
}
</style>
