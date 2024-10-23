/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:20:17
 */

import { CustomPropsType, getFormColumns } from "@/utils/form";
import { Delete, Edit, Plus, WarningFilled } from "@element-plus/icons-vue";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import {
  FlowBillItemType,
  FlowGraphXMLType,
  FlowManageItemType,
  FlowTaskManageItemType,
  activeFlow,
  addFlowBillInfo,
  deployFlow,
  editFlow,
  flowManageList,
  getDeptLevel,
  getFlowBillInfo,
  getFlowBillInfoById,
  getFlowBillPendingList,
  getFlowDesignConfig,
  pauseActiveFlowCheck,
  pauseFlow,
  revokeFlow,
  revokeFlowCheck,
  revokeFlowConfig,
  updateFlowBillInfoById,
  updateFlowTask
} from "@/api/systemManage";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, nextTick, onMounted, reactive, ref, resolveDirective, withDirectives } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { templateFormConfigs, templateFormRules } from "./config";

import Bpmn from "../bpmn.vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { OptionItemType } from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { useBpmnFlowStore } from "@/store/modules/bpmn";
import { useBpmnStore } from "@/components/BpmnFlow/hooks";
import { useEleHeight } from "@/hooks";
import { useLogicFlow } from "@/hooks/useLogicFlow";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const rowData = ref<FlowManageItemType>();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<FlowManageItemType[]>([]);
  const loadingDirective = resolveDirective("loading");
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 56 + 32);
  const { store } = useBpmnStore<{ taskConfig: FlowTaskManageItemType[]; taskForm: { [key: string]: object }; bpmnModeler: BpmnModeler }>();
  const { setBpmnData } = useBpmnFlowStore();

  const formData = reactive({
    deployName: "",
    isEnable: true,
    processSuspension: false,
    page: 1,
    limit: 10000
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "部署名称", value: "deployName" },
    {
      label: "状态",
      value: "processSuspension",
      children: [
        { label: "暂停", value: true },
        { label: "激活", value: false }
      ]
    },
    {
      label: "启用状态",
      value: "isEnable",
      children: [
        { label: "启用", value: true },
        { label: "禁用", value: false }
      ]
    }
  ]);

  const queryParams = reactive<QueryParamsType>({
    processSuspension: { value: false, valueLabel: "激活" },
    isEnable: { value: true, valueLabel: "启用" }
  });

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    const getStyle = (colorKey) => {
      const bgColor = { true: "#009688", false: "#ff5722" };
      return { padding: "3px 6px", color: "#fff", borderRadius: "4px", background: bgColor[colorKey] };
    };

    let columnData: TableColumnList[] = [
      { label: "部署ID", prop: "deployId", align: "right" },
      { label: "部署名称", prop: "deployName", minWidth: 180, sortable: true },
      { label: "流程ID", prop: "processId", minWidth: 240, sortable: true },
      { label: "实例数", prop: "processInstanceCount", align: "right" },
      {
        label: "状态",
        prop: "processSuspension",
        sortable: true,
        cellRenderer({ row }) {
          return <span style={getStyle(`${row.processSuspension}`)}>{row.processSuspension ? "激活" : "暂停"}</span>;
        }
      },
      {
        label: "模板配置",
        prop: "isConfig",
        sortable: true,
        cellRenderer({ row }) {
          return <span style={getStyle(`${row.isConfig}`)}>{row.isConfig ? "已配置" : "未配置"}</span>;
        }
      },
      {
        label: "启用",
        prop: "isEnable",
        sortable: true,
        cellRenderer({ row }) {
          return <span style={getStyle(`${row.isEnable}`)}>{row.isEnable ? "是" : "否"}</span>;
        }
      },
      { label: "单据ID", prop: "billId", align: "right" },
      { label: "资源名称", prop: "deployFileName", minWidth: 260, sortable: true },
      { label: "资源Key", prop: "deployKey", minWidth: 160, sortable: true },
      { label: "部署时间", prop: "deployTime", minWidth: 160, sortable: true },
      { label: "流程描述", prop: "processDescription", minWidth: 200 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    flowManageList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const onRowClick = (row: FlowManageItemType) => {
    rowData.value = row;
  };

  /** 新增 */
  const onAdd = () => openDialog("add");

  /** 修改(模板) */
  const onEditTemplate = (row: FlowManageItemType) => openDialog("edit", row);

  // 创建模板
  const openDialog = (type: "add" | "edit", row?: FlowManageItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const loading = ref<boolean>(true);
    const myFormConfig = ref<FormConfigItemType[]>([]);
    const _formData = reactive({
      id: row?.id,
      billList: row?.billId ?? "",
      processId: row?.processId,
      billId: "",
      formUrl: "",
      tableName: "",
      fieldName: "",
      userFieldName: "",
      flowName: "",
      isEnable: row?.isEnable ?? false
    });
    // 获取回显数据
    if (type === "edit") {
      let p1 = getFlowBillInfoById({ id: row?.id });
      if (row?.processId) p1 = getFlowBillInfo({ processId: row?.processId });
      p1.then(({ data }) => Object.assign(_formData, data)).catch(console.log);
    }

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      billList: {
        apiParams: { billId: row?.billId },
        onChange: (value) => (_formData.billId = value)
      }
    });

    getFormColumns({ customProps, loading })
      .then((data) => {
        if (!data.formColumns.length) return;
        myFormConfig.value = data.formColumns;
      })
      .catch(console.log);

    addDialog({
      title: `${title}模板配置`,
      props: {
        formInline: _formData,
        formRules: templateFormRules,
        loading: loading,
        // formConfigs: templateFormConfigs({ billOptions, formUrlList, onBillChange }),
        formConfigs: myFormConfig,
        formProps: { labelWidth: "160px" }
      },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (!valid) return;
          const { billList, ...params } = _formData;
          showMessageBox("确认提交吗")
            .then(() => {
              const templateApi = { add: addFlowBillInfo, edit: updateFlowBillInfoById };
              templateApi[type](params).then((res) => {
                if (res.data) {
                  message("保存成功");
                  if (type === "add") {
                    openFlowDialog(type, { ...row, id: res.data });
                  }
                  done();
                } else {
                  message("保存失败", { type: "error" });
                }
              });
            })
            .catch(console.log);
        });
      }
    });
  };

  /**
   * 提交流程校验
   * 校验选项:流程名称、多实例、任务监听器...
   */
  const verifyFlow = (xml: string) => {
    const { processInfo, userTaskList } = getUserTaskList();
    if (!processInfo.name) {
      message("请添加流程名称", { type: "warning" });
      return false;
    } else if (!processInfo.id) {
      message("请添加流程ID", { type: "warning" });
      return false;
    } else if (!xml.includes("startEvent")) {
      message("请添加开始节点", { type: "warning" });
      return false;
    } else if (!xml.includes("userTask")) {
      message("请添加任务节点", { type: "warning" });
      return false;
    } else if (!xml.includes("endEvent")) {
      message("请添加结束节点", { type: "warning" });
      return false;
    }

    const msgObj = {
      loopCharacteristics: "多实例:请选择回路特性",
      collection: "多实例:集合不能为空",
      elementVariable: "多实例:元素变量不能为空",
      completionCondition: "多实例:完成条件不能为空",
      elementListenersList: "任务监听器:列表不能为空"
    };

    let mark = true;
    if (userTaskList?.length && store.taskForm) {
      const taskIds = Object.keys(store.taskForm);
      // 存在多个任务节点时, 若只选中部分节点进行修改, 仅过滤出被修改的节点进行校验
      const newList = userTaskList.filter((task) => taskIds.includes(task.id));
      outerLoop: for (const item of newList) {
        const taskNode = store.taskForm[item.id];
        // 1.任务常规填写检测
        if (!item.id) {
          mark = false;
          message("任务ID不能为空", { type: "error" });
          break;
        } else if (!item.name) {
          mark = false;
          message(`${item.id}:任务名称不能为空`, { type: "error" });
          break;
        } else if (!taskNode) {
          mark = false;
          message(item.name + "任务配置不能为空", { type: "error" });
          break;
        }

        if (store.taskConfig?.length) {
          for (const task of store.taskConfig) {
            if (task.taskId !== item.id) continue;
            if (!task.personFrom) {
              mark = false;
              message(`常规:请选择${item.name}的审批方式`, { type: "error" });
              break outerLoop;
            } else if (task.personFrom === "用户") {
              if (!task.persons) {
                mark = false;
                message(`常规:请选择${item.name}的审批用户`, { type: "error" });
                break outerLoop;
              }
            } else if (task.personFrom === "角色") {
              if (!task.roleId) {
                mark = false;
                message(`常规:请选择${item.name}的审批角色`, { type: "error" });
                break outerLoop;
              }
            }
          }
        }

        // 3.剩余表单填写检测, 根据msgObj配置的key, 判断哪些字段需要校验
        for (const key of Object.keys(msgObj)) {
          // 多实例的回路特性: 选择循环事件或无时, 没有子选项, 不做校验
          if (["StandardLoop", "Null"].includes(taskNode["loopCharacteristics"])) {
            break outerLoop;
          }
          if (!taskNode[key] || !taskNode[key]?.length) {
            mark = false;
            message(item.name + msgObj[key], { type: "error" });
            break outerLoop;
          }
        }
      }
    }
    return mark;
  };

  // 修改流程图
  const onEditFlow = (row: FlowManageItemType) => openFlowDialog("edit", row);

  // 绘制流程图
  const openFlowDialog = (type, row?: FlowManageItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const xml = ref();
    const taskLists = ref([]);
    const aLoading = ref(true);
    const sLoading = ref(false);
    const billOptions = ref<FlowBillItemType[]>([]);
    const apiList: Array<Promise<any>> = [getDeptLevel(), getFlowBillPendingList({ billId: row?.billId || undefined })];

    if (type === "edit") {
      const { deployId: deploymentId, resourceName } = row;
      const p2 = editFlow({ deploymentId, resourceName });
      apiList.push(p2);
    }
    Promise.all(apiList)
      .then((res) => {
        aLoading.value = false;
        const res1: any = res[0];
        const res2: any = res[1];
        const res3: any = res[2];
        const data3 = res3.data as FlowGraphXMLType;
        if (res2.status === 200 && res2.data) billOptions.value = res2.data;
        if (res3.status === 200 && res3.data) {
          taskLists.value = data3.taskLists || [];
          xml.value = data3.xmlContent;
          data3.taskLists.forEach((item) => {
            item.taskUsers = item.taskUsers || {};
            item.carbonTaskUsers = item.carbonTaskUsers || {};
            item.notifyTaskUsers = item.notifyTaskUsers || {};
          });
          setBpmnData({
            taskLists: data3.taskLists || [],
            deptLevels: new Array(res1.data || 0).fill(1).map((_, index) => {
              let optionName = `上${index}层级`;
              if (index === 0) optionName = "当前层级";
              return { optionValue: index + 1, optionName: optionName };
            })
          });
        }
      })
      .catch(() => (aLoading.value = false));
    addDialog({
      title: type === "add" ? `${title}流程设计文件` : `${title}-${row.deployName}`,
      props: { xml: xml, loading: aLoading, taskLists: taskLists, row },
      width: "640px",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      class: "full-dialog",
      okButtonText: "保存",
      contentRenderer: () => h(Bpmn, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        getUserTaskList(); // 修改开始节点的id
        try {
          const bpmnStore = formRef.value.bpmnStore;
          const flowData: { type: string; name: string; data: string } = await bpmnStore?.saveProcess("xml");
          const xml = flowData.data;
          // 提交流程校验
          if (!verifyFlow(xml)) return false;

          const msgTips = () => (
            <div class="flex align-center">
              <el-icon color="var(--el-color-warning)" style="font-size: 24px">
                <WarningFilled />
              </el-icon>
              <p style="font-size: 14px; margin-left: 14px">
                {row?.processId ? (
                  <>
                    <strong>修改: </strong>只更新任务管理
                    <br />
                  </>
                ) : null}
                <strong>创建并修改: </strong>创建流程并更新任务管理
                <p style="margin-top: 15px">
                  <strong>注: </strong>只修改任务管理选择"修改", 其他的所有修改选择"创建并修改"
                </p>
              </p>
            </div>
          );

          const resultDialog = addDialog({
            title: "确认提交吗?",
            width: "520px",
            draggable: true,
            customButtonText: "创建并修改",
            okButtonText: "修改",
            contentRenderer: () => h(msgTips),
            footerRenderer: () => {
              return (
                <div>
                  <el-button type="default" disabled={sLoading.value} onClick={onCreate}>
                    创建并修改
                  </el-button>
                  {row?.processId ? (
                    <el-button type="primary" disabled={sLoading.value} onClick={onUpdate}>
                      修改
                    </el-button>
                  ) : null}
                </div>
              );
            }
          });

          // 1.修改
          const onUpdate = () => {
            sLoading.value = true;
            updateTaskManage(row?.id, "update", (error) => {
              sLoading.value = false;
              if (error) return message(error.toString(), { type: "error" });
              resultDialog.options.value.visible = false;
              message(`${title}成功`);
              getTableList();
              done();
            });
          };
          // 2.创建并修改
          const onCreate = () => {
            const fd = new FormData();
            const flowName: string = flowData.name;
            const fileName = `${flowName}.bpmn20.xml`;
            const xmlFile = new File([xml], fileName, { type: "text/xml" });
            fd.append("files", xmlFile);
            fd.append("deployName", flowName);
            if (row?.id) fd.append("id", `${row?.id}`);
            sLoading.value = true;
            deployFlow(fd)
              .then(async (res) => {
                if (res.data) {
                  updateTaskManage(res.data || row.id, "create", (error) => {
                    sLoading.value = false;
                    if (error) return message(error.toString(), { type: "error" });
                    resultDialog.options.value.visible = false;
                    message(`${title}成功`);
                    getTableList();
                    done();
                  });
                } else {
                  sLoading.value = false;
                  message(`${title}失败`, { type: "error" });
                }
              })
              .catch(() => (sLoading.value = false));
          };
        } catch (error) {
          message(error.toString(), { type: "error" });
        }
      }
    });
  };

  /** 获取流程图中为任务节点的id */
  const getUserTaskList = () => {
    // 获取所有元素节点
    const elements = store.bpmnModeler.get("elementRegistry")._elements;
    const processInfo = { name: "", id: "" };
    const userTaskList: { name: string; id: string }[] = [];

    for (const key in elements) {
      const element = elements[key].element;
      if (element.type === "bpmn:StartEvent") {
        // 1.开始节点id设置默认值
        const sId = "startEvent1";
        const modeling = store.bpmnModeler.get("modeling");
        modeling.updateProperties(element, { id: sId, di: { id: `${sId}_di` } });
      } else if (element?.type === "bpmn:UserTask") {
        // 2.获取任为务节点的id
        userTaskList.push({ name: element.businessObject.name, id: key });
      } else if (element?.type === "bpmn:Process") {
        // 3.获取流程名称和流程id
        const { name, id } = element.businessObject;
        processInfo.id = id;
        processInfo.name = name;
      }
    }
    return { userTaskList, processInfo };
  };

  // 更新任务管理
  const updateTaskManage = async (processConfigId, type: "create" | "update", callback) => {
    const userTasks = getUserTaskList().userTaskList.map((item) => item.id);
    try {
      let newTaskList = [];
      if (store.taskConfig?.length) {
        newTaskList = store.taskConfig
          .filter((f) => {
            // 过滤出流程图最新节点的任务配置(节点增删改和id变化, 都会生成多余的配置)
            if (!userTasks.length) return true;
            return userTasks.includes(f.taskId);
          })
          .map((item) => {
            const id = type === "update" && item?.id ? item.id : undefined; // 重新部署无需传id
            return { ...item, id };
          });
      }
      const result = await updateFlowTask({ processConfigId, taskLists: newTaskList });
      if (result.data) callback();
    } catch (error) {
      callback(error);
    }
  };

  /** 删除 */
  const onDelete = wrapFn(rowData, ({ text }) => {
    const { id, processId, deployId, deployName } = rowData.value;

    function submitRevoke(api, params) {
      const cName = deployName ? `【${deployName}】` : "";
      showMessageBox(`确定删除当前部署流程${cName}吗?`)
        .then(() => {
          api(params)
            .then((res) => {
              if (res.status !== 200) return message(res.message);
              if (res.data) {
                getTableList();
                message(`流程删除成功`);
              } else {
                message("流程删除失败");
              }
            })
            .catch((err) => message(`流程删除失败`, { type: "error" }));
        })
        .catch(console.log);
    }

    if (processId) {
      revokeFlowCheck({ processId })
        .then((res) => {
          if (res.status !== 200) return message(res.message);
          if (res.data) return message("当前部署流程存在历史流程数据，禁止操作");
          submitRevoke(revokeFlow, { deploymentId: deployId });
        })
        .catch(console.log);
    } else {
      submitRevoke(revokeFlowConfig, { id });
    }
  });

  /** 暂停 */
  const onPause = wrapFn(rowData, ({ text }) => {
    const { processId, deployName } = rowData.value;
    pauseActiveFlowCheck({ processId }).then((res) => {
      if (res.status !== 200) return message(res.message);
      if (res.data) return message("当前流程状态处于暂停状态，禁止重复操作");
      showMessageBox(`确定暂停流程【${deployName}】吗?`)
        .then(() => {
          pauseFlow({ processId })
            .then((res) => {
              if (res.status !== 200) return message(res.message);
              if (res.data) {
                getTableList();
                message(`流程暂停成功`);
              } else {
                message("流程暂停失败");
              }
            })
            .catch((err) => message(`流程暂停失败`, { type: "error" }));
        })
        .catch(console.log);
    });
  });

  /** 激活 */
  const onActive = wrapFn(rowData, ({ text }) => {
    const { processId, deployName } = rowData.value;
    // pauseActiveFlowCheck({ processId }).then((res) => {
    //   if (res.status !== 200) return message(res.message);
    //   if (res.data) return message("当前流程状态处于激活状态，禁止重复操作");
    showMessageBox(`确定激活流程【${deployName}】吗?`)
      .then(() => {
        activeFlow({ processId })
          .then((res) => {
            if (res.status !== 200) return message(res.message);
            if (res.data) {
              getTableList();
              message(`流程激活成功`);
            } else {
              message("流程激活失败");
            }
          })
          .catch((err) => message(`流程激活失败`, { type: "error" }));
      })
      .catch(console.log);
    // });
  });

  /** 设计图 */
  const onFlow = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    const flowLoading = ref<boolean>(true);
    addDialog({
      title: "流程设计图:" + row.deployName,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      class: "dialog-fill_body",
      beforeSure: (done, { options }) => done(),
      contentRenderer: () => {
        const flowEle = withDirectives(
          h("div", {
            id: "bill-task_flow",
            style: { display: "flex", flex: 1 }
          }),
          [[loadingDirective, flowLoading.value]]
        );
        nextTick(async () => {
          if (flowLoading.value) {
            const res = await getFlowDesignConfig({ processId: row.processId });
            const { lf } = useLogicFlow("#bill-task_flow");
            flowLoading.value = false;
            lf.value.render(res.data);
          }
        });
        return flowEle;
      }
    });
  });

  // 分页相关
  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const onDesign = wrapFn(rowData, () => {
    onEditFlow(rowData.value);
  });

  const onEditAction = wrapFn(rowData, () => {
    onEditTemplate(rowData.value);
  });

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEditAction, type: "success", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onPause, type: "warning", text: "暂停", isDropDown: true },
    { clickHandler: onActive, type: "success", text: "激活", isDropDown: true },
    { clickHandler: onFlow, type: "primary", text: "流程图", isDropDown: true },
    { clickHandler: onDesign, type: "primary", text: "设计图", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    loadingStatus,
    buttonList,
    queryParams,
    searchOptions,
    onRefresh,
    onTagSearch,
    onEditTemplate,
    onEditFlow,
    onRowClick,
    onCurrentChange
  };
};
