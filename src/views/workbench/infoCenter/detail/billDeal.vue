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
      <div v-if="DetailComp.pageUrl" class="flex just-end mb-10 mr-6">
        <router-link :to="{ path: DetailComp.pageUrl, query: queryParams }" target="_blank">
          <el-button type="primary" link title="点击跳转">主页</el-button>
        </router-link>
      </div>
      <component v-if="DetailComp.comp && id" :is="DetailComp.comp" />
      <el-empty v-else description="暂无数据" style="height: 280px" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref, watch, computed } from "vue";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { PageUrl } from "@/config/constant";
import { useAppStore } from "@/store/modules/app";
import { Position } from "@element-plus/icons-vue";
import { getTreeArrItem, findTopLevelNode } from "@/utils/common";
import { approvalBillNO, backBillNO, backBillNOOptionList, BackBillNOOptionItemType } from "@/api/workbench/infoCenter";

import LeaveApply from "@/views/humanResources/leaveApply/detail/index.vue";
import OvertimeOrder from "@/views/humanResources/overtimeOrder/detail/index.vue";
import SupplyChainOrdersDetail from "@/views/supplyChainMange/orders/utils/orderDetail.vue";
import ProductsDevApplay from "@/views/plmManage/productMgmt/productsDevApplay/infoCenterDetail/index.vue";
import SQLDetail from "@/views/system/develop/database/Detail.vue";
import TestDetail from "@/views/plmManage/laboratory/testReport/Detail.vue";
import GetOutDetail from "@/views/humanResources/carAllocate/Detail.vue";
import MyWorkOrderDetail from "@/views/common/myWorkOrder/Detail.vue";
import VisitorDetail from "@/views/humanResources/visitorReception/Detail.vue";
import InductionDetail from "./component/InductionDetail/index.vue";
import StatementAccountDetail from "@/views/supplyChainMange/statementAccount/detail/index.vue";
import PlmManageProjectMgmtProjectManageAddIndex from "@/views/plmManage/projectMgmt/projectManage/add/index.vue";
import QuotationDetail from "@/views/marketing/saleManage/quotation/infoCenterDetail.vue";
import DeliverDetail from "@/views/plmManage/projectMgmt/projectManage/add/components/deliverDetail/index.vue";
import DeliverChangeDetail from "@/views/plmManage/projectMgmt/deliveryChange/infoCenterDetail/index.vue";
import MoldApplyDetail from "@/views/plmManage/moldManage/moldApply/Detail.vue";
import DR0ApplyDetail from "@/views/plmManage/productMgmt/DR0Apply/infoCenterDetail/index.vue";
import HandleMadeApplyDetail from "@/views/marketing/saleManage/handleMake/infoCenterDetail/index.vue";
import ResignApplyDetail from "@/views/humanResources/resignApply/Detail.vue";
import WorkAgeMoneyDetail from "@/views/humanResources/performanceManage/infoCenter/index.vue";
import CommissionDetail from "@/views/humanResources/commission/infoCenter/index.vue";
import OtherMoneyDetail from "@/views/humanResources/otherMoney/infoCenter/index.vue";
import SalaryCalcDetail from "@/views/financeDept/payrollMgmt/calculate/infoCenter/index.vue";
import StaffChangeDetail from "@/views/humanResources/staffChange/infoCenter/index.vue";
import OperateBookDetail from "@/views/productMkCenter/engineerDept/operateBook/Detail.vue";
// import reportDetail from "@/views/plmManage/projectMgmt/projectManage/add/components/reportingDetail/index.vue";

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

