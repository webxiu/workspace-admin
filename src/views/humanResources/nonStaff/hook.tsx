import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { ElMessage, FormRules } from "element-plus";
import {
  NoStaffItemType,
  StaffInfoItemType,
  addNoStaffUser,
  fetchNoStaffUser,
  leaveNoStaffUser,
  manySyncMachineData,
  updateNoStaffUser
} from "@/api/oaManage/humanResources";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import MachineUserModal from "../staffInfo/utils/machineUserModal/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const loading = ref(false);
  const treeSelectData = ref([]);
  const currentRow = ref<NoStaffItemType>();
  const columns = ref<TableColumnList[]>([]);
  const rowsData = ref([]);
  const dataList = ref<NoStaffItemType[]>([]);
  const noTableRef = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    staffName: "",
    staffId: "",
    laborServiceCompany: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "编号", value: "staffId" }
    // { label: "公司", value: "laborServiceCompany" }
  ]);

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef: noTableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    onSearch();
    fetchOpts();
  });

  const fetchOpts = () => {
    getDeptOptions().then((data: any) => {
      treeSelectData.value = data;
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "编号", prop: "staffId" },
      { label: "姓名", prop: "staffName" },
      { label: "性别", prop: "sex" },
      { label: "身份证号码", prop: "idCard" },
      { label: "家庭住址", prop: "currentStayAddress" },
      // { label: "同步用户表", prop: "isSynUserTable" },
      { label: "部门", prop: "deptName" },
      { label: "岗位", prop: "roleName" },
      { label: "联系电话", prop: "phone" },
      { label: "入厂日期", prop: "startDate" },
      // { label: "创建企业微信账号", prop: "isCreateQYWechat" },
      // { label: "创建金蝶账号", prop: "isCreateKingDee" },
      { label: "公司", prop: "laborServiceCompany" },
      { label: "备注", prop: "remark" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchNoStaffUser(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
        setSelectCheckbox();
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#mappingTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `编外人员${timeStep}.xlsx`);
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const flag = ref(false);
    const _formData: any = ref({});

    await fetchNoStaffUser({ page: 1, limit: 30, staffId: row?.staffId }).then((res: any) => {
      if (res.data) {
        let result = res.data.records[0] || {};
        if (!row) result = {};
        _formData.value.id = result?.id ?? "";
        _formData.value.sex = result?.sex;
        _formData.value.staffName = result?.staffName ?? "";
        _formData.value.idCard = result?.idCard ?? "";
        _formData.value.currentStayAddress = result?.currentStayAddress ?? "";
        _formData.value.startDate = result?.startDate;
        _formData.value.phone = result?.phone ?? "";
        _formData.value.staffId = result?.staffId ?? "";
        _formData.value.deptId = type === "add" ? undefined : result.deptId + "";
        _formData.value.roleId = type === "add" ? undefined : result.roleId;
        _formData.value.isCreateQYWechat = result?.wxOpenId ? true : false;
        _formData.value.laborServiceCompany = result?.laborServiceCompany ?? "";
        _formData.value.remark = result?.remark ?? "";
        _formData.value.isPoorPeople = result?.isPoorPeople ?? 0;
        _formData.value.exmpetAttendance = result?.exmpetAttendance ?? false;
        _formData.value.machineId = result?.machineId;
      }
    });

    const changeQYWX = (val) => (flag.value = val);

    const calcConfigArr = formConfigs({ treeSelectData, _formData, changeQYWX });
    // type === "add"
    //   ? formConfigs({ treeSelectData, _formData, changeQYWX })
    //   : formConfigs({ treeSelectData, _formData, changeQYWX }).filter((item) => {
    //       if (!row?.wxOpenId) {
    //         return item;
    //       }
    //       return !["isCreateQYWechat"].includes(item.prop);
    //     });

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules(flag),
        formConfigs: calcConfigArr,
        labelWidth: 110
      },
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value.getRef();
        formIns?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const typeApi = { add: addNoStaffUser, edit: updateNoStaffUser };
    typeApi[type](data.value).then((res) => {
      if (res.data || res.status === 200) {
        message.success(title + "成功");
        callback();
      }
    });
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    openDialog("edit", currentRow.value);
  };

  const onLeave = (row) => {
    const _formData = reactive({});
    const formRef = ref();
    const leaveReasonOptions = ref([]);

    const title = `离职人员【${row.staffName}】`;

    const formRules = reactive<FormRules>({
      leaveofficeDate: [{ required: true, message: "离职日期为必填项", trigger: "submit" }],
      resignationReason: [{ required: true, message: "离职原因为必填项", trigger: "submit" }]
    });

    const formConfigs = ({ leaveReasonOptions }): FormConfigItemType[] => {
      return [
        {
          label: "离职日期",
          prop: "leaveofficeDate",
          labelWidth: 80,
          colProp: { span: 12 },
          render: ({ formModel, row }) => {
            return <el-date-picker class="ui-w-100" v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />;
          }
        },
        {
          label: "离职原因",
          prop: "resignationReason",
          labelWidth: 80,
          colProp: { span: 12 },
          render: ({ formModel, row }) => {
            return (
              <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
                {leaveReasonOptions.value.map((item) => (
                  <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                ))}
              </el-select>
            );
          }
        },
        {
          label: "备注",
          prop: "remark",
          labelWidth: 80,
          colProp: { span: 24 },
          render: ({ formModel, row }) => {
            return <el-input type="textarea" minRows={3} v-model={formModel[row.prop]} />;
          }
        }
      ];
    };

    setTimeout(() => {
      getBOMTableRowSelectOptions({ optioncode: "DimissionReason" }).then((res) => {
        if (res.data) {
          const result = res.data.find((item) => item.optionCode === "DimissionReason")?.optionList || [];
          leaveReasonOptions.value = result;
        }
      });
    });

    addDialog({
      title,
      props: { formInline: _formData, formRules, formConfigs: formConfigs({ leaveReasonOptions }) },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value.getRef();
        formIns?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                const reqParams = { id: row.id, ..._formData };
                leaveNoStaffUser(reqParams).then((res) => {
                  if (res.data) {
                    message.success("离职成功");
                    currentRow.value = null;
                    done();
                    onSearch();
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onDel = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    onLeave(currentRow.value);
  };

  const onSyncMachine = () => {
    if (!rowsData.value.length) return message.error("请勾选人员");
    const formRef = ref();
    addDialog({
      title: `选择考勤机`,
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MachineUserModal, { ref: formRef }),
      beforeSure: (done) => {
        const selectedIds: any[] = formRef.value?.selectedRows?.map((item) => item.id);
        if (selectedIds.length) {
          const names = rowsData.value.map((item) => item.staffName);
          const paramsData = rowsData.value.map((item) => ({ ...item, machineIds: selectedIds }));

          const attMachineNames = formRef.value?.selectedRows?.map((item) => item.attMachineName);
          showMessageBox(`确认要同步人员【${names}】的信息到考勤机【${attMachineNames}】吗?`)
            .then(() => {
              manySyncMachineData(paramsData).then((res) => {
                if (res.status === 200) {
                  ElMessage({ message: "同步成功", type: "success" });
                  done();
                  onSearch();
                }
              });
            })
            .catch(console.log);
        } else {
          message.warning("请选择至少一条考勤机记录");
        }
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDel, type: "danger", text: "离职" },
    { clickHandler: onSyncMachine, type: "default", text: "同步考勤机", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowDbclick = (row: NoStaffItemType) => {
    currentRow.value = row;
    onEdit();
  };
  const rowClick = (row: NoStaffItemType) => {
    currentRow.value = row;
  };

  function onSelect(rows: StaffInfoItemType[], row: StaffInfoItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: StaffInfoItemType[]) {
    setSelectAllChange(rows);
  }

  return {
    columns,
    loading,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    onFresh,
    rowClick,
    rowDbclick,
    onSizeChange,
    onSelect,
    onSelectAll,
    noTableRef,
    handleTagSearch,
    onCurrentChange
  };
};
