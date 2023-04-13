import { Button, Col, Row } from "antd";
import React from "react";

type Props = {
  onClickCreate: (data: any) => void;
  labelName: string;
};

const HeaderPage = ({ onClickCreate, labelName }: Props) => {
  return (
    <Row
      style={{
        height: "60px",
        boxShadow: "0px 1px 5px #00000029",
        background: "white",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
      align="middle"
      justify="space-between"
    >
      <Col
        style={{
          fontSize: "24pt",
        }}
      >
        {labelName}
      </Col>
      <Col md={2}>
        <Button
          className="w-100"
          type="primary"
          size="large"
          onClick={onClickCreate}
        >
          สร้าง
        </Button>
      </Col>
    </Row>
  );
};

export default HeaderPage;
