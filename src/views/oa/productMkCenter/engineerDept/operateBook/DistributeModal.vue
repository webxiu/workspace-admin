<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-05 15:12:21 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-05 15:12:21 
 */ -->

<script setup lang="tsx">
import { RefreshLeft } from "@element-plus/icons-vue";
import { message, showMessageBox } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { getEnumDictList, setColumn, tableEditRender, CellOptionType } from "@/utils/table";
import { distributeEsop, DistributeOperateBookItemType, updateEsopDistribute, submitEsopDistribute } from "@/api/oaManage/productMkCenter";

const props = defineProps({ manualId: { type: String as any, default: "default" } });

const maxHeight = 300;
const response = ref();
const rowNode = ref<any>({});
const treeOptions = ref<any[]>([]);
const loading = ref<boolean>(false);
const tLoading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const productLineOption = ref<CellOptionType[]>([]);
const dataList = ref<DistributeOperateBookItemType[]>([]);
const dataList2 = ref<DistributeOperateBookItemType[]>([]);
const formData = reactive({ manualId: "", productionLine: "" });

const LineName = computed(() => rowNode.value?.optionName || "");
watch(props, (val) => (formData.manualId = val.manualId), { immediate: true });

onMounted(() => {
  getColumnConfig();
  getTableList();
  getOptions();
});

const getOptions = () => {
  tLoading.value = true;
  getEnumDictList(["ProductionLine"])
    .then(({ ProductionLine }) => {
      treeOptions.value = [{ optionName: "生产线", optionValue: "0", children: ProductionLine }];
    })
    .finally(() => (tLoading.value = false));
};

// 编辑表格
const editCell_1 = tableEditRender();
const editCell_2 = tableEditRender();

const getColumnConfig = async () => {
  const columnData: TableColumnList[] = [
    { label: "平板编号", prop: "tabletsCode", align: "center" },
    { label: "平板名称", prop: "tabletsName", align: "center" },
    {
      label: "工位名称",
      prop: "workStationId",
      minWidth: 180,
      align: "center",
      cellRenderer: (data) => editCell_1.editCellRender({ type: "select", data, options: productLineOption.value })
    }
  ];
  const columnData2: TableColumnList[] = [
    { label: "平板编号", prop: "tabletsCode", align: "center" },
    { label: "平板名称", prop: "tabletsName", align: "center" },
    {
      label: "工位名称",
      prop: "workStationId",
      minWidth: 180,
      align: "center",
      cellRenderer: (data) => editCell_2.editCellRender({ type: "select", data, options: productLineOption.value })
    }
  ];
  columns.value = setColumn({ columnData: columnData, operationColumn: { hide: true } });
  columns2.value = setColumn({ columnData: columnData2, indexColumn: { hide: true }, operationColumn: { hide: true } });
};

const getTableList = () => {
  return new Promise<boolean>((resolve, reject) => {
    if (!formData.productionLine) return message("请选择生产线", { type: "warning" });
    loading.value = true;
    distributeEsop(formData)
      .then(({ data }) => {
        response.value = data;
        loading.value = false;
        dataList.value = data.manualDistributeDetail.filter((f) => f.tabletsPosition === 1);
        dataList2.value = data.manualDistributeDetail.filter((f) => f.tabletsPosition === 2);
        productLineOption.value = data.workStations.map((f) => ({ optionName: f.workContent, optionValue: f.id }));
        resolve(true);
      })
      .catch((err) => {
        loading.value = false;
        reject(err);
      });
  });
};
function onNodeClick(data) {
  if (data.optionValue === "0") return;
  formData.productionLine = data.optionValue;
  rowNode.value = data;
  getTableList();
}

/**
 * 提交分发
 * @param cleanFlag 0-不清空 1-清空
 */
function onDistribute(cleanFlag = 0) {
  return new Promise<any>((resolve, reject) => {
    submitEsopDistribute({ primaryId: response.value.id, cleanFlag }).then((res) => {
      if (!res.data) return reject(res);
      resolve(res);
    });
  });
}

function onReset() {
  if (!response.value?.id) return message("请选择生产线", { type: "error" });
  showMessageBox(`指导书将切换为待分发状态, 确认取消${LineName.value}指导书分发吗?`).then(() => {
    onDistribute(1).then(({ data }) => {
      if (!data) return message("取消失败", { type: "error" });
      message("取消成功");
    });
  });
}

function getRef(callback) {
  const tabetList = [...dataList.value, ...dataList2.value];
  if (!tabetList.length) return message("没有可分发的工位", { type: "warning" });
  const filterList = tabetList.filter((m) => m.workStationId);
  const len = tabetList.length - filterList.length;
  const msgTip = len ? `有${len}个平板未分配工位名称<br />` : "";
  const params = { ...response.value, manualDistributeDetail: tabetList };
  showMessageBox(`${msgTip}确认要提交${LineName.value}分发吗?`).then(async () => {
    try {
      await updateEsopDistribute(params);
      await getTableList();
      const { data } = await onDistribute(0);
      if (data) {
        message("分发成功");
        callback();
      }
    } catch (error) {
      message("分发失败", { type: "error" });
      console.log("error", error);
    }
  });
}

defineExpose({ getRef });
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <el-tree
      class="ui-ovy-a border-line-right pr-8"
      v-loading="tLoading"
      node-key="optionValue"
      :data="treeOptions"
      :highlight-current="true"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :props="{ children: 'children', label: 'optionName' }"
      @node-click="onNodeClick"
      :style="{ width: '140px', height: `${maxHeight + 78}px` }"
    />
    <div class="flex-col flex-1 ui-ov-h">
      <div class="flex just-between align-center">
        <div class="block-quote-tip flex-1 mr-20 ml-6">
          <span class="mr-20">1、选择生产线, 将两个表格中的 工位名称 下拉选择填写完整</span>
          <span>2、取消分发: 指导书设备屏幕将显示为待分发状态</span>
        </div>
        <el-button type="danger" :icon="RefreshLeft" @click="onReset">取消分发</el-button>
      </div>
      <div class="flex flex-1 ui-w-100">
        <PureTableBar :columns="columns" :showIcon="false">
          <template #title>
            <TitleCate :name="`${LineName}: 左侧平板列表`" :border="true" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="tabletsId"
              :adaptive="true"
              align-whole="center"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              highlight-current-row
              :show-overflow-tooltip="true"
            />
          </template>
        </PureTableBar>
        <PureTableBar :columns="columns2" :showIcon="false">
          <template #title>
            <TitleCate :name="`${LineName}: 右侧平板列表`" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="tabletsId"
              :adaptive="true"
              align-whole="center"
              :loading="loading"
              :size="size"
              :data="dataList2"
              :columns="dynamicColumns"
              highlight-current-row
              :show-overflow-tooltip="true"
            />
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>
