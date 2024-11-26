import { h, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import loseModeListDetail from "@/views/plmManage/projectMgmt/loseModeList/detail/index.vue";
import handleAuditSheetDetail from "@/views/plmManage/projectMgmt/handleAudit/detail/index.vue";
import buildDesignDetail from "@/views/plmManage/projectMgmt/buildDesignCheck/detail/index.vue";
import idDesignDetail from "@/views/plmManage/projectMgmt/idDesignCheck/detail/index.vue";
import idDetail from "@/views/plmManage/projectMgmt/idEffect/detail/index.vue";
import HandleMakeSheet from "./handleMakeSheet/index.vue";
import DesignInputSheet from "./designInputSheet/index.vue";
import auditRecordDetail from "@/views/plmManage/projectMgmt/auditRecord/detail/index.vue";
import tryApplySheetDetail from "@/views/plmManage/projectMgmt/trialProd/detail/index.vue";
import moldDesignSheetDetail from "@/views/plmManage/projectMgmt/moldDesignAudit/detail/index.vue";
import tryMoldNoticeDetail from "@/views/plmManage/projectMgmt/tryMoldNotice/detail/index.vue";
import partSampleApplyDetail from "@/views/plmManage/projectMgmt/partApply/detail/index.vue";
import editFixMoldConfirmDetail from "@/views/plmManage/projectMgmt/editAndFixMold/detail/index.vue";
import moldEditHistorySheetDetail from "@/views/plmManage/projectMgmt/moldHistory/detail/index.vue";
import seriesComparisonSheetDetail from "@/views/plmManage/projectMgmt/seriesComparison/detail/index.vue";
import budgetApplySheetDetail from "@/views/plmManage/projectMgmt/budgetApply/detail/index.vue";
import customerSheetDetail from "@/views/plmManage/projectMgmt/customerSatisfaction/detail/index.vue";
import sampleTestApplySheetDetail from "@/views/plmManage/projectMgmt/sampleTestApply/detail/index.vue";
import pmImproveProcessSheetDetail from "@/views/plmManage/projectMgmt/pmProgress/detail/index.vue";
import ceControlDetail from "@/views/plmManage/projectMgmt/ceControlList/detail/index.vue";
import admitBookDetail from "@/views/plmManage/projectMgmt/admitBookList/detail/index.vue";
import publicPartDetail from "@/views/plmManage/projectMgmt/publicAndReferList/detail/index.vue";
import fixtureMakeApplyDetail from "@/views/plmManage/projectMgmt/fixtureMakeApply/detail/index.vue";
import designChangeApplyDetail from "@/views/plmManage/projectMgmt/designChangeApply/detail/index.vue";
import tryMeetCheckDetail from "@/views/plmManage/projectMgmt/preTrialMeetCheck/detail/index.vue";
import devWorkTimeFeeTotalDetail from "@/views/plmManage/projectMgmt/devWorkTimeTotal/detail/index.vue";
import sampleMakePlanAndListDetail from "@/views/plmManage/projectMgmt/sampleMakePlanAndList/detail/index.vue";

export const useCommonTemplate = () => {
  const onEditDeliver7 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}失效模式清单`,
      class: "lose-mode-list",
      width: "1700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(loseModeListDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.tableConfList, "tableConfList===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const clickOtherDeliverName = (item) => {
    console.log(item.generalTemplateVO?.remark, "item.generalTemplateVO?.remark");
    addDialog({
      title: `查看【${item.deliverableName}】信息`,
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      hideItem: ["ok"],
      contentRenderer: () =>
        h(item.generalTemplateVO?.remark ? <div style={{ whiteSpace: "pre-line" }}>{item.generalTemplateVO?.remark}</div> : <div>暂无信息</div>),
      beforeSure: (done, { options }) => done()
    });
  };

  const onEditDeliver5 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}结构设计点检表`,
      class: "build-sign-modal-sheet",
      width: "1500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(buildDesignDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value._formData, "_formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const onEditDeliver4 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}ID设计评审点检表`,
      class: "id-sign-audit-modal",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(idDesignDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value._formData, "_formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const onEditDeliver6 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}手板评审表`,
      class: "hanlde-audit-modal-sheet",
      width: "1450px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(handleAuditSheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value._formData, "_formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const onEditDeliver3 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}ID外观效果图`,
      class: "id-effect-modal",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(idDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value._formData, "_formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  // 手板清单制作模版
  const openHandleMake = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow) => {
    const handleRef = ref();
    addDialog({
      title: `手板制作申请单`,
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {},
      contentRenderer: () => h(HandleMakeSheet, { ref: handleRef }),
      beforeSure: (done, { options }) => {
        const modalRef = handleRef.value;
        modalRef.formRef.getRef().validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                console.log(modalRef.formData, "收集数据");
                message("接口未完善", { type: "warning" });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  // 产品设计输入表
  const openInputSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow) => {
    const inputSheetRef = ref();
    addDialog({
      title: `产品设计输入表`,
      width: "1500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {},
      contentRenderer: () => h(DesignInputSheet, { ref: inputSheetRef }),
      beforeSure: (done, { options }) => {
        const modalRef = inputSheetRef.value;
        modalRef.formRef.getRef().validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                console.log(modalRef.formData, "收集数据");
                message("接口未完善", { type: "warning" });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  // 评审记录表
  const openAuditRecordSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}评审记录表`,
      class: "audit-record-sheets",
      width: "1300px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(auditRecordDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.formData, "formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const openTryApplySheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}试产申请单`,
      class: "try-apply-sheets",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tryApplySheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.formData, "formData===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const moldDesignAuditSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}模具设计评审表`,
      class: "mold-design-audit-sheets",
      width: "1500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(moldDesignSheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "dataInfo...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const tryMoldNotice = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}试模通知书`,
      class: "try-mold-notice-modal",
      width: "1400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tryMoldNoticeDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.formData, "formData...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const partSampleApply = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}零部件打样申请表`,
      class: "part2-apply-modal",
      width: "1700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(partSampleApplyDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const editAndFixMoldConfirmOrder = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}改模修模确认单`,
      class: "edit-fix-order-modal",
      width: "1100px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editFixMoldConfirmDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const moldEditHistory = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}模具修改履历表`,
      class: "mole-edit-history-sheet-modal",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(moldEditHistorySheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const seriesComparison = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}系列产品对照表`,
      class: "series-product-comparison-modal",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(seriesComparisonSheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const budgetApplySheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}项目预算申请表`,
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(budgetApplySheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const customerCheckSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}客户满意度调查表`,
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(customerSheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const sampleTestApplySheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}样机测试申请表`,
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(sampleTestApplySheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const pmImproveProcessSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}项目改善进程表`,
      width: "1800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(pmImproveProcessSheetDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const ceProductControlList = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}CE产品认证管控清单`,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ceControlDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const admitBookList = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}承认书清单`,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(admitBookDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const publicPartAndList = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}共用件及参考清单`,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(publicPartDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const fixtureMakeApplySheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}治夹具制作申请表`,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(fixtureMakeApplyDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const designChangeApplySheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}设计变更申请单`,
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(designChangeApplyDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const tryMeetCheckSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}试产前会议点检表`,
      width: "1600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tryMeetCheckDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const devWorkTimeFeeTotalSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}研发工时及费用统计表`,
      width: "1400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(devWorkTimeFeeTotalDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const sampleMakePlanAndListSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const detailRef = ref();

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    addDialog({
      title: `${titleMap[actionType]}样品制作计划与清单`,
      width: "1800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(sampleMakePlanAndListDetail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef...===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  return {
    clickOtherDeliverName,
    devWorkTimeFeeTotalSheet,
    sampleMakePlanAndListSheet,
    designChangeApplySheet,
    fixtureMakeApplySheet,
    publicPartAndList,
    tryMeetCheckSheet,
    admitBookList,
    ceProductControlList,
    pmImproveProcessSheet,
    sampleTestApplySheet,
    budgetApplySheet,
    customerCheckSheet,
    moldEditHistory,
    openAuditRecordSheet,
    seriesComparison,
    editAndFixMoldConfirmOrder,
    openTryApplySheet,
    tryMoldNotice,
    moldDesignAuditSheet,
    partSampleApply,
    onEditDeliver7,
    openHandleMake,
    openInputSheet,
    onEditDeliver3,
    onEditDeliver4,
    onEditDeliver5,
    onEditDeliver6
  };
};
