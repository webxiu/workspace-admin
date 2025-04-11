<template>
  <div class="calc-audit">
    <EditForm :formInline="formData" :formProps="{ size: 'small', labelWidth: 60 }" :formConfigs="formConfigs()" />
    <!-- type="card" -->
    <div style="padding-left: 10px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="职员明细" name="职员">
          <ZYTable :cols="zyCol" />
        </el-tab-pane>
        <el-tab-pane label="员工明细" name="员工">
          <YGTable :cols="ygCol" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="tsx">
import EditForm from "@/components/EditForm/index.vue";
import { onMounted, reactive, ref } from "vue";
import { formConfigs } from "./config";
import ZYTable from "./zytable.vue";
import YGTable from "./ygtable.vue";
import { userMenuColumnList } from "@/api/systemManage";

const formData = reactive({});
const activeName = ref("职员");
const ygCol = ref([]);
const zyCol = ref([]);

defineProps(["rowData"]);

const getMenuConfig = () => {
  userMenuColumnList({
    menuId: "257"
  }).then((res) => {
    if (res.data) {
      const ygData = res.data.filter((el) => el.groupCode === "1");
      const zyData = res.data.filter((el) => el.groupCode === "2");
      ygCol.value = ygData;
      zyCol.value = zyData;
    }
  });
};

onMounted(() => {
  getMenuConfig();
});
</script>

<style lang="scss">
.calc-audit {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
