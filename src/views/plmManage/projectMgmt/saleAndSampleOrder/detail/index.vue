<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="5">
          <el-checkbox-group v-model="formData.orderType" @change="changeGroup1">
            <el-checkbox label="意向订单" value="意向订单" />
            <el-checkbox label="正式订单" value="正式订单" />
            <el-checkbox label="更改单" value="更改单" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div style="width: 84px; text-align: right">BOM编号：</div>
            <div style="width: 185px"><el-input placeholder=" " v-model="formData.bomNumber" /></div>
          </div>
        </td>
        <td colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 70px; text-align: right">版本：</div>
            <div style="width: 180px"><el-input disabled placeholder=" " v-model="formData.version" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div style="width: 84px; text-align: right">生产单号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.productNo" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>产品型号：</div>
            <div style="flex: 1">
              <HxModalInput
                title="选择产品"
                placeholder="请选择产品型号"
                valueKey="productModel"
                v-model="formData.productModel"
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
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div style="width: 70px; text-align: right">国别：</div>
            <div style="flex: 1">
              <el-select v-model="formData.country" placeholder="请选择" class="ui-w-100">
                <el-option v-for="item in countryOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>下单日期：</div>
            <div style="flex: 1">
              <el-date-picker
                style="width: 100%"
                v-model="formData.orderDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>要求交货日期：</div>
            <div style="flex: 1">
              <el-date-picker
                style="width: 100%"
                v-model="formData.reqDeliveryDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div>业务订单号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.billOrderNo" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>订货数量：</div>
            <div style="flex: 1"><el-input-number :controls="false" class="ui-w-100" v-model="formData.orderAmount" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>产品电压：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.voltage" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>客户编号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.customerNo" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>回复交货日期：</div>
            <div style="flex: 1">
              <el-date-picker
                style="width: 100%"
                v-model="formData.replyDeliveryDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div style="display: flex; align-items: center">
            <div>安全要求：</div>
            <div style="flex: 1">
              <el-checkbox-group v-model="formData.safeReq" @change="changeGroup2">
                <el-checkbox label="需取得认证" value="需取得认证" />
                <el-checkbox label="需符合标准要求" value="需符合标准要求" />
                <el-checkbox label="无要求满足功能需求" value="无要求满足功能需求" />
              </el-checkbox-group>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="2">
          <div style="display: flex; align-items: center">
            <div>PS号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.psNo" /></div>
          </div>
        </td>
        <td colspan="4"><el-input placeholder=" " v-model="formData.psNo1" /></td>
      </tr>
      <tr>
        <td colspan="4"><el-input placeholder=" " v-model="formData.psNo2" /></td>
      </tr>
      <tr>
        <td colspan="6" class="fw head-col">配 置 表 明 细</td>
      </tr>
      <tr>
        <td rowspan="2">
          <div style="display: flex; align-items: center">
            <div>安全要求：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.safeReqDetail" /></div>
          </div>
        </td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>USB线规格描述：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.usbDesc" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>颜色：</div>
            <div style="flex: 1">
              <el-select v-model="formData.color" placeholder="请选择" class="ui-w-100">
                <el-option v-for="item in colorOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>认证号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.authNo" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>其它</td>
        <td colspan="3"><el-input placeholder=" " v-model="formData.other" /></td>
      </tr>
      <tr>
        <td><div style="display: none">站位内容，无实际意义</div></td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>规格：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.specs" /></div>
          </div>
        </td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>品牌：</div>
            <div>
              <el-select v-model="formData.brand" placeholder="请选择" style="width: 200px">
                <el-option v-for="item in brandOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div style="display: flex; align-items: center">
            <div>铁板颜色(包布)：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.ironColor" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>最高温度要求：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.maxTemperature" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>定时要求：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.timeReq" /></div>
          </div>
        </td>
      </tr>

      <tr>
        <td class="slash">
          <span style="position: absolute; bottom: 6px; left: 12px; z-index: 1; color: #666">模号</span>
          <span style="position: absolute; top: 6px; right: 12px; z-index: 1; color: #666">明细</span>
        </td>
        <td>物料名称</td>
        <td>颜色要求</td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>丝印总编号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.screenTotalPrintNo" /></div>
          </div>
        </td>
      </tr>

      <tr v-for="(item, idx) in dataList" :key="idx">
        <td class="head-col" v-if="[0, 2, 4].includes(idx)" rowspan="2">{{ item.modelNoSeq }}</td>
        <td class="head-col" v-else-if="[6, 7, 8].includes(idx)">{{ item.modelNoSeq }}</td>
        <td class="head-col" v-else-if="[9].includes(idx)" rowspan="4">{{ item.modelNoSeq }}</td>
        <td><el-input placeholder=" " v-model="item.materialName" /></td>
        <td>
          <el-select v-model="item.colorReq" placeholder="请选择" class="ui-w-100">
            <el-option v-for="el in colorOpts" :key="el.optionValue" :label="el.optionName" :value="el.optionValue" />
          </el-select>
        </td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>丝印编号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="item.screenPrintNo" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5"><div style="height: 24px" /></td>
      </tr>
      <tr>
        <td>外箱</td>
        <td>
          <div style="display: flex; align-items: center">
            <div>箱号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.boxNo" /></div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center">
            <div>MODEL NO：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.modelNo" /></div>
          </div>
        </td>
        <td colspan="2">
          <div style="display: flex; align-items: center">
            <div>丝印编号：</div>
            <div style="flex: 1"><el-input placeholder=" " v-model="formData.boxScreenPrintNo" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div style="display: flex; align-items: center">
            <div>彩盒总编号：</div>
            <div style="width: 182px"><el-input placeholder=" " v-model="formData.rosyBoxTotalNo" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td><div style="display: none">站位内容，无实际意义</div></td>
        <td>物料名称</td>
        <td>丝印编号及规格描述</td>
        <td>物料名称</td>
        <td>丝印编号及规格描述</td>
      </tr>
      <tr>
        <td rowspan="2" class="head-col">彩盒</td>
        <td>外盒</td>
        <td><el-input placeholder=" " v-model="formData.outBoxSpecs" /></td>
        <td>说明书</td>
        <td><el-input placeholder=" " v-model="formData.funcBookSpecs" /></td>
      </tr>
      <tr>
        <td>内盒</td>
        <td><el-input placeholder=" " v-model="formData.innerBoxSpecs" /></td>
        <td>内卡</td>
        <td><el-input placeholder=" " v-model="formData.innerCard" /></td>
      </tr>

      <tr>
        <td rowspan="3" class="head-col">标签</td>
        <td>电源线标签</td>
        <td><el-input placeholder=" " v-model="formData.powerLineLabel" /></td>
        <td>高温标签</td>
        <td><el-input placeholder=" " v-model="formData.hyperthermiaLabel" /></td>
      </tr>
      <tr>
        <td>QC标签</td>
        <td><el-input placeholder=" " v-model="formData.qlLabel" /></td>
        <td>防伪标签</td>
        <td><el-input placeholder=" " v-model="formData.securityLabel" /></td>
      </tr>
      <tr>
        <td>贴纸</td>
        <td><el-input placeholder=" " v-model="formData.stickers" /></td>
        <td><div style="display: none">站位内容，无实际意义</div></td>
        <td><div style="display: none">站位内容，无实际意义</div></td>
      </tr>
      <tr>
        <td width="275px">默认包材：<span style="color: red">（需求“√”选，放弃为不需 要，用量有变更，请填写。否则为默认用 量）</span></td>
        <td colspan="4" style="padding-top: 0">
          <div>
            <el-checkbox-group v-model="formData.defaultPackage" @change="changeGroup3">
              <el-checkbox label="气泡袋（套铝板）" value="气泡袋（套铝板）" />
              <el-checkbox label="气泡袋（套整机）" value="气泡袋（套整机）" />
              <el-checkbox label="PE平口袋（套说明书）" value="PE平口袋（套说明书）" />
              <el-checkbox label="珍珠棉（隔彩盒）" value="珍珠棉（隔彩盒）" />
              <el-checkbox label="透明胶带（打包）" value="透明胶带（打包）" />
            </el-checkbox-group>
          </div>
          <div v-if="formData.defaultPackage?.length">
            <span>用量：</span>
            <el-input-number :controls="false" placeholder=" " v-model="formData.usage" />
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div>备注：</div>
          <div><el-input v-model="formData.remark" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import { getEnumDictList } from "@/utils/table";

