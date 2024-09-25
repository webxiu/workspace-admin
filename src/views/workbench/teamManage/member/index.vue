<template>
  <Row>
    <Col :xs="24" :sm="24" :md="4" :lg="5" :xl="5" style="padding-top: 8px">
      <div class="info-left-tree border-line">
        <el-divider style="margin: 10px auto">部门组管理</el-divider>
        <el-tree :data="memberOption.deptGroupTree" style="width: 260px" :default-expand-all="true" :props="defaultProps" @node-click="onNodeClick">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ data.title }}</span>
              <span>
                <span v-if="!data.parentId" title="新增分组">
                  <IconifyIconOffline @click="onAdd(data)" :icon="CirclePlus" class="ui-d-ib fz-16 ui-va-m" />
                </span>
                <template v-else>
                  <span title="修改分组">
                    <IconifyIconOffline @click="onEdit(data)" :icon="Edit" title="修改分组" class="ui-d-ib fz-16 ui-va-m" />
                  </span>
                  <span title="删除分组">
                    <IconifyIconOffline @click="remove(data, node)" :icon="Delete" title="删除分组" class="ui-d-ib fz-16 ui-va-m ml-2" />
                  </span>
                </template>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="19" :xl="19">
      <PureTableBar :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入查询内容" searchField="staffId" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="handleEdit(row)">修改</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import { PureTableBar } from "@/components/RePureTableBar";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import Edit from "@iconify-icons/ep/edit";
import Delete from "@iconify-icons/ep/delete";
import CirclePlus from "@iconify-icons/ep/circle-plus";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchTeamManageMemberIndex" });

const {
  formData,
  memberOption,
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  onAdd,
  onEdit,
  remove,
  onSearch,
  onNodeClick,
  handleEdit,
  handleSizeChange,
  handleCurrentChange
} = useConfig();

const defaultProps = { children: "children", label: "title" };
const searchOptions: SearchOptionType[] = [
  { label: "工号", value: "staffId" },
  { label: "姓名", value: "staffName" }
];

const handleTagSearch = (values) => {
  formData.staffId = values.staffId;
  formData.staffName = values.staffName;
  onSearch();
};
</script>

<style lang="scss" scoped>
.info-left-tree {
  height: 100%;
  min-width: 260px;
  min-height: 200px;
  padding: 10px 15px;
}

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
