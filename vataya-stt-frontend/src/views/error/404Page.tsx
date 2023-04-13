import { Button, Col, Image, Row } from "antd";
import Image404 from "../../assets/images/image/404.jpg";
import React from "react";

type Props = {};

const Error404Page = (props: Props) => {
  return (
    <Row
      className="w-100 h-100"
      style={{ border: "solid red 1px", background: "white" }}
      justify="center"
      align="middle"
    >
      <Col md={24}>
        <Image src={Image404} preview={false} width={"50%"} />
      </Col>
      <br />
      {/* <Row> */}
      <Button>Back to Home</Button>
      {/* </Row> */}
      {/* </Col> */}
    </Row>
  );
};

export default Error404Page;
