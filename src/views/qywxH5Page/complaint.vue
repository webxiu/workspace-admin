<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  const billNo = route.query.billNo;
  const hostAddress = import.meta.env.VITE_H5_URL;
  if (billNo) {
    location.href = `${hostAddress}/addSupplierComplaints?billNo=${billNo}`;
  }
});
</script>

<template>
  <div />
</template>
