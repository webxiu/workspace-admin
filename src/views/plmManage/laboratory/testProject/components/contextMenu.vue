<template>
  <div
    v-show="visible"
    :style="{
      left: position.left + 'px',
      top: position.top + 'px',
      display: visible ? 'block' : 'none'
    }"
    class="context-menu"
  >
    <div v-for="(item, i) in menuItems" :key="i" class="menu-item" @click="item.action(rightClickItem)">
      <el-icon :size="14" style="margin-right: 5px">
        <Plus v-if="item.name === '新增'" />
        <EditPen v-if="item.name === '修改'" />
        <Delete v-if="item.name === '删除'" />
      </el-icon>
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useContextMenu } from "./hook";
import { Plus, EditPen, Delete } from "@element-plus/icons-vue";

const { onAdd, onEdit, treeSelectData, onDelete } = useContextMenu();
interface Props {
  menuItems: ContextMenuItem[];
}

export interface ContextMenuItem {
  name: string;
  icon?: string;
  action: (rightClickItem: any) => void;
}

const props = defineProps<Props>();
const visible = ref(false);
const curTreeId = ref("");
const rightClickItem = ref(null);
const position = ref({
  top: 0,
  left: 0
});

const openMenu = (e: MouseEvent, item: any) => {
  const menuCount = props.menuItems.length;
  const windowHeight = window.innerHeight;

  visible.value = true;
  position.value.top = Math.min(e.pageY, windowHeight - 40 - menuCount * 32) - 99;
  console.log(e.pageY, "pageY");
  curTreeId.value = item.data.id;
  console.log(windowHeight - 40 - menuCount * 32, "windowHeight - 40 - menuCount * 32");
  position.value.left = e.pageX + 50;
  rightClickItem.value = item;
};

const closeMenu = () => {
  visible.value = false;
};

watch(visible, () => {
  if (visible.value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});

defineExpose({ openMenu, closeMenu, onAdd, onDelete, onEdit, treeSelectData, curTreeId });
</script>
<style scoped lang="scss">
.context-menu {
  position: absolute;
  z-index: 2;
  padding: 4px;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  list-style-type: none;
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 2px var(--el-color-primary-light-8);

  .menu-item {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 15px;
    line-height: 32px;
    color: rgb(29 33 41);
    cursor: pointer;

    &:nth-child(1) {
      color: var(--el-color-primary);
    }

    &:nth-child(2) {
      color: var(--el-color-warning);
    }

    &:nth-child(3) {
      color: var(--el-color-danger);
    }
  }

  .menu-item:hover {
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
  }
}
</style>
