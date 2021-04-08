<template>
  <div class='module-box'>
    <el-form ref="detailData" :model="detailData" label-width="100px" class='detail-personal clearfix'>
      <el-form-item label="用户名：">{{detailData.username}}</el-form-item>
      <el-form-item label="姓名：">{{detailData.staffName}}</el-form-item>
      <el-form-item label="部门：" v-if="detailData.dept">{{detailData.dept.label}}</el-form-item>
      <el-form-item label="工号：">{{detailData.staffNumber}}</el-form-item>
      <el-form-item label="卡号：">{{detailData.cardNumber}}</el-form-item>
      <el-form-item label="邮箱：">{{detailData.email}}</el-form-item>
      <el-form-item label="联系方式：">{{detailData.phone}}</el-form-item>
      <el-form-item label="角色："  v-if="$hasRole('ROLE_SYSTEM_ROLE_MANAGE')">
        <p v-for="item in detailData.roles" :key="item.id">
          {{item.roleName}}
        </p>
      </el-form-item>
      <el-form-item v-if="detailData.photo" class="photo">
        <img :src="detailData.photo" alt="">
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer fr">
      <el-button @click="close" size="mini">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      detailData: {}
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    getData (val) {
      this.detailData = val
    }
  }
}
</script>
<style lang="scss">
.detail-personal{
  position: relative;
  .photo{
    position: absolute;
    right: 100px;
    top: 0;
    width: 100px;
    height: 100px;
    & .el-form-item__content, img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
