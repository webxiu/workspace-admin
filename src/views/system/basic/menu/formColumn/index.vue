<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ConfUrl } from "../utils/hook";
import { useConfig } from "./utils/hook";
import { Question } from "@/config/elements";
import { Back } from "@element-plus/icons-vue";
import PreviewForm from "./component/PreviewForm.vue";
import PreviewTable from "./component/PreviewTable.vue";
import FormConfigList from "./component/FormConfigList/index.vue";
import TableConfigList from "./component/TableConfigList/index.vue";
import ColumnMenuList from "../tableColumn/component/ColumnMenuList.vue";

defineOptions({ name: "SystemBasicMenuFormColumn" });

const { formRef, loading, dataList, maxHeight, currentKey, showType, treeOptions, onBack, onGoTo, onNodeClick, onAddGroup, onEditGroup, onDeleteGroup } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <div class="flex-col pt-10 border-line">
      <div class="flex-col just-between border-line-bottom p-10" style="padding-top: 0">
        <div class="flex just-between align-center">
          <div class="label-colon fz-14">配置菜单</div>
          <ColumnMenuList :url="ConfUrl.form" />
        </div>
        <div class="flex align-center mt-10">
          <el-button @click="onBack" :icon="Back" size="small" type="danger">返回</el-button>
          <HxIcon icon="SetUp" @click="onGoTo" size="20" color="#409eff" class="ml-10 pointer" title="表格配置" />
          <Question tipMsg="按分组添加表单头或表单明细" :size="18" style="margin-left: auto" />
        </div>
      </div>
      <div style="padding: 8px 10px" v-loading="loading">
        <el-tree
          node-key="id"
          :key="currentKey"
          :data="treeOptions"
          :current-node-key="currentKey"
          :default-expand-all="true"
          :highlight-current="true"
          @node-click="onNodeClick"
          :props="{ children: 'formGroupList', label: 'groupName' }"
          :style="{ width: '240px', height: maxHeight + 'px' }"
        >
          <template #default="{ data }">
            <div class="flex just-between flex-1">
              <div class="inline-flex">
                <el-tag v-if="!data.formGroupList" size="small" :type="data.groupType === '1' ? '' : 'success'" effect="dark" disable-transitions>
                  {{ data.groupType === "1" ? "表单" : "表格" }}
                </el-tag>
                <div class="ellipsis ml-4" :title="data.formGroupList ? '分组名称' : '表单名称'">{{ data.groupName }}</div>
              </div>
              <div class="inline-flex">
                <HxIcon v-if="data.formGroupList" icon="Plus" size="18" title="新增" @click.stop="onAddGroup(data)" />
                <HxIcon v-if="!data.formGroupList" icon="Edit" size="18" title="修改" @click.stop="onEditGroup(data)" />
                <HxIcon v-if="!data.formGroupList" icon="Delete" size="18" title="删除" class="ml-1" @click.stop="onDeleteGroup(data)" />
              </div>
            </div>
          </template>
          <template #empty>
            <div class="position-center">
              <el-empty description="请先到表格配置中添加分组~" :image-size="80" />
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="ui-h-100 flex-col flex-1 ui-ov-h pl-10 ui-p-r">
      <FormConfigList v-if="showType" ref="formRef" :height="maxHeight * 0.5" @dataList="(data) => (dataList = data)" />
      <TableConfigList v-else ref="formRef" :height="maxHeight * 0.5" @dataList="(data) => (dataList = data)" />
      <PreviewForm v-if="showType" :height="maxHeight * 0.4" :columnList="dataList" />
      <PreviewTable v-else :height="maxHeight * 0.48" :columnList="dataList" />
    </div>
  </div>
</template>
