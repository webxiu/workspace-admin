<template>
  <div>
    <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
      <template #title>
        <div style="display: flex" v-if="route.query.type !== 'view'">
          <el-button type="primary" size="small" :icon="Plus" @click="onAdd">新增</el-button>
          <el-button type="warning" size="small" :icon="Edit" @click="onEdit">修改</el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="onDelete">删除</el-button>
          <el-button type="primary" size="small" :icon="UploadFilled" @click="onImport">导入</el-button>
          <el-button type="default" size="small" :icon="Top" @click="onRowMove('up')">行向上</el-button>
          <el-button type="default" size="small" :icon="Bottom" @click="onRowMove('down')">行向下</el-button>
          <input style="display: none" type="file" accept=".xls,.xlsx" id="importBomInput" @change="onChangeFileInput" />
        </div>
      </template>
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
          show-overflow-tooltip
          :row-style="{ cursor: 'pointer' }"
          :height="maxHeight"
          row-key="uuid"
          class="bom-view-table"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          size="small"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          @row-click="rowClick"
        >
          <template #number="{ row }">
            <span v-if="row.childBomId" @dblclick.stop="onRowDblclick(row)" style="color: red">{{ row.number }}</span>
            <span v-else>{{ row.number }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useConfig } from "./utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { Plus, Edit, Delete, UploadFilled, Top, Bottom } from "@element-plus/icons-vue";

const route = useRoute();
const emits = defineEmits(["loadData"]);

const { dataList, columns, loading, maxHeight, rowClick, onRowDblclick, onAdd, onEdit, onDelete, onImport, onRowMove, onChangeFileInput } = useConfig(emits);

defineExpose({ dataList, loading, maxHeight });
</script>

<style scoped lang="scss">
:deep(.el-popper.is-dark) {
  display: none !important;
}
</style>
