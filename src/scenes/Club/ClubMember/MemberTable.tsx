import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import dfbServices from "@/services/dfb";
import { MemberInfos } from "@/services/types";
import { Button, Space } from "antd";
import { UpdateMemberModal } from "./UpdateMemberModal";

type DataType = {
  id: number;
  fullName: string;
  code: string;
  phoneNumber: string;
};

export function MemberTable() {
  const [loading, setLoading] = React.useState(false);
  const [memberIds, setMemberIds] = React.useState<number[]>([]);
  const [tableData, setTableData] = React.useState<DataType[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [currentMember, setCurrentMember] = React.useState<DataType | undefined>();

  const fetchMemberIds = async () => {
    try {
      setLoading(true);
      const _memberIds = await dfbServices.getMemberIds();
      setMemberIds(_memberIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMemberInfos = async () => {
    try {
      setLoading(true);
      const memberInfos: MemberInfos[] = await dfbServices.getMemberInfos(memberIds);
      const data: DataType[] = [];
      for (const member of memberInfos) {
        data.push({
          id: member.id,
          fullName: member.full_name,
          code: member.code,
          phoneNumber: member.phone_number,
        });
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMemberIds();
  }, []);

  React.useEffect(() => {
    if (memberIds.length > 0) {
      fetchMemberInfos();
    }
  }, [memberIds]);

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
      render: (v: DataType) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              showUpdateModal(v);
            }}
          >
            Update
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} loading={loading} dataSource={tableData} />
      <UpdateMemberModal
        {...{
          currentMember,
          open: openUpdateModal,
          onCancel: hideUpdateModal,
        }}
      />
    </>
  );
}
