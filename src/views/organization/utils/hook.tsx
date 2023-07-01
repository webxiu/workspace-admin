/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:50:23
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-06-30 17:59:53
 */
import editForm from "../form.vue";
import { organizationList, addOrganization, updateOrganization, deleteOrganization } from "@/api/orgList";
import { ElMessageBox, ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type OrganizationItemType } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { getColumns, formConfigs } from "./config";

export function useRole() {
  const formRef = ref();
  const formData = ref();
  const loading = ref(true);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<OrganizationItemType[]>([]);
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

  /** 获取列表 */
  async function onSearch() {
    try {
      loading.value = true;
      const res = await organizationList(formData.value);
      const data = res.data;
      dataList.value = data;
      pagination.total = data.length;
      pagination.pageSize = 100;
      pagination.currentPage = 1;
      loading.value = false;
    } catch (error) {
      columns.value = getColumns([]);
      console.log("error:", error);
    }
  }

  /** 获取列表 */
  async function getOrgList() {
    try {
      loading.value = true;
      const res = await organizationList({});
      const data = res.data;
      columns.value = getColumns(data);
    } catch (error) {
      columns.value = getColumns([]);
      console.log("error:", error);
    }
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 添加、编辑弹窗
  function openDialog(type: "add" | "edit", row?: OrganizationItemType) {
    const titleObj = { add: "添加", edit: "编辑" };
    const title = titleObj[type];
    const _formData = {
      id: row?.id ?? "",
      orgName: row?.orgName ?? "",
      shortName: row?.shortName ?? "",
      orgCode: row?.orgCode ?? "",
      logo: row?.logo ?? "",
      orgAddress: row?.orgAddress ?? "",
      tel: row?.tel ?? "",
      tax: row?.tax ?? "",
      status: row?.status ?? "",
      kingdeeEnable: row?.kingdeeEnable ?? "",
      qywxEnable: row?.qywxEnable ?? "",
      qhEnable: row?.qhEnable ?? "",
      orgDomain: row?.orgDomain ?? "",
      orgDomainPort: row?.orgDomainPort ?? "",
      qywxOrgDomain: row?.qywxOrgDomain ?? "",
      qywxOrgDomainPort: row?.qywxOrgDomainPort ?? "",
      kdApiAcctId: row?.kdApiAcctId ?? "",
      kdApiAppId: row?.kdApiAppId ?? "",
      kdApiAppSec: row?.kdApiAppSec ?? "",
      kdApiLCID: row?.kdApiLCID ?? "",
      kdApiServerUrl: row?.kdApiServerUrl ?? "",
      kdApiFcreateorgid: row?.kdApiFcreateorgid ?? "",
      kdApiFuseorgid: row?.kdApiFuseorgid ?? "",
      qhFileHost: row?.qhFileHost ?? "",
      qhFileIp: row?.qhFileIp ?? "",
      qhFilePort: row?.qhFilePort ?? "",
      qhFileUserName: row?.qhFileUserName ?? "",
      qhFilePassword: row?.qhFilePassword ?? "",
      qywxOauth2url: row?.qywxOauth2url ?? "",
      qywxCorpid: row?.qywxCorpid ?? "",
      qywxPlmAgentid: row?.qywxPlmAgentid ?? "",
      qywxPlmSecret: row?.qywxPlmSecret ?? "",
      qywxWorkAgentid: row?.qywxWorkAgentid ?? "",
      qywxWorkSecret: row?.qywxWorkSecret ?? "",
      qywxWorkComplaintDetailurl: row?.qywxWorkComplaintDetailurl ?? "",
      qywxReportAgentid: row?.qywxReportAgentid ?? "",
      qywxReportSecret: row?.qywxReportSecret ?? "",
      qywxContactsSecret: row?.qywxContactsSecret ?? "",
      qywxCCTemplateId: row?.qywxCCTemplateId ?? "",
      qywxAppAgentid: row?.qywxAppAgentid ?? "",
      qywxAppSecret: row?.qywxAppSecret ?? "",
      qywxSToken: row?.qywxSToken ?? "",
      qywxSEncodingAESKey: row?.qywxSEncodingAESKey ?? "",
      pcQywxCorpid: row?.pcQywxCorpid ?? "",
      pcQywxWorkAgentid: row?.pcQywxWorkAgentid ?? "",
      pcQywxWorkSecret: row?.pcQywxWorkSecret ?? ""
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
        const curData = options.props.formInline as OrganizationItemType;
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
  }

  // 添加、编辑提交
  const onAddOrganization = (type: "add" | "edit", title, data, callback) => {
    const API = { add: addOrganization, edit: updateOrganization };
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
  function handleDelete(row: OrganizationItemType) {
    deleteOrganization({ id: row.id })
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
