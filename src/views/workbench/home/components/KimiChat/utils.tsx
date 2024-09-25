import { message, showMessageBox } from "@/utils/message";

const Chat_List = "chat_list";

export interface ChatItemType {
  name: string;
  userCode: string;
  role: string;
  message: string;
  id: number;
  timestamp: string;
}

export function getChattMsg(): ChatItemType[] {
  const data = JSON.parse(localStorage.getItem(Chat_List) || "[]");
  return data;
}
export function setChatMsg(item: ChatItemType) {
  let _data = getChattMsg();
  _data.push(item);
  const maxCount = 200; // 最多保留200条
  if (_data.length > maxCount) {
    message(`消息记录已超过限制, 将保存最近的${maxCount}条`, { type: "warning", duration: 5000 });
    _data = _data.slice(-maxCount);
  }
  localStorage.setItem(Chat_List, JSON.stringify(_data));
  return _data;
}
export function removeChatMsg(kimiChatRef) {
  showMessageBox("确定要清除聊天记录吗?").then(() => {
    message("已清除聊天记录");
    localStorage.removeItem(Chat_List);
    kimiChatRef.value?.onClear();
  });
}
