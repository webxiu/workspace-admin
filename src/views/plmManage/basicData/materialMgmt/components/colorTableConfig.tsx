import { ElMessage, ElMessageBox } from "element-plus";
import { enumDictionaryOptionAdd, enumDictionaryOptionDelete, enumDictionaryOptionSelectMax, enumDictionaryOptionUpdate } from "@/api/systemManage";
import { onMounted, reactive, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";

export const useColorTable = (props) => {
  const columns = ref([]);
  const colorList = ref([]);
  const curRow: any = ref({});
  const loading = ref(false);
  const maxNum = ref(0);
  const editRowIds = ref([]);
  const oldColorList = ref([]);
  const originDataInfo: any = ref({});
  const searchOptions = reactive<SearchOptionType[]>([{ label: "颜色名称", value: "goodColor" }]);

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ index, prop, row }) => {
      editRowIds.value.push(row.id);
    }
  });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      {
        label: "颜色名称",
        prop: "optionName",
        minWidth: 130,
        cellRenderer(data) {
          return editCellRender({ data, cellStyle: { color: "#606266", textAlign: "left" } });
        }
      }
    ];
    columns.value = setColumn({ columnData, operationColumn: { hide: true } });
  };

  const rowClick = (row, column) => {
    curRow.value = row;
  };

  const onAdd = () => {
    //
    colorList.value.push({});
  };

  const onDel = () => {
    if (JSON.stringify(curRow.value) === "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }

    if (curRow.value.id) {
      console.log("调用接口");
      ElMessageBox.confirm(`确认要删除名称为【${curRow.value.optionName}】的颜色吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          enumDictionaryOptionDelete({ optionListIdList: [curRow.value.id] }).then((res: any) => {
            if (res.data) {
              ElMessage({ message: "删除成功", type: "success" });
              fetchColorList();
              fetchMaxNum();
              curRow.value = {};
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      const pos = colorList.value.findIndex((item) => item.colorName === curRow.value.colorName);

      if (pos !== -1) {
        colorList.value.splice(pos, 1);
      }
    }
  };

  const onSave = () => {
    const noIdData = colorList.value.filter((item) => !item.id && item.optionName);
    const hasIdData = colorList.value.filter((item) => item.id && item.optionName && editRowIds.value.includes(item.id));

    // 遍历修改
    const editPromiseArr = [];
    if (hasIdData.length) {
      hasIdData.forEach((item) => {
        editPromiseArr.push(enumDictionaryOptionUpdate(item));
      });

      loading.value = true;

      Promise.all(editPromiseArr)
        .then((res: any) => {
          if (res && Array.isArray(res)) {
            if (res.every((item) => item.data)) {
              ElMessage({ message: "保存成功", type: "success" });
              fetchColorList();
              fetchMaxNum();
            }
          }
        })
        .finally(() => (loading.value = false));

      return;
    }

    // 遍历添加
    const addPromiseArr = [];
    if (noIdData.length) {
      noIdData.forEach((item) => {
        addPromiseArr.push(
          enumDictionaryOptionAdd({
            id: "",
            optionId: 485,
            displaySeq: maxNum.value,
            optionName: item.optionName,
            reserve1: "",
            optionValue: item.optionName,
            kingdeeValue: ""
          })
        );
        maxNum.value += 1;
      });
    }

    loading.value = true;

    Promise.all(addPromiseArr)
      .then((res: any) => {
        if (res && Array.isArray(res) && res.length) {
          if (res.every((item) => item.data)) {
            ElMessage({ message: "添加成功", type: "success" });
            fetchColorList();
            fetchMaxNum();
          }
        }
      })
      .finally(() => (loading.value = false));
  };

  const getCurRow = () => curRow.value;

  const fetchColorList = () => {
    loading.value = true;
    getBOMTableRowSelectOptions({ optioncode: "ProductColor" })
      .then((res: any) => {
        if (res.data) {
          originDataInfo.value = res.data[0];
          oldColorList.value = res.data[0]?.optionList || [];
          colorList.value = res.data[0]?.optionList || [];
        }
      })
      .finally(() => (loading.value = false));
  };

  const fetchMaxNum = () => {
    enumDictionaryOptionSelectMax(485).then((res) => {
      if (res.data) {
        maxNum.value = +res.data;
      }
    });
  };

  onMounted(() => {
    getColumnConfig();
    fetchColorList();
    fetchMaxNum();
  });

  const handleTagSearch = (values: any = {}) => {
    console.log(values, "search values");
    if (values.goodColor) {
      colorList.value = colorList.value.filter((item) => values.goodColor?.includes(item.optionName));
    } else {
      fetchColorList();
    }
  };

  const dbClick = (row) => {
    props.formData.goodColor = row.optionName;
    curRow.value = row;
    props.resultDialog.options.value.visible = false;
  };

  return { columns, colorList, rowClick, dbClick, loading, onAdd, getCurRow, onDel, handleTagSearch, searchOptions, onSave };
};
