<template>
  <div class="calc-audit">
    <EditForm :formInline="formData" :formProps="{ size: 'small', labelWidth: 60 }" :formConfigs="formConfigs()" />
    <!-- type="card" -->
    <div style="padding-left: 10px">
      <el-tabs v-model="activeName" @tabChange="onTabChange">
        <el-tab-pane label="汇总" name="汇总">
          <HZTable :cols="hzCol" ref="totalRef" />
        </el-tab-pane>
        <el-tab-pane label="职员明细" name="职员">
          <ZYTable :cols="zyCol" ref="zyRef" @pageChange="onTabChange" />
        </el-tab-pane>
        <el-tab-pane label="员工明细" name="员工">
          <YGTable :cols="ygCol" ref="ygRef" @pageChange="onTabChange" />
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
import HZTable from "./hztable.vue";
import { userMenuColumnList } from "@/api/systemManage";
import { fetchDeptTotalMoneyCheckList, fetchDetailStaffMoneyCheckList, fetchMainStaffMoneyCheckList } from "@/api/oaManage/financeDept";
import { fixed2AndAddcomma } from "@/utils/common";
import dayjs from "dayjs";

const formData: any = reactive({});
const activeName = ref("汇总");
const ygCol = ref([]);
const zyCol = ref([]);
const hzCol = ref([]);
const zyRef = ref();
const ygRef = ref();
const totalRef = ref();

const props = defineProps(["rowData"]);

const getMenuConfig = () => {
  userMenuColumnList({
    menuId: "257"
  }).then((res) => {
    if (res.data) {
      const ygData = res.data.filter((el) => el.groupCode === "1");
      const zyData = res.data.filter((el) => el.groupCode === "2");
      const hzData = res.data.filter((el) => el.groupCode === "4");
      ygCol.value = ygData;
      zyCol.value = zyData;
      hzCol.value = hzData;
    }
  });
};

const onTabChange = (data, page = 1, limit = 30) => {
  if (data !== "汇总") {
    formData.userType = data;
    activeName.value = data;
    getClerkData(page, limit);
  }
};

const getClerkData = (page, limit) => {
  fetchDetailStaffMoneyCheckList({ page, limit, userType: formData.userType, actualpayrollresultId: formData.actualpayrollresultId }).then((res: any) => {
    if (res.data) {
      const result = res.data.records || [];

      if (formData.userType === "职员") {
        zyRef.value.dataList = result;
        zyRef.value.pagination.total = res.data.total;
      } else if (formData.userType === "员工") {
        ygRef.value.dataList = result;
        ygRef.value.pagination.total = res.data.total;
      }
    }
  });
};

const getMainTableData = () => {
  if (props.rowData?.billNo) {
    const realBillNo = props.rowData?.billNo?.split("_")[0]
    fetchMainStaffMoneyCheckList({ page: 1, limit: 30, billNo: realBillNo }).then((res: any) => {
      if (res.data) {
        const result = res.data.records[0] || {};
        console.log(result, "main table dta..");
        formData.yearMonth = result.yearMonth;
        formData.billState = result.stateName;
        formData.createUserName = result.createUserName;
        formData.createDate = dayjs(result.createDate).format("YYYY-MM-DD HH:mm:ss");
        formData.billNo = result.billNo;
        formData.salaryTotal = fixed2AndAddcomma(result.realSalary);
        formData.actualpayrollresultId = result.actualpayrollresultId;
      }
    });

    // 查询部门汇总
    fetchDeptTotalMoneyCheckList({ billNo:realBillNo }).then((res) => {
      if (res.data) {
        totalRef.value.dataList = res.data || [];
      }
    });
  }
};

onMounted(() => {
  getMenuConfig();
  getMainTableData();
});
</script>

<style lang="scss">
.calc-audit {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
