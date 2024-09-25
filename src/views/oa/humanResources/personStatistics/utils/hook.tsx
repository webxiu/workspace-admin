import AddModal, { StatisticsType } from "../addModal.vue";
import { DeptStatisticsItemType, JobLevelStatisticsItemType, deptStatistics, jobLevelStatistics } from "@/api/oaManage/humanResources";
import { SummaryMethodProps, downloadDataToExcel, getMenuColumns, getSummaries, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, ref } from "vue";

import { Download } from "@element-plus/icons-vue";
import { TableGroupItemType } from "@/api/systemManage";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<DeptStatisticsItemType[]>([]);
  const dataList2 = ref<JobLevelStatisticsItemType[]>([]);
  const groupArrsList = ref<TableGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "部门", prop: "deptName" },
      { label: "人数", prop: "deptTotal" }
    ];

    let columnData2: TableColumnList[] = [
      { label: "职级", prop: "rank" },
      { label: "人数", prop: "rankTotal" }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { hide: true }, radioColumn: { width: 50 } });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: { hide: true }, radioColumn: { width: 50 } });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    const p1 = deptStatistics();
    const p2 = jobLevelStatistics();
    Promise.all([p1, p2])
      .then((res) => {
        loading.value = false;
        const [data1, data2] = res.map((item) => item.data);
        dataList.value = data1 as DeptStatisticsItemType[];
        dataList2.value = data2 as JobLevelStatisticsItemType[];
      })
      .finally(() => (loading.value = false));
  };

  /** 自定的统计 */
  const onSummaryMethod = (params: SummaryMethodProps<DeptStatisticsItemType>) => {
    return getSummaries({ params, excludeProps: ["deptName"] });
  };
  /** 自定的统计 */
  const onSummaryMethod2 = (params: SummaryMethodProps<JobLevelStatisticsItemType>) => {
    return getSummaries({ params, excludeProps: ["employeKind"] });
  };

  function onShowDesc(type: StatisticsType, row: DeptStatisticsItemType | JobLevelStatisticsItemType) {
    addDialog({
      title: "人员明细",
      props: { type, data: row },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideItem: ["ok"],
      cancelButtonText: "关闭",
      contentRenderer: () => h(AddModal),
      beforeSure: (done, { options }) => done()
    });
  }

  function onExport() {
    downloadDataToExcel(
      [
        { dataList: dataList.value, columns: columns.value, sheetName: "部门人数" },
        { dataList: dataList2.value, columns: columns2.value, sheetName: "职级人数" }
      ],
      "人员统计"
    );
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }]);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    buttonList,
    groupArrsList,
    onRefresh,
    onShowDesc,
    onSummaryMethod,
    onSummaryMethod2
  };
};
