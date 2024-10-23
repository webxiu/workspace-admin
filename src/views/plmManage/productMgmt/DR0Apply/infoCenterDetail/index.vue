<template>
  <div>
    <div class="dr0-page" ref="dr0SheetRef">
      <table align="center">
        <tr>
          <td class="td-lable">申请部门</td>
          <td class="td-value">{{ detailInfo.deptName }}</td>
          <td class="td-lable">申请人</td>
          <td class="td-value">{{ detailInfo.userName }}</td>
          <td class="td-lable">客户</td>
          <td class="td-value">{{ detailInfo.customer }}</td>
          <td class="td-lable">申请日期</td>
          <td class="td-value">{{ dayjs(detailInfo.applyDate).format("YYYY-MM-DD") }}</td>
        </tr>
        <tr>
          <td class="td-lable">产品名称</td>
          <td class="td-value">{{ detailInfo.productName }}</td>
          <td class="td-lable">开发类型</td>
          <td class="td-value">{{ detailInfo.developmentType }}</td>
          <td class="td-lable">参考机型</td>
          <td class="td-value">{{ detailInfo.referenceModel }}</td>
          <td class="td-lable">产品等级</td>
          <td class="td-value">{{ detailInfo.productGrade }}</td>
        </tr>
        <tr class="devide-td">
          <td colspan="8" align="center">基本功能要求</td>
        </tr>
        <tr v-if="detailInfo.functionalities">
          <td class="td-lable">设计风格、功能描述</td>
          <td colspan="7" class="td-value">
            {{ detailInfo.functionalities[0]?.functionalityDescription }}
          </td>
        </tr>
        <tr v-if="detailInfo.functionalities">
          <td class="td-lable">产品颜色</td>
          <td class="td-value">{{ detailInfo.functionalities[0]?.productColor }}</td>
          <td class="td-lable">表面处理</td>
          <td class="td-value">{{ detailInfo.functionalities[0]?.surfaceTreatment }}</td>
          <td class="td-lable">工作电压</td>
          <td class="td-value">{{ detailInfo.functionalities[0]?.workingVoltage }}</td>
          <td class="td-lable">功率W</td>
          <td class="td-value">{{ detailInfo.functionalities[0]?.power }}</td>
        </tr>
        <tr v-if="detailInfo.functionalities">
          <td class="td-lable">认证要求</td>
          <td colspan="5" class="td-value">{{ detailInfo.functionalities[0]?.certificationRequirement }}</td>
          <td class="td-lable">销售对象</td>
          <td class="td-value">{{ detailInfo.functionalities[0]?.saleCustomer }}</td>
        </tr>

        <tr v-if="detailInfo.functionalities">
          <td rowspan="2" align="center" class="td-lable">配件</td>
          <td colspan="3" class="td-value">{{ detailInfo.functionalities[0]?.accessories }}</td>
          <td rowspan="2" align="center" class="td-lable">性能要求</td>
          <td rowspan="2" colspan="3" style="font-size: 12px" class="td-value">
            <div class="wrapper-group" style="margin-bottom: 8px">
              <div class="outer-input" v-if="detailInfo.functionalities[0]?.motorType">
                <div>马达类型：</div>
                <div>{{ detailInfo.functionalities[0]?.motorType }}</div>
              </div>
              <div class="outer-input" style="margin: 0 8px" v-if="detailInfo.functionalities[0]?.heatingElement">
                <div>发热体：</div>
                <div>{{ detailInfo.functionalities[0]?.heatingElement }}</div>
              </div>
              <br />
              <div class="outer-input" v-if="detailInfo.functionalities[0]?.bluetooth">
                <div>蓝牙：</div>
                <div>{{ detailInfo.functionalities[0]?.bluetooth }}</div>
              </div>
            </div>

            <div class="wrapper-group">
              <div class="outer-input" v-if="detailInfo.functionalities[0]?.shelfLife">
                <div>整理寿命：</div>
                <div>{{ detailInfo.functionalities[0]?.shelfLife }}</div>
              </div>
              <div class="outer-input" style="margin: 0 8px" v-if="detailInfo.functionalities[0]?.negativeIon">
                <div>负离子：</div>
                <div>{{ detailInfo.functionalities[0]?.negativeIon }}</div>
              </div>
              <div class="outer-input" v-if="detailInfo.functionalities[0]?.others">
                <div>其它：</div>
                <div>{{ detailInfo.functionalities[0]?.others }}</div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="detailInfo.functionalities">
          <td colspan="3" class="td-value">
            <div style="display: flex; align-items: center; font-size: 12px">
              <div style="width: 70px">包材要求：</div>
              {{ detailInfo.functionalities[0]?.packagingRequirements }}
            </div>
          </td>
        </tr>
        <tr v-if="detailInfo.functionalities">
          <td align="center" class="td-lable">产品卖点</td>
          <td colspan="3" class="td-value">
            {{ detailInfo.functionalities[0]?.productSellingPoints }}
          </td>
          <td align="center" class="td-lable">产品缺点</td>
          <td colspan="3" class="td-value">
            {{ detailInfo.functionalities[0]?.productDefects }}
          </td>
        </tr>
        <tr class="devide-td">
          <td colspan="8" align="center">商品策划时前期考虑内容</td>
        </tr>

        <tr>
          <td class="td-lable">第一销售地</td>
          <td class="td-value">{{ detailInfo.firstSalesLocation }}</td>
          <td class="td-lable">第二销售地</td>
          <td class="td-value">{{ detailInfo.secondSalesLocation }}</td>
          <td class="td-lable">策划台数/年</td>
          <td class="td-value">{{ detailInfo.plannedUnitsPerYear }}</td>
          <td class="td-lable">销售价格</td>
          <td class="td-value">{{ detailInfo.salesPrice }}</td>
        </tr>
        <tr>
          <td class="td-lable">单机成本</td>
          <td class="td-value">{{ detailInfo.unitCost }}</td>
          <td class="td-lable">包材</td>
          <td class="td-value">{{ detailInfo.packaging }}</td>
          <td class="td-lable">制造成本</td>
          <td class="td-value">{{ detailInfo.manufacturingCost }}</td>
          <td class="td-lable">产品成本 （合计）</td>
          <td class="td-value">{{ detailInfo.totalProductCost }}</td>
        </tr>

        <tr>
          <td class="td-lable">产品毛利润 （预计）</td>
          <td colspan="3" class="td-value">{{ detailInfo.estimatedGrossProfit }}</td>
          <td class="td-lable">项目总利润 （预计）</td>
          <td colspan="3" class="td-value">{{ detailInfo.estimatedProjectProfit }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import bomLogo from "@/assets/images/greylogo.png";
import { nextTick, onMounted, ref } from "vue";
import Print from "@/utils/print";

defineOptions({ name: "PlmManageProjectMgmtDR0ApplyPrintIndex" });
const props = defineProps(["id"]);

import { useRoute, useRouter } from "vue-router";
import { fetchDR0PageListById } from "@/api/oaManage/marketing";
import dayjs from "dayjs";

const dr0SheetRef = ref();
const router = useRouter();
const route = useRoute();

const detailInfo: any = ref({});

const onBack = () => {
  router.push("/plmManage/productMgmt/DR0Apply/index?menuCode=11&from=/oa/marketing&menuId=322&menuName=DR0开发申请");
};

const onPrint = () => {
  console.log("print...");
  nextTick(() => {
    Print(dr0SheetRef.value);
  });
};

onMounted(() => {
  if (props.id) {
    fetchDR0PageListById(props.id).then((res) => {
      if (res.data) {
        console.log(res.data, " print data..");
        detailInfo.value = res.data;
      }
    });
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
    width: 100%;
    .td-lable {
      width: 110px;
      text-align: center;
    }

    .td-value {
      text-align: left;
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
    display: flex;
    align-items: center;
    flex-direction: column;
    // align-items: center;
    // margin: auto;

    // .logo {
    //   flex: 0.6;
    //   text-align: center;
    // }

    .title {
      font-weight: 700;
      font-size: 30px;
      margin: 8px 0;
    }
  }
}
</style>
