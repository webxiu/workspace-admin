import { LOGIN_INFO, setCookie, setKkViewInfo, useLocalStorage } from "@/utils/storage";
import { LoginAppInfoType, fetchkkViewIpUrl, getCode, queryLoginParamsInfo, submitResetPassword } from "@/api/user/user";
import { debounce, getUrlParameters } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { getTopMenu, initRouter } from "@/router/utils";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import md5 from "md5";
import { message } from "@/utils/message";
import { orgHostMap } from "@/config";
import { useAppStore } from "@/store/modules/app";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";

export interface LoginInfoType {
  userNo: string;
  password: string;
  remember: boolean;
}

const { getItem, setItem, removeItem } = useLocalStorage<LoginInfoType>(LOGIN_INFO);
let timer;

export const useConfig = () => {
  const formRef = ref();
  const router = useRouter();
  const loading = ref(false);
  const loginInfo = getItem();
  const activeName = ref("account");
  const countdown = ref<number>(0);
  const ruleFormRef = ref<FormInstance>();
  const baseAPI = import.meta.env.VITE_BASE_API;
  const clientInfo = ref<Partial<LoginAppInfoType>>({});

  const ruleForm = reactive<LoginInfoType>({
    userNo: loginInfo.userNo,
    password: loginInfo.password,
    remember: loginInfo.remember
  });
  const formData = reactive({
    userCode: "",
    phone: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const clientList = reactive([
    { name: "Win-64", prop: "clientPathWin", href: "" },
    { name: "Win-32", prop: "clientPathWin32", href: "" },
    { name: "MacOS", prop: "clientPathMac", href: "" },
    { name: "Esop-App", prop: "esopPath", href: "" }
  ]);

  onMounted(() => fetchInitConfigInfo());

  // 获取配置
  const fetchInitConfigInfo = () => {
    queryLoginParamsInfo({})
      .then(({ data }) => {
        if (data) {
          const { orgShortName, orgName, logoUrl } = data;
          clientInfo.value = data;
          clientList.forEach((m) => data[m.prop] && (m.href = baseAPI + data[m.prop]));
          useAppStore().setAppConfig({ title: orgShortName, logo: baseAPI + logoUrl, orgName });
          getWxQrcode(data);
        }
      })
      .catch(console.log);
  };

  // 企业微信二维码
  function getWxQrcode(data: LoginAppInfoType) {
    window.wxlogin({
      id: "wx_qrcode",
      appid: data.appid,
      agentid: data.agentid,
      redirect_uri: location.origin + "/#/login",
      state: ""
    });
  }

  // 获取文件预览地址
  function getKkViewUrl() {
    fetchkkViewIpUrl({}).then(({ data }) => data && setKkViewInfo(data));
  }
  // 登录
  const onLogin = debounce(async (formEl?: FormInstance) => {
    if (!formEl) return;
    loading.value = true;
    await formEl.validate((valid, fields) => {
      if (valid) {
        const orgDomain = orgHostMap[location.hostname] || location.hostname;
        const password = md5(ruleForm.password).substr(8, 16).toUpperCase();
        const params = { userNo: ruleForm.userNo, password, orgDomain };
        useUserStoreHook()
          .login(params)
          .then(async (res) => {
            //获取全局kkview预览地址
            getKkViewUrl();
            onSaveLoginInfo();
            const { routes } = await initRouter(); // 需要调用此方法初始化路由
            const linkPath = location.href.split("redirect=")[1];
            const redirect = linkPath ? decodeURIComponent(linkPath) : linkPath;
            const menuPath = redirect.split("?")[0]; // 检测是否有权限跳转
            const hasAuth = routes.find((item) => item.path === menuPath);
            if (hasAuth) {
              const query = getUrlParameters(redirect);
              router.push({ path: menuPath, query: { ...query, redirect: true } });
            } else {
              router.push(getTopMenu(true).path);
            }
            message.success("登录成功");
            loading.value = false;
          })
          .catch((err) => (loading.value = false));
      } else {
        loading.value = false;
        return fields;
      }
    });
  });

  function onSaveLoginInfo() {
    if (ruleForm.remember) {
      setItem(ruleForm);
    } else {
      removeItem();
    }
  }

  // 重置密码获取验证码
  function getTelCode() {
    formRef.value.getRef().validateField(["phone"], async (valid: boolean) => {
      if (valid) {
        getCode(formData.phone).then((res) => {
          if (res.data) {
            message.success("验证码发送成功");
            countdown.value = 59;
            timer = setInterval(() => {
              countdown.value = --countdown.value;
              if (countdown.value <= 0) {
                clearInterval(timer);
              }
            }, 1000);
          }
        });
      } else {
        message.error("请输入正确的手机号");
      }
    });
  }

  // 忘记密码
  function onForgetPassword() {
    addDialog({
      title: "重置密码",
      props: {
        formInline: formData,
        formRules: formRules(formData),
        formProps: { labelWidth: "80px" },
        formConfigs: formConfigs({ getTelCode, countdown })
      },
      width: "500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: () => formRef.value.getRef().resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                const newPassword = md5(formData.newPassword).substr(8, 16).toUpperCase();
                const confirmPassword = md5(formData.confirmPassword).substr(8, 16).toUpperCase();
                submitResetPassword({ ...formData, newPassword, confirmPassword }).then((res) => {
                  if (res.data) {
                    message.success("重置密码成功");
                    done();
                  }
                });
              })
              .catch(() => (loading.value = false));
          }
        });
      }
    });
  }

  return { ruleFormRef, ruleForm, loading, activeName, clientList, clientInfo, onLogin, onForgetPassword };
};
