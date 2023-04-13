import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { api_getAllRole } from "../../../services/role";
import { api_getAllOrg } from "../../../services/organization";
const { Option } = Select;

const FormUserManage = ({
  isModalVisible,
  setIsModalVisible,
  onCreate,
  form,
  editData,
  onEdit,
}) => {
  const [role, setRole] = useState([]);
  const [org, setOrg] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("stt"));

  const handleOk = async () => {
    try {
      await form.validateFields();
      form.submit();
      setIsModalVisible(false);
    } catch (error) {
      console.error(error, "err");
    }
  };

  const getRoleData = async () => {
    try {
      const res = await api_getAllRole();
      if (res.success == true) {
        setRole(res.data);
      } else {
        setRole([{ id: 999, role_name: "ไม่มีข้อมูล" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getOrgData = async () => {
    try {
      const res = await api_getAllOrg();
      if (res.success == true) {
        setOrg(res.data);
      } else {
        setOrg([{ org_id: 999, org_name: "ไม่มีข้อมูล" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getRoleData();
    getOrgData();
  }, []);

  return (
    <Modal
      forceRender={true}
      //   visible={isModalVisible}
      open={isModalVisible}
      //   destroyOnClose={false}
      closeIcon={false}
      onCancel={() => setIsModalVisible(!isModalVisible)}
      title={editData ? "Edit Organization" : "Create Organizaion"}
      closable={false}
      footer={
        <>
          <Button
            // loading={loading}
            onClick={() => setIsModalVisible(!isModalVisible)}
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
        form={form}
        onFinish={editData ? onEdit : onCreate}
        layout="vertical"
        // ref={formRef}
        requiredMark="optional"
        onFinishFailed={() => message.error("กรุณากรอกข้อมูลให้ครบ")}
      >
        <Row gutter={[16, 16]}>
          <Col lg={24}>
            <Form.Item
              name="org_name"
              label="Name"
              rules={[{ required: true, message: "enter fullname please!" }]}
            >
              <Input placeholder="input your name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormUserManage;
