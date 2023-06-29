import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Error403() {
  const navigate = useNavigate();

  function onlickBackHome() {
    navigate("/login");
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={onlickBackHome}>
          Back Home
        </Button>
      }
    />
  );
}
