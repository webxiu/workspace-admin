<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTable } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import BlendedSearch, { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ButtonList, { LoadingType, ButtonItemType } from "@/components/ButtonList/index.vue";
const baseApi = import.meta.env.VITE_BASE_API;
import { message } from "@/utils/message";

//默认搜索值
const defaultValue = ref({
  username: { key: "username", label: "用户名", value: "张三xx", valueLabel: "" },
  status: { key: "status", label: "状态", readonly: true, value: 1, valueLabel: "正常" },
  date: { key: "date", label: "时间", value: "2020-05-08 ~ 2022-06-25", valueLabel: "" }
});
const tableRef = ref<HTMLDivElement>();
const loadingStatus = ref<LoadingType>({ loading: false, text: "" });

const {
  formData,
  maxHeight,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onExport,
  openDialog,
  openWorkFlow,
  handleDelete,
  handleSizeChange,
  onCurrentChange,
  handleCurrentChange,
  handleSelectionChange
} = useTable();

const searchOptions: SearchOptionType[] = [
  { label: "ID", value: "id" },
  { label: "用户名", value: "username" },
  { label: "年龄", value: "age" },
  {
    label: "状态",
    value: "status",
    readonly: true,
    children: [
      { label: "开启", value: 1 },
      { label: "关闭", value: 0 }
    ]
  },
  {
    label: "组织名称",
    value: "uname",
    children: [
      { label: "零度空间", value: "零度空间" },
      { label: "利达科技", value: "利达科技" }
    ]
  },
  { label: "日期1", value: "date" },
  { label: "日期2", value: "date2" }
];

const clickHandler = ({ text }) => {
  console.log("当前按钮:", text);
  // 设置loading
  loadingStatus.value = { text: text, loading: true };
  (function () {
    setTimeout(() => {
      loadingStatus.value = { text: text, loading: false };
    }, 3000);
  })();
};

// 上传过滤
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  loadingStatus.value = { text: "导入Excel", loading: true };
  if (!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(rawFile.type)) {
    message("文件必须为xls或xlsx格式!", { type: "warning" });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 5) {
    message("文件大小不能超过5MB！", { type: "warning" });
    return false;
  }
  return true;
};
// 上传成功回调
function onUploadSuccess(response) {
  loadingStatus.value = { text: "导入Excel", loading: false };
  message("导入成功");
}
// 上传失败回调
function onUploadError(error) {
  loadingStatus.value = { text: "导入Excel", loading: false };
  message("导入失败", { type: "error" });
}

const buttonList = ref<ButtonItemType[]>([
  { clickHandler: openWorkFlow, type: "primary", text: "流程图" },
  { clickHandler: clickHandler, type: "default", text: "编辑(-)" },
  { clickHandler: clickHandler, type: "success", text: "删除(-)" },
  { clickHandler: clickHandler, type: "primary", text: "打印(-)" },
  {
    clickHandler: clickHandler,
    type: "danger",
    text: "上传",
    uploadProp: {
      accept: ".xls,.xlsx",
      action: `${baseApi}/oa/hr/attendanceSummary/uploadExcel`,
      onSuccess: onUploadSuccess,
      onError: onUploadError,
      beforeUpload: beforeAvatarUpload
    }
  }
]);

const handleTagSearch = (values) => {
  console.log("提交搜索:", values);
  formData.name = values;
  onSearch();
};
</script>

<template>
  <div class="main ui-h-100" ref="tableRef">
    <PureTableBar title="列表" :columns="columns" @refresh="onSearch">
      <template #title>
        <BlendedSearch class="action-search" @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入名称" searchField="name" :queryParams="defaultValue" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" />
        <el-button type="primary" @click="onExport" class="float-right">导出</el-button>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog('add')">添加数据</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          row-key="id"
          :adaptive="true"
          :height="maxHeight"
          :max-height="maxHeight"
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          highlight-current-row
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)" @click.stop="openDialog('edit', row)">修改</el-button>
            <el-popconfirm :width="180" :title="`确认删除组织名称\n【${row.orgName}】?`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Delete)" @click.stop>删除</el-button>
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

:deep(tr.current-row > td .el-radio .el-radio__inner) {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);

  &::after {
    background-color: var(--el-color-white);
    transform: translate(-50%, -50%) scale(1);
  }
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
