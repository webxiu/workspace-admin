<script lang="tsx">
import { formatDate } from "@/utils/common";
import logo from "@/assets/images/logo.png";
import titleLogo from "@/assets/images/titleLogo.png";
import { PrintOperateBookStationResType } from "@/api/oaManage/productMkCenter";
import { reactive, defineComponent, PropType, computed } from "vue";

const props = {
  row: { type: Object as PropType<PrintOperateBookStationResType>, default: () => ({}) }
};

export default defineComponent({
  props: props,
  emits: [],
  setup(props, {}) {
    const row = props.row;
    // esopManualResumeList最高版本为当前选中版本
    const timeList = row.esopManualResumeList
      .map(({ createDate, ver }) => ({ createDate, ver }))
      .sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
    const firstTime = timeList[0]?.createDate || "";
    const lastTime = timeList[timeList.length - 1]?.createDate || "";

    const columns = reactive([
      { label: "第一列", prop: "decision", style: { width: "50px" } },
      { label: "第二列", prop: "make" },
      { label: "第三列", prop: "audit" },
      { label: "第四列", prop: "approve" }
    ]);
    const columns2 = reactive([
      { label: "第一列", prop: "col1" },
      { label: "第二列", prop: "col2" },
      { label: "第三列", prop: "col3", style: { width: "100px", textAlign: "left", paddingLeft: "30px" } }
    ]);
    const columns3 = reactive([
      { label: "第一列", prop: "col1", style: { width: "100px" } },
      { label: "第二列", prop: "col2" }
    ]);

    const dataList = computed(() => [
      { id: 1, decision: "裁决", make: "制作", audit: "审核", approve: "批准" },
      { id: 2, decision: "", make: row.createUserName, audit: row.auditing, approve: row.approveName },
      { id: 3, decision: "日期", make: fmtDate(row.createDate), audit: fmtDate(row.auditingDate), approve: fmtDate(row.approveDate) }
    ]);
    const dataList2 = computed(() => [
      { id: 1, col1: "保存车间", col2: "SMT车间", col3: "D01" },
      { id: 2, col1: "", col2: "PCBA车间", col3: "D02" },
      { id: 3, col1: "", col2: "加工组", col3: "D03" },
      { id: 4, col1: "", col2: "注塑车间", col3: "D04" },
      { id: 5, col1: "", col2: "喷印车间", col3: "D05" },
      { id: 6, col1: "", col2: "组装车间", col3: "D06 √" }
    ]);
    const dataList3 = computed(() => [
      { id: 1, col1: "制作部门", col2: "工程部" },
      { id: 2, col1: "文件编号", col2: row.fileNumber },
      { id: 3, col1: "文件版本", col2: row.ver },
      { id: 4, col1: "初订日期", col2: fmtDate2(firstTime) },
      { id: 5, col1: "修订日期", col2: fmtDate2(lastTime) }
    ]);

    function fmtDate(date: string) {
      return formatDate(date, "YYYY-MM-DD");
    }
    function fmtDate2(date: string) {
      return formatDate(date, "YYYY年MM月DD日");
    }
    return () => (
      <div>
        <div class="sop-title block-quote-tip mt-20 mb-20">
          <el-tag type="danger" effect="dark" round>
            (1/1) 封面
          </el-tag>
        </div>
        <div class="appendix-wrap">
          <div class="flex-center mt-40">
            <img class="logo" src={logo} width="80" height="80" alt="" />
            <img src={titleLogo} width="50%" alt="" />
          </div>
          <div class="appendix">
            <div class="item1 flex-center">
              <div class="title-wrap">
                <span class="mr-6">MTD9122A01</span>
                <span>白色组包作业指导书</span>
              </div>
            </div>
            <div class="item2">
              <table>
                <tbody>
                  {dataList.value.map((item, i) => (
                    <tr key={item.id} class={"row" + (i + 1)}>
                      {columns.slice(i === 1 ? 1 : 0).map((column, idx) => {
                        const rowspan = i === 0 && column.prop === "decision" ? 2 : 1;
                        return (
                          <td key={idx} rowspan={rowspan} style={column.style} class="ui-ta-c">
                            {item[column.prop] || <span style={{ opacity: 0 }}>2099-99-99</span>/* 占位 */}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="item3">
              <div>
                <table>
                  <tbody>
                    {dataList2.value.map((item, index) => (
                      <tr key={item.id}>
                        {columns2.slice(index > 0 ? 1 : 0).map((column, idx) => {
                          const len = dataList2.value.length;
                          const rowspan = index === 0 && column.prop === "col1" ? len : 1;
                          return (
                            <td key={idx} rowspan={rowspan} style={column.style} class={rowspan > 1 ? "merge" : ""}>
                              {item[column.prop]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="item4">
              <div>
                <table>
                  <tbody>
                    {dataList3.value.map((item, index) => (
                      <tr key={item.id}>
                        {columns3.map((column, idx) => {
                          return (
                            <td key={idx} class="ui-ta-c" style={column.style}>
                              {item[column.prop]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
</script>

<style lang="scss">
$line-color: #000;

.appendix-wrap {
  min-height: 700px;
  height: 100%;
  width: 100%;
  border: 1px solid $line-color;
  display: flex;
  flex-direction: column;
  font-family: STKaiti, sans-serif;
}
.appendix {
  flex: 1;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 240px 160px;
  grid-template-columns: 260px 1fr 350px;
  grid-template-areas:
    "item1 item1 item1"
    ". item2 item3"
    ". . item4";

  @for $i from 1 through 4 {
    .item#{$i} {
      grid-area: item#{$i};
    }
  }

  .title-wrap {
    font-size: 24px;
    line-height: 47px;
    border-radius: 12px;
    border: 2px solid #000;
    padding: 15px 100px;
  }

  .item2 {
    width: 100%;
    .row1 {
      td {
        height: 28px;
      }
      > td:nth-child(1) {
        writing-mode: vertical-lr;
        letter-spacing: 5px;
      }
    }
    .row2 {
      td {
        height: 60px;
      }
    }
    .row3 {
      td {
        height: 40px;
      }
    }
  }
  .item3 {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    div {
      width: 100%;
    }
    table {
      margin-right: 30px;
      margin-left: auto;
      width: 60%;
      border: 1px solid #000;
      td {
        line-height: 22px;
        white-space: nowrap;
      }
    }
    .merge {
      // 文字竖向排列
      writing-mode: vertical-lr;
    }
  }

  .item4 {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    div {
      width: 100%;
    }
    table {
      margin-left: auto;
      margin-right: 4px;
      width: calc(100% - 4px);
      td {
        line-height: 22px;
        white-space: nowrap;
      }
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    td,
    th {
      padding: 2px;
      border: 1px solid $line-color;
      text-align: center;
      font-size: 12px;
      color: #333;
      text-align: center;
    }
  }
}
</style>
