/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-20 13:57:59
 */

import { Delete, Plus, Edit } from "@element-plus/icons-vue";
import { DrawToolItemType, addDrawTool, deleteDrawTool, drawToolList, updateDrawTool } from "@/api/workbench/teamManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import EditForm from "@/components/EditForm/index.vue";

import { type PaginationProps } from "@pureadmin/table";

import Mxgraph from "../mxgraph/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";
import { formConfigs, formRules } from "./config";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

export const useConfig = () => {
  const tableRef = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<DrawToolItemType[]>([]);
  const rowData = ref<DrawToolItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50 + 45);

  const formData = reactive({
    processCode: "",
    processName: "",
    fileName: "",
    version: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "流程名称", value: "processName" },
    { label: "流程编号", value: "processCode" },
    { label: "文件名称", value: "fileName" },
    { label: "流程版本", value: "version" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  async function getColumnConfig() {
    let columnData: TableColumnList[] = [
      { label: "流程编号", prop: "processCode" },
      { label: "流程名称", prop: "processName" },
      { label: "单据编号", prop: "billNo" },
      { label: "单据状态", prop: "billState" },
      { label: "业务流程版本", prop: "version" },
      { label: "文件路径", prop: "filePath" },
      { label: "文件名", prop: "fileName" },
      { label: "原文件名", prop: "resourceName" },
      { label: "创建时间", prop: "createDate" },
      { label: "创建人", prop: "createUserName" },
      { label: "最后修改时间", prop: "modifyDate" },
      { label: "最后修改人", prop: "modifyUserName" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dataList, operationColumn: { hide: true } });
  }

  function getTableList() {
    loading.value = true;
    drawToolList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  }

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onRefresh = () => getTableList();

  const onAdd = () => {
    const formRef = ref();
    const _formData = reactive({});
    addDialog({
      title: "新增",
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs(),
        formProps: { labelWidth: "100px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确定要提交吗?`).then(() => {
              openDialog("add", _formData);
              done();
            });
          }
        });
      }
    });
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  // 新增|修改(弹窗)
  async function openDialog(type: "add" | "edit", row: Partial<DrawToolItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const graphData = ref();
    addDialog({
      title: title + (row.fileName || "图表"),
      props: { type, row },
      width: "640px",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      class: "full-dialog",
      okButtonText: "保存",
      contentRenderer: () => h(Mxgraph, { onSaveGraph: (data) => (graphData.value = data) }),
      beforeSure: (done, { options }) => {
        const { fileName, img, svg, xml } = graphData.value;
        if (!graphData.value) return message.warning("请保存图表(文件→保存)");
        const param = { ...row, fileName };
        console.log("param", { ...param, img, svg, xml });
        showMessageBox(`确定要提交吗?`).then(() => {
          const fd = new FormData();
          const xmlBlob = new Blob([xml], { type: "application/xml" });
          fd.append("file", xmlBlob, fileName);
          Object.keys(param).forEach((key) => fd.append(key, param[key]));
          const reqApi = { add: addDrawTool, edit: updateDrawTool };
          reqApi[type](fd)
            .then(() => {
              getTableList();
              done();
            })
            .catch(console.log);
        });
      }
    });
  }

  const onDelete = wrapFn(rowData, () => {
    showMessageBox(`确定要删除吗?`)
      .then(() => {
        deleteDrawTool(rowData.value).then(() => {
          message.success("删除成功");
          getTableList();
        });
      })
      .catch(console.log);
  });

  function onRowClick(row: DrawToolItemType) {
    rowData.value = row;
  }

  function rowDbclick(row: DrawToolItemType) {
    openDialog("edit", row);
  }

  const buttonList = ref<ButtonItemType[]>([
    { text: "新增", type: "primary", clickHandler: onAdd, icon: Plus, isDropDown: false },
    { text: "修改", type: "success", clickHandler: onEdit, icon: Edit, isDropDown: false },
    { text: "删除", type: "danger", clickHandler: onDelete, icon: Delete, isDropDown: false }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    pagination,
    searchOptions,
    onRefresh,
    onRowClick,
    rowDbclick,
    onTagSearch
  };
};
