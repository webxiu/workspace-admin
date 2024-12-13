<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td rowspan="4" align="center" colspan="2">试模通知书</td>
        <td width="100px">产品型号：</td>
        <td colspan="2">
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
        <td width="130px" colspan="2">试模次数</td>
        <td colspan="3"><el-input-number :min="0" class="ui-w-100" :controls="false" v-model="formData.tryMoldCount" placeholder=" " /></td>
      </tr>
      <tr>
        <td>模具编号：</td>
        <td colspan="2"><el-input v-model="formData.moldNo" placeholder=" " /></td>
        <td colspan="2">要求完成日期</td>
        <td colspan="3">
          <el-date-picker
            size="small"
            v-model="formData.reqFinishDate"
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
        <td>零件名称：</td>
        <td colspan="7"><el-input v-model="formData.partName" placeholder=" " /></td>
      </tr>
      <tr>
        <td>试模类别：</td>
        <td colspan="7">
          <el-checkbox-group v-model="formData.tryMoldClassify" @change="changeGroup">
            <el-checkbox label="新模" value="新模" />
            <el-checkbox label="改模" value="改模" />
            <el-checkbox label="换料" value="换料" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="head-col" colspan="10">试 模 要 求</td>
      </tr>
      <tr>
        <td style="width: 80px">胶料牌号</td>
        <td style="width: 140px"><el-input v-model="formData.glueBrandNo" placeholder=" " /></td>
        <td style="width: 80px">胶料类别</td>
        <td>
          <el-checkbox-group v-model="formData.glueClassify" @change="changeGroup2">
            <el-checkbox label="原料" value="原料" />
            <el-checkbox label="水口" value="水口" />
          </el-checkbox-group>
        </td>
        <td style="width: 80px">胶料颜色</td>
        <td style="width: 140px">
          <el-select v-model="formData.glueColor" placeholder="请选择" class="ui-w-100">
            <el-option v-for="item in glueColorOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
          </el-select>
        </td>
        <td style="width: 80px">烘料温度</td>
        <td style="width: 140px"><el-input v-model="formData.bakingHeat" placeholder=" " /></td>
        <td style="width: 80px">烘料时间</td>
        <td style="width: 160px"><el-input v-model="formData.bakingTime" placeholder=" " /></td>
      </tr>
      <tr>
        <td style="width: 80px">前模运水</td>
        <td style="width: 140px"><el-input v-model="formData.preMoldWater" placeholder=" " /></td>
        <td style="width: 80px">后模运水</td>
        <td>
          <el-input v-model="formData.nextMoldWater" placeholder=" " />
        </td>
        <td style="width: 80px">模具尺寸</td>
        <td style="width: 140px" colspan="3">
          <el-input v-model="formData.moldSize" placeholder="（长×宽×厚，单位 mm）" />
        </td>
        <td style="width: 100px">模具毛重Kg</td>
        <td style="width: 160px"><el-input v-model="formData.moldWeigth" placeholder=" " /></td>
      </tr>
      <tr>
        <td style="width: 80px">模具检查</td>
        <td style="width: 140px">①标识</td>
        <td colspan="2">
          <el-checkbox-group v-model="formData.moldCheckSign" @change="changeGroup3">
            <el-checkbox label="清晰、明确" value="清晰、明确" />
            <el-checkbox label="不需要" value="不需要" />
          </el-checkbox-group>
        </td>
        <td>②动作</td>
        <td colspan="3">
          <el-checkbox-group v-model="formData.moldCheckAction" @change="changeGroup4">
            <el-checkbox label="动作灵活" value="动作灵活" />
            <el-checkbox label="次序正确" value="次序正确" />
            <el-checkbox label="不合格" value="不合格" />
          </el-checkbox-group>
        </td>
        <td style="width: 100px">模具制造商</td>
        <td style="width: 160px"><el-input v-model="formData.moldProvider" placeholder=" " /></td>
      </tr>
      <tr>
        <td colspan="3">
          需检查处数： 共<span style="margin: 0 8px"
            ><el-input-number :min="0" class="ui-w-80" :controls="false" v-model="formData.checkCount" placeholder=" " /></span
          >处
        </td>
        <td>试模报告</td>
        <td colspan="6">
          <el-checkbox-group v-model="formData.tryMoldReport" @change="changeGroup5">
            <el-checkbox label="需要" value="需要" />
            <el-checkbox label="不需要" value="不需要" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>样板要求</td>
        <td>①无明显外观缺陷</td>
        <td colspan="2">
          <el-checkbox-group v-model="formData.simpleReq" @change="changeGroup6">
            <el-checkbox label="要求" value="要求" />
            <el-checkbox label="不作要求" value="不作要求" />
          </el-checkbox-group>
        </td>
        <td colspan="2">②样板数目（PCS / set）</td>
        <td style="width: 120px">
          <el-input v-model="formData.simpleNum" placeholder=" " />
        </td>
        <td colspan="2" style="width: 190px">③带水口样板数目（PCS / set）</td>
        <td>
          <el-input v-model="formData.waterSimpleNum" placeholder=" " />
        </td>
      </tr>
      <tr>
        <td align="center">序号</td>
        <td colspan="9" align="center">试 模 目 的 及 内 容</td>
      </tr>
      <tr>
        <td align="center">1</td>
        <td colspan="9" align="center"><el-input v-model="formData.content1" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">2</td>
        <td colspan="9" align="center"><el-input v-model="formData.content2" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">3</td>
        <td colspan="9" align="center"><el-input v-model="formData.content3" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">4</td>
        <td colspan="9" align="center"><el-input v-model="formData.content4" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">5</td>
        <td colspan="9" align="center"><el-input v-model="formData.content5" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">6</td>
        <td colspan="9" align="center"><el-input v-model="formData.content6" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">7</td>
        <td colspan="9" align="center"><el-input v-model="formData.content7" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td align="center">8</td>
        <td colspan="9" align="center"><el-input v-model="formData.content8" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td colspan="10" align="center">示 意 图</td>
      </tr>
      <tr>
        <td colspan="10">
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="formData.fileList">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { fetchProductStoreList } from "@/api/plmManage";

const formData: any = reactive({});
const glueColorOpts = ref([
  { optionName: "黑色", optionValue: "黑色" },
  { optionName: "蓝色", optionValue: "蓝色" }
]);

const changeGroup = () => {
  if (formData.tryMoldClassify.length > 1) {
    formData.tryMoldClassify.splice(0, 1);
  }
};

const changeGroup2 = () => {
  if (formData.glueClassify.length > 1) {
    formData.glueClassify.splice(0, 1);
  }
};
const changeGroup3 = () => {
  if (formData.moldCheckSign.length > 1) {
    formData.moldCheckSign.splice(0, 1);
  }
};
const changeGroup4 = () => {
  if (formData.moldCheckAction.length > 1) {
    formData.moldCheckAction.splice(0, 1);
  }
};

const changeGroup5 = () => {
  if (formData.tryMoldReport.length > 1) {
    formData.tryMoldReport.splice(0, 1);
  }
};

const changeGroup6 = () => {
  if (formData.simpleReq.length > 1) {
    formData.simpleReq.splice(0, 1);
  }
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};

defineExpose({ formData });
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