const countryOpts = ref([]);
const colorOpts = ref([]);
const brandOpts = ref([]);
const formData: any = reactive({ version: "V0" });

const dataListConfig = [];

for (let i = 0; i < 13; i++) {
  let modelNoSeq;
  if ([0, 1].includes(i)) modelNoSeq = "一";
  if ([2, 3].includes(i)) modelNoSeq = "二";
  if ([4, 5].includes(i)) modelNoSeq = "三";
  if ([6].includes(i)) modelNoSeq = "四";
  if ([7].includes(i)) modelNoSeq = "五";
  if ([8].includes(i)) modelNoSeq = "六";
  if ([9, 10, 11, 12].includes(i)) modelNoSeq = "七";
  dataListConfig.push({ modelNoSeq, materialName: "", colorReq: "", screenPrintNo: "" });
}

const dataList = ref(dataListConfig);

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

const changeGroup1 = () => {
  if (formData.orderType.length > 1) {
    formData.orderType.splice(0, 1);
  }
};

const changeGroup2 = () => {
  if (formData.safeReq.length > 1) {
    formData.safeReq.splice(0, 1);
  }
};

const changeGroup3 = () => {
  if (formData.defaultPackage.length > 1) {
    formData.defaultPackage.splice(0, 1);
  }
};

onMounted(() => {
  getEnumDictList(["CountryCode", "ProductColor", "BrandList"]).then((res) => {
    if (res) {
      countryOpts.value = res["CountryCode"];
      colorOpts.value = res["ProductColor"];
      brandOpts.value = res["BrandList"];
    }
  });
});

defineExpose({ dataList, formData });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    .slash {
      position: relative;
      font-size: 14px;
      // width: 140px;
      height: 40px;
      padding: 0 !important;
      background-color: #000;
    }

    .slash::before {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      clip-path: polygon(0 0.5px, 0 100%, calc(100% - 0.5px) calc(100% + 0.5px));
      content: "";
      background-color: #fff;
    }

    .slash::after {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      clip-path: polygon(100% calc(100% - 0.5px), 100% 0, 0 -0.5px);
      content: "";
      background-color: #fff;
    }

    .line-txt {
      padding: 6px;
      font-weight: 700;
    }

    .fw {
      font-weight: 700;
      color: #000;
    }

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
