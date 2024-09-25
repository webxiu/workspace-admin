import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn } from "@/utils/table";

import { fetchProjectMgmtList } from "@/api/plmManage";
import dayjs from "dayjs";
import { roleUserList } from "@/api/systemManage";
import { PAGE_CONFIG } from "@/config/constant";

import { timeSettingList } from "@/api/oaManage/humanResources";

export const useConfig = () => {
  const rowData = ref();
  const dataList = ref([]);
  const staffTime = ref("");
  const loading = ref<boolean>(false);
  const currentLeftRow = ref();
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = ref(400);
  let formData: any = reactive({
    projectName: "",
    billNo: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions: any[] = reactive([
    { label: "项目名称", value: "projectName" },
    { label: "项目负责人", value: "projectUserId", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptionList();
    onSearch();
  });

  const getOptionList = () => {
    roleUserList({ roleId: "33" }).then(({ data }) => {
      searchOptions[1].children = (data || []).map((item) => {
        return { value: item.userId, label: item.userName };
      });
    });
  };

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "项目编号", prop: "billNo", minWidth: 140 },
      { label: "项目名称", prop: "projectName", minWidth: 180 },
      { label: "项目负责人", prop: "projectUserName", minWidth: 90 },
      { label: "状态", prop: "stateName", minWidth: 80 },
      { label: "项目阶段", prop: "stageName", minWidth: 90 },
      { label: "项目工期(天)", prop: "duration", minWidth: 100, align: "right" },
      { label: "项目模板", prop: "projectModelName", minWidth: 160 },
      { label: "立项日期", prop: "startDate", minWidth: 100 },
      { label: "计划结案日期", prop: "planEndDate", minWidth: 120 },
      { label: "实际开始日期", prop: "realStartDate", minWidth: 120 },
      { label: "实际结束日期", prop: "realEndDate", minWidth: 120 },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", width: 150, cellRenderer: (data) => <span>{dayjs(data.row.createDate).format("YYYY-MM-DD HH:mm:ss")}</span> }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchProjectMgmtList(formData)
      .then((res: any) => {
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };
    formData.page = page;
    formData.limit = limit;
    onSearch();
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  const leftRowDbClick = (row) => {
    currentLeftRow.value = row;
  };

  const leftRowClick = (row) => {
    currentLeftRow.value = row;
  };

  return {
    columns,
    dataList,
    maxHeight,
    currentLeftRow,
    pagination,
    searchOptions,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    leftRowDbClick,
    leftRowClick,
    handleCurrentChange
  };
};
