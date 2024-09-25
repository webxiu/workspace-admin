<template>
  <div class="staffinfo-print">
    <el-button type="primary" :icon="Printer" class="print-btn" @click="onPrint" style="z-index: 99999999">打印</el-button>
    <div ref="printRef" class="printDiv">
      <template v-for="(item, index) in printDataList" :key="index">
        <!--人事档案-->
        <div v-if="photosRef.includes('1')" class="printPage staffInfo">
          <!--头部表格-->
          <table class="headTB">
            <tr>
              <td colspan="100" style="height: 100px; border: none">
                <div style="border-bottom: 1px solid black">
                  <img v-if="appConfig.orgName?.indexOf('德龙') > -1" src="@/assets/logo/print_color_logo.png" width="760px" />
                  <div v-else class="org-name">{{ appConfig.orgName }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="100" style="font-size: 30px; font-weight: bold; line-height: 38px; border: none">员工入职登记表</td>
            </tr>
          </table>

          <!--主体表格-->
          <table class="botyTB">
            <tr>
              <td colspan="13">应聘职位*</td>
              <td colspan="42" dataName="roleName" class="init">{{ item.roleName }}</td>
              <td colspan="18">填表日期*</td>
              <td colspan="27" dataName="createDate">
                <span v-if="item.createDate">{{ formatDate(item.createDate, "YYYY年MM月DD日") }}</span>
                <template v-else>
                  <span style="padding-left: 40px">年</span>
                  <span style="padding-left: 30px">月</span>
                  <span style="padding-left: 30px">日</span>
                </template>
              </td>
            </tr>

            <tr class="item">
              <td colspan="100">个人资料</td>
            </tr>

            <tr>
              <td colspan="13">姓名*</td>
              <td colspan="10" dataName="staffName" class="init">{{ item.staffName }}</td>
              <td colspan="8">性别*</td>
              <td colspan="8" dataName="sex" class="init">{{ item.sex }}</td>
              <td colspan="10">民族*</td>
              <td colspan="12" dataName="nation" class="init">{{ item.nation }}</td>
              <td colspan="10">出生年月*</td>
              <td colspan="13" dataName="birthDate" class="init">{{ item.birthDate }}</td>
              <td colspan="16" rowspan="6">
                <el-image
                  :src="getUrl(item.staffInfoPhotoVOS, 1)"
                  fit="cover"
                  :zoom-rate="1.2"
                  :preview-src-list="[getUrl(item.staffInfoPhotoVOS, 1)]"
                  :hide-on-click-modal="true"
                  :initial-index="1"
                  :style="{ width: '115px', height: '150px' }"
                >
                  <template #error>
                    <div class="el-image__error">无图</div>
                  </template>
                </el-image>
              </td>
            </tr>
            <tr>
              <td colspan="13">籍贯*</td>
              <td colspan="10" dataName="nativePlace" class="init">{{ item.nativePlace }}</td>
              <td colspan="8">身高*</td>
              <td colspan="8" dataName="height" class="init">{{ item.height }}</td>
              <td colspan="10">体重*(公斤)</td>
              <td colspan="12" dataName="weight" class="init">{{ item.weight }}</td>
              <td colspan="10">最高学历*</td>
              <td colspan="13" dataName="education" class="init">{{ item.education }}</td>
            </tr>
            <tr>
              <td colspan="13">英语水平</td>
              <td colspan="10" dataName="englishLevel" class="init">{{ item.englishLevel }}</td>
              <td colspan="13">计算机水平</td>
              <td colspan="13" dataName="computerLevel" class="init">{{ item.computerLevel }}</td>
              <td colspan="13">有无驾驶证*</td>
              <td colspan="22" dataName="drivingLicence">
                <span class="checkbox" dataName="drivingLicence_yes">{{ item.drivingLicence === "有" ? "☑" : "□" }}有</span>
                <span class="checkbox" style="padding-left: 40px" dataName="drivingLicence_no">{{ item.drivingLicence !== "有" ? "☑" : "□" }}无</span>
              </td>
            </tr>
            <tr>
              <td colspan="13">身份证号*</td>
              <td colspan="30" dataName="idCard" class="init">{{ item.idCard }}</td>
              <td colspan="13">婚姻状况*</td>
              <td colspan="28" dataName="computerLevel">
                <span class="checkbox" style="padding-left: 10px" dataName="marital_no">{{ item.marital === "未婚" ? "☑" : "□" }}未婚</span>
                <span class="checkbox" style="padding-left: 20px" dataName="marital_yes">{{ item.marital !== "未婚" ? "☑" : "□" }}已婚</span>
                <span style="padding-left: 20px">子女：</span>
                <span dataName="children" class="init">{{ item.children }}</span
                >人
              </td>
            </tr>
            <tr style="text-align: left">
              <td colspan="84" dataName="computerLevel">
                参加保险情况：
                <span class="checkbox" dataName="insurance_yes">{{ item.insurance === "户籍所在地城乡" ? "☑" : "□" }}户籍所在地城乡</span>
                <span class="checkbox" style="padding-left: 20px" dataName="insurance_no">
                  {{ item.insurance !== "户籍所在地城乡" ? "☑" : "□" }}深圳职工社保</span
                >
                &nbsp;&nbsp;(7位或9位数社保电脑号:)
                <span style="padding-left: 5px" dataName="socialSecurity" class="init">{{ item.socialSecurity }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="13">现居住地*</td>
              <td colspan="38" dataName="currentStayAddress" class="init">{{ item.currentStayAddress }}</td>
              <td colspan="13">本人联系电话*</td>
              <td colspan="20" dataName="phone" class="init">{{ item.phone }}</td>
            </tr>
            <tr>
              <td colspan="13">紧急联系人*</td>
              <td colspan="5">姓名</td>
              <td colspan="8" dataName="emergencyName" class="init">{{ item.emergencyName }}</td>
              <td colspan="5">关系</td>
              <td colspan="6" dataName="emergencyRelation" class="init">{{ item.emergencyRelation }}</td>
              <td colspan="9">现居住地</td>
              <td colspan="28" dataName="emergencyResidence" class="init">{{ item.emergencyResidence }}</td>
              <td colspan="10">联系人电话</td>
              <td colspan="16" dataName="emergencyPhone" class="init">{{ item.emergencyPhone }}</td>
            </tr>

            <tr class="item">
              <td colspan="100">教育经历(请填写最高学历)</td>
            </tr>

            <tr>
              <td colspan="26">起止时间</td>
              <td colspan="26">学校名称</td>
              <td colspan="16">学历</td>
              <td colspan="16">专业</td>
              <td colspan="16">备注</td>
            </tr>
            <tr class="educationExperience" v-for="(cell, idx) in item?.staffInfoEducationVOS || []" :key="idx">
              <td v-if="cell.startTime && cell.endTime" colspan="26" dataName="time" class="init">
                {{ formatDate(cell.startTime, "YYYY年MM月") }}至{{ formatDate(cell.endTime, "YYYY年MM月") }}
              </td>
              <td v-else colspan="26" dataName="time" class="init">
                <span style="padding-left: 20px">年</span>
                <span style="padding-left: 20px">月至</span>
                <span style="padding-left: 20px">年</span>
                <span style="padding-left: 20px">月</span>
              </td>
              <td colspan="26" dataName="schoolName" class="init">{{ cell.schoolName }}</td>
              <td colspan="16" dataName="education" class="init">{{ cell.education }}</td>
              <td colspan="16" dataName="major" class="init">{{ cell.major }}</td>
              <td colspan="16" dataName="remark" class="init">{{ cell.remark }}</td>
            </tr>
            <!-- 渲染空行 -->
            <template v-if="item?.staffInfoEducationVOS?.length < educationLine">
              <tr class="educationExperience" v-for="(cell, idx) in educationLine - item?.staffInfoEducationVOS?.length || 0" :key="idx">
                <td colspan="26" dataName="time" class="init">
                  <span style="padding-left: 20px">年</span>
                  <span style="padding-left: 20px">月至</span>
                  <span style="padding-left: 20px">年</span>
                  <span style="padding-left: 20px">月</span>
                </td>
                <td colspan="26" dataName="schoolName" class="init" />
                <td colspan="16" dataName="education" class="init" />
                <td colspan="16" dataName="major" class="init" />
                <td colspan="16" dataName="remark" class="init" />
              </tr>
            </template>

            <tr class="item">
              <td colspan="100">家庭关系*(父母、姊妹)</td>
            </tr>

            <tr>
              <td colspan="16">关系</td>
              <td colspan="16">姓名</td>
              <td colspan="26">工作单位</td>
              <td colspan="18">职业</td>
              <td colspan="24">联系电话</td>
            </tr>
            <tr class="familyTies" v-for="(cell, idx) in item?.staffInfoFamilyVOS || []" :key="idx">
              <td colspan="16" dataName="relation">{{ cell.relation }}</td>
              <td colspan="16" dataName="name">{{ cell.name }}</td>
              <td colspan="26" dataName="workUnit">{{ cell.workUnit }}</td>
              <td colspan="18" dataName="profession">{{ cell.profession }}</td>
              <td colspan="24" dataName="contactNumber">{{ cell.contactNumber }}</td>
            </tr>
            <!-- 渲染空行 -->
            <template v-if="item?.staffInfoFamilyVOS?.length < familyLine">
              <tr class="familyTies" v-for="(cell, idx) in familyLine - item?.staffInfoFamilyVOS?.length || 0" :key="idx">
                <td colspan="16" dataName="relation" />
                <td colspan="16" dataName="name" />
                <td colspan="26" dataName="workUnit" />
                <td colspan="18" dataName="profession" />
                <td colspan="24" dataName="contactNumber" />
              </tr>
            </template>

            <tr class="item">
              <td colspan="100">工作经历*(请从最近的工作经历开始填写)</td>
            </tr>

            <tr>
              <td colspan="22">起止时间</td>
              <td colspan="25">公司名称</td>
              <td colspan="12">职务名称</td>
              <td colspan="8">薪金</td>
              <td colspan="16">离职原因</td>
              <td colspan="17">证明人及电话</td>
            </tr>
            <tr class="workExperience" v-for="(cell, idx) in item?.staffInfoWorkVOS || []" :key="idx">
              <td v-if="cell.startTime && cell.endTime" colspan="22" dataName="time" class="init">
                {{ formatDate(cell.startTime, "YYYY年MM月") }}至{{ formatDate(cell.endTime, "YYYY年MM月") }}
              </td>
              <td v-else colspan="22" dataName="time" class="init">
                <span style="padding-left: 20px">年</span>
                <span style="padding-left: 20px">月至</span>
                <span style="padding-left: 20px">年</span>
                <span style="padding-left: 20px">月</span>
              </td>
              <td colspan="25" dataName="companyName">{{ cell.companyName }}</td>
              <td colspan="12" dataName="jobName">{{ cell.jobName }}</td>
              <td colspan="8" dataName="money">{{ cell.money }}</td>
              <td colspan="16" dataName="leaveReason">{{ cell.leaveReason }}</td>
              <td colspan="17" dataName="certifierPhone">{{ cell.certifierPhone }}</td>
            </tr>
            <!-- 渲染空行 -->
            <template v-if="item?.staffInfoWorkVOS?.length < workLine">
              <tr class="workExperience" v-for="(cell, idx) in workLine - item?.staffInfoWorkVOS?.length || 0" :key="idx">
                <td colspan="22" dataName="time">
                  <span style="padding-left: 10px">年</span>
                  <span style="padding-left: 10px">月至</span>
                  <span style="padding-left: 10px">年</span>
                  <span style="padding-left: 10px">月</span>
                </td>
                <td colspan="25" dataName="companyName" />
                <td colspan="12" dataName="jobName" />
                <td colspan="8" dataName="money" />
                <td colspan="16" dataName="leaveReason" />
                <td colspan="17" dataName="certifierPhone" />
              </tr>
            </template>

            <tr class="item">
              <td colspan="100">授权书*(声明)</td>
            </tr>

            <tr>
              <td class="authorization" colspan="100">1、本人授权贵公司可向本人曾任职的雇主/咨询人查询所有工作历史。</td>
            </tr>
            <tr>
              <td class="authorization" colspan="100">2、本人声明以上提供资料绝对真实，否则，可作为立即被解除劳动合同关系的理由，而贵公司无须作任何赔偿。</td>
            </tr>
            <tr>
              <td class="authorization" colspan="100">
                3、本人向贵公司提交的所有证件，贵公司有权核查。若有假证被没收，与贵公司无关，所发生的费用，由本人承担。
              </td>
            </tr>
            <tr>
              <td class="authorization" colspan="100">4、如被录用，本人愿遵守贵公司的一切规章制度及服从上级领导，如有违反愿意接受处分。</td>
            </tr>
            <tr>
              <td class="authorization" colspan="100">5、本人自愿接受公司所定工资（工资含个人所得税、养老保险费等等）。</td>
            </tr>
            <tr style="text-align: right">
              <td colspan="100" style="font-weight: bold; border: none">
                <span>签名*：</span>
                <span style="padding-left: 50px">日期*：</span>
                <span style="padding-left: 40px">年</span>
                <span style="padding-left: 30px">月</span>
                <span style="padding-right: 10px; padding-left: 30px">日</span>
              </td>
            </tr>

            <tr class="item">
              <td colspan="100">员工录用(此项由公司填写)</td>
            </tr>

            <tr>
              <td colspan="11">录用情况</td>
              <td colspan="6">部门</td>
              <td colspan="13" dataName="deptName" class="init">{{ item.deptName }}</td>
              <td colspan="6">组别</td>
              <td colspan="10" dataName="groupName" class="init">{{ item.groupName }}</td>
              <td colspan="6">岗位</td>
              <td colspan="18" dataName="roleName" class="init">{{ item.roleName }}</td>
              <td colspan="6">工号</td>
              <td colspan="8" dataName="staffId" class="init">{{ item.staffId }}</td>
              <td colspan="8">试用期</td>
              <td colspan="8">
                <span style="padding-left: 10px" dataName="tryDate" class="init">{{ item.tryDate }}个月</span>
              </td>
            </tr>
            <tr>
              <td colspan="14">薪资确认</td>
              <td colspan="16">工资开始核算日</td>
              <td colspan="25" dataName="moneyStartDate">
                <span style="padding-left: 20px">年</span>
                <span style="padding-left: 20px">月</span>
                <span style="padding-left: 20px">日</span>
              </td>
              <td colspan="20">试用期工资</td>
              <td colspan="25" dataName="tryDateMoney" class="init">{{ item.tryDateMoney || "" }}</td>
            </tr>
            <tr>
              <td colspan="14">用人部门(签名)</td>
              <td colspan="31" />
              <td colspan="25">行政/人力资源部(签名)</td>
              <td colspan="30" />
            </tr>
            <tr>
              <td colspan="40">总经理/副总经理（签名）</td>
              <td colspan="60" />
            </tr>
          </table>

          <!--底部表格-->
          <table class="bottomTB">
            <tr>
              <td colspan="100" style="text-align: left; border: none">
                <span style="padding-left: 5px">说明：“*”项为必填。</span>
              </td>
            </tr>
            <tr>
              <td colspan="100" style="font-weight: bold; text-align: right; border: none">
                <span>QR-HR-002</span>
                <span style="padding-right: 5px; padding-left: 20px">(01)</span>
              </td>
            </tr>
          </table>
        </div>
        <!-- 身份证 -->
        <div v-if="photosRef.includes('2')" class="printPage" :class="{ hidden: !(getUrl(item.staffInfoPhotoVOS, 2) || getUrl(item.staffInfoPhotoVOS, 3)) }">
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 2)" :photoList="item.staffInfoPhotoVOS" class="photo" />
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 3)" :photoList="item.staffInfoPhotoVOS" class="photo" />
        </div>
        <!-- 银行卡 -->
        <div v-if="photosRef.includes('3')" class="printPage" :class="{ hidden: !(getUrl(item.staffInfoPhotoVOS, 4) || getUrl(item.staffInfoPhotoVOS, 6)) }">
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 5)" :photoList="item.staffInfoPhotoVOS" class="photo" />
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 6)" :photoList="item.staffInfoPhotoVOS" class="photo" />
        </div>
        <!-- 健康证 -->
        <div v-if="photosRef.includes('4')" class="printPage" :class="{ hidden: !(getUrl(item.staffInfoPhotoVOS, 7) || getUrl(item.staffInfoPhotoVOS, 8)) }">
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 7)" :photoList="item.staffInfoPhotoVOS" class="photo" />
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 8)" :photoList="item.staffInfoPhotoVOS" class="photo" />
        </div>
        <!-- 离职证明 -->
        <div v-if="photosRef.includes('5')" class="printPage" :class="{ hidden: !getUrl(item.staffInfoPhotoVOS, 9) }">
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 9)" :photoList="item.staffInfoPhotoVOS" class="photo" />
        </div>
        <!-- 毕业证书 -->
        <div v-if="photosRef.includes('6')" class="printPage" :class="{ hidden: !getUrl(item.staffInfoPhotoVOS, 10) }">
          <ImagePicture :src="getUrl(item.staffInfoPhotoVOS, 10)" :photoList="item.staffInfoPhotoVOS" class="photo" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import Print from "@/utils/print";
