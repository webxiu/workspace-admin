/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:03:35
 */

import {
  BillNumberItemType,
  getBillIDIndex,
  billNumberAdd,
  billNumberDelete,
  billNumberList,
  billNumberUpdate,
  billNumberAddCheck,
  billNumberExport,
  billNumberProjectsOptionList,
  BillNumberProjectsOptionItemType
} from "@/api/systemManage";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { setColumn, getExportConfig, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

import SelectMenu from "../component/SelectMenu.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getFormColumns } from "@/utils/form";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<BillNumberItemType[]>([]);
  const rowData = ref<BillNumberItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50 + 45);

  const formData = reactive({
    billId: "",
    prefix: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "业务Id", value: "billId" },
    { label: "前缀字符", value: "prefix" }
  ];

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "业务Id", prop: "billId", align: "right" },
      { label: "前缀字符", prop: "prefix" },
      { label: "年份长度", prop: "yearLength", align: "right" },
      { label: "月份长度", prop: "monthLength", align: "right" },
      { label: "日期长度", prop: "dayLength", align: "right" },
      { label: "序列号长度", prop: "sequenceLength", align: "right" },
      { label: "后缀字符", prop: "suffix", align: "right" },
      { label: "备注", prop: "remark", minWidth: 180 },
      { label: "菜单", prop: "menuName", minWidth: 180 },
      { label: "归属模块", prop: "projectName" },
      { label: "创建人", prop: "createUserName", sortable: true },
      { label: "创建时间", prop: "createDate", minWidth: 160 },
      { label: "修改人", prop: "modifyUserName", sortable: true },
      { label: "修改时间", prop: "modifyDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dragSelector: ".bill-manage", operationColumn: false, formData });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  function getTableList() {
    loading.value = true;
    billNumberList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
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

  const onCurrentChange = (row: BillNumberItemType) => {
    if (!row) return;
    rowData.value = row;
  };

  // 添加单据
  const onAdd = () => openDialog("add");

  // 修改单据
  const onEdit = (row: BillNumberItemType) => openDialog("edit", row);

  function openDialog(type: string, row?: Partial<BillNumberItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading = ref<boolean>(true);
    const projectsList = ref<BillNumberProjectsOptionItemType[]>([]);
    const myFormConfig = ref<FormConfigItemType[]>([]);
    const _formData = reactive({
      billId: row?.billId ?? "",
      prefix: row?.prefix ?? "",
      yearLength: row?.yearLength ?? "",
      monthLength: row?.monthLength ?? "",
      dayLength: row?.dayLength ?? "",
      sequenceLength: row?.sequenceLength ?? "",
      suffix: row?.suffix ?? "",
      remark: row?.remark ?? "",
      menuId: row?.menuId ?? "",
      menuName: row?.menuName ?? "",
      projectNo: row?.projectNo ?? "",
      id: row?.id ?? ""
    });

    if (type === "add") {
      getBillIDIndex()
        .then((res) => {
          _formData.billId = res.data;
        })
        .catch(console.log);
    }

    billNumberProjectsOptionList()
      .then((res) => {
        loading.value = false;
        if (res.data) {
          projectsList.value = res.data;
        }
      })
      .catch(() => (loading.value = false));

    // 选择菜单
    const onSelectMenu = () => {
      addDialog({
        title: "选择菜单",
        width: "50%",
        draggable: true,
        fullscreenIcon: false,
        closeOnClickModal: false,
        contentRenderer: () => h(SelectMenu, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          if (!FormRef?.itemId) return message("请选择菜单", { type: "warning" });
          _formData.menuId = FormRef.itemId;
          _formData.menuName = FormRef.menuName;
          done();
        }
      });
    };

    const customElement = {
      menuName: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择菜单" readonly>
            {{ append: () => <el-button onClick={onSelectMenu}>选择</el-button> }}
          </el-input>
        );
      }
    };

    getFormColumns({ loading, customElement })
      .then((data) => {
        loading.value = false;
        if (!data.formColumns.length) return;
        myFormConfig.value = data.formColumns;
      })
      .catch(() => (loading.value = false));

    addDialog({
      title: `${title}单据编号规则`,
      props: {
        loading: loading,
        formInline: _formData,
        formRules: formRules,
        // formConfigs: formConfigs({ projectsList, onSelectMenu }),
        formConfigs: myFormConfig,
        formProps: { labelWidth: "120px" }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          const msgTextObj = {
            0: `确认要${title}吗?`,
            1: `当前后缀重复，确认添加吗?`,
            2: `当前前缀重复，确认添加吗?`,
            3: `当前前缀和后缀都重复，确认添加吗?`
          };
          if (valid) {
            let status = 0;
            try {
              const res = await billNumberAddCheck(_formData);
              status = res.data;
            } catch (error) {
              console.log("error", error);
            }
            const msgText = msgTextObj[status];
            showMessageBox(msgText).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  }

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: billNumberAdd, edit: billNumberUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 删除单据
  const onDelete = (row: BillNumberItemType) => {
    billNumberDelete({ id: row.id })
      .then((res) => {
        if (res.data) {
          message("删除成功");
          rowData.value = null;
          getTableList();
        } else {
          message("删除失败，请联系开发人员处理", { type: "error" });
        }
      })
      .catch(console.log);
  };
  // 导出单据
  const onExport = () => {
    const headConfig = getExportConfig("单据编号", columns.value);
    billNumberExport(headConfig)
      .then((res) => {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const onEditAction = () => {
    if (!rowData.value) return ElMessage({ message: "请选择记录", type: "warning" });
    onEdit(rowData.value);
  };

  const onDelAction = () => {
    if (!rowData.value) return ElMessage({ message: "请选择记录", type: "warning" });
    onDelete(rowData.value);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEditAction, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelAction, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onRefresh,
    onEdit,
    onDelete,
    onTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
