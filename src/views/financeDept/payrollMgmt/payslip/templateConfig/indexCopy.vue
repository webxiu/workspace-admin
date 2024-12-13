<script setup lang="ts">
import { fetchMoneyTemplateList, saveMoneyTemplateConfig } from "@/api/oaManage/financeDept";
import { setColumn, tableEditRender } from "@/utils/table";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const tableData = ref([]);
const loading = ref(false);
const currentRow: any = ref({});
const columns = ref<TableColumnList[]>([]);

// 编辑表格
const { editCellRender } = tableEditRender();

const getConfig = () => {
  const fieldTypeOption = [
    { optionName: "varchar", optionValue: "varchar" },
    { optionName: "decimal", optionValue: "decimal" },
    { optionName: "bit", optionValue: "bit" },
    { optionName: "datetime", optionValue: "datetime" }
  ];
  const fieldOtherOption = [
    { optionName: "是", optionValue: "是" },
    { optionName: "否", optionValue: "否" }
  ];

  const columnData: TableColumnList[] = [
    { label: "字段", prop: "fieldName", cellRenderer: (data) => editCellRender({ data }) },
    { label: "名称", prop: "fieldTitle", cellRenderer: (data) => editCellRender({ data }) },
    {
      label: "类型",
      prop: "fieldType",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldTypeOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    { label: "宽度", prop: "width", minWidth: 80, align: "right", cellRenderer: (data) => editCellRender({ data }) },
    {
      label: "PC显示",
      prop: "disable",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "APP显示",
      prop: "appShow",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "APP序号",
      prop: "appNo",
      minWidth: 100,
      align: "right",
      cellRenderer: (data) => editCellRender({ data })
    },
    {
      label: "扣项",
      prop: "deduction",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "导出Excel",
      prop: "excel",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "冻结",
      prop: "frozen",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "合计",
      prop: "total",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "强制校验",
      prop: "importCheck",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "加密存储",
      prop: "encryptedStorage",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "属于Excel",
      prop: "inExcel",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    },
    {
      label: "允许修改",
      prop: "allowEdit",
      cellRenderer: (data) => editCellRender({ type: "select", data, options: fieldOtherOption, cellStyle: { color: "#606266", textAlign: "left" } })
    }
  ];

  columns.value = setColumn({ columnData, operationColumn: false });
  return columns.value;
};

defineOptions({ name: "TemplateCopyConfig" });

const route = useRoute();

const fetchTableData = () => {
  loading.value = true;
  fetchMoneyTemplateList({ templateNo: route.query.gzmbNo })
    .then((res: any) => {
      if (res.data) {
        tableData.value = res.data.map((item) => ({ ...item, isEditMode: false }));
      }
    })
    .finally(() => (loading.value = false));
};

const onSave = () => {
  ElMessageBox.confirm(`您确认要保存吗?`, "系统提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      // 组装请求参数
      const params = {
        gzmbNo: route.query.gzmbNo,
        gzmbb: route.query.gzmbb,
        payslipTemplates: tableData.value
      };
      loading.value = true;
      saveMoneyTemplateConfig(params)
        .then((res) => {
          if (res.data) {
            ElMessage({ message: "保存成功", type: "success" });
            fetchTableData();
          }
        })
        .finally(() => (loading.value = false));
    })
    .catch(() => {});
};

const upMove = () => {
  if (JSON.stringify(currentRow.value) === "{}") {
    ElMessage({ message: "还没有选择记录", type: "warning" });
    return;
  }
  const index = tableData.value.findIndex((item) => item.id === currentRow.value.id);
  if (index > 0) {
    const param: any = {};
    param.number1 = currentRow.value.numberNo;
    param.number2 = tableData.value[index - 1].numberNo;
    tableData.value[index - 1].numberNo = param.number1;
    currentRow.value.numberNo = param.number2;
    const up = tableData.value[index - 1];
    tableData.value.splice(index - 1, 1);
    tableData.value.splice(index, 0, up);
  } else {
    ElMessage({ message: "已经是第一条，不可上移", type: "warning" });
  }
};

const downMove = () => {
  if (JSON.stringify(currentRow.value) === "{}") {
    ElMessage({ message: "还没有选择记录", type: "warning" });
    return;
  }
  const index = tableData.value.findIndex((item) => item.id === currentRow.value.id);
  if (index + 1 === tableData.value.length) {
    ElMessage({ message: "已经是最后一条，不可下移", type: "warning" });
  } else {
    const param: any = {};
    param.number1 = currentRow.value.numberNo;
    param.number2 = tableData.value[index + 1].numberNo;
    tableData.value[index + 1].numberNo = param.number1;
    currentRow.value.numberNo = param.number2;
    const down = tableData.value[index + 1];
    tableData.value.splice(index + 1, 1);
    tableData.value.splice(index, 0, down);
  }
};

const addRow = () => {
  const newRow = {
    numberNo: (tableData.value[tableData.value.length - 1]?.numberNo ?? 0) + 1,
    templateNo: route.query.gzmbNo,
    fieldName: "",
    // fFieldTitle: "",
    width: 100,
    disable: "否",
    excel: "是",
    frozen: "否",
    total: "是",
    importCheck: "否",
    encryptedStorage: "是",
    fieldType: "varchar",
    inExcel: "是",
    allowEdit: "是",
    appShow: "是",
    appNo: 0,
    deduction: "否"
  };

  tableData.value.push(newRow);
};

const rowStyle = ({ row }) => {
  if (row.inExcel === "是") {
    return {
      background: "#FFC107"
    };
  }
};

const rowClick = (row, column) => {
  currentRow.value = row;
};

onMounted(() => {
  getConfig();
  fetchTableData();
});

const maxHeight = ref(600);
</script>

<template>
  <div>
    <div class="top-btns">
      <el-space :size="30">
        <el-button type="primary" plain @click="upMove">上移</el-button>
        <el-button type="primary" plain @click="downMove">下移</el-button>
        <el-button type="primary" plain @click="addRow">增行</el-button>
        <el-button type="primary" plain @click="onSave">保存</el-button>
      </el-space>
    </div>
    <div class="top-tip">
      <blockquote class="q-quote">
        <div class="test1">
          <span style="font-weight: bold; color: red"
            >严禁修改【
            <span style="color: white; background-color: red; border-radius: 0.25rem">字段</span>
            】列的值，工号字段值必须为：GH，黄色行是每个模板必须要有的
          </span>
          <span style="color: white; background-color: green; border-radius: 0.25rem">属于Excel</span> 列值为【是】的行颜色为黄色。
        </div>
      </blockquote>
    </div>
    <div class="tp-table">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        @row-click="rowClick"
        size="small"
        :data="tableData"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
        :row-style="rowStyle"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-btns {
  margin-bottom: 10px;
}

.q-quote {
  padding: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1;
  background-color: #fafafa;
  border-left: 5px solid var(--el-color-primary);
  border-radius: 0 2px 2px 0;
}
</style>
