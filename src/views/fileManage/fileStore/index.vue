<template>
  <div class="main flex ui-h-100">
    <div class="info-left-tree border-line">
      <el-tree
        :data="leftTreeData"
        :defaultProps="defaultProps"
        style="width: 260px"
        :default-expand-all="true"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :current-node-key="curNodeName"
        node-key="name"
        @node-click="onNodeClick"
      />
    </div>
    <div class="flex-1 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" style="padding-top: 0">
        <template #buttons>
          <div style="flex: 1"><ButtonList :buttonList="buttonList" :auto-layout="false" more-action-text="业务操作" /></div>
          <input type="file" style="display: none" id="file" ref="files" @input="onUpload(pathArr, fetchData)" />
        </template>
        <template #title>
          <div style="display: flex">
            <div class="level">
              <div class="lv-box" style="display: flex">
                <div :key="item.name" v-for="item in pathArr" style="display: flex; flex-shrink: 0">
                  <div class="pathItem" @click="clickPathArrItem(item)">{{ item.name }}</div>
                  <div style="margin: 0 5px">&gt;</div>
                </div>
              </div>
            </div>
            <div class="search-ipt">
              <el-dialog center v-model="dialogVisible" title="上传进度" width="30%" draggable :show-close="false" :close-on-click-modal="false">
                <div>
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="percentage" />
                </div>
              </el-dialog>

              <el-input style="height: 34px" v-model="fileSearch" size="large" @change="changeSearchValue" placeholder="回车键搜索" :prefix-icon="Search" />
            </div>
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            @sort-change="sortChange"
            @row-dblclick="dbSelected"
          >
            <template #operation="{ row }">
              <el-button v-if="row.isdir" plain type="primary" size="small" @click="() => dbSelected(row)">打开</el-button>
              <el-button plain type="danger" size="small" @click="remove(row, fetchData)">删除</el-button>
              <el-button plain type="warning" size="small" @click="onEdit(row, fetchData)">重命名</el-button>
              <el-button plain type="success" size="small" @click="onDownload(row)">下载</el-button>
              <el-button plain type="primary" v-if="!row.isdir" size="small" @click="onView(row)">预览</el-button>
            </template>
            <template #name="{ row }">
              <div style="display: flex">
                <div>
                  <svg class="icon" aria-hidden="true" v-if="IconMap[calcName(row)]">
                    <use :xlink:href="`#icon-${IconMap[calcName(row)]}`" />
                  </svg>
                  <div v-else style="font-size: 20px"><IconifyIconOffline :icon="File" /></div>
                </div>
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
import { onMounted, ref } from "vue";
import File from "@iconify-icons/ep/document";
import { Search } from "@element-plus/icons-vue";