import { Printer } from "@element-plus/icons-vue";
import ImagePicture from "./component/ImagePicture.vue";
import { staffInfoPrintDetail, StaffInfoItemType, StaffInfoPhotoVOSItemType } from "@/api/oaManage/humanResources";
import { useAppStoreHook } from "@/store/modules/app";
import { formatDate } from "@/utils/common";

const route = useRoute();
const printRef = ref();
const loading = ref<boolean>(false);
const photosRef = ref<string[]>([]);
const printDataList = ref<StaffInfoItemType[]>([]);
const photoSort: number[] = [1, 4, 2, 3, 5, 6, 7, 8, 9, 10];
const { VITE_BASE_API } = import.meta.env;
const appConfig = useAppStoreHook().getAppConfig;

const educationLine = 2; // 教育经历2行
const familyLine = 2; // 家庭关系显示2行
const workLine = 3; // 工作经历显示3行

watch(route, (value) => getPrintData(value.query), { immediate: true });

function getPrintData(query) {
  const { photos, ids } = query;
  if (!photos || !ids) return;
  photosRef.value = (photos as string).split(",").filter(Boolean);
  const paramsArr = (ids as string).split(",").filter(Boolean);
  const paramStr = paramsArr.map((id) => "ids=" + id).join("&");

  loading.value = true;
  staffInfoPrintDetail(paramStr)
    .then((res) => {
      loading.value = false;
      const newData = res.data.map((item) => {
        if (item.staffInfoPhotoVOS?.length) {
          const sortPhotoVOS: StaffInfoPhotoVOSItemType[] = [];
          // 根据photoSort顺序处理图片photoType显示顺序
          photoSort.forEach((pos) => {
            item.staffInfoPhotoVOS.forEach((cell) => {
              if (pos === cell.photoType) sortPhotoVOS.push(cell);
            });
          });
          item.staffInfoPhotoVOS = sortPhotoVOS;
          item.staffInfoPhotoVOS.forEach((cell) => {
            // VITE_VIRTUAL_PATH
            cell.resourceUrl = VITE_BASE_API + cell.resourceUrl + cell.resourceName;
          });
        }
        // 为了避免填写行数过多, 超出打印纸张高度
        item.staffInfoEducationVOS = item.staffInfoEducationVOS.slice(0, educationLine); // 教育经历2行
        item.staffInfoFamilyVOS = item.staffInfoFamilyVOS.slice(0, familyLine); // 家庭关系显示2行
        item.staffInfoWorkVOS = item.staffInfoWorkVOS.slice(0, workLine); // 工作经历显示3行
        return item;
      });
      printDataList.value = newData;

      const timer = setTimeout(() => {
        nextTick(() => {
          onPrint();
        });
        clearTimeout(timer);
      }, 800);
    })
    .catch(() => (loading.value = false));
}

function onPrint() {
  nextTick(() => {
    Print(printRef.value);
  });
}

function getUrl(PhotoVOS: StaffInfoPhotoVOSItemType[], photoType: number) {
  return PhotoVOS.find((item) => item.photoType === photoType)?.resourceUrl;
}
</script>

<style lang="scss" scoped>
.staffinfo-print {
  min-height: 100vh;

  .print-btn {
    position: absolute;
    top: 20px;
    left: 20px;
  }
}

.printDiv {
  width: 760px;
  margin: 0 auto;
  page-break-after: always;
}

table {
  width: 760px;
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
  height: 868px;
  border: 2px solid black;
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

.org-name {
  height: 62px;
  overflow: hidden;
  font-size: 44px;
  text-align: justify;

  &::after {
    display: inline-block;
    width: 100%;
    content: "";
  }
}
</style>
