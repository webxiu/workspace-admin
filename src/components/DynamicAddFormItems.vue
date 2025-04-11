<script lang="tsx">
import { defineComponent, onMounted, reactive, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";

type DomainItem = Recordable<any>;

export default defineComponent({
  props: {
    listProp: { type: String, default: "specs" },
    modelValue: { type: Array, default: () => [] },
    itemConfigs: { type: Object as PropType<any[]>, default: () => [] },
    delButton: { type: Object, default: () => ({ size: "default", name: "删除" }) },
    addButton: { type: Object, default: () => ({ size: "default", name: "新增" }) }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { listProp, itemConfigs, modelValue, delButton, addButton } = props;
    const itemList = reactive<DomainItem[]>(modelValue);

    onMounted(() => !modelValue.length && onAdd());
    watch(itemList, onUpdate, { deep: true, immediate: true });

    function onUpdate(val) {
      emit("update:modelValue", itemList);
      emit("change", itemList);
    }

    const onAdd = () => {
      const item = itemConfigs.reduce((prev, item) => {
        prev["uuid"] = Date.now();
        prev[item.prop] = undefined;
        return prev;
      }, {});
      itemList.push(item);
    };

    const onRemove = (item: DomainItem) => {
      const index = itemList.indexOf(item);
      if (index !== -1) itemList.splice(index, 1);
    };

    return () => (
      <>
        {itemList.map((formModel, index) => (
          <el-row key={formModel.uuid || formModel.id}>
            {itemConfigs.map((row) => {
              const _render = typeof row.render === "function" ? row.render({ formModel, row }) : row.render;
              return (
                <el-col span={row.span} key={row.prop}>
                  <el-form-item label={row.label} prop={`${listProp}.${index}.${row.prop}`} rules={row.rules}>
                    {_render}
                  </el-form-item>
                </el-col>
              );
            })}
            <el-col span={3} class="flex just-end">
              <el-form-item label="" labelWidth="10px">
                <el-button type="danger" icon={<Delete />} {...delButton} onClick={() => onRemove(formModel)}>
                  {delButton.name} {/* 删除 */}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        ))}
        <el-form-item>
          <el-button type="primary" icon={<Plus />} {...addButton} onClick={onAdd}>
            {addButton.name} {/* 添加 */}
          </el-button>
        </el-form-item>
      </>
    );
  }
});
</script>
