import { createFileTableData, delFileTableData, renameFileTableData, uploadFileTableData } from "@/api/fileManage";
import editForm, { FormDataItem } from "./form.vue";
import { h, onMounted, ref } from "vue";

import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { getkkViewUrl } from "@/utils/storage";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export type HandleType = "add" | "edit";

const columnsDragDom = ref([]);
const dialogVisible = ref(false);
const percentage = ref(0);

export const getConfig = () => {
  const columnsDrag: TableColumnList[] = [
    { label: "序号", prop: "index" },
    { label: "名称", prop: "name" },
    { label: "文件类型", prop: "fileType" },
    { label: "修改日期", prop: "modifyTime" },
    { label: "大小", prop: "fileSize" },
    { label: "操作", prop: "operation" }
  ];

  // 我发起
  const columns: TableColumnList[] = [
    {
      label: "序号",
      align: "center",
      type: "index",
      width: 65,
      cellRenderer: ({ $index }) => <span>{$index + 1}</span>
    },
    { label: "名称", prop: (index) => columnsDragDom.value[index].prop as string, sortable: "custom", width: 310, slot: "name" },

    {
      label: "文件类型",
      prop: (index) => columnsDragDom.value[index].prop as string,
      sortable: "custom",
      width: 200
    },
    { label: "修改日期", prop: (index) => columnsDragDom.value[index].prop as string, sortable: "custom", width: 200 },
    { label: "大小", prop: (index) => columnsDragDom.value[index].prop as string, sortable: "custom", width: 200 },
    { label: "操作", fixed: "right", width: 280, slot: "operation" }
  ];

  columnsDragDom.value = columnsDrag;

  return columns;
};

export function useTable() {
  const formRef = ref();
  const columns = ref<TableColumnList[]>([]);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50 + 25);

  onMounted(() => {
    onSearch();
  });

  const onSearch = () => {
    columns.value = getConfig();
  };

  // 上传
  const onUpload = (data, fn) => {
    dialogVisible.value = true;
    let path = data[data.length - 1]["path"];
    if (!path) path = "/";
    const fileObj = (document.getElementById("file") as any).files;
    const formData = new FormData();
    formData.append("file", fileObj[0]);
    formData.append("path", path);

    uploadFileTableData(formData, ({ loaded, total }: { loaded: number; total: number }) => {
      const complete = (loaded / total) * 100;
      percentage.value = Math.floor(complete);
    })
      .then((res) => {
        if (res.data && res.status === 200) {
          message(`上传成功`, { type: "success" });

          fn({ folderPath: path });
        }
      })
      .finally(() => {
        dialogVisible.value = false;
        const dom = document.getElementById("file");
        (dom as any).value = null;
      });
  };

  // 下载
  const onDownload = (row) => {
    let url = "/api/file/filemanage/downfile?mode=download";
    url += "&path=" + encodeURIComponent(row.path);
    url += "&fileName=" + encodeURIComponent(row.fileType == "文件夹" ? row.name + ".zip" : row.name);
    console.log(url, "下载");

    window.open(url, "_blank");
  };

  // 预览
  const onView = (row) => {
    window.open(getkkViewUrl(row.path));
  };

  // 新增分组
  const onAdd = (data: any, fn) => {
    openDialog("add", data, fn);
  };

  // 修改分组
  const onEdit = (data: any, fn) => {
    openDialog("edit", data, fn);
  };

  // 删除分组
  const remove = (data: any, fetchData) => {
    ElMessageBox.confirm(`确认要删除【${data.name}】吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }).then(() => {
      delFileTableData({ path: data.path })
        .then((res) => {
          res.status === 200 && message(`删除成功`, { type: "success" });
          // 查询上级
          const upLevelArr = data.path.split("/");
          upLevelArr.pop();
          fetchData({ folderPath: upLevelArr.join("/") });
        })
        .catch(console.log);
    });
  };

  // 添加、编辑弹窗
  function openDialog(type: HandleType, row: any, fn) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const folderName = type === "add" ? "" : row.name;
    const _formData: FormDataItem = {
      name: folderName
    };
    addDialog({
      title: `${title}`,
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: { type: type, formInline: _formData },
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormDataItem;
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要【${title}】吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitGroup(type, title, { ...row, ...curData }, () => {
                done();
                const upLevelArr = row.path.split("/");
                type !== "add" && upLevelArr.pop();
                fn({ folderPath: upLevelArr.join("/") });
              });
            });
          }
        });
      }
    });
  }

  // 添加、编辑提交
  const onSubmitGroup = (type: HandleType, title: string, data, callback: Function) => {
    const API = { add: createFileTableData, edit: renameFileTableData };
    API[type]({ name: data.name, path: data.path })
      .then((res) => {
        if (!res.data) throw res.message;
        callback();
        message(`${title}成功`, { type: "success" });
      })
      .catch(console.log);
  };

  return {
    columns,
    maxHeight,
    onAdd,
    onEdit,
    onUpload,
    onView,
    onDownload,
    percentage,
    dialogVisible,
    remove
  };
}
