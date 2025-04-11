<template>
  <div class="trial-detail">
    <table>
      <tr>
        <!-- 22列 -->
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>产品型号：</div>
            <div>
              <HxModalInput
                title="选择产品"
                placeholder="请选择产品型号"
                valueKey="productModel"
                v-model="formData.productModel"
                readonly
                size="small"
                showButton
                @select="onSelect"
                showModel="product"
              />
            </div>
          </div>
        </td>
        <td colspan="4">
          <div style="display: flex; align-items: center">
            <div>规格：</div>
            <div class="flex-1">
              <el-input size="small" placeholder=" " v-model="formData.specs" />
            </div>
          </div>
        </td>
        <td colspan="4">
          <div style="display: flex; align-items: center">
            <div>额定参数：</div>
            <div class="flex-1">
              <el-input size="small" placeholder=" " v-model="formData.rating" />
            </div>
          </div>
        </td>
        <td colspan="8">
          <div style="display: flex; align-items: center">
            <div>修订日期：</div>
            <div>
              <el-date-picker
                size="small"
                v-model="formData.amendDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="22" class="bold">
          <div>依据标准：UL 859；CSA 22.2 No.36</div>
        </td>
      </tr>
      <tr>
        <td rowspan="3" class="head-col" width="100px">区分</td>
        <td rowspan="3" class="head-col" width="60px">No.</td>
        <td rowspan="3" class="head-col" width="50px">测试数量</td>
        <td rowspan="3" colspan="3" class="head-col" width="500px">测试项目</td>
        <td rowspan="3" colspan="4" class="head-col" width="700px">测试要求</td>
        <td rowspan="3" colspan="4" class="head-col" width="700px">判定基准</td>
        <td rowspan="3" class="head-col" width="50px">判定结果</td>
        <td colspan="7" class="head-col">
          检查<br />“空白”未标记不评估；标记“√”需要评估<br />无底色技术研发中心评估；灰底品质部评估；绿底技术研发中心和品质部共同评估项
        </td>
      </tr>
      <tr>
        <td class="head-col" rowspan="2" width="70px">DR1</td>
        <td class="head-col" colspan="2" width="70px">DR2</td>
        <td class="head-col" colspan="2" width="70px">PR</td>
        <td class="head-col" rowspan="2" width="70px">PP</td>
        <td class="head-col" width="70px"><div style="visibility: hidden" /></td>
      </tr>
      <tr>
        <td class="head-col" width="70px">T1</td>
        <td class="head-col" width="70px">T2</td>
        <td class="head-col" width="70px">PR1</td>
        <td class="head-col" width="70px">PR2</td>
        <td class="head-col" width="70px"><div style="visibility: hidden" /></td>
      </tr>

      <tr v-for="(item, idx) in signList" :key="idx">
        <td :rowspan="signList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>
        <td class="head-col">{{ item.No }}</td>
        <td class="head-col">{{ item.testNum }}</td>
        <td colspan="3">{{ item.testItem }}</td>
        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>
      <tr v-for="(item, idx) in appearanceList" :key="idx">
        <td :rowspan="appearanceList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>
        <td class="head-col">{{ item.No }}</td>
        <td class="head-col">{{ item.testNum }}</td>
        <td colspan="3">{{ item.testItem }}</td>
        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>
      <tr v-for="(item, idx) in machineList" :key="idx">
        <td :rowspan="machineList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>
        <td class="head-col">{{ item.No }}</td>
        <td class="head-col">{{ item.testNum }}</td>
        <td colspan="3">{{ item.testItem }}</td>
        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>
      <tr v-for="(item, idx) in operationList" :key="idx">
        <td :rowspan="operationList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>

        <template v-if="idx === 0">
          <td class="head-col" :rowspan="2">{{ item.No }}</td>
          <td class="head-col" :rowspan="2">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="2">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="idx !== 1">{{ item.No }}</td>
          <td class="head-col" v-if="idx !== 1">{{ item.testNum }}</td>
          <td colspan="3" v-if="idx !== 1">{{ item.testItem }}</td>
        </template>

        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in basePerformanceList" :key="idx">
        <td :rowspan="basePerformanceList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>
        <template v-if="idx === 6">
          <td class="head-col" :rowspan="5">{{ item.No }}</td>
          <td class="head-col" :rowspan="5">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="5">{{ item.testItem }}</td>
        </template>

        <template v-if="[11, 14].includes(idx)">
          <td class="head-col" :rowspan="3">{{ item.No }}</td>
          <td class="head-col" :rowspan="3">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="3">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="![6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(idx)">{{ item.No }}</td>
          <td class="head-col" v-if="![6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(idx)">{{ item.testNum }}</td>
          <td colspan="3" v-if="![6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(idx)">{{ item.testItem }}</td>
        </template>
        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <template v-if="idx === 6">
          <td class="head-col" :rowspan="5">{{ item.judgeResult }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="![6, 7, 8, 9, 10].includes(idx)">{{ item.judgeResult }}</td>
        </template>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in electPerformanceList" :key="idx">
        <td :rowspan="electPerformanceList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>

        <template v-if="idx === 0">
          <td class="head-col" :rowspan="2">{{ item.No }}</td>
          <td class="head-col" :rowspan="2">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="2">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="idx !== 1">{{ item.No }}</td>
          <td class="head-col" v-if="idx !== 1">{{ item.testNum }}</td>
          <td colspan="3" v-if="idx !== 1">{{ item.testItem }}</td>
        </template>

        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in badOperationList" :key="idx">
        <td :rowspan="badOperationList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>

        <template v-if="[0, 3, 13, 21].includes(idx)">
          <td class="head-col" :rowspan="3">{{ item.No }}</td>
          <td class="head-col" :rowspan="3">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="3">{{ item.testItem }}</td>
        </template>

        <template v-if="[6, 25].includes(idx)">
          <td class="head-col" :rowspan="6">{{ item.No }}</td>
          <td class="head-col" :rowspan="6">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="6">{{ item.testItem }}</td>
        </template>
        <template v-if="idx === 17">
          <td class="head-col" :rowspan="4">{{ item.No }}</td>
          <td class="head-col" :rowspan="4">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="4">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="idx > 11 && ![13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30].includes(idx)">{{ item.No }}</td>
          <td class="head-col" v-if="idx > 11 && ![13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30].includes(idx)">{{ item.testNum }}</td>
          <td colspan="3" v-if="idx > 11 && ![13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30].includes(idx)">{{ item.testItem }}</td>
        </template>

        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in isolatePerformanceList" :key="idx">
        <td :rowspan="isolatePerformanceList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>

        <template v-if="idx === 0">
          <td class="head-col" :rowspan="3">{{ item.No }}</td>
          <td class="head-col" :rowspan="3">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="3">{{ item.testItem }}</td>
        </template>
        <template v-if="idx === 3">
          <td class="head-col" :rowspan="4">{{ item.No }}</td>
          <td class="head-col" :rowspan="4">{{ item.testNum }}</td>
          <td colspan="3" :rowspan="4">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="idx > 2 && ![3, 4, 5, 6].includes(idx)">{{ item.No }}</td>
          <td class="head-col" v-if="idx > 2 && ![3, 4, 5, 6].includes(idx)">{{ item.testNum }}</td>
          <td colspan="3" v-if="idx > 2 && ![3, 4, 5, 6].includes(idx)">{{ item.testItem }}</td>
        </template>

        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in safetyList" :key="idx">
        <td :rowspan="safetyList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>

        <!-- 9-5实验评估合并TODO -->
        <template v-if="idx === 0">
          <td class="head-col" :rowspan="3">{{ item.No }}</td>
          <td class="head-col" :rowspan="3">{{ item.testNum }}</td>
        </template>
        <template v-if="[3, 7].includes(idx)">
          <td class="head-col" :rowspan="2">{{ item.No }}</td>
          <td class="head-col" :rowspan="2">{{ item.testNum }}</td>
          <td colspan="3">{{ item.testItem }}</td>
        </template>

        <template v-else>
          <td class="head-col" v-if="idx > 2 && ![3, 4, 7, 8].includes(idx)">{{ item.No }}</td>
          <td class="head-col" v-if="idx > 2 && ![3, 4, 7, 8].includes(idx)">{{ item.testNum }}</td>
          <td colspan="3">{{ item.testItem }}</td>
        </template>

        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>

      <tr v-for="(item, idx) in dependenceList" :key="idx">
        <td :rowspan="dependenceList.length" v-if="idx === 0" style="vertical-align: top">{{ item.distinguish }}</td>
        <td class="head-col">{{ item.No }}</td>
        <td class="head-col">{{ item.testNum }}</td>
        <td colspan="3">{{ item.testItem }}</td>
        <td colspan="4">{{ item.testReq }}</td>
        <td colspan="4">{{ item.judgeStandard }}</td>
        <td class="head-col">{{ item.judgeResult }}</td>
        <td class="head-col"><el-checkbox v-model="item.dr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.t2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr1" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pr2" label="" /></td>
        <td class="head-col"><el-checkbox v-model="item.pp" label="" /></td>
        <td class="head-col"><div /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { useTableList } from "./config";

const {
  transportList,
  appearanceList,
  temperatureTestList,
  partDurabilityList,
  machineFullList,
  envExperimentList,
  dependenceList,
  isolatePerformanceList,
  machineList,
  safetyList,
  badOperationList,
  electPerformanceList,
  operationList,
  basePerformanceList,
  signList
} = useTableList();
const formData: any = reactive({});
const dataList = ref([]);

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};

defineExpose({
  formData,
  transportList,
  appearanceList,
  temperatureTestList,
  partDurabilityList,
  machineFullList,
  envExperimentList,
  dependenceList,
  isolatePerformanceList,
  machineList,
  safetyList,
  badOperationList,
  electPerformanceList,
  operationList,
  basePerformanceList,
  signList
});
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
