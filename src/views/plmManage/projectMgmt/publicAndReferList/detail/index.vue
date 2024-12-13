<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="60px">序号</td>
        <td class="head-col">物料名称</td>
        <td class="head-col">3D名称</td>
        <td class="head-col" width="80px">图片</td>
        <td class="head-col">用量</td>
        <td class="head-col">备注</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td><el-input placeholder=" " v-model="item.materialName" /></td>
        <td><el-input placeholder=" " v-model="item.threeDName" /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.imgs.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
        <td><el-input-number :controls="false" class="ui-w-100" placeholder=" " v-model="item.usage" /></td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { h, reactive, ref } from "vue";
import { Upload, Edit, Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

const dataListConfig = reactive([]);

for (let i = 0; i < 6; i++) {
  dataListConfig.push({
    threeDName: "",
    materialName: "",
    usage: undefined,
    imgs: [],
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
  addDialog({
    title: `${title[type]}图片`,
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
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
            v-model:file-list={row.imgs}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </div>,
        {}
      ),
    beforeSure: (done) => {
      if (!row.imgs.length) {
        message.warning("还没有上传文件");
      } else {
        done();
      }
      console.log(dataList, "dataList===");
    }
  });
};

defineExpose({ dataList });
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
