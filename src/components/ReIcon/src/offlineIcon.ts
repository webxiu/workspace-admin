import Card from "@iconify-icons/ri/bank-card-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import Edit from "@iconify-icons/ep/edit";
import FlUser from "@iconify-icons/ri/admin-line";
import Guide from "@iconify-icons/ep/guide";
import Histogram from "@iconify-icons/ep/histogram";
import HomeFilled from "@iconify-icons/ep/home-filled";
import InformationLine from "@iconify-icons/ri/information-line";
import KnifeFork from "@iconify-icons/ep/knife-fork";
import ListCheck from "@iconify-icons/ri/list-check";
import Lollipop from "@iconify-icons/ep/lollipop";
import Menu from "@iconify-icons/ep/menu";
import Monitor from "@iconify-icons/ep/monitor";
import Ppt from "@iconify-icons/ri/file-ppt-2-line";
import Promotion from "@iconify-icons/ep/promotion";
import Role from "@iconify-icons/ri/admin-fill";
import SetUp from "@iconify-icons/ep/set-up";
import Setting from "@iconify-icons/ri/settings-3-line";
import TerminalWindowLine from "@iconify-icons/ri/terminal-window-line";
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标

export const iconList = [
  { name: "HomeFilled", component: HomeFilled },
  { name: "InformationLine", component: InformationLine },
  { name: "Lollipop", component: Lollipop },
  { name: "Histogram", component: Histogram },
  { name: "Promotion", component: Promotion },
  { name: "Edit", component: Edit },
  { name: "KnifeFork", component: KnifeFork },
  { name: "Card", component: Card },
  { name: "CheckboxCircleLine", component: CheckboxCircleLine },
  { name: "Dept", component: Dept },
  { name: "FlUser", component: FlUser },
  { name: "Guide", component: Guide },
  { name: "ListCheck", component: ListCheck },
  { name: "Menu", component: Menu },
  { name: "Monitor", component: Monitor },
  { name: "Ppt", component: Ppt },
  { name: "Role", component: Role },
  { name: "SetUp", component: SetUp },
  { name: "Setting", component: Setting },
  { name: "TerminalWindowLine", component: TerminalWindowLine },
  { name: "UbuntuFill", component: UbuntuFill }
];

iconList.forEach(({ name, component }) => addIcon(name, component));
