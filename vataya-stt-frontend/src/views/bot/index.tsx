import React, { useState } from "react";
import { Button, Col, Form, Input, Popconfirm, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { UndoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Props = {};

const TopicPage = (props: Props) => {
  const columns: ColumnsType<any> = [
    {
      title: "Model Name",
      dataIndex: "fullname",
      key: "name",
      align: "center",
    },
    {
      title: "Codename",
      dataIndex: "codename",
      key: "email",
      align: "center",
    },
    {
      title: "NO. of Dictionary",
      dataIndex: "no_dialog",
      key: "org",
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
                onClick={() => navigate(`/model/${row.user_id}`)}
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
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([
    { user_id: 1, fullname: "test", codename: "test", no_dialog: "test" },
  ]);
  const navigate = useNavigate();

  const handleEdit = (data: any) => {};
  const handleDelete = (data: any) => {};
  return (
    <div className="w-100 h-100">
      {/* <FormUserManage
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onCreate={handleCreate}
        form={form}
        editData={editData}
        onEdit={handleEdit}
        handleResetPassword={handleResetPassword}
      /> */}
      <Row
        style={{
          height: "60px",
          boxShadow: "0px 1px 5px #00000029",
          background: "white",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
        align="middle"
        justify="space-between"
      >
        <Col
          style={{
            fontSize: "24pt",
          }}
        >
          Model
        </Col>
        <Col md={2}>
          <Button
            className="w-100"
            type="primary"
            size="large"
            // onClick={handleCreate}
          >
            สร้าง
          </Button>
        </Col>
      </Row>
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
                  <Button className="w-100" size="large" type="default">
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
            // columns={false ? [...checkStatus, ...columns] : columns}
            columns={columns}
            loading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TopicPage;
