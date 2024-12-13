<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="13">
          <div style="display: flex; align-items: center">
            <div style="display: flex; align-items: center; width: 25%">
              <div>编号：</div>
              <div><el-input size="small" v-model="formData.billNo" placeholder=" " /></div>
            </div>
            <div style="display: flex; align-items: center; width: 25%">
              <div>产品型号：</div>
              <div>
                <HxModalInput
                  title="选择产品"
                  placeholder="请选择产品"
                  valueKey="productNo"
                  v-model="formData.productNo"
                  readonly
                  size="small"
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
            <div style="display: flex; align-items: center; width: 25%">
              <div>产品名称：</div>
              <div><el-input size="small" v-model="formData.productName" placeholder=" " /></div>
            </div>
            <div style="display: flex; align-items: center; width: 25%">
              <div>日期：</div>
              <div>
                <el-date-picker
                  size="small"
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
          </div>
        </td>
      </tr>
      <tr>
        <td>序号</td>
        <td>物料编码</td>
        <td>零件名称（3D）</td>
        <td>型号规格</td>
        <td>图片</td>
        <td>数量</td>
        <td>需求回厂日期</td>
        <td>回复到厂日期</td>
        <td>打样次数</td>
        <td>打样原因</td>
        <td>组别</td>
        <td>资料</td>
        <td>备注</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center" width="50px">{{ idx + 1 }}</td>
        <td width="120px"><el-input size="small" v-model="item.materialNo" placeholder=" " /></td>
        <td width="130px"><el-input size="small" v-model="item.threeDPartName" placeholder=" " /></td>
        <td width="160px"><el-input size="small" v-model="item.specs" placeholder=" " /></td>
        <td width="60px">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.files.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
        <td style="width: 80px"><el-input-number style="width: 100%" :controls="false" size="small" v-model="item.num" placeholder=" " /></td>
        <td width="130px">
          <el-date-picker
            size="small"
            v-model="item.backReqDate"
            clearable
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td width="130px">
          <el-date-picker
            size="small"
            v-model="item.toApplyDate"
            clearable
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td style="width: 80px"><el-input-number style="width: 100%" :controls="false" size="small" v-model="item.sampleCount" placeholder=" " /></td>
        <td width="160px"><el-input size="small" v-model="item.sampleReason" placeholder=" " /></td>
        <td style="width: 80px"><el-input style="width: 100%" size="small" v-model="item.group" placeholder=" " /></td>
        <td style="width: 160px"><el-input style="width: 100%" size="small" v-model="item.assets" placeholder=" " /></td>
        <td style="width: 160px"><el-input size="small" v-model="item.remark" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { h, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import { Upload, Edit, Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

const formData: any = reactive({});
const dataListConfig = reactive([]);

for (let i = 0; i < 15; i++) {
  dataListConfig.push({
    materialNo: "",
    threeDPartName: "",
    specs: "",
    files: [],
    num: undefined,
    backReqDate: "",
    toApplyDate: "",
    sampleCount: undefined,
    sampleReason: "",
    group: "",
    assets: "",
    remark: ""
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

const openFileModel = (type, row) => {
  const title = { add: "上传", edit: "编辑" };
  const fileList = ref([]);
  addDialog({
    title: `${title[type]}图片`,
    class: "part-sample-apply-file-modal",
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
            v-model:file-list={row.files}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </div>,
        {}
      ),
    beforeSure: (done) => {
      if (!row.files.length) {
        message.warning("还没有上传文件");
      } else {
        done();
      }
      console.log(dataList, "dataList===");
    }
  });
};

const onChangeFileInput = async (e) => {
  const files = e.target.files;
  console.log(files, "files===");
};

const uploadAction = () => {
  const dom = document.getElementById("partApplyId");
  dom.click();
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};

defineExpose({ formData, dataList });
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
      padding: 4px 8px;
      text-align: center;
      border: 1px solid #000;
    }
  }
}
</style>
