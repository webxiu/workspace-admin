import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { dbKeyList } from "@/views/system/develop/database/utils/config";
import regExp from "@/utils/regExp";

export const formRules = (formData): FormRules => ({
  parentCode: [{ required: false, message: "父级为必选择项", trigger: "blur" }],
  menuType: [{ required: true, message: "项目类型为必选择项", trigger: "blur" }],
  displaySequence: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  menuName: [{ required: true, message: "项目名称为必填项", trigger: "blur" }],
  webRouter: [
    // {
    //   required: formData.menuType === "菜单",
    //   message: "菜单路由不能为空",
    //   trigger: "blur",
    //   validator: (rule: any, value: any, callback: any) => {
    //     if (!value && formData.menuType === "菜单") {
    //       callback(new Error("菜单路由不能为空"));
    //     } else {
    //       callback();
    //     }
    //   }
    // },
    { required: false, message: "菜单路由不能为空", trigger: "blur" },
    { required: false, message: "路由必须以 / 开头", trigger: "blur", pattern: /^\/.*$/ }
  ],
  controller: [{ required: true, message: "控制器为必填项", trigger: "blur" }],
  menuCode: [{ required: true, message: "项目编号为必填项", trigger: "blur" }],
  dataTable: [
    { required: false, message: "数据表为必选项", trigger: "blur" },
    { message: "请以字母、数字或下划线组合, 多个表用逗号隔开", trigger: "blur", pattern: regExp.dbCommaSplit }
  ],
  auxilTable: [
    { required: false, message: "辅助表为必选项", trigger: "blur" },
    { message: "请以字母、数字或下划线组合, 多个表用逗号隔开", trigger: "blur", pattern: regExp.dbCommaSplit }
  ]
});

/** iconfont图标类名,使用逗号拼接,可根据项目需求添加 */
const iconfont = `hangzou,genghuanyanse,gongzuojiaojietubiao,lizhishenqing,lizhishenqing1,genghuan,gongzuojiaojie,a-dingdantongjibiao2x,xiaoshoutongji6,dingdan-dingdantongji,dakajilu,anshoufeixiangmutongji,a-caigouguanlicaigoudingdantongji-line,a-zu2219,kaoqinjilu1,xiaoshoutongji1,xiaoshoutongji3,snxiaoshoutongji,renlianshibie,xiaoshoutongji-xuanzhong,xiangmutongji,qiandaodaka,qianqixiangmutongji,xiaoshoudingdantongji,xiaoshoutongji4,shijian,renlianshibie1,shijian1,renliancaiji,shijian2,xiaoshoutongji5,paizhao-01-09,caiwu1,caiwuguanli4,bom,BOMmdpi,BOMguanli1,bom1,BOM,xitongshezhi,caiwuguanli1,xitongshezhi1,xitongshezhi2,caiwuguanli2,renshixinxi1,renshi-,xitongshezhi3,jingyingfenxi,jingyingzhongxin,renshihangzhenggongzuotai,shichangyingxiao1,gongyinglian1,xitongshezhi4,gongyinglianzhongxin-mianxing,gongyinglianfuwu,zhizaozhihang,gongyinglian-gongguanfenxi,zhizaoBOM,lujing,loop,zhinengshuidianbiao,soucang,shoucang,shouye,gongzuotai,file-ai,psd,xls,TXTtubiao,icon_proe,Jpg,doc,Pdf,docx,wenjianjia1,xlsx,RAR,CAD1,zip,xinruku,caiwuxinxi,orderx,gongyingshang,dibushouye,bianhao,menu-10,zidianguanli,mysql,ziyuanxhdpi,quanxianguanli-,xitongcanshupeizhizhongxin,shujuzidian,renwutiaodu,huancunguanli,caozuoquanxian,liuchengkanban,huaban11,yonghu,BOMguanli,wuliao,fenlei,jieridaquan,shenqing,cangku,renwujiaofu,a-icon3,xiangmumoban,tuandui,hf_zxphuatu,gangwei,dailiren,chejianzhitonglv,kaoqinrenyuan,chuchai,ribaotongji,kehupaimingshuju,dingdantongji,chengbenjiangdi,lirun,leijidachengshuai,shuidianfei,chouchajiancha,zhuzhuangtu,complete_purchase,yingshouyingfu-,chukutongji,yingshou,yingfu,fuzhaizonge,kehutousu,yejitongji,qianshoushuai,BMS-2-13,zengsongjilu,renyuanfenxi,yingshou1,crmkehuguanli,jiankong,xinzishezhi,icon_versus_wf,caiwufenxi,biangengcaigouyuan,gongzuohuibao,kaoqin-kaoqinhuizongbiao,kaoqin-kaoqinmingxibiao,feiyongbaobiao_zonghebaobiao,susheguanli,jishishuai,kehuqushifenxi,gongdan,xiaoshoutongji,kehuzhanbi,cankazhifu,shengchanxiaoshuai-143,chanpinchengbenbeifen2x,gongzihesuan,churukutongji,jixiao,lailiaohegeshuaibaobiao,chanpinleibie,kucunjine,banbenduibi,kaoqinjichaxun,diquzhanbi,jihuadachengshuai,xiuxiri,paichanmingxi,int-gp3_bumenfeiyong,icon_gongzuorishezhi,kaoqinjilu,kaoqintongji,lailiaojian,dingdan,shangpin,xiangshang5,dwg1,waichu,waichu1,4,leasingcloud_qingjiashenhe,wodefuli,xinfangtousu,xingzhuanggongnengtubiao-,liebiaofanhui,icon_home,SmartHome,home_click,chan,renlikaoqin,shebeiweixiuweihu,icon_app_examine_,duixiangchuangjian,shenpi1,jiaban1,yongcanjiucan,17home,renshidangan,xuqiu,tousujianyi,gongzitiaoicon1x,shuju,caidan_16,shengchanjihua,a-homeliving,fenxikanban,dwg,guiwenjianku,keyanchengguohuojiang,fanhui,shangchuan,xinjianwenjianjia,yidong,yunshangchuan_o,24gl-rename,wenjianjia,Microsoft-Excel,pdf,ZIP,WORD,PPT,file_ai,PNGtubiao,PSDtubiao,CDRtubiao,proe,xltx,pptx,rar,txt,md,CAD,JPG,zhongzhimima,gongcheng,wxbbaobiao,laboratorylab,wuzicangku,shengchan,pinzhibaozhengQuality,caigou,shichangyingxiao,renshixingzheng,caiwu,shengchanzhizao,yonghu-shanchu,tianjiayonghu,dagou,yishenhe,liuchengtu,qiyong,qiyong1,pause,24gl-lock,jinyong,qiyongzhanghao,ktvtianchong,gongzuorili,wodegongzuoqingkuang,xunjianchulirenyuan,xiazai-wenjianxiazai-08,mobanguanli,guidang1,guidang,jilu-copy,jilu,yijianfankui-,dianziqianming,qiyeweixin,daoru,chexiao,xiangxia,jurassic_setup-templete,caiwuguanli,gongzitiao-,chakan,yunxiazai,24gl-portraitMaleInfo3,fujian,icon_renwujincheng,pinglun,project_management,shanchu,bianji,ziyuanxiaohao,nenghaochengben,shuishuai,renwujihua,chanchuxiaoshuai-,cost-o,ipr_shangbiaochenggongshuai,difeishuai,xiaoshouqushi,kucun,yongjiuxinggongchengcailiao,banxiao,13zhibanjihua,leftfont-34,bizhonghuishuai,xiaoshou,gongkaiyijianxiang,search1,leftfont-33,jianhao,jiahao,baocun,huaban,shenpi,tongbu,xidurenyuanfenxi,shangyiye,shangyiye1,xiayiye1,xiayiye,shuaxin1,logout,daochu,techreport-,xiangshang,search,dakaqiandao,zulincuijiaotixing,youjiantou1,youjiantou,chukuchaxun,rukuqingdan,fenxiangerweima,gerenKPI,jiaoseshezhi,jiaosequnti,drxx11,bumenguanli,caiwubaobiao,yonghuquanxianguanli,jiaosequanxian,shujuquanxianguanli,chengyuanyonghuguanli,caiwubaobiao1,drxx23,jiabanshixiang,jiaban,wj-qjd,qingjiashenqing,shouye-renshihangzheng,exe-report-forms-primary,system`;
export const iconList: string[] = iconfont.split(",");
const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