function getDetail(formUrl: string, props) {
  /**
   * 说明: comp: 详情组件 pageUrl: 详情的首页入口路由(添加时请配置)
   */

  const config = {
    /** 1.请假单 */
    "/oa/hr/askforleave/edit": { comp: () => <LeaveApply type="view" id={props.id} pageUrl={PageUrl.leaveApply} />, pageUrl: PageUrl.leaveApply },
    /** 2.加班单 */
    "/oa/hr/overtimeapply/edit": { comp: () => <OvertimeOrder type="view" id={props.id} pageUrl={PageUrl.overtimeOrder} />, pageUrl: PageUrl.overtimeOrder },
    /** 3.SQL执行审批 */
    "/sys/sys/sqlexecuteapproval/selectdetailbyid/index": {
      comp: () => <SQLDetail type="view" id={props.id} pageUrl={PageUrl.database} />,
      pageUrl: PageUrl.database
    },
    /** 4.测试报告 */
    "/plm/lab/testreport/info": { comp: () => <TestDetail type="view" id={props.id} pageUrl={PageUrl.testReport} />, pageUrl: PageUrl.testReport },
    /** 5.外出派车管理 */
    "/oa/outward/application": { comp: () => <GetOutDetail type="view" id={props.id} pageUrl={PageUrl.carAllocate} />, pageUrl: PageUrl.carAllocate },
    /** 6.访客接待 */
    "/oa/visitor/reception": { comp: () => <VisitorDetail type="view" id={props.id} pageUrl={PageUrl.visitorReception} />, pageUrl: PageUrl.visitorReception },
    /** 7.对账单 */
    "/sup/statement/bill": {
      comp: () => <StatementAccountDetail type="view" id={props.id} fbillNo={props.billNo} pageUrl={PageUrl.statementAccount} />,
      pageUrl: PageUrl.statementAccount
    },
    /** 8.对账单发票 */
    "/sup/statement/invoice": {
      comp: () => <StatementAccountDetail type="view" id={props.id} fbillNo={props.billNo} pageUrl={PageUrl.statementAccount} />,
      pageUrl: PageUrl.statementAccount
    },
    /** 9.开模申请 */
    "/plm/mold/apply": { comp: () => <MoldApplyDetail id={props.id} type="view" pageUrl={PageUrl.moldApply} />, pageUrl: PageUrl.moldApply },
    /** 10.离职申请 */
    "/oa/hr/resignapply": { comp: () => <ResignApplyDetail type="view" id={props.id} pageUrl={PageUrl.resignApply} />, pageUrl: PageUrl.resignApply },
    /** 11.供应链订单处理 */
    "/sup/orderprocessing/edit": { comp: () => <SupplyChainOrdersDetail fbillno={props.billNo} source="infoCenter" />, pageUrl: PageUrl.supplyChaiOrder },
    /** 12.产品开发申请表 */
    "/plm/pm/productdev/editproductdev/index": { comp: () => <ProductsDevApplay id={props.id} />, pageUrl: PageUrl.devApplay },
    /** 13.项目管理 */
    "/plm/pm/projectinfo/edit": {
      comp: () => <PlmManageProjectMgmtProjectManageAddIndex flowInfoData={{ billNo: props.billNo, processDefId: props.processDefId }} />,
      pageUrl: PageUrl.projectManage
    },
    /** 14.交付物审批 */
    "/plm/pm/deliverable": { comp: () => <DeliverDetail ref={DeliverRef} rowData={{ ...props }} />, pageUrl: PageUrl.projectManage },
    /** 15.交付物变更 */
    "/plm/pm/deliverchange": { comp: () => <DeliverChangeDetail id={props.id} rowData={{ ...props }} />, pageUrl: "" },
    /** 16.我的工单(路由不在菜单中, 不做动态表单配置) */
    "/oa/sys/systaskregister": { comp: () => <MyWorkOrderDetail type="view" id={props.id} />, pageUrl: PageUrl.myWorkOrder },
    /** 17.报价申请 */
    "/oa/mk/quoteapply": { comp: () => <QuotationDetail id={props.id} ref={saleQuatationRef} rowData={{ ...props }} />, pageUrl: PageUrl.quotation },
    /** 18.DR0开发申请 */
    "/plm/prod/dr0": { comp: () => <DR0ApplyDetail id={props.id} rowData={{ ...props }} />, pageUrl: PageUrl.dr0Apply },
    /** 19.手板制作申请 */
    "/oa/mfg/mc/prototyping": { comp: () => <HandleMadeApplyDetail ref={handleMakeRef} id={props.id} rowData={{ ...props }} />, pageUrl: PageUrl.handleMake },
    /** 20.绩效管理 */
    "/oa/hr/performance": { comp: () => <WorkAgeMoneyDetail rowData={{ ...props }} pageUrl={PageUrl.performance} />, pageUrl: PageUrl.performance },
    /** 21.提成管理 */
    "/oa/hr/commission": { comp: () => <CommissionDetail rowData={{ ...props }} pageUrl={PageUrl.commission} />, pageUrl: PageUrl.commission },
    /** 22.其他金额管理 */
    "/oa/hr/otherMoney": { comp: () => <OtherMoneyDetail rowData={{ ...props }} pageUrl={PageUrl.otherMoney} />, pageUrl: PageUrl.otherMoney },
    /** 23.薪资核算 */
    "/fin/salary/calculate": { comp: () => <SalaryCalcDetail rowData={{ ...props }} pageUrl={PageUrl.salaryCalc} />, pageUrl: PageUrl.salaryCalc },
    /** 24.人事异动 */
    "/oa/hr/staffChange": { comp: () => <StaffChangeDetail rowData={{ ...props }} pageUrl={PageUrl.staffChange} />, pageUrl: PageUrl.staffChange },
    /** 25.作业指导书 */
    "/oa/mfg/eng/ESOPManual": { comp: () => <OperateBookDetail type="view" id={props.id} pageUrl={PageUrl.operateBook} />, pageUrl: PageUrl.operateBook },

    /** 入职审核(待开发) */
    "/oa/induction/appr": { comp: () => <InductionDetail approveFn={approveFn} id={props.id} />, pageUrl: "" },
    /** 签到补卡(待开发) */
    "/oa/hr/attendance/replenish": { comp: () => <h1>开发中...</h1>, pageUrl: "" }
  };
  return config[formUrl];
}

/** 详情内容 */
const DetailComp = computed(() => {
  const { comp, pageUrl } = getDetail(props.formUrl, props);
  return { comp, pageUrl };
});

/** 获取跳转首页参数 */
const queryParams = computed(() => {
  const treeList = useAppStore().getAsyncRoutes;
  const item = getTreeArrItem(treeList, "path", DetailComp.value.pageUrl);
  if (!item) return {};
  const topItem = findTopLevelNode(treeList, "id", item.id);
  const param = {
    menuCode: topItem.menuCode,
    from: topItem.path,
    menuId: item.id,
    menuName: item.meta.title
  };
  return param;
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
    return message.warning("请填写入职信息");
  }

  if (props.formUrl === "/oa/mk/comp_x") {
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
            message.success("提交成功");
            props.callbackFn();
            isApproveSubmit.value = false;
          } else {
            message.error("提交失败");
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
