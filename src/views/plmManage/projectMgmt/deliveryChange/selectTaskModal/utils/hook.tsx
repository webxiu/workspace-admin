import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn } from "@/utils/table";

import { fetchProjectMgmtList, getBOMTableRowSelectOptions } from "@/api/plmManage";
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
  const findTaskEnums = ref([]);
  let formData: any = reactive({
    projectName: "",
    billNo: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions: any[] = reactive([
    // { label: "项目名称", value: "projectName" },
    // { label: "项目负责人", value: "projectUserId", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptionList();
    onSearch();
  });

  const getOptionList = () => {
    // roleUserList({ roleId: "33" }).then(({ data }) => {
    //   searchOptions[1].children = (data || []).map((item) => {
    //     return { value: item.userId, label: item.userName };
    //   });
    // });
    getBOMTableRowSelectOptions({ optioncode: "ProjectTaskStatus, BillStatus, PLMResourceAuthEnum" }).then((res) => {
      if (res.data) {
        console.log(res.data, "ggg");
        const findTaskOpts = res.data.find((item) => item.optionCode === "ProjectTaskStatus")?.optionList || [];
        findTaskEnums.value = findTaskOpts;
      }
    });
  };

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "任务名称", prop: "name" },
      {
        label: "责任人",
        width: 85,
        prop: "masterUserName",
        cellRenderer(data) {
          return <span>{data.row.projectTaskResponsiblePersonnelVOList[0]?.masterUserName}</span>;
        }
      },
      { label: "工期(天)", prop: "duration", align: "right" },

      // { label: "开始日期", prop: "start", minWidth: 80 },
      // { label: "结束日期", prop: "end", minWidth: 90 },

      {
        label: "状态",

        prop: "status",
        cellRenderer(data) {
          return <span>{findTaskEnums.value.find((item) => item.optionValue == data.row.status)?.optionName}</span>;
        }
      },

      { label: "进度(%)", prop: "progress", align: "right" }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    // fetchProjectMgmtList(formData)
    //   .then((res: any) => {
    //     const data = res.data;
    //     dataList.value = data || [];
    //   })
    //   .catch((err) => (loading.value = false));
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
