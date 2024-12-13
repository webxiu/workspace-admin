<template>
  <div class="trial-detail">
    <table>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td class="head-col" width="20px">{{ idx > 0 ? idx : "序号" }}</td>
        <td v-if="idx !== 5" class="head-col" width="40px" :rowspan="idx === 4 ? 2 : 1">{{ item.title }}</td>
        <td class="head-col" width="90px">
          <HxModalInput
            title="选择产品"
            v-if="idx === 0"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="item.model1"
            readonly
            showButton
            @select="(val) => onSelect1(val, idx)"
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
          <el-input v-else placeholder=" " v-model="item.model1" />
        </td>
        <td class="head-col" width="90px">
          <HxModalInput
            title="选择产品"
            v-if="idx === 0"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="item.model2"
            readonly
            showButton
            @select="(val) => onSelect2(val, idx)"
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
          <el-input v-else placeholder=" " v-model="item.model1" />
        </td>
        <td class="head-col" width="90px">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="item.model3"
            v-if="idx === 0"
            readonly
            showButton
            @select="(val) => onSelect3(val, idx)"
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
          <el-input v-else placeholder=" " v-model="item.model1" />
        </td>
        <td class="head-col" width="90px">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="item.model4"
            readonly
            v-if="idx === 0"
            showButton
            @select="(val) => onSelect4(val, idx)"
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
          <el-input v-else placeholder=" " v-model="item.model1" />
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div>
            <div>备注：</div>
            <div><el-input v-model="formData.remark" :autosize="{ minRows: 2 }" type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px">分发部门：</div>
            <div>
              <el-checkbox-group v-model="formData.dispatchDeptList" @change="changeGroup">
                <el-checkbox label="采购部" value="采购部" />
                <el-checkbox label="工程部" value="工程部" />
                <el-checkbox label="物控部" value="物控部" />
                <el-checkbox label="品质部" value="品质部" />
                <el-checkbox label="敬孚" value="敬孚" />
              </el-checkbox-group>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";

const dataList = ref([
  { title: "产品型号", model1: "", model2: "", model3: "", model4: "" },
  { title: "电压", model1: "", model2: "", model3: "", model4: "" },
  { title: "电源线", model1: "", model2: "", model3: "", model4: "" },
  { title: "发热方式", model1: "", model2: "", model3: "", model4: "" },
  { title: "PCBA板", model1: "", model2: "", model3: "", model4: "" },
  { title: "PCBA板", model1: "", model2: "", model3: "", model4: "" },
  { title: "检验码", model1: "", model2: "", model3: "", model4: "" },
  { title: "大身", model1: "", model2: "", model3: "", model4: "" },
  { title: "铝板", model1: "", model2: "", model3: "", model4: "" }
]);

const formData: any = reactive({
  productModel: "",
  productName: ""
});

const changeGroup = () => {
  if (formData.dispatchDeptList.length > 1) {
    formData.dispatchDeptList.splice(0, 1);
  }
};

const onSelect1 = (val, idx) => {
  dataList.value[idx].model1 = val.productCode;
};
const onSelect2 = (val, idx) => {
  dataList.value[idx].model2 = val.productCode;
};
const onSelect3 = (val, idx) => {
  dataList.value[idx].model3 = val.productCode;
};
const onSelect4 = (val, idx) => {
  dataList.value[idx].model4 = val.productCode;
};

defineExpose({ formData, dataList });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
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
