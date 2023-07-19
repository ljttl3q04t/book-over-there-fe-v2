import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Space } from "antd";
import { UpdateMemberModal } from "./UpdateMemberModal";
import { EditOutlined } from "@ant-design/icons";

type DataType = {
  id: number;
  fullName: string;
  code: string;
  phoneNumber: string;
};
type MemberTableProps = {
  tableData: DataType[];
  tableLoading: boolean;
  onRefresh: () => void;
};
export function MemberTable({ tableData, tableLoading, onRefresh }: MemberTableProps) {
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
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Action",
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
            Edit
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} loading={tableLoading} dataSource={tableData} scroll={{ x: 1000, y: 700 }} />
      <UpdateMemberModal
        onRefresh={() => onRefresh()}
        {...{
          currentMember,
          open: openUpdateModal,
          onCancel: hideUpdateModal,
        }}
      />
    </>
  );
}
