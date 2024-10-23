<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onMounted, ref } from "vue";
import { fetchProductTemplateList, fetchProductsDevApplayTemplateList, getBOMTableRowSelectOptions, getBillStateNameList } from "@/api/plmManage";
import { reactive } from "vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

import { handleTree } from "@/utils/tree";
import type { FormInstance, FormRules } from "element-plus";

defineOptions({ name: "PlmManageProjectMgmtProductsDevApplayIndex" });

const {
  columns,
  dataList,
  onExport,
  onBeforeSubmit,
  onBeforeDel,
  onBeforeView,
  dialogVisible,
  loading,
  maxHeight,
  buttonList,
  searchOptions,
  onSearch,
  onFresh,
  onAdd,
  onEdit,
  onSubmitAction,
  handleTagSearch,
  rowDbClick,
  rowClick,
  onDelete
} = useConfig();

const billDictList: any = ref([]);
const formData = reactive({ selectedTemplate: "" });
const templateOpts = ref([]);
const formRef = ref();
const rules = reactive({
  selectedTemplate: [{ required: true, message: "请选择一个模板", trigger: "change" }]
});

const fetchBillOptionList = () => {
  getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
    if (res.data) billDictList.value = res.data[0]?.optionList || [];
  });
};

const getBillName = (billState) => billDictList.value.find((item) => item.optionValue == billState)?.optionName;

const modalConfirm = () => {
  const lastId = formData.selectedTemplate[formData.selectedTemplate.length - 1];
  formRef.value &&
    formRef.value.validate((valid) => {
      if (valid) {
        onAdd(lastId);
      } else {
        console.log("验证失败");
      }
    });
};

const fetchTemplateOptionList = () => {
  fetchProductsDevApplayTemplateList({}).then((res: any) => {
    if (res.data) {
      console.log(res.data, "模板");
      templateOpts.value = res.data;
    }
  });
};

onMounted(() => {
  fetchBillOptionList();
  fetchTemplateOptionList();
});
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入标题名称" searchField="titleName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        <el-dialog v-model="dialogVisible" title="选择模板" :width="440">
          <div>
            <el-form :model="formData" label-position="left" :rules="rules" ref="formRef">
              <el-form-item label="选择模板" required prop="selectedTemplate">
                <el-cascader
                style="width: 100%;"
                  v-model="formData.selectedTemplate"
                  :options="templateOpts"
                  :props="{
                    label: 'name',
                    expandTrigger: 'hover',
                    value: 'id',
                    children: 'children'
                  }"
                />
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="modalConfirm">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="productDevApplyTableId"
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #billState="{ row }">{{ getBillName(row.billState) }}</template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
