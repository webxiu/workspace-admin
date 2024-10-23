<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->
<template>
  <div class="ui-h-100 ui-w-100 flex-1 main main-content" v-loading="loading">
    <div v-if="ischeck !== '0'" class="flex box-wrap" style="min-height: 135px; padding-bottom: 0; margin-bottom: 20px">
      <div class="info-select_radio mr-20">
        <el-radio-group v-model="auditType" class="flex-col just-start">
          <el-radio label="agree">同意审批</el-radio>
          <el-radio label="back">退回重审</el-radio>
        </el-radio-group>
      </div>
      <el-form ref="ruleFormRef" :model="formInline" class="mr-10">
        <template v-if="auditType === 'back'">
          <el-form-item label="退回节点:" prop="backToActivityId" :rules="[{ required: true, message: '请选择审批节点', trigger: 'blur' }]">
            <el-select v-model="formInline.backToActivityId" placeholder="请选择" style="width: 179px">
              <el-option v-for="item in backNodeOptionList" :label="item.activeName" :value="item.activeId" :key="item.activeId" />
            </el-select>
          </el-form-item>
          <el-form-item label="退回原因:" prop="comment" :rules="[{ required: true, message: '请输入退回原因', trigger: 'blur' }]">
            <el-input v-model="formInline.comment" type="textarea" resize="none" :rows="2" placeholder="请输入退回原因" />
          </el-form-item>
        </template>
        <el-form-item v-else label="审批意见:" prop="comment" :rules="[{ required: false, message: '请输入审批意见', trigger: 'blur' }]">
          <el-input v-model="formInline.comment" type="textarea" resize="none" :rows="4" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="Position" :disabled="isAudit" :loading="isAudit" @click="onSubmit">提交</el-button>
    </div>
    <div class="box-wrap bill-content">
      <!-- 单据详情 -->
      <component v-if="DetailComp && id" :is="DetailComp" />
      <!-- 未匹配到formUrl -->
      <el-empty v-else description="暂无数据" style="height: 300px" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref, watch, computed } from "vue";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { Position } from "@element-plus/icons-vue";
import { approvalBillNO, backBillNO, backBillNOOptionList, BackBillNOOptionItemType } from "@/api/workbench/infoCenter";
import { menuPageRouter } from "@/config/constant";

import LeaveApply from "@/views/oa/humanResources/leaveApply/detail/index.vue";
import OvertimeOrder from "@/views/oa/humanResources/overtimeOrder/detail/index.vue";
import SupplyChainOrdersDetail from "@/views/supplyChainMange/orders/utils/orderDetail.vue";
import ProductsDevApplay from "@/views/plmManage/productMgmt/productsDevApplay/infoCenterDetail/index.vue";
import SQLDetail from "@/views/system/develop/database/Detail.vue";
import TestDetail from "@/views/plmManage/laboratory/testReport/Detail.vue";
import GetOutDetail from "@/views/oa/humanResources/businessRecord/Detail.vue";
import MyWorkOrderDetail from "@/views/common/myWorkOrder/Detail.vue";
import VisitorDetail from "@/views/oa/humanResources/visitorReception/Detail.vue";
import InductionDetail from "./component/InductionDetail/index.vue";
import StatementAccountDetail from "@/views/supplyChainMange/statementAccount/detail/index.vue";
import PlmManageProjectMgmtProjectManageAddIndex from "@/views/plmManage/projectMgmt/projectManage/add/index.vue";
import QuotationDetail from "@/views/oa/marketing/saleManage/quotation/infoCenterDetail.vue";
import DeliverDetail from "@/views/plmManage/projectMgmt/projectManage/add/components/deliverDetail/index.vue";
// import reportDetail from "@/views/plmManage/projectMgmt/projectManage/add/components/reportingDetail/index.vue";
import DeliverChangeDetail from "@/views/plmManage/projectMgmt/deliveryChange/infoCenterDetail/index.vue";
import MoldApplyDetail from "@/views/plmManage/moldManage/moldApply/infoCenterDetail/index.vue";
import DR0ApplyDetail from "@/views/plmManage/productMgmt/DR0Apply/infoCenterDetail/index.vue";
import HandleMadeApplyDetail from "@/views/oa/marketing/saleManage/handleMake/infoCenterDetail/index.vue";
import ResignApplyDetail from "@/views/oa/humanResources/resignApply/Detail.vue";

interface Props {
  id: string;
  loading: boolean;
  billNo: string;
  formUrl: string;
  processDefId: string;
  processInstId: string;
  projectId: string;
  taskId?: string;
  /** 是否显示审批提交表单 */
  ischeck: string;
  /** 提交审核成功回调 */
  callbackFn: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  id: "",
  loading: false,
  billNo: "",
  formUrl: "",
  processDefId: "",
  processInstId: "",
  projectId: "",
  taskId: "",
  ischeck: "0",
  callbackFn: () => () => {}
});

const auditType = ref("agree");
const ruleFormRef = ref<FormInstance>();
const formInline = reactive({ backToActivityId: "", comment: "" });
const backNodeOptionList = ref<BackBillNOOptionItemType[]>([]);
const isAudit = ref(false);
const isApproveSubmit = ref(false);
const saleQuatationRef = ref();
const DeliverRef = ref();
const handleMakeRef = ref();

