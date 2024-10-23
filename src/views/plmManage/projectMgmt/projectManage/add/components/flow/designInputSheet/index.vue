<template>
  <div class="table-outer1">
    <el-row style="margin-bottom: 8px">
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div class="top-label">项目工程师：</div>
          <el-input v-model="pmUser" style="width: 170px" size="small" />
        </div>
      </el-col>
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div class="top-label">立项时间：</div>
          <el-date-picker
            v-model="startDate"
            type="date"
            style="width: 170px"
            size="small"
            placeholder="请选择立项时间"
            valueFormat="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div class="top-label">完成时间：</div>
          <el-date-picker
            v-model="finishDate"
            type="date"
            style="width: 170px"
            size="small"
            placeholder="请选择完成时间"
            valueFormat="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div class="top-label">项目阶段：</div>
          <el-select filterable v-model="stage" style="width: 170px" placeholder="请选择项目阶段" size="small">
            <el-option label="DR1" value="DR1" />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div style="width: 84px; text-align: right" class="top-label">产品名称：</div>
          <el-input v-model="productName" style="width: 170px" size="small" /></div
      ></el-col>
      <el-col :span="6">
        <div style="display: flex; align-items: center">
          <div class="top-label">产品型号：</div>
          <el-input v-model="productModel" style="width: 170px" size="small" />
        </div>
      </el-col>
      <el-col :span="6"
        ><div style="display: flex; align-items: center">
          <div style="width: 70px; text-align: right" class="top-label">程序名：</div>
          <el-input v-model="appName" style="width: 170px" size="small" /></div
      ></el-col>
      <el-col :span="6"
        ><div style="display: flex; align-items: center">
          <div style="width: 70px; text-align: right" class="top-label">标识：</div>
          <el-input v-model="sign" style="width: 170px" size="small" /></div
      ></el-col>
    </el-row>
  </div>

  <el-table
    :data="tableData"
    :span-method="spanMethod"
    border
    style="width: 100%"
    class="sheet-table"
    :header-cell-style="{ background: '#fff !important', borderColor: 'black' }"
    :cell-style="{ borderColor: 'black' }"
    :style="{ borderColor: 'black' }"
  >
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column prop="techItem" label="技术项目" width="140" />
    <el-table-column prop="specs" label="规格描述及说明">
      <template #default="scope">
        <div v-if="scope.row.techItem === '工作电压'">
          <el-checkbox-group v-model="scope.row.specs">
            <el-checkbox label="100V" value="100V" />
            <el-checkbox label="110V" value="110V" />
            <el-checkbox label="100V-127V" value="100V-127V" />
            <el-checkbox label="100-240V" value="100-240V" />
          </el-checkbox-group>
        </div>
        <div v-if="scope.row.techItem === '频率'">
          <el-checkbox-group v-model="scope.row.specs">
            <el-checkbox label="50Hz" value="50Hz" />
            <el-checkbox label="60Hz" value="60Hz" />
            <el-checkbox label="50-60Hz" value="50-60Hz" />
          </el-checkbox-group>
        </div>
        <div v-if="scope.row.techItem === '功率'">
          <el-checkbox-group v-model="scope.row.specs">
            <el-checkbox label="1分钟功率" value="1分钟功率" />
            <el-checkbox label="30分钟积分功率" value="30分钟积分功率" />
            <el-checkbox label="最大功率限制" value="最大功率限制" />
            <el-checkbox label="30分钟时稳定积分功率" value="30分钟时稳定积分功率" />
          </el-checkbox-group>
        </div>
        <div v-if="scope.row.techItem === '发热体类型'">
          <el-checkbox-group v-model="scope.row.specs">
            <el-checkbox label="PTC" value="PTC" />
            <el-checkbox label="发热膜" value="发热膜" />
            <el-checkbox label="MCH" value="MCH" />
          </el-checkbox-group>
        </div>
        <div v-if="scope.row.techItem === '设计效果图'" class="row-upload">
          <el-upload
            action="#"
            list-type="picture-card"
            multiple
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            @change="changeFile"
            v-model:file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <el-image w-full :src="dialogImageUrl" preview-teleported alt="加载失败" />
          </el-dialog>
        </div>

        <div v-if="scope.row.techItem === '销售区域及客户'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '项目完成标准'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '其它（参考机型）'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '安规要求'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '产品外观要求'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '功能或操作方法描述'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '控制面板及显示界面介绍'">
          <el-input type="textarea" autosize />
        </div>

        <!-- 单input -->
        <div v-if="scope.row.techItem === '发热体规格'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '发热板规格'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '设计档位'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '升温速度'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '档位公差要求'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === 'IC'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '温度保险丝'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === 'PCBA'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '电源线'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '电流保险丝'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '产品重量'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '电气强度'">
          <el-input type="textarea" autosize />
        </div>
        <div v-if="scope.row.techItem === '绝缘电阻'">
          <el-input type="textarea" autosize />
        </div>
        <div v-else />
      </template>
    </el-table-column>
    <el-table-column prop="instrument" label="检测仪器">
      <template #default="scope">
        <div>
          <el-input v-model="scope.row.instrument" type="textarea" autosize />
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="remark" label="备注">
      <template #default="scope">
        <div>
          <el-input v-model="scope.row.remark" type="textarea" autosize />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { UploadProps, UploadUserFile } from "element-plus";
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

