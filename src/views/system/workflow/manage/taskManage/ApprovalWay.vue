<template>
  <div class="border-line p-2 ml-2 ui-w-100 ui-ovy-a" style="height: 60px">
    <el-tag
      v-for="(item, idx) in userList"
      :key="item.id"
      :type="sendColor[idx % sendColor.length]"
      class="mx-1 mb-2 no-select"
      effect="dark"
      closable
      @close="onCloseSend(item)"
    >
      {{ item.userName || item.roleName }}
    </el-tag>
    <el-tag class="mx-1 mb-2 no-select" @click="addSendPeople">添加</el-tag>
  </div>
</template>

<script setup lang="ts">
import { ref, h, watch } from "vue";
import { addDialog } from "@/components/ReDialog";
import AddModal from "./addModal.vue";
import { message, showMessageBox } from "@/utils/message";

type UserItemType = { name: string; id: string };

enum UserType {
  user = "用户",
  role = "角色"
}

const props = withDefaults(defineProps<{ type: string; personFrom?: any; formData: any }>(), {});
const emits = defineEmits(["add", "delete"]);

const sendColor = ["success", "warning", "info", "danger", ""] as const;
const userList = ref([]);

watch(
  props,
  (val) => {
    userList.value = [];
    if (val.formData && val.formData[val.personFrom]) {
      userList.value = val.formData[val.personFrom];
    }
  },
  { immediate: true }
);

// 添加抄送人
const addSendPeople = () => {
  const formRef = ref();
  const { personFrom } = props;
  const title = personFrom === UserType.user ? "选择用户" : "系统角色列表";
  const personType = personFrom === UserType.user ? "user" : "role";
  if (![UserType.user, UserType.role].includes(personFrom)) {
    return message(`${props.type}是用户或角色才能添加`, { type: "error" });
  }

  addDialog({
    title: title,
    props: { personType: personType },
    width: "840px",
    draggable: true,
    fullscreenIcon: true,
    destroyOnClose: true,
    closeOnClickModal: false,
    showResetButton: false,
    contentRenderer: () => h(AddModal, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      if (FormRef.length === 0) {
        return message("未选择" + personFrom, { type: "warning" });
      }
      showMessageBox(`确认要添加吗?`)
        .then(() => {
          const selectIds = userList.value.map((item) => item.id);
          FormRef.forEach((item) => {
            if (!selectIds.includes(item.id)) userList.value.push(item);
          });
          emits("add", { type: props.type, list: userList.value });
          message("添加成功");
          done();
        })
        .catch(console.log);
    }
  });
};

// 移除抄送人
const onCloseSend = (item: UserItemType) => {
  const newList = userList.value.filter((f) => f.id !== item.id);
  emits("delete", { type: props.type, list: newList });
};
</script>
