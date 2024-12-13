<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col">产品型号</td>
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
        <td class="head-col">产品等级</td>
        <td>
          <el-checkbox-group v-model="formData.productLevel" @change="productLevelChange">
            <el-checkbox v-for="item in productLevelOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="head-col">样机类型</td>
        <td>
          <el-input placeholder=" " v-model="formData.sampleType" />
        </td>
        <td class="head-col">样机数量</td>
        <td><el-input-number class="ui-w-100" :controls="false" v-model="formData.sampleNum" /></td>
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
      <tr>
        <td colspan="6">
          <div style="height: 16px" />
        </td>
      </tr>
      <tr>
        <td colspan="6">样机问题点总结</td>
      </tr>
      <tr v-for="(item, idx) in appearanceList" :key="idx">
        <td :rowspan="appearanceList.length" v-if="idx === 0" class="head-col">{{ item.title }}</td>
        <td :colspan="4">
          <el-input v-model="item.desc" autosize type="textarea" placeholder=" " />
        </td>
        <td>
          <el-checkbox-group v-model="item.checked" @change="() => commonCheck(idx, '1')">
            <el-checkbox v-for="item in checkOpts" :key="item.value" :label="item.label" :value="item.value" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr v-for="(item, idx) in funcList" :key="idx">
        <td :rowspan="funcList.length" v-if="idx === 0" class="head-col">{{ item.title }}</td>
        <td :colspan="4">
          <el-input v-model="item.desc" autosize type="textarea" placeholder=" " />
        </td>
        <td>
          <el-checkbox-group v-model="item.checked" @change="() => commonCheck(idx, '2')">
            <el-checkbox v-for="item in checkOpts" :key="item.value" :label="item.label" :value="item.value" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr v-for="(item, idx) in performanceList" :key="idx">
        <td :rowspan="performanceList.length" v-if="idx === 0" class="head-col">{{ item.title }}</td>
        <td :colspan="4">
          <el-input v-model="item.desc" autosize type="textarea" placeholder=" " />
        </td>
        <td>
          <el-checkbox-group v-model="item.checked" @change="() => commonCheck(idx, '3')">
            <el-checkbox v-for="item in checkOpts" :key="item.value" :label="item.label" :value="item.value" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="height: 16px" />
        </td>
      </tr>
      <tr v-for="(item, idx) in resultList" :key="idx">
        <td class="head-col">{{ item.title }}</td>
        <td :colspan="5">
          <el-input v-model="item.desc" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import { getEnumDictList } from "@/utils/table";

const formData: any = reactive({});
const productLevelOpts = ref([]);
const checkOpts = ref([
  { label: "保持现状", value: "保持现状" },
  { label: "后续改善", value: "后续改善" }
]);
const appearanceList = ref([
  { title: "外观", desc: "", checked: [] },
  { title: "外观", desc: "", checked: [] },
  { title: "外观", desc: "", checked: [] },
  { title: "外观", desc: "", checked: [] },
  { title: "外观", desc: "", checked: [] }
]);

const funcList = ref([
  { title: "功能", desc: "", checked: [] },
  { title: "功能", desc: "", checked: [] },
  { title: "功能", desc: "", checked: [] },
  { title: "功能", desc: "", checked: [] },
  { title: "功能", desc: "", checked: [] }
]);

const performanceList = ref([
  { title: "性能", desc: "", checked: [] },
  { title: "性能", desc: "", checked: [] },
  { title: "性能", desc: "", checked: [] },
  { title: "性能", desc: "", checked: [] },
  { title: "性能", desc: "", checked: [] }
]);

const resultList = ref([{ title: "结论", desc: "" }]);

const productLevelChange = () => {
  if (formData.productLevel.length > 1) {
    formData.productLevel.splice(0, 1);
  }
};

const commonCheck = (idx, key) => {
  if (key === "1") {
    if (appearanceList.value[idx].checked.length > 1) {
      appearanceList.value[idx].checked.splice(0, 1);
    }
  } else if (key === "2") {
    if (funcList.value[idx].checked.length > 1) {
      funcList.value[idx].checked.splice(0, 1);
    }
  } else if (key === "3") {
    if (performanceList.value[idx].checked.length > 1) {
      performanceList.value[idx].checked.splice(0, 1);
    }
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

onMounted(() => {
  getEnumDictList(["DR0ProductLevel"]).then((res) => {
    if (res) {
      productLevelOpts.value = res["DR0ProductLevel"];
    }
  });
});

defineExpose({ formData, appearanceList, funcList, performanceList, resultList });
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
}
</style>
