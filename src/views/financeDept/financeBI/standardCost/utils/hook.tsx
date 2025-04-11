/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-19 16:34:12
 */

import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG, numberOptions } from "@/config/constant";
import { useEleHeight } from "@/hooks";
import regExp from "@/utils/regExp";
import { setColumn, downloadDataToExcel, getMenuColumns, getEnumDictList, updateButtonList } from "@/utils/table";
import { OptionItemType } from "@/api/plmManage";
import { handleTree } from "@/utils/tree";

import { standardCostList, StandardCostItemType, materialManageList, MaterialManageItemType } from "@/api/oaManage/financeDept";
import { message } from "@/utils/message";
import { debounce } from "@/utils/common";
import dayjs from "dayjs";

export const useConfig = () => {
  const tempCode = ref<string>("");
  const loading = ref<boolean>(false);
  const sLoading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const unitPriceList = ref<OptionItemType[]>();
  const dataList = ref<StandardCostItemType[]>([]);
  const dataList2 = ref([]);
  const materialList = ref<MaterialManageItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const activeName = ref("detail");
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 108);
  const formData = reactive({
    page: 1,
    number: "",
    measuredQuantity: 1,
    priceValue: "3",
    includeAttritionRate: 1,
    purchaseDate: dayjs().format("YYYY-MM"),
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
      { label: "物料分类", prop: "groupName", minWidth: 200, fixed: "left" },
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
    let columnData2: TableColumnList[] = [
      { label: "物料分类", prop: "groupName" },
      { label: "成品物料编码", prop: "number" },
      { label: "成品物料名称", prop: "name" },
      { label: "成品规格型号", prop: "specification" },
      { label: "不含税金额合计", prop: "money" },
      { label: "含税金额合计", prop: "taxMoney" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      indexColumn: { fixed: "left" },
      radioColumn: { hide: true },
      operationColumn: { hide: true }
    });
    columns2.value = setColumn({
      columnData: columnData2,
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
      return message.warning("请选择物料编码");
    } else if (!regExp.number.test(formData.measuredQuantity as unknown as string)) {
      return message.warning("测算数量输入错误");
    }
    loading.value = true;
    dataList.value = [];
    dataList2.value = [];

    let reqData = { ...formData };
    if (formData.priceValue != "3") {
      reqData = { ...formData, purchaseDate: undefined };
    }
    standardCostList(reqData)
      .then(({ data }) => {
        loading.value = false;
        const result = handleTree(data.list || [], "childId", "parentId", "children");
        dataList.value = result;
        dataList2.value = data.mapList || [];
      })
      .catch((err) => {
        dataList.value = [];
        dataList2.value = [];
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
    const mapData = {
      detail: { title: "明细", list: dataList, cols: columns },
      total: { title: "分类汇总", list: dataList2, cols: columns2 }
    };

    const exportList = mapData[activeName.value].list;
    const exportCols = mapData[activeName.value].cols;
    const exportTitle = mapData[activeName.value].title;
    if (!exportList.value?.length) return message.warning("没有可导出的数据");
    downloadDataToExcel([
      {
        dataList: exportList.value,
        columns: exportCols.value,
        sheetName: `标准成本-${exportTitle}`
      }
    ]);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    formData,
    loading,
    sLoading,
    activeName,
    columns,
    dataList,
    columns2,
    dataList2,
    maxHeight,
    buttonList,
    materialList,
    unitPriceList,
    numberOptions,
    oSearch,
    onRefresh,
    onKeyDown,
    onChange,
    onClick
  };
};
