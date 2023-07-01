import editForm from "../form.vue";
import { kingdeeDBList, addKingdeeDB, updateKingdeeDB, deleteKingdeeDB } from "@/api/kingdeeDB";
import { ElMessageBox, ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type KingdeeDBItemType } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, h, onMounted } from "vue";
import { getColumns, formConfigs, OptionsType } from "./config";
import { organizationList } from "@/api/orgList";

export function useRole() {
  const formRef = ref();
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
    getOrgList();
  });

  // 分页相关
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  /** 获取金蝶数据库列表 */
  async function onSearch() {
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

  /** 获取组织列表 */
  async function getOrgList() {
    try {
      const res = await organizationList({});
      const optionList = res.data?.map(({ id, orgName }) => ({ value: id, label: orgName }));
      orgOptionList.value = optionList;
      columns.value = getColumns(optionList);
    } catch (error) {
      columns.value = getColumns([]);
      ElMessage.error(error.toString() || "组织列表获取失败");
    }
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
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
        contentRenderer: () => h(editForm, { ref: formRef }),
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
                    onSearch(); // 刷新表格数据
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
        onSearch();
      })
      .catch((err) => {
        ElMessage.error(`删除失败`);
        console.log("err", err);
      });
  }

  return {
    formData,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