import { getSizeByBit, TSToDate } from "@/utils/getFileSize";
import { useTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";
import { IconMap } from "./fileIconMap";
import { fetchFileRootDirs, fetchFileTableData, searchFileTableData } from "@/api/fileManage";

defineOptions({ name: "FileManageFileStoreIndex" });

const fileSearch = ref("");
const pathArr = ref([{ name: "德龙文件库", path: "" }]);
const curNodeName = ref("德龙文件库");
const files = ref(null);
const loading = ref(false);
const leftTreeData = ref<any>([]);
const dataList = ref<any>([]);
const sortDir = ref("");
const sortBy = ref("");
const defaultProps = { children: "children", label: "name" };

const clickHandler = ({ text }) => {
  if (text === "向上") {
    if (pathArr.value.length > 1) {
      pathArr.value.pop();
      const row = pathArr.value[pathArr.value.length - 1];
      console.log(row, "back row");
      if (row.name === "德龙文件库") {
        getTreeData();
      } else {
        fetchData({ folderPath: row.path });
      }
    }
  }

  if (text === "新建") {
    const { path } = pathArr.value[pathArr.value.length - 1];
    console.log(path, "当前的目录");
    onAdd({ path }, fetchData);
  }

  if (text === "上传") {
    files.value.click();
  }
};

const clickPathArrItem = (item) => {
  const clickPos = pathArr.value.findIndex((el) => el.name === item.name) + 1;
  pathArr.value.splice(clickPos);

  if (pathArr.value.length >= 1) {
    const lastRow = pathArr.value[pathArr.value.length - 1];
    if (lastRow.name === "德龙文件库") {
      getTreeData();
    } else {
      fetchData({ folderPath: lastRow.path });
    }
  }
};

const onRefresh = () => {
  const lastPath = pathArr.value[pathArr.value.length - 1].path;
  console.log(lastPath, "lastPath");
  if (!lastPath) {
    getTreeData();
  } else {
    fetchData({ folderPath: lastPath });
  }
};

const buttonList = ref<ButtonItemType[]>([
  { clickHandler, type: "primary", text: "新增" },
  { clickHandler, type: "primary", text: "上传", isDropDown: true },
  { clickHandler, type: "default", text: "向上", isDropDown: true }
]);

// 搜索
const changeSearchValue = (value) => {
  const lastPath = pathArr.value[pathArr.value.length - 1].path;
  console.log(lastPath, "lastPath");
  if (!lastPath) {
    getTreeData();
  } else {
    loading.value = true;
    searchFileTableData({ folderPath: lastPath, pattern: value })
      .then((res: any) => {
        if (res.status === 200 && res.data.data) {
          console.log(res.data.data, "data");
          const { files = [] } = res.data.data;
          dataList.value = files;
        }
      })
      .finally(() => (loading.value = false));
  }
};

const { columns, maxHeight, onAdd, onEdit, remove, onUpload, onView, onDownload, percentage, dialogVisible } = useTable();

const calcName = (row) => {
  return row.isdir ? "文件夹" : row.additional.type;
};

const dbSelected = (row) => {
  const nodeArr = row.path.split("/");
  if (nodeArr.length === 2) {
    curNodeName.value = row.name;
  }
  if (row.isdir) {
    pathArr.value.push({ name: row.name, path: row.path });
    fetchData({ folderPath: row.path });
  }
};

const getTreeData = () => {
  loading.value = true;
  fetchFileRootDirs({})
    .then((res: any) => {
      // 封装treeData
      const resTreeData = [
        {
          name: "德龙文件库",
          children: []
        }
      ];
      resTreeData[0].children = res.data.data.shares;
      dataList.value = res.data.data.shares.map((item) => ({
        ...item,
        fileType: item.isdir ? "文件夹" : item.additional.type,
        fileSize: item.isdir ? "" : getSizeByBit(item.additional.size),
        modifyTime: TSToDate(item.additional.time.mtime * 1000, "yyyy-MM-dd HH:mm:ss")
      }));
      leftTreeData.value = resTreeData;
    })
    .finally(() => (loading.value = false));
};

// 排序
const sortChange = ({ prop, order }) => {
  const lastPath = pathArr.value[pathArr.value.length - 1].path;
  const calcPropName = prop === "fileSize" ? "size" : prop === "fileType" ? "type" : prop === "modifyTime" ? "mtime" : prop;
  sortBy.value = calcPropName;
  if (order === "ascending") {
    sortDir.value = "asc";
  } else if (order === "descending") {
    sortDir.value = "desc";
  }

  if (pathArr.value.length > 1) {
    fetchData({ folderPath: lastPath });
  }
};

const fetchData = (v) => {
  loading.value = true;
  fetchFileTableData({ ...v, sortDir: sortDir.value, sortBy: sortBy.value })
    .then((res: any) => {
      dataList.value = res.data.data.files.map((item) => ({
        ...item,
        fileType: item.isdir ? "文件夹" : item.additional.type,
        fileSize: item.isdir ? "" : getSizeByBit(item.additional.size),
        modifyTime: TSToDate(item.additional.time.mtime * 1000, "yyyy-MM-dd HH:mm:ss")
      }));
    })
    .finally(() => (loading.value = false));
};

const onNodeClick = (treeItem) => {
  pathArr.value.splice(1, 1);
  treeItem.name !== "德龙文件库" &&
    (pathArr.value = [
      { name: "德龙文件库", path: "" },
      { name: treeItem.name, path: treeItem.path }
    ]);
  if (!treeItem.path) {
    pathArr.value.splice(1);
    getTreeData();
    return;
  }

  fetchData({ folderPath: treeItem.path });
};

onMounted(() => {
  getTreeData();
});
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  border: 0;

  th,
  tr,
  td {
    background-color: #fff;
    border: 0;
  }

  &::before {
    height: 0;
  }

  &::after {
    width: 0;
  }

  .el-table__fixed::before {
    height: 0;
  }
}

.search-ipt {
  margin-left: 20px;
}

.lv-box {
  width: 35vw;
  height: 34px;
  padding: 0 10px;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 13px;
  line-height: 34px;
  color: #a8abb2;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
  }

  .pathItem {
    flex-shrink: 0;
    cursor: pointer;

    &:hover {
      font-weight: 800;
      color: #409eff;
    }
  }
}

.info-left-tree {
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
