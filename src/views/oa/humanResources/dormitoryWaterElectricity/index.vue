<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import UserDetailTable from "./userDetailTable/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesDormitoryWaterElectricityIndex" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  loading2,
  maxHeight,
  pagination,
  buttonList,
  dialogVisible,
  searchOptions,
  queryParams,
  groupArrsList,
  onEdit,
  onEditTop,
  onSearch,
  onCurrentChange,
  handleSizeChange,
  rowStyle,
  onTagSearch,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="onTagSearch"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          placeholder="请输入房间号"
          searchField="dormitoryCode"
        />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :auto-layout="false" :buttonList="buttonList" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2 - 17"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :row-style="rowStyle"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @row-dblclick="onEditTop"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button type="warning" plain size="small" @click="onEditTop(row)">修改</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <PureTableBar :columns="columns2" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
      </template>
      <template #buttons />
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2 - 17"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading2"
          :size="size"
          :data="dataList2"
          :columns="dynamicColumns"
          :row-style="rowStyle"
          @row-dblclick="(row) => onEdit(row)"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
        >
          <template #operation="{ row }">
            <el-button type="warning" plain size="small" @click="onEdit(row)">修改</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <el-dialog v-model="dialogVisible" draggable title="个人水电详情" width="1000px" destroy-on-close>
      <div><UserDetailTable /></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
