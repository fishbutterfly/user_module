<template>
  <div class='zone'>
    <el-tree
      ref="lazyTree"
      :data="treeData"
      :props="props"
      :load="loadNode"
      :indent="8"
      lazy
      node-key="id"
      :default-expanded-keys="allNodeId"
      @node-click="handleNodeClick"
      :highlight-current="true"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{node}">
        <span class="treeTit">
          {{ node.label}}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import Dictionary from '@/services/dictionary.js'
export default {
  data () {
    return {
      treeData: [{ name: '所有园区', children: [], id: '', pid: '', level: 1 }],
      props: {
        label: 'name',
        children: '',
        isLeaf: 'leaf'
      },
      allNodeId: [],
      node_first: {},
      resolve_first: ''
    }
  },
  mounted () {
  },
  methods: {
    // 懒加载点击
    handleNodeClick (node) {
      this.$emit('search', node)
    },
    // 懒加载点击获取
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.allNodeId.push(this.treeData[0].id)
        resolve(this.treeData)
      } else if (node.level === 1) {
        this.getChildrenNode(node.data, resolve)
        this.node_first = node.data
        this.resolve_first = resolve
      } else if (node.level >= 1) {
        this.getChildrenNode(node, resolve)
      } else {
        resolve([])
      }
    },
    // 获取子节点
    getChildrenNode (node, resolve) {
      if (node.data) {
        node.id = node.data.id
      }
      Dictionary.getSelectAll(node.id).then(response => {
        const children = response
        response.forEach(item => {
          item.leaf = !item.hasChildren
        })
        this.allNodeId.push(response)
        resolve(children)
      })
    },
    // 路由跳转刷新树节点
    refresh () {
      this.allNodeId.push(this.treeData[0].id)
      this.resolve_first(this.treeData)
      this.getChildrenNode(this.node_first, this.resolve_first)
    }
  }
}
</script>
<style lang="scss">
.zone{
  overflow: hidden;
  .el-tree{
    max-height: calc(100vh - 175px);
    overflow-y: scroll;
    & .custom-tree-node{
      width: 250px;
    }
  }
  ::-webkit-scrollbar{
    width: 0.5px;
  }
}
</style>
