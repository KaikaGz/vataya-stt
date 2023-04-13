import { Button, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { api_login } from "../../services/login";
import { useAuth } from "../../utils/auth/AuthWrapper";
import { callNotification } from "../../utils/showNotification";

type Props = {};

const LoginPage = (props: Props) => {
  const auth = useAuth();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async (data: any) => {
    try {
      const res = await api_login(data);
      if (res.success == true) {
        callNotification(
          "success",
          "Login Success",
          `login success welcome ${res.user_profile.name}`
        );
        auth.login(res);
      } else if (res.success == false) {
        callNotification("error", "Login Fail", res.message);
      } else if (res.code == 400) {
        callNotification("info", "Login Fail", res.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Row
        className="w-100 h-100"
        style={{ minHeight: "100vh" }}
        align="middle"
        justify="center"
      >
        <Col>
          <Form
            onFinish={handleLogin}
            initialValues={{ email: "test@test.com", password: "12345678" }}
          >
            <Form.Item name="email">
              <Input placeholder="email" />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password placeholder="password" />
            </Form.Item>
            <Button htmlType="submit">Login</Button>;
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default LoginPage;
