<template>
  <el-button @click="openDialog">选择上级岗位</el-button>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import AddModel from "./addModel.vue";
import { addDialog } from "@/components/ReDialog";

const emits = defineEmits(["select"]);

function openDialog() {
  const formRef = ref();
  addDialog({
    title: "选择上级岗位",
    props: {},
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(AddModel, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const rowData = formRef.value.getRef();
      emits("select", rowData);
      done();
    }
  });
}
</script>
