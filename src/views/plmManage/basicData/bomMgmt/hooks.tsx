import { ElMessage, ElMessageBox } from "element-plus";
import {
  backBomData,
  exportProjectBomTableData,
  fetchBomDetailData,
  fetchBomLeftTreeData,
  insertBomTableData,
  pushDownBomData,
  submitBomData,
  updateBomTableData
} from "@/api/plmManage";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import dayjs from "dayjs";
import { debounce, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { getUserInfo } from "@/utils/storage";
import { useMaterialTable } from "./components/selectMaterialConfig";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useUserStore } from "@/store/modules/user";

export const useConfig = () => {
  const { handleSelectAction } = useMaterialTable();

  const router = useRouter();
  const route = useRoute();
  const activeNames = ref(["1"]);
  const loading = ref(false);
  const formRef = ref();
  const addTableRef = ref(null);
  const treeSelectData = ref([]);
  const opts: any = ref({});
  const userStore = useUserStore();
  const closeFlag = ref("");
  const nowDay = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const detailInfo: any = ref({});
  const tableList = ref([]);

  const formData = reactive({
    materialNumber: "",
    materialName: "",
    materialId: "",
    specification: "",
    number: "",
    groupId: "",
    createUserName: userStore.userInfo.userName,
    createDate: nowDay,
    modifyUserName: "",
    remark: "",
    modifyDate: "",
    name: "",
    id: ""
  });

  const onLoadFormData = (data) => {
    const fData = data.formData;
    tableList.value = data.tableData;
    if (data.type === "load") {
      Object.keys(formData).forEach((key) => {
        if (fData[key]) formData[key] = fData[key];
      });
    }
  };

  const copyBom = () => {
    if (route.query.type === "edit" || route.query.type === "view") {
      router.push(`/plmManage/basicData/bomMgmt/add?id=${route.query.id}&type=add&isNewTag=yes&menuId=${route.query.menuId}`);
      return;
    }

    handleSelectAction("single", (row) => {
      router.push(`/plmManage/basicData/bomMgmt/add?id=${row.id}&type=add&isNewTag=yes&menuId=${route.query.menuId}`);
    });
  };

  const submitAction = () => {
    ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        submitBomData({ id: route.query.id })
          .then((res) => {
            if (res.data) {
              ElMessage({ message: "提交成功", type: "success" });
              queryOneData(route.query.id);
              router.push(`/plmManage/basicData/bomMgmt/view?id=${route.query.id}&type=view&isNewTag=yes&menuId=${route.query.menuId}`);
              useMultiTagsStoreHook().handleTags("splice", "/plmManage/basicData/bomMgmt/edit");
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(() => {});
  };

  const backAction = () => {
    ElMessageBox.confirm(`确认要回退吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;

        backBomData({ id: route.query.id })
          .then((res) => {
            if (res.data) {
              ElMessage({ message: "回退成功", type: "success" });
              router.push(`/plmManage/basicData/bomMgmt/edit?id=${route.query.id}&type=edit&isNewTag=yes&menuId=${route.query.menuId}`);
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(() => {});
  };

  const pushAction = () => {
    ElMessageBox.confirm(`确认要下推吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        pushDownBomData({ id: route.query.id })
          .then((res) => {
            if (res.data) {
              ElMessage({ message: "下推成功", type: "success" });
              router.push(`/plmManage/basicData/bomMgmt/index?menuId=${route.query.menuId}`);
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(() => {});
  };

  const printAction = () => {
    router.push(`/plmManage/basicData/bomMgmt/print?id=${route.query.id}&menuId=${route.query.menuId}`);
  };

  const exportDetail = () => {
    exportProjectBomTableData({ id: route.query.id }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        const resFileName = fileName.split("_").slice(1).join("_");
        downloadFile(res.data, resFileName);
      }
    });
  };

  const handleChange = (val: string[]) => {
    closeFlag.value = val["0"];
    addTableRef.value.maxHeight = closeFlag.value ? "56vh" : "74.5vh";
  };

  const addItemInfo = (data) => {
    const modelList = tableList.value;
    console.log(modelList, "list");
    // return;
    if (!modelList.length) {
      ElMessage({ message: "子物料表格不能为空", type: "warning" });
      return;
    }
    ElMessageBox.confirm("确认进行保存？", "", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    })
      .then(() => {
        loading.value = true;
        const addItemName = (type, opts, item) => opts.find((el) => el.optionValue == item[type])?.optionName;

        const unitStore = localStorage.getItem("itemUnitOptions") || "[]";
        const dosageStore = localStorage.getItem("dosageTypeOptions") || "[]";
        const issueStore = localStorage.getItem("issueTypeOptions") || "[]";

        const bomInfoEntryList = modelList.map((item, index) => ({
          ...item,
          sequence: index + 1,
          itemUnitName: addItemName("itemUnit", JSON.parse(unitStore), item),
          dosageTypeName: addItemName("dosageType", JSON.parse(dosageStore), item),
          issueTypeName: addItemName("issueType", JSON.parse(issueStore), item)
        }));

        // 组装请求参数
        const reqData = {
          bomInfoEntryList,
          ...data
        };

        const typeApi = route.query.type === "add" ? insertBomTableData : updateBomTableData;

        typeApi(reqData)
          .then((res) => {
            if (res.data) {
              ElMessageBox.confirm("保存成功,继续或返回？", "温馨提示", {
                confirmButtonText: "继续",
                cancelButtonText: "返回",
                type: "success"
              })
                .then(() => {})
                .catch(() => {
                  router.push("/plmManage/basicData/bomMgmt/index?menuId=" + route.query.menuId);
                });
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(() => {});
  };

  // 保存
  const submit = () => {
    formRef.value.getRef().validate((valid) => {
      if (valid) {
        const isPassTableFormItem = addTableRef.value.dataList.every((item) => {
          const reg = /^[1-9]\d*$/;
          const passFlag = reg.test(item.numerator) && reg.test(item.denominator);

          if (!passFlag) ElMessage({ message: `料号${item.number}的分子或分母不是整数`, type: "error" });

          return passFlag;
        });
        if (isPassTableFormItem) {
          addItemInfo(formData);
        }
      } else {
        console.log("验证失败");
      }
    });
  };

  const queryOneData = debounce((id) => {
    if (id) {
      if (addTableRef.value) addTableRef.value.loading = true;
      fetchBomDetailData({ id })
        .then((res: any) => {
          if (res.data) {
            detailInfo.value = res.data;
            const keys = Object.keys(formData);
            for (const item of keys) {
              if (item === "groupId") {
                formData[item] = res.data[item] + "";
              } else {
                if (route.query.id && route.query.type === "add") {
                  formData[item] = res.data[item];
                  formData.createUserName = getUserInfo().userName;
                  formData.createDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
                } else {
                  formData[item] = res.data[item];
                }
              }
            }

            if (addTableRef.value) {
              const tableData =
                res.data.bomInfoEntryList.map((item) => ({
                  ...item,
                  dosageType: item.dosageType + "",
                  issueType: item.issueType + ""
                })) || [];
              addTableRef.value.dataList = tableData;
              addTableRef.value.dataListTemp = tableData;
            }
            addTableRef.value.loading = false;
          }
        })
        .catch(() => {
          if (addTableRef.value) addTableRef.value.loading = false;
        });
    }
  }, 300);

  onMounted(() => {
    fetchBomLeftTreeData({}).then((res: any) => {
      treeSelectData.value = res.data.bomGroupSelectTree[0]?.children;
    });
  });

  return {
    opts,
    loading,
    formData,
    activeNames,
    route,
    router,
    formRef,
    addTableRef,
    detailInfo,
    treeSelectData,
    onLoadFormData,
    submit,
    copyBom,
    submitAction,
    backAction,
    pushAction,
    exportDetail,
    printAction,
    handleChange
  };
};
