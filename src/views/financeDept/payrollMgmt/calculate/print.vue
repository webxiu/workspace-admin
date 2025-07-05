<template>
  <div class="print-box">
    <el-form inline>
      <el-form-item label="打印内容">
        <el-select v-model="printType" placeholder="请选择 (默认全部)" multiple collapse-tags collapse-tags-tooltip clearable style="width: 260px">
          <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div ref="printRef" class="ui-w-100">
      <PrintTable v-for="item in pageList" :key="item.type" :columns="item.columns" :dataList="item.dataList" :autoIndex="item.autoIndex" :align="item.align" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from "vue";
import Print from "@/utils/print";
import { message } from "@/utils/message";
import { formatDate } from "@/utils/common";
import { App_INFO, useLocalStorage } from "@/utils/storage";
import { fetchDetailStaffMoneyCheckList } from "@/api/oaManage/financeDept";
import PrintTable, { TableColumnType } from "@/components/PrintTable/index.vue";
import { salaryConfig, summaryConfig } from "./utils/printConfig";

interface Props {
  columns?: TableColumnList[];
  formData?: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  formData: () => ({})
});
const printRef = ref();
const deptList = ref([]); // 部门汇总表
const deptGrandList = ref([]); // 部门工种汇总表
const dataList = ref([]); // 工资汇总表
const companyName = useLocalStorage<any>(App_INFO).getItem().orgName;
const dateStr = formatDate(props.formData.yearMonth, "YYYY年MM月");
const result1 = salaryConfig({ companyName, dateStr, formData: props.formData });
const result2 = summaryConfig({ companyName, dateStr, summaryTitle: "部门汇总" });
const result3 = summaryConfig({ companyName, dateStr, summaryTitle: "部门工种汇总" });
const columns = computed<TableColumnType[][]>(() => Object.values(result1));
const columns2 = computed<TableColumnType[][]>(() => Object.values(result2));
const columns3 = computed<TableColumnType[][]>(() => Object.values(result3));
const pageList = computed(() => {
  const mergeArr = [
    { type: "dept", columns: columns2.value, dataList: deptList.value, autoIndex: false },
    { type: "deptGroup", columns: columns3.value, dataList: deptGrandList.value, autoIndex: false, align: "right" },
    { type: "salary", columns: columns.value, dataList: dataList.value, autoIndex: false }
  ];
  if (printType.value.length === 0) return mergeArr;
  return mergeArr.filter((item) => printType.value.includes(item.type));
});
const printType = ref([]);
const selectList = reactive([
  { label: "部门汇总表", value: "dept" },
  { label: "部门汇总表(工种)", value: "deptGroup" },
  { label: "工资发放表", value: "salary" }
]);

onMounted(() => {
  getTableAll();
  getTableByUserType();
});

function getTableByUserType() {
  fetchDetailStaffMoneyCheckList(props.formData)
    .then(({ data }) => {
      /** 工资发放表汇总 */
      composeData({
        datas: data?.records || [],
        columns: result1.dataCols,
        isDataRow: true,
        groupField: "deptName",
        excludeCols: ["index", "staffName", "deptName"],
        excludeFormat: ["index", "staffName", "deptName"],
        onSubTotal: (name, groupList) => ({ staffName: `${name}合计 (${groupList.length}人)`, colspan: 3, active: true }),
        onSummary: (datas) => ({ staffName: `汇总 (${datas.length}人)`, colspan: 3, active: true }),
        onFinish: (resultData) => (dataList.value = resultData)
      });
    })
    .catch(() => (dataList.value = []));
}
function getTableAll() {
  fetchDetailStaffMoneyCheckList({ ...props.formData, userType: undefined, limit: 10000 })
    .then(({ data }) => {
      /** 部门汇总 */
      composeData({
        datas: data?.records || [],
        columns: result2.dataCols,
        isDataRow: false,
        groupField: "deptName",
        excludeCols: ["deptName", "employeeKind"],
        excludeFormat: ["deptName", "employeeKind"],
        onSubTotal: (name) => ({ deptName: name }),
        onSummary: () => ({ deptName: `部门汇总`, colspan: 1, active: true }),
        onFinish: (resultData) => (deptList.value = resultData)
      });

      /** 部门工种汇总 */
      composeData({
        datas: data?.records || [],
        columns: result2.dataCols,
        isDataRow: false,
        groupField: "deptName",
        excludeCols: ["deptName", "employeeKind"],
        excludeFormat: ["deptName", "employeeKind"],
        onSubTotal: (name) => ({ deptName: name }),
        onGroupMark: (item) => item.employeeKind === "员工",
        onSummary: () => ({ deptName: `部门汇总`, colspan: 1, active: true }),
        onFinish: (resultData) => {
          const datas = resultData.filter((item) => item.deptName !== "部门汇总");
          composeData({
            datas: datas || [],
            columns: result3.dataCols,
            isDataRow: true,
            groupField: "employeeKind",
            excludeCols: ["deptName", "employeeKind"],
            excludeFormat: ["deptName", "employeeKind"],
            onSubTotal: (name, groupList) => ({ deptName: `${name}汇总 (${groupList.length})`, colspan: 1, active: true }),
            onSummary: (datas) => ({ deptName: `汇总 (${datas.length})`, colspan: 1, active: true }),
            onFinish: (res) => (deptGrandList.value = res)
          });
        }
      });
    })
    .catch(() => {
      dataList.value = [];
      deptList.value = [];
      deptGrandList.value = [];
    });
}

