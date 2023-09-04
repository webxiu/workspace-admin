/*
 * @Author: lixiuhai
 * @Date: 2023-07-06 14:21:11
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-08-24 15:20:26
 */

import editForm from "../form.vue";
import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, withModifiers, Ref } from "vue";
import { formConfigs } from "./config";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

import { type PaginationProps } from "@pureadmin/table";
import { testList, addTest, updateTest, deleteTest, TestItemType } from "@/api/editTable";
import { utils, writeFile } from "xlsx";
import { setColomn } from "@/utils/common";

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
    const editIndex = ref<number>(-1);
    const editValue = ref<string>("");
    const editField = ref<string>("");

    const onBlur = (prop, index, row) => {
      editIndex.value = -1;
      dataList.value[index][prop] = editValue.value;
      // 提交请求
      onEditCell(prop, editValue.value, row);
    };
    const onClick = (prop, index, value) => {
      editField.value = prop;
      editIndex.value = index;
      editValue.value = value;
    };

    // 1.输入框编辑
    const editCellRenderer = ({ row, column, index }) => {
      const fieldProp = column["property"];
      const isCell = editIndex.value === index && fieldProp === editField.value;
      return (
        <>
          <el-input
            size="small"
            v-show={isCell}
            v-model={editValue.value}
            onBlur={() => onBlur(fieldProp, index, row)}
            onKeyup={(e) => e.code === "Enter" && onClick(fieldProp, index, row[fieldProp])}
          />
          <span v-show={!isCell} onClick={() => onClick(fieldProp, index, row[fieldProp])} class="ui-w-100 ui-d-ib" style={{ height: "24px" }}>
            {row[fieldProp]}
          </span>
        </>
      );
    };

    // 下拉框列表
    const options = [
      { label: "待处理", value: 0 },
      { label: "进行中", value: 1 },
      { label: "已处理", value: 2 },
      { label: "已完成", value: 3 }
    ];
    // 2.下拉框编辑
    const editSelectRenderer = ({ row, column, index, options }) => {
      const bgColor = { 0: "#009688", 1: "#00f", 2: "#0a0", 3: "#f0f" };
      const stateStyle = { color: "#fff", borderRadius: "4px" };
      const fieldProp = column["property"];
      const isCell = editIndex.value === index && fieldProp === editField.value;
      const style = { ...stateStyle, background: bgColor[`${row.state}`] };
      const stateObj = { 0: "待处理", 1: "进行中", 2: "已处理", 3: "已完成" };
      return (
        <>
          <el-select
            size="small"
            v-show={isCell}
            v-model={editValue.value}
            class="ui-w-100"
            placeholder="请选择"
            onBlur={() => onBlur(fieldProp, index, row)}
            onChange={(value) => onClick(fieldProp, index, value)}
          >
            {options?.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
          <span v-show={!isCell} onClick={() => onClick(fieldProp, index, row[fieldProp])} class="ui-w-100 ui-d-ib" style={{ height: "24px", ...style }}>
            {stateObj[row.state]}
          </span>
        </>
      );
    };

    const columnData: TableColumnList[] = [
      { label: "选择", prop: "title" },
      { label: "组织ID", prop: "id" },
      { label: "用户名(可编辑)", prop: "username", cellRenderer: ({ row, column, index }) => editCellRenderer({ row, column, index }) },
      { label: "年龄(可编辑)", prop: "age", cellRenderer: ({ row, column, index }) => editCellRenderer({ row, column, index }) },
      { label: "状态(下拉编辑)", prop: "state", cellRenderer: ({ row, column, index }) => editSelectRenderer({ row, column, index, options }) },
      { label: "color", prop: "color" },
      { label: "desc", prop: "desc" },
      { label: "title", prop: "title" },
      { label: "money", prop: "money" },
      { label: "word", prop: "word" },
      { label: "borth", prop: "borth" },
      { label: "创建时间", prop: "createTime" },
      { label: "更新时间", prop: "updateTime" }
    ];
    columns.value = setColomn({ columnData, showOpt: true });
  };

  onMounted(() => {
    onSearch();
  });

  /** 获取列表 */
  async function onSearch() {
    try {
      loading.value = true;
      const res = await testList(formData);
      const data = res.data;
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
    console.log("编辑字段:", prop, "\n提交的值:", value, "\n行数据:", row);
  }

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

  const exportExcel = () => {
    const res = dataList.value.map((item) => {
      const arr = [];
      columns.value.forEach((column) => {
        arr.push(item[column.prop as string]);
      });
      return arr;
    });
    const titleList = [];
    columns.value.forEach((column) => {
      titleList.push(column.label);
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, "数据报表");
    writeFile(workBook, "表格数据.xlsx");
    message("导出成功", { type: "success" });
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
      contentRenderer: () => h(editForm, { ref: formRef }),
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
              .catch(() => {});
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
        if (res.status !== 200) throw res.message;
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

  return {
    formData,
    maxHeight,
    loading,
    columns,
    dataList,
    pagination,
    exportExcel,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    onCurrentChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
