<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="8">
          <div style="display: flex; align-items: center">
            <div>项目阶段：</div>
            <div>
              <el-select v-model="formData.pmStage" placeholder="请选择" class="ui-w-100">
                <el-option v-for="item in pmStageOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
              </el-select>
            </div>
            <div style="margin-left: 16px">生产单号：</div>
            <div>
              <el-input placeholder=" " v-model="formData.productNumber" />
            </div>
            <div style="margin-left: 16px">型号：</div>
            <div>
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
            <div style="margin-left: 16px">生产数量：</div>
            <div>
              <el-input-number :controls="false" placeholder=" " v-model="formData.productAmount" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="head-col" colspan="2" width="60px">验证项目</td>
        <td class="head-col" width="50px">序号</td>
        <td class="head-col">验证的内容</td>
        <td class="head-col" width="210px">验证结果判定</td>
        <td class="head-col">备注</td>
        <td class="head-col">建议&要求</td>
        <td class="head-col">不良项附图</td>
      </tr>
      <!-- 后焊 -->
      <tr v-for="(item, idx) in postWeldingList" :key="idx">
        <td colspan="2" rowspan="8" v-if="idx === 0" align="center">{{ item.item1 }}</td>
        <td width="50px" align="center">{{ idx + 1 }}</td>
        <td>{{ item.authContent }}</td>
        <td>
          <el-checkbox-group v-model="item.authResult" @change="(val) => changeGroup(val, idx)">
            <el-checkbox label="是" value="是" />
            <el-checkbox label="否" value="否" />
            <el-checkbox label="其它" value="其它" />
          </el-checkbox-group>
        </td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.adviceReq" autosize type="textarea" placeholder=" " /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.badImgs.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
      </tr>
      <!-- 装配 -->
      <tr v-for="(item, idx) in assembleList" :key="idx">
        <td rowspan="28" v-if="idx === 0" align="center">{{ item.item1 }}</td>
        <td rowspan="5" v-if="idx === 0" align="center">{{ item.item2 }}</td>
        <td rowspan="6" v-if="idx === 5" align="center">{{ item.item2 }}</td>
        <td rowspan="5" v-if="idx === 11" align="center">{{ item.item2 }}</td>
        <td rowspan="5" v-if="idx === 16" align="center">{{ item.item2 }}</td>
        <td rowspan="7" v-if="idx === 21" align="center">{{ item.item2 }}</td>
        <td width="50px" align="center">{{ idx + 9 }}</td>
        <td>{{ item.authContent }}</td>
        <td>
          <el-checkbox-group v-model="item.authResult" @change="(val) => changeGroup(val, idx)">
            <el-checkbox label="是" value="是" />
            <el-checkbox label="否" value="否" />
            <el-checkbox label="其它" value="其它" />
          </el-checkbox-group>
        </td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.adviceReq" autosize type="textarea" placeholder=" " /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.badImgs.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
      </tr>
      <!-- 测试 -->
      <tr v-for="(item, idx) in testList" :key="idx">
        <td colspan="2" rowspan="12" v-if="idx === 0" align="center">{{ item.item1 }}</td>
        <td width="50px" align="center">{{ idx + 37 }}</td>
        <td>{{ item.authContent }}</td>
        <td>
          <el-checkbox-group v-model="item.authResult" @change="(val) => changeGroup(val, idx)">
            <el-checkbox label="是" value="是" />
            <el-checkbox label="否" value="否" />
            <el-checkbox label="其它" value="其它" />
          </el-checkbox-group>
        </td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.adviceReq" autosize type="textarea" placeholder=" " /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.badImgs.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
      </tr>
      <!-- 包装 -->
      <tr v-for="(item, idx) in fabricateList" :key="idx">
        <td colspan="2" rowspan="7" v-if="idx === 0" align="center">{{ item.item1 }}</td>
        <td width="50px" align="center">{{ idx + 49 }}</td>
        <td>{{ item.authContent }}</td>
        <td>
          <el-checkbox-group v-model="item.authResult" @change="(val) => changeGroup(val, idx)">
            <el-checkbox label="是" value="是" />
            <el-checkbox label="否" value="否" />
            <el-checkbox label="其它" value="其它" />
          </el-checkbox-group>
        </td>
        <td><el-input v-model="item.remark" autosize type="textarea" placeholder=" " /></td>
        <td><el-input v-model="item.adviceReq" autosize type="textarea" placeholder=" " /></td>
        <td align="center">
          <el-button @click="() => openFileModel('edit', item)" v-if="item.badImgs.length" type="warning" size="small" :icon="Edit" />
          <el-button @click="() => openFileModel('add', item)" v-else type="primary" size="small" :icon="Upload" />
        </td>
      </tr>
      <tr>
        <td colspan="3" class="head-col">填表说明：</td>
        <td colspan="5">
          <div>
            1、有验证内容项的，在验证结果栏内勾选”√“；2、无验证内容的，不需勾选；3、验证结果不是”是非“关系的选其它，同时在”备注“栏做出说明；
            4、不良点位，原则上需找对应的工程师做现场即时核查，同时拍图片供参考；5、对于工程师无法到现场了解现象的机器，可保留样机或是拍照、录小视频供随后
            的分析，排查；6、对于验证中的问题，若有解决建议或是样机制作过程中有明确要求必须要更改的项（无法作业，功能缺失等），可在”建议&要求“栏填写；
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { h, onMounted, reactive, ref } from "vue";
import { fetchProductStoreList } from "@/api/plmManage";
import { getEnumDictList } from "@/utils/table";
import { Upload, Edit, Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

const formData: any = reactive({});
const pmStageOpts = ref([]);

const postWeldingList = ref([
  {
    item1: "后焊",
    item2: "后焊",
    authContent: "焊接温度是否合适（烙铁温度≦350℃），焊锡要求（有铅，无铅）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "后焊",
    item2: "后焊",
    authContent: "焊接件是否符合样机要求，焊接前有无其它工序（装热缩管、剥线）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  { item1: "后焊", item2: "后焊", authContent: "焊接件在PCB上的丝印标识是否清晰、明确", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "后焊", item2: "后焊", authContent: "焊接器件在PCB上有无增加防呆的需求", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "后焊", item2: "后焊", authContent: "PCB板上焊孔是否正常（孔径大小，有无缺失）", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  {
    item1: "后焊",
    item2: "后焊",
    authContent: "被焊接件在焊接工艺上有无特定要求（跳线、卧焊、反面焊）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "后焊",
    item2: "后焊",
    authContent: "焊点是否圆润、焊接是否牢固，有无因焊接带来损伤器件的现象",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  { item1: "后焊", item2: "后焊", authContent: "能否快速、流畅完成焊接与剪引脚的作业，无其它异常干扰", authResult: [], remark: "", adviceReq: "", badImgs: [] }
]);

const assembleList = ref([
  {
    item1: "装配",
    item2: "线材",
    authContent: "线材是否方便点胶作业，等待胶干、胶干后于装配无影响的要求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "线材",
    authContent: "胶水的使用，客户有无特别要求（环保或是认证要求）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "线材",
    authContent: "线材长度是否合适、对走线空间、理线有无特定要求（位置、方向）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "线材",
    authContent: "线材有无压线隐患",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "线材",
    authContent: "电源线长度、规格与样机要求是否相同",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "铝板外观（颜色、表面工艺、表面缺陷）是否符合样机要求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "铝板与PTC、NTC是否压合紧密、接线长度是否适合装配",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "上下大身铝板与壳料装配时有无干涉、有无压线",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "上下大身铝板与其它带电器件有无碰撞",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "铝板装配合后，上下大身有无功能性缺陷（张嘴、露槽，偏位）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "铝板",
    authContent: "铝板装配合后，外观有无异常，参考《成品/物料外观检验通用标准》",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "PCBA",
    authContent: "PCBA外观有无异常（变形、生锈、露铜、跳线等）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "PCBA",
    authContent: "PCBA的版本与样机要求是否一致",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "PCBA",
    authContent: "PCBA各器件与对应的孔位定位是否准确",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "PCBA",
    authContent: "PCBA装配作业是否高效、流畅，与结构没有干涉",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "PCBA",
    authContent: "PCBA装配后是否牢固，有无松脱、晃动",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "螺丝",
    authContent: "螺丝的规格、用量、颜色与样机要求是否一致",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "螺丝",
    authContent: "螺丝有无磁性，是否利于电批吸咐",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "螺丝",
    authContent: "锁螺丝电批力矩有无异常，参考《德龙电器电批扭力管控流程》",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "螺丝",
    authContent: "锁螺丝作业是否流畅，没有其它异常干扰（如电批下不去）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "螺丝",
    authContent: "锁好螺丝后，螺丝本身、被锁的器件是否都无损伤",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "壳料与客户要求是否相符（如形状、颜色、丝印等）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "壳料外观有无异常，可参考《成品/物料外观检验通用标准》",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "在装配上，壳料有无防呆设计的需求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "在装配上，壳料有无工装治具的需求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "装配完成后，晃动机器，机器内有无异常响声",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "装配完成后，用手按压各结构部件、有无异常响声（结构件有虚位）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "装配",
    item2: "壳料",
    authContent: "壳料有无少件，可参考与样机对应的爆炸图",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  }
]);

const testList = ref([
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器的工作电压/频率是否与样机要求一致",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器的软件版本与样机要求是否一致",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  { item1: "测试", item2: "测试", authContent: "机器各档位的实测温度与样机对应档位设定的温度是否相符", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "测试", item2: "测试", authContent: "机器的各按键按动是否灵活", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "测试", item2: "测试", authContent: "机器的各按键响应是否准确、灵敏", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器各按键功能相互之间有无干扰、连动",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器各按键的丝印内容与样机功能定义是否符合",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器的各功能定义（如：开机时长、待机等）是否符合样机要求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器的各指示灯颜色与样机要求是否一致",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器上各指示灯的发光颜色是否符合样机要求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器上各指示灯的亮度（普亮、高亮）是否符合样机要求",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "测试",
    item2: "测试",
    authContent: "机器上显示屏与显示框的对位两者有无偏差",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  }
]);

const fabricateList = ref([
  {
    item1: "包装",
    item2: "包装",
    authContent: "机器上所贴标签与样机要求是否一致（内容、颜色、位置等）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "包装",
    item2: "包装",
    authContent: "包装的配件与样机要求是否一致（种类、数量等）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  { item1: "包装", item2: "包装", authContent: "包装的彩盒与样机要求是否一致（颜色、丝印、大小等）", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "包装", item2: "包装", authContent: "彩盒所贴标签是否符合样机要求（内容、颜色、位置等）", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  { item1: "包装", item2: "包装", authContent: "包装的卡通箱与样机要求是否一致（颜色、丝印、大小等）", authResult: [], remark: "", adviceReq: "", badImgs: [] },
  {
    item1: "包装",
    item2: "包装",
    authContent: "卡通箱上所贴标签与样机要求是否一致（内容、颜色、位置等）",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  },
  {
    item1: "包装",
    item2: "包装",
    authContent: "包装检验是否符合样机要求，参考《成品/物料外观检验通用标准》",
    authResult: [],
    remark: "",
    adviceReq: "",
    badImgs: []
  }
]);

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // 创建一个新的 FileReader 对象
    const reader = new FileReader();
    // 读取 File 对象
    reader.readAsDataURL(file);
    // 加载完成后
    reader.onload = function () {
      // 将读取的数据转换为 base64 编码的字符串
      const base64String = (reader.result as string).split(",")[1];
      // 解析为 Promise 对象，并返回 base64 编码的字符串
      resolve(base64String);
    };

    // 加载失败时
    reader.onerror = function () {
      reject(new Error("Failed to load file"));
    };
  });
};

