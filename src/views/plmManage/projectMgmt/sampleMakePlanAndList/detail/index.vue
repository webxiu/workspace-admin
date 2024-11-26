<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="fw head-col" width="60px" align="center">序号</td>
        <td class="fw head-col">机型</td>
        <td class="fw head-col">数量</td>
        <td class="fw head-col">国家</td>
        <td class="fw head-col">规格明细</td>
        <td class="fw head-col">跟单人</td>
        <td class="fw head-col">下单日期</td>
        <td class="fw head-col">要求完成日期</td>
        <td class="fw head-col">计划完成日期</td>
        <td class="fw head-col">实际完成日期</td>
        <td class="fw head-col">备注（原因）</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td width="200px">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="sampleModel"
            v-model="item.sampleModel"
            readonly
            showButton
            @select="(val) => onSelect(val, item)"
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
        <td width="100px">
          <el-input-number :controls="false" style="width: 100%" v-model="item.amount" />
        </td>
        <td width="140px">
          <!-- <el-input placeholder=" " v-model="item.country" /> -->
          <el-select v-model="item.country" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in countryOpts" :key="item.value" :label="item.optionName" :value="item.optionValue" />
          </el-select>
        </td>
        <td width="400px"><el-input v-model="item.specs" autosize type="textarea" placeholder=" " /></td>
        <td width="110px"><el-input placeholder=" " v-model="item.followUserName" /></td>
        <td width="140px">
          <el-date-picker
            style="width: 100%"
            v-model="item.orderDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td width="140px">
          <el-date-picker
            style="width: 100%"
            v-model="item.reqFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td width="140px">
          <el-date-picker
            style="width: 100%"
            v-model="item.planFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td width="140px">
          <el-date-picker
            style="width: 100%"
            v-model="item.actualFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { getEnumDictList } from "@/utils/table";

const dataListConfig = reactive([]);
const countryOpts = ref([]);

for (let i = 0; i < 7; i++) {
  dataListConfig.push({
    sampleModel: "",
    amount: 0,
    country: "",
    specs: "",
    followUserName: "",
    orderDate: "",
    reqFinishDate: "",
    planFinishDate: "",
    actualFinishDate: "",
    remark: ""
  });
}
const dataList = ref(dataListConfig);

const onSelect = (val, item) => {
  item.sampleModel = val.productCode;
};

onMounted(() => {
  getEnumDictList(["CountryCode"]).then((res) => {
    if (res) {
      countryOpts.value = res["CountryCode"];
    }
  });
});

defineExpose({ dataList });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .line-txt {
      font-weight: 700;
      padding: 6px;
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
      border: 1px solid #000;
      padding: 4px 8px;
    }
  }
}
</style>
