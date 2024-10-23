<template>
  <div class="add-template">
    <div class="template-btn">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button type="primary" plain @click="router.push('/plmManage/projectMgmt/productTemplate/index')">返回</el-button>
    </div>
    <div class="template-info">
      <EditForm ref="formRef" :formProps="{ inline: false }" :formInline="formInline" :formRules="formRules" :formConfigs="formConfigs(optionList)" />
    </div>
    <div class="template-group">
      <TypeGroup ref="childRef" @toLeft="toLeftAction" @toRight="toRightAction" :currentId="currentId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import EditForm from "@/components/EditForm/index.vue";
import { onMounted, ref } from "vue";
import { reactive } from "vue";
import { formConfigs } from "./config";
import TypeGroup from "./components/typeGroups.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import {
  addProductTemplate,
  editProductTemplate,
  fetchSelectableTypeList,
  fetchSelectedTypeList,
  getProductTemplateDetailInfo,
  toLeftSelectedTypeList,
  toRightSelectableTypeList
} from "@/api/plmManage";
import { handleTree } from "@/utils/tree";
import { useRouter } from "vue-router";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

const formRules = reactive<FormRules>({
  templateName: [{ required: true, message: "模板名称为必填项", trigger: "change" }]
});

defineOptions({ name: "AddProductTemplate" });

const router = useRouter();

const toLeftAction = (row) => {
  const ids = lookForAllId([row]);

  toLeftSelectedTypeList({ id: currentId.value || route.query.id, typeIds: ids }).then((res) => {
    if (res.data) refresh(currentId.value || route.query.id);
  });
};

const lookForAllId = (data = [], arr = []) => {
  for (const item of data) {
    if (item.id) arr.push(item.id);
    if (item.children && item.children.length) lookForAllId(item.children, arr);
  }
  return arr;
};

const toRightAction = (row) => {
  const ids = lookForAllId([row]);

  toRightSelectableTypeList({ id: currentId.value || route.query.id, typeIds: ids }).then((res) => {
    if (res.data) refresh(currentId.value || route.query.id);
  });
};

const route = useRoute();
const formRef = ref(null);
const formInline = reactive({ templateName: "", productClassId: "" });
const optionList = ref([]);
const childRef = ref();
const currentId = ref(0);

const getOptionList = () => {
  getProductClassifyList({ page: 1, limit: 10000 }).then((data) => (optionList.value = data));
};

const refresh = (id) => {
  childRef.value.leftRef.loading = true;
  childRef.value.leftRef.currentLeftRow = {};
  childRef.value.rightRef.loading = true;
  childRef.value.rightRef.currentRightRow = {};
  fetchSelectableTypeList({ id })
    .then((resp: any) => {
      if (resp.data) {
        childRef.value.leftRef.dataList = handleTree(resp.data, "tableId", "tablePid", "children");
      }
    })
    .finally(() => {
      childRef.value.leftRef.loading = false;
    });
  fetchSelectedTypeList({ id })
    .then((resp: any) => {
      if (resp.data) {
        childRef.value.rightRef.dataList = handleTree(resp.data, "tableId", "tablePid", "children");
      }
    })
    .finally(() => {
      childRef.value.rightRef.loading = false;
    });
};

const onSave = () => {
  const configApi = { add: addProductTemplate, edit: editProductTemplate };
  const reqData: any = { ...formInline };
  if (route.query.id) reqData.id = route.query.id;
  formRef.value.getRef().validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          configApi[route.query.type as string](reqData).then((res) => {
            if (res.data) {
              ElMessage({ message: "保存成功", type: "success" });
              currentId.value = res.data as number;
              refresh(res.data);
            }
          });
        })
        .catch(() => {});
    }
  });
};

// 编辑数据回显
const initEditData = () => {
  getProductTemplateDetailInfo({ id: route.query.id }).then((res: any) => {
    if (res.data) {
      formInline.productClassId = res.data.productClassId;
      formInline.templateName = res.data.templateName;
    }
  });
  refresh(route.query.id);
};

onMounted(() => {
  console.log(route.query, "addpage==query");
  getOptionList();
  if (route.query.id && route.query.type === "edit") {
    initEditData();
  }
});
</script>

<style lang="scss" scoped>
.add-template {
  .template-btn {
    text-align: right;
  }
}
</style>
