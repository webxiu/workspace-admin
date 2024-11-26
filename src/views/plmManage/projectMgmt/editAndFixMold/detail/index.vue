<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="6">
          <div style="display: flex">
            <div style="display: flex; align-items: center">
              <div style="width: 110px; text-align: right">编号：</div>
              <el-input v-model="formData.billNo" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center; margin: 0 16px">
              <div style="width: 110px; text-align: right">收件单位：</div>
              <el-input v-model="formData.receivePlace" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center">
              <div style="width: 130px; text-align: right">收件人：</div>
              <el-input v-model="formData.receiveUserName" placeholder=" " />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex">
            <div style="display: flex; align-items: center; margin: 0 16px 0 0">
              <div style="width: 110px; text-align: right">发件单位：</div>
              <el-input v-model="formData.sendPlace" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center">
              <div style="width: 110px; text-align: right">发件人：</div>
              <el-input v-model="formData.sendUserName" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center">
              <div style="width: 110px; text-align: right">发件日期：</div>
              <el-date-picker
                style="width: 228px"
                v-model="formData.sendDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
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
        <td><el-input v-model="formData.productName" placeholder=" " /></td>
        <td class="head-col">模具编号</td>
        <td><el-input v-model="formData.moldNo" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col">零件名称</td>
        <td><el-input v-model="formData.partName" placeholder=" " /></td>
        <td class="head-col">材料</td>
        <td><el-input v-model="formData.material" placeholder=" " /></td>
        <td class="head-col">更改次数</td>
        <td><el-input-number :controls="false" v-model="formData.changeTimes" placeholder=" " class="ui-w-100" /></td>
      </tr>
      <tr>
        <td class="head-col">要求完成日期</td>
        <td>
          <el-date-picker
            v-model="formData.reqFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td class="head-col">回复完成日期</td>
        <td>
          <el-date-picker
            v-model="formData.replyFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td class="head-col">责任人</td>
        <td><el-input v-model="formData.resUserName" placeholder=" " /></td>
      </tr>
      <tr>
        <td colspan="6">
          <div>改模/修模原因：</div>
          <div>
            <el-input v-model="formData.editAndFixReason" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px; text-align: right">3D名称：</div>
            <div style="flex: 1"><el-input v-model="formData.threeDName" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px; text-align: right">试模要求：</div>
            <div style="flex: 1"><el-input v-model="formData.tryMoldReq" autosize type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px; text-align: right">参考ECN编号：</div>
            <div style="flex: 1"><el-input v-model="formData.ecnNo" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <el-checkbox-group v-model="formData.checkedList" @change="changeGroup">
            <el-checkbox label="客户要求" value="客户要求" />
            <el-checkbox label="模厂原因" value="模厂原因" />
            <el-checkbox label="模具损伤" value="模具损伤" />
            <el-checkbox label="设计变更" value="设计变更" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <el-input v-model="formData.checkedAfterRemarks" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " />
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px; text-align: right">旧物料处理：</div>
            <div>
              <el-checkbox-group v-model="formData.oldMaterialResolveWay" @change="changeGroup2">
                <el-checkbox label="无旧物料" value="无旧物料" />
                <el-checkbox label="待工程试产后处理" value="待工程试产后处理" />
                <el-checkbox label="待品质测试后处理" value="待品质测试后处理" />
                <el-checkbox label="报废" value="报废" />
                <el-checkbox label="旧物料照用" value="旧物料照用" />
                <el-checkbox label="加工选用" value="加工选用" />
                <el-checkbox label="其它" value="其它" />
              </el-checkbox-group>
            </div>
          </div>
          <div v-if="formData.oldMaterialResolveWay && formData.oldMaterialResolveWay[0] === '其它'">
            <el-input v-model="formData.oldMaterialResolveWayOtherRemarks" autosize type="textarea" placeholder=" " />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div style="width: 100px; text-align: right">分发部门：</div>
            <div>
              <el-checkbox-group v-model="formData.dispatchDeptList" @change="changeGroup3">
                <el-checkbox label="工程部" value="工程部" />
                <el-checkbox label="采购部" value="采购部" />
                <el-checkbox label="物控部" value="物控部" />
                <el-checkbox label="品质部" value="品质部" />
                <el-checkbox label="生产部" value="生产部" />
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
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { Plus } from "@element-plus/icons-vue";
import { roleUserList } from "@/api/systemManage";
import { getEnumDictList } from "@/utils/table";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

defineProps(["projectStageOpts"]);

const formData: any = reactive({
  productModel: "",
  productName: ""
});
const pmUserList = ref([]);
const sampModelColorOpts = ref([]);
const tryStageOpts = ref([]);

const changeGroup = () => {
  if (formData.checkedList.length > 1) {
    formData.checkedList.splice(0, 1);
  }
};

const changeGroup2 = () => {
  if (formData.oldMaterialResolveWay.length > 1) {
    formData.oldMaterialResolveWay.splice(0, 1);
  }
};

const changeGroup3 = () => {
  if (formData.dispatchDeptList.length > 1) {
    formData.dispatchDeptList.splice(0, 1);
  }
};

const fetchOpts = () => {
  roleUserList({
    roleId: 512
  }).then((res) => {
    if (res.data) {
      pmUserList.value = res.data.map((item) => ({ label: item.userName, value: item.userId }));
    }
  });
  getEnumDictList(["TrialProductionColor", "TrialProductionStage"]).then((res) => {
    sampModelColorOpts.value = res["TrialProductionColor"];
    tryStageOpts.value = res["TrialProductionStage"];
  });
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};

onMounted(() => {
  fetchOpts();
});

defineExpose({ formData });
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
