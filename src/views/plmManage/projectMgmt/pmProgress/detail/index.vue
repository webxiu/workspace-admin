<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">产品型号：</div>
            <div>
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
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">产品名称：</div>
            <div>
              <el-input placeholder=" " v-model="formData.productName" />
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">样机数量：</div>
            <div>
              <el-input-number :controls="false" placeholder=" " v-model="formData.productNum" />
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">日期：</div>
            <div>
              <el-date-picker
                v-model="formData.date"
                :clearable="false"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div style="display: flex; align-items: center">
            <div class="fw">项目阶段：</div>
            <div>
              <el-checkbox-group v-model="formData.pmStage" @change="changeGroup">
                <el-checkbox label="开发申请" value="开发申请" />
                <el-checkbox label="立项" value="立项" />
                <el-checkbox label="设计输出" value="设计输出" />
                <el-checkbox label="设计验证" value="设计验证" />
                <el-checkbox label="工程试产" value="工程试产" />
                <el-checkbox label="认证" value="认证" />
                <el-checkbox label="设计确认（试产）" value="设计确认（试产）" />
                <el-checkbox label="设计完结（量产移交）" value="设计完结（量产移交）" />
                <el-checkbox label="其它" value="其它" />
              </el-checkbox-group>
            </div>
            <div v-if="showPmStageOtherFlag" style="margin-left: 16px"><el-input placeholder=" " v-model="formData.pmStageOther" /></div>
          </div>
        </td>
      </tr>
    </table>
    <table>
      <tr class="first-line">
        <td class="fw head-col" width="50px">序号</td>
        <td class="fw head-col" width="280px">问题点</td>
        <td class="fw head-col" width="280px">原因分析</td>
        <td class="fw head-col" width="280px">改善/优化方案</td>
        <td class="fw head-col" width="295px">改善方案评估(方案提出人初评) （安规、EMC、性能、可靠性的影响）</td>
        <td class="fw head-col" width="90px">更改前图片</td>
        <td class="fw head-col" width="100px">改善后的图片</td>
        <td class="fw head-col" width="100px">责任人</td>
        <td class="fw head-col" width="140px">计划完成时间</td>
        <td class="fw head-col" width="100px">验收人</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td>
          <el-input v-model="item.questionPoint" autosize type="textarea" placeholder=" " />
        </td>
        <td><el-input v-model="item.reasonAnalysis" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.improvePlan" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.improvePlanAsk" autosize type="textarea" placeholder=" " /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item, 'beforeFiles')" v-if="item.beforeFiles.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item, 'beforeFiles')" v-else type="primary" size="small" :icon="Upload" />
        </td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item, 'afterFiles')" v-if="item.afterFiles.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item, 'afterFiles')" v-else type="primary" size="small" :icon="Upload" />
        </td>
        <td><el-input placeholder=" " v-model="item.resUserName" /></td>
        <td>
          <el-date-picker
            v-model="item.planFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td><el-input placeholder=" " v-model="item.checkUserName" /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { h, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { Upload, Edit, Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

const formData: any = reactive({});
const showPmStageOtherFlag = ref(false);

const dataListConfig = reactive([]);

for (let i = 0; i < 7; i++) {
  dataListConfig.push({
    questionPoint: "",
    reasonAnalysis: "",
    improvePlan: "",
    improvePlanAsk: "",
    beforeFiles: [],
    afterFiles: [],
    resUserName: "",
    planFinishDate: "",
    checkUserName: ""
  });
}
const dataList = ref(dataListConfig);

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // 创建一个新的 FileReader 对象
    const reader = new FileReader();
    // 读取 File 对象
    reader.readAsDataURL(file);
    // 加载完成后
    reader.onload = function () {
      // 将读取的数据转换为 base64 编码的字符串
      const base64String = (reader.result as string).split(",")[1];
      // 解析为 Promise 对象，并返回 base64 编码的字符串
      resolve(base64String);
    };

    // 加载失败时
    reader.onerror = function () {
      reject(new Error("Failed to load file"));
    };
  });
};

const changeFiles = async (file) => {
  console.log(file.raw.type, "file..");
  const baseStrPrefix = "data:" + file.raw.type + ";base64,";
  const resBaseStr = await fileToBase64(file.raw);
  const combineBaseStr = baseStrPrefix + resBaseStr;
  console.log(combineBaseStr, " combineBaseStr...");
};

const openFileModel = (type, row, keyStr) => {
  const title = { add: "上传", edit: "编辑" };
  addDialog({
    title: `${title[type]}图片`,
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(
        <div>
          <el-upload
            action="#"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
            list-type="picture-card"
            multiple
            onChange={changeFiles}
            auto-upload={false}
            v-model:file-list={row[keyStr]}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </div>,
        {}
      ),
    beforeSure: (done) => {
      if (!row[keyStr].length) {
        message("还没有上传文件", { type: "warning" });
      } else {
        done();
      }
      console.log(dataList, "dataList===");
    }
  });
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

const changeGroup = () => {
  if (formData.pmStage.length > 1) {
    formData.pmStage.splice(0, 1);
  }

  if (formData.pmStage[0] === "其它") {
    showPmStageOtherFlag.value = true;
  } else {
    showPmStageOtherFlag.value = false;
    formData.pmStageOther = undefined;
  }
};

defineExpose({ formData, dataList });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .line-txt {
      font-weight: 700;
      padding: 6px;
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
      border: 1px solid #000;
      padding: 4px 8px;
    }
  }

  .first-line {
    td {
      border-top: none;
    }
  }
}
</style>
