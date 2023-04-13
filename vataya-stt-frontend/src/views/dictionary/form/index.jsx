import { UndoOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Popconfirm, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderPage from "../../../components/HeaderPage";
import {
  api_createTransform,
  api_deleteTransformID,
  api_editTransformID,
  api_getDicID,
  api_getTransform,
  api_getTransformID,
} from "../../../services/dictionary";
import CreateDicForm from "../components/createDicForm";
import { io } from "socket.io-client";

const DictionaryForm = () => {
  const params = useParams();
  const columns = [
    {
      title: "original text",
      dataIndex: "txt_original",
      key: "txt_original",
      align: "center",
    },
    {
      title: "transform text",
      dataIndex: "txt_transform",
      key: "txt_transform",
      align: "center",
    },
    // {
    //   title: "NO. of Dictionary",
    //   dataIndex: "no_dialog",
    //   key: "org",
    //   align: "center",
    // },
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
                onClick={() => onClickEdit(row.txt_id)}
              >
                Edit
              </Button>
            </Col>
            <Col md={12}>
              <Popconfirm
                title="Are you sure？"
                onConfirm={() => handleDelete(row.txt_id)}
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
  const columns2 = [
    {
      title: "transform text",
      dataIndex: "txt_transform",
      key: "txt_transform",
      align: "center",
    },
    // {
    //   title: "NO. of Dictionary",
    //   dataIndex: "no_dialog",
    //   key: "org",
    //   align: "center",
    // },
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
                onClick={() => onClickEdit(row.txt_id)}
              >
                Edit
              </Button>
            </Col>
            <Col md={12}>
              <Popconfirm
                title="Are you sure？"
                onConfirm={() => handleDelete(row.txt_id)}
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
  const [typeData, setTypeData] = useState(null);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [onEdit, setOnEdit] = useState(false);
  const [txtID, setTxtID] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getData = async () => {
    try {
      const res = await api_getDicID(params.id);
      setData(res.data[0]);
      setTypeData(res.data[0].type);
    } catch (e) {
      console.error(e);
    }
  };

  const getDataList = async () => {
    try {
      setIsLoading(true);
      const result = {
        page: page,
        size: pageSize,
        order_by: [],
        query: {},
        dic_id: params.id,
      };
      const resData = await api_getTransform(result);
      setDataSource(resData.data);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const onClickCreate = (data) => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreate = async (data) => {
    try {
      const result = {
        text_original: data.original_text || null,
        text_tranform: data.transform_text,
        dic_id: params.id,
      };

      const res = await api_createTransform(result);
      getDataList();
    } catch (e) {
      console.error(e);
    }
  };

  const onClickEdit = async (id) => {
    try {
      console.log("edit test:", id);
      const res = await api_getTransformID(id);
      console.log(res);
      if (res.data) {
        form.setFieldsValue({
          original_text: res.data[0].txt_original,
          transform_text: res.data[0].txt_transform,
        });
        setTxtID(id);
      }
      setIsModalVisible(true);
      setOnEdit(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (data) => {
    try {
      console.log("edit:", data);

      const result = {
        txt_id: txtID,
        txt_original: data.original_text,
        txt_transform: data.transform_text,
      };

      const res = await api_editTransformID(result);
      getDataList();

      setOnEdit(false);
    } catch (e) {
      console.error(e);
      setOnEdit(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api_deleteTransformID(id);
      getDataList();
    } catch (e) {
      console.error(e);
    }
  };

  const socketTest = () => {
    const socket = io("http://localhost:6005", {
      reconnection: false,
    });
    socket.on("connect", (d) => {
      console.log("connect fontend", d);
    });
    socket.on("connect_error", (err) => {
      console.log("socket connected error --> " + err);
    });
  };
  useEffect(() => {
    getData();
    getDataList();
    socketTest();
  }, []);

  return (
    <div className="w-100 h-100">
      <CreateDicForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        form={form}
        onCreate={handleCreate}
        dicType={typeData}
        onEdit={onEdit}
        handleEdit={handleEdit}
        setOnEdit={setOnEdit}
      />
      <HeaderPage
        onClickCreate={onClickCreate}
        labelName={`Dictionary : ${data.dic_name}`}
      />
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
            rowKey="txt_id"
            dataSource={dataSource}
            // columns={false ? [...checkStatus, ...columns] : columns}
            columns={
              typeData == "General words" || typeData == "Stop words"
                ? columns2
                : columns
            }
            // loading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DictionaryForm;
