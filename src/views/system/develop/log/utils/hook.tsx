/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:19:51
 */

import { UserLogItemType, userLogList, userLogExport } from "@/api/systemManage";
import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<UserLogItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 51);
  const curDate = dayjs().format("YYYY-MM-DD");
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    userName: "",
    userCode: "",
    remark: "",
    startDate: curDate,
    endDate: curDate
  });
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "员工姓名", value: "userName" },
    { label: "员工工号", value: "userCode" },
    { label: "查询日期", value: "date", type: "daterange", format: "YYYY-MM-DD" },
    { label: "查询备注", value: "remark" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "员工ID", prop: "userId", width: 120, align: "right" },
      { label: "员工姓名", prop: "userName", width: 120, sortable: true },
      { label: "员工工号", prop: "userCode", width: 120, align: "right", sortable: true },
      { label: "目标名称", prop: "method", width: 160 },
      { label: "目标编号", prop: "methodCode", width: 120, align: "right" },
      { label: "备注", prop: "remark", width: 200 },
      {
        label: "目标类型",
        prop: "methodType",
        cellRenderer({ row }) {
          const bgColor = { page: "#009688", method: "#ff5722" };
          const isMethod = row.methodType === "方法" ? "method" : "page";
          const style = { padding: "2px 4px", color: "#fff", borderRadius: "4px", background: bgColor[isMethod] };
          return row.methodType ? <span style={style}>{row.methodType}</span> : null;
        }
      },
      { label: "请求方法", prop: "requestType", sortable: true },
      { label: "访问地址", prop: "url", width: 160 },
      { label: "耗时(ms)", prop: "timeConsuming", align: "right" },
      { label: "请求参数", prop: "requestParams", width: 160 },
      { label: "返回状态", prop: "responseCode", align: "right" },
      { label: "客户端IP", prop: "ipAddress", width: 160 },
      { label: "客户端浏览器", prop: "browser", width: 240 },
      { label: "客户端系统", prop: "system", width: 260 },
      { label: "操作时间", prop: "inDate", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dragSelector: ".log-manage", operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = ({ date, ...values }) => {
    const dates = date ? date.split(" ~ ") : [];
    formData.startDate = dates[0];
    formData.endDate = dates[1];
    Object.assign(formData, values);
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    userLogList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    const excelHeader = columns.value.map((item, index) => {
      return { field: item.prop, title: item.label, width: 160, key: `0-${index}}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
    });
    const headConfig = {
      ...formData,
      excel: {
        excelName: "日志管理",
        excelHeader: JSON.stringify(excelHeader)
      }
    };
    userLogExport(headConfig)
      .then((res) => {
        window.open(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    pagination,
    buttonList,
    onRefresh,
    onTagSearch,
    onSizeChange,
    onCurrentChange
  };
};
