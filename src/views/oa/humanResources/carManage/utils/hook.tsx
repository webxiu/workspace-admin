/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-11 16:32:39
 */

import { CarInfoItemType, addCarInfo, carInfoList, carInfoStatus, deleteCarInfo, updateCarInfo } from "@/api/oaManage/humanResources";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const tableRef = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<CarInfoItemType[]>([]);
  const currentRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 48);
  const formData = reactive({
    page: 1,
    limit: 10000,
    plateNumber: "",
    createUserName: ""
  });

  const searchOptions = reactive([
    { label: "车牌号码", value: "plateNumber" },
    { label: "创建用户", value: "createUserName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "车牌号码", prop: "plateNumber" },
      { label: "车架号", prop: "vinNo" },
      { label: "车辆颜色", prop: "color" },
      { label: "初始里程", prop: "initMileage" },
      { label: "创建用户", prop: "createUserName" },
      { label: "创建日期", prop: "createDate", minWidth: 160 },
      { label: "修改用户", prop: "modifyUserName" },
      { label: "修改日期", prop: "modifyDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = (_rowIndex?) => {
    loading.value = true;
    carInfoList(formData)
      .then((res) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;

        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };
  // 搜索
  const handleTagSearch = (values) => {
    formData.plateNumber = values.plateNumber;
    formData.createUserName = values.createUserName;
    getTableList();
  };

  const onRefresh = () => getTableList();
  const onAdd = () => openDialog("add");
  const onEdit = () => openDialog("edit", currentRow.value);

  function openDialog(type: "add" | "edit", row?: CarInfoItemType) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formData = reactive({
      id: row?.id ?? "",
      plateNumber: row?.plateNumber ?? "",
      vinNo: row?.vinNo ?? "",
      color: row?.color ?? "",
      initMileage: row?.initMileage ?? "",
      createUserId: row?.createUserId ?? "",
      createDate: row?.createDate ?? "",
      modifyUserId: row?.modifyUserId ?? "",
      modifyDate: row?.modifyDate ?? "",
      orgId: row?.orgId ?? ""
    });
    addDialog({
      title: `${title}车辆`,
      props: {
        formInline: formData,
        formRules: formRules,
        formConfigs: formConfigs(),
        formProps: { labelWidth: "120px" }
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认提交吗?`).then(() => {
              const API = { add: addCarInfo, edit: updateCarInfo };
              API[type](formData)
                .then(({ data }) => {
                  if (!data) return message(`${title}失败`, { type: "error" });
                  message(`${title}成功`);
                  const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                  getTableList(_rowIndex);
                  done();
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  // 删除
  const onDelete = () => {
    showMessageBox(`确认删除\n【${currentRow.value.plateNumber}】的车辆信息吗?`)
      .then(() => {
        deleteCarInfo({ id: currentRow.value.id })
          .then(({ data }) => {
            if (!data) return message("删除失败", { type: "error" });
            message("删除成功");
            const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
            getTableList(_rowIndex);
          })
          .catch(console.log);
      })
      .catch(() => {});
  };

  // 导出
  const onExport = () => {
    downloadDataToExcel([
      {
        dataList: dataList.value,
        columns: columns.value,
        sheetName: "车辆管理"
      }
    ]);
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
    // tableRef.value?.getTableRef()?.toggleRowSelection(currentRow.value);
  };

  const beforeHandle = (fn) => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      fn();
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: () => beforeHandle(onEdit), type: "warning", text: "修改", isDropDown: false },
    { clickHandler: () => beforeHandle(onDelete), type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  const rowClick = (row) => {
    currentRow.value = row;
  };

  return {
    tableRef,
    formData,
    buttonList,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
    rowDbClick,
    rowClick,
    handleTagSearch
  };
};
