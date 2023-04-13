import { Card, Checkbox, Col, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "../component/styless.css";
// import Column from "../component/Column";
import Column from "../component/Column_new";
import { api_getDialog, api_getTopic } from "../../../services/topic";
import { api_getDic, api_getModel } from "../../../services/dictionary";
const dataMock = [
  { id: 1, name: `General words` },
  { id: 2, name: `Transform words` },
  { id: 3, name: `Abbreviation words` },
  { id: 4, name: `Stop words` },
];

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.list);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    list: newTaskIds,
  };

  return newColumn;
};

const FormBot = (props) => {
  const initialData = {
    data: [],
    columns: {
      Dictionary: {
        id: "Dictionary",
        list: [],
      },
      Model: {
        id: "Model",
        list: [],
      },
    },
    columnDialog: ["Dictionary", "Model"],
  };
  const [data, setData] = useState(initialData);
  const [topic, setTopic] = useState([]);
  const [selectTopic, setSelectTopic] = useState([]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different positoin
    const sourceCol = data.columns[source.droppableId];
    const destinationCol = data.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.list);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      list: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.list);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      list: endTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };
    setData(newState);
  };

  const onLaunch = async () => {
    try {
      console.log("Launch", data.columns.Model.list);
      const result = {
        model: data.columns.Model.list,
      };
      const res = await api_getModel(result);
      console.log("get data model", res);
      const setData = {
        wordArr: res.data
          .filter((d) => d.type == "General words")
          .map((d) => {
            return d.txt_transform;
          }),
        tranArr: res.data
          .filter((d) => d.type == "Transform words")
          .map((d) => {
            return [d.txt_original, d.txt_transform];
          }),
        abbrArr: res.data
          .filter((d) => d.type == "Abbreviation words")
          .map((d) => {
            return [d.txt_original, d.txt_transform];
          }),
        stopArr: res.data
          .filter((d) => d.type == "Stop words")
          .map((d) => {
            return d.txt_transform;
          }),
      };
      console.log("result data", setData);
    } catch (e) {
      console.error(e);
    }
    // const result = data.columns.Model.list.map((id) => {
    //   const test = data.data.filter((d) => {
    //     if (d.dic_id == id) {
    //       return d;
    //     }
    //   });
    //   console.log("test", test);
    //   return test[0];
    // });
    // console.log("result", result);
    // const { test } = result;
    // const myObj = JSON.stringify(result);
    // console.log("myObj", myObj);
  };

  const dataDialog = async (id) => {
    const filterData = data.data.filter((d) => {
      if (d.type == id) {
        return d;
      }
    });

    const newData = filterData.map((d) => {
      return d.dic_id;
    });

    const result = {
      Dictionary: {
        id: "Dictionary",
        list: newData,
      },
      Model: {
        id: "Model",
        list: [],
      },
    };
    setData({ ...data, columns: result });
    // setSelectTopic([...selectTopic, id]);
  };

  const getData = async () => {
    // const res = await api_getTopic();
    // const res = await api_getDic();
    // setTopic(res.data);
  };

  const getDialog = async () => {
    const res = await api_getDic();
    console.log("Res Dialog", res);
    const newData = res.data.map((d) => {
      return d.dic_id;
    });
    const result = {
      columns: {
        Dictionary: {
          id: "Dictionary",
          list: newData,
        },
        Model: {
          id: "Model",
          list: [],
        },
      },
      columnDialog: ["Dictionary", "Model"],
    };
    setData({ ...result, data: res.data });
  };

  useEffect(() => {
    getData();
    getDialog();
  }, []);

  return (
    <div className="w-100 h-100">
      <DragDropContext onDragEnd={onDragEnd}>
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
            Model : [name]
          </Col>
          <Col md={2}></Col>
        </Row>
        <Row
          justify="space-between"
          style={{ height: "800px", padding: "3rem 4rem" }}
          //   gutter={32}
        >
          <Col
            sm={8}
            md={6}
            style={{
              height: "100%",
              padding: "0 1rem",
            }}
          >
            <Card className="h-100" title="Topic" bordered={false}>
              <Row>
                <Col md={24}>
                  <Input placeholder="Search topic..." />
                </Col>
              </Row>
              <Row
                className="mt-1 topic-content"
                style={{ height: "500px", paddingLeft: "15px" }}
                md={24}
                gutter={[0, 16]}
                justify="center"
              >
                <Col md={24}>
                  {dataMock.map((d) => {
                    return (
                      //   <Row key={d.topic_id} md={24} style={{ width: "100%" }}>
                      //     <div
                      //       style={{
                      //         background: "red",
                      //         border: "solid red 1px",
                      //         height: "42px",
                      //         borderRadius: "8px",
                      //         cursor: "pointer",
                      //         width: "100%",
                      //         marginBottom: "5px",
                      //       }}
                      //       onClick={() => dataDialog(d.topic_id)}
                      //     >
                      //       {d.topic_name}
                      //     </div>
                      //   </Row>
                      <div key={d.id}>
                        <Checkbox
                          defaultChecked={false}
                          onChange={() => dataDialog(d.name)}
                        >
                          {d.name}
                        </Checkbox>
                        <br />
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Card>
          </Col>
          {data.columnDialog.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.list.map((taskId) => {
              const newData = data.data.filter((d) => d.dic_id == taskId);
              return { id: newData[0].dic_id, content: newData[0].dic_name };
            });
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onLaunch={onLaunch}
              />
            );
          })}
        </Row>
      </DragDropContext>
    </div>
  );
};

export default FormBot;
