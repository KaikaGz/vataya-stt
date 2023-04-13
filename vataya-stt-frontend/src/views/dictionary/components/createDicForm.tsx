import React from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
const { Option } = Select;

type Props = {
  isModalVisible: any;
  setIsModalVisible: any;
  form: any;
  onCreate: any;
  dicType: any;
  onEdit: boolean;
  handleEdit: any;
  setOnEdit: any;
};

const CreateDicForm = (props: Props) => {
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
      onCancel={() => {
        props.setIsModalVisible(!props.isModalVisible);
        props.setOnEdit(false);
      }}
      //   title={props.onEdit == true ? "Edit Organization" : "Create Organizaion"}
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
        onFinish={props.onEdit == false ? props.onCreate : props.handleEdit}
        layout="vertical"
        // ref={formRef}
        requiredMark="optional"
        onFinishFailed={() => message.error("กรุณากรอกข้อมูลให้ครบ")}
      >
        {props.dicType == "General words" || props.dicType == "Stop words" ? (
          <Row gutter={[16, 16]}>
            <Col lg={24}>
              <Form.Item
                name="transform_text"
                label="Transform Text"
                rules={[
                  { required: true, message: "enter transform text please!" },
                ]}
              >
                <Input placeholder="input transform text" />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 16]}>
            <Col lg={24}>
              <Form.Item
                name="original_text"
                label="Original Text"
                rules={[
                  { required: true, message: "enter original text please!" },
                ]}
              >
                <Input placeholder="input original text" />
              </Form.Item>
            </Col>
            <Col lg={24}>
              <Form.Item
                name="transform_text"
                label="Transform Text"
                rules={[
                  { required: true, message: "enter transform text please!" },
                ]}
              >
                <Input placeholder="input transform text" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default CreateDicForm;
