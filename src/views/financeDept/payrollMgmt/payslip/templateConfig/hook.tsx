import { fetchMoneyTemplateList, saveMoneyTemplateConfig } from "@/api/oaManage/financeDept";
import { message, showMessageBox } from "@/utils/message";
import { onMounted, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const dataList = ref([]);
  const columns = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const route = useRoute();

  const onSave = () => {
    showMessageBox(`确认要保存?`)
      .then(() => {
        // 组装请求参数
        const params = {
          gzmbNo: route.query.gzmbNo,
          gzmbb: route.query.gzmbb,
          payslipTemplates: dataList.value.filter((el) => el.fieldName)
        };
        saveMoneyTemplateConfig(params).then((res) => {
          if (res.data) {
            message.success("保存成功");
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onAdd = () => {
    const newRow = {
      numberNo: +(dataList.value[dataList.value.length - 1]?.numberNo ?? 0) + 1,
      templateNo: route.query.gzmbNo,
      fieldName: "",
      // fFieldTitle: "",
      width: 100,
      disable: "否",
      excel: "是",
      frozen: "否",
      total: "是",
      importCheck: "否",
      encryptedStorage: "是",
      fieldType: "varchar",
      inExcel: "是",
      allowEdit: "是",
      appShow: "是",
      appNo: +(dataList.value[dataList.value.length - 1]?.appNo ?? 0) + 1,
      deduction: "否"
    };

    dataList.value.push(newRow);
  };

  const onSearch = () => {
    fetchMoneyTemplateList({ templateNo: route.query.gzmbNo }).then((res: any) => {
      if (res.data) {
        dataList.value = res.data;
      }
    });
  };

  const { editCellRender } = tableEditRender({
    customCell({ prop, row }) {
      if (prop === "pcShow") {
        return row.pcShow === "是" ? (
          <el-tag type="success" effect="dark">
            {row.pcShow}
          </el-tag>
        ) : (
          <span>{row.pcShow}</span>
        );
      }

      if (prop === "appShow") {
        return row.appShow === "是" ? (
          <el-tag type="success" effect="dark">
            {row.appShow}
          </el-tag>
        ) : (
          <span>{row.appShow}</span>
        );
      }

      if (prop === "deduction") {
        return row.deduction === "是" ? (
          <el-tag type="danger" effect="dark">
            {row.deduction}
          </el-tag>
        ) : (
          <span>{row.deduction}</span>
        );
      }
    }
  });

  const getConfig = () => {
    const fieldNameRender = (data) => editCellRender({ data, isEdit: !data.row.id });
    const nameRender = (data) => editCellRender({ data, isEdit: !data.row.id });

    const selectRender = (data) =>
      editCellRender({
        type: "select",
        data,
        options: [
          { optionName: "是", optionValue: "是" },
          { optionName: "否", optionValue: "否" }
        ],
        cellStyle: { color: "#606266", textAlign: "left" }
      });
    const columnData: TableColumnList[] = [
      { label: "字段", prop: "fieldName", cellRenderer: fieldNameRender },
      { label: "名称", prop: "fieldTitle", cellRenderer: nameRender },
      { label: "PC显示", prop: "pcShow", cellRenderer: selectRender },
      { label: "APP显示", prop: "appShow", cellRenderer: selectRender },
      { label: "APP序号", prop: "appNo" },
      { label: "扣项", prop: "deduction", cellRenderer: selectRender },
      { label: "加密存储", prop: "encryptedStorage", cellRenderer: selectRender },
      { label: "Ex表格中是否存在", prop: "isExcel", cellRenderer: selectRender },
      { label: "mysql中是否存在", prop: "isMySql", cellRenderer: selectRender }
    ];

    columns.value = setColumn({ columnData, operationColumn: false, dragSelector: ".template-config-table", isDragRow: true, dataList }, onUpdateIndex);
  };

  const onUpdateIndex = () => {
    dataList.value = dataList.value.map((item, i) => ({ ...item, appNo: i + 1 }));
  };

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "增行", isDropDown: false },
    { clickHandler: onSave, type: "warning", text: "保存", isDropDown: false }
  ]);

  const onRefresh = () => {
    onSearch();
  };

  onMounted(() => {
    getConfig();
    onSearch();
  });

  return {
    columns,
    dataList,
    maxHeight,
    buttonList2,
    onRefresh
  };
};
