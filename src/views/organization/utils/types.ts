import { OrganizationItemType } from "@/api/orgList";

interface FormProps {
  formInline: Partial<OrganizationItemType>;
  formConfigs: TableColumnList[];
}

export type { OrganizationItemType, FormProps };
