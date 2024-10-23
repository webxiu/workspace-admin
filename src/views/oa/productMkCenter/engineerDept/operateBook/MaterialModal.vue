<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-05 15:12:21 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-05 15:12:21 
 */ -->

<script setup lang="ts">
import { h, ref } from "vue";
import { menuPageRouter } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import MaterialMgmt from "@/views/plmManage/basicData/materialMgmt/index.vue";

const props = defineProps({
  productCode: { type: String as any, default: "" },
  size: { type: String as any, default: "default" },
  /** 默认值 */
  modelValue: { type: [String, Number], default: "" }
});

const rowData = ref();
const emits = defineEmits(["update:modelValue", "select"]);

function onRowClick() {
  if (!props.productCode) {
    return message("请选择产品型号", { type: "error" });
  }
  const { PageUrl, setRouterInfo } = menuPageRouter();
  setRouterInfo(PageUrl.materialMgmt, () => {
    addDialog({
      title: "选择物料",
      props: { tableHeight: 300, isModal: true, productCode: props.productCode },
      width: "85%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MaterialMgmt, { onSelectRow: (v) => (rowData.value = v) }),
      beforeSure: (done, { options }) => {
        if (!rowData.value) return message("请选择物料", { type: "error" });
        showMessageBox(`确认选择所选物料吗?`).then(() => {
          emits("update:modelValue", rowData.value.id);
          emits("select", rowData.value);
          done();
        });
      }
    });
  });
}
</script>

<template>
  <el-button @click="onRowClick" :size="size">选择</el-button>
</template>
