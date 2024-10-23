<template>
  <div>
    <div class="btns"><el-button type="primary" @click="onSave">保存</el-button> <el-button type="default" @click="onBack">返回</el-button></div>
    <div class="dr0-page">
      <div class="top-area-dr0">
        <div class="title">DR0开发申请表</div>
      </div>
      <table align="center">
        <tr>
          <td class="td-lable">申请部门</td>
          <td>
            <!-- <el-tree-select
              disabled
              v-model="deptDataTreeSelected"
              :data="treeSelectData"
              @change="changeDept"
              placeholder=" "
              check-strictly
              :default-expanded-keys="['0']"
              node-key="value"
              render-after-expand="{false}"
              class="ui-w-100"
            /> -->
            {{ deptName }}
          </td>
          <td class="td-lable">申请人</td>
          <td>
            <!-- <el-select placeholder=" " filterable clearable v-model="selectedUserName" style="width: 100%" disabled>
              <el-option v-for="item in applyUserOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-select> -->
            <!-- <el-input v-model="selectedUserName" disabled /> -->
            {{ selectedUserName }}
          </td>
          <td class="td-lable">客户</td>
          <td><el-input v-model="customer" /></td>
          <td class="td-lable">申请日期</td>
          <td>
            <!-- <el-date-picker disabled v-model="applyDate" clearable type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" style="width: 100%" /> -->
            {{ applyDate }}
          </td>
        </tr>
        <tr>
          <td class="td-lable">产品名称</td>
          <td><el-input v-model="productName" /></td>
          <td class="td-lable">开发类型</td>
          <td>
            <el-checkbox-group v-model="devTypeList" @change="devTypeChange">
              <el-checkbox v-for="item in devTypeOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-checkbox-group>
          </td>
          <td class="td-lable">参考机型</td>
          <td><el-input v-model="productModel" /></td>
          <td class="td-lable">产品等级</td>
          <td>
            <el-checkbox-group v-model="productLevelList" @change="productLevelChange">
              <el-checkbox v-for="item in productLevelOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-checkbox-group>
          </td>
        </tr>
        <tr class="devide-td">
          <td colspan="8" align="center">基本功能要求</td>
        </tr>
        <tr>
          <td class="td-lable">设计风格、功能描述</td>
          <td colspan="7"><el-input type="textarea" v-model="designStyle" :autosize="{ minRows: 12 }" /></td>
        </tr>
        <tr>
          <td class="td-lable">产品颜色</td>
          <td>
            <el-select v-model="selectedProductColor" placeholder=" " style="width: 100%" clearable>
              <el-option v-for="item in productColorOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-select>
          </td>
          <td class="td-lable">表面处理</td>
          <td>
            <el-select v-model="surfaceSelected" placeholder=" " clearable style="width: 100%">
              <el-option v-for="item in surfaceOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-select>
          </td>
          <td class="td-lable">工作电压</td>
          <td>
            <el-select v-model="selectedVT" placeholder=" " style="width: 100%" clearable>
              <el-option v-for="item in voltageOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-select>
          </td>
          <td class="td-lable">功率(W)</td>
          <td><el-input-number v-model="power" :controls="false" style="width: 100%" /></td>
        </tr>
        <tr>
          <td class="td-lable">认证要求</td>
          <td colspan="5">
            <el-checkbox-group v-model="selectedAuthRequire">
              <el-checkbox v-for="item in authRequireOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-checkbox-group>
          </td>
          <td class="td-lable">销售对象</td>
          <td>
            <el-input v-model="saleTarget" />
          </td>
        </tr>

        <tr>
          <td rowspan="2" align="center" class="td-lable">配件</td>
          <td colspan="3">
            <el-checkbox-group v-model="selectedAccessory">
              <el-checkbox v-for="item in accessoryOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
            </el-checkbox-group>
          </td>
          <td rowspan="2" align="center" class="td-lable">性能要求</td>
          <td rowspan="2" colspan="3" style="font-size: 12px">
            <div class="wrapper-group" style="margin-bottom: 8px">
              <div class="outer-input">
                <div>马达类型：</div>
                <div><el-input v-model="motorType" size="small" style="width: 120px" /></div>
              </div>
              <div class="outer-input" style="margin: 0 8px">
                <div>发热体：</div>
                <div><el-input v-model="hotElement" size="small" style="width: 120px" /></div>
              </div>
              <br />
              <div class="outer-input">
                <div>蓝牙：</div>
                <div><el-input v-model="bluetooth" size="small" style="width: 120px" /></div>
              </div>
            </div>

            <div class="wrapper-group">
              <div class="outer-input">
                <div>整理寿命：</div>
                <div><el-input v-model="life" size="small" style="width: 120px" /></div>
              </div>
              <div class="outer-input" style="margin: 0 8px">
                <div>负离子：</div>
                <div><el-input v-model="negativeIon" size="small" style="width: 120px" /></div>
              </div>
              <div class="outer-input">
                <div>其它：</div>
                <div><el-input v-model="otherReq" size="small" style="width: 120px" /></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div style="display: flex; align-items: center">
              <div style="width: 70px; font-size: 12px">包材要求：</div>
              <el-input type="textarea" v-model="materialReq" autosize />
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" class="td-lable">产品卖点</td>
          <td colspan="3">
            <el-input type="textarea" v-model="salePoint" :autosize="{ minRows: 7 }" />
          </td>
          <td align="center" class="td-lable">产品缺点</td>
          <td colspan="3">
            <el-input type="textarea" v-model="disPoint" :autosize="{ minRows: 7 }" />
          </td>
        </tr>
        <tr class="devide-td">
          <td colspan="8" align="center">商品策划时前期考虑内容</td>
        </tr>

        <tr>
          <td class="td-lable">第一销售地</td>
          <td><el-input v-model="firstPlace" /></td>
          <td class="td-lable">第二销售地</td>
          <td><el-input v-model="secondPlace" /></td>
          <td class="td-lable">策划台数/年</td>
          <td><el-input-number style="width: 100%" v-model="countYear" :controls="false" /></td>
          <td class="td-lable">销售价格</td>
          <td><el-input-number style="width: 100%" :controls="false" v-model="salePrice" /></td>
        </tr>
        <tr>
          <td class="td-lable">单机成本</td>
          <td><el-input-number style="width: 100%" :controls="false" v-model="singlePrice" /></td>
          <td class="td-lable">包材</td>
          <td><el-input v-model="materialDes" /></td>
          <td class="td-lable">制造成本</td>
          <td><el-input-number style="width: 100%" :controls="false" v-model="makeFee" /></td>
          <td class="td-lable">产品成本 合计</td>
          <td><el-input-number style="width: 100%" :controls="false" v-model="productTotalFee" /></td>
        </tr>

        <tr>
          <td class="td-lable">产品毛利润 （预计）</td>
          <td colspan="3"><el-input-number style="width: 100%" :controls="false" v-model="grossMargin" /></td>
          <td class="td-lable">项目总利润 （预计）</td>
          <td colspan="3"><el-input-number style="width: 100%" :controls="false" v-model="totalProfit" /></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDeptOptions } from "@/utils/requestApi";