/**
 * 数据组合
 * @param options {
   rawData: 表格数据,
   columns: 数据列,
   isDataRow:  是否添加数据行
   groupField: 分组字段
   excludeCols: 不汇总的列,
   excludeFormat: 不格式化的列
   onGroupMark: 人员分组标记方法(处理同时为员工和职员的情况)
   onSubTotal: 小计方法
   onSummary: 小计方法
   onFinish: 完成方法
 }
 */

function composeData(options) {
  const { datas, columns, isDataRow, excludeCols, excludeFormat = [], groupField, onGroupMark, onSubTotal, onSummary, onFinish } = options;
  const groupMap = {}; // 按部门分组
  const summaryMap = {}; // 汇总数据
  const resultData = []; // 最终数据
  const repKey = "_group"; // 重复标识
  columns.forEach(({ prop }) => {
    if (!excludeFormat.includes(prop)) {
      summaryMap[prop] = 0;
    }
  });

  // 根据部门分组
  datas.forEach((item) => {
    const _keyName = onGroupMark && onGroupMark(item) ? item[groupField] + repKey : item[groupField];
    if (!groupMap[_keyName]) groupMap[_keyName] = [];
    groupMap[_keyName].push(item);
  });
  // 遍历每个部门
  Object.keys(groupMap).forEach((keyName) => {
    const deptGroups = groupMap[keyName];
    const deptTotals = {};
    if (isDataRow) {
      deptGroups.forEach((item) => resultData.push(item));
    }

    deptGroups.forEach((item) => {
      columns.forEach(({ prop }) => {
        if (excludeCols.includes(prop)) {
          deptTotals[prop] = item[prop];
        } else {
          if (!deptTotals[prop]) deptTotals[prop] = 0;
          const value = parseFloat(item[prop]) || 0;
          deptTotals[prop] += value;
          summaryMap[prop] += value;
        }
      });
    });
    Object.keys(deptTotals).forEach((prop) => {
      if (excludeFormat.includes(prop)) return;
      deptTotals[prop] = deptTotals[prop].toFixed(2);
    });
    const subRes = onSubTotal(keyName.replace(repKey, ""), deptGroups) || {};
    resultData.push({ ...deptTotals, ...subRes });
  });

  Object.keys(summaryMap).forEach((prop) => {
    if (excludeFormat.includes(prop)) return;
    summaryMap[prop] = summaryMap[prop].toFixed(2);
  });
  const summaryRes = onSummary(datas) || {};
  resultData.push({ ...summaryMap, ...summaryRes });
  onFinish(resultData);
}

function onPrint() {
  if (!dataList.value.length) {
    return message.error("无打印数据");
  }
  if (printRef.value) {
    Print(printRef.value);
  }
}

defineExpose({ onPrint });
</script>

<style scoped lang="scss">
.print-salary {
  margin-bottom: 20px;
}
@media print {
  @page {
    size: a4 landscape;
    margin: 6mm;
  }
  .print-salary {
    margin-bottom: 0 !important;
  }

  div,
  table,
  td {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
