<!-- /*
 * @Author: Hailen 
 * @Date: 2024-08-09 18:36:38 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-08-09 18:36:38 
 */ -->

<script lang="tsx">
import { ItemKey } from "@/utils/form";
import { Plus, Delete } from "@element-plus/icons-vue";
import { defineComponent, PropType, watch, reactive } from "vue";

export interface RulesItemType {
  id: number;
  required: boolean;
  message: string;
  pattern: string;
  trigger: string[];
}

const props = {
  rowData: { type: Object, default: () => ({}) },
  modelValue: { type: Object as PropType<RulesItemType[]>, default: () => [] }
};

export default defineComponent({
  props: props,
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const regList = reactive([
      { name: "正负小数(位数不限)", pattern: /^-?\d+(\.\d+)?$/ },
      { name: "正数金额(保留2位数)", pattern: /^\d+(\.\d{1,2})?$/ },
      { name: "正负金额(保留2位数)", pattern: /^-?\d+(\.\d{1,2})?$/ },
      { name: "金额(包含千分位)", pattern: /^-?([1-9]\d{0,2}(,\d{3})*|0)(\.\d{1,2})?$/ },
      { name: "大于等于0整数", pattern: /^\d+$/ },
      { name: "大于等于0整数", pattern: /^[0-9]\d*$/ },
      { name: "匹配数字(包含小数)", pattern: /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/ },
      { name: "端口2位数以上", pattern: /^[0-9]{0,5}$/ },
      { name: "字母、数字和下划线", pattern: /^\w+$/ },
      { name: "英文加数字3位数以上", pattern: /^[a-zA-Z0-9]{3,12}$/ },
      { name: "匹配中文", pattern: /^[\u4e00-\u9fa5]+$/ },
      { name: "匹配手机号码", pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/i },
      { name: "匹配网址", pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/ },
      { name: "匹配邮箱", pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ },
      { name: "匹配1-65535端口号", pattern: /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/ },
      {
        name: "匹配身份证号码",
        pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      }
    ]);
    const space = reactive<RulesItemType[]>(props.modelValue);
    watch(space, watchUpdata, { deep: true });

    function watchUpdata(values) {
      const specs = values.map(({ id, ...m }) => {
        if (!m.trigger?.length) delete m.trigger;
        if (!m.message) delete m.message;
        if (!m.pattern) delete m.pattern;
        else m.pattern = m.pattern.toString();
        return m;
      });
      emit("update:modelValue", specs);
    }
    function addSpecs() {
      const { label, itemType } = props.rowData;
      let msgType = "请选择";
      if ([ItemKey.input, ItemKey.inputNumber].includes(itemType)) msgType = "请输入";
      space.push({ id: Date.now(), required: false, message: msgType + label, pattern: "", trigger: ["blur"] });
    }
    function removeSpecs(domain) {
      space.splice(space.indexOf(domain), 1);
    }

    return () => (
      <el-form class="ui-w-100">
        {space.map((domain, idx) => {
          return (
            <div class="flex mb-10" key={domain.id}>
              <el-form-item label="是否必填" prop={`specs.${idx}.required`} label-width="70px" class="mr-10">
                <el-switch v-model={domain.required} />
              </el-form-item>
              <el-form-item label="提示信息" prop={`specs.${idx}.message`} label-width="70px" class="mr-10">
                <el-input v-model={domain.message} placeholder="请输入提示" style="min-width: 100px" />
              </el-form-item>
              <el-form-item label="校验正则" prop={`specs.${idx}.pattern`} label-width="70px" class="mr-10">
                <HxModalInput
                  title="选择正则"
                  placeholder="请输入或选择正则"
                  valueKey="pattern"
                  v-model={domain.pattern}
                  clearable
                  showButton
                  style="min-width: 80px"
                  componentProp={{
                    multiple: false,
                    maxHeight: 460,
                    dataList: regList,
                    columns: [
                      { label: "名称", prop: "name", width: 160 },
                      { label: "正则", prop: "pattern" }
                    ]
                  }}
                />
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
