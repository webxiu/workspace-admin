<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-05 15:12:21 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-05 15:12:21 
 */ -->

<script setup lang="tsx">
import { Question } from "@/config/elements";
import { RefreshLeft } from "@element-plus/icons-vue";
import { message, showMessageBox } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { EsopList } from "@/api/oaManage/productMkCenter";
import { setColumn, tableEditRender, CellOptionType } from "@/utils/table";
import { BillState, BillState_Color, PAGE_CONFIG } from "@/config/constant";
import { distributeEsop, DistributeOperateBookItemType, updateEsopDistribute, submitEsopDistribute } from "@/api/oaManage/productMkCenter";

interface Props {
  lineName?: string;
  productionLine?: string;
}

const props = defineProps<Props>();
const maxHeight = 300;
const response = ref();
const keyword = ref("");
const treeOptions = ref<any[]>([]);
const loading = ref<boolean>(false);
const sLoading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const productLineOption = ref<CellOptionType[]>([]);
const dataList = ref<DistributeOperateBookItemType[]>([]);
const dataList2 = ref<DistributeOperateBookItemType[]>([]);
const formData = reactive({ manualId: "", productionLine: "" });

watch(props, (val) => (formData.productionLine = val.productionLine), { immediate: true });

onMounted(() => {
  getColumnConfig();
  getTableList();
  remoteMethod();
});

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
    // if (!formData.manualId) return message("请选择指导书", { type: "warning" });
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

// 查询指导书
function remoteMethod(keyword = "") {
  sLoading.value = true;
  EsopList({ manualName: keyword, page: 1, limit: PAGE_CONFIG.pageSize })
    .then(({ data }) => (treeOptions.value = data.records || []))
    .finally(() => (sLoading.value = false));
}

// 选择指导书
function onChange(id) {
  formData.manualId = id;
  getTableList();
}

/**
 * 提交指导书分发
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

// 取消指导书分发
function onReset() {
  if (!response.value?.id) return message("请选择指导书", { type: "error" });
  showMessageBox(`指导书将切换为待分发状态, 确认取消${props.lineName}指导书分发吗?`).then(() => {
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
  const msgTip = len ? `有${len}个平板未分配工位名称, ` : "";
  const params = { ...response.value, manualDistributeDetail: tabetList };
  showMessageBox(`${msgTip}确认要提交${props.lineName}指导书分发吗?`).then(async () => {
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
    <div class="flex-col flex-1 ui-ov-h">
      <div class="flex just-between align-center">
        <div class="flex flex-1 items-center mb-15">
          <span class="mr-10">
            选择指导书<el-tooltip placement="top" content="先选择指导书, 然后将 工位名称 填写完整">
              <Question />
            </el-tooltip>
          </span>
          <el-select
            v-model="keyword"
            remote
            clearable
            filterable
            :loading="sLoading"
            :reserve-keyword="false"
            :remote-method="remoteMethod"
            placeholder="请输入指导书名称"
            style="width: 30%"
            @change="onChange"
          >
            <el-option label="" value="" v-if="treeOptions.length" disabled style="cursor: default; color: var(--el-text-color-regular)">
              <div class="flex just-between">
                <span class="ellipsis mr-20" style="width: 66px">审核状态</span>
                <span class="ellipsis mr-30" style="flex: 1">指导书名称</span>
                <span class="ellipsis" style="width: 120px">产品型号</span>
              </div>
            </el-option>
            <el-option v-for="item in treeOptions" :key="item.id" :label="item.manualName" :value="item.id" :disabled="item.billState !== BillState.audited">
              <div class="flex just-between align-center border-line-top">
                <span style="width: 66px; margin-right: 20px">
                  <el-tag v-if="item.billState === BillState.audited" type="success" size="small" effect="dark">已审核</el-tag>
                  <el-tag v-else size="small" effect="dark" type="danger">{{ BillState_Color[item.billState]?.name }}</el-tag>
                </span>
                <span class="ellipsis mr-30" style="flex: 1; max-width: 400px" :title="item.manualName">{{ item.manualName }}</span>
                <span class="ellipsis" style="width: 120px" :title="item.productModel">{{ item.productModel }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <el-button type="danger" :icon="RefreshLeft" @click="onReset">取消分发</el-button>
      </div>
      <div class="flex flex-1 ui-w-100">
        <PureTableBar :columns="columns" :showIcon="false">
          <template #title>
            <TitleCate :name="`${lineName}: 左侧平板列表`" :border="true" />
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
            <TitleCate :name="`${lineName}: 右侧平板列表`" />
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
