import { KingdeeDBItemType } from "@/api/kingdeeDB";

interface FormProps {
  formInline: Partial<KingdeeDBItemType>;
  formConfigs: TableColumnList[];
}

export type { KingdeeDBItemType, FormProps };
