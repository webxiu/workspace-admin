<!-- /*
 * @Author: Hailen
 * @Date: 2023-09-05 08:52:07
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-09-05 08:52:07
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Search } from "@element-plus/icons-vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptFinanceBIStandardCostIndex" });

const {
  formData,
  loading,
  sLoading,
  columns,
  dataList,
  columns2,
  dataList2,
  maxHeight,
  activeName,
  buttonList,
  materialList,
  unitPriceList,
  numberOptions,
  oSearch,
  onRefresh,
  onKeyDown,
  onChange,
  onClick
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <div class="flex just-between">
          <el-form :model="formData" :inline="true" @submit.prevent>
            <el-form-item label="物料编码" class="mb-4">
              <el-select
                v-model.trim="formData.number"
                filterable
                placeholder="请输入物料编码"
                style="width: 150px"
                clearable
                @click="onClick"
                @keyup="onKeyDown"
                @change="onChange"
                popper-class="select-table"
              >
                <div v-loading="sLoading" style="min-height: 24px">
                  <el-option label="" value="" v-if="materialList.length" disabled style="color: var(--el-text-color-regular); cursor: default">
                    <div class="flex just-between">
                      <span class="ellipsis" style="width: 120px; margin-right: 15px">物料编码</span>
                      <span class="ellipsis" style="width: 180px; margin-right: 15px">名称</span>
                      <span class="ellipsis" style="width: 260px; margin-right: 15px">规格型号</span>
                    </div>
                  </el-option>
                  <el-option v-for="item in materialList" :key="item.number" :label="item.number" :value="item.number">
                    <div class="flex just-between border-line-top">
                      <span class="ellipsis" style="width: 120px; margin-right: 15px" :title="item.number">{{ item.number }}</span>
                      <span class="ellipsis" style="width: 180px; margin-right: 15px" :title="item.name">{{ item.name }}</span>
                      <span class="ellipsis" style="width: 260px; margin-right: 15px" :title="item.specification">{{ item.specification }}</span>
                    </div>
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="包含损耗" class="mb-4">
              <el-select v-model.trim="formData.includeAttritionRate" placeholder="请选择" style="width: 100px">
                <el-option v-for="item in numberOptions" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="测算数量" class="mb-4">
              <el-input-number
                v-model.trim="formData.measuredQuantity"
                :min="0"
                placeholder="请输入"
                controls-position="right"
                @keyup.enter="oSearch"
                style="width: 100px"
                clearable
              />
            </el-form-item>
            <el-form-item label="单价取值" class="mb-4">
              <el-select v-model.trim="formData.priceValue" placeholder="请选择" style="width: 130px">
                <el-option v-for="item in unitPriceList" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="采购年月" class="mb-4" v-if="formData.priceValue == '3'">
              <el-date-picker v-model="formData.purchaseDate" type="month" placeholder="选择年月" format="YYYY-MM" value-format="YYYY-MM" />
            </el-form-item>
            <el-form-item class="mb-4">
              <el-button type="primary" :icon="Search" @click="oSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <el-tabs v-model="activeName">
          <el-tab-pane label="明细" name="detail">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="childId"
              class="standard-cost"
              :adaptive="true"
              align-whole="center"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :default-expand-all="true"
              :show-overflow-tooltip="true"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </el-tab-pane>
          <el-tab-pane label="分类汇总" name="total">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              :adaptive="true"
              align-whole="center"
              :size="size"
              :data="dataList2"
              :columns="columns2"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </PureTableBar>
  </div>
</template>
