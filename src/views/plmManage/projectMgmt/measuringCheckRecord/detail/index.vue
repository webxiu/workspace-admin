<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="10">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <div>设备名称：</div>
              <div><el-input size="small" placeholder=" " v-model="formData.deviceName" /></div>
            </div>
            <div style="display: flex; align-items: center">
              <div>设备编号：</div>
              <div><el-input size="small" placeholder=" " v-model="formData.deviceNo" /></div>
            </div>
            <div style="display: flex; align-items: center">
              <div>计量单位：</div>
              <div>
                <el-select size="small" v-model="formData.unit" placeholder="请选择">
                  <el-option v-for="item in unitOpts" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
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
        <td class="head-col" width="60px">周别</td>
        <td class="head-col" width="60px">检查项目</td>
        <td class="head-col">标准值</td>
        <td class="head-col">实测值</td>
        <td class="head-col">误差值</td>
        <td class="head-col">判定结果</td>
        <td class="head-col">检查日期</td>
        <td class="head-col">检查人</td>
        <td class="head-col">确认人</td>
        <td class="head-col">备注</td>
      </tr>
      <tr v-for="(item, idx) in weekList1" :key="idx">
        <td class="head-col" rowspan="3" v-if="idx === 0">{{ item.weekName }}</td>
        <td class="head-col">{{ item.checkItem }}</td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.standardVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.actVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.errorVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.result" /></td>
        <td width="100px" rowspan="3" v-if="idx === 0">
          <el-date-picker
            size="small"
            v-model="item.checkDate"
            :clearable="false"
            type="date"
            style="width: 100%"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.checkUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.confirmUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="200px"><el-input size="small" placeholder=" " v-model="item.remark" /></td>
      </tr>
      <tr v-for="(item, idx) in weekList2" :key="idx">
        <td class="head-col" rowspan="3" v-if="idx === 0">{{ item.weekName }}</td>
        <td class="head-col">{{ item.checkItem }}</td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.standardVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.actVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.errorVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.result" /></td>
        <td width="100px" rowspan="3" v-if="idx === 0">
          <el-date-picker
            size="small"
            v-model="item.checkDate"
            :clearable="false"
            type="date"
            style="width: 100%"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.checkUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.confirmUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="200px"><el-input size="small" placeholder=" " v-model="item.remark" /></td>
      </tr>
      <tr v-for="(item, idx) in weekList3" :key="idx">
        <td class="head-col" rowspan="3" v-if="idx === 0">{{ item.weekName }}</td>
        <td class="head-col">{{ item.checkItem }}</td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.standardVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.actVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.errorVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.result" /></td>
        <td width="100px" rowspan="3" v-if="idx === 0">
          <el-date-picker
            size="small"
            v-model="item.checkDate"
            :clearable="false"
            type="date"
            style="width: 100%"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.checkUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.confirmUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="200px"><el-input size="small" placeholder=" " v-model="item.remark" /></td>
      </tr>
      <tr v-for="(item, idx) in weekList4" :key="idx">
        <td class="head-col" rowspan="3" v-if="idx === 0">{{ item.weekName }}</td>
        <td class="head-col">{{ item.checkItem }}</td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.standardVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.actVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.errorVal" /></td>
        <td width="140px"><el-input size="small" placeholder=" " v-model="item.result" /></td>
        <td width="100px" rowspan="3" v-if="idx === 0">
          <el-date-picker
            size="small"
            v-model="item.checkDate"
            :clearable="false"
            type="date"
            style="width: 100%"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.checkUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="70px"><el-input size="small" placeholder=" " v-model="item.confirmUserName" /></td>
        <td rowspan="3" v-if="idx === 0" width="200px"><el-input size="small" placeholder=" " v-model="item.remark" /></td>
      </tr>
      <tr>
        <td class="head-col">备注</td>
        <td colspan="9">
          <span
            >机台操作人员每周一早上 8：00-8：30 使用 101.2mm 量块检查 X、Y、Z 轴示值误差，具体长度随 测量需求可调整，测量误差不超过标准值±0.01mm
            为合格，并将结果记录在《量具（仪器）定期 检查记录表》内。</span
          >
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { reactive, ref } from "vue";

const unitOpts = ref([
  { label: "测试单位一", value: "测试单位一" },
  { label: "测试单位二", value: "测试单位二" }
]);
const weekList1 = ref([
  {
    weekName: "第一周",
    checkItem: "X",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第一周",
    checkItem: "Y",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第一周",
    checkItem: "Z",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  }
]);
const weekList2 = ref([
  {
    weekName: "第二周",
    checkItem: "X",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第二周",
    checkItem: "Y",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第二周",
    checkItem: "Z",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  }
]);
const weekList3 = ref([
  {
    weekName: "第三周",
    checkItem: "X",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第三周",
    checkItem: "Y",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第三周",
    checkItem: "Z",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  }
]);
const weekList4 = ref([
  {
    weekName: "第四周",
    checkItem: "X",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第四周",
    checkItem: "Y",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  },
  {
    weekName: "第四周",
    checkItem: "Z",
    standardVal: "",
    actVal: "",
    errorVal: "",
    result: "",
    checkDate: "",
    checkUserName: "",
    confirmUserName: "",
    remark: ""
  }
]);
const formData: any = reactive({
  date: dayjs().format("YYYY-MM-DD")
});

defineExpose({ formData, weekList1, weekList2, weekList3, weekList4 });
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