/** 详情内容 */
const DetailComp = computed(() => {
  return {
    /* 请假单 */
    "/oa/hr/askforleave/edit": () => <LeaveApply type="view" id={props.id} />,
    /* 加班单 */
    "/oa/hr/overtimeapply/edit": () => <OvertimeOrder type="view" id={props.id} />,
    /* SQL执行审批 */
    "/sys/sys/sqlexecuteapproval/selectdetailbyid/index": () => <SQLDetail id={props.id} />,
    /* 供应链订单处理 */
    "/sup/orderprocessing/edit": () => <SupplyChainOrdersDetail fbillno={props.billNo} source="infoCenter" />,
    /* 产品开发申请表 */
    "/plm/pm/productdev/editproductdev/index": () => <ProductsDevApplay id={props.id} />,
    /* 测试报告审批流程 */
    "/plm/lab/testreport/info": () => <TestDetail type="view" id={props.id} />,
    /* 外出申请单流程 */
    "/oa/outward/application": () => <GetOutDetail type="view" id={props.id} />,
    /* 访客接待 */
    "/oa/visitor/reception": () => <VisitorDetail type="view" id={props.id} />,
    /* 对账单 */
    "/sup/statement/bill": () => <StatementAccountDetail type="view" id={props.id} fbillNo={props.billNo} />,
    /* 对账单发票 */
    "/sup/statement/invoice": () => <StatementAccountDetail type="view" id={props.id} fbillNo={props.billNo} />,
    /* 项目管理 */
    "/plm/pm/projectinfo/edit": () => <PlmManageProjectMgmtProjectManageAddIndex flowInfoData={{ billNo: props.billNo, processDefId: props.processDefId }} />,
    /* 我的工单流程 */
    "/oa/sys/systaskregister": () => <MyWorkOrderDetail type="view" id={props.id} />,
    /** 报价申请 */
    "/oa/mk/quoteapply": () => <QuotationDetail id={props.id} ref={saleQuatationRef} rowData={{ ...props }} />,
    /** 交付物审批 */
    "/plm/pm/deliverable": () => <DeliverDetail ref={DeliverRef} rowData={{ ...props }} />,
    /** 交付物变更 */
    "/plm/pm/deliverchange": () => <DeliverChangeDetail id={props.id} rowData={{ ...props }} />,
    /** 开模申请 */
    "/plm/mold/apply": () => <MoldApplyDetail id={props.id} rowData={{ ...props }} />,
    /** DR0开发申请 */
    "/plm/prod/dr0": () => <DR0ApplyDetail id={props.id} rowData={{ ...props }} />,
    /** 手板制作申请 */
    "/oa/mfg/mc/prototyping": () => <HandleMadeApplyDetail ref={handleMakeRef} id={props.id} rowData={{ ...props }} />,
    /** 离职申请 */
    "/oa/hr/resignapply": () => <ResignApplyDetail type="view" id={props.id} />,

    /* 入职审核(未添加) */
    "/oa/induction/appr": () => <InductionDetail approveFn={approveFn} id={props.id} />,
    /* 签到补卡(未添加) */
    "/oa/hr/attendance/replenish": () => <h1>开发中...</h1>
  }[props.formUrl];
});

watch(props, () => getOptionList(), { immediate: true });

/** 退回重申下拉框数据 */
function getOptionList() {
  console.log("查看单据:", props);
  const { billNo, processInstId } = props;
  backBillNOOptionList({ billNo, piid: processInstId })
    .then(({ data }) => {
      backNodeOptionList.value = data || [];
    })
    .catch(console.log);
}

/** 入职审核: 入职信息是否填写提交 */
function approveFn() {
  isApproveSubmit.value = true;
}

// 提交
const onSubmit = async () => {
  // 审批入职审核单据, 判断是否提交过审批信息
  if (props.formUrl === "/oa/induction/appr" && !isApproveSubmit.value) {
    const dom = document.querySelector(".view-bill_audit");
    dom.parentElement.scrollTo({ top: 500, behavior: "smooth" });
    return message("请填写入职信息", { type: "warning" });
  }

  if (props.formUrl === "/oa/mk/xxxxx") {
    if (saleQuatationRef.value) saleQuatationRef.value.submitAction({ ...props, ...formInline });
    return;
  }

  if (props.formUrl === "/oa/mfg/mc/prototyping") {
    if (handleMakeRef.value) {
      console.log(handleMakeRef.value, "ref===");
    }
    return;
  }

  if (!ruleFormRef.value || isAudit.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      isAudit.value = true;
      const { billNo, processDefId, processInstId, projectId, taskId } = props;
      const params = {
        processInsId: processInstId,
        processDefId: processDefId,
        billNo: billNo,
        taskId,
        projectId: projectId,
        comment: formInline.comment,
        backToActivityId: formInline.backToActivityId
      };
      if (auditType.value === "agree") {
        delete params.backToActivityId;
      }
      const reqApi = { agree: approvalBillNO, back: backBillNO };
      reqApi[auditType.value](params, { dbKey: projectId })
        .then((res) => {
          isAudit.value = false;
          if (res.data) {
            message("提交成功");
            props.callbackFn();
            isApproveSubmit.value = false;
          } else {
            message("提交失败", { type: "error" });
          }
        })
        .catch(() => (isAudit.value = false));
    }
  });
};
</script>

<style lang="scss" scoped>
.box-wrap {
  padding: 15px;
  margin: 3px;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 #d5d5d5;
}

.bill-content {
  max-height: 320px;
  overflow-y: auto;
}

:deep(.info-select_radio .el-radio) {
  margin-right: 0;
}
</style>
