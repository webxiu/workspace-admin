<template>
  <!-- <div style="display: flex; height: calc(100vh - 180px)"> -->
  <!-- <div class="search">
    <el-select v-model="searchName" placeholder="选择负责人" style="width: 240px" @change="changeUserName">
      <el-option v-for="item in nameOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div> -->
  <div style="display: flex; min-height: calc(100vh - 223px); justify-content: flex-start">
    <div style="width: 350px">
      <group :changeUserName="changeUserName" :searchName="formData.responsibleUserName" :key="1" type="1" ref="todoRef" :nameOptions="nameOptions" />
    </div>
    <div style="width: 350px; margin: 0 64px">
      <group :changeUserName="changeUserName" :searchName="formData.responsibleUserName" :key="2" type="2" ref="progressRef" :nameOptions="nameOptions" />
    </div>
    <div style="width: 350px; margin: 0 64px">
      <group :changeUserName="changeUserName" :searchName="formData.responsibleUserName" :key="3" type="5" ref="confirmRef" :nameOptions="nameOptions" />
    </div>
    <div style="width: 350px">
      <group :changeUserName="changeUserName" :searchName="formData.responsibleUserName" :key="4" type="3" ref="finishRef" :nameOptions="nameOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import group from "./group.vue";
import { ref, onMounted } from "vue";
import { taskManageList, userInfoList } from "@/api/systemManage";
import { useUserStoreHook } from "@/store/modules/user";

// const todoDataList = ref([]);

const todoRef = ref();
const progressRef = ref();
const finishRef = ref();
const confirmRef = ref();
const nameOptions = ref([]);
const curResUser = ref("");

const props = defineProps(["listRef", "calendarRef", "formData", "onSearch"]);
const searchName = ref("");

const getUserList = () => {
  userInfoList({
    page: 1,
    limit: 100000,
    deptId: "9",
    userState: "A",
    deptIdList: ["9"]
  }).then((res) => {
    if (res.data) {
      const result = res.data.records;
      nameOptions.value = result.map((item) => ({ label: item.userName, value: item.userName, userCode: item.userCode }));
      props.listRef.nameOptions = result.map((item) => ({ optionName: item.userName, optionValue: item.userCode }));
    }
  });
};

const addAtrr = (arr: Array<any>) => {
  return arr.map((item) => {
    item.showFloatPop = false;
    item.editTaskNameFlag = false;
    item.visiblePop = false;
    item.visiblePop2 = false;
    item.arrowRight = true;

    if (item.children && Array.isArray(item.children) && item.children?.length) {
      item.children = addAtrr(item.children);
    }

    return item;
  });
};

const changeUserName = (val) => {
  curResUser.value = val;
  fetchList(props.formData.responsibleUserName);
  // props.calendarRef.searchData(val);
  // fetchList(val);
};

const commonTaskList = async (status, name?, limit?) => {
  return await taskManageList({
    page: 1,
    limit: limit || 30,
    hideChildDone: true,
    select: status,
    responsibleUserName: name || props.formData.responsibleUserName
  });
};

const fetchList = (name?) => {
  Promise.all([commonTaskList("1", name), commonTaskList("2", name), commonTaskList("3", name), commonTaskList("5", name)]).then((res: any) => {
    const [data1, data2, data3, data4] = res;
    const [result1, result2, result3, result4] = [
      addAtrr(data1.data.records),
      addAtrr(data2.data.records),
      addAtrr(data3.data.records),
      addAtrr(data4.data.records)
    ];
    const [total1, total2, total3, total4] = [data1.data.total, data2.data.total, data3.data.total, data4.data.total];

    // 未开始
    todoRef.value.todoList = result1;
    todoRef.value.total = total1;
    progressRef.value.todoList = result2;
    progressRef.value.total = total2;
    finishRef.value.todoList = result3;
    finishRef.value.total = total3;
    confirmRef.value.todoList = result4;
    confirmRef.value.total = total4;

    props.listRef.finishedList = result3;
    props.listRef.finishedListTotal = total3;
    props.listRef.confirmList = result4;
    props.listRef.confirmListTotal = total4;
    props.listRef.doingList = result2;
    props.listRef.doingListTotal = total2;
    props.listRef.waitResolveList = result1;
    props.listRef.waitResolveListTotal = total1;
  });
  // commonTaskList("1", name).then((res) => {
  //   console.log(res, "res==");
  //   if (res.data) {
  //     const result = addAtrr(res.data.records);
  //     // 未开始
  //     todoRef.value.todoList = result.filter((el) => el.taskStatus === "1");
  //     progressRef.value.todoList = result.filter((el) => el.taskStatus === "2");
  //     finishRef.value.todoList = result.filter((el) => el.taskStatus === "3");
  //     console.log(todoRef.value.todoList, "todoRef.value.dataList");
  //   }
  // });
  // taskManageList({
  //   page: 1,
  //   limit: 10,
  //   hideChildDone: true,
  //   responsibleUserName: name || searchName.value
  // }).then((res) => {
  //   if (res.data) {
  //     const result = addAtrr(res.data.records);
  //     // 未开始
  //     todoRef.value.todoList = result.filter((el) => el.taskStatus === "1");
  //     progressRef.value.todoList = result.filter((el) => el.taskStatus === "2");
  //     finishRef.value.todoList = result.filter((el) => el.taskStatus === "3");
  //     console.log(todoRef.value.todoList, "todoRef.value.dataList");
  //   }
  // });
};

onMounted(() => {
  getUserList();
  fetchList();
});

defineExpose({ searchName, changeUserName, fetchList });
</script>

<style scoped>
.search {
  margin-bottom: 8px;
}
</style>
