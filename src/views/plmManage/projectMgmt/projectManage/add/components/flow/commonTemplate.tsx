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

  return {
    clickOtherDeliverName,
    openAuditRecordSheet,
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