import { userInfoList } from "@/api/systemManage";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import dayjs from "dayjs";

defineOptions({ name: "PlmManageProjectMgmtDR0ApplyAddIndex" });

import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { queryUserDeptList } from "@/api/systemManage";
import { fetchDR0PageListById, insertDR0PageList, updateDR0PageList } from "@/api/oaManage/marketing";

const initUserName = useUserStoreHook().userInfo.userName;
const initUserDeptId = useUserStoreHook().userInfo.deptId;

const deptName = ref("");

const devTypeChange = () => {
  if (devTypeList.value.length > 1) {
    devTypeList.value.splice(0, 1);
  }
};

const productLevelChange = () => {
  if (productLevelList.value.length > 1) {
    productLevelList.value.splice(0, 1);
  }
};

const deptDataTreeSelected = ref(initUserDeptId + "");
const treeSelectData = ref([]);
const life = ref("");
const negativeIon = ref("");
const selectedProductColor = ref("");
const selectedVT = ref("");
const surfaceSelected = ref("");
const hotElement = ref("");
const applyUserOpts = ref([]);
const motorType = ref("");
const otherReq = ref("");
const selectedUserName = ref(initUserName);
const productName = ref("");
const devTypeList = ref([]);
const bluetooth = ref("");
const customer = ref("");
const materialReq = ref("");
const selectedAccessory = ref([]);
const devTypeOpts = ref([]);
const applyDate = ref(dayjs().format("YYYY-MM-DD"));
const saleTarget = ref("");
const salePoint = ref("");
const disPoint = ref("");
const selectedAuthRequire = ref([]);
const productModel = ref("");
const productLevelList = ref([]);
const productLevelOpts = ref([]);
const power = ref(0);
const productColorOpts = ref([]);
const surfaceOpts = ref([]);
const voltageOpts = ref([]);
const authRequireOpts = ref([]);
const accessoryOpts = ref([]);
const designStyle = ref("");
const firstPlace = ref("");
const secondPlace = ref("");
const countYear = ref(0);
const salePrice = ref(0);
const singlePrice = ref(0);
const materialDes = ref("");
const makeFee = ref(0);
const productTotalFee = ref(0);
const grossMargin = ref(0);
const totalProfit = ref(0);
const detailInfo: any = ref({});
const router = useRouter();
const route = useRoute();
const applicant = ref(useUserStoreHook().userInfo.id);
const applyDepartment = ref(useUserStoreHook().userInfo.deptId);

