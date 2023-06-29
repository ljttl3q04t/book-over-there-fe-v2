import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import React from "react";

export function UploadBasic(onChange: ((info: UploadChangeParam<UploadFile<any>>) => void) | undefined) {
  return (
    <>
      <Upload beforeUpload={() => false} onChange={onChange}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
}
