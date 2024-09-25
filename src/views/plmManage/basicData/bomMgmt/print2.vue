<template>
  <div>
    <div><el-button type="primary" @click="printAction">打印</el-button></div>
    <div class="print-container" v-if="detailInfo.bomInfoEntryList" ref="printRef" style="width: 1645px; margin: 20px auto 0">
      <div class="logo" style="text-align: center"><el-image style="width: 720px; height: 78px" :src="'/api/static/images/greylogo.png'" /></div>
      <div style="margin: 15px 10px 0 0">
        <el-row>
          <el-col :span="8" style="font-size: 18px">
            <el-row>
              <el-col :span="7" class="des-label">BOM编号：</el-col>
              <el-col :span="17">{{ detailInfo.number }}</el-col>
            </el-row>
            <el-row
              ><el-col :span="7" class="des-label">父级物料名称：</el-col> <el-col :span="17">{{ detailInfo.materialName }}</el-col></el-row
            >
            <el-row
              ><el-col :span="7" class="des-label">规格：</el-col> <el-col :span="17">{{ detailInfo.specification }}</el-col></el-row
            >
            <el-row
              ><el-col :span="7" class="des-label">备注：</el-col> <el-col :span="17">{{ detailInfo.remark }}</el-col></el-row
            >
          </el-col>
          <el-col :span="8" style="font-size: 24px; text-align: center"><span style="letter-spacing: 0.3em">物料清单</span><span>BOM</span></el-col>
          <el-col :span="8" style="font-size: 18px">
            <el-row>
              <el-col :span="10" class="des-label">父级物料编号：</el-col>
              <el-col :span="14">{{ detailInfo.materialNumber }}</el-col>
            </el-row>
            <el-row
              ><el-col :span="10" class="des-label">辅助属性：</el-col> <el-col :span="14">{{ detailInfo.auxiliaryProp }}</el-col></el-row
            >
            <el-row
              ><el-col :span="10" class="des-label">创建日期：</el-col> <el-col :span="14">{{ detailInfo.createDate }}</el-col></el-row
            >
            <el-row>
              <el-col :span="10" class="des-label">更新日期：</el-col>
              <el-col :span="14">{{ detailInfo.modifyDate }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="padding: 0 30px">
        <el-row>
          <el-col style="text-align: right">1/{{ Math.ceil(detailInfo.bomInfoEntryList.length / 18) }}</el-col></el-row
        >
        <el-table
          :cell-style="{ borderColor: '#000' }"
          style="border: 1px solid #000"
          border
          :data="detailInfo.bomInfoEntryList.slice(0, 18)"
          :header-cell-style="{ textAlign: 'center', fontSize: 27, fontWeight: 900, backgroundColor: '#fff !important', borderColor: '#000' }"
        >
          <el-table-column label="行号" type="index" min-width="60" align="center" />
          <el-table-column prop="number" label="物料编码" min-width="150" align="left" />
          <el-table-column prop="name" label="物料名称" min-width="180" align="left" />
          <el-table-column prop="specification" label="规格型号" min-width="460" align="left" />
          <el-table-column prop="erpClsName" label="物料属性" min-width="60" align="left" />
          <el-table-column prop="itemUnitName" label="单位" align="center" min-width="70" />
          <el-table-column prop="numerator" label="用量分子" min-width="60" align="center" />
          <el-table-column prop="denominator" label="用量分母" min-width="60" align="center" />
          <el-table-column prop="remark" label="备注" min-width="350" align="left" />
          <el-table-column prop="ecnbillNo" label="ECN编号" align="left" />
        </el-table>
        <div style="padding-top: 15px; margin: 0 auto" v-if="detailInfo.bomInfoEntryList.length <= 18">
          <el-row style="font-size: 16px; text-align: center">
            <el-col :span="6" :offset="3">创建：</el-col>
            <el-col :span="6">审核：</el-col>
            <el-col :span="6">批准：</el-col>
          </el-row>
        </div>
      </div>
      <div v-if="detailInfo.bomInfoEntryList.length > 18">
        <div style="padding: 30px; margin-top: 300px" v-for="(item, idx) in new Array(Math.ceil(detailInfo.bomInfoEntryList.slice(18).length / 18))" :key="idx">
          <el-row>
            <el-col style="text-align: right">{{ idx + 2 }}/{{ Math.ceil(detailInfo.bomInfoEntryList.length / 18) }}</el-col></el-row
          >
          <el-table
            style="border: 1px solid #000"
            :cell-style="{ borderColor: '#000' }"
            :data="detailInfo.bomInfoEntryList.slice(18 * (idx + 1)).slice(0, 18)"
            border
            :header-cell-style="{ textAlign: 'center', fontSize: 27, fontWeight: 900, backgroundColor: '#fff !important', borderColor: '#000' }"
          >
            <el-table-column label="行号" type="index" min-width="60" align="center">
              <template #default="{ $index }">
                {{ $index + 18 * (idx + 1) + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="物料编码" min-width="150" align="left" />
            <el-table-column prop="name" label="物料名称" min-width="180" align="left" />
            <el-table-column prop="specification" label="规格型号" min-width="460" align="left" />
            <el-table-column prop="erpClsName" label="物料属性" min-width="60" align="left" />
            <el-table-column prop="itemUnitName" label="单位" align="center" min-width="70" />
            <el-table-column prop="numerator" label="用量分子" min-width="60" align="center" />
            <el-table-column prop="denominator" label="用量分母" min-width="60" align="center" />
            <el-table-column prop="remark" label="备注" min-width="350" align="left" />
            <el-table-column prop="ecnbillNo" label="ECN编号" align="left" />
          </el-table>
        </div>
        <div style="padding-top: 5px; margin: 0 auto">
          <el-row style="font-size: 16px; text-align: center">
            <el-col :span="6" :offset="3">创建：</el-col>
            <el-col :span="6">审核：</el-col>
            <el-col :span="6">批准：</el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { printBomTableData } from "@/api/plmManage";
import Print from "@/utils/print";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
// import bomLogo from "@/assets/bom/bomLogo.png";

defineOptions({ name: "BOMMgmtPrint" });

const route = useRoute();
const detailInfo: any = ref({});
const printRef = ref(null);

const fetchDetailInfoById = (id) => {
  printBomTableData({ id }).then((res) => {
    if (res.data) {
      detailInfo.value = res.data;
    }
  });
};

const printAction = () => {
  console.log(detailInfo.value, "获取的列表数据");
  if (printRef.value) {
    // console.log(printRef.value.outerHTML);
    Print(printRef.value);
    // const pWindow = window.open("", "_blank");
    // pWindow.focus();
    // const pDocument = pWindow.document;
    // pDocument.open();
    // pDocument.write(printRef.value.outerHTML);
    // pDocument.close();
    // pWindow.print();
    // pWindow.close();
  }
};

onMounted(() => fetchDetailInfoById(route.query.id));
</script>

<style scoped lang="scss">
.print-container {
  font-family: "Microsoft YaHei", Simsun, Arial, sans-serif;
  font-size: 13px;
  // height: calc(100vh - 178px);
  // overflow: auto;
}

@page {
  size: a4 landscape; /* A4纸，横向打印 */
  margin: 0; /* 去掉页边距 */
}

.des-label {
  text-align: right;
}
</style>
