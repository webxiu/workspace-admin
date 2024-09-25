<!-- /*
 * @Author: Hailen 
 * @Date: 2023-10-25 14:47:07 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-10-25 14:47:07 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hooks";
import { Col, Row } from "@/layout/Layout";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchTeamManagePositionIndex" });

const {
  loading,
  loading2,
  loading3,
  columns,
  columns2,
  columns3,
  dataList,
  dataList2,
  dataList3,
  maxHeight,
  buttonList,
  buttonList2,
  buttonList3,
  groupArrsList,
  onPostUpdate,
  onPostDelete,
  onRefresh,
  onRefresh2,
  onRefresh3,
  onDutyUpdate,
  onDutyDelete,
  onTemplateUpdate,
  onTemplateDelete,
  onCurrentChange,
  onCurrentChange2
} = useConfig();
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="8" :lg="10" :xl="10">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[0]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="position-table1"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :highlight-current-row="true"
            :show-overflow-tooltip="true"
            @current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onPostUpdate(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除岗位【${row.roleName}】吗?`" @confirm="onPostDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="8" :lg="7" :xl="7">
      <PureTableBar :columns="columns2" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="position-table2"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :highlight-current-row="true"
            :show-overflow-tooltip="true"
            @current-change="onCurrentChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onDutyUpdate(row)">修改</el-button>
              <el-popconfirm :width="280" :title="'确定删除这条岗位职责吗'" @confirm="onDutyDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="8" :lg="7" :xl="7">
      <PureTableBar :columns="columns3" @refresh="onRefresh3" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[2]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList3" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="position-table3"
            :adaptive="true"
            align-whole="center"
            :loading="loading3"
            :size="size"
            :data="dataList3"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :highlight-current-row="true"
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns3)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click="onTemplateUpdate(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确定删除文件模板【${row.fileName}】吗?`" @confirm="onTemplateDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>

<style scoped lang="scss">
:deep(.pure-table .approval-agent .el-table__expand-icon > .el-icon) {
  font-size: 16px;
}
</style>
