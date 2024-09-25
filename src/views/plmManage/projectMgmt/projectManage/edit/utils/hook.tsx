import {
  fetchAllProjectMsgByProjectId,
  fetchProjectMgmtList,
  fetchProjectTemplateList,
  fetchProjectTemplatePersons,
  submitProjectList,
  updateProjectNewInfo
} from "@/api/plmManage";
import { userInfoList } from "@/api/systemManage";
import { message } from "@/utils/message";
import { getDeptOptions } from "@/utils/requestApi";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { cloneDeep } from "@pureadmin/utils";
import { dayjs, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);

export const usePMEdit = () => {
  const formData: any = reactive({});
  const formRef = ref();
  const activeName = ref("flow");
  const projectModelsOpts = ref([]);
  const treeDeptSelectData = ref([]);
  const userListOpts = ref([]);
  const projectListPageRolesDetailInfo = ref({});
  const productClassifyList = ref([]);
  const sourceRef = ref();
  const taskListRef = ref();

  const route = useRoute();
  const router = useRouter();

  const handleClick = () => {};

  const changeTreeData = (deptId, isInit?) => {
    if (!isInit) {
      formData["projectUserId"] = undefined;
    }
    userInfoList({
      page: 1,
      limit: 1000000,
      deptId,
      userState: "A",
      deptIdList: [deptId]
    }).then((res) => {
      if (res.data) {
        userListOpts.value = res.data.records.map((item) => ({ optionName: item.userName, optionValue: item.id }));
      }
    });
  };

  const getProjectTaskTree = (projectInfo) => {
    const taskList = projectInfo.projectTaskGroupVoList.map((item) => {
      item.projectGroup = {
        duration: item.projectGroup.duration,
        taskVOList: item.taskVOList.sort((a, b) => {
          return a.sort - b.sort;
        }),
        name: item.projectGroup.groupName,
        id: item.projectGroup.id
      };
      return item.projectGroup;
    });

    return taskList;
  };

  const fetchDetailFormData = () => {
    if (route.query.id) {
      fetchAllProjectMsgByProjectId({ id: route.query.id }).then((res: any) => {
        if (res.data) {
          const detailVO = res.data.projectInfoListVO;
          Object.keys(detailVO).forEach((el) => {
            if (el === "deptId") {
              formData[el] = detailVO[el] + "";

              if (detailVO[el]) changeTreeData(detailVO[el], true);
            } else {
              formData[el] = detailVO[el];
            }
          });

          const copyResultData = JSON.parse(JSON.stringify(res.data));
          const treeData = getProjectTaskTree(copyResultData);
          taskListRef.value.dataList = treeData;
        }
      });
    }

    if (route.query.modelId) {
      fetchProjectTemplatePersons({ id: route.query.modelId }).then((res: any) => {
        if (res.data) {
          sourceRef.value.dataList = res.data.projectModelResponsiblePersonnel || [];
          sourceRef.value.dataList2 = res.data.projectModelRelatePersonnel || [];

          setTimeout(() => {
            // 回显项目角色相关数据
            fetchProjectMgmtList({ id: route.query.id }).then((res: any) => {
              if (res.data) {
                const resultData = res.data.records[0] || {};
                projectListPageRolesDetailInfo.value = {
                  responseUsers: resultData.projectModelResponsiblePersonnel,
                  relationUsers: resultData.projectModelRelatePersonnel
                };
                const responeseUser = resultData.projectModelResponsiblePersonnel || [];

                responeseUser.forEach((item) => {
                  sourceRef.value.dataList.forEach((el) => {
                    if (el.id === item.id) el.resUserOptions = item.userInfoVOList[0]?.id;
                  });
                });

                const relationUser = resultData.projectModelRelatePersonnel || [];
                relationUser.forEach((item) => {
                  sourceRef.value.dataList2.forEach((el) => {
                    if (el.id === item.id) el.relateUserOptions = item.userInfoVOList[0]?.id;
                  });
                });
              }
            });
          });
        }
      });
    }
  };

  const fetchOpts = () => {
    fetchProjectTemplateList({ page: 1, limit: 100000 }).then((res: any) => {
      if (res.data) {
        const resultData = res.data.records || [];
        projectModelsOpts.value = resultData.map((item) => ({ optionName: item.projectModelName, optionValue: item.id }));
      }
    });

    getDeptOptions().then((data: any) => {
      treeDeptSelectData.value = data;
    });

    getProductClassifyList({}).then((data) => (productClassifyList.value = data.sort((a, b) => Date.parse(a.createDate) - Date.parse(b.createDate))));
  };

  const onBack = () => {
    router.push("/plmManage/projectMgmt/projectManage/index?menuCode=0&from=/plmManage&menuId=238&menuName=项目管理");
  };

  const onSubmit = () => {
    ElMessageBox.confirm(`确认要提交项目【${formData["projectName"]}】吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        submitProjectList({ id: route.query.id }).then((res) => {
          if (res.data) {
            message("提交成功", { type: "success" });
            const projectId = route.query.id;
            const modelId = route.query.modelId;
            router.replace(`/plmManage/projectMgmt/projectManage/add/index?modelId=${modelId}&id=${projectId}`);
          }
        });
      })
      .catch(console.log);
  };

  const onSave = () => {
    const allTasks = cloneDeep(taskListRef.value.dataList)
      .map((item) => item.taskVOList)
      .flat(Infinity)
      .map((el) => {
        el.projectTaskDeliverableVOList = el.projectTaskDeliverableVOList.filter((item) => item.deliverableTemplateId !== "0");
        return el;
      });
    const isValidDuration = allTasks.some((el) => !Number.isInteger(+el.duration) || +el.duration <= 0);
    const isValidStartDate = allTasks.some((el) => !el.start);

    if (isValidDuration) return message("工期必须是大于零的整数", { type: "error" });
    if (isValidStartDate) return message("开始日期必填", { type: "error" });
    const resUserValidInfo = allTasks.find((el) => !el.projectTaskResponsiblePersonnelVOList?.length);
    const deliveryValidInfo = allTasks.find((el) => !el.projectTaskDeliverableVOList?.length);

    if (resUserValidInfo) return message(`任务【${resUserValidInfo.name}】的责任人不能为空`, { type: "error" });
    if (deliveryValidInfo) return message(`任务【${deliveryValidInfo.name}】的交付物不能为空`, { type: "error" });

    ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        const resUsers = cloneDeep(sourceRef.value.dataList)
          .map((item) => {
            item.userInfoVOList = item.userInfoVOList.filter((el) => el.id === item.resUserOptions);
            return item;
          })
          .map((el) => {
            delete el.resUserOptions;
            return el;
          });

        const relationUsers = cloneDeep(sourceRef.value.dataList2)
          .map((item) => {
            item.userInfoVOList = item.userInfoVOList.filter((el) => el.id === item.relateUserOptions);
            return item;
          })
          .map((el) => {
            delete el.relateUserOptions;
            return el;
          });

        const projectTaskInfoSaveDTOS = allTasks.map((item) => {
          return {
            projectTask: {
              name: item.name,
              duration: item.duration,
              projectId: route.query.id,
              start: item.start,
              end: item.end,
              sort: item.sort,
              realStart: item.realStart,
              realEnd: item.realEnd,
              status: item.status,
              description: item.description,
              groupId: item.groupId,
              progress: item.progress,
              id: item.id.replaceAll("-", "")
            },
            taskDeliverables: item.projectTaskDeliverableVOList.map((el) => ({
              createUserId: el.createUserId,
              createUserName: el.createUserName,
              deleteStatus: el.deleteStatus,
              deliverableName: el.deliverableName,
              generalTemplateVO: el.generalTemplateVO,
              id: el.id,
              modifyDate: el.modifyDate,
              modifyUserId: el.modifyUserId,
              modifyUserName: el.modifyUserName,
              orgId: el.orgId,
              createDate: dayjs(el.createDate).format("YYYY-MM-DD HH:mm:ss"),
              projectTaskId: item.id.replaceAll("-", ""),
              deliverableId: el.deliverableTemplateId
            })),
            taskRelatePersonnels: item.projectTaskRelatePersonnelVOList,
            taskRequires: item.projectTaskRequireVOList,
            taskResponsiblePersonnels: item.projectTaskResponsiblePersonnelVOList
          };
        });
        //组装请求参数
        const updateParams = {
          productCategoryId: formData.productCategoryId,
          projectModelId: formData.projectModelId,
          projectModelRelatePersonnel: relationUsers,
          projectModelResponsiblePersonnel: resUsers,
          projectName: formData.projectName,
          deptId: formData.deptId,
          customerName: formData.customerName,
          projectUserId: formData.projectUserId,
          startDate: formData.startDate,
          remarks: formData.remarks,
          id: formData.id,
          projectTaskInfoSaveDTOS
        };

        console.log(updateParams, "updateParams====");
        updateProjectNewInfo(updateParams).then((res) => {
          if (res.status === 200 || res.data) {
            message("修改成功", { type: "success" });
            fetchDetailFormData();
          }
        });
      })
      .catch(console.log);
  };

  onMounted(() => {
    fetchOpts();
    fetchDetailFormData();
  });

  const changeFormDataStartDate = (val) => {
    const taskAllList = taskListRef.value.dataList
      .map((item) => item.taskVOList)
      .flat(Infinity)
      .map((item) => dayjs(item.start));

    const minStartDate = dayjs.min(taskAllList).format("YYYY-MM-DD");

    taskListRef.value.dataList.forEach((group) => {
      group.taskVOList.forEach((task, idx) => {
        if (task.start === minStartDate && !task.projectTaskRequireVOList[0]?.id) {
          task.start = val;
        }
      });
    });
  };

  return {
    formData,
    fetchDetailFormData,
    formRef,
    activeName,
    projectModelsOpts,
    productClassifyList,
    taskListRef,
    changeTreeData,
    sourceRef,
    handleClick,
    onSubmit,
    onSave,
    onBack,
    userListOpts,
    changeFormDataStartDate,
    treeDeptSelectData
  };
};
