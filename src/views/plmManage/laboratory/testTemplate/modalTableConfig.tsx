import { onMounted, ref, watch } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import { ElMessage } from "element-plus";
import { fetchTestProjectList } from "@/api/plmManage/laboratory";

export const useModalTableProject = (modelProjectList) => {
  const columns = ref([]);
  const dataList = ref([]);
  const curRow: any = ref({});
  const allProjectList: any = ref({});

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ index, prop }) => {
      modelProjectList.value = dataList.value;
    }
  });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      {
        label: "测试项目名称",
        prop: "projectName",
        minWidth: 130,
        cellRenderer(data) {
          return editCellRender({ type: "select", data, options: allProjectList.value, cellStyle: { color: "#606266", textAlign: "left" } });
        }
      }
    ];
    columns.value = setColumn({ columnData, dataList, operationColumn: false, isDragRow: true, dragSelector: ".modal_table" }, () => {
      const newArr = dataList.value.map((item, index) => {
        item["index"] = index + 1;
        return item;
      });
      dataList.value = newArr;
    });
  };

  const rowClick = (row, column) => {
    curRow.value = row;
  };

  const onAdd = () => {
    dataList.value.push({});
  };

  const onDel = () => {
    if (JSON.stringify(curRow.value) !== "{}") {
      dataList.value.splice(curRow.value.index, 1);
    } else {
      ElMessage({ message: "请选择行", type: "warning" });
    }
  };

  const fetchAllProjectList = () => {
    fetchTestProjectList({ page: 1, limit: 10000 }).then((res: any) => {
      if (res.data && res.data.records) {
        allProjectList.value = res.data.records.map((item) => ({ optionName: item.projectName, optionValue: item.id }));
      }
    });
  };

  onMounted(() => {
    fetchAllProjectList();
    getColumnConfig();
  });

  const rowClassName = ({ row, rowIndex }) => {
    row.index = rowIndex;
    return "";
  };

  return { columns, dataList, rowClick, onAdd, onDel, rowClassName };
};
