<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td>
          <div class="line_center">
            <div>产品型号：</div>
            <div>
              <HxModalInput
                title="选择产品"
                placeholder="请选择产品型号"
                valueKey="productModel"
                v-model="formData.productModel"
                readonly
                showButton
                @select="onSelect"
                showModel="product"
              />
            </div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div>产品名称：</div>
            <div><el-input placeholder=" " v-model="formData.productName" /></div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div>规格：</div>
            <div><el-input style="width: 190px" v-model="formData.specs" autosize type="textarea" placeholder=" " /></div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div>试产日期：</div>
            <div>
              <el-date-picker
                style="width: 100%"
                v-model="formData.tryDate"
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
          <div class="line_center">
            <div>试产次数：</div>
            <div>
              <el-input-number style="width: 100%" :controls="false" placeholder=" " v-model="formData.tryCount" />
            </div>
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <div class="line_center">
            <div>试产数量：</div>
            <div>
              <el-input-number style="width: 252px" :controls="false" placeholder=" " v-model="formData.tryNum" />
            </div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div style="width: 70px; text-align: right">结构：</div>
            <div><el-input placeholder=" " v-model="formData.structure" /></div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div>硬件：</div>
            <div><el-input v-model="formData.hardware" placeholder=" " /></div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div style="width: 70px; text-align: right">软件：</div>
            <div><el-input style="width: 215px" v-model="formData.software" placeholder=" " /></div>
          </div>
        </td>
        <td>
          <div class="line_center">
            <div style="width: 70px; text-align: right">业务：</div>
            <div>
              <el-input style="width: 200px" placeholder=" " v-model="formData.business" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div class="line_center">
            <div style="width: 70px; text-align: right">试产模式：</div>
            <div>
              <el-checkbox-group v-model="formData.tryMode" @change="changeGroup1">
                <el-checkbox label="模式一" value="模式一" />
                <el-checkbox label="模式二" value="模式二" />
                <el-checkbox label="模式三" value="模式三" />
                <el-checkbox label="模式四" value="模式四" />
              </el-checkbox-group>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div class="line_center">
            <div style="width: 125px; text-align: right">试产目的：</div>
            <div>
              <el-input style="width: 585px" v-model="formData.tryTarget" autosize type="textarea" placeholder=" " />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div class="line_center">
            <div>试产产品处理方式：</div>
            <div>
              <el-input style="width: 585px" v-model="formData.tryPMResolveWay" autosize type="textarea" placeholder=" " />
            </div>
          </div>
        </td>
      </tr>
    </table>
    <table>
      <!-- dataList -->
      <tr>
        <td width="60" align="center" style="border-top: none">序号</td>
        <td style="border-top: none" class="head-col">确认事项</td>
        <td style="border-top: none" class="head-col">要求完成时间</td>
        <td style="border-top: none" class="head-col">责任人</td>
        <td style="border-top: none" class="head-col">实际完成时间</td>
        <td style="border-top: none" class="head-col">确认人</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center">{{ idx + 1 }}</td>
        <td>{{ item.confirmMatters }}</td>
        <td>
          <el-date-picker
            style="width: 100%"
            v-model="item.reqFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td><el-input placeholder=" " v-model="item.resUserName" /></td>
        <td>
          <el-date-picker
            style="width: 100%"
            v-model="item.realFinishDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td><el-input placeholder=" " v-model="item.confirmUserName" /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

const curUserInfo = useUserStoreHook().userInfo;

const formData: any = reactive({ applyUserName: curUserInfo.userName });

const dataList = ref([
  { confirmMatters: "模具", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "系统BOM表", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "产品规格书", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "PCBA检测规范书", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "PCBA签样（提供空板PIE做测试架）或样品承认书+测试架外发", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "工程样机（工程部2台、品质部1台）", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "工装夹具", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "作业指导书", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "认证", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "品质检验文件（产品检验指导书）", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "丝印资料", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "注塑", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "喷油、丝印", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "其余物料", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "通用物料及模具", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" },
  { confirmMatters: "已备物料", reqFinishDate: "", resUserName: "", realFinishDate: "", confirmUserName: "" }
]);

const changeGroup1 = () => {
  if (formData.tryMode.length > 1) {
    formData.tryMode.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData, dataList });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .line_center {
      display: flex;
      align-items: center;
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

  .first-line {
    td {
      border-top: none;
    }
  }
}
</style>