export const formConfigs = ({ type, parentData, menuOption, _formData, onParentTreeChange }): FormConfigItemType[] => {
  return [
    {
      label: "父级",
      prop: "parentCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            data={parentData.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择父级"
            class="ui-w-100"
            onCurrentChange={onParentTreeChange}
            props={{ label: "name", value: "id" }}
          />
        );
      }
    },
    {
      label: "项目类型",
      prop: "menuType",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择项目类型" clearable class="ui-w-100" disabled={type === "edit"}>
            {menuOption.value.map((item) => (
              <el-option key={item.value} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "排序",
      prop: "displaySequence",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input-number v-model={formModel[row.prop]} min={1} max={1000} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
        );
      }
    },
    {
      label: "项目名称",
      prop: "menuName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "前端路由",
      prop: "webRouter",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="移动端路由无需填写" clearable />;
      }
    },
    {
      label: "控制器",
      prop: "controller",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "移动端首页",
      prop: "appHomeUrl",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "移动端详情",
      prop: "appDetailUrl",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "图标",
      prop: "icon",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable>
            {{
              append: () => (
                <el-popover placement="right" width={347} trigger="click">
                  {{
                    reference: () => <el-button>选择</el-button>,
                    default: () => (
                      <el-row style="max-height: 200px;overflow-y: auto;" class="border-line">
                        {iconList.map((item) => (
                          <el-col span={3} style="display: flex;" class="border-line just-center align-center">
                            {/* <i style="font-size: 28px; cursor: pointer;" class={`iconfont icon-${item}`} onClick={() => (_formData.icon = item)} /> */}
                            <svg
                              class={`svg-icon ${item}`}
                              onClick={() => (_formData.icon = item)}
                              aria-hidden={true}
                              style={{
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                padding: "5px",
                                fill: "currentColor"
                              }}
                            >
                              <use xlinkHref={`#icon-${item}`}></use>
                            </svg>
                          </el-col>
                        ))}
                      </el-row>
                    )
                  }}
                </el-popover>
              )
            }}
          </el-input>
        );
      }
    },
    {
      label: "项目编号",
      prop: "menuCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "标记",
      prop: "mark",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "是否启用",
      prop: "isEnable",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-switch v-model={formModel[row.prop]} active-value={true} inactive-value={false} />;
      }
    },
    {
      label: "数据库",
      prop: "dataBase",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100" disabled={formModel.menuType !== "菜单"}>
            {dbKeyList.map((item) => (
              <el-option key={item.label} label={item.label} value={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "数据表",
      prop: "dataTable",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable disabled={formModel.menuType !== "菜单"} />;
      }
    },
    {
      label: "辅助表",
      prop: "auxilTable",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable disabled={formModel.menuType !== "菜单"} />;
      }
    }
  ];
};
