<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col">申请部门</td>
        <td class="head-col">
          <el-tree-select
            v-model="formData.applyDeptId"
            :data="deptOpts"
            disabled
            placeholder="请选择申请部门"
            filterable
            check-strictly
            :default-expanded-keys="['0']"
            node-key="value"
            :render-after-expand="false"
            class="ui-w-100"
          />
        </td>
        <td class="head-col">申请日期</td>
        <td class="head-col">
          <el-date-picker
            v-model="formData.applyDate"
            clearable
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td class="head-col">需求日期</td>
        <td class="head-col">
          <el-date-picker
            v-model="formData.reqDate"
            clearable
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
      </tr>
      <tr>
        <td class="head-col">治夹具名称</td>
        <td class="head-col">
          <el-input placeholder=" " v-model="formData.fixtureName" />
        </td>
        <td class="head-col">数量</td>
        <td class="head-col">
          <el-input-number class="ui-w-100" :controls="false" placeholder=" " v-model="formData.quantity" />
        </td>
        <td class="head-col">用途</td>
        <td class="head-col">
          <el-input placeholder=" " v-model="formData.purpose" />
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div>治夹具草图</div>
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="formData.fixtureImgs">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div>其它要求及说明</div>
          <div><el-input v-model="formData.otherReqAndDesc" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import { getDeptOptions } from "@/utils/requestApi";

const deptOpts = ref([]);

const curUser = useUserStoreHook().userInfo;

const formData: any = reactive({ applyDeptId: curUser.deptId + "" });

onMounted(() => {
  getDeptOptions().then((res) => {
    deptOpts.value = res[0].children;
  });
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
