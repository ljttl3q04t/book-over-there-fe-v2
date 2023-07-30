import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Space } from "antd";
import { UpdateMemberModal } from "./UpdateMemberModal";
import { EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type DataType = {
  id: number;
  fullName: string;
  code: string;
  phoneNumber: string;
  clubId: number;
};

type MemberTableProps = {
  tableData: DataType[];
  tableLoading: boolean;
  onRefresh: () => void;
  isFilter: boolean;
  filteredTableData: DataType[];
};

export function MemberTable({ tableData, tableLoading, onRefresh, isFilter, filteredTableData }: MemberTableProps) {
  const { t } = useTranslation();
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [currentMember, setCurrentMember] = React.useState<DataType | undefined>();

  const showUpdateModal = (member: DataType) => {
    setCurrentMember(member);
    setOpenUpdateModal(true);
  };

  const hideUpdateModal = () => {
    setCurrentMember(undefined);
    setOpenUpdateModal(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: t("Full Name") as string,
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("Member Code") as string,
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("Phone Number") as string,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Notes") as string,
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: t("Action") as string,
      key: "action",
      width: "10%",
      render: (v: DataType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              showUpdateModal(v);
            }}
          >
            {t("Edit") as string}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        loading={tableLoading}
        dataSource={(isFilter ? filteredTableData : tableData).sort((a, b) => b.id - a.id)}
        scroll={{ x: 1000, y: 700 }}
        pagination={{
          defaultPageSize: 50, // Set the default pageSize to 50
          showSizeChanger: true, // Optional: To allow users to change pageSize
          pageSizeOptions: ["10", "20", "50", "100"], // Optional: Specify other pageSize options
        }}
      />
      <UpdateMemberModal
        open={openUpdateModal}
        currentMember={currentMember}
        onCancel={hideUpdateModal}
        onRefresh={onRefresh}
      />
    </>
  );
}
