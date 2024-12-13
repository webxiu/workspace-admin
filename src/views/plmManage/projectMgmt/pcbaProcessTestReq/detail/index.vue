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
        <td class="head-col">日期</td>
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
        <td class="head-col" width="80px">规格</td>
        <td colspan="3">
          <el-input v-model="formData.specs" autosize type="textarea" placeholder=" " />
        </td>
        <td class="head-col">电压</td>
        <td><el-input placeholder=" " v-model="formData.voltage" /></td>
      </tr>
    </table>
    <table>
      <tr>
        <td colspan="5" class="head-bd">产品功能描述及PCBA图</td>
      </tr>
      <tr>
        <td class="head-col" width="60px">序号</td>
        <td class="head-col" width="100px">项目</td>
        <td class="head-col" width="550px">标准</td>
        <td class="head-col" colspan="2">测试方法</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td class="head-col" :rowspan="dataList.length" v-if="idx === 0">{{ idx + 1 }}</td>
        <td class="head-col" :rowspan="dataList.length" v-if="idx === 0">{{ item.title }}</td>
        <td class="head-col"><el-input v-model="item.standard" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" :rowspan="2" v-if="idx === 0">生产部全检</td>
        <td class="head-col" :rowspan="6" v-if="idx === 2">生产部全检</td>
        <td class="head-col" :rowspan="dataList.length" v-if="idx === 0">品质部抽检</td>
      </tr>
    </table>
    <table class="tb-2">
      <tr v-for="(item, idx) in dataList2" :key="idx">
        <td :class="idx === 0 ? 'head-bd' : ''" class="head-col" width="60px" :rowspan="dataList2.length" v-if="idx === 0">{{ idx + 2 }}</td>
        <td :class="idx === 0 ? 'head-bd' : ''" class="head-col" width="100px" :rowspan="dataList2.length" v-if="idx === 0">{{ item.title }}</td>
        <td :class="idx === 0 ? 'head-bd' : ''" width="440px" colspan="2" :rowspan="dataList2.length" v-if="idx === 0">
          <div style="margin-bottom: 48px">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="item.files">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
          <div>
            <div>✔所有元器件必须贴平 PCB，且不能用超出丝印范围、歪、浮高、烫坏等不良现象。</div>
            <div>✔所有引线的焊孔无堵塞现象。</div>
            <div>✔所有焊点应光滑饱满，无漏焊、假焊、堆焊、薄焊、连锡。</div>
            <div>✔所有元件均需严格按照《BOM 表》焊接，不得随意更改、代换。</div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { Plus } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

const initData = [];
for (let i = 0; i < 8; i++) initData.push({ isFile: false, title: "功能测试", standard: "" });

const initData2 = [];
for (let i = 0; i < 8; i++) initData2.push({ isFile: true, title: "PCBA特殊要求元件图", files: [] });

const formData: any = reactive({});

const dataList = ref(initData);
const dataList2 = ref(initData2);

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData, dataList, dataList2 });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

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
