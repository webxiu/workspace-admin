<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>认证类型：</div>
            <div>
              <el-checkbox-group v-model="formData.authType" @change="changeGroup">
                <el-checkbox label="类型一" value="类型一" />
                <el-checkbox label="类型二" value="类型二" />
              </el-checkbox-group>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div style="display: flex; align-items: center">
            <div>认证型号：</div>
            <div>
              <HxModalInput
                title="选择产品"
                placeholder="请选择认证型号"
                valueKey="authModel"
                v-model="formData.authModel"
                readonly
                showButton
                @select="onSelect"
                showModel="product"
              />
            </div>
          </div>
        </td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>适用型号：</div>
            <div>
              <HxModalInput
                title="选择产品"
                placeholder="请选择适用型号"
                valueKey="useageModel"
                v-model="formData.useageModel"
                readonly
                showButton
                @select="onSelect2"
                showModel="product"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4"><div style="height: 20px" /></td>
        <td colspan="2"><div style="height: 20px" /></td>
      </tr>
      <tr>
        <td class="head-col" width="60px">版次</td>
        <td class="head-col" width="200px">修订日期</td>
        <td class="head-col" colspan="3">修改记录</td>
        <td class="head-col" width="110px">编制/修订者</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td>
          <el-date-picker
            v-model="item.editDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td colspan="3"><el-input v-model="item.editRecords" autosize type="textarea" placeholder=" " /></td>
        <td><el-input placeholder=" " v-model="item.editUserName" /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";

const formData: any = reactive({});

const dataListConfig = reactive([]);

for (let i = 0; i < 13; i++) {
  dataListConfig.push({
    versionTime: "",
    editDate: "",
    editRecords: "",
    editUserName: ""
  });
}
const dataList = ref(dataListConfig);

const changeGroup = () => {
  if (formData.authType.length > 1) {
    formData.authType.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.authModel = val.productCode;
};

const onSelect2 = (val) => {
  formData.useageModel = val.productCode;
};

defineExpose({ formData, dataList });
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

  .first-line {
    td {
      border-top: none;
    }
  }
}
</style>
