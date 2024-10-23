<template>
  <div style="width: 100%" class="ui-p-r">
    <el-tabs v-model="activeKey" @tab-click="onTabClick" style="width: 100%">
      <el-tab-pane v-for="item in tabsList" :label="item.label" :name="item.name" :key="item.name">
        <PureTableBar :columns="item.columns" class="flex-1" :show-icon="false" :key="item.name">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              row-key="id"
              :height="maxHeight"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="item.dataList"
              :columns="dynamicColumns"
              highlight-current-row
              :show-overflow-tooltip="true"
              @selection-change="(rows) => onSelectionChange(item.name, rows)"
            >
              <template #operation="{ row }">
                <el-popconfirm :width="160" :title="`确认要删除吗?`" @confirm="onDelete(item.name, row)">
                  <template #reference>
                    <el-button size="small" type="primary" link @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </el-tab-pane>
    </el-tabs>
    <div style="width: auto; right: 0; top: 0" class="flex ui-p-a">
      <el-button type="primary" @click="onAdd" :icon="Plus" class="mr-10">增行</el-button>
      <el-button type="danger" @click="onDeleteAll" :icon="Delete" class="mr-10">批量删除{{ selectCount }}</el-button>
      <UploadButton title="上传文件" :limit="1" :show-file-list="false" @change="onUploadChange" :accept="['.xlsx, .xls'].join(',')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "@pureadmin/utils";
import { ref, reactive, Ref, watch, computed } from "vue";
import UploadButton from "@/components/UploadButton.vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { Plus, Delete } from "@element-plus/icons-vue";
import type { TabsPaneContext, UploadFiles } from "element-plus";
import { importTestTemplate, TestTemplateItemType, TemplateDataItemType } from "@/api/plmManage/laboratory";
import { message, showMessageBox } from "@/utils/message";

interface Props {
  detailInfo: Ref<TestTemplateItemType>;
}
const props = defineProps<Props>();

/** Tabs数据列表类型 */
interface TabDataItemType {
  /** 分类名称 */
  label: string;
  /** 分类属性名 */
  name: string;
  /** 分类类型 (1:安规要求 2:客户要求 3:德龙标准 4:外观要求) */
  type: 1 | 2 | 3 | 4;
  /** 分类列表配置列 */
  columns: TableColumnList[];
  /** 分类列表数据 */
  dataList: TemplateDataItemType[];
  /** 分类列表多选 */
  rowsData: TemplateDataItemType[];
}

enum CateMap {
  anGuiDetails = "安规要求",
  customerDetails = "客户要求",
  dldetails = "德龙标准",
  facadeDetails = "外观要求"
}

const maxHeight = ref(420);
const loading = ref(false);
const activeKey = ref("anGuiDetails");
const cycleOptions = ref([]);
const { editCellRender } = tableEditRender();
const emits = defineEmits(["change"]);

const cellRenderer = (data) => editCellRender({ data });
const cellSelectRenderer = (data) => {
  return editCellRender({
    type: "select",
    data,
    options: cycleOptions.value,
    eleProps: {
      multiple: true,
      collapseTags: true,
      filterable: true,
      collapseTagsTooltip: true,
      maxCollapseTags: 1
    }
  });
};

// 采集数据列
const columnData = reactive<TableColumnList[]>([
  { label: "区分", prop: "testCategory", align: "center", cellRenderer },
  { label: "编号", prop: "testCode", align: "center", cellRenderer },
  { label: "测试数量", prop: "testQuantity", align: "center", cellRenderer },
  { label: "测试项目", prop: "testProject", align: "center", cellRenderer },
  { label: "测试要求", prop: "testRequire", align: "center", cellRenderer },
  { label: "判定基准", prop: "judgmentCriteria", align: "center", cellRenderer },
  { label: "测试阶段", prop: "testStage", align: "center", width: 160, cellRenderer: cellSelectRenderer }
]);
const columns = setColumn({ columnData: columnData, radioColumn: false, operationColumn: { width: 90 }, selectionColumn: { hide: false } });
const tabsList = reactive<TabDataItemType[]>([
  { label: CateMap.anGuiDetails, name: "anGuiDetails", type: 1, columns: columns, dataList: [], rowsData: [] },
  { label: CateMap.customerDetails, name: "customerDetails", type: 2, columns: columns, dataList: [], rowsData: [] },
  { label: CateMap.dldetails, name: "dldetails", type: 3, columns: columns, dataList: [], rowsData: [] },
  { label: CateMap.facadeDetails, name: "facadeDetails", type: 4, columns: columns, dataList: [], rowsData: [] }
]);

