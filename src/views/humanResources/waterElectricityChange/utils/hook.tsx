import { ElMessage, dayjs } from "element-plus";
import {
  deleteChangeWaterElectricity,
  exportChangeWaterElectricity,
  fetchChangeWaterElectricity,
  insertChangeWaterElectricity,
  updateChangeWaterElectricity
} from "@/api/oaManage/humanResources";
import { formConfigs, formRules, meterTypeOpts } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { FormItemConfigType } from "@/utils/form";
import HxModalInput from "@/components/HxModalInput/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "宿舍楼栋", value: "buildingName" },
    { label: "房间号", value: "dormitoryCode" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "searchStartDate", endKey: "searchEndDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "宿舍楼栋", prop: "buildingName", minWidth: 140 },
      { label: "宿舍房间", prop: "dormitoryCode", minWidth: 140 },
      { label: "更换日期", prop: "replaceDate", minWidth: 140 },
      { label: "更换表类型", prop: "meterType", minWidth: 140 },
      { label: "旧表数", prop: "oldMeterNumber", minWidth: 140 },
      { label: "新表数", minWidth: 140, prop: "newMeterNumber" },
      { label: "创建人", minWidth: 140, prop: "createUserName" },
      { label: "创建时间", minWidth: 140, prop: "createDate" },
      { label: "修改人", minWidth: 140, prop: "modifyUserName" },
      { label: "修改时间", minWidth: 140, prop: "modifyDate" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    loading.value = true;
    fetchChangeWaterElectricity(formData)
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          dataList.value = data.records || [];
          pagination.total = data.total;
        }
      })
      .catch(() => (loading.value = false));
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const beforeEdit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    onEdit(currentRow.value);
  };

  const beforeDel = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    onDelete(currentRow.value);
  };

  const onEdit = (row) => openDialog("edit", row);

  const openDialog = async (type: string, row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const _formData = reactive({
      ...row,
      replaceDate: row?.replaceDate ?? dayjs(new Date()).format("YYYY-MM-DD")
    });

    const isDisabled = type === "view";
    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        formProps: { labelWidth: "100px" },
        customProps: {
          buildingName: {
            onChange: (val) => {
              _formData.dormitoryCode = "";
              _formData.buildingId = val;
            }
          }
        },
        customElement: {
          dormitoryCode: ({ formModel, row }) => {
            const interceptFn = () => {
              if (formModel.buildingId) return false;
              message.warning("请先选择宿舍楼栋");
              return true;
            };
            return (
              <HxModalInput
                title="选择宿舍房间"
                placeholder="点击选择"
                valueKey={row.prop}
                v-model={formModel[row.prop]}
                readonly={true}
                disabled={isDisabled}
                showButton={false}
                interceptFn={interceptFn}
                onSelect={(row) => {
                  formModel.dormitoryId = row.id;
                }}
                showModel="dormitory"
                componentProp={{ paramConfig: { buildingCode: formModel.buildingId } }}
              />
            );
          }
        },
        dataOption: { meterType: meterTypeOpts },
        customColumn: {
          createUserName: { hide: type === "add" },
          createDate: { hide: type === "add" },
          modifyUserName: { hide: type === "add" },
          modifyDate: { hide: type === "add" }
        }
      }
    ];

    addDialog({
      title: `${title}`,
      props: { params: { groupCode: "1" }, formConfig: formConfig },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            const params = {
              id: _formData.id,
              buildingName: _formData.buildingName,
              dormitoryCode: _formData.dormitoryCode,
              dormitoryId: _formData.dormitoryId,
              meterType: _formData.meterType,
              newMeterNumber: _formData.newMeterNumber,
              oldMeterNumber: _formData.oldMeterNumber,
              replaceDate: _formData.replaceDate
            };
            showMessageBox(`确认要${title}吗?`).then(() => {
              const typeApi = { add: insertChangeWaterElectricity, edit: updateChangeWaterElectricity };
              typeApi[type](params).then(({ data }) => {
                if (!data) return message.error(title + "失败");
                message.success(title + "成功");
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  // 导出
  const onExport = () => {
    // ElMessage({ message: "功能暂未开发", type: "warning" });
    loading.value = true;
    let searchStartDate, searchEndDate;

    if (formData.date) {
      [searchStartDate, searchEndDate] = formData.date.split(" ~ ");
    }

    const copyData = cloneDeep(formData);
    delete copyData.date;

    const headConfig = {
      ...copyData,
      searchStartDate,
      searchEndDate
    };

    exportChangeWaterElectricity(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onDelete = (row) => {
    const dateStr = dayjs(row.replaceDate).format("YYYY年M月D日");
    showMessageBox(`确认要删除【${dateStr} ${row.buildingName} ${row.dormitoryCode}】的${row.meterType}更换记录吗?`)
      .then(() => {
        loading.value = true;
        deleteChangeWaterElectricity({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onAdd = () => {
    openDialog("add");
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const viewNodeDetail = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "visitor", billState: +currentRow.value.billState })
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: beforeEdit, type: "warning", text: "修改" },
    { clickHandler: beforeDel, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    pagination,
    searchOptions,
    rowClick,
    onSearch,
    onEdit,
    onTagSearch,
    onSizeChange,
    onCurrentChange
  };
};
