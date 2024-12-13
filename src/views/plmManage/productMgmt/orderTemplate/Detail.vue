<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formRules="formRules" :formConfigs="filterConfigs" :formProps="{ labelWidth: '100px' }" />
  <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
    <template #title>
      <el-button type="primary" :icon="Plus" size="small" @click="onOperate('add')">增行</el-button>
      <el-button type="danger" :icon="Delete" size="small" @click="onOperate('delete')">删行</el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        ref="tableRef"
        row-key="id"
        :height="260"
        :border="true"
        :adaptive="true"
        align-whole="left"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        highlight-current-row
        :default-expand-all="true"
        :show-overflow-tooltip="true"
        @current-change="onCurrentChange"
      />
    </template>
  </PureTableBar>
  <TitleCate name="产品图示" class="mt-10 mb-10" />
  <HxUploadButton v-model:fileList="fileList" accept=".jpg,.png,.jpeg,.bmp,.gif" :multiple="true" list-type="picture-card" />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { message } from "@/utils/message";
import { UploadUserFile } from "element-plus";
import { onMounted, ref, computed, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { formConfigs, formRules } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { detailOrderTemplate, OrderTemplateItemType, OrderTemplatePartNameItemType } from "@/api/plmManage";

type PictureItemType = UploadUserFile & { id: string };

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formData?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  type: "add",
  formData: () => ({})
});

const formRef = ref();
const tableRef = ref();
const loading = ref(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<Partial<OrderTemplatePartNameItemType>[]>([]);
const rowData = ref<Partial<OrderTemplatePartNameItemType>>();
const formData = ref(props.formData);
const fileList = ref<PictureItemType[]>([]);
const baseUrl = import.meta.env.VITE_BASE_API;
const detailInfo = ref<OrderTemplateItemType>();

onMounted(() => {
  getColumnConfig();
  getDetail(props.id);
});
watch(props, (values) => (formData.value = values.formData), { deep: true });
const filterConfigs = computed(() => formConfigs({ type: props.type }));

// 编辑表格
const editCell = tableEditRender();
const getColumnConfig = async () => {
  const columnData: TableColumnList[] = [
    { label: "模号", prop: "modelNumber", cellRenderer: (data) => editCell.editCellRender({ type: "input", data, isEdit: true }) },
    { label: "部件名称", prop: "partName", cellRenderer: (data) => editCell.editCellRender({ type: "input", data, isEdit: true }) },
    { label: "备注", prop: "remarks", cellRenderer: (data) => editCell.editCellRender({ type: "input", data, isEdit: true }) }
  ];
  columns.value = setColumn({ columnData, operationColumn: { hide: true } });
};

function getDetail(id: string) {
  if (!id) return;
  detailOrderTemplate(id).then(({ data }) => {
    detailInfo.value = data;
    dataList.value = data.orderTemplateDetailDTOS;
    const imgList = data.orderTemplatePictureVOS.map((m) => ({ ...m, name: m.imageName, url: baseUrl + m.virtualPath }));
    fileList.value = imgList || [];
  });
}

function onOperate(action: "add" | "delete") {
  if (action === "add") dataList.value.push({ id: uuidv4(), isNew: true });
  if (action === "delete") {
    if (!rowData.value) return message.error("请选择要删除的行");
    const rowIndex = dataList.value.findIndex((item) => item === rowData.value);
    if (rowIndex > -1) {
      dataList.value = dataList.value.filter((item) => item !== rowData.value);
      const newIndex = dataList.value[rowIndex] ? rowIndex : rowIndex - 1;
      rowData.value = dataList.value[newIndex];
      tableRef.value.getTableRef()?.setCurrentRow(dataList.value[newIndex]);
    }
  }
}
const onCurrentChange = (row: OrderTemplatePartNameItemType) => {
  rowData.value = row;
};

function getRef() {
  const fileIds = fileList.value?.map((item) => item.id);
  const files = fileList.value.filter((item) => item.raw).map((item) => item.raw);
  const picList = detailInfo.value?.orderTemplatePictureVOS || [];
  const deleteIds = picList.filter((item) => !fileIds.includes(item.id)).map((item) => item.id);
  const orderTemplateDetailDTOS = dataList.value.map(({ partName, modelNumber, remarks }) => ({ partName, modelNumber, remarks }));
  const param = {
    id: formData.value.id,
    productModelId: formData.value.productModelId,
    orderTemplateDetailDTOS
  };
  return {
    getRef: formRef.value.getRef(),
    param: param,
    files: files,
    deleteIds: deleteIds
  };
}

defineExpose({ getRef });
</script>
