<template>
  <div>
    <div><el-button type="primary" @click="printAction">打印</el-button></div>
    <div class="print-container" v-if="detailInfo.bomInfoEntryList" ref="printRef" style="width: 1645px; padding: 20px 30px 0">
      <div class="logo" style="text-align: center"><el-image style="width: 720px; height: 78px" :src="bomLogo" /></div>
      <div style="margin: 15px 10px 15px 0">
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
      <div class="table-outer">
        <table align="center" cellpadding="8">
          <thead>
            <tr>
              <td class="table-header" align="center" style="width: 50px">行号</td>
              <td class="table-header">物料编码</td>
              <td class="table-header">物料名称</td>
              <td class="table-header">规格型号</td>
              <td class="table-header">物料属性</td>
              <td class="table-header" style="width: 50px">单位</td>
              <td class="table-header" style="width: 58px">用量分子</td>
              <td class="table-header" style="width: 58px">用量分母</td>
              <td class="table-header">备注</td>
              <td class="table-header">ECN编号</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailInfo.bomInfoEntryList" :key="index">
              <td align="center">{{ index + 1 }}</td>
              <td>{{ item.number }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.specification }}</td>
              <td>{{ item.erpClsName }}</td>
              <td>{{ item.itemUnitName }}</td>
              <td>{{ item.numerator }}</td>
              <td>{{ item.denominator }}</td>
              <td>{{ item.remark }}</td>
              <td>{{ item.ecnbillNo }}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin: 8px auto 0">
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
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import bomLogo from "@/assets/images/greylogo.png";

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
    Print(printRef.value);
  }
};

onMounted(() => fetchDetailInfoById(route.query.id));
</script>

<style scoped lang="scss">
.print-container {
  font-family: "Microsoft YaHei", Simsun, Arial, sans-serif;
  font-size: 13px;
}

@page {
  size: a4 landscape; /* A4纸，横向打印 */
  margin: 10mm 0; /* 去掉页边距 */
}

@media print {
  .table-outer tbody tr {
    page-break-inside: avoid;
  }
}

.des-label {
  text-align: right;
}

.table-header {
  font-weight: 900;
}

.table-outer {
  table {
    width: 100%;
    line-height: 30px;
    text-align: left;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  table td {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }
}
</style>
