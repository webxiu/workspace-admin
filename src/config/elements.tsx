import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftBold,
  ArrowRight,
  ArrowRightBold,
  ArrowUp,
  Back,
  Bottom,
  Box,
  Calendar,
  ChatRound,
  CircleClose,
  CirclePlus,
  Clock,
  Close,
  CloseBold,
  CollectionTag,
  Connection,
  CopyDocument,
  DArrowLeft,
  DArrowRight,
  DCaret,
  Delete,
  Document,
  DocumentChecked,
  DocumentCopy,
  DocumentDelete,
  Download,
  Edit,
  EditPen,
  Expand,
  Files,
  Filter,
  Fold,
  Folder,
  FolderOpened,
  Hide,
  Link,
  Loading,
  Menu,
  Message,
  MessageBox,
  More,
  MoreFilled,
  Notification,
  Paperclip,
  Picture,
  Plus,
  Pointer,
  Position,
  PriceTag,
  Printer,
  QuestionFilled,
  Rank,
  Refresh,
  RefreshLeft,
  RefreshRight,
  Remove,
  Right,
  ScaleToOriginal,
  Search,
  Select,
  SemiSelect,
  SetUp,
  Setting,
  Share,
  Sort,
  Star,
  StarFilled,
  Switch,
  SwitchButton,
  TakeawayBox,
  Tickets,
  Top,
  Upload,
  UploadFilled,
  User,
  View,
  Warning,
  WindPower,
  ZoomIn,
  ZoomOut
} from "@element-plus/icons-vue";
import { CSSProperties, h, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { AxiosProgressEvent } from "axios";
import { addDialog } from "@/components/ReDialog";

/** 按钮上的图标 */
export const IconConf = {
  Plus: <Plus />,
  Edit: <Edit />,
  Delete: <Delete />,
  Search: <Search />,
  Upload: <Upload />,
  Download: <Download />,
  EditPen: <EditPen />,
  CirclePlus: <CirclePlus />,
  Printer: <Printer />,
  MessageBox: <MessageBox />,
  TakeawayBox: <TakeawayBox />,
  SetUp: <SetUp />,
  Tickets: <Tickets />,
  Setting: <Setting />,
  WindPower: <WindPower />,
  Picture: <Picture />,
  CopyDocument: <CopyDocument />,
  Link: <Link />,
  Loading: <Loading />,
  Star: <Star />,
  Position: <Position />,
  View: <View />,
  Hide: <Hide />,
  Refresh: <Refresh />,
  RefreshRight: <RefreshRight />,
  RefreshLeft: <RefreshLeft />,
  User: <User />,
  ArrowLeftBold: <ArrowLeftBold />,
  ArrowRightBold: <ArrowRightBold />,
  DArrowLeft: <DArrowLeft />,
  DArrowRight: <DArrowRight />,
  Warning: <Warning />,
  Close: <Close />,
  CloseBold: <CloseBold />,
  More: <More />,
  MoreFilled: <MoreFilled />,
  Message: <Message />,
  Document: <Document />,
  Calendar: <Calendar />,
  PriceTag: <PriceTag />,
  Paperclip: <Paperclip />,
  CollectionTag: <CollectionTag />,
  Files: <Files />,
  Folder: <Folder />,
  FolderOpened: <FolderOpened />,
  Box: <Box />,
  DocumentCopy: <DocumentCopy />,
  DCaret: <DCaret />,
  Rank: <Rank />,
  Fold: <Fold />,
  Expand: <Expand />,
  Filter: <Filter />,
  Notification: <Notification />,
  Connection: <Connection />,
  Clock: <Clock />,
  SwitchButton: <SwitchButton />,
  DocumentChecked: <DocumentChecked />,
  Sort: <Sort />,
  ZoomOut: <ZoomOut />,
  ZoomIn: <ZoomIn />,
  Menu: <Menu />,
  Share: <Share />,
  StarFilled: <StarFilled />,
  Select: <Select />,
  SemiSelect: <SemiSelect />,
  ChatRound: <ChatRound />,
  Top: <Top />,
  Right: <Right />,
  Bottom: <Bottom />,
  Back: <Back />,
  DocumentDelete: <DocumentDelete />,
  ScaleToOriginal: <ScaleToOriginal />,
  ArrowLeft: <ArrowLeft />,
  ArrowUp: <ArrowUp />,
  ArrowRight: <ArrowRight />,
  ArrowDown: <ArrowDown />,
  UploadFilled: <UploadFilled />,
  Switch: <Switch />,
  CircleClose: <CircleClose />,
  Pointer: <Pointer />,
  Remove: <Remove />
};

// 提示图标
export const Question = (props: {
  label?: string;
  tipMsg?: string | JSXElement;
  Icon?: any;
  placement?: string;
  color?: string;
  size?: number;
  iconStyle?: CSSProperties;
}) => {
  const { label, tipMsg = "提示", Icon = QuestionFilled, placement = "top", color = "orange", size = 14, iconStyle, ...reset } = props;
  return (
    <span>
      {label ? <span>{label}</span> : null}
      <el-tooltip placement={placement} content={tipMsg} {...reset}>
        {{
          default: () => (
            <el-icon class="ui-va-tt" size={size} style={{ margin: "1px 0 0 2px", ...iconStyle }}>
              {<Icon color={color} />}
            </el-icon>
          ),
          content: () => tipMsg
        }}
      </el-tooltip>
    </span>
  );
};

// 定义 uploadApi 的类型
type UploadApi<T> = (formData: FormData, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) => Promise<T>;

// 提示图标
export const HxUploadProgress = <T extends {}>(props: { fd: FormData; uploadApi: UploadApi<T> }): Promise<T> => {
  return new Promise((resolve, reject) => {
    const { uploadApi, fd } = props;
    const formRef = ref();
    const isOK = ref(false);
    const progressInfo = ref<AxiosProgressEvent>({ loaded: 0, total: 0 } as AxiosProgressEvent);

    // 上传进度
    const UploadProgress = () => {
      const { loaded, total } = progressInfo.value;
      const percent = Math.floor((loaded / total) * 100);
      return (
        <>
          <div>测试接口定义地址:/oa/fin/payslipmanage/importpayslipdata2</div>
          <el-progress percentage={percent} stroke-width={15} text-inside={true} status="success" />
        </>
      );
    };
    const resultDialog = addDialog({
      title: "上传进度",
      width: "460px",
      draggable: true,
      showClose: false,
      fullscreenIcon: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      style: { marginTop: "10vh !important" },
      hideItem: ["ok"],
      contentRenderer: () => h(UploadProgress, { ref: formRef }),
      beforeCancel: (done, { options }) => {
        const { loaded, total } = progressInfo.value;
        if (total > 0 && loaded < total) {
          showMessageBox(`确认要取消上传吗?`).then(() => {
            progressInfo.value = { loaded: 0, total: 0 } as AxiosProgressEvent;
            isOK.value = true;
            uploadApi["cancel"]("上传已取消");
            done();
          });
        } else if (!isOK.value) {
          done();
        }
      }
    });
    function onUploadProgress(progressEvent: AxiosProgressEvent) {
      const { loaded, total } = progressEvent;
      progressInfo.value = progressEvent;
      if (loaded > 0 && loaded === total) {
        const timer = setTimeout(() => {
          resultDialog.options.value.visible = false;
          isOK.value = true;
          progressInfo.value = { loaded: 0, total: 0 } as AxiosProgressEvent;
          clearTimeout(timer);
        }, 2000);
      }
    }
    uploadApi(fd, onUploadProgress)
      .then(resolve)
      .catch((err) => {
        isOK.value = false;
        reject(err);
      });
  });
};
