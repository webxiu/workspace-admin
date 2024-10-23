<template>
  <div class="make-add">
    <div class="table-outer" ref="printRef">
      <table>
        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">产品名称/型号：</div>
              <div>{{ detailInfo.productName }}</div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">产品预研号：</div>
              <div>{{ detailInfo.productPreResearchNumber }}</div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <span class="td-label">申请日期：</span>
              <span v-if="detailInfo.createDate">{{ dayjs(detailInfo.createDate).format("YYYY-MM-DD") }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">手板类别：</div>
              <div>{{ detailInfo.prototyping }}</div>
            </div>
          </td>
          <td colspan="2">
            <div style="display: flex; align-items: center">
              <div class="td-label">要求完成时间：</div>
              <div>{{ detailInfo.requiredFinishTime }}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">费用承担：</div>
              <div>{{ detailInfo.costBearing }}</div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">费用预估：</div>
              <div>{{ detailInfo.costEstimation }}</div>
            </div>
          </td>
          <td />
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label area-left" style="margin-bottom: 8px">申请原因：</div>
              <div class="area-right">
                {{ detailInfo.applicationReason }}
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; align-items: center">
              <div class="td-label">一般测试要求：</div>
              <div>{{ detailInfo.routineTestingRequired }}</div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label area-left" style="margin-bottom: 8px">特殊测试要求：</div>
              <div class="area-right">
                {{ detailInfo.specialTestingRequired }}
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">申请部门：</div>
              <div>{{ detailInfo.applyDeptName }}</div>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">申请人：</div>
              <div>{{ detailInfo.createUserName }}</div>
            </div>
          </td>
          <td />
        </tr>

        <tr>
          <td colspan="3">
            <div style="display: flex; flex-direction: column">
              <div class="td-label area-left" style="margin-bottom: 8px">研发部回复（设计风险）：</div>
              <div><el-input type="textarea" v-model="devAsk" :autosize="{ minRows: 8 }" style="width: 100%" /></div>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <div style="display: flex; align-items: center">
              <div class="td-label">预计完成时间：</div>
              <div><el-date-picker v-model="guessFinishDate" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></div>
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
import { fetchHandleApplyPageListById } from "@/api/oaManage/marketing";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";

const detailInfo: any = ref({});
const devAsk = ref("");
const guessFinishDate = ref("");

const props = defineProps(["id", "rowData"]);

const initData = (id) => {
  fetchHandleApplyPageListById({ id }).then((res: any) => {
    if (res.data) {
      detailInfo.value = res.data;
    }
  });
};

onMounted(() => {
  if (props.id) initData(props.id);
});

defineExpose({ devAsk, guessFinishDate });
</script>

<style scoped lang="scss">
.area-left {
  text-align: left;
}

.area-right {
  text-align: justify;
}

.make-add {
  .title {
    text-align: center;
    font-weight: 700;
    font-size: 30px;
    margin-bottom: 8px;
  }

  .btns {
    text-align: right;
  }

  .table-outer {
    table {
      border: 1px solid #000000;
      width: 100%;
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
