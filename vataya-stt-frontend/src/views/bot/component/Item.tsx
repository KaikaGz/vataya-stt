import React from "react";
import { Draggable } from "react-beautiful-dnd";
// import { styled } from "../stiches.config";
interface ItemProps {
  text: string;
  index: number;
}
const Item: React.FC<ItemProps> = ({ text, index }) => {
  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <div
          className="item-drag"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {text}
        </div>
      )}
    </Draggable>
  );
};

export default Item;
