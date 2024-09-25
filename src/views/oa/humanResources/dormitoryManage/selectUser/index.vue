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
              <el-input size="small" style="width: 100px" v-model="searchParams.userCode" placeholder="工号" />
              <el-input style="width: 100px; margin: 0 12px" size="small" v-model="searchParams.userName" placeholder="姓名" />
              <el-select v-model="searchParams.state" class="ml-2" placeholder="职员状态" style="width: 100px; font-size: 12px">
                <el-option v-for="item in userStateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button style="margin-left: 30px; font-size: 12px" type="primary" :icon="Search" @click="btnClickSearch">查询</el-button>
            </div>
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
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
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
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
import { onMounted, reactive, ref } from "vue";
import { useUserTable } from "./selectUserConfig";
import { Search } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { getStateOptionList } from "@/api/oaManage/financeDept";
import { getDeptTreeData } from "@/api/systemManage";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";

const { columns, dataList, loading, onSearch, rowClick } = useUserTable();

const userStateOptions = ref([]);

const leftTreeData = ref<any>([]);
defineProps(["setA"]);

const defaultProps = { children: "children", label: "name", id: "id" };
const curNodeName = ref("0");

const searchParams = reactive({ userCode: "", userName: "", state: "在职" });

const btnClickSearch = () => {
  const v = { ...searchParams, deptId: curNodeName.value };
  if (v.userCode || v.userName) v.deptId = "";
  onSearch(v);
};

const getTreeData = () => {
  loading.value = true;
  getDeptTreeData()
    .then((res: any) => {
      leftTreeData.value = JSON.parse(res.data);
    })
    .finally(() => (loading.value = false));
};

const onNodeClick = (treeItem) => {
  curNodeName.value = treeItem.id;
  onSearch({ ...searchParams, deptId: treeItem.id });
};

const fetchOptionList = () => {
  getBOMTableRowSelectOptions({ optioncode: "EmployeeStatus" }).then((res) => {
    if (res.data) {
      const result = res.data[0]?.optionList || [];
      userStateOptions.value = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
    }
  });
};

onMounted(() => {
  fetchOptionList();
  getTreeData();
});
</script>

<style scoped lang="scss">
.search-ipt {
  display: flex;
}

.select-user {
  display: flex;

  .left-tree {
    flex: 10%;
    height: 480px;
    overflow-y: auto;
  }

  .right-table {
    flex: 60%;
    overflow-y: auto;
    background-color: pink;
  }
}
</style>