const selectCount = computed(() => {
  const itemTab = tabsList.find((item) => activeKey.value === item.name);
  const len = itemTab.rowsData.length;
  return len ? `(${len})` : "";
});

// 详情回显
watch(props, ({ detailInfo }) => parseData(detailInfo.value), { immediate: true });

// 监听数据修改
watch(tabsList, onDataChange);

// 数据修改
function onDataChange() {
  const tempArr = [];
  const reslutData = cloneDeep(tabsList) as TabDataItemType[];
  reslutData.forEach((item) => {
    item.dataList.forEach((m) => {
      m.testStage = (m.testStage as string[]).join(",");
      tempArr.push(m);
    });
  });
  emits("change", tempArr);
}

function onTabClick({ paneName }: TabsPaneContext) {
  activeKey.value = paneName as string;
}

/** 新增一行 */
function onAdd() {
  const blankRow = columns.reduce((acc, cur) => ({ ...acc, [cur.prop as string]: "", testStage: [] }), { id: undefined });
  tabsList.forEach((item) => {
    if (activeKey.value === item.name) {
      item.dataList.push({ ...blankRow, templateType: item.type });
    }
  });
}
/** 批量删除 */
function onDeleteAll() {
  const tabItem = tabsList.find((item) => activeKey.value === item.name);
  if (!tabItem.rowsData.length) return message("请选择要删除的记录", { type: "error" });
  const tipMsg = `确定要删除【${tabItem.label}】选中的${tabItem.rowsData.length}条记录吗?`;
  showMessageBox(tipMsg).then(() => {
    tabItem.dataList = tabItem.dataList.filter((item) => tabItem.rowsData.indexOf(item) < 0);
  });
}

/** 单个删除 */
function onDelete(name, row: TemplateDataItemType) {
  tabsList.forEach((item) => {
    if (activeKey.value === name) {
      item.dataList.splice(item.dataList.indexOf(row), 1);
    }
  });
}

/** 上传excel */
function onUploadChange(files: UploadFiles) {
  const fd = new FormData();
  fd.append("file", files[0].raw);
  fd.append("dto", JSON.stringify({}));
  importTestTemplate(fd).then(({ data }) => {
    data && parseData(data);
  });
}

/** 解析数据渲染表格 */
function parseData(detailInfo: TestTemplateItemType) {
  const data: { [key: string]: TemplateDataItemType[] } = Object.keys(detailInfo).reduce((prev, key) => {
    const cate = CateMap[key];
    if (cate) prev[cate] = detailInfo[key];
    return prev;
  }, {});
  tabsList.forEach((item) => {
    const oList = data[item.label];
    if (oList)
      item.dataList = oList.map((list) => {
        const testStage = (list.testStage as string).split(",") || [];
        testStage.forEach((option) => {
          const itemOption = { optionName: option, optionValue: option };
          const hasItem = cycleOptions.value.some((s) => s.optionValue === option);
          if (!hasItem) cycleOptions.value.push(itemOption);
        });
        return { ...list, testStage };
      });
  });
}

/** 表格选中 */
function onSelectionChange(name: string, rows: TemplateDataItemType[]) {
  tabsList.forEach((item) => {
    if (item.name === name) item.rowsData = rows;
  });
}
</script>
