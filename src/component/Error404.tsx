import {Button, Result} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";


export function Error404() {
  const navigate = useNavigate();

  function onlickBackHome() {
    navigate("/");
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={onlickBackHome}>
          Back Home
        </Button>
      }
    />
  );
}
