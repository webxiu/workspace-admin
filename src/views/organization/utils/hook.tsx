/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:50:23
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-01-02 15:22:33
 */
import EditForm from "@/components/EditForm/index.vue";
import { organizationList, addOrganization, updateOrganization, deleteOrganization } from "@/api/orgList";
import { ElMessageBox, ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { type OrganizationItemType } from "../utils/types";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { getColumns, formConfigs } from "./config";
import { setColumn } from "@/utils/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { useEleHeight } from "@/hooks/common";

export function useConfig() {
  const formRef = ref();
  const tableRef = ref();
  const formData = ref();
  const loading = ref(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<OrganizationItemType[]>([]);
  const orgOptionList = ref<OrganizationItemType[]>([]);
  const maxHeight = useEleHeight(".app-main .el-scrollbar", 60 + 64 + 48);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const queryParams = ref({}); //默认搜索值
  const searchOptions: SearchOptionType[] = [
    { label: "ID", value: "id" },
    // { label: "组织名称", value: "orgName" },// 已经作为searchField的默认搜索字段, 下拉搜索中不显示
    { label: "组织简称", value: "shortName" },
    { label: "组织内码", value: "orgCode" },
    { label: "组织地址", value: "orgAddress" },
    { label: "联系方式", value: "tel" },
    { label: "传真", value: "tax" },
    {
      label: "状态",
      value: "status",
      readonly: true,
      children: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ]
    },
    { label: "PC端组织域名", value: "orgDomain" },
    { label: "PC端组织域名端口", value: "orgDomainPort" },
    {
      label: "组织Logo",
      value: "logo"
    },
    {
      label: "是否启用金蝶",
      value: "kingdeeEnable",
      readonly: true,
      children: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "AcctId", value: "kdApiAcctId" },
    { label: "AppId", value: "kdApiAppId" },
    { label: "AppSec", value: "kdApiAppSec" },
    { label: "LCID", value: "kdApiLCID" },
    { label: "ServerUrl", value: "kdApiServerUrl" },
    { label: "FcreateorgId", value: "kdApiFcreateorgid" },
    { label: "FuseorgId", value: "kdApiFuseorgid" },
    {
      label: "是否启用群晖",
      value: "qhEnable",
      readonly: true,
      children: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "Host", value: "qhFileHost" },
    { label: "IP", value: "qhFileIp" },
    { label: "Port", value: "qhFilePort" },
    { label: "UserName", value: "qhFileUserName" },
    { label: "Password", value: "qhFilePassword" },
    { label: "OrgDomainPort", value: "qywxOrgDomainPort" },
    { label: "OrgDomain", value: "qywxOrgDomain" },
    { label: "Oauth2Url", value: "qywxOauth2url" },
    { label: "CorpId", value: "qywxCorpid" },
    { label: "PlmAgentId", value: "qywxPlmAgentid" },
    { label: "PlmSecret", value: "qywxPlmSecret" },
    { label: "WorkAgentId", value: "qywxWorkAgentid" },
    { label: "WorkSecret", value: "qywxWorkSecret" },
    { label: "WorkComplaintDetailUrl", value: "qywxWorkComplaintDetailurl" },
    { label: "ReportAgentId", value: "qywxReportAgentid" },
    { label: "ReportSecret", value: "qywxReportSecret" },
    { label: "ContactsSecret", value: "qywxContactsSecret" },
    { label: "CCTemplateId", value: "qywxCCTemplateId" },
    { label: "AppAgentId", value: "qywxAppAgentid" },
    { label: "AppSecret", value: "qywxAppSecret" },
    { label: "SToken", value: "qywxSToken" },
    { label: "SEncodingAESKey", value: "qywxSEncodingAESKey" },
    {
      label: "是否启用企业微信",
      value: "qywxEnable",
      readonly: true,
      children: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "CorpId", value: "pcQywxCorpid" },
    { label: "WorkAgentId", value: "pcQywxWorkAgentid" },
    { label: "WorkSecret", value: "pcQywxWorkSecret" }
  ];

  onMounted(() => {
    getOrgOptions();
    getColumnConfig();
    getTableList();
  });

  /** 获取列表 */
  async function getOrgOptions() {
    try {
      loading.value = true;
      const res = await organizationList({});
      orgOptionList.value = res.data;
    } catch (error) {
      orgOptionList.value = [];
      console.log("error:", error);
    }
  }

  const getColumnConfig = () => {
    const columnData = getColumns(orgOptionList);
    columns.value = setColumn({ columnData, showOpt: true, showSelection: true, operateWidth: 140 });
  };

  /** 搜索 */
  function onSearch(val) {
    formData.value = val.value;
    getTableList();
  }

  /** 获取列表 */
  async function getTableList() {
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
      loading.value = false;
      console.log("error:", error);
    }
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    getTableList();
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
        formConfigs: formConfigs(type),
        formProps: { labelWidth: 160 }
      },
      width: "75%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
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
                  getTableList(); // 刷新表格数据
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
        if (res.code !== 200) throw res.message;
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
        if (res.code !== 200) throw res.message;
        ElMessage.success(`删除成功`);
        getTableList();
      })
      .catch((err) => {
        ElMessage.error(`删除失败`);
        console.log("err", err);
      });
  }

  // 分页相关
  function handleSizeChange(val: number) {
    formData.value.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.value.page = val;
    getTableList();
  }

  function handleSelectionChange(rows: OrganizationItemType[]) {
    console.log("多选", rows);
  }
  const onRowClick = (row: OrganizationItemType) => {
    tableRef.value?.getTableRef().toggleRowSelection(row);
  };
  return {
    tableRef,
    formData,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    queryParams,
    searchOptions,
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
