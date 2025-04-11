<script setup lang="ts">
import { useTable } from "./config";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataMaterialPropIndex" });

const {
  loading,
  dataList,
  columns,
  maxHeight,
  loading2,
  buttonList,
  categoryTreeData,
  searchOptions,
  buttonList2,
  dataList2,
  columns2,
  curNodeName,
  onFresh,
  rowClick,
  rowClick2,
  rowClassName,
  changeSelection,
  onChangeFileInput,
  handleNodeClick,
  handleTagSearch
} = useTable();
</script>

<template>
  <Row :gutter="8">
    <Col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
      <el-tree
        class="ui-ovy-a border-line mobile-tree mb-10"
        :data="categoryTreeData"
        node-key="id"
        :default-expanded-keys="['0']"
        :current-node-key="curNodeName"
        accordion
        :expand-on-click-node="false"
        highlight-current
        :style="{ height: `${maxHeight + 50}px` }"
        :props="{ children: 'children', label: 'title' }"
        @node-click="handleNodeClick"
      />
    </Col>
    <Col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="属性名称" searchField="propertyName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
          <input style="display: none" type="file" accept=".xls,.xlsx" id="importMaterialProp" @change="onChangeFileInput" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            id="materialPropTableId"
            @row-click="rowClick"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :row-class-name="rowClassName"
            :columns="dynamicColumns"
            show-overflow-tooltip
            highlight-current-row
            @selection-change="changeSelection"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
      <PureTableBar :columns="columns2">
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :auto-layout="false" moreActionText="更多操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            class="material-prop-table2"
            @row-click="rowClick2"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="left"
            size="small"
            :loading="loading2"
            :data="dataList2"
            :columns="dynamicColumns"
            :row-class-name="rowClassName"
            show-overflow-tooltip
            highlight-current-row
        /></template>
      </PureTableBar>
    </Col>
  </Row>
</template>
