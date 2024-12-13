<template>
  <div class="effect-detail">
    <table>
      <tr>
        <td class="head-col">项目号</td>
        <td class="head-col">项目名称</td>
        <td class="head-col">版本序号</td>
        <td class="head-col">日期</td>
      </tr>
      <tr>
        <td style="padding: 3px"><el-input v-model="_formData.projectNo" /></td>
        <td style="padding: 3px"><el-input v-model="_formData.projectName" /></td>
        <td style="padding: 3px"><el-input v-model="_formData.projectVersion" /></td>
        <td style="padding: 3px">
          <el-date-picker
            v-model="_formData.projectDate"
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
        <td colspan="4" style="padding: 6px; font-size: 15px; text-align: left">
          <div style="color: #000">设计简要说明：</div>
          <div><el-input v-model="_formData.desingDesc" :autosize="{ minRows: 2 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="padding: 6px; text-align: left">
          <div style="color: #000">方案1-尺寸图</div>
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="_formData.fileList">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="padding: 6px; text-align: left">
          <div style="color: #000">方案1-正视图</div>
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="_formData.fileList2">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="padding: 6px; text-align: left">
          <div style="color: #000">方案1-透视立体图</div>
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="_formData.fileList3">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { reactive } from "vue";

const _formData = reactive({
  projectNo: "",
  projectName: "",
  projectVersion: "",
  projectDate: dayjs().format("YYYY-MM-DD"),
  fileList: [],
  fileList2: [],
  fileList3: [],
  desingDesc: ""
});

defineExpose({ _formData });
</script>

<style scoped lang="scss">
.effect-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .head-col {
      font-weight: 600;
      color: #000;
    }

    td {
      padding: 2px 0;
      text-align: center;
      border: 1px solid #000;
    }
  }
}
</style>
