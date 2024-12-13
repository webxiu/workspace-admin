<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="80px">产品型号</td>
        <td>
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="sampleModel"
            v-model="formData.productModel"
            readonly
            showButton
            @select="onSelect"
            :componentProp="{
              searchConfig: [{ label: '产品型号', value: 'productCode' }],
              maxHeight: 520,
              columns: [
                { label: '产品型号', prop: 'productCode', headerAlign: 'center' },
                { label: '产品类别', prop: 'productType', headerAlign: 'center' }
              ],
              api: fetchProductStoreList
            }"
          />
        </td>
        <td class="head-col">产品名称</td>
        <td><el-input placeholder=" " v-model="formData.productName" /></td>
        <td class="head-col">样机数量</td>
        <td><el-input-number :controls="false" class="ui-w-100" v-model="formData.sampleNum" /></td>
      </tr>
      <tr>
        <td class="head-col" width="80px">样机类型</td>
        <td>
          <el-checkbox-group v-model="formData.sampleType" @change="changeGroup1">
            <el-checkbox v-for="el in sampleTypeOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
        <td class="head-col">电压及频率</td>
        <td><el-input placeholder=" " v-model="formData.voltageAndFrequency" /></td>
        <td class="head-col">交付日期</td>
        <td>
          <el-date-picker
            v-model="formData.deliveryDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <td colspan="5" class="head-bd"><div style="height: 32px" /></td>
      </tr>
      <tr>
        <td class="head-col" width="80px">检验项目</td>
        <td class="head-col" width="260px">测试项目</td>
        <td class="head-col">测试结果</td>
        <td class="head-col" width="160px">确认人</td>
        <td class="head-col" width="460px">备注</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td :rowspan="2" v-if="idx === 0" class="head-col">{{ item.checkItem }}</td>
        <td>{{ item.testItem }}</td>
        <td>
          <el-checkbox-group v-model="item.testResult" @change="() => changeGroupCom(idx, '1')">
            <el-checkbox v-for="el in testResultOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
        <td><el-input placeholder=" " v-model="item.confirmUserName" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>

      <tr v-for="(item, idx) in dataList2" :key="idx">
        <td :rowspan="7" v-if="idx === 0" class="head-col">{{ item.checkItem }}</td>
        <td>{{ item.testItem }}</td>
        <td>
          <el-checkbox-group v-model="item.testResult" @change="() => changeGroupCom(idx, '2')">
            <el-checkbox v-for="el in testResultOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
        <td><el-input placeholder=" " v-model="item.confirmUserName" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>

      <tr v-for="(item, idx) in dataList3" :key="idx">
        <td :rowspan="2" v-if="idx === 0" class="head-col">{{ item.checkItem }}</td>
        <td>{{ item.testItem }}</td>
        <td>
          <el-checkbox-group v-model="item.testResult" @change="() => changeGroupCom(idx, '3')">
            <el-checkbox v-for="el in testResultOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
        <td><el-input placeholder=" " v-model="item.confirmUserName" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>

      <tr v-for="(item, idx) in dataList4" :key="idx">
        <td :rowspan="2" v-if="idx === 0" class="head-col">{{ item.checkItem }}</td>
        <td>{{ item.testItem }}</td>
        <td>
          <el-checkbox-group v-model="item.testResult" @change="() => changeGroupCom(idx, '4')">
            <el-checkbox v-for="el in testResultOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
        <td><el-input placeholder=" " v-model="item.confirmUserName" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td colspan="5"><div style="height: 16px" /></td>
      </tr>
      <tr>
        <td class="head-col">结论</td>
        <td colspan="4"><el-input v-model="formData.conclusion" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

const formData: any = reactive({});

const changeGroupCom = (idx, key) => {
  if (key === "1") {
    if (dataList.value[idx].testResult.length > 1) {
      dataList.value[idx].testResult.splice(0, 1);
    }
  } else if (key === "2") {
    if (dataList2.value[idx].testResult.length > 1) {
      dataList2.value[idx].testResult.splice(0, 1);
    }
  } else if (key === "3") {
    if (dataList3.value[idx].testResult.length > 1) {
      dataList3.value[idx].testResult.splice(0, 1);
    }
  } else if (key === "4") {
    if (dataList4.value[idx].testResult.length > 1) {
      dataList4.value[idx].testResult.splice(0, 1);
    }
  }
};

const sampleTypeOpts = ref([
  { label: "类型一", value: 1 },
  { label: "类型二", value: 2 }
]);
const testResultOpts = ref([
  { label: "OK", value: "OK" },
  { label: "NG", value: "NG" }
]);

const dataList = ref([
  { checkItem: "安全检验", testItem: "绝缘测试", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "安全检验", testItem: "耐压测试", testResult: [], confirmUserName: "", remark: "" }
]);
const dataList2 = ref([
  { checkItem: "功能检验", testItem: "功率检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "风速检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "风温检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "风压检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "噪音检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "转速检验", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "功能检验", testItem: "传导检验", testResult: [], confirmUserName: "", remark: "" }
]);
const dataList3 = ref([
  { checkItem: "结构确认", testItem: "结构件", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "结构确认", testItem: "电子", testResult: [], confirmUserName: "", remark: "" }
]);
const dataList4 = ref([
  { checkItem: "外观确认", testItem: "丝印/镭雕", testResult: [], confirmUserName: "", remark: "" },
  { checkItem: "外观确认", testItem: "喷涂/电镀", testResult: [], confirmUserName: "", remark: "" }
]);

const changeGroup1 = () => {
  if (formData.sampleType.length > 1) {
    formData.sampleType.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData, dataList: [...dataList.value, ...dataList2.value, ...dataList3.value, ...dataList4.value] });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .top-h {
      border-top: 0 !important;
    }

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

  .head-bd {
    border-top: 0;
  }
}
</style>
