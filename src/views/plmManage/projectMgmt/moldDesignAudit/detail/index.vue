<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="5" style="border: none">
          <div style="display: flex; align-items: center">
            <div style="display: flex; align-items: center; width: 33%">
              <div>模号：</div>
              <div><el-input size="small" v-model="formData.modelNum" placeholder=" " /></div>
            </div>
            <div style="display: flex; align-items: center; width: 33%">
              <div>产品编号：</div>
              <div>
                <HxModalInput
                  title="选择产品"
                  placeholder="请选择产品"
                  valueKey="productNo"
                  v-model="formData.productNo"
                  readonly
                  size="small"
                  showButton
                  @select="onSelect"
                  showModel="product"
                />
              </div>
            </div>
            <div style="display: flex; align-items: center; width: 33%">
              <div>日期：</div>
              <div>
                <el-date-picker
                  size="small"
                  v-model="formData.date"
                  :clearable="false"
                  type="date"
                  placeholder="请选择"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>检查项目</td>
        <td>序号</td>
        <td>检查内容</td>
        <td>工程师自检</td>
        <td>结构评审</td>
      </tr>
      <template v-for="(item, index) in dataList" :key="index">
        <tr v-if="!item.children.length">
          <td colspan="5">{{ item.groupName }}</td>
        </tr>
        <template v-else>
          <tr v-for="(el, idx) in item.children" :key="idx">
            <td :rowspan="item.children.length" v-if="idx < 1">{{ el.checkItem }}</td>
            <td width="50px">{{ el.seq }}</td>
            <td>{{ el.checkContent }}</td>
            <td style="min-width: 200px">
              <el-input size="small" v-model="el.userCheckSelf" placeholder=" " />
            </td>
            <td style="min-width: 200px">
              <el-input size="small" v-model="el.buildAudit" placeholder=" " />
            </td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { dataListConfig } from "./moldDesignConfig";

const formData: any = reactive({});
const dataList = ref(dataListConfig);

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productNo = val.productCode;
};

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

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
