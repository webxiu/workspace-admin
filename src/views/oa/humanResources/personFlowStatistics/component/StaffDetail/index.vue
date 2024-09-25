<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { computed } from "vue";
import { useConfig } from "./hook";
import { Refresh } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/RePureTableBar";
import StaffInfoDetail from "@/views/oa/humanResources/staffInfo/addModal.vue";
import SearchList from "@/components/SearchList/index.vue";

const props = defineProps<{ row: Record<string, any>; yearAndMonth: string }>();
const { detailRef, loading, sLoading, columns, dataList, rowInfo, onCurrentChange, onUpdateInfo } = useConfig(props);
const contentHeight = computed(() => window.innerHeight - 260);
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content" :style="{ height: contentHeight + 'px' }">
    <PureTableBar :columns="columns" :show-icon="false" style="width: 42%; padding-top: 0" class="border-line-right mr-10 pr-15">
      <template #title>
        <SearchList
          v-model="dataList"
          :bright="true"
          style="width: 40%"
          label="搜索"
          placeholder="请输入查询关键字"
          :propKeys="['staffCode', 'staffName', 'deptName', 'roleName', 'startDate', 'leaveofficeDate']"
        />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="contentHeight - 40"
          :max-height="contentHeight - 40"
          row-key="id"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @current-change="onCurrentChange"
        />
      </template>
    </PureTableBar>
    <div class="flex-1" v-loading="sLoading" style="width: 58%">
      <el-scrollbar :height="contentHeight" v-show="rowInfo.row.id">
        <StaffInfoDetail
          ref="detailRef"
          :key="rowInfo.row.id"
          :type="rowInfo.type"
          :row="rowInfo.row"
          :temporaryFlag="rowInfo.temporaryFlag"
          :optionData="rowInfo.optionData"
        />
        <div class="p-20 ui-ta-c">
          <el-button type="primary" @click="onUpdateInfo" :icon="Refresh">更新信息</el-button>
        </div>
      </el-scrollbar>
      <el-empty v-show="!rowInfo.row.id" description="暂无数据~" style="margin-top: 15%" />
    </div>
  </div>
</template>
