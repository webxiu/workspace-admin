/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-19 16:34:12
 */

import { computed, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";

import { useEleHeight } from "@/hooks";
import { handleTree } from "@/utils/tree";
import { Download } from "@element-plus/icons-vue";
import regExp from "@/utils/regExp";
import { setColumn, downloadDataToExcel, getMenuColumns, getEnumDictList, updateButtonList } from "@/utils/table";
import { OptionItemType } from "@/api/plmManage";

import { standardCostList, StandardCostItemType, materialManageList, MaterialManageItemType } from "@/api/oaManage/financeDept";
import { message } from "@/utils/message";
import { debounce } from "@/utils/common";

export const useConfig = () => {
  const tempCode = ref<string>("");
  const loading = ref<boolean>(false);
  const sLoading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const unitPriceList = ref<OptionItemType[]>();
  const dataList = ref<StandardCostItemType[]>([]);
  const materialList = ref<MaterialManageItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 66);
  const includeLossList = ref<{ optionName: string; optionValue: number }[]>([
    { optionName: "否", optionValue: 0 },
    { optionName: "是", optionValue: 1 }
  ]);
  const formData = reactive({
    page: 1,
    number: "",
    measuredQuantity: "1",
    priceValue: "1",
    includeAttritionRate: 1,
    limit: PAGE_CONFIG.pageSize
  });

  onMounted(() => {
    getColumnConfig();
    getOptionList();
    getCodeList();
    oSearch();
  });

  // 获取下拉框列表
  const getOptionList = () => {
    getEnumDictList(["UnitPriceValue"])
      .then((res) => (unitPriceList.value = res.UnitPriceValue))
      .catch(console.log);
  };

  const onKeyDown = debounce((ev) => {
    if ([38, 40].includes(ev.keyCode)) return; // 上下移动
    if (ev.keyCode === 13) return oSearch(); // 按回车选择
    getCodeList(ev.target.value);
  });

  // 获取物料编码下拉列表
  const getCodeList = (number = "") => {
    sLoading.value = true;
    materialManageList({ number: number.trim(), page: 1, limit: 5 })
      .then(({ data }) => {
        sLoading.value = false;
        materialList.value = data.records || [];
      })
      .catch(() => (sLoading.value = false));
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "物料编码", prop: "number", minWidth: 200, fixed: "left" },
      { label: "名称", prop: "name", minWidth: 180, fixed: "left" },
      { label: "物料序号", prop: "fseq", minWidth: 80, align: "right" },
      { label: "规格型号", prop: "specification", minWidth: 260 },
      { label: "物料属性", prop: "fcaption", minWidth: 100 },
      { label: "分子", prop: "numerator", minWidth: 80, align: "right" },
      { label: "分母", prop: "denominator", minWidth: 80, align: "right" },
      { label: "子项单位", prop: "itemUnitName", minWidth: 80 },
      { label: "单价", prop: "sumPrice", align: "right" },
      { label: "标准用量", prop: "standardDosage", minWidth: 80, align: "right" },
      { label: "金额", prop: "money", align: "right" },
      { label: "固定损耗", prop: "fixscrapqty", align: "right" },
      { label: "变动损耗率", prop: "scraprate", align: "right" },
      { label: "禁用状态", prop: "forbidstatus" },
      { label: "基本单位", prop: "baseUnitName", minWidth: 80 },
      { label: "生效时间", prop: "feffectivedate", minWidth: 100 },
      { label: "失效时间", prop: "fexpirydate", minWidth: 100 },
      { label: "标准工时", prop: "fperunitstandhour", align: "right" },
      { label: "标准人员准备工时", prop: "fstdlaborpreparetime", align: "right" },
      { label: "标准人员实作工时", prop: "fstdlaborprocesstime", align: "right" },
      { label: "标准机器准备工时", prop: "fstdmachinepreparetime", align: "right" },
      { label: "标准机器实作工时", prop: "fstdmachineprocesstime", align: "right" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      indexColumn: { fixed: "left" },
      radioColumn: { hide: true },
      operationColumn: { hide: true }
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    oSearch();
  };

  const oSearch = () => {
    if (!formData.number) {
      return message("请选择物料编码", { type: "warning" });
    } else if (!regExp.number.test(formData.measuredQuantity)) {
      return message("测算数量输入错误", { type: "warning" });
    }
    loading.value = true;
    dataList.value = [];
    standardCostList(formData)
      .then(({ data }) => {
        loading.value = false;
        const result = handleTree(data || [], "childId", "parentId", "children");
        dataList.value = result;
      })
      .catch((err) => {
        dataList.value = [];
        loading.value = false;
      });
  };

  // 记录选中的值
  const onChange = (value) => {
    tempCode.value = value;
  };

  // 显示选中的值
  const onClick = () => {
    formData.number = "";
    const timer = setTimeout(() => {
      formData.number = tempCode.value;
      clearTimeout(timer);
    });
  };

  const onExport = () => {
    if (!dataList.value?.length) return message("没有可导出的数据", { type: "warning" });
    downloadDataToExcel([
      {
        dataList: dataList.value,
        columns: columns.value,
        sheetName: "标准成本"
      }
    ]);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    formData,
    loading,
    sLoading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    materialList,
    unitPriceList,
    includeLossList,
    oSearch,
    onRefresh,
    onKeyDown,
    onChange,
    onClick
  };
};
