<template>
  <div v-loading="loading" style="min-width: 960px; height: 100%">
    <div class="flex" v-if="taskOptions">
      <EditForm
        :formInline="formInline"
        :formConfigs="formConfigs({ onUploadChange, taskOptions, type })"
        :formProps="{ labelWidth: '80px' }"
        style="min-width: 460px; flex: 1"
      />
      <div class="flex-1">
        <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              :adaptive="true"
              align-whole="center"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
            >
              <template #operation="{ row, index }">
                <div class="flex">
                  <el-popconfirm :width="280" :title="`确认删除文件\n【${row.fileName}】?`" @confirm="onDelete(row, index)">
                    <template #reference>
                      <el-button size="small" type="danger" @click.stop>删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button size="small" v-if="row.id" type="primary" @click.stop="onDownload(row)">下载</el-button>
                  <el-button size="small" v-if="row.id" type="success" @click.stop="onView(row)">查看</el-button>
                </div>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
    <el-form ref="overTimeFormRef" :model="formData" class="flex-1 ml-2" label-width="120px">
      <el-form-item label="任务描述" prop="responsibleMan">
        <!-- <el-input style="display: none" /> -->
        <div class="ui-w-100">
          <!-- <a-button @click="toggleTheme" class="mb-2" type="primary"> 黑暗主题 </a-button>
            <a-button @click="clearValue" class="mb-2" type="default"> 清空内容 </a-button> -->
          <MarkDown v-model:value="valueRef" @change="handleChange" @setFileItem="setFileItem" ref="markDownRef" placeholder="这是占位文本" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { formConfigs } from "./config";
import { downloadFile } from "@/utils/common";
import { setColumn } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { MarkDown, MarkDownActionType, MarkdownViewer } from "./Markdown";
import { taskFileList, TaskFileItemType, TaskManageItemType, TaskMangeOptionType, deleteTaskFile } from "@/api/systemManage";
import { getkkViewUrl } from "@/utils/storage";
import type { UploadFiles, UploadFile } from "element-plus";
import { message } from "@/utils/message";

const props = defineProps<{ loading?: boolean; formData?: TaskManageItemType; taskOptions?: TaskMangeOptionType; type?: string }>();
const formInline = reactive(props.formData);

const maxHeight = 240;
const columns = ref<TableColumnList[]>([]);
const dataList = ref<Array<Partial<TaskFileItemType>>>([]);
// const fileList = new Map();
const fileNameList = ref<string[]>([]);
const { VITE_BASE_API, VITE_VIRTUAL_PATH } = import.meta.env;
const fileList: File[] = [];

const markDownRef = ref<Nullable<MarkDownActionType>>(null);
const valueRef = ref("");

const setFileItem = (item) => {
  fileNameList.value.push(item);
};

onMounted(() => {
  getColumnConfig();
  getTaskFileList();
});

watch(
  () => props.formData.taskContent,
  (val) => {
    valueRef.value = val;
  },
  { immediate: true }
);

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [{ label: "文件名", prop: "fileName", minWidth: 160 }];
  columns.value = setColumn({ columnData, operationColumn: { minWidth: 200, align: "center" } });
};

function getTaskFileList() {
  if (!props.formData.id) return;
  taskFileList({ billNo: props.formData.billNo })
    .then(({ data }) => {
      dataList.value = data;
    })
    .catch(console.log);
}

function handleChange(v: string) {
  valueRef.value = v;
}

function onUploadChange(files: File[]) {
  files.forEach((file) => {
    const repeatFile = dataList.value.find((item) => item.fileName === file.name);
    if (repeatFile) return message("文件重复:" + repeatFile.fileName, { type: "warning" });
    dataList.value.push({ fileName: file.name });
    fileList.push(file);
  });
}
async function onDelete(row: TaskFileItemType, index) {
  if (!row.id) {
    dataList.value.splice(index, 1);
  } else {
    const res = await deleteTaskFile({ id: row.id });
    if (res.data) {
      dataList.value = dataList.value.filter((_, idx) => idx !== index);
    }
  }
}

function onDownload(row: TaskFileItemType) {
  // const url = VITE_BASE_API + VITE_VIRTUAL_PATH + props.taskOptions.filePath + row.fileName;
  // downloadFile(url, row.fileName);
  const url = row.filePath + "/" + row.fileName;
  downloadFile(url, row.fileName, true);
}

function onView(row: TaskFileItemType) {
  const url = getkkViewUrl(`${row.filePath}/${row.fileName}`);
  window.open(url);
}

function getRef() {
  const fd = new FormData();
  fileList.forEach((file) => fd.append("files", file));
  fd.append("file", fileList as any);
  return { fd, formInline: { ...formInline, taskContent: valueRef.value } };
}

defineExpose({ getRef, fileNameList });
</script>
