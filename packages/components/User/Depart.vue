<template>
  <div class='module-box clearfix'>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="部门名称" prop="name" label-width="90px">
        <el-input placeholder="请输入" size="mini" v-model="ruleForm.name" @keydown.native.enter.prevent=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer fr">
      <el-button size="mini" type="primary" @click="save('ruleForm')">保 存</el-button>
      <el-button size="mini" @click="cancel('ruleForm')">取 消</el-button>
    </div>
  </div>
</template>
<script>
import Departments from '@/services/departments.js'
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 1, max: 20, message: '部门名称长度应低于20个字符', trigger: 'blur' }
  ]
}
export default {
  props: ['departCode', 'isAdd'],
  data () {
    return {
      rules,
      deptCode: '',
      ruleForm: {
        name: '',
        parentCode: ''
      }
    }
  },
  methods: {
    // 保存部门
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isAdd) {
            Departments.modify(this.deptCode, this.ruleForm).then(response => {
              this.confirm(formName, true)
              this.$message({
                message: '修改部门成功',
                type: 'success'
              })
            })
          } else {
            Departments.create(this.ruleForm.name, this.departCode).then(response => {
              this.confirm(formName, true)
              this.$message({
                message: '创建部门成功',
                type: 'success'
              })
            })
          }
        }
      })
    },
    // 取消保存
    cancel (formName) {
      this.confirm(formName, false)
    },
    // 保存 取消的操作
    confirm (formName, val) {
      this.$emit('confirmDepart', val)
    },
    reset () {
      Object.keys(this.ruleForm).map(item => {
        this.ruleForm[item] = ''
      })
      this.deptCode = ''
    },
    // 获取数据
    getDepart (val) {
      this.ruleForm.name = val.label
      this.ruleForm.parentCode = val.pId
      this.deptCode = val.deptCode
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
