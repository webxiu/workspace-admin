/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-24 18:04:42
 */

import { EsopVersionItemType, addEsopVersion, esopVersionList } from "@/api/systemManage";
import { RendererType, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formConfigs, formRules, timeTypeList, updateTypeList } from "./config";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import HxUploadButton from "@/components/HxUploadButton/index.vue";
import { Plus } from "@element-plus/icons-vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const tableData = ref<EsopVersionItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const baseApi = import.meta.env.VITE_BASE_API;
  const formData = reactive({ log: "" });

  const dataList = computed<EsopVersionItemType[]>(() => {
    return tableData.value.filter((t) => {
      if (formData.log) {
        const s2 = t.version.includes(formData.log);
        const s1 = t.updateLog.includes(formData.log);
        const s3 = t.createUserName.includes(formData.log);
        return s1 || s2 || s3;
      }
      return true;
    });
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    const urlRender: RendererType = ({ row, index, column }) => {
      return row.downloadUrl ? (
        <el-link type="primary" href={baseApi + row.downloadUrl}>
          点击下载
        </el-link>
      ) : null;
    };

    let columnData: TableColumnList[] = [
      { label: "发布版本", prop: "version", width: 120, align: "center" },
      { label: "发布日志", prop: "updateLog", width: 300 },
      { label: "下载地址", prop: "downloadUrl", align: "center", width: 160, cellRenderer: urlRender },
      { label: "最小时间", prop: "minTime", width: 120, align: "center" },
      { label: "最大时间", prop: "maxTime", width: 120, align: "center" },
      {
        label: "提醒周期",
        prop: "timeType",
        width: 120,
        align: "center",
        cellRenderer: ({ row }) => <span>{timeTypeList.find((item) => item.optionValue === row.timeType)?.optionName}</span>
      },
      {
        label: "强制更新",
        prop: "forceUpdate",
        align: "center",
        cellRenderer: ({ row }) => <span>{updateTypeList.find((item) => item.optionValue === row.forceUpdate)?.optionName}</span>
      },
      { label: "发布人", prop: "createUserName", width: 120 },
      { label: "发布时间", prop: "createDate", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ downloadUrl: urlRender }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    esopVersionList()
      .then(({ data = [] }) => {
        loading.value = false;
        tableData.value = data;
      })
      .catch(() => (loading.value = false));
  };

  function onAdd() {
    openDialog("add");
  }

  // 版本号自增
  const addVersion = (version) => {
    const arr = version.split(".");
    arr[arr.length - 1] = Number(arr[arr.length - 1]) + 1;
    return arr.join(".");
  };

  // 获取最大版本号
  function getMaxVersion(versions: string[]): string {
    return versions.reduce((max, version) => {
      const versionParts = version.split(".").map(Number);
      const maxParts = max.split(".").map(Number);
      for (let i = 0; i < Math.max(versionParts.length, maxParts.length); i++) {
        const currentVersionPart = versionParts[i] || 0;
        const maxVersionPart = maxParts[i] || 0;
        if (currentVersionPart > maxVersionPart) {
          return version;
        } else if (currentVersionPart < maxVersionPart) {
          return max;
        }
      }
      return max;
    });
  }

  async function openDialog(type: "add" | "edit", row?: Partial<EsopVersionItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    let version = row?.version;
    if (type === "add") {
      const versions = dataList.value.map((m) => m.version);
      version = addVersion(getMaxVersion(versions));
    }
    const formRef = ref();
    const formData = reactive({
      id: row?.id ?? "",
      minTime: row?.minTime ?? 3,
      maxTime: row?.maxTime ?? 8,
      timeType: row?.timeType ?? "hour",
      updateLog: row?.updateLog ?? "",
      version: version,
      forceUpdate: row?.forceUpdate ?? false,
      downloadUrl: row?.downloadUrl ? [{ file: null, raw: row.downloadUrl }] : []
    });

    const customElement = {
      downloadUrl: ({ formModel, row }) => {
        return <HxUploadButton v-model:fileList={formModel[row.prop]} limit={1} accept={".apk"} />;
      }
    };

    addDialog({
      title: title + "版本发布",
      props: {
        params: { groupCode: "1" },
        formConfig: [
          {
            formData: formData,
            dataOption: { timeType: timeTypeList },
            customElement: customElement,
            formProps: { labelWidth: "120px" }
          }
        ]
      },
      width: "740px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            const { downloadUrl, ...param } = formData;
            const fd = new FormData();
            fd.append("file", downloadUrl[0].raw);
            fd.append("dto", JSON.stringify(param));
            showMessageBox(`提交后不可修改, 确认要${title}?`).then(() => {
              addEsopVersion(fd)
                .then(({ data }) => {
                  if (!data) message.error(`${title}失败`);
                  done();
                  getTableList();
                  message.success(`${title}成功`);
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false }]);

  return { loading, formData, columns, dataList, maxHeight, buttonList, onRefresh };
};