const changeDept = (val) => {
  userInfoList({
    deptId: val,
    limit: 100000,
    page: 1,
    userCode: "",
    userName: "",
    deptIdList: [val],
    userState: "A"
  }).then((res) => {
    if (res.data) {
      applyUserOpts.value = res.data.records.map((item) => ({ optionValue: item.id, optionName: item.userName }));
    }
  });
};

const onBack = () => {
  router.push("/plmManage/productMgmt/DR0Apply/index?menuCode=11&from=/oa/marketing&menuId=322&menuName=DR0开发申请");
};

const fetchOpts = () => {
  getDeptOptions().then((data) => {
    treeSelectData.value = data;
  });

  getBOMTableRowSelectOptions({ optioncode: "DR0DevType,DR0ProductLevel,ProductColors,DR0Surface,DR0Voltage,DR0AuthRequire,DR0Part" }).then((res) => {
    if (res.data) {
      const findRes = res.data.find((item) => item.optionCode === "DR0DevType")?.optionList || [];
      devTypeOpts.value = findRes;

      const findRes1 = res.data.find((item) => item.optionCode === "DR0ProductLevel")?.optionList || [];
      productLevelOpts.value = findRes1;

      const findRes2 = res.data.find((item) => item.optionCode === "ProductColors")?.optionList || [];
      productColorOpts.value = findRes2;

      const findRes3 = res.data.find((item) => item.optionCode === "DR0Surface")?.optionList || [];
      surfaceOpts.value = findRes3;

      const findRes4 = res.data.find((item) => item.optionCode === "DR0Voltage")?.optionList || [];
      voltageOpts.value = findRes4;

      const findRes5 = res.data.find((item) => item.optionCode === "DR0AuthRequire")?.optionList || [];
      authRequireOpts.value = findRes5;

      const findRes6 = res.data.find((item) => item.optionCode === "DR0Part")?.optionList || [];
      accessoryOpts.value = findRes6;
    }
  });
};

const onSave = () => {
  // 构造请求参数
  const reqParams = {
    applicant: applicant.value,
    applyDate: applyDate.value,
    applyDepartment: applyDepartment.value,
    customer: customer.value,
    id: undefined,
    billNo: undefined,
    developmentType: devTypeList.value[0],
    estimatedGrossProfit: grossMargin.value,
    estimatedProjectProfit: totalProfit.value,
    firstSalesLocation: firstPlace.value,
    functionalities: [
      {
        accessories: selectedAccessory.value.join(","),
        bluetooth: bluetooth.value,
        functionalityDescription: designStyle.value,
        heatingElement: hotElement.value,
        motorType: motorType.value,
        negativeIon: negativeIon.value,
        others: otherReq.value,
        id: undefined,
        packagingRequirements: materialReq.value,
        power: power.value,
        productColor: selectedProductColor.value,
        productDefects: disPoint.value,
        productSellingPoints: salePoint.value,
        shelfLife: life.value,
        surfaceTreatment: surfaceSelected.value,
        workingVoltage: selectedVT.value,
        saleCustomer: saleTarget.value,
        certificationRequirement: selectedAuthRequire.value.join(",")
      }
    ],
    manufacturingCost: makeFee.value,
    packaging: materialDes.value,
    plannedUnitsPerYear: countYear.value,
    productGrade: productLevelList.value[0],
    productName: productName.value,
    referenceModel: productModel.value,
    salesPrice: salePrice.value,
    secondSalesLocation: secondPlace.value,
    totalProductCost: productTotalFee.value,
    unitCost: singlePrice.value
  };

  if (route.query.id) {
    // 新增
    reqParams.id = route.query.id;
    reqParams.functionalities[0].id = route.query.innerId;
    reqParams.billNo = detailInfo.value.billNo;
  }

  console.log(reqParams, " req==========");

  const title = route.query.id ? "修改" : "新增";
  const type = route.query.id ? "edit" : "add";
  const typeApi = { add: insertDR0PageList, edit: updateDR0PageList };
  // return;
  typeApi[type](reqParams).then((res) => {
    if (res.data) {
      console.log(res.data, " res.dat===");
      message(`${title}成功`, { type: "success" });
    }
  });
};

