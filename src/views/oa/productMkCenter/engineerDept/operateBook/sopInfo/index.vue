<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { computed } from "vue";
import { useConfig } from "./utils/hook";
import { useWindowSize } from "@vueuse/core";
import AddForm from "./component/AddForm/index.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { Plus, Delete, Refresh } from "@element-plus/icons-vue";

defineOptions({ name: "OperateBookSopInfo" });

const {
  tableRef,
  loading,
  rowData,
  columns,
  columns2,
  columns3,
  columns4,
  dataList,
  toolIndex,
  maxHeight,
  buttonList2,
  onAdd,
  onDelete,
  onRefresh,
  onRowClick,
  onHandleImg,
  onWorkChange
} = useConfig();
const { width } = useWindowSize();
const evgHeight = computed(() => maxHeight.value / 3 - 26);
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
      <PureTableBar :columns="columns" :show-icon="false" :style="{ paddingBottom: width < 1200 ? '8px' : '0' }">
        <template #title>
          <TitleCate name="排位表" :border="false" />
        </template>
        <template #buttons>
          <el-button :icon="Refresh" size="small" title="刷新" @click="onRefresh" />
          <el-button :icon="Plus" size="small" title="新增" @click="onAdd.call(null, 'sort')" />
          <el-button :icon="Delete" size="small" title="删除" @click="onDelete.call(null, 'sort')" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            class="position-table"
            :height="width < 1200 ? 200 : maxHeight"
            :max-height="width < 1200 ? 200 : maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :row-class-name="({ row }) => (rowData?.id === row.id ? 'current-row' : '')"
            :columns="dynamicColumns"
            :highlight-current-row="false"
            @row-click="(row) => onRowClick('sort', row)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
      <PureTableBar :columns="columns2" :show-icon="false">
        <template #title>
          <TitleCate name="物料表" :border="false" />
        </template>
        <template #buttons>
          <el-button :icon="Plus" size="small" title="新增" @click="onAdd.call(null, 'material')" />
          <el-button :icon="Delete" size="small" title="删除" @click="onDelete.call(null, 'material')" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="evgHeight"
            :max-height="evgHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="rowData?.materialVOS"
            :columns="dynamicColumns"
            highlight-current-row
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            @row-click="(row) => onRowClick('material', row)"
          />
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns3" :show-icon="false">
        <template #title>
          <TitleCate name="检测记录表" :border="false" />
        </template>
        <template #buttons>
          <el-button :icon="Plus" size="small" title="新增" @click="onAdd.call(null, 'check')" />
          <el-button :icon="Delete" size="small" title="删除" @click="onDelete.call(null, 'check')" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="evgHeight"
            :max-height="evgHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="rowData?.checkRuleVOS"
            :columns="dynamicColumns"
            highlight-current-row
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            @row-click="(row) => onRowClick('check', row)"
          />
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns4" :show-icon="false" :style="{ paddingBottom: width < 991 ? '8px' : '0' }">
        <template #title>
          <TitleCate name="工具参数表" :border="false" />
        </template>
        <template #buttons>
          <el-button :icon="Plus" size="small" title="新增" @click="onAdd.call(null, 'tool')" />
          <el-button :icon="Delete" size="small" title="删除" @click="onDelete.call(null, 'tool')" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="evgHeight"
            :max-height="evgHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="rowData?.checkRuleVOS[toolIndex]?.toolParametersVOS"
            :columns="dynamicColumns"
            highlight-current-row
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            @row-click="(row) => onRowClick('tool', row)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="12" :lg="9" :xl="9">
      <div class="flex align-center pl-8 pr-8">
        <TitleCate name="作业内容" :border="false" />
        <ButtonList :buttonList="buttonList2" :autoLayout="false" />
      </div>
      <AddForm @change="onWorkChange" :row="rowData" @handleImg="onHandleImg" />
    </Col>
  </Row>
</template>
