<script setup lang="ts">
import { reactive, onMounted, ref, h } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { authBeforeAdd, deleteUserSecretKey, getUserSecretKeys, insertUserSecretKey, queryuser, reGenerateUserSecretKey } from "@/api/user/user";
import { setColumn } from "@/utils/table";
import { addDialog } from "@/components/ReDialog";
import { ElMessage } from "element-plus";
import { formConfigs, formRules, formBaseConfigs, formBaseRules, formConfigs2, formRules2 } from "./config";
import { useUserStore } from "@/store/modules/user";
import md5 from "md5";
import { showMessageBox } from "@/utils/message";
import { userInfoUpdate } from "@/api/systemManage";

const newFormInline: any = ref({});
const loading = ref<boolean>(false);
const loading2 = ref(false);
const maxHeight = ref("49vh");
const dataList = ref([]);
const columns = ref([]);
const formRef = ref();
const dialogVisible = ref(false);
const resetRow: any = ref({});

const userStore = useUserStore();

let _formData: any = reactive({});
const _formData2: any = reactive({ userNo: userStore.userInfo.userCode, password: "" });
const isReset = ref(false);

const secretBackValue = ref("");

enum UserState {
  A = "在职",
  B = "离职"
}

const columnData: TableColumnList[] = [
  { label: "密钥名称", prop: "name", minWidth: 110 },
  { label: "创建人ID", prop: "createUserId", width: 100 },
  { label: "组织机构ID", prop: "orgId", minWidth: 180 },
  { label: "创建时间", prop: "createDate", width: 160 },
  { label: "是否启用", prop: "isEnabled", slot: "isEnabled", width: 90 },
  { label: "上次登录时间", prop: "lastLoginTime", width: 160 },
  { label: "备注", prop: "secretRemarks" }
];

columns.value = setColumn({ columnData, operationColumn: { hide: false } });

onMounted(() => {
  getQueryuser();
  getSecretList();
});

const getSecretList = () => {
  loading2.value = true;
  getUserSecretKeys({ id: userStore.userInfo.id })
    .then((res: any) => {
      if (res.data) {
        dataList.value = res.data;
      }
    })
    .finally(() => (loading2.value = false));
};

const getQueryuser = () => {
  loading.value = true;
  queryuser()
    .then((res) => {
      const data = res.data;
      const userState = UserState[data.userState];
      newFormInline.value = { ...data, userState };
    })
    .catch(console.log)
    .finally(() => (loading.value = false));
};

const onSubmitChange = (type: string, title: string, data, callback) => {
  loading2.value = true;

  insertUserSecretKey({
    id: "",
    isEnabled: true,
    ...data
  })
    .then((res: any) => {
      if (res.data) {
        callback();
        secretBackValue.value = res.data;
        dialogVisible.value = true;
      }
    })
    .finally(() => (loading2.value = false));
};

const onAdd = () => {
  addDialog({
    title: `新增密钥`,
    props: {
      formInline: _formData,
      formRules: formRules,
      formProps: { labelWidth: 90 },
      formConfigs: formConfigs()
    },
    width: "450px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      FormRef.validate(async (valid) => {
        if (valid) {
          showMessageBox("确认要新增吗?").then(() => {
            onSubmitChange("add", "新增密钥", _formData, () => {
              done();
              getSecretList();
            });
          });
        }
      });
    }
  });
};

const reSetSecret = (row) => {
  resetRow.value = row;
  showMessageBox(`确认要重新生成名称为【${row.name}】的秘钥吗?`)
    .then(() => {
      isReset.value = true;
      loading2.value = true;
      reGenerateUserSecretKey({ id: row.id }).then((res: any) => {
        if (res.data) {
          secretBackValue.value = res.data;
          dialogVisible.value = true;
          getSecretList();
        }
      });
    })
    .catch(() => {})
    .finally(() => (loading2.value = false));
};

const onDel = (row) => {
  showMessageBox(`确认要删除名称为【${row.name}】的秘钥吗?`)
    .then(() => {
      loading2.value = true;
      deleteUserSecretKey({ id: row.id }).then((res) => {
        if (res.data) {
          ElMessage({ message: `删除成功`, type: "success" });
          getSecretList();
        }
      });
    })
    .catch(() => {})
    .finally(() => (loading2.value = false));
};

const closeHander = () => {
  dialogVisible.value = false;
  _formData = {};
};

const onAuth = () => {
  const isPass = localStorage.getItem("secret_auth");

  if (isPass) {
    onAdd();
    return;
  }

  addDialog({
    title: `身份验证`,
    props: {
      formInline: _formData2,
      formRules: formRules2,
      formProps: { labelWidth: 90 },
      formConfigs: formConfigs2()
    },
    width: "450px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    beforeClose(done) {
      _formData2.password = "";
      done();
    },
    beforeCancel(done) {
      _formData2.password = "";
      done();
    },
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      FormRef.validate(async (valid) => {
        if (valid) {
          const password = md5(_formData2.password).substr(8, 16).toUpperCase();
          authBeforeAdd({ password, userNo: _formData2.userNo }).then((res) => {
            if (res.data) {
              ElMessage({ message: "验证成功", type: "success" });
              localStorage.setItem("secret_auth", "1");
              done();
              onAdd();
            }
          });
        }
      });
    }
  });
};

const updateBaseUserInfo = (type) => {
  const title = type === "k3" ? "金蝶" : "群晖";
  // 组装请求参数
  const reqParams: any = {
    id: userStore.userInfo.id
  };
  if (type === "k3") {
    reqParams.k3UserAccount = newFormInline.value.k3UserAccount;
  } else {
    reqParams.qunhuiAccount = newFormInline.value.qunhuiAccount;
    reqParams.qunhuiPassword = newFormInline.value.qunhuiPassword;
  }
  showMessageBox(`确认要更新${title}信息吗?`).then(() => {
    userInfoUpdate(reqParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "更新成功", type: "success" });
        getQueryuser();
      }
    });
  });
};
</script>

<template>
  <div>
    <div style="width: 84%; padding-top: 20px; margin: auto">
      <EditForm
        ref="baseFormRef"
        :formConfigs="formBaseConfigs(updateBaseUserInfo)"
        :formInline="newFormInline"
        :formProps="{ inline: true }"
        :formRules="formBaseRules"
      />
    </div>
    <div style="width: 84%; padding-left: 180px; margin-top: 30px">
      <div style="margin-bottom: 8px">
        <el-button type="primary" size="small" @click="onAuth">新增</el-button>
      </div>
      <pure-table
        id="userSecret"
        border
        :height="maxHeight"
        :adaptive="true"
        align-whole="left"
        :loading="loading2"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <template #isEnabled="{ row }">
          {{ row.isEnabled ? "启用" : "停止" }}
        </template>

        <template #operation="{ row }">
          <div style="text-align: left">
            <el-space :size="12">
              <el-button type="danger" size="small" @click="onDel(row)">删除</el-button>
              <el-button type="warning" size="small" @click="reSetSecret(row)">重新生成</el-button>
            </el-space>
          </div>
        </template>
      </pure-table>
    </div>

    <el-dialog :before-close="closeHander" v-model="dialogVisible" title="密钥生成成功" width="30%">
      <span>此次为【{{ isReset ? resetRow.name : _formData.name }}】生成的密钥为：{{ secretBackValue }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeHander">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-input.is-disabled .el-input__inner, .el-input.is-disabled) {
  color: inherit;
  -webkit-text-fill-color: inherit;
  cursor: default;

  &.el-input__wrapper {
    cursor: default;
  }
}
</style>
