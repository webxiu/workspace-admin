<template>
  <div>
    <el-form ref="formRef" inline>
      <el-form-item label="指导书列表">
        <el-select v-model="printItem" placeholder="打印选中指导书 (默认打印全部)" multiple collapse-tags collapse-tags-tooltip clearable style="width: 260px">
          <el-option v-for="item in optionList" :key="item.id" :label="item.workContent" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onReset" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="print-content" ref="printRef">
      <el-empty v-if="!printData?.workStationVOS?.length" description="暂无排位表数据" />
      <template v-else>
        <Appendix v-if="!printItem.length || printItem.includes('appendix')" class="page-record" :row="printData" />
        <VersionRecord v-if="!printItem.length || printItem.includes('record')" class="page-record" :row="row" :printData="printData" />
        <div v-for="item in printData?.workStationVOS" :key="item.id" v-show="getShowIndex(item.id)">
          <div class="sop-title block-quote-tip">
            <el-tag type="primary" effect="dark" round>({{ getPageIndex(item.id) }}/{{ printData?.workStationVOS?.length }}) {{ item.workContent }}</el-tag>
          </div>
          <div class="page line-a">
            <div class="b1 sop-header">
              <div class="header-left">
                <div class="top">
                  <img :src="logo" width="80" height="80" alt="" />
                  <div class="name">
                    <span class="mr-6">{{ printData.productCode }}</span
                    ><span>{{ printData.manualName }}</span>
                  </div>
                </div>
                <div class="bottom">
                  <!-- <div>MES:xx_Mex</div> -->
                  <div>制作日期:{{ formatDate(printData.createDate, "YYYY年MM月DD日") }}</div>
                  <div>页次: {{ getPageCount(item.id) }}</div>
                  <div>版本：{{ printData.ver }}</div>
                </div>
                <img src="@/assets/images/controlled_document.png" alt="受控文件" class="control-img" />
              </div>
              <div class="header-right line-r">
                <div class="create-info line-a">
                  <div class="item1 text-center vertical-text line-r line-b text-space">裁决</div>
                  <div class="item2 line-r text-center">日期</div>
                  <div class="item3 text-center line-r line-b text-space">制作</div>
                  <div class="item4 text-center line-r line-b text-space">审核</div>
                  <div class="item5 text-center line-r line-b text-space">批准</div>
                  <div class="item4 text-center line-r line-b text-space">审核</div>
                  <div class="item6 text-center line-b text-space">受控</div>
                  <div class="item7 text-center line-r line-b">{{ printData.createUserName }}</div>
                  <div class="item8 text-center line-r line-b">{{ printData.auditing }}</div>
                  <div class="item9 text-center line-r line-b">{{ printData.approveName }}</div>
                  <div class="item10 text-center line-b">{{ printData.controlledName }}</div>

                  <div class="item11 text-center line-r">{{ formatDate(printData.createDate, "YYYY-MM-DD") }}</div>
                  <div class="item12 text-center line-r">{{ formatDate(printData?.auditingDate, "YYYY-MM-DD") }}</div>
                  <div class="item13 text-center line-r">{{ formatDate(printData?.approveDate, "YYYY-MM-DD") }}</div>
                  <div class="item14 text-center">{{ formatDate(printData?.controlledDate, "YYYY-MM-DD") }}</div>
                </div>
              </div>
            </div>
            <div class="sop-desc b1 line-a">
              <div class="desc-item line-r">生产机型/国家:</div>
              <div class="desc-item line-r fw-700">{{ printData?.productCode }}{{ printData.country ? `（${printData.country}）` : "" }}</div>
              <div class="desc-item line-r">工位名称:</div>
              <div class="desc-item line-r fw-700">{{ item.workContent }}（{{ getPageCount(item.id) }}）</div>
              <div class="desc-item line-r">文件编号:</div>
              <div class="desc-item line-r fw-700">{{ printData.fileNumber }}</div>
              <div class="desc-item line-r">S/T:</div>
              <div class="desc-item fw-700">{{ item.manHour }}</div>
            </div>
            <div class="sop-content b1 line-r">
              <div class="content-box line-a">
                <div class="content-layout line-b">
                  <div class="cate-title line-r ml-4">使用物料:</div>
                  <div class="cate-title project-name">— 作 业 工 程 —</div>
                </div>
                <div class="content-layout">
                  <div class="operate-cate flex ui-w-100 line-r">
                    <div class="materiel">
                      <HailenTable :columns="columns" :dataList="item.materialVOS?.length ? item.materialVOS : [{}]" />
                    </div>
                    <div class="tool ml-4">
                      <div class="cate-title">使用工具及治具:</div>
                      <div class="cate-content" v-html="item.contentVO?.withToolFixture" />
                    </div>
                    <div class="content ml-4">
                      <div class="cate-title">作业内容:</div>
                      <div class="cate-content" v-html="item.contentVO?.jobContent" />
                    </div>
                    <div class="note ml-4 color-f00">
                      <div class="cate-title">注意事项:</div>
                      <div class="cate-content" v-html="item.contentVO?.precautions" />
                    </div>
                  </div>
                  <div class="p-4">
                    <ReferImage :imgList="item.jobEngineeringVOS" />
                  </div>
                </div>
                <div class="param">
                  <HailenTable class="left" :columns="columns2" :dataList="getCheckItem(item.checkRuleVOS)" />
                  <div class="flex">
                    <HailenTable class="left" :columns="columns3" :dataList="getToolItem(item.checkRuleVOS, 0)" />
                    <HailenTable class="right" :columns="columns3" :dataList="getToolItem(item.checkRuleVOS, 1)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, ref, watch } from "vue";
