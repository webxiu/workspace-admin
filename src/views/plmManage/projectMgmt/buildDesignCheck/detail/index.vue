<template>
  <div class="build-detail">
    <table>
      <tr>
        <td colspan="10" class="black-td">项目基本信息</td>
      </tr>
      <tr>
        <td class="head-col req-txt">产品型号</td>
        <td class="head-col">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="_formData.productModel"
            readonly
            showButton
            @select="onSelect"
            :componentProp="{
              searchConfig: [{ label: '产品型号', value: 'productCode' }],
              maxHeight: 520,
              columns: [
                { label: '产品型号', prop: 'productCode', headerAlign: 'center' },
                { label: '产品类别', prop: 'productType', headerAlign: 'center' }
              ],
              api: fetchProductStoreList
            }"
          />
        </td>
        <td class="head-col req-txt">产品名称</td>
        <td class="head-col"><el-input v-model="_formData.productName" /></td>
        <td class="head-col req-txt">日期</td>
        <td class="head-col">
          <el-date-picker
            v-model="_formData.date"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td class="head-col req-txt">版本号</td>
        <td class="head-col"><el-input v-model="_formData.version" /></td>
        <td class="head-col req-txt">模具编号</td>
        <td class="head-col"><el-input v-model="_formData.moldNo" /></td>
      </tr>
      <tr>
        <td class="black-td">序号</td>
        <td colspan="6" class="black-td">检查项目</td>
        <td colspan="3" class="black-td">检查结果</td>
      </tr>

      <tr v-for="(item, idx) in itemMapArr" :key="item.formDataKey">
        <td align="center">{{ idx + 1 }}</td>
        <td colspan="6">{{ item.item }}</td>
        <td colspan="3">
          <el-checkbox-group v-model="_formData[item.formDataKey]" @change="(val) => changeGroup(val, item.formDataKey)">
            <el-checkbox v-for="el in item.els" :key="el" :label="el" :value="el" />
          </el-checkbox-group>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { reactive } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";

const _formData = reactive({
  productModel: "",
  productName: "",
  version: "V0",
  moldNo: "",
  date: dayjs().format("YYYY-MM-DD HH:mm:ss")
});

const itemMapArr = [
  { item: "产品颜色是否已经定义明确?(产品基体和表面处理)", formDataKey: "checkRes1", els: ["是", "否"] },
  { item: "产品表面处理是否已经定义明确?(喷涂、电镀、印刷、镭雕、皮纹)", formDataKey: "checkRes2", els: ["是", "否"] },
  { item: "材料及其牌号是否已经定义清楚(有指定牌号和厂家吗)?", formDataKey: "checkRes3", els: ["是", "否"] },
  { item: "是否有明确的阻燃等级要求?", formDataKey: "checkRes4", els: ["是", "否", "不适用"] },
  { item: "产品特性(2D图纸标注)定义是否明确且具体(重点关注特殊属性)?", formDataKey: "checkRes5", els: ["是", "否", "部分需要完善"] },
  { item: "3D数模是否已经包括了涂层厚度?", formDataKey: "checkRes6", els: ["是", "否", "不适用"] },
  { item: "提供的3D图形是否已经设计拔模斜度?", formDataKey: "checkRes7", els: ["是", "否"] },
  { item: "拔模斜度是否已经确认能满足皮纹粗糙度?", formDataKey: "checkRes8", els: ["是", "否"] },
  { item: "尺寸公差是否已经定义并且合理?", formDataKey: "checkRes9", els: ["是", "否", "部分需要完善"] },
  { item: "是否明确与零件相配合的胶位面, 需通过后期试模来调整的胶位面预留量?", formDataKey: "checkRes10", els: ["是", "否", "不适用"] },
  { item: "零件表面是否存在不能设置顶杆、浇口的区域?", formDataKey: "checkRes11", els: ["是", "否"] },
  { item: "模具的适用机台是否已经评估?", formDataKey: "checkRes12", els: ["是", "否"] },
  { item: "筋条位的设计是否合理?(筋厚与壁厚的比例、高度、走向位置、拔模)", formDataKey: "checkRes13", els: ["是", "否", "部分需要完善"] },
  { item: "柱位的设计是否合理?(高度、直径、壁厚、缩壁、支撑、拔模斜度)", formDataKey: "checkRes14", els: ["是", "否", "部分需要完善"] },
  { item: "壁厚设计是否合理?(厚度、均匀性、厚薄过度、侧壁厚度、尖角)", formDataKey: "checkRes15", els: ["是", "否", "部分需要完善"] },
  { item: "卡钩设计是否合理?(滑块强度、滑块行程、镶件封胶方式、拔模斜度、胶位强度)", formDataKey: "checkRes16", els: ["是", "否", "部分需要完善"] },
  { item: "通孔设计是否合理?(滑块强度、滑块行程)", formDataKey: "checkRes17", els: ["是", "否", "部分需要完善"] },
  { item: "产品中是否存在局部倒扣的面？建议改进结构能减少抽芯", formDataKey: "checkRes18", els: ["是", "否"] },
  { item: "如果存在螺纹结构, 其设计结构和脱模性能是否合理?", formDataKey: "checkRes19", els: ["是", "否", "不适用"] },
  { item: "如果存在嵌件, 嵌件与塑件固定、位置排放、生产操作的方便性等是否已经评估?", formDataKey: "checkRes20", els: ["是", "否", "不适用"] },
  { item: "装配结构区域的强度是否足够?", formDataKey: "checkRes21", els: ["是", "否", "有风险"] },
  { item: "融接线、气穴、缩痕是否会影响外观?", formDataKey: "checkRes22", els: ["是", "否", "有风险"] },
  { item: "融接线是否会影响结构位的强度?", formDataKey: "checkRes23", els: ["是", "否", "有风险"] },
  { item: "装配结构是否有导向斜面?", formDataKey: "checkRes24", els: ["是", "否", "不适用"] },
  { item: "客户是否已经定义可靠性测试要求?(高低温冲击试验、耐摩擦、耐溶剂、百格试验）", formDataKey: "checkRes25", els: ["是", "否", "部分需要补充"] },
  {
    item: "产品总需求量和项目节点是否已经定义？(EAU、项目寿命周期、T0, T1, OTS, DV, PV, PPAP, SOP)",
    formDataKey: "checkRes26",
    els: ["是", "否", "部分需要补充"]
  },
  { item: "客户对包装方式是否有特殊要求?", formDataKey: "checkRes27", els: ["是", "否"] },
  { item: "我们定义的包装方式是否已经得到详细评估?(成本、产品防护、回收、环保、运输、采购)", formDataKey: "checkRes28", els: ["是", "否"] }
];

const changeGroup = (_, key) => {
  if (_formData[key].length > 1) {
    _formData[key].splice(0, 1);
  }
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  _formData.productModel = val.productCode;
};

defineExpose({ _formData });
</script>

<style scoped lang="scss">
.build-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .head-col {
      color: #000;
    }

    .req-txt {
      color: red;
    }

    .black-td {
      font-size: 16px;
      color: #fff;
      text-align: center;
      background-color: #555;
    }

    td {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
