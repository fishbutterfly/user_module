<template>
  <div class="add-user clearfix">
    <el-form :model="addUserForm" ref="addUserForm" :rules="rules" :label-width="labelWidth">
      <el-form-item label="用户名：" prop="username">
        <el-input size="mini" v-model.trim="addUserForm.username" :disabled="row.id ? true : false"
        oninput="value=value.replace(/\s*/g, '')"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="staffName">
        <el-input size="mini" v-model="addUserForm.staffName" oninput="value=value.replace(/\s*/g, '')"></el-input>
      </el-form-item>
      <el-form-item label="部门：" prop="dept.deptCode">
        <DeptCascader @selectDept="selectDept" ref="DeptCascader"></DeptCascader>
      </el-form-item>
      <el-form-item label="工号：" prop="staffNumber">
        <el-input size="mini" v-model="addUserForm.staffNumber" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="卡号：" prop="cardNumber">
        <el-input size="mini" v-model="addUserForm.cardNumber" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
      <el-input size="mini" v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input size="mini" v-model="addUserForm.phone" oninput="value=value.replace(/\s*/g, '')"></el-input>
      </el-form-item>
      <el-form-item label="角色："  v-if="$hasRole('ROLE_SYSTEM_ROLE_MANAGE')">
        <el-checkbox-group v-model="rolesList" @change='checkboxChange'>
          <el-checkbox :label="item.id" v-for="item in roleAll" :key="item.id">{{item.roleName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="头像：">
        <el-upload ref="upload"
        action="string"
        list-type="picture-card"
        :file-list="fileList"
        :auto-upload="false"
        :on-remove="handleRemove"
        :http-request="httpRequest"
        :on-change="handleChange"
        accept=".jpg,.jpeg,.png"
        :class="{ hide: hideUploadEdit }">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" class="el-upload-tip">用于门禁识别，请上传清晰真实正面免冠照片，照片大小低于10MB，支持PNG、JPG、JPEG格式。</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer fr">
      <el-button size="mini" type="warning" v-if="row.id" @click="resetPassword">初始化密码</el-button>
      <el-button size="mini" @click="cancel('addUserForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirm('addUserForm')">确 定</el-button>
    </div>
  </div>
</template>
<script>
import DeptCascader from '@/components/Cascader/Dept.vue'
import Users from '@/services/users.js'
import Role from '@/services/roles.js'
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if (!(/^1(3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/g.test(value))) {
    callback(new Error('请填写正确的手机格式'))
  } else {
    callback()
  }
}
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
    { min: 2, max: 32, message: '用户名长度为2-32位', trigger: ['blur', 'change'] }
  ],
  staffName: [
    { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
    { min: 2, max: 20, message: '姓名长度为2-20位', trigger: 'blur' }
  ],
  'dept.deptCode': [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }],
  staffNumber: [{ max: 32, message: '工号长度应低于32位', trigger: 'blur' }],
  cardNumber: [{ max: 64, message: '卡号长度应低于64位', trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
}
export default {
  data () {
    return {
      rules,
      row: {},
      fileList: [], // 照片上传
      rolesList: [], // 选择的角色列表
      roleAll: [], // 所有角色列表
      labelWidth: '90px',
      hideUploadEdit: false,
      deptSelectedCode: '',
      addUserForm: {
        username: '',
        staffNumber: '',
        staffName: '',
        phone: null,
        dept: {
          deptCode: ''
        },
        cardNumber: '',
        email: '',
        roles: [],
        photo: ''
      }
    }
  },
  components: {
    DeptCascader
  },
  methods: {
    // 部门级联选择的变化
    selectDept (val) {
      this.deptSelectedCode = JSON.parse(JSON.stringify(val))
      this.addUserForm.dept = {
        deptCode: this.deptSelectedCode
      }
    },
    // 自定义上传
    httpRequest (params) {
      this.requestUpload(params.file)
    },
    // 上传本地照片
    requestUpload (val) {
      const formData = new FormData()
      const file = val
      formData.append('file', file)
      Users.upload(formData).then(response => {
        this.addUserForm.photo = response.data
        if (this.addUserForm.photo) {
          this.requestForm()
        }
      }).catch(() => {
        this.handleRemove()
        this.hideUploadEdit = false
        this.$message.error('照片上传失败，请重新上传')
        this.fileList = []
      })
    },
    // 确认按钮
    confirm (formName) {
      // 后台返回部门数据
      if (this.addUserForm.dept.length) {
        this.addUserForm.dept = {
          deptCode: this.addUserForm.dept[this.addUserForm.dept.length - 1]
        }
      }
      // 后台返回手机号数据
      if (!this.addUserForm.phone) {
        this.addUserForm.phone = null
      }
      this.$refs.addUserForm.validate((valid) => {
        if (valid) {
          if (this.fileList[0] && (this.fileList[0].url.indexOf('blob') !== -1)) {
            // 本地上传
            this.requestUpload(this.fileList[0].raw)
          } else {
            // 后台数据再次上传
            if (this.fileList[0]) {
              this.fileList[0].url = this.fileList[0].url.split('/').slice(3).join('')
              this.addUserForm.photo = this.fileList[0].url
            }
            this.requestForm()
          }
        }
      })
    },
    // 移除照片墙
    handleRemove (file, fileList) {
      this.fileList = []
      this.addUserForm.photo = ''
      this.hideUploadEdit = false
    },
    // 限定只上传一张照片
    handleChange (file, fileList) {
      this.fileList = fileList
      this.hideUploadEdit = fileList.length >= 1
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        this.handleRemove(file, fileList)
      }
      return isLt2M
    },
    // 照片上传成功的函数
    requestForm () {
      if (!this.row.id) {
        Users.create(this.addUserForm).then(() => {
          this.$message({
            showClose: true,
            message: '新增用户成功',
            type: 'success'
          })
          this.$emit('cancel', true)
        })
      } else {
        Users.modify(this.row.id, this.addUserForm).then(() => {
          this.$message({
            showClose: true,
            message: '修改用户成功',
            type: 'success'
          })
          this.$emit('cancel', true)
          if (this.row.id !== JSON.parse(sessionStorage.getItem('user')).id) {
            return
          }
          this.$store.dispatch('personal/get', JSON.parse(sessionStorage.getItem('user')).id)
        })
      }
    },
    // 选择角色
    checkboxChange (e) {
      this.addUserForm.roles = []
      e.forEach(item => {
        this.addUserForm.roles.push({
          id: item
        })
      })
    },
    // 取消按钮
    cancel (formName) {
      this.$emit('cancel', false)
    },
    // 重置密码
    resetPassword () {
      Users.resetPassword(this.row.id).then(() => {
        this.$message({
          message: '初始化成功',
          type: 'success'
        })
      })
    },
    // 请求所有的角色
    requestRoles () {
      Role.getList().then(response => {
        this.roleAll = response.data
      })
    },
    // 数据回显
    getData (row) {
      this.row = JSON.parse(JSON.stringify(row))
      Users.get(row.id).then(response => {
        if (response.photo) {
          this.hideUploadEdit = true
          this.fileList = []
          this.fileList.push({
            url: response.photo
          })
          this.addUserForm.photo = response.photo
        }
        this.$nextTick(() => {
          this.$refs.DeptCascader.getData(response.dept)
        })
        response.roles.forEach(item => {
          this.rolesList.push(item.id)
        })
        this.addUserForm = response
        const deptArray = []
        let arr = ''
        for (var i = 0; i < response.dept.id.length; i++) {
          arr += response.dept.id[i]
          if (i % 2 === 1) {
            deptArray.push(arr)
          }
        }
        this.addUserForm.dept = deptArray
      })
    },
    getCascaderData () {
      this.addUserForm.dept.deptCode = this.$refs.DeptCascader.deptNode
      this.requestRoles()
    }
  },
  mounted () {
    this.requestRoles()
  }
}
</script>
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.el-upload-list__item.is-ready > div{
  width: 100%;
  height: 100%;
}
// 缩小行间距
.add-user{
  // max-height: 600px;
  // overflow-y: scroll;
  .el-form-item{
    margin-bottom: 8px;
    .el-form-item__error{
      top: 95%
    }
  }
}
</style>
