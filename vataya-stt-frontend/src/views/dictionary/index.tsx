import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Popconfirm, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { UndoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../../components/HeaderPage";
import CreateForm from "./components/createForm";
import { api_createDic, api_getDicList } from "../../services/dictionary";

type Props = {};

const DictionaryPage = (props: Props) => {
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "dic_name",
      key: "dic_name",
      align: "center",
    },
    {
      title: "NO. of Dictionary",
      dataIndex: "no_of_dic",
      key: "org",
      align: "center",
    },
    {
      title: "type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "edit_date",
      dataIndex: "edit_date",
      key: "edit_date",
      align: "center",
    },
    {
      title: "edit_by",
      dataIndex: "edit_by",
      key: "edit_by",
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
                onClick={() => navigate(`/dictionary/${row.dic_id}`)}
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
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const handleDelete = (data: any) => {};
  const onClickCreate = (data: any) => {
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleCreate = async (data: any) => {
    try {
      const res = await api_createDic(data);
      console.log("create dic", res);
      getData();
    } catch (e) {
      console.error(e);
    }
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = {
        page: page,
        size: pageSize,
        order_by: [],
        query: {},
      };
      const res = await api_getDicList(result);
      console.log("dic data table:", res.data);
      setDataSource(res.data);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-100 h-100">
      <CreateForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onCreate={handleCreate}
        form={form}
      />
      <HeaderPage onClickCreate={onClickCreate} labelName={"Dictionary"} />

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
            rowKey="dic_id"
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

export default DictionaryPage;
