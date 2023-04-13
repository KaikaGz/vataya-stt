import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Image,
  Layout,
  Menu,
  notification,
  Row,
} from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LogoImg from "../assets/images/icon/icon_ai9.png";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../utils/auth/AuthWrapper";

const { Header, Footer, Content, Sider } = Layout;

const ResultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const auth = useAuth();

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          My Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          // target="_blank"
          // rel="noopener noreferrer"
          // href="https://www.aliyun.com"
          onClick={() => auth.logout()}
        >
          Logout
        </a>
      ),
      // icon: <SmileOutlined />,
      // disabled: true,
    },
  ];
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Sider
        className="box-shadow"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          borderRadius: "0 20px 20px 0",
          // background:"white",
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Sidebar collapsed={collapsed} />
      </Sider>
      <Layout>
        {/* <Button type='primary' onClick={toggleCollapsed}> {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button> */}
        <Header>
          <Row className="w-100" justify={"end"} style={{ cursor: "pointer" }}>
            <Col>
              <Row className="h-100 w-100" align={"middle"}>
                <Col>
                  <Dropdown menu={{ items }} placement="bottomRight">
                    <Row className="h-100 w-100" align={"middle"}>
                      <Avatar icon={<UserOutlined />} />
                      <span style={{ color: "white", marginLeft: "10px" }}>
                        Sittichai Saetiaw
                      </span>
                    </Row>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content
          style={
            collapsed === true
              ? { marginLeft: "80px" }
              : { marginLeft: "200px", background: "#f5f5f5" }
          }
        >
          <Outlet />
        </Content>
        <Footer></Footer>
      </Layout>
    </Layout>
  );
};

export default ResultLayout;
