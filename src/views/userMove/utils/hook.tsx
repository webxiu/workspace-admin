/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:50:23
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-22 08:30:53
 */
import editForm from "../form.vue";
import { getColumns } from "./config";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks/common";
import { organizationList } from "@/api/orgList";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { userMoveList, sendUserMove, UserMoveItemType, UserMoveRequestType, UserMoveRequestQueryType } from "@/api/userMove";

export function useRole() {
  const formRef = ref();
  const moveTableRef = ref();
  const loading = ref<boolean>(true);
  const orgOptions = ref<SearchOptionType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<UserMoveItemType[]>([]);
  const rows = ref<UserMoveItemType[]>([]);
  const maxHeight = useEleHeight(".app-main .el-scrollbar", 64 + 60 + 64);

  const formData = reactive<UserMoveRequestQueryType>({
    orgId: "",
    userCode: "",
    userName: "",
    page: 1,
    limit: 20
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 50, 100, 200, 500, 1000],
    background: true
  });

  onMounted(() => {
    getOrgList();
  });

  /** 获取列表 */
  async function onSearch() {
    try {
      loading.value = true;
      const res = await userMoveList(formData);
      const data = res.data;
      dataList.value = data.records;
      formData.page = data.current;
      formData.limit = data.size;
      pagination.total = data.total;
      pagination.pageSize = data.size;
      pagination.currentPage = data.current;
      loading.value = false;
      columns.value = getColumns(dataList, formData);
    } catch (error) {
      loading.value = false;
      console.log("error:", error);
      columns.value = getColumns(ref([]), formData);
    }
  }

  /** 获取列表 */
  async function getOrgList() {
    organizationList({})
      .then((res) => {
        const data = res.data;
        const options = data.map(({ shortName, id }) => ({ label: shortName, value: id }));
        formData.orgId = data[0].id;
        orgOptions.value = options;
        onSearch();
      })
      .catch((err) => {
        message(err.toString(), { type: "error" });
      });
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  function handleSelectionChange(values: UserMoveItemType[]) {
    rows.value = values;
  }

  // 批量迁移
  const onBatchMoveHandle = () => {
    if (rows.value.length === 0) {
      return message("请选择员工", { type: "error" });
    }
    openDialog(rows.value);
  };
  // 单个迁移
  const onMoveHandle = (row: UserMoveItemType) => {
    openDialog([row]);
  };

  // 添加、编辑弹窗
  function openDialog(rows: UserMoveItemType[]) {
    const userId = rows.map((row) => row.id);
    addDialog({
      title: `用户迁移`,
      props: {
        formInline: { newOrgId: "", userIds: userId },
        userRows: rows,
        tableRef: moveTableRef.value.getTableRef(),
        orgOptions: orgOptions.value.filter((item) => item.value !== formData.orgId)
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as UserMoveRequestType;
        const params = { userIds: userId, oldOrgId: formData.orgId, ...curData };
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSendUserMove(params, () => done());
            });
          }
        });
      }
    });
  }

  // 提交迁移
  const onSendUserMove = (data: UserMoveRequestType, callback) => {
    sendUserMove(data)
      .then((res) => {
        if (!res.data) throw res.message;
        ElMessage.success("迁移成功");
        callback();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return {
    moveTableRef,
    formData,
    orgOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    maxHeight,
    onMoveHandle,
    onBatchMoveHandle,
    resetForm,
    openDialog,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
