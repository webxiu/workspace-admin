<script setup lang="ts">
import { getNodeDetailList } from "@/api/oaManage";
import { fetchGoOutRecords } from "@/api/oaManage/humanResources";
import Print from "@/utils/print";
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Printer } from "@element-plus/icons-vue";
import { computed } from "vue";
import { billStateInfo } from "./utils/config";
import bomLogo from "@/assets/images/greylogo.png";
import { carSourceConstant } from "@/config/constant";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";

const route = useRoute();
const detailInfo: any = ref({});
const nodeList = ref([]);
const printRef = ref();
const useCarWay = ref([]);

defineOptions({ name: "PrintBusinessRecord" });

const fetchDetailInfo = () => {
  fetchGoOutRecords({ isOwner: false, page: 1, limit: 1000, id: route.query.id }).then((res: any) => {
    if (res.data) {
      detailInfo.value = res.data.records[0];
      console.log(detailInfo.value, "detail info");
    }
  });
};

const getNodeDetailInfo = () => {
  getNodeDetailList({
    billId: "10038",
    billNo: route.query.billNo,
    searchType: 2
  }).then((res: any) => {
    if (res.data) {
      nodeList.value = res.data.nodeList;
      console.log(nodeList.value, "node list");
    }
  });
};

const onPrint = () => {
  nextTick(() => {
    Print(printRef.value);
  });
};

// const useCarWay = computed(() => {
//   const carStrMap = {
//     true: "自驾",
//     false: "指派司机",
//     null: ""
//   };
//   const objKey = String(detailInfo.value.applyVehicleUsage);
//   return carStrMap[objKey];
// });

const approvalStatus = computed(() => {
  return billStateInfo[detailInfo.value.billState];
});

const calcSource = (source) => {
  if (/\d/.test(source)) {
    return carSourceConstant[source];
  } else {
    return source;
  }
};

const findOptinNameByOptionValue = (optionValue) => {
  return useCarWay.value?.find((item) => item.optionValue == optionValue)?.optionName ?? "";
};

const getUseWayOpts = () => {
  getBOMTableRowSelectOptions({ optioncode: "GoOutVehicleUsage" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "GoOutVehicleUsage")?.optionList || [];
      useCarWay.value = result;
    }
  });
};

onMounted(() => {
  getUseWayOpts();
  if (route.query.id) {
    fetchDetailInfo();
    getNodeDetailInfo();
  }
});
</script>

<template>
  <div class="staffinfo-print">
    <el-button type="primary" :icon="Printer" class="print-btn" @click="onPrint" style="z-index: 99999999">打印</el-button>
    <div ref="printRef" class="printDiv">
      <!--头部表格-->
      <table class="headTB">
        <tr>
          <td colspan="100" style="border: none">
            <div class="logo" style="text-align: center"><el-image style="width: 720px; height: 70px" :src="bomLogo" /></div>
          </td>
        </tr>
        <tr style="border-top: 1px solid transparent">
          <td colspan="100" style="margin-bottom: 15px; font-size: 24px; border: none">外出申请单</td>
        </tr>
      </table>

      <!--主体表格-->
      <table class="botyTB">
        <tr>
          <td class="fontBold">申请人</td>
          <td class="alignLeft">{{ detailInfo.applyName }}</td>
          <td class="fontBold">申请时间</td>
          <td class="alignLeft">{{ detailInfo.createDate }}</td>
          <td class="fontBold">单据编号</td>
          <td class="alignLeft">{{ detailInfo.billNo }}</td>
        </tr>
        <tr>
          <td class="fontBold">同行人</td>
          <td colspan="3" class="alignLeft">{{ String(detailInfo.userNames || []) }}</td>
          <td class="fontBold">目的地</td>
          <td class="alignLeft">{{ detailInfo.destination }}</td>
        </tr>
        <tr>
          <td class="fontBold">外出事由</td>
          <td colspan="5" class="alignLeft">{{ detailInfo.gooutReason }}</td>
        </tr>
        <tr>
          <td class="fontBold">车辆来源</td>
          <td class="alignLeft">{{ calcSource(detailInfo.vehicleSource) }}</td>
          <td class="fontBold">用车方式</td>
          <td class="alignLeft">{{ findOptinNameByOptionValue(detailInfo.applyVehicleUsage) }}</td>
          <td class="fontBold">司机</td>
          <td class="alignLeft">{{ detailInfo.goOutVehicleVO?.driver }}</td>
        </tr>
        <tr>
          <td class="fontBold">车牌</td>
          <td class="alignLeft">{{ detailInfo.goOutVehicleVO?.plateNumber }}</td>
          <td class="fontBold">出车公里数</td>
          <td class="alignLeft">{{ detailInfo.goOutRegisterVO?.outMileage }}</td>
          <td class="fontBold">返程公里数</td>
          <td class="alignLeft">{{ detailInfo.goOutBackRegisterVO?.backMileage }}</td>
        </tr>
        <tr>
          <td class="fontBold">预计外出时间</td>
          <td class="alignLeft">{{ detailInfo.planOutDate }}</td>
          <td class="fontBold">预计返回时间</td>
          <td class="alignLeft">{{ detailInfo.planBackDate }}</td>
          <td class="fontBold">实际返回时间</td>
          <td class="alignLeft">{{ detailInfo.goOutBackRegisterVO?.realBackDate }}</td>
        </tr>
        <tr>
          <td class="fontBold">车辆情况</td>
          <td colspan="3" class="alignLeft">{{ detailInfo.goOutBackRegisterVO?.vehicleInfo }}</td>
          <td class="fontBold">审批状态</td>
          <td class="alignLeft">{{ approvalStatus }}</td>
        </tr>
        <tr>
          <td colspan="2" class="fontBold">审批流程</td>
          <td colspan="2" class="fontBold">审批人</td>
          <td colspan="2" class="fontBold">审批时间</td>
        </tr>
        <tr v-for="(item, idx) in nodeList" :key="idx">
          <td colspan="2">{{ item.nodeName }}</td>
          <td colspan="2">{{ item.approvalName }}</td>
          <td colspan="2">{{ item.approvalDate }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@page {
  size: a5 landscape;

  /* A5纸，横向打印 */
  // margin: 0 3mm; /* 设置页边距 */
}

.staffinfo-print {
  min-height: 100vh;

  .print-btn {
    position: absolute;
    top: 20px;
    left: 20px;
  }
}

.printDiv {
  margin: 0 auto;
  page-break-after: always;
}

table {
  width: 900px;
  margin: 0 auto;
  font-family: "Microsoft YaHei", Simsun, Arial, sans-serif;
  font-size: 13px;
  text-align: left;
  text-align: center;
  table-layout: fixed;
  border-collapse: collapse;
  border: none;
}

table tr td {
  box-sizing: border-box;
  height: 26px;
  padding-left: 2px;
  border: 1px solid black;
}

.headTB {
  height: 141px;
}

.botyTB {
  // height: 868px;
  // border: 2px solid black;

  tr {
    height: 40px;
  }
}

.printPage {
  page-break-before: always;
  height: 1090px;

  &.hidden {
    display: none;
  }
}

/* 项目分隔行样式 */
.item {
  font-weight: bold;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

/* 授权书条目样式 */
.authorization {
  padding-left: 10px;
  text-align: left;
  border: none;
}

/* 勾选框样式 */
.checkbox {
  font-size: 16px;
}

/* 图片 */
.photo {
  width: 700px;
  height: 500px;
  margin-top: 20px;
}

.alignLeft {
  padding-left: 8px;
  text-align: left;
}

.fontBold {
  font-weight: bolder;
}
</style>
