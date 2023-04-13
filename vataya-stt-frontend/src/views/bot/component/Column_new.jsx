import { Button, Card, Col, Row } from "antd";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import "./styless.css";

const Column_new = ({ column, tasks, onLaunch }) => {
  return (
    <Col
      sm={8}
      md={9}
      style={{
        height: "100%",
        padding: "0 1rem",
      }}
    >
      <Card
        className="h-100"
        title={column.id}
        actions={
          column.id == "Model" && [<div onClick={onLaunch}>Launch</div>, "Save"]
        }
        // className="Dialog-content"
        bordered={false}
      >
        <div
          className="Dialog-content"
          style={column.id == "Bot" ? { height: "495px" } : { height: "550px" }}
        >
          <Droppable droppableId={column.id}>
            {(droppableProvided, droppableSnapshot) => (
              <Col
                md={24}
                style={{ height: "500px" }}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={`${task.id}`}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <Row
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <div
                          style={
                            column.id == "Model"
                              ? {
                                  background: "#c1e87dcc",
                                  padding: "10px 24px",
                                  borderRadius: "8px",
                                  width: "100%",
                                  margin: "6px 0",
                                }
                              : {
                                  background: "#3f8dc4b3",
                                  padding: "10px 24px",
                                  borderRadius: "8px",
                                  width: "100%",
                                  margin: "6px 0",
                                }
                          }
                        >
                          {task.content}
                        </div>
                      </Row>
                    )}
                  </Draggable>
                ))}
              </Col>
            )}
          </Droppable>
        </div>
      </Card>
    </Col>
  );
};

export default Column_new;

{
  /* <>
            {tasks.map((task, index) => {
              return (
                <Col
                  md={24}
                  style={{
                    //   background: "red",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "1px 1px 5px 1px #888888",
                  }}
                  // ref={draggableProvided.innerRef}
                  // {...draggableProvided.draggableProps}
                  // {...draggableProvided.dragHandleProps}
                >
                  {task.content}
                </Col>
              );
            })}
          </> */
}
