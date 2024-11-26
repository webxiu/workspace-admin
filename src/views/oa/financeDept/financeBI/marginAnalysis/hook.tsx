import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, fixed2AndAddcomma } from "@/utils/common";
import { exportMarginAnalysisData, getMarginAnalysisData, marginResolutionData } from "@/api/oaManage/financeDept";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import dayjs from "dayjs";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";
import { message, showMessageBox } from "@/utils/message";

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

  const onCostAnalysis = () => {
    showMessageBox(`确认要解析${formData.yearAndMonth}的成本数据吗?`)
      .then(() => {
        marginResolutionData({ costDate: formData.yearAndMonth }).then((res) => {
          if (res.data) {
            message("成本解析成功", { type: "success" });
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: false },
    { clickHandler: onCostAnalysis, type: "primary", text: "成本解析", isDropDown: false }
  ]);

  return { buttonList, onFresh, columns, onTagSearch, queryParams, dataList, loading, searchOptions, maxHeight };
};
