/*
 * @Author: lixiuhai
 * @Date: 2023-07-06 14:21:11
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-09-21 11:01:39
 */

import EditForm from "@/components/EditForm/index.vue";
import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, withModifiers, Ref } from "vue";
import { formConfigs } from "./config";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

import { type PaginationProps } from "@pureadmin/table";
import { testList, addTest, updateTest, deleteTest, TestItemType } from "@/api/editTable";
import { setColomn, downloadDataToExcel, getTableCellEdit } from "@/utils/common";
import Bpmn from "../component/Bpmn.vue";

export type RowHandleType = "add" | "edit";
export type TableDataItemType = TestItemType;
export type TableColumnItemType = Ref<TableColumnList[]>;

export function useTable() {
  const formRef = ref();
  const formData = reactive({
    name: ""
  });
  const loading = ref(true);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<TableDataItemType[]>([]);
  const maxHeight = useEleHeight(".app-main .el-scrollbar", 20 + 70 + 48);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    small: false,
    background: true,
    align: "right",
    currentPage: 1,
    pageSizes: [20, 40, 60]
  });

  const getColumnConfig = (dataList: Ref<TableDataItemType[]>) => {
    const { editCellRenderer, editSelectRenderer } = getTableCellEdit(dataList, (data) => {
      const { prop, index, value, row } = data;
      dataList.value[index][prop] = value;
      if (prop === "position") {
        onEditCell(prop, value, row);
        // 编辑成功后 对顺序字段进行排序处理 
        moveTableRow(dataList, dataList.value[index]);
        return;
      }
    });
    const options = [
      { label: "待处理", value: 0 },
      { label: "进行中", value: 1 },
      { label: "已处理", value: 2 },
      { label: "已完成", value: 3 }
    ];
    const colorMap = {
      0: "#909399",
      1: "#e6a23c",
      2: "#409eff",
      3: "#67c23a",
      4: "#DC143C"
    };

    const columnData: TableColumnList[] = [
      { label: "排序", prop: "position", width: 55, align: "center", cellRenderer: (data) => editCellRenderer(data, true) },
      { label: "星级", prop: "star" },
      { label: "组织ID", prop: "id", minWidth: 180 },
      { label: "用户名(可编辑)", prop: "username", cellRenderer: (data) => editCellRenderer(data, true) },
      { label: "年龄(可编辑)", prop: "age", cellRenderer: (data) => editCellRenderer(data, true) },
      { label: "状态(下拉编辑)", prop: "state", cellRenderer: (data) => editSelectRenderer(data, options, true, { background: colorMap[data.row[data.column["property"]]] }) },
      { label: "颜色", prop: "color" },
      { label: "描述", prop: "desc" },
      { label: "标题", prop: "title" },
      { label: "金额", prop: "money" },
      { label: "词语", prop: "word" },
      { label: "日期", prop: "borth" },
      { label: "创建时间", prop: "createTime" },
      { label: "更新时间", prop: "updateTime" }
    ];
    columns.value = setColomn({ columnData, showOpt: true, showRadio: true, indexColumn: false });
  };

  /** 获取列表 */
  async function onSearch() {
    try {
      loading.value = true;
      const res = await testList(formData);
      const data = res.data.map((item, index) => ({ position: index + 1, ...item }));
      dataList.value = data;
      getColumnConfig(dataList);
      pagination.total = data.length;
      pagination.pageSize = 100;
      pagination.currentPage = 1;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log("error:", error);
    }
  }

  // 编辑单元格
  function onEditCell(prop, value, row) {
    console.log("编辑字段:", prop, "提交的值:", value, "\n行数据:", row);
  }

  const onExport = () => {
    downloadDataToExcel([
      {
        dataList: dataList.value,
        columns: columns.value,
        fileName: "表格数据"
      }
    ]);
  };

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 添加、编辑弹窗
  function openDialog(type: RowHandleType, row?: TestItemType) {
    const titleObj = { add: "添加", edit: "编辑" };
    const title = titleObj[type];
    const _formData = {
      id: row?.id ?? "",
      username: row?.username ?? "",
      age: row?.age ?? ""
    };
    addDialog({
      title: `${title}组织`,
      props: {
        formInline: _formData,
        formConfigs: formConfigs(type)
      },
      width: "75%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as TestItemType;
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                onaddTest(type, title, curData, () => {
                  done(); // 关闭弹框
                  onSearch(); // 刷新表格数据
                });
              })
              .catch(() => { });
          }
        });
      }
    });
  }

  // 添加、编辑提交
  const onaddTest = (type: "add" | "edit", title, data, callback) => {
    const API = { add: addTest, edit: updateTest };
    API[type](data)
      .then((res) => {
        if (res.code !== 200) throw res.message;
        callback();
        message(`${title}成功`, { type: "success" });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // 删除组织
  function handleDelete(row: TestItemType) {
    deleteTest({ id: row.id })
      .then((res) => {
        message(`删除成功`, { type: "success" });
        onSearch();
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  /** 流程图 */
  const openWorkFlow = ({ text }) => {
    addDialog({
      title: "部署流程设计文件",
      props: { dataMsg: { dataMsg: 666 } },
      width: "640px",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Bpmn, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        if (!FormRef) return message("请保存模型", { type: "error" });
        console.log("FormRef", FormRef);
        ElMessageBox.confirm("确认提交吗", "系统提示", {
          type: "warning",
          draggable: true,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        })
          .then(() => {
            const fd = new FormData();
            const fileName = `${FormRef.name}.xml`;
            const xmlFile = new File([FormRef.data], fileName, { type: "text/xml" });
            fd.append("files", xmlFile);
            fd.append("deployName", FormRef.name);

            // deployFlow(fd).then((res) => {
            //   if (res.data) {
            //     message("部署成功");
            //   } else {
            //     message("部署失败", { type: "error" });
            //   }
            // });
          })
          .catch(console.log);
      }
    });
  };

  // 分页相关
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(rows: TableDataItemType[]) {
    console.log("多选", JSON.parse(JSON.stringify(rows)));
  }
  function onCurrentChange(row: TableDataItemType) {
    console.log("单选", row?.id);
  }

  const moveTableRow = (dataList, row, type?) => {
    let seq = Number(row.position);
    if (type) {
      const direction = type === "up" ? -1 : 1;
      seq += direction;
    }
    const len = dataList.value.length;
    const newArr = dataList.value.filter(({ uuid }) => uuid !== row.uuid);
    const pos = seq >= len ? len - 1 : seq <= 0 ? 0 : seq - 1;
    newArr.splice(pos, 0, row);
    newArr.forEach((item, index) => (item.position = index + 1));
    dataList.value = newArr;
  };

  return {
    formData,
    maxHeight,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    onExport,
    openWorkFlow,
    handleSizeChange,
    onCurrentChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
