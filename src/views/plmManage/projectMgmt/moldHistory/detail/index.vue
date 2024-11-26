<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="90px">产品型号</td>
        <td width="180px">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
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
        <td class="head-col" width="90px">产品名称</td>
        <td width="180px"><el-input v-model="formData.productName" placeholder=" " /></td>
        <td class="head-col">作成</td>
        <td class="head-col">检查</td>
        <td class="head-col">确认</td>
      </tr>
      <tr>
        <td class="head-col">模具编号</td>
        <td><el-input v-model="formData.moldNo" placeholder=" " /></td>
        <td class="head-col">模具型腔数</td>
        <td><el-input v-model="formData.moldThoraxNum" placeholder=" " /></td>
        <td width="120px" :rowspan="4" style="vertical-align: top">
          <el-input v-model="formData.makeDone" :autosize="{ minRows: 8 }" type="textarea" placeholder=" " />
        </td>
        <td width="120px" :rowspan="4" style="vertical-align: top">
          <el-input v-model="formData.check" :autosize="{ minRows: 8 }" type="textarea" placeholder=" " />
        </td>
        <td width="120px" :rowspan="9" style="vertical-align: top">
          <el-input v-model="formData.confirm" :autosize="{ minRows: 8 }" type="textarea" placeholder=" " />
        </td>
      </tr>
      <tr>
        <td class="head-col">前模芯材料</td>
        <td><el-input v-model="formData.beforeMaterial" placeholder=" " /></td>
        <td class="head-col">后模芯材料</td>
        <td><el-input v-model="formData.afterMaterial" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col">塑胶原料</td>
        <td><el-input v-model="formData.plastic" placeholder=" " /></td>
        <td class="head-col">缩水率</td>
        <td><el-input v-model="formData.shrinkRate" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col">零件名称</td>
        <td><el-input v-model="formData.partName" placeholder=" " /></td>
        <td class="head-col">产品表面要求</td>
        <td><el-input v-model="formData.surfaceReq" placeholder=" " /></td>
      </tr>
    </table>
    <table style="margin-top: 8px">
      <tr>
        <td class="head-col" width="40px">阶段</td>
        <td class="head-col" :colspan="3">修改、变更履历</td>
        <td class="head-col">时间</td>
        <td class="head-col">责任单位</td>
        <td class="head-col" :colspan="2">对 策</td>
        <td class="head-col">改善确认</td>
      </tr>
      <template v-for="(item, idx) in dataList" :key="idx">
        <tr v-for="(el, index) in item" :key="index">
          <td v-if="index === 0" :rowspan="item.length" align="center">{{ el.stage }}</td>
          <td :colspan="3"><el-input v-model="el.editHistory" autosize type="textarea" placeholder=" " /></td>
          <td width="160px">
            <el-date-picker
              v-model="el.historyTime"
              :clearable="false"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </td>
          <td width="160px">
            <el-input v-model="el.resPlace" placeholder=" " />
          </td>
          <td :colspan="2"><el-input v-model="el.countermeasure" autosize type="textarea" placeholder=" " /></td>
          <td width="160px">
            <el-input v-model="el.improveAndConfirm" placeholder=" " />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

const dataList = ref([
  [
    { stage: "T1\nDR1", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T1\nDR1", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T1\nDR1", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" }
  ],
  [
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T2\nPR", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" }
  ],
  [
    { stage: "T3\nPP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T3\nPP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T3\nPP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" }
  ],
  [
    { stage: "T4\nMP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T4\nMP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "T4\nMP", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" }
  ],
  [
    { stage: "模具\n维护", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "模具\n维护", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "模具\n维护", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" },
    { stage: "模具\n维护", editHistory: "", historyTime: "", resPlace: "", countermeasure: "", improveAndConfirm: "" }
  ]
]);

const formData: any = reactive({
  productModel: "",
  productName: ""
});

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
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
      border: 1px solid #000;
      padding: 4px 8px;
    }
  }
}
</style>
