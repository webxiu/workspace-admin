<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="10">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <div>仪器、设备名称：</div>
              <div><el-input size="small" placeholder=" " v-model="formData.deviceName" /></div>
            </div>
            <div style="display: flex; align-items: center">
              <div>编号：</div>
              <div><el-input size="small" placeholder=" " v-model="formData.deviceNo" /></div>
            </div>
            <div style="display: flex; align-items: center">
              <div>日期：</div>
              <div>
                <el-date-picker
                  size="small"
                  v-model="formData.date"
                  :clearable="false"
                  type="date"
                  disabled
                  placeholder="请选择"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="head-col" rowspan="2" width="50px">日期</td>
        <td class="head-col" rowspan="2">时间</td>
        <td class="head-col" colspan="2">使用环境</td>
        <td class="head-col" colspan="3" rowspan="2" width="500px">使用性能状态检查</td>
        <td class="head-col" rowspan="2">使用人</td>
        <td class="head-col" rowspan="2" width="300px">备注</td>
      </tr>
      <tr>
        <td class="head-col">温度</td>
        <td class="head-col">湿度</td>
      </tr>

      <tr v-for="(item, idx) in dataList" :key="idx">
        <td class="head-col" width="50px">{{ item.dateNo }}</td>
        <td class="head-col">
          <el-input placeholder=" " v-model="item.time" />
        </td>
        <td class="head-col">
          <el-input placeholder=" " v-model="item.temperature" />
        </td>
        <td class="head-col">
          <el-input placeholder=" " v-model="item.humidity" />
        </td>
        <td class="head-col" colspan="3">
          <el-input placeholder=" " v-model="item.usePerformance" />
        </td>
        <td class="head-col">
          <el-input placeholder=" " v-model="item.useUserName" />
        </td>
        <td class="head-col">
          <el-input placeholder=" " v-model="item.remark" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { reactive, ref } from "vue";

const initConfigList = [];

for (let i = 0; i < 31; i++) {
  initConfigList.push({
    dateNo: i + 1,
    time: "",
    temperature: "",
    humidity: "",
    usePerformance: "",
    useUserName: "",
    remark: ""
  });
}

const dataList = ref(initConfigList);
const formData: any = reactive({
  date: dayjs().format("YYYY-MM-DD")
});

defineExpose({ formData, dataList });
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
