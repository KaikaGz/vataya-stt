import { UndoOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Popconfirm, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import HeaderPage from "../../components/HeaderPage";
import {
  api_createOrgID,
  api_editOrgID,
  api_getAllOrgList,
  api_getOrgID,
  api_updateSatus,
} from "../../services/organization";
import { callNotification } from "../../utils/showNotification";
import FormUserManage from "./Form";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type Props = {};

const Organization = (props: Props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: any, row: any, ind: number) => {
        return (
          <Switch
            // checked={status == 1 ? true : false}
            defaultChecked={status == 1 ? true : false}
            onChange={(e) => handleChange(e, row)}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "org_name",
      key: "name",
      align: "center",
    },
    {
      title: "Create by",
      dataIndex: "create_by",
      key: "email",
      align: "center",
    },
    {
      title: "Create date",
      dataIndex: "create_date",
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
                onClick={() => onClickEdit(row.org_id)}
              >
                Edit
              </Button>
            </Col>
            {/* <Col md={12}>
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
            </Col> */}
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
  const [orgID, setOrgID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = {
        page: page,
        size: pageSize,
        order_by: [],
        query: {},
      };
      const res = await api_getAllOrgList(result);
      if (res.success == true) {
        setDataSource(res.data);
        setIsLoading(false);
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
      const res = await api_createOrgID(data);
      if (res.success == true) {
        callNotification("success", "Create Organization", `${res.message}`);
        setIsLoading(false);
        getData();
      } else {
        callNotification("error", "Create Organization", `${res.message}`);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const onClickEdit = async (id: any) => {
    try {
      console.log("id", id);
      const res = await api_getOrgID(id);
      if (res.data) {
        form.setFieldsValue(res.data[0]);
        setOrgID(id);
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
        org_id: orgID,
        ...data,
        user_status: 1,
      };
      const res = await api_editOrgID(result);
      if (res.success == true) {
        callNotification("success", "Edit Organization", `${res.message}`);
        getData();
        setIsModalVisible(false);
        setIsLoading(false);
      } else {
        callNotification("error", "Edit Organization", `${res.message}`);
        setIsModalVisible(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsModalVisible(false);
      setIsLoading(false);
    }
  };

  const handleChange = async (check: boolean, row: any, test?: any) => {
    const result = {
      ...row,
      status: check == true ? 1 : 0,
    };
    console.log("result", result);
    const res = await api_updateSatus(result);
    if (res.success == true) {
      getData();
    } else {
    }
  };

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
      />
      <HeaderPage onClickCreate={onClickCreate} labelName={"Organization"} />
      <Row
        className="mt-1"
        style={{
          padding: "2rem 4rem",
        }}
      >
        <Col
          sm={24}
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
            gutter={{ sm: 8, md: 16 }}
          >
            <Col sm={12} md={8}>
              <Row className="w-100 h-100">
                <Col sm={24} md={20}>
                  <Input className="w-100" size="large" placeholder="ค้นหา" />
                </Col>
              </Row>
            </Col>

            <Col sm={16} md={10}>
              <Row className="w-100 h-100" justify="end" gutter={16}>
                <Col sm={20} md={8}>
                  <Button className="w-100" size="large" type="primary">
                    ค้นหา
                  </Button>
                </Col>
                <Col sm={6} md={4} style={{ maxWidth: "100%" }}>
                  <Button
                    className="w-100"
                    style={{ width: "100%", maxWidth: "100%" }}
                    size="large"
                    type="default"
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
            rowKey="org_id"
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Organization;
