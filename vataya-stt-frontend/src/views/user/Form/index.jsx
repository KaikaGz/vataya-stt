import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { api_getAllRole } from "../../../services/role";
import { api_getAllOrg } from "../../../services/organization";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const FormUserManage = ({
  isModalVisible,
  setIsModalVisible,
  onCreate,
  form,
  editData,
  onEdit,
  handleResetPassword,
}) => {
  const [role, setRole] = useState([]);
  const [org, setOrg] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("stt")) || [];
  const navigate = useNavigate();

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
      } else if (res.code == "INVALID_AUTHORIZATION_CODE") {
        navigate("/login");
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
      console.log("res", res);
      if (res.success == true) {
        setOrg(res.data);
      } else if (res.error.code == "INVALID_AUTHORIZATION_CODE") {
        navigate("/login");
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
      title={editData ? "Edit User" : "Create User"}
      closable={false}
      footer={
        <>
          <Button
            // loading={loading}
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            Cancel
          </Button>
          {editData ? (
            <Button type="primary" ghost onClick={handleResetPassword}>
              Reset Password
            </Button>
          ) : (
            <></>
          )}
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
              name="fullname"
              label="Name"
              rules={[{ required: true, message: "enter fullname please!" }]}
            >
              <Input placeholder="input your name" />
            </Form.Item>
          </Col>
          <Col lg={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "enter email please!" }]}
            >
              <Input
                placeholder="input your email"
                type={"email"}
                disabled={editData ? true : false}
              />
            </Form.Item>
          </Col>
          {userInfo.role == 2 ? (
            <></>
          ) : (
            <Col lg={14}>
              <Form.Item
                name="org"
                label="Organization"
                rules={[
                  { required: true, message: "choose oranization please!" },
                ]}
              >
                <Select placeholder="select organization">
                  {org.map((data, index) => {
                    return (
                      <Option key={index} value={data.org_id}>
                        {data.org_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col lg={userInfo.role == 2 ? 24 : 10}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "choose role please!" }]}
            >
              <Select placeholder="select role">
                {role.map((data, index) => {
                  return (
                    <Option key={index} value={data.id}>
                      {data.role_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          {editData ? (
            <></>
          ) : (
            <Col lg={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "enter password please!" }]}
              >
                <Input.Password placeholder="input your password" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default FormUserManage;
