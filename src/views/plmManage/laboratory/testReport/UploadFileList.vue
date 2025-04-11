<script lang="tsx">
import HxUploadButton from "@/components/HxUploadButton/index.vue";
import { defineComponent, ref, watch } from "vue";
import { acceptMime } from "@/config/constant";
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { message, showMessageBox } from "@/utils/message";
import { delTestReportAttrList } from "@/api/plmManage";
import { UploadFiles } from "element-plus";

interface FileItemType extends UploadFiles {
  name?: string;
  id: number;
  billId: string;
  billNo: string;
  createDate: string;
  createUserId: string;
  orgId: string;
  fileName: string;
  filePath: string;
}

export default defineComponent({
  name: "UploadFileList",
  props: {
    type: { type: String, default: "view" },
    modelValue: { type: Array as PropType<FileItemType>, default: () => [] }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const isView = props.type === "view";
    const fileList = ref<FileItemType[]>(props.modelValue);
    watch(fileList, onUpdate, { deep: true, immediate: true });

    function onUpdate(val) {
      const data = fileList.value;
      emit("update:modelValue", data);
      emit("change", data);
    }

    function onDownload(row: FileItemType) {
      downloadFile(row.filePath + row.fileName, row.fileName);
    }

    function onView(row: FileItemType) {
      const url = getkkViewUrl(`${row.filePath}${row.fileName}`);
      window.open(url);
    }

    function onDlete(item: FileItemType, idx) {
      if (item.id) {
        showMessageBox(`确认要删除名称为【${item.name || item.fileName}】的附件吗?`)
          .then(() => {
            delTestReportAttrList({ id: item.id }).then(({ data }) => {
              if (data) return message.error("删除附件失败");
              message.success("删除附件成功");
              fileList.value.splice(idx, 1);
            });
          })
          .catch(console.log);
      } else {
        fileList.value.splice(idx, 1);
      }
    }

    return () => {
      return (
        <div style={{ width: "100%" }}>
          <HxUploadButton
            v-model:fileList={fileList.value}
            limit={0}
            multiple
            showFileList={false}
            buttonProps={{ size: "small", type: "primary", plain: true, disabled: isView }}
            accept={acceptMime.join(",")}
          />
          <ul class="ui-ovy-a pr-5" style={{ maxHeight: "111px" }}>
            {fileList.value?.map((item, idx) => (
              <li key={item.id} class="flex just-between">
                <div>{idx + 1}</div>
                <div>{item.name || item.fileName}</div>
                <div class="flex">
                  <el-link disabled={!item.filePath} type="primary" class="mr-20 no-select" onClick={() => onDownload(item)}>
                    下载
                  </el-link>
                  <el-link disabled={!item.filePath} type="success" class="mr-20 no-select" onClick={() => onView(item)}>
                    预览
                  </el-link>
                  <el-link type="danger" disabled={isView} onClick={() => onDlete(item, idx)} class="no-select">
                    删除
                  </el-link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    };
  }
});
</script>

<style scoped></style>
