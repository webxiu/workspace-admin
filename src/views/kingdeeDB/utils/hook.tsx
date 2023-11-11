import EditForm from "@/components/EditForm/index.vue";
import { kingdeeDBList, addKingdeeDB, updateKingdeeDB, deleteKingdeeDB } from "@/api/kingdeeDB";
import { ElMessageBox, ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type KingdeeDBItemType } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, h, onMounted } from "vue";
import { getColumns, formConfigs, OptionsType } from "./config";
import { organizationList } from "@/api/orgList";
import { setColomn } from "@/utils/common";

export function useConfig() {
  const formRef = ref();
  const tableRef = ref();
  const formData = ref();
  const loading = ref(true);
  const columns = ref<TableColumnList[]>([]);
  const orgOptionList = ref<OptionsType[]>([]);
  const dataList = ref<KingdeeDBItemType[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  onMounted(() => {
    getColumnConfig();
    getOrgOptions();
  });

  /** 获取组织列表 */
  async function getOrgOptions() {
    try {
      const res = await organizationList({});
      const optionList = res.data?.map(({ id, orgName }) => ({ value: id, label: orgName }));
      orgOptionList.value = optionList;
    } catch (error) {
      orgOptionList.value = [];
      ElMessage.error(error.toString() || "组织列表获取失败");
    }
  }

  const getColumnConfig = () => {
    const columnData = getColumns(orgOptionList);
    columns.value = setColomn({ columnData, showOpt: true, showSelection: true, operateWidth: 140 });
  };

  /** 搜索 */
  async function onSearch() {
    getTableList();
  }
  /** 获取金蝶数据库列表 */
  async function getTableList() {
    try {
      loading.value = true;
      const res = await kingdeeDBList(formData.value);
      const data = res.data;
      dataList.value = data;
      pagination.total = data.length;
      pagination.pageSize = 100;
      pagination.currentPage = 1;
      loading.value = false;
    } catch (error) {
      ElMessage.error(error.toString() || "列表获取失败");
      console.log("error:", error);
    }
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    getTableList();
  };

  // 添加、编辑弹窗
  async function openDialog(type: "add" | "edit", row?: KingdeeDBItemType) {
    try {
      const titleObj = { add: "添加", edit: "编辑" };
      const title = titleObj[type];
      const _formData = {
        id: row?.id ?? "",
        accountName: row?.accountName ?? "",
        ipAddress: row?.ipAddress ?? "",
        linkDbName: row?.linkDbName ?? "",
        dbType: row?.dbType ?? "",
        username: row?.username ?? "",
        password: row?.password ?? "",
        nick: row?.nick ?? "",
        accountStatus: row?.accountStatus ?? "",
        orgId: row?.orgId ?? ""
      };
      addDialog({
        title: `${title}数据库`,
        props: {
          type: type,
          formInline: _formData,
          formConfigs: formConfigs(type, orgOptionList.value)
        },
        width: "75%",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(EditForm, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline as KingdeeDBItemType;
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
                  onAddOrganization(type, title, curData, () => {
                    done(); // 关闭弹框
                    getTableList(); // 刷新表格数据
                  });
                })
                .catch(() => {});
            }
          });
        }
      });
    } catch (error) {
      ElMessage.error("组织列表获取失败");
    }
  }

  // 添加、编辑提交
  const onAddOrganization = (type: "add" | "edit", title, data, callback) => {
    const API = { add: addKingdeeDB, edit: updateKingdeeDB };
    API[type](data)
      .then((res) => {
        if (res.status !== 200) throw res.message;
        callback();
        ElMessage.success(`${title}成功`);
      })
      .catch((err) => {
        ElMessage.error(err || `${title}失败`);
        console.log("err", err);
      });
  };

  // 删除组织
  function handleDelete(row: KingdeeDBItemType) {
    deleteKingdeeDB({ id: row.id })
      .then((res) => {
        if (res.status !== 200) throw res.message;
        ElMessage.success(`删除成功`);
        getTableList();
      })
      .catch((err) => {
        ElMessage.error(`删除失败`);
        console.log("err", err);
      });
  }

  // 分页相关
  function handleSizeChange(limit: number) {
    formData.value.limit = limit;
    getTableList();
  }

  function handleCurrentChange(page: number) {
    formData.value.page = page;
    getTableList();
  }

  function handleSelectionChange(rows: KingdeeDBItemType[]) {
    console.log("多选", rows);
  }

  const onRowClick = (row: KingdeeDBItemType) => {
    tableRef.value?.getTableRef().toggleRowSelection(row);
  };

  return {
    tableRef,
    formData,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    onRowClick,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
