<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col">组别</td>
        <td class="head-col" width="60px">阶段</td>
        <td class="head-col">工作</td>
        <td class="head-col" width="100px">时间(天)</td>
        <td class="head-col" width="100px">岗位费用(¥)</td>
        <td class="head-col" width="100px">预算费用(¥)</td>
        <td class="head-col" width="100px">实际(天)</td>
        <td class="head-col" width="100px">实际费用(¥)</td>
        <td class="head-col" width="340px">备注</td>
      </tr>

      <tr v-for="(item, idx) in dataList1" :key="idx">
        <td :rowspan="13" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td :rowspan="6" v-if="idx === 0" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="3" v-if="idx === 6" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="3" v-if="idx === 9" align="center">{{ item.projectStateName }}</td>
        <td v-if="item.workName === '小计'" :colspan="2" class="fw">{{ item.workName }}</td>
        <td v-else>{{ item.workName }}</td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="pmTotal.timeDayTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.posFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="pmTotal.budgetFeeTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualFee" class="ui-w-100" />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.workName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList2" :key="idx">
        <td :rowspan="23" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td :rowspan="8" v-if="idx === 0" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="9" v-if="idx === 8" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="5" v-if="idx === 17" align="center">{{ item.projectStateName }}</td>
        <td v-if="item.workName === '小计'" :colspan="2" class="fw">{{ item.workName }}</td>
        <td v-else>{{ item.workName }}</td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="structureTotal.timeDayTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.posFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number :precision="2" disabled v-if="item.workName === '小计'" :controls="false" v-model="structureTotal.budgetFeeTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualFee" class="ui-w-100" />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.workName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList3" :key="idx">
        <td :rowspan="10" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td :rowspan="4" v-if="idx === 0" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="4" v-if="idx === 4" align="center">{{ item.projectStateName }}</td>
        <td v-if="idx === 8" align="center">{{ item.projectStateName }}</td>
        <td v-if="item.workName === '小计'" :colspan="2" class="fw">{{ item.workName }}</td>
        <td v-else>{{ item.workName }}</td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="electronTotal.timeDayTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.posFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number :precision="2" disabled v-if="item.workName === '小计'" :controls="false" v-model="electronTotal.budgetFeeTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualFee" class="ui-w-100" />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.workName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList4" :key="idx">
        <td :rowspan="6" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td :rowspan="2" v-if="idx === 0" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="2" v-if="idx === 2" align="center">{{ item.projectStateName }}</td>
        <td v-if="idx === 4" align="center">{{ item.projectStateName }}</td>
        <td v-if="item.workName === '小计'" :colspan="2" class="fw">{{ item.workName }}</td>
        <td v-else>{{ item.workName }}</td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="testTotal.timeDayTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.posFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number :precision="2" disabled v-if="item.workName === '小计'" :controls="false" v-model="testTotal.budgetFeeTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualFee" class="ui-w-100" />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.workName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList5" :key="idx">
        <td :rowspan="2" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td v-if="['小计', '认证资料、BOM、资料汇总'].includes(item.projectStateName)" :colspan="2" :class="item.projectStateName === '小计' ? 'fw' : ''">
          {{ item.projectStateName }}
        </td>
        <td v-else>{{ item.projectStateName }}</td>
        <td>
          <el-input-number
            :precision="2"
            v-if="item.projectStateName === '小计'"
            disabled
            :controls="false"
            v-model="assetsTotal.timeDayTotal"
            class="ui-w-100"
          />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number
            v-if="item.projectStateName !== '小计'"
            :disabled="item.projectStateName === '小计'"
            :controls="false"
            v-model="item.posFee"
            class="ui-w-100"
          />
        </td>
        <td>
          <el-input-number
            :precision="2"
            disabled
            v-if="item.projectStateName === '小计'"
            :controls="false"
            v-model="assetsTotal.budgetFeeTotal"
            class="ui-w-100"
          />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number
            v-if="item.projectStateName !== '小计'"
            :disabled="item.projectStateName === '小计'"
            :controls="false"
            v-model="item.actualDay"
            class="ui-w-100"
          />
        </td>
        <td>
          <el-input-number
            v-if="item.projectStateName !== '小计'"
            :disabled="item.projectStateName === '小计'"
            :controls="false"
            v-model="item.actualFee"
            class="ui-w-100"
          />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.projectStateName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList6" :key="idx">
        <td :rowspan="7" v-if="idx === 0" align="center">{{ item.groupName }}</td>
        <td :rowspan="2" v-if="idx === 0" align="center">{{ item.projectStateName }}</td>
        <td :rowspan="4" v-if="idx === 2" align="center">{{ item.projectStateName }}</td>
        <td v-if="item.workName === '小计'" :colspan="2" class="fw">{{ item.workName }}</td>
        <td v-else>{{ item.workName }}</td>
        <td>
          <el-input-number :precision="2" v-if="item.workName === '小计'" disabled :controls="false" v-model="templateTotal.timeDayTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.timeDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.posFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number :precision="2" disabled v-if="item.workName === '小计'" :controls="false" v-model="templateTotal.budgetFeeTotal" class="ui-w-100" />
          <el-input-number v-else :controls="false" v-model="item.budgetFee" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualDay" class="ui-w-100" />
        </td>
        <td>
          <el-input-number v-if="item.workName !== '小计'" :disabled="item.workName === '小计'" :controls="false" v-model="item.actualFee" class="ui-w-100" />
        </td>
        <td>
          <el-input v-model="item.remark" v-if="item.workName !== '小计'" autosize type="textarea" placeholder=" " />
        </td>
      </tr>
      <tr>
        <td class="fw" colspan="3">合计:</td>
        <td>
          <el-input-number :precision="2" disabled :controls="false" v-model="sumTimeDayTotal" class="ui-w-100" />
        </td>
        <td />
        <td>
          <el-input-number :precision="2" disabled :controls="false" v-model="sumBudgetFeeTotal" class="ui-w-100" />
        </td>
        <td />
        <td />
        <td />
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { computed, ref } from "vue";

