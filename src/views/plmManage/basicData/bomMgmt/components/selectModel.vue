<template>
  <div class="select-user">
    <div class="left-tree">
      <el-tree
        accordion
        :data="leftTreeData"
        :defaultProps="defaultProps"
        :default-expanded-keys="['0']"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :current-node-key="curNodeName"
        node-key="id"
        @node-click="onNodeClick"
      />
    </div>
    <div class="right-table">
      <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
        <template #title>
          <div style="display: flex">
            <div class="search-ipt">
              <el-input @keyup.enter="onEnterAction" size="small" v-model="searchParams.number" placeholder="物料编码" />
              <el-input @keyup.enter="onEnterAction" style="margin-left: 10px" size="small" v-model="searchParams.name" placeholder="物料名称" />
              <el-input @keyup.enter="onEnterAction" style="margin-left: 10px" size="small" v-model="searchParams.specification" placeholder="物料规格" />
              <el-button style="margin-left: 10px; font-size: 12px" type="primary" :icon="Search" @click="btnClickSearch">查询</el-button>
            </div>
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="materialTableRef"
            border
            @row-click="(row, col, ev) => rowClick(row, col, ev, setA)"
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="440"
            :max-height="440"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            size="small"
            :data="dataList"
            :columns="dynamicColumns"
            @selection-change="handleSelectionChange"
            highlight-current-row
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #name="{ row }">
              <div style="display: flex">
                <div style="margin-left: 5px">{{ row.name }}</div>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import { useMaterialTable } from "./selectMaterialConfig";
import { Search } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { getMaterialGroupTreeData } from "@/api/plmManage";

const {
  columns,
  searchParams,
  dataList,
  loading,
  handleSizeChange,
  handleCurrentChange,
  onSearch,
  materialTableRef,
  pagination,
  rowClick,
  handleSelectionChange
} = useMaterialTable();

const leftTreeData = ref<any>([]);
const props = defineProps(["setA", "isSingleTrue"]);
console.log(props.isSingleTrue, "model props");

const defaultProps = { children: "children", label: "name", id: "id" };
const curNodeName = ref("0");

const onEnterAction = () => onSearch({ ...searchParams, deptId: curNodeName.value });

const btnClickSearch = () => onSearch({ ...searchParams, deptId: curNodeName.value });

const getTreeData = () => {
  getMaterialGroupTreeData({}).then((res: any) => {
    if (res.data) {
      leftTreeData.value = res.data;
    }
  });
};

const onNodeClick = (treeItem) => {
  const finalArr = [];

  const loopFindId = (item) => {
    finalArr.push(item.id);

    if (item.children && Array.isArray(item.children) && item.children.length) {
      item.children.forEach((el) => {
        loopFindId(el);
      });
    }
  };
  loopFindId(treeItem);

  searchParams.groupIdList = treeItem.id !== "0" ? finalArr : [];
  curNodeName.value = treeItem.id;
  onSearch({ ...searchParams });
};

onMounted(() => {
  getTreeData();
  if (props.isSingleTrue) {
    searchParams.selectBOM = true;
  }
  onSearch({ ...searchParams });
});
</script>

<style scoped lang="scss">
.search-ipt {
  display: flex;
}

.select-user {
  display: flex;

  .left-tree {
    flex: 20%;
    height: 480px;
    overflow-y: auto;
  }

  .right-table {
    flex: 80%;
    overflow-y: auto;
    background-color: pink;
  }
}
</style>
