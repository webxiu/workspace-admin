import { reactive } from "vue";

/** =============================== BPMN数据存储中心 ========================================= */
/** Bpmn存储枚举key */
export enum BpmnStoreKey {
  /** 流程表格行数据 */
  row = "row",
  /** 获取流程图xml方法 */
  saveProcess = "saveProcess",
  /** 删除流程任务节点事件 */
  deleteTaskFn = "deleteTaskFn",
  /** 流程图节点配置任务列表 */
  taskConfig = "taskConfig",
  /** 流程图节点配置任务列表 */
  taskForm = "taskForm",
  /** 流程图实例对象 */
  bpmnModeler = "bpmnModeler"
}

interface BpmnStoreReturnType<T> {
  /** 存储数据  key:设置的key value:设置的值 mix:是否添加对象 */
  setBpmnStore: (key: string, value: any, mix?: boolean) => T;
  /** 获取数据 */
  store: T;
}

/** 数据存储对象 */
const store = reactive<any>({});

export function useBpmnStore<T extends Object>() {
  /** 设置数据(mix: 添加对象) */
  function setBpmnStore(key: string, value: any, mix = false) {
    if (mix && typeof value === "object") {
      store[key] = { ...store[key], ...value };
    } else {
      store[key] = value;
    }
    return store as T;
  }
  return { setBpmnStore, store } as BpmnStoreReturnType<T>;
}

/** =============================== BPMN侧边配置数据 ========================================= */
interface BpmnTaskEleType {
  id: string;
  type: string;
}
/** 添加配置数据 */
export const setTaskForm = (bpmnElement: BpmnTaskEleType, data) => {
  const { id, type } = bpmnElement;
  if (type === "bpmn:UserTask") {
    const { store, setBpmnStore } = useBpmnStore();
    const saveData = store[BpmnStoreKey.taskForm] ? store[BpmnStoreKey.taskForm][id] : {};
    setBpmnStore(BpmnStoreKey.taskForm, { [id]: { ...saveData, ...data } }, true);
  }
};
/** 删除配置数据 */
export const removeTaskForm = (bpmnElement: BpmnTaskEleType) => {
  const { id, type } = bpmnElement;
  if (type === "bpmn:UserTask") {
    const { store } = useBpmnStore();
    Reflect.deleteProperty(store[BpmnStoreKey.taskForm], id);
  }
};
