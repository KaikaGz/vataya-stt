import React from "react";
import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className="column-drag">
          <h2>{id}</h2>
          <div
            className="column-drag-in"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
