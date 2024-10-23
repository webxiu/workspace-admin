/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:18:16
 */

import {
  DataBaseItemType,
  DataFieldItemType,
  DataTableItemType,
  TableGroupItemType,
  dataBaseList,
  dataBaseSearch,
  dataFieldList,
  dataTableList
} from "@/api/systemManage";
import { getMenuColumns, setColumn } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const dataList = ref<DataBaseItemType[]>([]);
  const dataList2 = ref<DataTableItemType[]>([]);
  const dataList3 = ref<DataFieldItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const rowData = ref<DataBaseItemType>();
  const rowData2 = ref<DataTableItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const formData = reactive({ page: 1, limit: 10000 });
  const formData2 = reactive({ tableName: "", columnName: "", schemaName: "" });
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "表名", value: "tableName" },
    { label: "字段名", value: "columnName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [{ label: "库名", prop: "schemaName" }];
    let columnData2: TableColumnList[] = [
      { label: "表名", prop: "tableName" },
      { label: "备注", prop: "tableComment" }
    ];
    let columnData3: TableColumnList[] = [
      { label: "字段名", prop: "columnName" },
      { label: "字段类型", prop: "columnType" },
      { label: "备注", prop: "columnComment" }
    ];
    const { columnArrs, groupArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    columns.value = setColumn({ columnData, dragSelector: ".data-base", operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, dragSelector: ".data-table", operationColumn: false });
    columns3.value = setColumn({ columnData: columnData3, dragSelector: ".data-field", operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    getColumnConfig();
    getDataTableList(rowData.value);
  };
  const onRefresh3 = () => {
    getColumnConfig();
    getDataFieldList(rowData2.value);
  };

  // 搜索数据库表字段
  const onTagSearch = (values) => {
    Object.assign(formData2, values);
    getSearchList();
  };

  /** 0.数据库搜索列表 */
  const getSearchList = () => {
    if (!rowData.value?.schemaName) return message("请选择库名", { type: "error" });
    loading2.value = true;
    loading3.value = true;
    dataBaseSearch({ ...formData2, schemaName: rowData.value.schemaName })
      .then((res) => {
        loading2.value = false;
        loading3.value = false;
        dataList2.value = res.data.tableInfoList;
        dataList3.value = res.data.fieldInfoList;
      })
      .catch((err) => {
        loading2.value = true;
        loading3.value = true;
      });
  };

  /** 1.获取数据库列表 */
  const getTableList = () => {
    loading.value = true;
    dataBaseList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const onRowClick = (row: DataBaseItemType) => {
    rowData.value = row;
    getDataTableList(row);
  };

  // 2.获取数据表列表
  const getDataTableList = (row: DataBaseItemType) => {
    if (!row) return;
    loading2.value = true;
    dataTableList({ schemaName: row.schemaName })
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch(() => (loading2.value = false));
  };

  const onRowClick2 = (row: DataTableItemType) => {
    rowData2.value = row;
    getDataFieldList(row);
  };

  // 3.获取数据字段列表
  const getDataFieldList = (row: DataTableItemType) => {
    if (!row || !rowData.value) return;
    loading3.value = true;
    dataFieldList({ schemaName: rowData.value.schemaName, tableName: row.tableName })
      .then((res) => {
        loading3.value = false;
        dataList3.value = res.data;
      })
      .catch(() => (loading3.value = false));
  };

  return {
    loading,
    loading2,
    loading3,
    columns,
    columns2,
    columns3,
    dataList,
    dataList2,
    dataList3,
    maxHeight,
    searchOptions,
    groupArrsList,
    onRefresh,
    onRefresh2,
    onRefresh3,
    onTagSearch,
    onRowClick,
    onRowClick2
  };
};
