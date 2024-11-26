/*
 * @Author: Hailen
 * @Date: 2024-06-17 17:26:03
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-11-21 10:15:28
 */

import { useEleHeight } from "@/hooks";
import { h, onMounted, reactive, ref } from "vue";
import { PAGE_CONFIG } from "@/config/constant";
import { changeApplyList, OptionItemType, ChangeApplyItemType } from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { Plus, Edit, Delete, Download, Position, Tickets, Printer } from "@element-plus/icons-vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { setColumn, getMenuColumns, updateButtonList, getEnumDictList, RendererType } from "@/utils/table";

import ChangeDetail from "../component/ChangeDetail/index.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<ChangeApplyItemType[]>([]);
  const rowData = ref<ChangeApplyItemType>();
  const productLineOption = ref<OptionItemType[]>([]);
  const loading = ref<boolean>(false);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 48 + 48);
  const formData = reactive({
    billCode: "",
    productName: "",
    productModel: "",
    applyUserName: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "单据编号", value: "billCode" },
    { label: "产品名称", value: "productName" },
    { label: "产品型号", value: "productModel" },
    { label: "申请人", value: "applyUserName", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getName = (arr: OptionItemType[], value: string) => {
    return arr.find((item) => item.optionValue === value + "")?.optionName;
  };

  const getColumnConfig = async () => {
    const cellRenderer1: RendererType = ({ row }) => <span>{getName(productLineOption.value, row.productionLine)}</span>;
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", sortable: true },
      { label: "产品名称", prop: "productName", sortable: true },
      { label: "产品型号", prop: "productModel", align: "center" },
      { label: "单据状态", prop: "billState", align: "center" },
      { label: "客户名称", prop: "customerName", align: "center" },
      { label: "变更类型", prop: "changeType", align: "center" },
      { label: "变更阶段", prop: "changePhase", align: "center" },
      { label: "变更主题", prop: "changeTheme", align: "center" },
      { label: "申请日期", prop: "createDate", width: 160 },
      { label: "申请部门", prop: "applyDepartment", width: 160 },
      { label: "申请人", prop: "applyUserName", width: 160 },
      { label: "最后修改人", prop: "modifyUserName", align: "center" },
      { label: "最后修改日期", prop: "modifyDate", align: "center", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ productionLine: cellRenderer1 }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    changeApplyList(formData)
      .then(({ data }) => {
        data.records = [
          {
            id: "afe3e0d0-9b4b-4f5a-8f5a-6b4b4f5a3b1b",
            billNo: "CA20241119001",
            productName: "产品名称",
            productModel: "产品型号",
            billState: "待审批",
            customerName: "==模拟数据",
            changeType: "变更类型",
            changePhase: "变更阶段",
            changeTheme: "变更主题",
            createDate: "2024-11-19",
            applyDepartment: "申请部门",
            applyUserName: "申请人",
            modifyUserName: "最后修改人",
            modifyDate: "2024-11-19"
          }
        ];
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  function onAdd() {
    openDialog("add");
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: Partial<ChangeApplyItemType>) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    addDialog({
      title: `${title}变更申请单`,
      props: { row },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ChangeDetail, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        console.log("FormRef", FormRef);
        FormRef.formRef.validate((valid) => {
          if (valid) {
            console.log("submit!");
          }
        });
        console.log("FormRef", FormRef);
        // FormRef.validate((valid) => {
        //   if (valid) {
        //     showMessageBox("确认提交吗").then(() => {
        //       const reqApi = { add: addTabletManage, edit: updateTabletManage };
        //       reqApi[type]({}).then((res) => {
        //         if (res.data) {
        //           message(`${title}成功`);
        //           getTableList();
        //           done();
        //         } else {
        //           message(`${title}失败`, { type: "error"});
        //         }
        //       });
        //     });
        //   }
        // });
      }
    });
  };

  /** 暂时不做删除 */
  const onDelete = wrapFn(rowData, () => {
    showMessageBox("确认删除吗").then(() => {
      // deleteTabletManage({ id: rowData.value?.id })
      //   .then((res) => {
      //     if (!res.data) return message("删除失败", { type: "error"});
      //     message("删除成功");
      //     getTableList();
      //   })
      //   .catch(console.log);
    });
  });

  const onSubmit = () => {
    message("提交申请流程");
  };
  const onDetail = () => {
    message("查看审批流程");
  };
  const onRevoke = () => {
    message("撤销");
  };
  const onPrint = wrapFn(rowData, () => {
    const row = rowData.value;
    const formRef = ref();
    addDialog({
      title: "打印变更申请单",
      props: { row },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "打印",
      contentRenderer: () => h(ChangeDetail, { ref: formRef }),
      beforeSure: () => formRef.value.onPrint()
    });
  });

  const onExport = () => {
    // exportTabletManage(formData)
    //   .then((res) => {
    //     const fileName = getFileNameOnUrlPath(res.data);
    //     downloadFile(res.data, fileName, true);
    //   })
    //   .catch(console.log);
  };
  function onRowClick(row: ChangeApplyItemType) {
    rowData.value = row;
  }
  function onDbClick(row: ChangeApplyItemType) {
    openDialog("edit", row);
  }

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", icon: Position, isDropDown: false },
    { clickHandler: onDetail, type: "default", text: "审批详情", icon: Tickets, isDropDown: true },
    { clickHandler: onRevoke, type: "default", text: "撤销", icon: Tickets, isDropDown: true },
    { clickHandler: onPrint, type: "default", text: "打印", icon: Printer, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    pagination,
    onRefresh,
    onTagSearch,
    onDbClick,
    onRowClick,
    handleSizeChange,
    handleCurrentChange
  };
};
