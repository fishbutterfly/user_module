<template>
  <div class='table clearfix'>
    <el-table
    :data="tableData"
    ref="select"
    @selection-change="selectionChange"
    stripe
    style="width: 100%">
      <el-table-column
        label="操作"
        width="70px"
        align="center"
        v-if="options.select"
        :selectable="canSelect"
        type="selection"
        key="11">
      </el-table-column>
      <el-table-column
        v-if="options.order"
        type="index"
        width="80px"
        align="center"
        key="22"
        label="序号">
      </el-table-column>
      <el-table-column :label="item.label" :align="item.align ? item.align : 'center'" v-for="(item, index) in columns" :key="index" :width="item.width? item.width : ''">
        <template slot-scope="scope">
          <span v-if="!item.progress && !item.remark" :class="{ 'text-red': scope.row[item.prop] === '缺失', 'text-green': scope.row[item.prop] === '富余' }">{{ scope.row[item.prop] }}</span>
          <div v-if="item.progress">
            <el-progress :percentage="scope.row[item.prop]" class="progress"></el-progress>
          </div>
          <div v-if="item.remark">
            <el-tooltip effect="dark" :content="scope.row[item.prop]" placement="top-start">
              <span class="remark-span">{{ scope.row[item.prop] }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="operates" :width="options.width? options.width : '80px'">
        <template slot-scope="scope">
          <div v-if="options.material">
            <el-tooltip effect="dark" v-for="(btn, index) in operates" :key="index" :content="btn.info" placement="top-start">
              <el-button size="mini"
              :type="scope.row.enable && btn.isEnable ? 'info' : btn.type" :icon="btn.icon" :disabled="scope.row.enable && btn.isEnable"
              v-show="!scope.row.socketState"
              @click.native.prevent="btn.method(index,scope.row)"
              circle plain>
                <span v-if="btn.label">{{btn.label}}</span>
              </el-button>
            </el-tooltip>
          </div>
          <div v-else>
            <el-button size="mini" v-for="(btn, index) in operates" :key="index"
            :type="scope.row.enable && btn.isEnable ? 'info' : btn.type" :icon="btn.icon" :disabled="scope.row.enable && btn.isEnable"
            v-show="!scope.row.socketState"
            @click.native.prevent="btn.method(index,scope.row)"
            circle plain>
              <span v-if="btn.label">{{btn.label}}</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="!options.page">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="page"
        :page-size="size"
        :total="options.pageTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      page: 0,
      size: 10
    }
  },
  props: ['columns', 'options', 'operates'],
  watch: {
    page: function (newVal) {
      if (!isNaN(newVal)) {
        if (this.page !== null) {
          this.$emit('handleCurrentChange', {
            page: this.page === '0' ? this.page : this.page - 1,
            size: this.options.size ? this.options.size : this.size
          })
        }
      }
    }
  },
  methods: {
    canSelect (row) {
      if (row.enable) {
        return false
      } else {
        return true
      }
    },
    configPage (response) {
      this.tableData = response.data.content ? response.data.content : response.data
      this.options.pageTotal = response.data.totalElements ? response.data.totalElements : response.totalElements
    },
    clearSelect () {
      this.$refs.select.clearSelection()
    },
    selectionChange (val) {
      this.$emit('selectionChange', val)
    },
    // 刷新页码
    initPage () {
      this.page = 1
      this.size = 10
    }
  },
  mounted () {
  }
}
</script>
<style>
.block {
  margin-top: 20px;
  float: right;
}
.text-red {
  color: #FF0000;
}
.text-green {
  color: #279E8B;
}
.remark-span {
  overflow:hidden;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
