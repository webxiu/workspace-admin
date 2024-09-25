<!-- /*
 * @Author: Hailen 
 * @Date: 2024-08-09 18:36:38 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-08-09 18:36:38 
 */ -->

<script lang="tsx">
import { defineComponent, PropType, watch, reactive } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";

export interface RulesItemType {
  id: number;
  required: boolean;
  message: string;
  pattern: string;
  trigger: string[];
}

const props = {
  rowData: { type: Object, default: () => ({}) },
  modelValue: {
    type: Object as PropType<RulesItemType[]>,
    default: () => []
  }
};

export default defineComponent({
  props: props,
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const space = reactive<RulesItemType[]>(props.modelValue);
    watch(space, watchUpdata, { deep: true });

    function watchUpdata(values) {
      const specs = values.map(({ id, ...m }) => m);
      emit("update:modelValue", specs);
    }
    function addSpecs() {
      const { label, itemType } = props.rowData;
      const msgType = { input: "请输入", select: "请选择" }[itemType];
      space.push({
        id: Date.now(),
        required: false,
        message: msgType + label,
        pattern: "",
        trigger: ["blur"]
      });
    }
    function removeSpecs(domain) {
      space.splice(space.indexOf(domain), 1);
    }

    return () => (
      <el-form>
        {space.map((domain, idx) => {
          return (
            <div class="flex mb-10" key={domain.id}>
              <el-form-item label="是否必填" prop={`specs.${idx}.required`} label-width="70px" class="mr-10">
                <el-switch v-model={domain.required} />
              </el-form-item>
              <el-form-item label="提示信息" prop={`specs.${idx}.message`} label-width="70px" class="mr-10">
                <el-input v-model={domain.message} placeholder="请输入" style="width: 100px" />
              </el-form-item>
              <el-form-item label="校验正则" prop={`specs.${idx}.pattern`} label-width="70px" class="mr-10">
                <el-input v-model={domain.pattern} placeholder="请输入" style="width: 80px" />
              </el-form-item>
              <el-form-item label="触发方式" label-width="70px" class="mr-10" prop={`specs.${idx}.trigger`}>
                <el-select v-model={domain.trigger} multiple placeholder="请选择" style="width: 176px">
                  <el-option label="blur" value="blur" />
                  <el-option label="change" value="change" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button onClick={() => removeSpecs(domain)} type="danger" icon={Delete} style="width: 67px">
                  删除
                </el-button>
              </el-form-item>
            </div>
          );
        })}
        <el-form-item>
          <el-button type="primary" onClick={addSpecs} icon={Plus} disabled={space.length > 2}>
            添加
          </el-button>
        </el-form-item>
      </el-form>
    );
  }
});
</script>
