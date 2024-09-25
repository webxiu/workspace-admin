/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-10 17:04:05
 */

import { TimeSettingItemType, addTimeSetting, deleteTimeSetting, timeSettingList, updateTimeSetting } from "@/api/oaManage/humanResources";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TimeSettingItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const selectOptions = ref({ salePeopleLists: [], customerGroupLists: [] });

  const formData = reactive({
    limit: 10000,
    page: 1
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "规则编号", prop: "ruleNo" },
      { label: "上午上班时间", prop: "forenoonStart" },
      { label: "上午上班最早打卡时间", prop: "minForenoonStart", minWidth: 180 },
      { label: "上午上班最晚打卡时间", prop: "maxForenoonStart", minWidth: 180 },
      { label: "上午下班时间", prop: "forenoonEnd" },
      { label: "上午下班最早打卡时间", prop: "minForenoonEnd", minWidth: 180 },
      { label: "上午下班最晚打卡时间", prop: "maxForenoonEnd", minWidth: 180 },
      { label: "下午上班时间", prop: "afternoonStart" },
      { label: "下午上班最早打卡时间", prop: "minAfternoonStart", minWidth: 180 },
      { label: "下午上班最晚打卡时间", prop: "maxAfternoonStart", minWidth: 180 },
      { label: "下午下班时间", prop: "afternoonEnd" },
      { label: "下午下班最早打卡时间", prop: "minAfternoonEnd", minWidth: 180 },
      { label: "下午下班最晚打卡时间", prop: "maxAfternoonEnd", minWidth: 180 },
      { label: "备注", prop: "remark" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: { minWidth: 180 } });
  };

  const onRefresh = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    timeSettingList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = (row: TimeSettingItemType) => {
    openDialog("edit", row);
  };

  async function openDialog(type: "add" | "edit", row?: Partial<TimeSettingItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();

    const formData = reactive({
      ruleNo: row?.ruleNo ?? "",
      remark: row?.remark ?? "",
      forenoonStart: row?.forenoonStart ?? "",
      minForenoonStart: row?.minForenoonStart ?? "",
      maxForenoonStart: row?.maxForenoonStart ?? "",
      forenoonEnd: row?.forenoonEnd ?? "",
      minForenoonEnd: row?.minForenoonEnd ?? "",
      maxForenoonEnd: row?.maxForenoonEnd ?? "",
      afternoonStart: row?.afternoonStart ?? "",
      minAfternoonStart: row?.minAfternoonStart ?? "",
      maxAfternoonStart: row?.maxAfternoonStart ?? "",
      afternoonEnd: row?.afternoonEnd ?? "",
      minAfternoonEnd: row?.minAfternoonEnd ?? "",
      maxAfternoonEnd: row?.maxAfternoonEnd ?? "",
      id: row?.id ?? ""
    });

    const titleName = row?.remark ? `${title}【${row.remark}】工作时间` : `${title}工作时间`;

    addDialog({
      title: titleName,
      props: { formInline: formData, formRules: formRules, formConfigs: formConfigs(), formProps: { labelWidth: "170px" } },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        console.log("formData", formData);
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: addTimeSetting, edit: updateTimeSetting };
              API[type](formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message(`${title}成功`);
                  } else {
                    message(`${title}失败`, { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  const onDelete = (row: TimeSettingItemType) => {
    deleteTimeSetting({ id: row.id })
      .then((res) => {
        if (res.data) {
          message("删除成功");
          getTableList();
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "工作时间设定"
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    onRefresh,
    onEdit,
    onDelete
  };
};
