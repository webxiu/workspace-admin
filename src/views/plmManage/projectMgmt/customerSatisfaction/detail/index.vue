<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="60px">序号</td>
        <td class="slash">
          <span style="position: absolute; left: 6px; bottom: 4px; z-index: 1; color: #666">调查内容</span>
          <span style="position: absolute; right: 6px; top: 4px; z-index: 1; color: #666">满意程度</span>
        </td>
        <td class="head-col">非常满意<br />100分-90分</td>
        <td class="head-col">满意<br />90分-80分</td>
        <td class="head-col">一般满意<br />80分-70分</td>
        <td class="head-col">不满意<br />70分-60分</td>
        <td class="head-col">非常不满意<br />60分以下</td>
      </tr>
      <tr v-for="(item, idx) in scoreDataList" :key="idx">
        <td class="head-col">{{ idx + 1 }}</td>
        <td class="head-col">
          {{ item.content }}
        </td>
        <td>
          <el-input placeholder=" " v-model="item.verySatisfied" />
        </td>
        <td><el-input placeholder=" " v-model="item.satisfied" /></td>
        <td><el-input placeholder=" " v-model="item.generalSatisfied" /></td>
        <td><el-input placeholder=" " v-model="item.notSatisfied" /></td>
        <td><el-input placeholder=" " v-model="item.veryDissatisfied" /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">补充内容</td>
        <td class="head-col" colspan="5">内容描述 (尽量举例说明)</td>
      </tr>
      <tr v-for="(item, idx) in extraDataList" :key="idx">
        <td class="head-col" colspan="2">{{ item.extraContent }}</td>
        <td class="head-col" colspan="5"><el-input v-model="item.desc" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";

const scoreDataList = ref([
  { content: "新项目开发周期", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: "新项目功能实现能力（产口外观&性能）", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: "测试标准&报告精度", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: " 资料作成", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: "样品组装（交付日程、品质）", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: " 旧项目对应(换IC、资料补充等）", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" },
  { content: "", verySatisfied: "", satisfied: "", generalSatisfied: "", notSatisfied: "", veryDissatisfied: "" }
]);

const extraDataList = ref([
  { extraContent: "最不满意内容", desc: "" },
  { extraContent: "最满意内容", desc: "" },
  { extraContent: "其它", desc: "" }
]);

defineExpose({ scoreDataList, extraDataList });
</script>

<style scoped lang="scss">
.slash {
  width: 140px;
  height: 50px;
  background-color: #000;
  position: relative;
  padding: 0 !important;
}

.slash::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  clip-path: polygon(0px 0.5px, 0px 100%, calc(100% - 0.5px) calc(100% + 0.5px));
  position: absolute;
  top: 0;
}

.slash::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  clip-path: polygon(100% calc(100% - 0.5px), 100% 0px, 0px -0.5px);
  position: absolute;
  top: 0;
}
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .line-txt {
      font-weight: 700;
      padding: 6px;
    }

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td,
    th {
      border: 1px solid #000;
      padding: 4px 8px;
    }
  }
}
</style>