const pmTotal = computed(() => {
  const timeDayTotal = dataList1.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList1.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const structureTotal = computed(() => {
  const timeDayTotal = dataList2.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList2.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const electronTotal = computed(() => {
  const timeDayTotal = dataList3.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList3.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const testTotal = computed(() => {
  const timeDayTotal = dataList4.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList4.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const assetsTotal = computed(() => {
  const timeDayTotal = dataList5.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList5.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const templateTotal = computed(() => {
  const timeDayTotal = dataList6.value.reduce((pre, next) => pre + next.timeDay, 0);
  const budgetFeeTotal = dataList6.value.reduce((pre, next) => pre + next.budgetFee, 0);
  return { timeDayTotal, budgetFeeTotal };
});

const dataList1 = ref([
  {
    groupName: "项目",
    projectStateName: "DR2",
    workName: "开发申请单评审会议",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "项目", projectStateName: "DR2", workName: "3D结构评审", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "DR2", workName: "产品排摸表评审", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "DR2", workName: "项目预算", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "DR2", workName: "开发计划表", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  {
    groupName: "项目",
    projectStateName: "DR2",
    workName: "项目进度及异常跟进",
    timeDay: 0,
    posFee: 0,
    budgetFee: 0,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "项目", projectStateName: "PR", workName: "PR产前确认", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "PR", workName: "PR试产跟进", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "PR", workName: "PR试产总结", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "PP", workName: "PP产前确认", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "PP", workName: "PP试产跟进", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "PP", workName: "PP试产总结", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" },
  { groupName: "项目", projectStateName: "", workName: "小计", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const dataList2 = ref([
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "开发申请单评审会议",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "结构调整",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "2D图纸",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "模具DFM评审",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "模图评审",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "跟进模具及试模",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "DR2样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "DR2",
    workName: "DR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "T1改模资料及手板",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "PR1样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "PR1样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "T2改模资料及手板",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "PR2样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "PR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "T3改模资料及手板",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "规格书等资料制作",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PR",
    workName: "PP试产总结会",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },

  {
    groupName: "结构",
    projectStateName: "PP",
    workName: "PP试产",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PP",
    workName: "PP试产问题点汇总及分析",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PP",
    workName: "PP试产总结会",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PP",
    workName: "变更申请及T4改模资料",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "结构",
    projectStateName: "PP",
    workName: "改模后验证",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 312.5,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "结构", projectStateName: "", workName: "小计", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const dataList3 = ref([
  {
    groupName: "电子",
    projectStateName: "DR2",
    workName: "PCB调整",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "DR2",
    workName: "资料更新",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "DR2",
    workName: "DR2样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "DR2",
    workName: "DR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "PR",
    workName: "PR1样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "PR",
    workName: "PR1样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "PR",
    workName: "PR2样机制作物料准备",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "PR",
    workName: "PR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "电子",
    projectStateName: "PP",
    workName: "跟进产线试产",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "电子", projectStateName: "", workName: "小计", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const dataList4 = ref([
  {
    groupName: "测试",
    projectStateName: "DR2",
    workName: "工程样机测试",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "测试",
    projectStateName: "DR2",
    workName: "FAI",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "测试",
    projectStateName: "PR",
    workName: "样机测试",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "测试",
    projectStateName: "PR",
    workName: "FAI",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "测试",
    projectStateName: "PP",
    workName: "PP样机测试",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "测试", projectStateName: "", workName: "小计", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const dataList5 = ref([
  {
    groupName: "资料",
    projectStateName: "认证资料、BOM、资料汇总",
    workName: "",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "资料", projectStateName: "小计", workName: "", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const dataList6 = ref([
  {
    groupName: "样板组",
    projectStateName: "DR2",
    workName: "DR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "样板组",
    projectStateName: "DR2",
    workName: "DR2客户样机制作",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "样板组",
    projectStateName: "PR",
    workName: "PR1样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "样板组",
    projectStateName: "PR",
    workName: "PR1客户样机制作",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "样板组",
    projectStateName: "PR",
    workName: "PR2样机制作及问题点总结",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  {
    groupName: "样板组",
    projectStateName: "PR",
    workName: "PR2样机制作",
    timeDay: 0.5,
    posFee: 0,
    budgetFee: 31,
    actualDay: 0,
    actualFee: 0,
    remark: ""
  },
  { groupName: "样板组", projectStateName: "", workName: "小计", timeDay: 0, posFee: 0, budgetFee: 0, actualDay: 0, actualFee: 0, remark: "" }
]);

const sumTimeDayTotal = computed(() => {
  return [pmTotal, structureTotal, electronTotal, testTotal, assetsTotal, templateTotal].reduce((pre, next) => pre + next.value.timeDayTotal, 0);
});

const sumBudgetFeeTotal = computed(() => {
  return [pmTotal, structureTotal, electronTotal, testTotal, assetsTotal, templateTotal].reduce((pre, next) => pre + next.value.budgetFeeTotal, 0);
});

const dataList = computed(() => [...dataList1.value, ...dataList2.value, ...dataList3.value, ...dataList4.value, ...dataList5.value, ...dataList6.value]);

defineExpose({ dataList, sumTimeDayTotal: sumTimeDayTotal.value, sumBudgetFeeTotal: sumBudgetFeeTotal.value });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .line-txt {
      padding: 6px;
      font-weight: 700;
    }

    .fw {
      font-weight: 700;
      color: #000;
    }

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }

  .first-line {
    td {
      border-top: none;
    }
  }
}
</style>
