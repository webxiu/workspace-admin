<script setup lang="ts">
import { fetchMoneyTemplateList, saveMoneyTemplateConfig } from "@/api/oaManage/financeDept";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const tableData = ref([]);
const loading = ref(false);
const currentRow: any = ref({});
const curColumnProp = ref("");
const curRowIdx = ref();

defineOptions({ name: "TemplateConfig" });

const route = useRoute();
const fieldTypeOption = [
  { label: "varchar", value: "varchar" },
  { label: "decimal", value: "decimal" },
  { label: "bit", value: "bit" },
  { label: "datetime", value: "datetime" }
];
const fieldOtherOption = [
  { label: "是", value: "是" },
  { label: "否", value: "否" }
];

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

const rowClick = (row) => {
  currentRow.value = row;
};

const cellDbClick = (row, column) => {
  currentRow.value = row;

  if (column.property !== "numberNo") row.isEditMode = true;
  curColumnProp.value = column.property;
  curRowIdx.value = row.numberNo - 1;
};

onMounted(() => {
  fetchTableData();
});
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
      <el-table
        size="small"
        border
        :data="tableData"
        style="width: 100%; height: calc(100vh - 215px)"
        v-loading="loading"
        @row-click="rowClick"
        :row-style="rowStyle"
        @cell-dblclick="cellDbClick"
        highlight-current-row
      >
        <el-table-column prop="numberNo" align="center" label="序号" width="80" sortable />
        <el-table-column prop="fieldName" label="字段" width="150" sortable>
          <template #default="{ row, column }">
            <el-input
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              v-model="row.fieldName"
              size="small"
              @blur="row.isEditMode = false"
            />
            <span v-else>{{ row.fieldName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fieldTitle" label="名称" width="150" sortable>
          <template #default="{ row, column }">
            <el-input
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              v-model="row.fieldTitle"
              size="small"
              @blur="row.isEditMode = false"
            />
            <span v-else>{{ row.fieldTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fieldType" label="类型" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.fieldType"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldTypeOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.fieldType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="width" label="宽度" width="100" sortable>
          <template #default="{ row, column }">
            <el-input
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              v-model="row.width"
              size="small"
              @blur="row.isEditMode = false"
            />
            <span v-else>{{ row.width }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="disable" label="PC显示" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.disable"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.disable }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appShow" label="APP显示" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.appShow"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.appShow }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appNo" label="APP序号" sortable>
          <template #default="{ row, column }">
            <!-- <el-select v-model="row.appNo" size="small" v-if="row.isEditMode" @blur="row.isEditMode = false">
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              v-model="row.appNo"
              size="small"
              @blur="row.isEditMode = false"
            />
            <span v-else>{{ row.appNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣项" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.deduction"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.deduction }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="excel" label="导出Excel" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.excel"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.excel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="frozen" label="冻结" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.frozen"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.frozen }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="合计" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.total"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="importCheck" label="强制校验" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.importCheck"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.importCheck }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="encryptedStorage" label="加密存储" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.encryptedStorage"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.encryptedStorage }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inExcel" label="属于Excel" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.inExcel"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.inExcel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="allowEdit" label="允许修改" sortable>
          <template #default="{ row, column }">
            <el-select
              v-model="row.allowEdit"
              size="small"
              v-if="row.isEditMode && column.property === curColumnProp && curRowIdx === row.numberNo - 1"
              @blur="row.isEditMode = false"
            >
              <el-option v-for="item in fieldOtherOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ row.allowEdit }}</span>
          </template>
        </el-table-column>
      </el-table>
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
