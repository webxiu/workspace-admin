/*
 * @Author: lixiuhai
 * @Date: 2023-06-30 13:34:49
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-06-30 14:31:24
 */
import { ElMessage, ElMessageBox } from "element-plus";
import { PasswordType, updatePassword } from "@/api/user";
import { h, ref } from "vue";

import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";
import { getLoginInfo } from "@/utils/storage";
import md5 from "md5";

export function usePassword() {
  const formRef = ref();
  const formData = ref();
  const loading = ref(true);

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  // 修改密码
  function openDialog() {
    const loginInfo = getLoginInfo();
    addDialog({
      title: "修改密码",
      props: {
        formInline: {
          id: loginInfo.id,
          oldPassword: "",
          newPassword: ""
        }
      },
      width: "80%",
      style: { maxWidth: "400px" },
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as PasswordType;
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => onSubmitPassword(curData, () => done()))
              .catch(() => {});
          }
        });
      }
    });
  }

  // 提交修改
  const onSubmitPassword = (data: PasswordType, callback) => {
    const oldPassword = md5(data.oldPassword.trim()).substr(8, 16).toUpperCase();
    const newPassword = md5(data.newPassword.trim()).substr(8, 16).toUpperCase();
    updatePassword({ id: data.id, oldPassword, newPassword })
      .then((res) => {
        if (res.status !== 200) throw res.message;
        callback();
        ElMessage.success("密码修改成功");
      })
      .catch((err) => {
        ElMessage.error("密码修改失败");
        console.log("err", err);
      });
  };

  return { formData, loading, resetForm, openDialog };
}
