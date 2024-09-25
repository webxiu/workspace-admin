<script lang="tsx">
import { useI18n } from "vue-i18n";
import md5 from "md5";
import { useRouter } from "vue-router";
import { message, showMessageBox } from "@/utils/message";
import { changePassword } from "@/api/user/user";
import { useUserStoreHook } from "@/store/modules/user";
import { reactive, ref, defineComponent, Ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

export default defineComponent({
  props: {},
  setup() {
    const formRef = ref<FormInstance>();
    const loading = ref<boolean>(false);
    const ruleForm = reactive({
      oldpwd: "",
      newpwd: "",
      renewpwd: ""
    });

    const pwdFormConfig = reactive<any[]>([
      { label: "旧的密码", prop: "oldpwd" },
      { label: "新的密码", prop: "newpwd" },
      { label: "确认密码", prop: "renewpwd" }
    ]);
    const router = useRouter();

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== ruleForm.newpwd) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };

    const rules = reactive<FormRules>({
      oldpwd: [
        { required: true, message: "请输入旧密码", trigger: "blur" },
        { min: 3, message: "密码长度不能少于3位" }
      ],
      newpwd: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { min: 3, message: "密码长度不能少于3位" }
      ],
      renewpwd: [{ required: true, validator: validatePass, trigger: "blur" }]
    });

    const submitForm = (formEl?: Ref<FormInstance>) => {
      if (!formEl.value) return;
      formEl.value?.validate((valid) => {
        if (valid) {
          loading.value = true;
          showMessageBox("确认要提交吗?")
            .then(() => {
              const oldpwd = md5(ruleForm.oldpwd).substr(8, 16).toUpperCase();
              const newpwd = md5(ruleForm.newpwd).substr(8, 16).toUpperCase();
              changePassword({ oldpwd, newpwd })
                .then((res) => {
                  message("密码修改成功", { type: "success" });
                  useUserStoreHook().logOut();
                })
                .catch(console.log)
                .finally(() => (loading.value = false));
            })
            .catch(() => (loading.value = false));
        }
      });
    };

    const resetForm = (formEl?: Ref<FormInstance>) => {
      if (!formEl.value) return;
      formEl.value.resetFields();
    };
    return () => (
      <div class="bg-bg_color p-5">
        <el-divider content-position="left">
          密码修改成功后，请重新登陆
          <span class="fz-12 ml-4 color-f00">(初始密码为: 手机号)</span>
        </el-divider>
        <el-form ref={formRef} model={ruleForm} rules={rules} label-width="120px" label-suffix=":" class="mt-10" style={{ width: "45%", minWidth: "400px" }}>
          {pwdFormConfig.map((item) => (
            <el-form-item label={item.label} prop={item.prop} key={item.prop}>
              <el-input v-model={ruleForm[`${item.prop}`]} placeholder={`请输入${item.label}`} type="password" showPassword clearable />
            </el-form-item>
          ))}
          <el-form-item class="mt-10">
            <el-button type="primary" loading={loading.value} onClick={() => submitForm(formRef)}>
              确认保存
            </el-button>
            <el-button onClick={() => resetForm(formRef)}>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    );
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-divider .el-divider__text) {
  font-size: 16px;
}
</style>
