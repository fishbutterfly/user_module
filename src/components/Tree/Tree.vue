<template>
  <div class='tree'>
    <el-tree
      ref="lazyTree"
      :data="AllDepart"
      :props="props"
      :load="loadNode"
      :default-expanded-keys="allNodeId"
      node-key="id"
      :indent="8"
      lazy
      @node-click="handleNodeClick"
      :highlight-current="true"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{node, data}">
        <el-tooltip class="item" effect="dark" :content="'部门编号：'+ data.deptCode" placement="bottom-start">
          <span class="treeTit">
            {{ node.label }}  ({{ data.deptCode }})</span>
        </el-tooltip>
        <span v-if="node.level !== 1 && departOpera" class="dept-icon clearfix">
          <span><i class="el-icon-edit" @click.stop="modifyTree(node)"></i></span>
          <span><i class="el-icon-delete" @click.stop="removeTree(node)"></i></span>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import Departments from '@/services/departments.js'
export default {
  props: ['departOpera'],
  data () {
    return {
      AllDepart: [],
      allNodeId: [],
      deptCode: '00',
      props: {
        label: 'label',
        children: '',
        isLeaf: 'leaf',
        deptCode: 'deptCode'
      },
      node_first: {},
      resolve_first: ''
    }
  },
  methods: {
    // 点击部门树
    handleNodeClick (node) {
      this.$emit('handleNodeClick', node)
    },
    // 修改
    modifyTree (node) {
      this.$emit('modifyTree', node)
    },
    // 刪除
    removeTree (node) {
      if (node.data.hasChild === false) {
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Departments.delete(node.data.deptCode).then(() => {
            node.parent.loaded = false
            node.parent.expand()
            this.getCategorylist()
            this.$message({
              showClose: true,
              message: '删除部门成功',
              type: 'success'
            })
            this.$emit('removeTree')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.error('请先删除下级部门')
      }
    },
    // 懒加载下拉点击获取子部门数据
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.getCategorylist(node, resolve)
        this.node_first = node
        this.resolve_first = resolve
      } else if (node.data.hasChild && node.level >= 1) {
        this.getChildrenNode(node, resolve)
      } else {
        resolve([])
      }
    },
    // 获取一级节点
    getCategorylist (node, resolve) {
      Departments.getAll().then(response => {
        response.forEach(item => {
          if (!item.hasChild) {
            item.leaf = true
          }
        })
        this.AllDepart = response
        this.$emit('requestMembers')
        this.allNodeId.push(response[0].id)
        resolve(response)
      })
    },
    // 获取子节点
    getChildrenNode (node, resolve) {
      Departments.getAll(node.data.deptCode).then(response => {
        response.forEach(item => {
          if (!item.hasChild) {
            item.leaf = true
          }
        })
        resolve(response)
      })
    },
    // 刷新树节点
    refresh () {
      this.getCategorylist(this.node_first, this.resolve_first)
    }
  }
}
</script>
<style lang="scss">
.tree{
  & .el-tree-node__content{
    padding-right: 60px;
    position: relative;
    &:hover{
      .dept-icon{
        display: block;
      }
    }
  }
  .custom-tree-node {
    width: 230px;
    .dept-icon{
      display: none;
      position: absolute;
      right: 12px;
      top: 0;
      & span{
        font-size: 16px;
        margin-right: 8px;
      }
    }
  }
}
</style>
