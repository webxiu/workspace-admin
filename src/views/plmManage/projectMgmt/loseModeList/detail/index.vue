<!-- 失效模式清单示例代码 -->
<template>
  <div class="effect-detail">
    <table>
      <tr>
        <th class="head-col">序号</th>
        <th class="head-col">项目/功能</th>
        <th class="head-col">潜在失效模式</th>
        <th class="head-col">潜在失效模式后果</th>
        <th class="head-col">严重度</th>
        <th class="head-col">分类</th>
        <th class="head-col">潜在失效原因</th>
        <th class="head-col">预防措施</th>
        <th class="head-col">建议措施</th>
        <th class="head-col">确认结果</th>
        <th class="head-col">责任人/完成时间</th>
      </tr>
      <tr v-for="(item, idx) in tableConfList" :key="idx">
        <td align="center" width="60px">{{ idx + 1 }}</td>
        <td>{{ item.itemAndFeature }}</td>
        <td>
          <div v-for="el in item.loseMode" :key="el">{{ el }}</div>
        </td>
        <td>
          <div v-for="el in item.loseModeResult" :key="el">{{ el }}</div>
        </td>
        <td align="center" width="65px">{{ item.severity }}</td>
        <td align="center" width="60px">{{ item.classification }}</td>
        <td>
          <div v-for="el in item.failureReason" :key="el">{{ el }}</div>
        </td>
        <td>
          <div v-for="el in item.prevention" :key="el">{{ el }}</div>
        </td>
        <td>
          <el-input v-model="item.recommendedAction" autosize type="textarea" placeholder=" " />
        </td>
        <td>
          <el-input v-model="item.confirmResult" autosize type="textarea" placeholder=" " />
        </td>
        <td><el-input v-model="item.resUserAndFinishDate" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import { loseDataList } from "./config";

const tableConfList = ref(loseDataList);

defineExpose({ tableConfList });
</script>

<style scoped lang="scss">
.effect-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .head-col {
      color: #000;
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td {
      font-size: 12px;
    }

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
