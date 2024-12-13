<script setup lang="tsx">
import { h, reactive, ref, watch } from "vue";
import { message } from "@/utils/message";
import { FormColumnItemType } from "@/api/systemManage";
import { setColumn, getColumnData } from "@/utils/table";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";

/** ========预览表格========= */
const props = defineProps<{ height: number; columnList: FormColumnItemType[] }>();
const columns = ref<TableColumnList[]>([]);
const dataList = ref<Recordable[]>([]);
const forceUpdate = ref<number>(0);

watch(props, (value) => getColumnConfig(value.columnList), { immediate: true });

// 获取配置列
function getColumnConfig(columnList: TableColumnList[]) {
  if (!columnList.length) return;
  // 数据为空, 生成一行默认数据
  if (dataList.value.length === 0) {
    const data = getRowData();
    dataList.value = [data];
  }
  const { columnData } = getColumnData(columnList, dataList);
  console.log("表格配置预览:", columnData);
  columns.value = setColumn({ columnData, dataList, operationColumn: { minWidth: 140 } });
  forceUpdate.value = Date.now();
}

// 所有字段的行数据
function getRowData() {
  const item = props.columnList?.reduce((prev, cur) => {
    prev[cur.prop] = getCode(4); // 单元格填充数据
    return prev;
  }, {});
  return { id: Date.now(), ...item };
}

// 范围随机数
function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 获取验证码
function getCode(num: number) {
  if (num < 1) return "";
  const sCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const code = new Array(num).fill(0).reduce((prev) => {
    const txt = sCode[randomNum(0, sCode.length)];
    return (prev += txt);
  }, "");
  return code;
}

// 添加
function onAdd() {
  if (!columns.value.length) return message.error("请添加表格配置");
  const oData = getRowData();
  dataList.value = [...dataList.value, { ...oData, id: Date.now() }];
}

// 修改
function onUpdate(row) {
  const formInline = reactive({ ...row });
  const formConfigs = props.columnList.map(({ label, prop }) => ({
    label: label,
    prop: prop,
    colProp: { span: 12 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
    }
  }));
  addDialog({
    title: "修改数值",
    props: { formInline, formConfigs, formProps: { labelWidth: "120px" } },
    width: "860px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(EditForm),
    beforeSure: (done) => {
      dataList.value.forEach((item) => {
        if (item.id === formInline.id) Object.assign(item, formInline);
      });
      done();
    }
  });
}

// 删除
function onDelete(row) {
  dataList.value = dataList.value.filter((item) => item.id !== row.id);
}
</script>

<template>
  <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
    <template #title>
      <div class="no-wrap block-quote-tip ui-w-100 mr-50">表格预览<span class="fz-14 color-f00">(布局预览、表单验证)</span></div>
    </template>
    <template #buttons>
      <el-button type="primary" @click="onAdd">新增一行</el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        :height="height"
        :max-height="height"
        row-key="id"
        class="preview-table"
        :adaptive="true"
        align-whole="center"
        :loading="false"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :paginationSmall="size === 'small'"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <template #operation="{ row }">
          <el-button size="small" type="default" @click="onUpdate(row)">修改</el-button>
          <el-button size="small" type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>
