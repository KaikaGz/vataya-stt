import { Button, Col, Row } from "antd";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "../component/Column";
// const Column = dynamic(() => import("../component/Column"), { ssr: false });
import "../component/styless.css";
const FormBot = (props: any) => {
  const initialColumns = {
    Dialog: {
      id: "Dialog",
      list: ["item 1", "item 2", "item 3"],
    },
    Bot: {
      id: "Bot",
      list: [],
    },
    // columnOrder:[]
  };
  const [columns, setColumns] = useState<any>(initialColumns);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, idx: any) => idx !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state: any) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_: any, idx: any) => idx !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state: any) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };
  return (
    <div className="w-100 h-100">
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
          Bot Setting: [name]
        </Col>
        <Col md={2}>
          {/* <Button
            className="w-100"
            type="primary"
            size="large"
            onClick={handleCreate}
          >
            สร้าง
          </Button> */}
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <div
            style={{
              display: "grid",
              //   gridTemplateColumns: "1fr 1fr",
              margin: "10vh auto",
              width: "80%",
              height: "80vh",
              gap: "8px",
            }}
          >
            <div className="column-drag ">
              <div>topic</div>
              <div className="column-drag-in"></div>
            </div>
          </div>
        </Col>
        <Col md={16}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                margin: "10vh auto",
                width: "80%",
                height: "80vh",
                gap: "8px",
              }}
            >
              {Object.values(columns).map((col: any) => (
                <Column col={col} key={col.id} />
              ))}
            </div>
          </DragDropContext>
        </Col>
      </Row>
    </div>
  );
};

export default FormBot;
