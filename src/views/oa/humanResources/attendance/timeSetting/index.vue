<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { Edit, Delete } from "@element-plus/icons-vue";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesAttendanceTimeSettingIndex" });

const { columns, dataList, loading, maxHeight, buttonList, onRefresh, onEdit, onDelete } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex-col flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="FCUSTID"
            class="donate-record"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)" :icon="Edit">修改</el-button>
              <el-popconfirm :width="280" :title="`确定删除\n【${row.remark}】的工作时间吗？`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" type="danger" :icon="Delete" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
