import { defineStore } from "pinia";
import { store } from "@/store";

export const useBpmnFlowStore = defineStore({
  id: "bpmn-setting",
  state: () => ({
    taskLists: [],
    deptLevels: []
  }),
  getters: {
    getTaskList(state) {
      return state.taskLists;
    }
  },
  actions: {
    setBpmnData(obj: Record<string, any>) {
      Object.keys(obj).forEach((key) => {
        if (Reflect.has(obj, key)) {
          this[key] = obj[key];
        }
      });
    }
  }
});

export function useBpmnFlowStoreHook() {
  return useBpmnFlowStore(store);
}
