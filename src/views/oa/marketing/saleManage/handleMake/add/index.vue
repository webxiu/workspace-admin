<template>
  <div class="make-add">
    <div class="btns"><el-button type="primary" @click="onSave">保存</el-button> <el-button type="default" @click="onBack">返回</el-button></div>
    <div class="title">手板制作申请单</div>
    <div class="table-outer">
      <table>
        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">产品名称/型号：</div>
              <div><el-input v-model="productNameOrModel" /></div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">产品预研号：</div>
              <div><el-input v-model="productBeforeNum" /></div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <span class="td-label">申请日期：</span>
              <span>{{ applyDate }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div style="display: flex; align-items: center">
              <div class="td-label">手板类别</div>
              <div style="padding-left: 50px">
                <el-checkbox-group v-model="checkMakeList">
                  <el-checkbox label="3D外观手板" value="3D外观手板" />
                  <el-checkbox label="概念手板" value="概念手板" />
                  <el-checkbox label="结构手板" value="结构手板" />
                  <el-checkbox label="功能手板" value="功能手板" />
                </el-checkbox-group>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">费用承担：</div>
              <div><el-input v-model="resFee" /></div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">费用预估：</div>
              <div><el-input v-model="testFee" /></div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">要求完成时间：</div>
              <div><el-date-picker v-model="finishDate" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label" style="margin-bottom: 8px">申请原因：</div>
              <div><el-input type="textarea" v-model="applyReason" :autosize="{ minRows: 4 }" style="width: 100%" /></div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; align-items: center">
              <div class="td-label" style="width: 120px; text-align: right">一般测试要求：</div>
              <div>
                <el-checkbox-group v-model="checkReqList" @change="changeReq">
                  <el-checkbox label="公司内部标准" value="公司内部标准" />
                  <el-checkbox label="客户标准" value="客户标准" />
                  <el-checkbox label="其它" value="其它" />
                </el-checkbox-group>
              </div>
            </div>

            <div style="display: flex; align-items: center; margin: 8px 0" v-if="showCustomer">
              <div class="td-label" style="width: 120px; text-align: right">客户：</div>
              <div>
                <el-input v-model="customer" size="small" />
              </div>
            </div>

            <div style="display: flex; align-items: center" v-if="showOther">
              <div class="td-label" style="width: 120px; text-align: right">其它：</div>
              <div>
                <el-input v-model="other" size="small" />
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label" style="margin-bottom: 8px">特殊测试要求：</div>
              <div><el-input type="textarea" v-model="keyTestReq" :autosize="{ minRows: 4 }" style="width: 100%" /></div>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">申请部门：</div>
              <div>{{ applyDeptName }}</div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">申请人：</div>
              <div>{{ applyUserName }}</div>
            </div>
          </td>
          <td />
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label" style="margin-bottom: 8px">研发部回复（设计风险）：</div>
              <div><el-input disabled type="textarea" v-model="devAsk" :autosize="{ minRows: 8 }" style="width: 100%" /></div>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">预计完成时间：</div>
              <div><el-date-picker disabled v-model="guessFinishDate" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></div>
            </div>
          </td>
          <td />
          <td />
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "OaMarketingHandleMakeAddIndex" });
import { fetchHandleApplyPageListById, insertHandleApplyPageList, updateHandleApplyPageList } from "@/api/oaManage/marketing";
import { userInfoList } from "@/api/systemManage";
import { useUserStore } from "@/store/modules/user";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const productNameOrModel = ref("");
const productBeforeNum = ref("");
const checkMakeList = ref([]);
const showCustomer = ref(false);
const showOther = ref(false);
const resFee = ref("");
const testFee = ref("");
const devAsk = ref("");
const finishDate = ref("");
const keyTestReq = ref("");
const applyReason = ref("");
const guessFinishDate = ref("");
const checkReqList = ref([]);
const customer = ref("");
const other = ref("");
const applyDate = ref(dayjs().format("YYYY-MM-DD"));

const initUser = useUserStore().userInfo;
const applyUserName = ref(initUser.userName);
const applyDeptName = ref(initUser.deptName);

const router = useRouter();
const route = useRoute();

const changeReq = (val) => {
  // if (val.includes("其它")) {
  //   showOther.value = true;
  // } else if (val.includes("客户标准")) {
  //   showCustomer.value = true;
  // } else {
  //   showCustomer.value = false;
  //   showOther.value = false;
  // }
};

const onBack = () => {
  router.push("/oa/marketing/saleManage/handleMake/index?menuCode=11&from=/oa/marketing&menuId=332&menuName=手板制作申请");
};

const onSave = () => {
  showMessageBox(`确定保存吗?`).then(async () => {
    // 组装请求参数
    const reqParams = {
      applicationReason: applyReason.value,
      costBearing: resFee.value,
      costEstimation: testFee.value,
      id: undefined,
      productName: productNameOrModel.value,
      productPreResearchNumber: productBeforeNum.value,
      prototyping: checkMakeList.value[0],
      requiredFinishTime: finishDate.value,
      routineTestingRequired: checkReqList.value[0],
      specialTestingRequired: keyTestReq.value
    };

    if (route.query.id) {
      reqParams.id = route.query.id;
    }

    const title = route.query.id ? "修改" : "新增";
    const apiType = { 新增: insertHandleApplyPageList, 修改: updateHandleApplyPageList };

    apiType[title](reqParams).then((res) => {
      if (res.data) {
        message(`${title}成功`, { type: "success" });
      }
    });
  });
};

const initData = () => {
  fetchHandleApplyPageListById({ id: route.query.id }).then((res: any) => {
    if (res.data) {
      productNameOrModel.value = res.data.productName;
      productBeforeNum.value = res.data.productPreResearchNumber;
      applyDate.value = res.data.applyDate;
      checkMakeList.value = [res.data.prototyping];
      resFee.value = res.data.costBearing;
      testFee.value = res.data.costEstimation;
      finishDate.value = res.data.requiredFinishTime;
      applyReason.value = res.data.applicationReason;
      checkReqList.value = [res.data.routineTestingRequired];
      keyTestReq.value = res.data.specialTestingRequired;
      applyDeptName.value = res.data.applyDeptName;
      applyUserName.value = res.data.createUserName;
    }
  });
};

const initAddDeptName = () => {
  const deptId = useUserStore().userInfo.deptId;
  userInfoList({
    page: 1,
    limit: 30,
    userState: "A",
    deptId,
    deptIdList: [deptId]
  }).then((res) => {
    if (res.data) {
      const result = res.data.records[0]?.deptName ?? "";
      applyDeptName.value = result;
    }
  });
};

onMounted(() => {
  if (route.query.id) initData();

  if (!route.query.id) {
    initAddDeptName();
  }
});
</script>

<style scoped lang="scss">
.make-add {
  .title {
    text-align: center;
    font-weight: 700;
    font-size: 30px;
  }

  .btns {
    text-align: right;
  }

  .table-outer {
    table {
      border: 1px solid #000000;
      width: 1200px;
      margin: 0 auto;
    }

    table,
    table td,
    table th {
      padding: 10px 20px;
    }

    table td {
      border-bottom: 1px solid #000;
    }
  }
}
</style>
