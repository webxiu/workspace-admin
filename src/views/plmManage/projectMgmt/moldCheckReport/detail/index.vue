<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="11">
          <div style="display: flex; align-items: center">
            <div style="width: 102px; text-align: right">模具公司名称：</div>
            <div><el-input size="small" v-model="formData.moldCompanyName" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="8">
          <div style="display: flex; align-items: center">
            <div>项目工程师：</div>
            <div>
              <el-select size="small" v-model="formData.projectUser" placeholder="请选择" class="ui-w-100">
                <el-option v-for="item in pmUserList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>验收时间：</div>
            <div>
              <el-date-picker
                style="width: 160px"
                size="small"
                v-model="formData.checkDate"
                :clearable="false"
                type="date"
                disabled
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div style="display: flex; align-items: center">
            <div style="width: 102px; text-align: right">项目名称：</div>
            <div><el-input size="small" v-model="formData.projectName" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="14">
          <div style="display: flex; align-items: center">
            <div style="width: 84px; text-align: right">图纸编号：</div>
            <div><el-input size="small" v-model="formData.imgNo" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>图纸版本：</div>
            <div><el-input disabled size="small" v-model="formData.imgVersion" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="5">
          <div style="display: flex; align-items: center">
            <div style="width: 102px; text-align: right">产品名称：</div>
            <div><el-input size="small" v-model="formData.productName" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="8">
          <div style="display: flex; align-items: center">
            <div style="width: 84px; text-align: right">产品编号：</div>
            <div><el-input size="small" v-model="formData.productNo" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>模具穴数：</div>
            <div><el-input-number style="width: 160px" :controls="false" size="small" v-model="formData.moldCaveNum" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>模具数量：</div>
            <div><el-input-number style="width: 160px" :controls="false" size="small" v-model="formData.moldNum" placeholder=" " /></div>
          </div>
        </td>
      </tr>

      <tr>
        <td colspan="5">
          <div style="display: flex; align-items: center">
            <div>塑料名称/牌号：</div>
            <div><el-input size="small" v-model="formData.plasticName" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="8">
          <div style="display: flex; align-items: center">
            <div style="width: 84px; text-align: right">材料收缩率：</div>
            <div><el-input size="small" v-model="formData.materialShrinkageRate" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>成型周期：</div>
            <div><el-input size="small" v-model="formData.moldingCycle" placeholder=" " /></div>
          </div>
        </td>
        <td colspan="6">
          <div style="display: flex; align-items: center">
            <div>模具寿命：</div>
            <div><el-input size="small" v-model="formData.moldAlive" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>模具类型</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.moldType" @change="() => changeGroup('moldType')">
            <el-checkbox label="两板模" value="两板模" />
            <el-checkbox label="三板模" value="三板模" />
            <el-checkbox label="热流道" value="热流道" />
            <el-checkbox label="气辅" value="气辅" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>产品生产方式</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.productWay" @change="changeGroup('productWay')">
            <el-checkbox label="全自动" value="全自动" />
            <el-checkbox label="半自动" value="半自动" />
            <el-checkbox label="机械手" value="机械手" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="25"><div style="visibility: hidden">empty</div></td>
      </tr>
    </table>
    <table>
      <tr>
        <td align="center" style="border-top: 0" :rowspan="dataList.length + 1">模具材料</td>
        <td align="center" style="border-top: 0"><div style="visibility: hidden">empty</div></td>
        <td align="center" style="border-top: 0">S136</td>
        <td align="center" style="border-top: 0">S136H</td>
        <td align="center" style="border-top: 0">S45C</td>
        <td align="center" style="border-top: 0">S50C</td>
        <td align="center" style="border-top: 0">进口2738</td>
        <td align="center" style="border-top: 0">进口2738HH</td>
        <td align="center" style="border-top: 0">进口P20</td>
        <td align="center" style="border-top: 0">进口P20HH</td>
        <td align="center" style="border-top: 0">国产P20</td>
        <td align="center" style="border-top: 0">进口718HH</td>
        <td align="center" style="border-top: 0">NAK80</td>
        <td align="center" style="border-top: 0">SKD61</td>
        <td align="center" style="border-top: 0">SKD11</td>
        <td align="center" style="border-top: 0">GS2344</td>
        <td align="center" style="border-top: 0">2344</td>
        <td align="center" style="border-top: 0">8402</td>
        <td align="center" style="border-top: 0">T10</td>
        <td align="center" style="border-top: 0">Cr12</td>
        <td align="center" style="border-top: 0">青铜</td>
        <td align="center" style="border-top: 0">铍铜</td>
        <td align="center" style="border-top: 0">氮化</td>
        <td align="center" style="border-top: 0">淬火</td>
        <td align="center" style="border-top: 0">渗碳</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td align="center" style="border-top: 0">{{ item.title }}</td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.S136" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.S136H" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.S45C" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.S50C" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.进口2738" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.进口718HH" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.进口P20" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.进口P20HH" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-model="item.国产P20" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-model="item.进口718HH" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.NAK80" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.SKD61" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.SKD11" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.GS2344" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.f2344" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.f8402" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.T10" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.Cr12" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.青铜" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.铍铜" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.氮化" label="" size="small" />
        </td>
        <td align="center" style="border: 0">
          <el-checkbox v-if="idx !== 0" v-model="item.淬火" label="" size="small" />
        </td>
        <td align="center" style="border: 0; border-right: 1px solid #000">
          <el-checkbox v-if="idx !== 0" v-model="item.渗碳" label="" size="small" />
        </td>
      </tr>
      <tr>
        <td align="center">模具外观</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.moldAppearance" @change="changeGroup('moldAppearance')">
            <el-checkbox label="模具信息铭牌" value="模具信息铭牌" />
            <el-checkbox label="热流道铭牌" value="热流道铭牌" />
            <el-checkbox label="水路铭牌" value="水路铭牌" />
            <el-checkbox label="铭牌安装位置正确" value="铭牌安装位置正确" />
            <el-checkbox label="外观喷蓝色漆" value="外观喷蓝色漆" />
            <el-checkbox label="水路标记" value="水路标记" />
            <el-checkbox label="吊环螺纹标记" value="吊环螺纹标记" />
            <el-checkbox label="油路标记" value="油路标记" />
            <el-checkbox label="模板基准角符号" value="模板基准角符号" />
            <el-checkbox label="是否开撬模槽" value="是否开撬模槽" />
            <el-checkbox label="是否有垃圾钉" value="是否有垃圾钉" />
            <el-checkbox label="各模板顺序号" value="各模板顺序号" />
            <el-checkbox label="模架所有边倒角" value="模架所有边倒角" />
            <el-checkbox label="模仁周边倒角" value="模仁周边倒角" />
            <el-checkbox label="各模板零件编号" value="各模板零件编号" />
            <el-checkbox label="外露电线保护" value="外露电线保护" />
            <el-checkbox label="吊环孔位置满足标准要求" value="吊环孔位置满足标准要求" />
            <el-checkbox label="模具安装有方向要求" value="模具安装有方向要求" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>模具外观</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.moldStrength" @change="changeGroup('moldStrength')">
            <el-checkbox label="模具强度足够" value="模具强度足够" />
            <el-checkbox label="支撑柱位置合理" value="支撑柱位置合理" />
            <el-checkbox label="油缸强度足够" value="油缸强度足够" />
            <el-checkbox label="油缸限位开关" value="油缸限位开关" />
            <el-checkbox label="顶针板限位开关" value="顶针板限位开关" />
            <el-checkbox label="有辅助定位块" value="有辅助定位块" />
            <el-checkbox label="模具平衡块" value="模具平衡块" />
            <el-checkbox label="吊模孔大小合理" value="吊模孔大小合理" />
            <el-checkbox label="滑块下有顶针" value="滑块下有顶针" />
            <el-checkbox label="模具是否有先复位机构" value="模具是否有先复位机构" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>分型面</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.jointFace" @change="changeGroup('jointFace')">
            <el-checkbox label="无凹坑" value="无凹坑" />
            <el-checkbox label="无绣迹" value="无绣迹" />
            <el-checkbox label="无尖角" value="无尖角" />
            <el-checkbox label="干净、整洁" value="干净、整洁" />
            <el-checkbox label="大分型面有壁空" value="大分型面有壁空" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td rowspan="2">表面要求</td>
        <td colspan="12">
          <div>定模：</div>
          <div>
            <el-checkbox-group v-model="formData.surfaceFixMold" @change="changeGroup('surfaceFixMold')">
              <el-checkbox label="图纸要求" value="图纸要求" />
              <el-checkbox label="皮纹" value="皮纹" />
              <el-checkbox label="出模抛光" value="出模抛光" />
              <el-checkbox label="镜面" value="镜面" />
              <el-checkbox label="喷砂" value="喷砂" />
              <el-checkbox label="火花纹" value="火花纹" />
            </el-checkbox-group>
          </div>
        </td>
        <td colspan="12">
          <div>动模：</div>
          <div>
            <el-checkbox-group v-model="formData.surfaceAutoMold" @change="changeGroup('surfaceAutoMold')">
              <el-checkbox label="图纸要求" value="图纸要求" />
              <el-checkbox label="皮纹" value="皮纹" />
              <el-checkbox label="出模抛光" value="出模抛光" />
              <el-checkbox label="镜面" value="镜面" />
              <el-checkbox label="喷砂" value="喷砂" />
              <el-checkbox label="火花纹" value="火花纹" />
            </el-checkbox-group>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="24">
          <el-checkbox-group v-model="formData.surfaceReq" @change="changeGroup('surfaceReq')">
            <el-checkbox label="外观面有无分模线" value="外观面有无分模线" />
            <el-checkbox label="抛光满足产品要求" value="抛光满足产品要求" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>浇注系统</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.gatingSystem" @change="changeGroup('gatingSystem')">
            <el-checkbox label="直接浇口" value="直接浇口" />
            <el-checkbox label="侧浇口" value="侧浇口" />
            <el-checkbox label="扇型浇口" value="扇型浇口" />
            <el-checkbox label="潜伏式浇口" value="潜伏式浇口" />
            <el-checkbox label="点浇口" value="点浇口" />
            <el-checkbox label="针阀式" value="针阀式" />
            <el-checkbox label="香蕉浇口" value="香蕉浇口" />
            <el-checkbox label="进胶是否平衡" value="进胶是否平衡" />
            <el-checkbox label="流道、浇口抛光" value="流道、浇口抛光" />
            <el-checkbox label="浇口位置合理，不影响外观" value="浇口位置合理，不影响外观" />
            <el-checkbox label="三板模A板与脱料板之间有弹簧" value="三板模A板与脱料板之间有弹簧" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>热流道</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.hotRunner" @change="changeGroup('hotRunner')">
            <el-checkbox label="YUDO（柳道万和）" value="YUDO（柳道万和）" />
            <el-checkbox label="Syventive（圣万提）" value="Syventive（圣万提）" />
            <el-checkbox label="其他品牌" value="其他品牌" />
            <el-checkbox label="是否有隔热板" value="是否有隔热板" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>顶出系统</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.ejectionSystem" @change="changeGroup('ejectionSystem')">
            <el-checkbox label="圆顶针" value="圆顶针" />
            <el-checkbox label="扁顶针" value="扁顶针" />
            <el-checkbox label="司筒针" value="司筒针" />
            <el-checkbox label="推板顶出" value="推板顶出" />
            <el-checkbox label="顶块顶出" value="顶块顶出" />
            <el-checkbox label="两次顶出" value="两次顶出" />
            <el-checkbox label="油缸顶出" value="油缸顶出" />
            <el-checkbox label="斜顶" value="斜顶" />
            <el-checkbox label="气顶" value="气顶" />
            <el-checkbox label="顶出复位顺畅" value="顶出复位顺畅" />
            <el-checkbox label="模具有EGP" value="模具有EGP" />
            <el-checkbox label="顶出距离足够" value="顶出距离足够" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>冷却系统</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.coolantSystem" @change="changeGroup('coolantSystem')">
            <el-checkbox label="水路充分、畅通、均匀" value="水路充分、畅通、均匀" />
            <el-checkbox label="铍铜冷却" value="铍铜冷却" />
            <el-checkbox label="水路密封可靠" value="水路密封可靠" />
            <el-checkbox label="斜顶冷却" value="斜顶冷却" />
            <el-checkbox label="镶件冷却" value="镶件冷却" />
            <el-checkbox label="滑块冷却" value="滑块冷却" />
            <el-checkbox label="热流道有单独冷却水路" value="热流道有单独冷却水路" />
            <el-checkbox label="水路位置合理" value="水路位置合理" />
            <el-checkbox label="水路内部无铁屑" value="水路内部无铁屑" />
          </el-checkbox-group>
        </td>
      </tr>

      <tr>
        <td>滑块</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.slider" @change="changeGroup('slider')">
            <el-checkbox label="所有滑块都有限位" value="所有滑块都有限位" />
            <el-checkbox label="弹簧限位承重力足够" value="弹簧限位承重力足够" />
            <el-checkbox label="抽芯距离足够" value="抽芯距离足够" />
            <el-checkbox label="滑块上是否有顶针" value="滑块上是否有顶针" />
            <el-checkbox label="斜导柱固定长度足够" value="斜导柱固定长度足够" />
            <el-checkbox label="油缸锁紧结构" value="油缸锁紧结构" />
            <el-checkbox label="滑块结构合理可靠" value="滑块结构合理可靠" />
            <el-checkbox label="大滑块有中间导轨" value="大滑块有中间导轨" />
            <el-checkbox label="压板是否有定位销" value="压板是否有定位销" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>斜顶</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.lifter" @change="changeGroup('lifter')">
            <el-checkbox label="斜顶顶面低于模仁面" value="斜顶顶面低于模仁面" />
            <el-checkbox label="斜顶导向块是否有定位销" value="斜顶导向块是否有定位销" />
            <el-checkbox label="斜顶角度设计合理" value="斜顶角度设计合理" />
            <el-checkbox label="模架是否有斜顶拆卸孔" value="模架是否有斜顶拆卸孔" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>排气</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.exhaust" @change="changeGroup('exhaust')">
            <el-checkbox label="分型面开排气槽" value="分型面开排气槽" />
            <el-checkbox label="流道开排气槽" value="流道开排气槽" />
            <el-checkbox label="导套开排气槽" value="导套开排气槽" />
            <el-checkbox label="排气槽足够" value="排气槽足够" />
            <el-checkbox label="排气槽深度合理产品无飞边" value="排气槽深度合理产品无飞边" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>刻字</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.lettering" @change="changeGroup('lettering')">
            <el-checkbox label="完全按照图纸要求刻字" value="完全按照图纸要求刻字" />
            <el-checkbox label="刻字位置不影响产品的外观和装配" value="刻字位置不影响产品的外观和装配" />
            <el-checkbox label="完全按照客户标准刻字" value="完全按照客户标准刻字" />
            <el-checkbox label="刻字内容和位置得到客户的书面认可" value="刻字内容和位置得到客户的书面认可" />
            <el-checkbox label="日期章采用圆形标准件" value="日期章采用圆形标准件" />
            <el-checkbox label="日期章采用表格" value="日期章采用表格" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>模具设计确认</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.moldDesignConfirm" @change="changeGroup('moldDesignConfirm')">
            <el-checkbox label="3D确认" value="3D确认" />
            <el-checkbox label="2D确认" value="2D确认" />
            <el-checkbox label="模流分析" value="模流分析" />
            <el-checkbox label="2D总成图满足德龙公司要求" value="2D总成图满足德龙公司要求" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>客户存档</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.customerArchive" @change="changeGroup('customerArchive')">
            <el-checkbox label="模具3D和2D数据已刻盘提供给德龙公司" value="模具3D和2D数据已刻盘提供给德龙公司" />
            <el-checkbox label="总成图已按1：1比列打印提供给德龙公司" value="总成图已按1：1比列打印提供给德龙公司" />
            <el-checkbox label="提供给德龙公司存档的数据为最终版本的数据" value="提供给德龙公司存档的数据为最终版本的数据" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td>结论</td>
        <td colspan="24">
          <el-checkbox-group v-model="formData.result" @change="changeGroup('result')">
            <el-checkbox label="接收" value="接收" />
            <el-checkbox label="拒收" value="拒收" />
            <el-checkbox label="有条件接收" value="有条件接收" />
          </el-checkbox-group>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { roleUserList } from "@/api/systemManage";

