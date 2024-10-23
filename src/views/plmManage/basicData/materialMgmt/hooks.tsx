import { ElMessage, ElMessageBox } from "element-plus";
import {
  addMaterialInfo,
  fetchMaterialList,
  getBOMTableRowSelectOptions,
  getMaterialGroupTreeData,
  updateMaterialInfo,
  uploadMaterialImg
} from "@/api/plmManage";
import { onMounted, reactive, ref } from "vue";

import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getUserInfo } from "@/utils/storage";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";

export const useConfig = (props) => {
  const userStore = useUserStore();
  const nowDay = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const route = useRoute();
  const router = useRouter();
  const newHistoryData: any = ref({});
  const formRef = ref();
  const loading = ref(false);
  const opts: any = ref({});
  const formData = reactive({
    number: route.query.code == "0" ? "" : route.query.code,
    name: "",
    oldCode: "",
    specification: "",
    model: "",
    billNo: "",
    productType: "",
    baseUnit: "",
    customerProvided: "0",
    purchaseUnit: "",
    stockUnit: "",
    saleUnti: "",
    file: "",
    imageName: "",
    imageUrl: "",
    warehouse: "",
    materialType: "",
    goodsType: "",
    nation: "V0",
    materialGroup: "",
    remark: "",
    erpClsid: "",
    manufacturingShop: "",
    createUserName: userStore.userInfo.userName,
    createDate: nowDay,
    modifyUserName: "",
    modifyDate: "",
    id: "",
    createUserId: 1384843,
    cbcertification: 0,
    goodName: "",
    goodModel: "",
    materialPropList: [],
    goodColor: ""
  });

  const fetchOptionList = async (optioncode) => {
    let selectArr = [];
    await getBOMTableRowSelectOptions({ optioncode }).then((res) => {
      selectArr = (res.data as any) || [];
    });
    return selectArr;
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
          const fd = new FormData();
          fd.append("file", formData.file);
          const copyData = cloneDeep(formData);
          copyData.createDate = undefined;
          copyData.modifyDate = undefined;
          if (route.query.type === "edit") {
            copyData.modifyUserName = userStore.userInfo.userName;
            copyData.modifyUserId = userStore.userInfo.id;
          }
          if (formData.file) {
            uploadMaterialImg(fd)
              .then((resp) => {
                if (resp.data) {
                  copyData.file = "";
                  copyData.imageName = resp.data;
                  updateMaterialInfo({ ...copyData })
                    .then((res) => {
                      if (res.data) {
                        // ElMessage({
                        //   message: "操作成功",
                        //   type: "success"
                        // });
                        console.log("0");

                        ElMessageBox.confirm("保存成功,继续操作或返回？", "温馨提示", {
                          confirmButtonText: "继续",
                          cancelButtonText: "返回",
                          type: "success"
                        })
                          .then(() => {
                            // done();
                            if (route.query.type !== "edit") {
                              router.push(
                                `/plmManage/basicData/materialMgmt/add?id=${res.data}&type=view&number=${route.query.number}&code=${route.query.code}&isNewTag=yes&menuId=${route.query.menuId}`
                              );
                            }
                          })
                          .catch(() => {
                            router.push("/plmManage/basicData/materialMgmt/index?menuId=" + route.query.menuId);
                          });
                      }
                    })
                    .finally(() => (loading.value = false));
                }
              })
              .finally(() => (loading.value = false));
          } else {
            res = updateMaterialInfo({ ...copyData });
          }

          res
            .then((resp) => {
              if (resp.data) {
                ElMessageBox.confirm("保存成功,继续操作或返回？", "温馨提示", {
                  confirmButtonText: "继续",
                  cancelButtonText: "返回",
                  type: "success"
                })
                  .then(() => {
                    if (route.query.type !== "edit") {
                      router.push(
                        `/plmManage/basicData/materialMgmt/add?id=${resp.data}&type=view&number=${route.query.number}&code=${route.query.code}&isNewTag=yes&menuId=${route.query.menuId}`
                      );
                    }
                  })
                  .catch(() => {
                    router.push("/plmManage/basicData/materialMgmt/index?menuId=" + route.query.menuId);
                  });
              }
            })
            .finally(() => (loading.value = false));
        } else {
          const fd = new FormData();
          fd.append("file", formData.file);
          const copyData = cloneDeep(formData);
          copyData.createDate = undefined;
          copyData.modifyDate = undefined;
          if (formData.file) {
            uploadMaterialImg(fd)
              .then((resp) => {
                if (resp.data) {
                  copyData.file = "";
                  copyData.imageName = resp.data;
                  addMaterialInfo({ ...copyData })
                    .then((res) => {
                      if (res.data) {
                        ElMessage({
                          message: "保存成功",
                          type: "success"
                        });
                        router.push(
                          `/plmManage/basicData/materialMgmt/view?id=${res.data}&type=view&number=${route.query.number}&code=${route.query.code}&isNewTag=yes&menuId=${route.query.menuId}`
                        );
                      }
                    })
                    .finally(() => (loading.value = false));
                }
              })
              .finally(() => (loading.value = false));
          } else {
            res = addMaterialInfo({ ...copyData })
              .then((res) => {
                if (res.data) {
                  ElMessage({
                    message: "保存成功",
                    type: "success"
                  });
                  router.push(
                    `/plmManage/basicData/materialMgmt/view?id=${res.data}&type=view&number=${route.query.number}&code=${route.query.code}&isNewTag=yes&menuId=${route.query.menuId}`
                  );
                }
              })
              .finally(() => (loading.value = false));
          }
        }
      })
      .catch(() => {});
  };

  const submit = () => {
    formRef.value
      .getRef()
      .validate()
      .then(() => {
        addMaterial();
      })
      .catch(() => {
        console.log("验证失败");
      });
  };

  const findItemInfo = (key, list = []) => {
    const itemInfo = list.find((item) => item.optionCode === key) || {};
    return itemInfo.optionList || [];
  };

  const initList = async () => {
    loading.value = true;
    const [optionList, groupTreeData] = await Promise.all([
      fetchOptionList("MaterialAttribute,StockType,MaterialType,Warehourse,ProductType,BeOrNot,MaterialUnits"),
      getMaterialGroupTreeData({})
    ]).finally(() => (loading.value = false));
    const productTypeOpts = findItemInfo("ProductType", optionList);
    const basicUnitOpts = findItemInfo("MaterialUnits", optionList);
    const isCustomerProviderOpts = findItemInfo("BeOrNot", optionList);
    const warehourseOpts = findItemInfo("Warehourse", optionList);
    const materialTypeOpts = findItemInfo("MaterialType", optionList);
    const stockTypeOpts = findItemInfo("StockType", optionList);
    const materialAttributeOpts = findItemInfo("MaterialAttribute", optionList);

    opts.value["productTypeOpts"] = productTypeOpts;
    opts.value["basicUnitOpts"] = basicUnitOpts;
    opts.value["isCustomerProviderOpts"] = isCustomerProviderOpts;
    opts.value["warehourseOpts"] = warehourseOpts;
    opts.value["materialTypeOpts"] = materialTypeOpts;
    opts.value["stockTypeOpts"] = stockTypeOpts;
    // opts.value["materialGroupOpts"] = materialGroupOpts;
    opts.value["materialGroupOpts"] = groupTreeData.data[0].children;
    if (route.query.number != "0") formData.materialGroup = route.query.number as string;
    opts.value["materialAttributeOpts"] = materialAttributeOpts;

    const calcFormData = (item, result, formData) => {
      const itemDict = {
        baseUnit: basicUnitOpts,
        stockUnit: basicUnitOpts,
        saleUnti: basicUnitOpts,
        purchaseUnit: basicUnitOpts,
        warehouse: warehourseOpts,
        customerProvided: isCustomerProviderOpts,
        materialType: materialTypeOpts,
        goodsType: stockTypeOpts,
        // materialGroup: materialGroupOpts,
        erpClsid: materialAttributeOpts,
        productType: productTypeOpts
      };
      if (Object.keys(itemDict).includes(item)) {
        formData[item] = itemDict[item].find((el) => el.optionValue == result[item])?.optionValue;
      } else if (/(createDate|modifyDate)/.test(item)) {
        formData[item] = result[item] ?? "";
      } else if (item === "color") {
        formData[item] = result["color"] ?? "";
      } else {
        if (route.query.isClone) {
          formData[item] = result[item];
          formData.createUserName = getUserInfo().userName;
          formData.createDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          formData.modifyDate = "";
          formData.modifyUserName = "";
        } else {
          formData[item] = result[item];
        }
      }
      formData["materialGroup"] = result["materialGroup"] + "";
      if (result["manufacturingShop"]) {
        formData["manufacturingShop"] = result["manufacturingShop"] + "";
      }
      formData.nation = "V0";

      /** 采购物料属性 */
      formData.fFixLeadTime = result.materialOtherVO?.fFixLeadTime;
      formData.fFixLeadTimeType = result.materialOtherVO?.fFixLeadTimeType;
      formData.fVarLeadTime = result.materialOtherVO?.fVarLeadTime;
      formData.fVarLeadTimeType = result.materialOtherVO?.fVarLeadTimeType;
      formData.fCheckLeadTime = result.materialOtherVO?.fCheckLeadTime;
      formData.fCheckLeadTimeType = result.materialOtherVO?.fCheckLeadTimeType;
      formData.fAccuLeadTime = result.materialOtherVO?.fAccuLeadTime;
      formData.fMaxPOQty = result.materialOtherVO?.fMaxPOQty;
      formData.fMinPOQty = result.materialOtherVO?.fMinPOQty;
      formData.fIncreaseQty = result.materialOtherVO?.fIncreaseQty;
      formData.fPlanSafeStockQty = result.materialOtherVO?.fPlanSafeStockQty;

      /** 品质物料属性 */
      formData.fIncSampSchemeId = result.materialOtherVO?.fIncSampSchemeId;
      formData.fIncQcSchemeId = result.materialOtherVO?.fIncQcSchemeId;
      formData.fEnableCyclistQCSTK = result.materialOtherVO?.fEnableCyclistQCSTK;
      formData.fEnableCyclistQCSTKEW = result.materialOtherVO?.fEnableCyclistQCSTKEW;

      /** 生产物料属性 */
      formData.fDailyOutQty = result.materialOtherVO?.fDailyOutQty;
      formData.fDegStandardPersonCount = result.materialOtherVO?.fDegStandardPersonCount;
      formData.fDegCapacity = result.materialOtherVO?.fDegCapacity;
      formData.fPerUnitStandHour = result.materialOtherVO?.fPerUnitStandHour;
      formData.fStandHourUnitId = result.materialOtherVO?.fStandHourUnitId;

      /** 仓库物料属性 */
      formData.fMinIssueQty = result.materialOtherVO?.fMinIssueQty;
    };

    const reqId = route.query.viewId ? route.query.viewId : route.query.id;
    loading.value = false;
    /**
     * reqId|| route.query.materialId
     */
    if (reqId) {
      loading.value = true;
      fetchMaterialList({ page: 1, limit: 100000, id: reqId })
        .then((res: any) => {
          const result = res.data.records[0];
          const keys = Object.keys(formData);
          for (const item of keys) {
            calcFormData(item, result, formData);
          }
        })
        .finally(() => (loading.value = false));
    } else if (props.isView && newHistoryData.value.id) {
      const keys = Object.keys(formData);
      for (const item of keys) {
        calcFormData(item, newHistoryData.value, formData);
      }
    }
  };

  onMounted(() => {
    newHistoryData.value = props.historyData;
    initList();
  });

  return { loading, formData, formRef, opts, submit };
};
