<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="fw head-col">日期</td>
        <td colspan="3">
          <el-date-picker
            style="width: 340px"
            v-model="formData.applyDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
      </tr>
      <tr>
        <td class="head-col fw">产品型号</td>
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
        <td class="head-col fw">产品名称</td>
        <td>
          <el-input placeholder=" " v-model="formData.productName" />
        </td>
      </tr>
      <tr>
        <td class="head-col fw">申请人</td>
        <td>
          <el-input placeholder=" " v-model="formData.applyUserName" disabled />
        </td>
        <td class="head-col fw">更改有效期</td>
        <td>
          <el-date-picker
            style="width: 100%"
            v-model="formData.changeValidDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>变更原因：</div>
          <div><el-input v-model="formData.changeReason" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>变更内容：</div>
          <div><el-input v-model="formData.changeContent" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>在库品处理：</div>
          <div>
            <el-checkbox-group v-model="formData.stockResolve" @change="changeGroup1">
              <el-checkbox label="可用" value="可用" />
              <el-checkbox label="选用" value="选用" />
              <el-checkbox label="加工使用" value="加工使用" />
              <el-checkbox label="留库待处理" value="留库待处理" />
              <el-checkbox label="报废" value="报废" />
            </el-checkbox-group>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>营销部意见：</div>
          <div>
            <el-input v-model="formData.saleDeptAdvice" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>技术部意见：</div>
          <div>
            <el-input v-model="formData.technologyDeptAdvice" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div>总（副总）经理意见：</div>
          <div>
            <el-input v-model="formData.directorAdvice" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div style="display: flex; align-items: center">
            <div>分发：</div>
            <div>
              <el-checkbox-group v-model="formData.dispatchDept" @change="changeGroup2">
                <el-checkbox label="生产部" value="生产部" />
                <el-checkbox label="品质部" value="品质部" />
                <el-checkbox label="采购部" value="采购部" />
                <el-checkbox label="物控部" value="物控部" />
                <el-checkbox label="营销部" value="营销部" />
                <el-checkbox label="财务部" value="财务部" />
              </el-checkbox-group>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

const curUserInfo = useUserStoreHook().userInfo;

const formData: any = reactive({ applyUserName: curUserInfo.userName });

const changeGroup1 = () => {
  if (formData.stockResolve.length > 1) {
    formData.stockResolve.splice(0, 1);
  }
};

const changeGroup2 = () => {
  if (formData.dispatchDept.length > 1) {
    formData.dispatchDept.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
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

  .first-line {
    td {
      border-top: none;
    }
  }
}
</style>
