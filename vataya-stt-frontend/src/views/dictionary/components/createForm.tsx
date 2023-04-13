import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";
const { Option } = Select;

type Props = {
  isModalVisible: boolean;
  setIsModalVisible: any;
  onCreate: (data: any) => any;
  form: any;
};

const CreateForm = (props: Props) => {
  const handleOk = async () => {
    try {
      await props.form.validateFields();
      props.form.submit();
      props.setIsModalVisible(false);
    } catch (error) {
      console.error(error, "err");
    }
  };

  return (
    <Modal
      forceRender={true}
      //   visible={isModalVisible}
      open={props.isModalVisible}
      //   destroyOnClose={false}
      closeIcon={false}
      onCancel={() => props.setIsModalVisible(!props.isModalVisible)}
      //   title={editData ? "Edit Organization" : "Create Organizaion"}
      closable={false}
      footer={
        <>
          <Button
            // loading={loading}
            onClick={() => props.setIsModalVisible(!props.isModalVisible)}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleOk}>
            Ok
          </Button>
        </>
      }
    >
      <Form
        name="user_create"
        form={props.form}
        onFinish={props.onCreate}
        layout="vertical"
        // ref={formRef}
        requiredMark="optional"
        onFinishFailed={() => message.error("กรุณากรอกข้อมูลให้ครบ")}
      >
        <Row gutter={[16, 16]}>
          <Col lg={24}>
            <Form.Item
              name="dic_name"
              label="Name"
              rules={[{ required: true, message: "enter fullname please!" }]}
            >
              <Input placeholder="input your name" />
            </Form.Item>
          </Col>
          <Col lg={24}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "enter fullname please!" }]}
            >
              <Select
                placeholder="select organization"
                defaultValue={"General words"}
              >
                <Option key={1} value={"General words"}>
                  General words
                </Option>
                <Option key={2} value={"Transform words"}>
                  Transform words
                </Option>
                <Option key={3} value={"Abbreviation words"}>
                  Abbreviation words
                </Option>
                <Option key={4} value={"Stop Words"}>
                  Stop Words
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateForm;
