<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="100px">项目编号</td>
        <td><el-input placeholder=" " v-model="formData.projectNo" /></td>
        <td class="head-col">项目名称</td>
        <td><el-input placeholder=" " v-model="formData.projectName" /></td>
        <td class="head-col">产品名称</td>
        <td><el-input placeholder=" " v-model="formData.productName" /></td>
        <td class="head-col">图纸编号</td>
        <td><el-input placeholder=" " v-model="formData.drawNo" /></td>
        <td class="head-col">客户</td>
        <td><el-input placeholder=" " v-model="formData.customer" /></td>
        <td class="head-col">日期</td>
        <td>
          <el-date-picker
            v-model="formData.date"
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
        <td colspan="12"><div style="height: 24px" /></td>
      </tr>
    </table>
    <table>
      <tr>
        <td class="head-col head-bd" v-for="(item, idx) in cols" :key="idx">{{ item }}</td>
      </tr>
      <tr v-for="(el, index) in dataList" :key="index">
        <td class="head-col">{{ index + 1 }}</td>
        <td class="head-col"><el-input placeholder=" " v-model="el.theoryVal" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.topPublic" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.bottomPublic" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.fixTheoryVal" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.fixTopPublic" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.fixBottomPublic" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.averageVal" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.standardOffset" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.cpk" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO1" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO2" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO3" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO4" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO5" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO6" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO7" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO8" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO9" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.NO10" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.upperSize" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.lowerSize" /></td>
        <td class="head-col"><el-input placeholder=" " v-model="el.determine" /></td>
      </tr>
      <tr>
        <td colspan="23">
          <div>添附图片</div>
          <div>
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="formData.files">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { Plus } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";

const cols = [
  "序号",
  "理论值",
  "上公差",
  "下公差",
  "(修正)理论值",
  "(修正)上公差",
  "(修正)下公差",
  "平均值",
  "标准偏差",
  "CPK",
  "NO1",
  "NO2",
  "NO3",
  "NO4",
  "NO5",
  "NO6",
  "NO7",
  "NO8",
  "NO9",
  "NO10",
  "上限尺寸",
  "下限尺寸",
  "判定"
];
const dataList = ref([]);

for (let i = 0; i < 22; i++)
  dataList.value.push({
    theoryVal: "",
    topPublic: "",
    bottomPublic: "",
    fixTheoryVal: "",
    fixTopPublic: "",
    fixBottomPublic: "",
    averageVal: "",
    standardOffset: "",
    cpk: "",
    NO1: "",
    NO2: "",
    NO3: "",
    NO4: "",
    NO5: "",
    NO6: "",
    NO7: "",
    NO8: "",
    NO9: "",
    NO10: "",
    upperSize: "",
    lowerSize: "",
    determine: ""
  });

const formData: any = reactive({});

defineExpose({ formData, dataList });
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
