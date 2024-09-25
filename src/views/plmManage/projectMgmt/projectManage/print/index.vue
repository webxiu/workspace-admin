<template>
  <div class="print-plm" ref="printPLMRef">
    <div class="top-info">
      <div class="logo">
        <el-image style="width: 400px; height: 40px" :src="bomLogo" />
      </div>
      <div class="center-txt">
        <span style="border-bottom: 2px solid; padding: 5px; text-align: center; font-size: 24px">{{ detailInfo.projectInfoListVO?.projectName ?? "" }}</span>
      </div>
    </div>
    <div class="body-info">
      <table style="width: 100%">
        <thead>
          <tr style="border: none">
            <td style="border: none" rowspan="1" colspan="2">
              <div>
                <div style="font-weight: 600">项目编号：{{ detailInfo.projectInfoListVO?.billNo ?? "" }}</div>
              </div>
            </td>
            <td style="border: none" rowspan="1" colspan="2">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="margin-left: 3px; font-weight: 600">负责人：{{ detailInfo.projectInfoListVO?.projectUserName ?? "" }}</div>
              </div>
            </td>
            <td style="border: none" rowspan="1" colspan="2">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="margin-left: 3px; font-weight: 600">产品分类：{{ detailInfo.projectInfoListVO?.categoryName ?? "" }}</div>
              </div>
            </td>
            <td style="border: none; font-weight: 600">工期：{{ detailInfo.projectInfoListVO?.duration ?? "" }}</td>
            <td style="border: none; font-weight: 600" rowspan="1" colspan="2">立项日期：{{ detailInfo.projectInfoListVO?.startDate ?? "" }}</td>
            <td style="border: none; font-weight: 600" rowspan="1" colspan="3">更新时间：{{ detailInfo.projectInfoListVO?.modifyDate ?? "" }}</td>
          </tr>
          <tr>
            <th align="center" class="head-col" rowspan="2" colspan="1" width="50">序号</th>
            <th align="center" class="head-col" rowspan="2" colspan="1" width="260">项目</th>
            <th align="center" class="head-col" rowspan="2" colspan="1" width="95">时间（天）</th>
            <th align="center" class="head-col" rowspan="1" colspan="2">计划时间</th>
            <th align="center" class="head-col" rowspan="1" colspan="2">实际时间</th>
            <th class="head-col" rowspan="2" colspan="1" align="center" width="120">前置任务</th>
            <th class="head-col" rowspan="2" colspan="1" align="center" width="120">责任人</th>
            <th class="head-col" rowspan="2" colspan="1" align="center" width="80">状态</th>
            <th class="head-col" rowspan="2" colspan="1" align="center" width="260">备注</th>
          </tr>
          <tr>
            <th align="center" class="head-col" width="130">开始时间</th>
            <th align="center" class="head-col" width="130">完成时间</th>
            <th align="center" class="head-col" width="130">开始时间</th>
            <th align="center" class="head-col" width="130">完成时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in taskList" :key="idx">
            <td align="center">{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td align="center">{{ item.duration }}</td>
            <td align="center">{{ item.start }}</td>
            <td align="center">{{ item.end }}</td>
            <td align="center">{{ item.realStart }}</td>
            <td align="center">{{ item.realEnd }}</td>
            <td>{{ String(item.projectTaskRequireVOList?.map((item) => item.requireProjectTaskName)) }}</td>
            <td>{{ item.projectTaskResponsiblePersonnelVOList[0]?.masterUserName }}</td>
            <td>{{ calcStatusName(item.status) }}</td>
            <td>{{ item.description }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #000">
            <td rowspan="1" colspan="11">
              <div class="sign" style="font-weight: 900">评审人员会签：</div>
              <div class="sign-txt" style="height: 80px" />
            </td>
          </tr>
          <tr style="border: none">
            <td style="border: none; font-weight: 900" rowspan="1" colspan="2">制表：</td>
            <td style="border: none" />
            <td style="border: none" />
            <td style="border: none; font-weight: 900">审核：</td>
            <td style="border: none" />
            <td style="border: none" />
            <td style="border: none; font-weight: 900" align="center">批准：</td>
            <td style="border: none" />
            <td style="border: none" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchAllProjectMsgByProjectId, getBOMTableRowSelectOptions } from "@/api/plmManage";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import bomLogo from "@/assets/images/greylogo.png";
import Print from "@/utils/print";

defineOptions({ name: "PlmManageProjectMgmtProjectManagePrintIndex" });

const detailInfo: any = ref({});
const route = useRoute();
const taskList = ref<any[]>([]);
const printPLMRef = ref<HTMLDivElement>();
const optionStatus = ref([]);

const printAction = () => {
  if (printPLMRef.value) {
    printPLMRef.value.style.margin = 0 + "px";
    setTimeout(() => {
      Print(printPLMRef.value);
    });
  }
};

const calcStatusName = (status) => {
  const result = optionStatus.value.find((item) => item.optionValue === status)?.optionName ?? "";
  return result;
};

const getDetailInfo = () => {
  if (route.query.id) {
    fetchAllProjectMsgByProjectId({ id: route.query.id }).then((res: any) => {
      if (res.data) {
        printAction();

        detailInfo.value = res.data;

        // 末尾的sort解决甘特图显示的顺序异常
        taskList.value = res.data?.projectTaskGroupVoList?.map((item) => item.taskVOList.sort((a, b) => a.sort - b.sort))?.flat(Infinity);

        console.log(taskList.value, "taskList.value..");
      }
    });
  }
};

const getOptions = () => {
  getBOMTableRowSelectOptions({ optioncode: "ProjectTaskStatus" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "ProjectTaskStatus")?.optionList || [];
      optionStatus.value = result;
    }
  });
};

onMounted(() => {
  getOptions();
  getDetailInfo();
});
</script>

<style scoped lang="scss">
.blue {
  color: rgb(30, 144, 255);
}

.green {
  color: green;
}

.red {
  color: red;
}

@media print {
  @page {
    size: a4 landscape; /* A4纸，横向打印 */
    margin: 10mm 3mm; /* 去掉页边距 */
  }
  .body-info tbody tr {
    page-break-inside: avoid;
  }
}
.print-plm {
  font-family: "Microsoft YaHei", Simsun, Arial, sans-serif;
  width: 1500px;
  font-size: 13px;
  .top-info {
    margin-bottom: 16px;
    .center-txt {
      text-align: center;
      font-weight: bold;
      font-size: 20px;
    }

    .logo {
      position: absolute;
    }
  }

  .body-info {
    table {
      width: 100%;
      line-height: 32px;
      text-align: left;
    }

    table th {
      border-top: 1px solid #000;
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      padding: 0 5px;
    }
    .head-col {
      font-weight: 900;
    }

    table td {
      border-top: 1px solid #000;
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      padding: 0 5px;
    }
  }
}
</style>
