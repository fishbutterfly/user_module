<template>
  <div class='tree'>
    <el-tree
        ref="lazyTree"
        :data="treeData"
        :props="props"
        :load="loadNode"
        node-key="id"
        :indent="8"
        lazy
        :default-expanded-keys="allNodeId"
        @node-click="handleNodeClick"
        :highlight-current="true"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{node, data}">
          <span class="treeTit">
            {{ node.label }}
          </span>
          <el-progress type="circle" :color="color"
          :percentage="data.progress" v-show="data.id"
          :stroke-width=4 :width=30 class="task-process"></el-progress>
        </span>
      </el-tree>
  </div>
</template>
<script>
import Task from '@/services/tasks.js'
export default {
  data () {
    return {
      treeData: [{ name: '所有园区', hasChilden: true, key: '', id: '' }],
      props: {
        label: 'name',
        children: '',
        isLeaf: 'leaf'
      },
      color: '#63CBBB',
      allNodeId: [], // 默认展开的结构
      taskId: ''
    }
  },
  mounted () {
  },
  methods: {
    init (id) {
      this.taskId = id
    },
    // 懒加载点击
    handleNodeClick (node) {
      this.$emit('search', node)
    },
    // 懒加载点击获取
    loadNode (node, resolve) {
      if (node.level === 0) {
        resolve(this.treeData)
      } else if (node.level === 1) {
        this.getChildrenNode(node.data, resolve)
      } else if (node.level > 1) {
        this.getChildrenNode(node, resolve)
      } else {
        resolve([])
      }
    },
    // 获取子节点
    getChildrenNode (node, resolve) {
      Task.getScope(this.taskId, node.key).then(response => {
        const children = response.data
        response.data.map(item => {
          item.leaf = !item.hasChild
          item.progress = parseFloat(item.progress)
        })
        resolve(children)
      })
    }
  }
}
</script>
<style lang="scss">
.task-process{
  position: absolute;
  right: 30px;
  bottom: 2px;
}
</style>