import Print from "@/utils/print";
import { message } from "@/utils/message";
import logo from "@/assets/images/logo.png";
import Appendix from "./Appendix.vue";
import { formatDate } from "@/utils/common";
import VersionRecord from "./VersionRecord.vue";
import ReferImage from "./component/ReferImage.vue";
import HailenTable, { TableColumnType } from "./component/HailenTable.vue";
import { printEsopStation, PrintOperateBookStationResType, OperateBookItemType } from "@/api/oaManage/productMkCenter";

interface Props {
  materialId?: string;
  itemInfo?: any;
  pageIndex?: number;
  totalPage?: number;
  row?: OperateBookItemType;
}
const formRef = ref();
const printRef = ref();
const printItem = ref([]);
const props = defineProps<Props>();
const printData = ref<PrintOperateBookStationResType>({} as PrintOperateBookStationResType);

const columns: TableColumnType[] = [
  { label: "序号", prop: "", type: "index", width: 32 },
  { label: "名称", prop: "materialName", width: 80 },
  { label: "物料编号", prop: "materialNumber", width: 80 },
  { label: "物料规格描述", prop: "specification" },
  { label: "用量", prop: "qty", width: 32, render: ({ row }) => <span>{row.qty ? row.qty + (row.unit || "") : ""}</span> }
];
const columns2: TableColumnType[] = [
  { label: "确认项目", prop: "confirm", align: "left" },
  { label: "确认频率/数量", prop: "confirmFrequency" },
  { label: "确认部门", prop: "deptName" },
  { label: "管理方法", prop: "manageMethod", width: 180 }
];
const columns3: TableColumnType[] = [
  { label: "工具", prop: "tool" },
  { label: "数量", prop: "quantity" },
  { label: "标准设定参数", prop: "standardParam" }
];

const optionList = computed(() => {
  const operateList = printData.value?.workStationVOS || [];
  if (!operateList.length) return [];
  const _arr = operateList.map(({ id, workContent }) => ({ id, workContent }));
  const newList = [
    { id: "appendix", workContent: "封面" },
    { id: "record", workContent: "变更记录表" },
    ..._arr // 添加附录和变更记录表选项
  ];
  console.log("newList", newList);
  return newList;
});

watch(props, (val) => getPrintList(val.materialId), { immediate: true });

function onReset() {
  printItem.value = [];
}

// 获取可显示页面
function getShowIndex(id: string) {
  return !printItem.value.length || printItem.value.includes(id);
}
// 获取页码
function getPageIndex(id: string) {
  const station = printData.value.workStationVOS;
  const idx = station.findIndex((item) => item.id === id);
  return idx + 1;
}
// 获取页次
function getPageCount(id: string) {
  const station = printData.value.workStationVOS;
  const idx = station.findIndex((item) => item.id === id);
  return `${station[idx].stationNo}/${printData.value.totalPage}`;
}

function getPrintList(id) {
  if (!id) return message.error("物料id不存在");
  printEsopStation({ id: id }).then(({ data }) => {
    if (!data) return;
    if (props.itemInfo) data.workStationVOS = [props.itemInfo];
    printData.value = data || ({} as any);
  });
}

/**
 * 获取检测表列表数据
 * @param checkRules 检测表列表
 */
function getCheckItem(checkRuleVOS) {
  const tempArr = []; // {} 占位
  tempArr.push(checkRuleVOS[0] || {});
  tempArr.push(checkRuleVOS[1] || {});
  return tempArr;
}
/**
 * 获取检测表下的工具表数据
 * @param checkRules 检测表列表
 * @param rowIndex 取工具表行索引
 */
function getToolItem(checkRuleVOS, rowIndex) {
  const tempArr = []; // {} 占位
  tempArr.push(checkRuleVOS[0]?.toolParametersVOS[rowIndex] || {});
  tempArr.push(checkRuleVOS[1]?.toolParametersVOS[rowIndex] || {});
  return tempArr;
}

