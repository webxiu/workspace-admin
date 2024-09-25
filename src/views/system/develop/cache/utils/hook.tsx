/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-11 14:48:23
 */

import { CacheManageItemType, cacheManageList } from "@/api/systemManage";
import { getMenuColumns, setColumn } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { TableGroupItemType } from "@/api/systemManage";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<CacheManageItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const formData = reactive({ page: 1, limit: 10000 });
  const groupArrsList = ref<TableGroupItemType[]>([]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "key", prop: "cacheKey" },
      { label: "value", prop: "access_token" },
      { label: "最近一次访问时间", prop: "lastAccess", minWidth: 160 },
      { label: "过期时间", prop: "expiredTime", minWidth: 160 },
      { label: "缓存时间(毫秒)", prop: "ttl", minWidth: 120, align: "right" }
    ];
    const { columnArrs, groupArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    columns.value = setColumn({ columnData, dragSelector: ".cache-manage", operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    cacheManageList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch(() => (loading.value = false));
  };

  return { loading, columns, dataList, maxHeight, groupArrsList, onRefresh };
};
