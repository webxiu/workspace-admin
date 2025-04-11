<script lang="tsx">
import { DeptUserItemType } from "@/api/systemManage";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "SelectUserList",
  props: {
    type: { type: String, default: "view" },
    modelValue: { type: Array as PropType<DeptUserItemType>, default: () => [] }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const isView = props.type === "view";
    const dataList = ref<DeptUserItemType[]>(props.modelValue);
    watch(dataList, onUpdate, { deep: true, immediate: true });

    function onUpdate(val) {
      const data = dataList.value;
      emit("update:modelValue", data);
      emit("change", data);
    }

    function onMulSelect(rows) {
      rows.forEach((item) => {
        const index = dataList.value.findIndex((i) => i.id === item.id);
        if (index > -1) return;
        dataList.value.push(item);
      });
    }

    function handleMove(index, direction: "up" | "down") {
      const array = dataList.value;
      let targetIndex;
      if (direction === "up") {
        if (index <= 0 || index >= array.length) return;
        targetIndex = index - 1;
      } else {
        if (index < 0 || index >= array.length - 1) return;
        targetIndex = index + 1;
      }
      [array[index], array[targetIndex]] = [array[targetIndex], array[index]];
    }

    function handleDel(idx) {
      dataList.value.splice(idx, 1);
    }

    return () => {
      return (
        <div style={{ width: "100%" }}>
          <HxModalInput
            title="选择用户"
            placeholder="选择用户"
            readonly={true}
            showButton={true}
            isButton={true}
            buttonText={"添加审批人"}
            showModel="user"
            size="small"
            onMulSelect={onMulSelect}
            buttonProp={{ type: "primary", size: "small", plain: true, disabled: isView }}
            componentProp={{ multiple: true }}
          />
          <ul class="ui-ovy-a pr-5" style={{ maxHeight: "111px" }}>
            {dataList.value?.map((item, idx) => (
              <li key={item.id} class="flex just-between">
                <div>{idx + 1}</div>
                <div>{item.userName}</div>
                <div class="flex">
                  <el-link type="primary" class="mr-20 no-select" disabled={!idx || isView} onClick={() => handleMove(idx, "up")}>
                    上移
                  </el-link>
                  <el-link
                    type="success"
                    class="mr-20 no-select"
                    disabled={idx === dataList.value.length - 1 || isView}
                    onClick={() => handleMove(idx, "down")}
                  >
                    下移
                  </el-link>
                  <el-link type="danger" disabled={isView} onClick={() => handleDel(idx)} class="no-select">
                    删除
                  </el-link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    };
  }
});
</script>

<style scoped></style>
