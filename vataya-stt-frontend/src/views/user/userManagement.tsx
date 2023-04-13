import { UndoOutlined } from "@ant-design/icons";
import userEvent from "@testing-library/user-event";
import { Button, Col, Form, Input, Popconfirm, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import HeaderPage from "../../components/HeaderPage";
import {
  api_createUser,
  api_deleteUser,
  api_editUserID,
  api_getTableUser,
  api_getUserID,
  api_resetPassword,
} from "../../services/user";
import { callNotification } from "../../utils/showNotification";
import FormUserManage from "./Form";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type Props = {};

const UserManagement = (props: Props) => {
  const checkStatus: any = [
    {
      title: "Status",
      dataIndex: "user_status",
      key: "status",
      align: "center",
      render: (status: any, row: any, ind: number) => {
        return (
          <Switch
            // checked={status == 1 ? true : false}
            defaultChecked={status == 1 ? true : false}
            onChange={handleChange}
          />
        );
      },
    },
  ];
  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Organization",
      dataIndex: "org_name",
      key: "org",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 200,
      render: (_: any, row: any) => {
        return (
          <Row justify="center" align="middle" gutter={16}>
            <Col md={12}>
              <Button
                type="text"
                className="action-edit"
                onClick={() => onClickEdit(row.user_id)}
              >
                Edit
              </Button>
            </Col>
            <Col md={12}>
              <Popconfirm
                title="Are you sure？"
                onConfirm={() => handleDelete(row)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="text" className="action-delete">
                  Delete
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        );
      },
    },
  ];
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(false);
  const [userID, setUserID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const getData = async (reload?: boolean) => {
    try {
      setIsLoading(true);
      const result = {
        page: page,
        size: pageSize,
        order_by: [],
        query: {},
      };
      const res = await api_getTableUser(result);
      if (res.success == true) {
        setDataSource(res.data);
        setIsLoading(false);
      } else if (res.code == "INVALID_AUTHORIZATION_CODE") {
        navigate("/login");
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onClickCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
    setEditData(false);
  };

  const handleCreate = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await api_createUser(data);
      if (res.success == true) {
        callNotification("success", "Create User", `${res.message}`);
        setIsLoading(false);
        getData();
      } else {
        callNotification("error", "Create User", `${res.message}`);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const onClickEdit = async (id: any) => {
    try {
      const res = await api_getUserID(id);
      if (res.data) {
        form.setFieldsValue(res.data[0]);
        setUserID(id);
      }
      setIsModalVisible(true);
      setEditData(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (data: any) => {
    try {
      setIsLoading(true);
      const result = {
        user_id: userID,
        ...data,
        user_status: 1,
      };
      const res = await api_editUserID(result);
      if (res.success == true) {
        callNotification("success", "Edit User", `${res.message}`);
        getData();
        setIsLoading(false);
      } else {
        callNotification("error", "Edit User", `${res.message}`);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleDelete = async (dataUser: any) => {
    try {
      setIsLoading(true);
      const res = await api_deleteUser(dataUser);
      if (res.success == true) {
        callNotification("success", "Delete User", `${res.message}`);
        getData();
      } else if (res.success == false) {
        callNotification("error", "Delete User", `${res.message}`);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const result = {
        user_id: userID,
      };
      const res = await api_resetPassword(result);
      if (res.success == true) {
        callNotification("success", "Reset Password User", `${res.message}`);
        setIsModalVisible(false);
        setIsLoading(false);
      } else {
        callNotification("error", "Reset Password User", `${res.message}`);
        setIsModalVisible(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsModalVisible(false);
      setIsLoading(false);
    }
  };

  const handleChange = (check: boolean) => {};

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-100 h-100">
      <FormUserManage
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onCreate={handleCreate}
        form={form}
        editData={editData}
        onEdit={handleEdit}
        handleResetPassword={handleResetPassword}
      />
      <HeaderPage onClickCreate={onClickCreate} labelName={"User"} />
      <Row
        className="mt-1"
        style={{
          padding: "2rem 4rem",
        }}
      >
        <Col
          md={24}
          style={{
            background: "white",
            height: "80px",
            boxShadow: "0px 0px 5px #0000000A",
            borderRadius: "10px",
          }}
        >
          <Row
            className="w-100 h-100"
            justify="space-between"
            align="middle"
            style={{ paddingLeft: "2rem" }}
            gutter={16}
          >
            <Col md={10}>
              <Row className="w-100 h-100">
                <Col md={20}>
                  <Input className="w-100" size="large" placeholder="ค้นหา" />
                </Col>
              </Row>
            </Col>

            <Col md={10}>
              <Row className="w-100 h-100" justify="end" gutter={16}>
                <Col md={8}>
                  <Button className="w-100" size="large" type="primary">
                    ค้นหา
                  </Button>
                </Col>
                <Col md={4}>
                  <Button
                    className="w-100"
                    size="large"
                    type="default"
                    onClick={() => getData(true)}
                  >
                    <UndoOutlined />
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          md={24}
          className="mt-2"
          style={{
            background: "white",
            boxShadow: "0px 0px 5px #0000000A",
            borderRadius: "10px",
          }}
        >
          <Table
            rowKey="user_id"
            dataSource={dataSource}
            columns={false ? [...checkStatus, ...columns] : columns}
            loading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserManagement;