const initData = (id) => {
  fetchDR0PageListById(id).then((res: any) => {
    if (res.data) {
      console.log(res.data, " find one..");
      detailInfo.value = res.data;
      customer.value = res.data.customer;
      deptName.value = res.data.deptName;
      applicant.value = res.data.applicant;
      applyDepartment.value = res.data.applyDepartment;
      applyDate.value = dayjs(res.data.applyDate).format("YYYY-MM-DD");
      productName.value = res.data.productName;
      devTypeList.value = [res.data.developmentType];
      productModel.value = res.data.referenceModel;
      productLevelList.value = [res.data.productGrade];
      designStyle.value = res.data.functionalities[0]?.functionalityDescription;
      selectedProductColor.value = res.data.functionalities[0]?.productColor;
      surfaceSelected.value = res.data.functionalities[0]?.surfaceTreatment;
      selectedVT.value = res.data.functionalities[0]?.workingVoltage;
      power.value = res.data.functionalities[0]?.power;
      selectedAuthRequire.value = res.data.functionalities[0]?.certificationRequirement?.split(",");
      saleTarget.value = res.data.functionalities[0]?.saleCustomer;
      selectedAccessory.value = res.data.functionalities[0]?.accessories?.split(",");
      materialReq.value = res.data.functionalities[0]?.packagingRequirements;
      motorType.value = res.data.functionalities[0]?.motorType;
      hotElement.value = res.data.functionalities[0]?.heatingElement;
      bluetooth.value = res.data.functionalities[0]?.bluetooth;
      life.value = res.data.functionalities[0]?.shelfLife;
      negativeIon.value = res.data.functionalities[0]?.negativeIon;
      otherReq.value = res.data.functionalities[0]?.others;
      salePoint.value = res.data.functionalities[0]?.productSellingPoints;
      disPoint.value = res.data.functionalities[0]?.productDefects;
      firstPlace.value = res.data.firstSalesLocation;
      secondPlace.value = res.data.secondSalesLocation;
      countYear.value = res.data.plannedUnitsPerYear;
      salePrice.value = res.data.salesPrice;
      singlePrice.value = res.data.unitCost;
      materialDes.value = res.data.packaging;
      makeFee.value = res.data.manufacturingCost;
      productTotalFee.value = res.data.totalProductCost;
      grossMargin.value = res.data.estimatedGrossProfit;
      totalProfit.value = res.data.estimatedProjectProfit;
    }
  });
};

onMounted(() => {
  fetchOpts();

  queryUserDeptList({ userId: useUserStoreHook().userInfo.id }).then((res: any) => {
    if (res.data) {
      const result = res.data.find((el) => el.isMaster);

      if (result && !route.query.id) deptName.value = result.deptName;
    }
  });

  if (route.query.id) {
    initData(route.query.id);
  }
});
</script>

<style scoped lang="scss">
.btns {
  text-align: right;
}

.dr0-page {
  table,
  table td,
  table th {
    border: 1px solid #000000;
    padding: 5px 10px;
  }

  .devide-td {
    padding: 8px auto;
    background-color: #ccc;
    font-weight: 700;
  }

  table {
    width: 1600px;

    .td-lable {
      text-align: center;
    }

    .wrapper-group {
      display: flex;
      align-items: center;

      .outer-input {
        display: flex;
        align-items: center;
      }
    }
  }

  .top-area-dr0 {
    width: 1600px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;

    .title {
      text-align: center;
      font-weight: 700;
      font-size: 30px;
    }
  }
}
</style>