function onPrint() {
  if (!printData.value?.workStationVOS?.length) {
    return message.error("无打印数据, 请先配置排位表");
  }
  message.warning("正在加载打印预览, 请等待...", { duration: 6000 });
  if (printRef.value) {
    Print(printRef.value);
  }
}

defineExpose({ onPrint });
</script>

<style lang="scss" scoped>
$gap: 5px;
$line-color: #000;
$small-size: 12px;

@media print {
  @page {
    size: a4 landscape; /* A4纸张，横向 */
    margin: 10mm; /* 设置页边距 */
  }

  body,
  html {
    padding: 0;
    margin: 0;
  }

  div {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page,
  .page-record {
    page-break-after: always; /* 每个page类的元素后强制分页 */
    width: 100%; /* 使用100%的宽度 */
    margin-bottom: 10mm !important; /* 设置内容间的间隔 */
  }

  // 打印时隐藏指导书标题栏
  .print-content .sop-title,
  :deep(.page-record .sop-title) {
    display: none !important;
  }
}

.sop-title {
  margin: 20px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.page {
  display: grid;
  grid-template-rows: 100px 30px 580px;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: $gap;
  font-family: STKaiti, sans-serif;
  color: $line-color;
}

.b1 {
  grid-column: 1 / 5;
}

.line-a {
  border: 1px solid $line-color;
}

.line-r {
  border-right: 1px solid $line-color;
}

.line-b {
  border-bottom: 1px solid $line-color;
}

/** 字体纵向 */
.vertical-text {
  writing-mode: vertical-rl;
}

/** 字体间距 */
.text-space {
  text-indent: 1em;
  letter-spacing: 8px;
}

/** 头部内容 */
.sop-header {
  display: grid;
  grid-template-columns: 1fr 351px;
  overflow: hidden;
  font-size: 12px;

  .header-left {
    position: relative;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 1fr 28px;
    grid-template-columns: 1fr;
    padding: 10px 10px 0;

    .top {
      display: grid;
      grid-template-columns: 100px 1fr;
      overflow: hidden;

      .name {
        place-self: center start;
        width: 100%;
        font-size: 26px;
        line-height: 30px;
      }
    }

    .bottom {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      place-items: center start;
      font-size: 10px;
    }

    .control-img {
      position: absolute;
      top: 50%;
      right: 8px;
      width: 169px;
      transform: translateY(-50%);
    }
  }

  .text-center {
    display: grid;
    place-items: center;
  }

  .header-right {
    display: grid;
    grid-template-columns: 1fr;
    margin: $gap $gap 0 0;

    .create-info {
      display: grid;
      grid-template-columns: 36px 1fr 1fr 1fr 1fr;
      grid-template-rows: 20px 1fr 26px;
      grid-template-areas:
        "item1 item3 item4 item5 item6"
        "item1 item7 item8 item9 item10"
        "item2 item11 item12 item13 item14";

      margin-bottom: $gap;
      border-right: none;
    }
    @for $i from 1 through 11 {
      .item#{$i} {
        grid-area: item#{$i};
      }
    }
  }
}

.sop-desc {
  display: grid;
  grid-template-columns:
    minmax(100px, 1fr)
    minmax(140px, 1fr)
    minmax(80px, 1fr)
    minmax(240px, 1fr)
    /** 文件编号 */
    minmax(80px, 1fr)
    180px
    77px
    77px;
  margin-right: $gap;
  overflow: hidden;
  font-size: $small-size;
  border-left: none;

  .desc-item {
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
    padding: 0 4px;
    overflow: hidden;
    line-height: 1.2em;
  }
}

.sop-content {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  padding: $gap 0 0 $gap;
  margin-right: $gap;
  overflow: hidden;
  border-top: none;

  .content-box {
    display: grid;
    grid-template-rows: 28px 1fr 52px;
    margin: 0;
    border-right: none;

    .content-layout {
      display: grid;
      grid-template-columns: 40% 60%;
    }

    .cate-title {
      font-family: STKaiti, sans-serif;
      font-size: 15px;
      font-weight: 700;
      line-height: 28px;
    }

    .project-name {
      font-size: 18px;
      text-align: center;
    }

    .cate-content {
      padding: 0 2px 0 4px;
      font-size: $small-size;
      line-height: 1.4em;
    }

    .operate-cate {
      display: grid;
      grid-template-rows: auto auto 1fr minmax(110px, auto);
      grid-template-columns: minmax(0, 1fr);
      overflow: hidden;

      .materiel .xh_table {
        border-top: none;
        border-right: none;
        border-left: none;
      }

      .materiel {
        :deep(.xh_thead .xh_cell) {
          height: 20px;
          line-height: 20px;
        }
      }
    }

    .param {
      display: grid;
      grid-template-columns: 40% 60%;

      .xh_table.left {
        border-bottom: none;
        border-left: none;
      }

      .xh_table.right {
        border-right: none;
        border-bottom: none;
        border-left: none;
      }
    }
  }
}
</style>
