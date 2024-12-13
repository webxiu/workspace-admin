<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import DetailTable from "./components/detailTable.vue";
import UserSign from "./components/sign.vue";
import FeedBack from "./components/feedBack.vue";
import Dispatch from "./components/dispatch.vue";
import { getMoneyListStatus, revokeMoneyList, updateMoneyDataInfo } from "@/api/oaManage/financeDept";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const activeName = ref("first");
const billState = ref("");
const tableRef = ref();

defineOptions({ name: "PayslipDetail" });

const handleClick = ({ paneName }) => {
  console.log(paneName, "paneName");
};

const onSave = () => {
  // 组装请求参数
  const jsonData = tableRef.value?.templateList?.map((item) => ({
    FieldName: item.fieldName,
    FieldValue: item.FieldValue,
    EncryptedStorage: item.encryptedStorage
  }));
  const { gzmbb, payslipId } = route.query;
  ElMessageBox.confirm(`确认要进行保存吗?`, "温馨提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      updateMoneyDataInfo({ data: JSON.stringify(jsonData), gzmbb, gzmbNo: route.query.gzmbNo, payslipId: payslipId }).then((res) => {
        if (res.data) {
          ElMessage({ message: "保存成功", type: "success" });
          tableRef.value?.getMoneyInfo();
        }
      });
    })
    .catch(() => {});
};

const revokeAction = () => {
  const { gzmbb, payslipId } = route.query;
  ElMessageBox.confirm(`确认要撤销当前工资条到【待分发】状态吗?`, "温馨提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      revokeMoneyList({ gzStatus: billState.value, gzmbb, payslipId }).then((res) => {
        if (res.data) {
          ElMessage({ message: "撤销成功", type: "success" });
          getStatus();
        }
      });
    })
    .catch(() => {});
};

const getStatus = () => {
  const { gzmbb, payslipId } = route.query;
  getMoneyListStatus({ gzmbb, payslipId }).then((res) => {
    if (res.data) {
      billState.value = res.data[0]?.Status;
    }
  });
};

onMounted(() => {
  console.log(route.query, "query");
  getStatus();
});
</script>

<template>
  <div class="detail-gz">
    <div class="btns">
      <el-button v-if="/(1|2|4)/.test(billState)" type="primary" plain @click="onSave">保存</el-button>
      <el-button type="info" @click="revokeAction">撤销</el-button>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="工资详情" name="first">
        <div class="tip">
          <blockquote class="qut">
            <div>
              <span style="font-size: 15px; font-weight: bold; color: red">黄色背景颜色的行不允许编辑。 撤销以后状态变为：【待分发】</span>
            </div>
          </blockquote>
        </div>
        <div class="outer-table">
          <DetailTable ref="tableRef" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="员工签名" name="second"><UserSign /></el-tab-pane>
      <el-tab-pane label="异常反馈" name="third"><FeedBack /></el-tab-pane>
      <el-tab-pane label="分发记录" name="fourth"><Dispatch /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.detail-gz {
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    font-size: 32px;
    font-weight: 600;
    color: #6b778c;
  }

  .qut {
    padding: 8px;
    margin-bottom: 10px;
    line-height: 1.6;
    background-color: #fafafa;
    border-left: 5px solid #5fb878;
    border-radius: 0 2px 2px 0;
  }
}
</style>
