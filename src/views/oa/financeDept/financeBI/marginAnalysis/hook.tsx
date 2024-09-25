import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, fixed2AndAddcomma } from "@/utils/common";
import { exportMarginAnalysisData, getMarginAnalysisData } from "@/api/oaManage/financeDept";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import dayjs from "dayjs";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";

export const useMarginAnalysis = () => {
  const dataList = ref([]);
  const columns = ref([]);
  const loading = ref(false);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);

  const formData = reactive({
    yearAndMonth: "",
    number: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([{ label: "年月", value: "date", type: "month", format: "YYYY-MM" }]);

  const lastMonth = dayjs().add(-1, "month").format("YYYY-MM");

  const queryParams = reactive<QueryParamsType>({ date: lastMonth });

  const route = useRoute();

  onMounted(() => {
    getColumnConfig();
  });

  const onSearch = () => {
    getMarginAnalysisData(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data;
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品编码", prop: "FNUMBER" },
      { label: "产品名称", prop: "FNAME" },
      { label: "规格型号", prop: "FSPECIFICATION" },
      { label: "销售部门", prop: "FDEPTNAME" },
      { label: "销售组", prop: "FGROUPNAME" },
      { label: "销售员", prop: "FSALEERNAME" },
      { label: "客户编码", prop: "FCUSTNUMBER" },
      { label: "客户名称", prop: "FSHORTNAME" },
      { label: "计价数量", prop: "FPRICEQTY" },
      { label: "不含税金额", prop: "FNOTAXAMOUNT" },
      { label: "销售单价", prop: "FPRICE" },
      { label: "出库数量", prop: "FREALQTY" },
      { label: "出库成本", prop: "FCOSTAMOUNT_LC" },
      { label: "成本单价", prop: "FCOSTPRICE" },
      { label: "毛利", prop: "FGROSSMARGIN" },
      { label: "毛利率", prop: "FGROSSMARGINRATE" },
      { label: "材料成本", prop: "FMATERIALUNIT" },
      { label: "人工成本", prop: "FSALARYUNIT" },
      { label: "费用", prop: "FEXPENSEUNIT" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onExport = () => {
    exportMarginAnalysisData({ ...formData, menuId: route.query.menuId }).then((res: any) => {
      if (res.data) {
        const fileName = res.data.split("/").at(-1);
        downloadFile(res.data, fileName);
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  // 搜索
  const onTagSearch = (values) => {
    formData.yearAndMonth = values.date;
    formData.number = values.number ?? "";
    onSearch();
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

  const getSummaries = (param) => {
    const { columns, data } = param;
    const shouldTotalArr = [
      "FPRICEQTY",
      "FNOTAXAMOUNT",
      "FPRICE",
      "FREALQTY",
      "FSALARYUNIT",
      "FEXPENSEUNIT",
      "FCOSTAMOUNT_LC",
      "FMATERIALUNIT",
      "FCOSTPRICE",
      "FGROSSMARGIN",
      "FGROSSMARGINRATE"
    ];
    const sums = [];
    columns.forEach((column, index) => {
      // 第一列 显示文字 小计
      if (column.property === "radio") {
        sums[index] = "合计";
        return;
      }
      if (shouldTotalArr.includes(column.property)) {
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = ["FPRICEQTY", "FREALQTY", "FGROSSMARGINRATE"].includes(column.property)
            ? (+sums[index]).toLocaleString()
            : fixed2AndAddcomma(+sums[index].toFixed(2)); // 保留2位小数，解决小数列合计精度缺失的问题
        } else {
          sums[index] = ""; // 其余列一律不进行合计，结果输出空
        }
      }
    });
    return sums;
  };

  return { buttonList, onFresh, columns, onTagSearch, queryParams, dataList, getSummaries, loading, searchOptions, maxHeight };
};