const dataList = ref([
  {
    title: "模架",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20HH: false,
    进口P20: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "定模仁",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "动模仁",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: true,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: true,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: true
  },
  {
    title: "镶件",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "滑块",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "斜顶",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "耐磨块",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "压块",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "导向块",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "顶针",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  },
  {
    title: "浇口套",
    S136: false,
    S136H: false,
    S45C: false,
    S50C: false,
    进口2738: false,
    进口P20: false,
    进口P20HH: false,
    国产P20: false,
    进口718HH: false,
    NAK80: false,
    SKD61: false,
    SKD11: false,
    GS2344: false,
    f2344: false,
    f8402: false,
    T10: false,
    Cr12: false,
    青铜: false,
    铍铜: false,
    氮化: false,
    淬火: false,
    渗碳: false
  }
]);
const pmUserList = ref([]);
const formData: any = reactive({
  checkDate: dayjs().format("YYYY-MM-DD"),
  productWay: ["机械手"],
  moldDesignConfirm: ["3D确认"],
  customerArchive: ["提供给德龙公司存档的数据为最终版本的数据"],
  imgVersion: "V0"
});

const changeGroup = (key) => {
  if (formData[key].length > 1) {
    formData[key].splice(0, 1);
  }
};

onMounted(() => {
  roleUserList({
    roleId: 512
  }).then((res) => {
    if (res.data) {
      pmUserList.value = res.data.map((item) => ({ label: item.userName, value: item.userId }));
    }
  });
});

defineExpose({ formData, dataList });
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
