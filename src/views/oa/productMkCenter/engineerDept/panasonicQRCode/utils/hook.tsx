/*
 * @Author: Hailen
 * @Date: 2024-05-08 13:43:03
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-14 14:22:02
 */

import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import {
  PanasonicQrcodeItemType,
  addPanasonicQrcode,
  deletePanasonicQrcode,
  getPanasonicQrcodeList,
  updatePanasonicQrcode
} from "@/api/oaManage/productMkCenter";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import { computed, h, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { editFormConfigs, formConfigs, formRules } from "./config";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import Print from "@/utils/print";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";

export const useConfig = () => {
  const printRef = ref();
  const codeUrl = ref("");
  const loading = ref<boolean>(false);
  const initDate = dayjs().format("YYYYMMDD");
  const qrCodeList = ref<PanasonicQrcodeItemType[]>([]);
  const baseUrl = "https://club.panasonic.jp/r/?v=1&h=";

  const formData = reactive({
    model: "",
    dateTime: initDate,
    mfgModel: initDate.slice(-5),
    link: ""
  });

  const printTitle = computed(() => {
    const isMac = /Mac/.test(navigator.platform);
    return isMac ? "⌘ + p" : "Ctrl + p";
  });

  onMounted(() => {
    getTableList();
    window.addEventListener("keydown", registerPrint);
  });
  onUnmounted(() => {
    window.removeEventListener("keydown", registerPrint);
  });

  watch(formData, (val) => {
    generateQR(val.link).then((png) => (codeUrl.value = png));
  });

  function getTableList() {
    getPanasonicQrcodeList({})
      .then(({ data }) => {
        qrCodeList.value = data || [];
        formData.model = data[0]?.model;
        updateUrl();
      })
      .catch(console.log);
  }

  // 注册打印快捷键
  function registerPrint(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === "p") {
      e.preventDefault();
      onPrint();
    }
  }

  // 生成二维码
  function generateQR(text: string) {
    return new Promise<string>((resolve) => {
      const opts: QRCodeToDataURLOptions = {
        type: "image/png",
        errorCorrectionLevel: "M",
        color: { dark: "#000", light: "#fff" },
        maskPattern: 2,
        margin: 1
      };
      QRCode.toDataURL(text, opts)
        .then((png) => resolve(png))
        .catch(() => resolve(""));
    });
  }

  // 修改地址
  function updateUrl() {
    const url = baseUrl + formData.model + "&s=" + formData.mfgModel;
    formData.link = url;
  }

  // 选择日期
  function onDateChange(val) {
    formData.mfgModel = val.slice(-5);
    updateUrl();
  }

  // 选择品番
  function onChangeModel(model) {
    formData.model = model;
    updateUrl();
  }

  // 获取选中品番数据
  const getRow = () => {
    const row = qrCodeList.value.find(({ model }) => model === formData.model);
    return row;
  };

  // 打印
  function onPrint() {
    if (qrCodeList.value.length === 0) {
      return message("品番列表为空, 请添加后重试", { type: "error" });
    }
    if (!formData.link) {
      return message("二维码地址不能为空", { type: "error" });
    }
    nextTick(() => Print(printRef.value));
  }

  // 添加品番
  function onAdd() {
    openDialog("add");
  }

  // 修改品番
  function onEdit() {
    const row = getRow();
    if (!row) {
      return message("请选择品番", { type: "error" });
    }
    openDialog("edit", row);
  }

  function openDialog(type: "add" | "edit", row?: PanasonicQrcodeItemType) {
    const formRef = ref();
    const title = { add: "新增", edit: "修改" }[type];
    const modelData = reactive({ model: row?.model ?? "", baseUrl: baseUrl });

    addDialog({
      title: `${title}品番`,
      props: {
        formInline: modelData,
        formRules: formRules,
        formProps: { labelWidth: "80px" },
        formConfigs: editFormConfigs()
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef?.validate((valid) => {
          if (valid) {
            const reqApi = { add: addPanasonicQrcode, edit: updatePanasonicQrcode };
            showMessageBox("确认要提交吗?").then(() => {
              reqApi[type]({ ...row, ...modelData })
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message(`${title}成功`);
                  } else {
                    message(`${title}失败`, { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  // 删除品番
  function onDelete() {
    const row = getRow();
    if (!row) {
      return message("请选择品番", { type: "error" });
    }
    showMessageBox(`确认要删除品番【${row.model}】吗?`).then(() => {
      deletePanasonicQrcode({ id: row.id })
        .then((res) => {
          if (res.data) {
            getTableList();
            message("删除成功");
          } else {
            message("删除失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete }
  ]);

  return { loading, codeUrl, formData, printRef, printTitle, qrCodeList, buttonList, formConfigs, onDateChange, onChangeModel, onPrint };
};
