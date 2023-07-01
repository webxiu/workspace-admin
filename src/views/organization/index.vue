<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:45 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:45 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useEleHeight } from "@/hooks/common";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import BlendedSearch, { SearchOptionType } from "@/components/BlendedSearch/index.vue";

const { formData, loading, columns, dataList, pagination, onSearch, openDialog, handleDelete, handleSizeChange, handleCurrentChange, handleSelectionChange } = useRole();

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

const defaultValue = ref({}); //默认搜索值
const boxRef = ref<HTMLDivElement>();
const maxHeight = useEleHeight(".app-main .el-scrollbar", 60 + 64 + 48);

const handleTagSearch = (val) => {
  formData.value = val.value;
  onSearch();
};
</script>

<template>
  <div class="main ui-h-100" ref="boxRef">
    <PureTableBar title="列表" v-if="columns.length" :columns="columns" @refresh="onSearch">
      <template #title>
        <BlendedSearch class="action-search" @tagSearch="handleTagSearch" :options="searchOptions" placeholder="请输入组织名称" searchField="orgName" :default="defaultValue" />
      </template>
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog('add')">添加组织</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          v-if="maxHeight"
          :height="maxHeight"
          :max-height="maxHeight"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)" @click="openDialog('edit', row)"> 修改 </el-button>
            <el-popconfirm :width="180" :title="`确认删除组织名称\n【${row.orgName}】?`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Delete)"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
