<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col">产品型号</td>
        <td>
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="formData.productModel"
            readonly
            showButton
            @select="onSelect"
            showModel="product"
          />
        </td>
        <td class="head-col">产品名称</td>
        <td><el-input v-model="formData.productName" placeholder=" " /></td>
        <td class="head-col">认证类型</td>
        <td>
          <el-select v-model="formData.authType" placeholder="请选择" class="ui-w-100">
            <el-option v-for="item in authTypeOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
          </el-select>
        </td>
        <td class="head-col">日期</td>
        <td>
          <el-date-picker
            disabled
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
      <tr class="second-row">
        <td colspan="2" v-for="(item, idx) in dataList.slice(0, 4)" :key="idx">
          <div>
            <div class="imgs">
              <el-upload action="#" list-type="picture-card" size="small" multiple :auto-upload="false" v-model:file-list="item.fileList">
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="td-table">
              <table>
                <tr>
                  <td width="70px" class="fs-12" style="border-left: 0">部位Ｎｏ</td>
                  <td colspan="2">
                    <el-input class="ui-w-100" size="small" placeholder=" " v-model="item.partNo" />
                  </td>
                  <td class="head-col" style="border-right: 0">
                    <div style="visibility: hidden">empty</div>
                  </td>
                </tr>
                <tr>
                  <td width="70px" style="font-size: 12px; border-left: 0">部位名</td>
                  <td style="width: 130px">
                    <el-input size="small" placeholder=" " v-model="item.partName" />
                  </td>
                  <td class="head-col" width="70px" style="font-size: 12px">部件类型</td>
                  <td style="border-right: 0">
                    <el-select size="small" v-model="item.partType" placeholder="请选择" class="ui-w-100">
                      <el-option v-for="el in partTypeOpts" :key="el.optionValue" :label="el.optionName" :value="el.optionValue" />
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0">对照点</td>
                  <td colspan="3" style="border-right: 0">
                    <el-input size="small" v-model="item.comparePoint" autosize type="textarea" placeholder=" " />
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0">实机确认</td>
                  <td colspan="3" style="border-right: 0">
                    <el-input size="small" v-model="item.realMachine" autosize type="textarea" placeholder=" " />
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0; border-bottom: 0">结果</td>
                  <td colspan="3" style="border-right: 0; border-bottom: 0">
                    <el-checkbox-group v-model="item.result" @change="(val) => changeGroup(idx, '1')">
                      <el-checkbox label="一致" value="一致" />
                      <el-checkbox label="不一致" value="不一致" />
                    </el-checkbox-group>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
      </tr>

      <tr class="second-row">
        <td colspan="2" v-for="(item, idx) in dataList.slice(4, 8)" :key="idx">
          <div>
            <div class="imgs">
              <el-upload action="#" list-type="picture-card" size="small" multiple :auto-upload="false" v-model:file-list="item.fileList">
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="td-table">
              <table>
                <tr>
                  <td width="70px" class="fs-12" style="border-left: 0">部位Ｎｏ</td>
                  <td colspan="2">
                    <el-input class="ui-w-100" size="small" placeholder=" " v-model="item.partNo" />
                  </td>
                  <td class="head-col" style="border-right: 0">
                    <div style="visibility: hidden">empty</div>
                  </td>
                </tr>
                <tr>
                  <td width="70px" style="font-size: 12px; border-left: 0">部位名</td>
                  <td style="width: 130px">
                    <el-input size="small" placeholder=" " v-model="item.partName" />
                  </td>
                  <td class="head-col" width="70px" style="font-size: 12px">部件类型</td>
                  <td style="border-right: 0">
                    <el-select size="small" v-model="item.partType" placeholder="请选择" class="ui-w-100">
                      <el-option v-for="el in partTypeOpts" :key="el.optionValue" :label="el.optionName" :value="el.optionValue" />
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0">对照点</td>
                  <td colspan="3" style="border-right: 0">
                    <el-input size="small" v-model="item.comparePoint" autosize type="textarea" placeholder=" " />
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0">实机确认</td>
                  <td colspan="3" style="border-right: 0">
                    <el-input size="small" v-model="item.realMachine" autosize type="textarea" placeholder=" " />
                  </td>
                </tr>
                <tr>
                  <td class="fs-12" style="border-left: 0; border-bottom: 0">结果</td>
                  <td colspan="3" style="border-right: 0; border-bottom: 0">
                    <el-checkbox-group v-model="item.result" @change="(val) => changeGroup(idx, '2')">
                      <el-checkbox label="一致" value="一致" />
                      <el-checkbox label="不一致" value="不一致" />
                    </el-checkbox-group>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { Plus } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import dayjs from "dayjs";

const authTypeOpts = ref([
  { optionName: "类型一", optionValue: "类型一" },
  { optionName: "类型二", optionValue: "类型二" }
]);
const partTypeOpts = ref([
  { optionName: "EMC措施部件", optionValue: "EMC措施部件" },
  { optionName: "安全部件", optionValue: "安全部件" }
]);
const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};
const singleGroupList = [];

for (let i = 0; i < 8; i++) {
  singleGroupList.push({
    fileList: [],
    partNo: "",
    partName: "",
    partType: "",
    comparePoint: "",
    realMachine: "",
    result: []
  });
}

const dataList = ref(singleGroupList);

const changeGroup = (idx, group) => {
  if (dataList.value[group === "1" ? idx : idx + 4].result.length > 1) {
    dataList.value[group === "1" ? idx : idx + 4].result.splice(0, 1);
  }
};

const formData: any = reactive({ date: dayjs().format("YYYY-MM-DD") });

defineExpose({ formData, dataList });
</script>

<style scoped lang="scss">
.fs-12 {
  font-size: 12px;
}

.second-row {
  table {
    border: 0 !important;
  }
  & > td {
    padding-right: 0 !important;
    padding-left: 0 !important;
    padding-bottom: 0 !important;
  }

  .imgs {
    padding-left: 4px;
    padding-right: 4px;
    padding-bottom: 4px;

    :deep(.el-upload--picture-card),
    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 120px;
      height: 120px;
    }
  }
}
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
