import React from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons/lib/icons";
import LogoImg from "../../assets/images/icon/icon_vataya.png";
import LogoImg2 from "../../assets/images/icon/vataya-stt-logo-clean2.png";
import { Image, Menu, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { items } from "../../config/configMenu";
import { useAuth } from "../../utils/auth/AuthWrapper";

const Sidebar = ({ collapsed }) => {
  const auth = useAuth();
  const location = useLocation();
  console.log("location :", location);

  console.log("auth sidebar", auth);
  const navigate = useNavigate();

  const navigatePath = (data) => {
    navigate(data.keyPath[0]);
  };

  const canSuper = items.filter((d) => {
    if (
      d.access == undefined ||
      d.access == "Super Admin" ||
      d.access == "Super Admin , Admin"
    ) {
      return d;
    }
  });

  const canAdmin = items.filter((d) => {
    if (
      d.access == undefined ||
      d.access == "Admin" ||
      d.access == "Super Admin , Admin" ||
      d.access == "Admin , User"
    ) {
      return d;
    }
  });

  const canUser = items.filter((d) => {
    if (d.access == undefined || d.access == "Admin , User") {
      return d;
    }
  });

  return (
    <>
      <Row justify={"center"} align="middle" style={{ margin: 16 }}>
        {collapsed === true ? (
          <Image src={LogoImg} preview={false} height={40} />
        ) : (
          <>
            <Image src={LogoImg2} preview={false} height={70} />
            {/* <span style={{ color: "white", fontSize: "14pt" }}>VATAYA STT</span> */}
          </>
        )}
      </Row>
      {/* <Row> */}
      {/* <div style={{width:"500"}}  > */}
      <Menu
        defaultSelectedKeys={[`${location.pathname}`]}
        // defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        items={
          auth.user.role == "Super Admin"
            ? canSuper
            : auth.user.role == "Admin"
            ? canAdmin
            : canUser
        }
        onClick={navigatePath}
      />
    </>
  );
};

export default Sidebar;
