import { defineStore } from "pinia";
import { store } from "@/store";

export const useBpmnFlowStore = defineStore({
  id: "bpmn-setting",
  state: () => ({
    taskLists: []
  }),
  getters: {
    getTaskList(state) {
      return state.taskLists;
    }
  },
  actions: {
    setTaskList({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    }
  }
});

export function useBpmnFlowStoreHook() {
  return useBpmnFlowStore(store);
}