const changeFiles = async (file) => {
  console.log(file.raw.type, "file..");
  const baseStrPrefix = "data:" + file.raw.type + ";base64,";
  const resBaseStr = await fileToBase64(file.raw);
  const combineBaseStr = baseStrPrefix + resBaseStr;
  console.log(combineBaseStr, " combineBaseStr...");
};

const openFileModel = (type, row) => {
  const title = { add: "上传", edit: "编辑" };
  addDialog({
    title: `${title[type]}图片`,
    class: "sample-make-self-file-modal",
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(
        <div>
          <el-upload
            action="#"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
            list-type="picture-card"
            multiple
            onChange={changeFiles}
            auto-upload={false}
            v-model:file-list={row.badImgs}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </div>,
        {}
      ),
    beforeSure: (done) => {
      if (!row.badImgs.length) {
        message.warning("还没有上传文件");
      } else {
        done();
      }
      console.log(postWeldingList, "postWeldingList===");
    }
  });
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

const changeGroup = (val, idx) => {
  if (postWeldingList.value[idx].authResult.length > 1) {
    postWeldingList.value[idx].authResult.splice(0, 1);
  }
};

onMounted(() => {
  getEnumDictList(["ProjectStage"]).then((res) => {
    if (res) {
      pmStageOpts.value = res["ProjectStage"];
    }
  });
});

defineExpose({ postWeldingList, assembleList, testList, formData });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

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
