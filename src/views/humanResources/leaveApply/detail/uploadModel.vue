<template>
  <div class="modal-upload">
    <div class="btn">
      <HxUploadButton :key="timer" :show-file-list="false" multiple @change="handleUpload" :accept="['.jpg', '.jpeg', '.png', '.svg'].join(',')" />
    </div>
    <div class="attr-table">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        class="leave-attr-table"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <template #operation="{ row }">
          <div style="text-align: left">
            <el-popconfirm :width="280" :title="`确认删除\n【${row.imgName}】的附件吗?`" @confirm="onDelete(row)">
              <template #reference>
                <el-button size="small" type="danger" @click.stop> 删除 </el-button>
              </template>
            </el-popconfirm>
            <el-button size="small" type="primary" @click="() => onDownload(row)"> 下载 </el-button>
          </div>
        </template></pure-table
      >
    </div>
  </div>
</template>

<script setup lang="tsx">
import { deleteAttrLeaveApply, fetchAttrLeaveApply, uploadAttrLeaveApply } from "@/api/oaManage/humanResources";
import { downloadFile } from "@/utils/common";
import { RendererType, setColumn } from "@/utils/table";
import { message } from "ant-design-vue";
import { UploadFiles } from "element-plus";
import { onMounted, ref } from "vue";

const maxHeight = ref(330);
const dataList = ref([]);
const timer = ref(new Date().getTime());
const uploadedFileList = ref([]);
const maxLength = ref(0);
const columns = ref<TableColumnList[]>([]);

const baseApi = import.meta.env.VITE_BASE_API;

const props = defineProps(["id"]);

const getConfig = () => {
  const imgsRenderer: RendererType = ({ row }) => {
    return (
      <div class="flex-center">
        {row.imgUrl ? (
          <el-image
            src={baseApi + row.imgUrl}
            preview-src-list={[baseApi + row.imgUrl]}
            preview-teleported={true}
            hide-on-click-modal={true}
            z-index={2222}
            fit="cover"
            style="height: 20px; width: 60px; border: 1px solid #eee"
          >
            {{ error: () => <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无图片 </div> }}
          </el-image>
        ) : (
          <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无图片 </div>
        )}
      </div>
    );
  };
  const columnData: TableColumnList[] = [
    { label: "图片", prop: "imgUrl", cellRenderer: imgsRenderer },
    { label: "名称", prop: "imgName" }
  ];

  columns.value = setColumn({ columnData, operationColumn: { width: 140, headerAlign: "left" } });
};

function handleUpload(file, fileList) {
  // uploadedFileList.value = fileList;
  const length = fileList.length;
  maxLength.value = Math.max(length, maxLength.value);
  setTimeout(() => {
    if (maxLength.value !== length) {
      return;
    }
    onUploadChange(fileList);
  }, 0);
}

const getList = () => {
  fetchAttrLeaveApply({ id: props.id }).then((res: any) => {
    if (res.data) {
      console.log(res.data, "list");
      const imgTableData = res.data?.fileUrls?.map((item: string) => {
        const imgName = item.split("/").at(-1);
        return { imgUrl: item, imgName, imgOriginUrl: item };
      });
      dataList.value = imgTableData;
    }
  });
};

function onUploadChange(files: UploadFiles) {
  const fd = new FormData();
  files.forEach((fileItem) => fd.append("files", fileItem.raw));
  fd.append("id", props.id);
  console.log(fd.getAll("files"));
  // return;
  uploadAttrLeaveApply(fd).then((res) => {
    if (res.status === 200 || res.data) {
      message.success("上传成功");
      maxLength.value = 0;
      timer.value = new Date().getTime();
      // uploadedFileList.value = [];
      getList();
    }
  });
}

const onDelete = (row) => {
  console.log(row, "dele.row");
  // file: "E:\\Deogra0A Files\\0A/bi1lFi1e/10001/婚假_1742809036423.png"
  // id: props.id
  deleteAttrLeaveApply({ file: row.imgOriginUrl, id: props.id }).then((res) => {
    if (res.status === 200 || res.data) {
      message.success("删除成功");
      getList();
    }
  });
};

const onDownload = (row) => {
  console.log(row, "download..row...");
  const url = baseApi + row.imgUrl;
  downloadFile(url, row.imgName);
};

onMounted(() => {
  getConfig();
  if (props.id) {
    getList();
  }
});
</script>

<style scoped lang="scss">
.modal-upload {
  .btn {
    text-align: right;
    margin-bottom: 8px;
  }
}
</style>
