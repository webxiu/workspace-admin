<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:45 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:45 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Promotion from "@iconify-icons/ep/promotion";
import Search from "@iconify-icons/ep/search";

const {
  tableRef,
  formData,
  orgOptions,
  loading,
  columns,
  dataList,
  pagination,
  maxHeight,
  onSearch,
  onRowClick,
  onMoveHandle,
  onBatchMoveHandle,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole();
const boxRef = ref<HTMLDivElement>();

const onSelectChange = (value) => {
  formData.orgId = value;
  onSearch();
};
</script>

<template>
  <div class="main ui-h-100" ref="boxRef">
    <PureTableBar title="列表" v-if="columns.length" :columns="columns" @refresh="onSearch">
      <template #title>
        <el-form :model="formData" :inline="true">
          <el-form-item label="组织名称">
            <el-select v-model="formData.orgId" placeholder="请选择" @change="onSelectChange" style="width: 160px">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="formData.userCode" placeholder="请输入工号" style="width: 140px" @keyup.enter="onSearch" clearable />
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-input v-model="formData.userName" placeholder="请输入员工姓名" style="width: 140px" @keyup.enter="onSearch" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="useRenderIcon(Search)" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(Promotion)" @click="onBatchMoveHandle">批量迁移</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          class="user-move"
          border
          row-key="id"
          v-if="maxHeight"
          :height="maxHeight"
          :max-height="maxHeight"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button link type="primary" :size="size" @click="onMoveHandle(row)" :icon="useRenderIcon(Promotion)">迁移</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main .w-full {
  background-color: #f60;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 0;
}

@media (width <= 1366px) {
  :deep(.el-form--inline .el-form-item) {
    margin-bottom: 15px;
  }
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

:deep(.user-move .el-image) {
  width: 60px;
  height: 60px;
}
</style>
