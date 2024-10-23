import { useRoute } from "vue-router";

const InputTextArea = (row) => {
  const route = useRoute();
  if (route.query.id) return row.selectValue;
  return <el-input v-model={row.selectValue} rows={2} type="textarea" placeholder="请输入" />;
};

const InputGroups = (row) => {
  const route = useRoute();
  return (
    <div>
      {row.productDevTypeSettingList.map((item, idx) => {
        if (route.query.id) {
          return (
            <div style={{ margin: "8px 0" }}>
              <span>{item.valueAll}：</span>
              <span>{row[`${item.valueAll}`]}</span>
            </div>
          );
        }
        return (
          <div style={{ margin: "8px 0" }}>
            <span>{item.valueAll}</span>
            {<el-input key={item.id} v-model={row[`${item.valueAll}`]} placeholder="请输入" style={{ width: "150px", margin: "0 0 0 15px" }} />}
          </div>
        );
      })}
    </div>
  );
};

const CheckBoxGroup = (row) => {
  return (
    <el-checkbox-group v-model={row.selectValue}>
      {row.productDevTypeSettingList.map((item) => {
        return <el-checkbox label={item.valueAll}>{item.valueAll}</el-checkbox>;
      })}
    </el-checkbox-group>
  );
};

const RadioGroup = (row) => {
  const route = useRoute();

  return route.query.id ? (
    row.selectValue
  ) : (
    <el-radio-group v-model={row.selectValue}>
      {row.productDevTypeSettingList.map((item) => {
        return <el-radio label={item.valueAll}>{item.valueAll}</el-radio>;
      })}
    </el-radio-group>
  );
};

const SelectGroup = (row) => {
  const route = useRoute();

  return route.query.id ? (
    row.selectValue
  ) : (
    <el-select v-model={row.selectValue}>
      {row.productDevTypeSettingList
        .sort((a, b) => a.sort - b.sort)
        .map((item) => {
          return <el-option key={item.id} label={item.valueAll} value={item.valueAll} />;
        })}
    </el-select>
  );
};

const formTypeMap = {
  1: InputTextArea,
  2: CheckBoxGroup,
  3: InputGroups,
  4: SelectGroup,
  5: RadioGroup
};

const formInitValueMap = {
  1: "",
  2: [],
  3: "",
  4: "",
  5: ""
};

export const generateComponent = (row: any) => {
  row.selectValue = row.selectValue || formInitValueMap[row.valueType];
  return formTypeMap[row.valueType](row);
};
