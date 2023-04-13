import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const items = [
  {
    label: "User",
    key: "/user",
    icon: <MailOutlined />,
    path: "/user",
    access: "Super Admin , Admin",
  },
  {
    label: "Model",
    key: "/model",
    icon: <AppstoreOutlined />,
    path: "/model",
    access: "Admin",
    // disabled: true,
  },
  {
    label: "Organizaion",
    key: "org",
    icon: <AppstoreOutlined />,
    path: "/organizaion",
    access: "Super Admin",
    // disabled: true,
  },
  {
    label: "Task",
    key: "/task",
    icon: <AppstoreOutlined />,
    path: "/task",
    access: "Admin , User",
    // disabled: true,
  },
  {
    label: "Dictionary",
    key: "/dictionary",
    icon: <AppstoreOutlined />,
    path: "/dictionary",
    access: "Admin",
    // disabled: true,
  },
  //   {
  //     label: "Navigation Three - Submenu",
  //     key: "SubMenu",
  //     icon: <SettingOutlined />,
  //     children: [
  //       {
  //         type: "group",
  //         label: "Item 1",
  //         children: [
  //           {
  //             label: "Option 1",
  //             key: "setting:1",
  //           },
  //           {
  //             label: "Option 2",
  //             key: "setting:2",
  //           },
  //         ],
  //       },
  //       {
  //         type: "group",
  //         label: "Item 2",
  //         children: [
  //           {
  //             label: "Option 3",
  //             key: "setting:3",
  //           },
  //           {
  //             label: "Option 4",
  //             key: "setting:4",
  //           },
  //         ],
  //       },
  //     ],
  //   },
];
