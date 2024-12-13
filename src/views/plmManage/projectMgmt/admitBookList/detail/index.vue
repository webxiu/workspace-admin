<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="60px">序号</td>
        <td class="head-col">文件编号</td>
        <td class="head-col">物料名称</td>
        <td class="head-col" width="140px">受控日期</td>
        <td class="head-col">电子扫描档</td>
        <td class="head-col">备注</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td><el-input placeholder=" " v-model="item.fileNo" /></td>
        <td><el-input placeholder=" " v-model="item.materialName" /></td>
        <td>
          <el-date-picker
            v-model="item.controlDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td><el-input placeholder=" " v-model="item.electronDoc" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";

const dataListConfig = reactive([]);

for (let i = 0; i < 16; i++) {
  dataListConfig.push({
    fileNo: "",
    materialName: "",
    controlDate: "",
    electronDoc: "",
    remark: ""
  });
}
const dataList = ref(dataListConfig);

defineExpose({ dataList });
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
