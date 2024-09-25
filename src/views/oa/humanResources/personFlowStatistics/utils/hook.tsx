/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-20 16:45:09
 */

import * as echarts from "echarts";

import { debounce, formatDate } from "@/utils/common";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, markRaw, onMounted, reactive, ref } from "vue";

import type { ECharts } from "echarts";
import StaffDetail from "../component/StaffDetail/index.vue";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { getOption } from "./config";
import { personFlowStatisticsList } from "@/api/oaManage/humanResources";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const chartRef = ref<HTMLElement>();
  const chartInstance = ref<ECharts>();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<Record<string, any>[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 48);
  const formData = reactive({ year: dayjs().format("YYYY") });

  onMounted(() => {
    getTableList();
    if (chartRef.value) {
      chartInstance.value = markRaw(echarts.init(chartRef.value));
    }
    window.onresize = debounce(() => {
      chartInstance.value?.resize();
    }, 10);
  });

  const getColumnConfig = async (dynamicCol: any[]) => {
    let columnData: TableColumnList[] = [{ label: "变动类型", prop: "changeType" }, ...dynamicCol];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    const colLen = 1; // 默认列数量
    const res = data?.slice(0, dynamicCol.length + colLen).map((item, i) => {
      const label = i >= colLen ? dynamicCol[i - colLen].label : item.label;
      const prop = i >= colLen ? dynamicCol[i - colLen].prop : item.prop;
      return { ...item, label, prop };
    });
    if (data?.length) columnData = res;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onChange = () => {
    getTableList();
  };
  const getTableList = () => {
    loading.value = true;
    personFlowStatisticsList({ year: formData.year })
      .then(({ data }) => {
        dataList.value = data;
        getChartData(data);
        loading.value = false;
      })
      .catch((err) => (loading.value = false));
  };

  function getChartData(data) {
    const xAxis: string[] = [];
    let dynamicCol: TableColumnList[] = [];
    if (data?.length) {
      const { changeType, ...reset } = data[0];
      const colKeys = Object.keys(reset).sort((a, b) => parseInt(a) - parseInt(b));
      dynamicCol = colKeys.map((key) => {
        const title = key + "月";
        xAxis.push(title);
        return {
          label: title,
          prop: key,
          align: "center",
          sortable: true,
          cellRenderer: ({ row }) => (
            <el-button type="primary" link disabled={!row[key]} onClick={() => onPreview(row, key)}>
              {row[key]}
            </el-button>
          )
        };
      });
    }
    getColumnConfig(dynamicCol);
    const option1 = getOption({ data: data, xAxis });
    chartInstance.value?.setOption(option1, true);
  }

  function onPreview(row, key) {
    const yearAndMonth = formatDate(formData.year + "-" + key, "YYYY-MM");
    addDialog({
      title: row.changeType + ":人员明细",
      props: { yearAndMonth, row },
      width: "95%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideItem: ["ok"],
      cancelButtonText: "关闭",
      contentRenderer: () => h(StaffDetail),
      beforeSure: (done) => done()
    });
  }
  // 导出
  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "人员流动统计表"
    });
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

  return {
    chartRef,
    formData,
    maxHeight,
    buttonList,
    columns,
    dataList,
    loading,
    onChange
  };
};
