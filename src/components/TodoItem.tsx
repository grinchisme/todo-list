import React from "react";
import { Checkbox, Button } from "antd";
import { useTodoStore, Todo } from "../store/useTodoStore";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleComplete, deleteTodo, toggleFavorite } = useTodoStore();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: "10px",
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        style={{ marginRight: 10 }}
      />
      <span style={{ flex: 1, width: 400 }}>{todo.description}</span>{" "}
      <Button
        onClick={() => deleteTodo(todo.id)}
        type="primary"
        danger
        style={{ marginRight: 10 }}
      >
        Удалить
      </Button>
      <Button
        color="primary"
        variant="dashed"
        onClick={() => toggleFavorite(todo.id)}
        type="link"
      >
        {todo.favorite ? "Убрать из избранного" : "Добавить в избранное"}
      </Button>
    </div>
  );
};

export default TodoItem;
