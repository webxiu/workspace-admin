<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, watch } from "vue";
import { getFlowBillConfig } from "@/api/workbench/infoCenter";
import { useLogicFlow } from "@/hooks/useLogicFlow";

interface Props {
  billNo: string;
  processInstId: string;
  /** 不存在流程信息的错误回调 */
  errCallback?: (err) => void;
}

const props = withDefaults(defineProps<Props>(), {
  billNo: () => "",
  processInstId: () => ""
});
const loading = ref(false);
watch(props, () => getTableData(), { immediate: true });

function getTableData() {
  const { billNo, processInstId } = props;
  loading.value = true;
  getFlowBillConfig({ billNo, proInsId: processInstId })
    .then((res) => {
      loading.value = false;
      if (res.data) {
        const { lf } = useLogicFlow("#detail_flow");
        lf.value.render(res.data);
      }
    })
    .catch((err) => {
      props.errCallback && props.errCallback(err);
      loading.value = false;
    });
}
</script>
<template>
  <div class="ui-w-100 flex flex-1 main main-content" v-loading="loading">
    <div id="detail_flow" class="flex-1" style="min-height: 338px" />
  </div>
</template>
