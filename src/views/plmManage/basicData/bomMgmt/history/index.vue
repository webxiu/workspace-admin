<template>
  <div class="bom-history" style="display: flex; justify-content: space-between">
    <div><LeftTable ref="leftTableRef" :initList="initList" :setDataList="setDataList" :setRightLoading="setRightLoading" /></div>

    <div style="padding: 0 15px; overflow: auto">
      <div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基本信息" name="1">
            <div class="edit-form">
              <EditForm
                :loading="loading"
                :formRules="formRules"
                :formInline="formData"
                :formConfigs="formConfigs(opts, formData, treeData, submit)"
                ref="formRef"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div>
        <div><RightTable :dataList="dataList" ref="rightRef" /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "../components/config";
import { ref, reactive, onMounted } from "vue";
import { addMaterialInfo, fetchBomLeftTreeData, updateMaterialInfo } from "@/api/plmManage";
import { useUserStore } from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import LeftTable from "./left.vue";
import RightTable from "./right.vue";

const userStore = useUserStore();
const route = useRoute();
const activeNames = ref(["1"]);
const dataList = ref([]);
const rightRef = ref();
const leftTableRef = ref();

const setRightLoading = (flag) => {
  rightRef.value.loading = flag;
};

defineOptions({ name: "BomHistory" });

const router = useRouter();

const formRef = ref();
const loading = ref(false);
const opts: any = ref({});
const treeData: any = ref([]);
const formData = reactive({
  number: route.query.code == "0" ? "" : route.query.code,
  name: "",
  oldCode: "",
  specification: "",
  materialName: "",
  materialNumber: "",
  model: "",
  productType: "",
  baseUnit: "",
  customerProvided: "0",
  purchaseUnit: "",
  createDate: "",
  stockUnit: "",
  groupName: "",
  groupId: "",
  saleUnti: "",
  file: "",
  warehouse: "",
  materialType: "",
  goodsType: "",
  nation: "V0",
  materialGroup: "",
  remark: "",
  erpClsid: "",
  manufacturingShop: "",
  createUserName: userStore.userInfo.userName,
  modifyUserName: "",
  modifyDate: "",
  id: "",
  createUserId: 1384843,
  cbcertification: 0
});

const handleChange = (val: string[]) => {
  console.log(val[0]);
  leftTableRef.value?.setHeight(val[0] ? 0 : 100);
  rightRef.value?.setHeight(val[0] ? 0 : 100);
};

const setDataList = (v) => {
  dataList.value = v;
  rightRef.value.dataList = v[0]?.bomInfoEntryList || [];
};

const addMaterial = () => {
  ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      loading.value = true;
      let res: any;
      if (route.query.id) {
        res = updateMaterialInfo({ ...formData });
      } else {
        res = addMaterialInfo({ ...formData });
      }

      res
        .then((res) => {
          console.log(res.data, "新增成功");
          if (res.data) {
            ElMessageBox.confirm("保存成功,继续操作或返回？", "温馨提示", {
              confirmButtonText: "继续",
              cancelButtonText: "返回",
              type: "success"
            })
              .then(() => {
                if (route.query.type !== "edit") {
                  router.push(
                    `/plm/bd/materialAdd?id=${res.data}&type=view&number=${route.query.number}&code=${route.query.code}&isNewTag=yes&menuId=${route.query.menuId}`
                  );
                }
              })
              .catch(() => {
                router.push("/plm/bd/material");
              });
          }
        })
        .finally(() => (loading.value = false));
    })
    .catch(() => {});
};

const submit = () => {
  console.log("submit", formData);
  formRef.value
    .getRef()
    .validate()
    .then(() => {
      console.log("验证成功");

      addMaterial();
    })
    .catch(() => {
      console.log("验证失败");
    });
};

const initList = (result) => {
  fetchBomLeftTreeData({}).then((res: any) => {
    if (res.data) {
      console.log(res.data, "tree");
      treeData.value = res.data.bomGroupSelectTree;
    }
  });

  const calcFormData = (item, data) => {
    formData[item] = data[item];
    formData["groupId"] = data["groupId"] + "";
  };

  const keys = Object.keys(formData);
  for (const item of keys) {
    calcFormData(item, result);
  }
};

onMounted(() => {
  console.log(route.query, "query");
});

defineProps(["hideTitle", "name", "title", "showBtn", "isView", "historyData"]);
</script>

<style scoped>
.bom-history {
  height: calc(100vh - 110px);
}

:deep(.el-form-item) {
  margin-bottom: 0 !important;
}

.edit-form {
  padding-top: 20px;
}

:deep(.el-collapse),
:deep(.el-collapse-item__wrap) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 15px;
  font-weight: 600;
  color: #409eff;
}
</style>
