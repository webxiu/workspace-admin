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
import ProductStore from "@/views/plmManage/productMgmt/productStore/index.vue";

defineProps({
  size: { type: String as any, default: "default" },
  /** 默认值 */
  modelValue: { type: [String, Number], default: "" }
});

const rowData = ref();
const emits = defineEmits(["update:modelValue", "select"]);

function onRowClick() {
  const { PageUrl, setRouterInfo } = menuPageRouter();
  setRouterInfo(PageUrl.productStore, () => {
    addDialog({
      title: "选择产品",
      props: { tableHeight: 300, isModal: true },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ProductStore, { onSelectRow: (v) => (rowData.value = v) }),
      beforeSure: (done, { options }) => {
        const row = rowData.value;
        if (!row) return message("请选择产品", { type: "error" });
        showMessageBox(`确认选择产品型号【${row.productCode}】吗?`).then(() => {
          emits("update:modelValue", row.productCode);
          emits("select", row);
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