const pmUser = ref("");
const stage = ref("");
const startDate = ref("");
const finishDate = ref("");
const productName = ref("");
const productModel = ref("");
const appName = ref("");
const sign = ref("");
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const fileList = ref<UploadUserFile[]>([
  // {
  //   name: "food.jpeg",
  //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  // }
]);

const tableData = [
  {
    techItem: "工作电压",
    specs: ["100V"],
    instrument: " 电参数测试仪（横河YOKOGAWA;WT210）",
    remark: "相关备注..."
  },
  {
    techItem: "频率",
    specs: ["50Hz"],
    instrument: " ",
    remark: "."
  },
  {
    techItem: "功率",
    specs: ["30分钟积分功率"],
    instrument: "电参数测试仪（横河YOKOGAWA;WT210）",
    remark: ""
  },
  {
    techItem: "发热体类型",
    specs: ["MCH"],
    instrument: "万用表(FLUKE，17B) 卡尺（UPM，精度0.02mm）",
    remark: ""
  },
  {
    techItem: "发热体规格",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "发热板规格",
    specs: "",
    instrument: "卡尺",
    remark: ""
  },

  {
    techItem: "设计档位",
    specs: "",
    instrument: "安捷伦Agilent34970A",
    remark: ""
  },
  {
    techItem: "升温速度",
    specs: "",
    instrument: "安捷伦Agilent34970A或FULK 52Ⅱ温度表，秒表",
    remark: ""
  },
  {
    techItem: "档位公差要求",
    specs: "",
    instrument: "",
    remark: ""
  },

  {
    techItem: "IC",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "温度保险丝",
    specs: "",
    instrument: "千分尺，皮尺",
    remark: "可根据产品性能填主要部件参数"
  },
  {
    techItem: "PCBA",
    specs: "",
    instrument: "",
    remark: "可根据产品性能填主要部件参数"
  },
  {
    techItem: "电源线",
    specs: "",
    instrument: "",
    remark: "可根据产品性能填主要部件参数"
  },
  {
    techItem: "电流保险丝",
    specs: "",
    instrument: "",
    remark: "必须注明网尾"
  },
  {
    techItem: "产品重量",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "控制面板及显示界面介绍",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "功能或操作方法描述",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "产品外观要求",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "工作环境",
    specs: "",
    instrument: "TH101A温湿度计",
    remark: ""
  },
  {
    techItem: "安规要求",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "电气强度",
    specs: "",
    instrument: "耐压测试仪（艾诺Ainuo，AN9605W）",
    remark: ""
  },
  {
    techItem: "绝缘电阻",
    specs: "",
    instrument: "绝缘电阻测试仪(长创,CC2681)",
    remark: ""
  },
  {
    techItem: "设计效果图",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "销售区域及客户",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "项目完成标准",
    specs: "",
    instrument: "",
    remark: ""
  },
  {
    techItem: "其它（参考机型）",
    specs: "",
    instrument: "",
    remark: ""
  }
];

const changeFile = (file) => {
  console.log(file, "file");
  fileList.value.push(file.raw);
};

const spanMethod = ({ row, columnIndex }) => {
  if (
    ["设计效果图", "安规要求", "产品外观要求", "功能或操作方法描述", "控制面板及显示界面介绍", "销售区域及客户", "项目完成标准", "其它（参考机型）"].includes(
      row.techItem
    )
  ) {
    if (columnIndex === 2) {
      return [1, 4];
    } else if ([0, 1].includes(columnIndex)) {
      return [1, 1];
    }
    return [0, 0];
  }
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  window.open(uploadFile.url);
};
</script>
<style scoped lang="scss">
.top-label {
  font-weight: 700;
}
.table-outer1 {
  border: 1px solid #000;
  padding: 8px;
}
.sheet-table {
  border: 1px solid black;
  border-top: none;

  :deep(.el-upload--picture-card) {
    background-color: #fff;
  }
}

.label-tt {
  font-size: 14px;
  font-weight: 700;
}

.table-outer {
  table {
    width: 100%;
    line-height: 30px;
    text-align: left;
    border-right: 1px solid #000;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  table th {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }

  table td {
    border-top: 1px solid #000;
    padding: 8px;
  }
}
</style>
