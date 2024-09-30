import React from "react";
import { useTodoStore } from "../store/useTodoStore";
import TodoItem from "./TodoItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";

interface TodoListProps {
  filter: string;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const { todos, loading, fetchTodos, hasMore } = useTodoStore();

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "completed":
        return todo.completed;
      case "notCompleted":
        return !todo.completed;
      case "favorites":
        return todo.favorite;
      default:
        return true;
    }
  });

  if (loading && todos.length === 0) {
    return <Spin />;
  }

  return (
    <InfiniteScroll
      dataLength={todos.length}
      next={fetchTodos}
      hasMore={hasMore}
      loader={<Spin />}
      scrollableTarget="scrollableDiv"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      ) : (
        <p>Задачи отсутствуют.</p>
      )}
    </InfiniteScroll>
  );
};

export default TodoList;
