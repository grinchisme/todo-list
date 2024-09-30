import React, { useEffect } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import { Layout, Menu, Spin } from "antd";
import {
  EyeFilled,
  CheckCircleFilled,
  ClockCircleFilled,
  FlagFilled,
} from "@ant-design/icons";
import { useTodoStore } from "./store/useTodoStore";
import "antd/dist/reset.css";
import styles from "./styles/App.module.css";
const App: React.FC = () => {
  const [filter, setFilter] = React.useState("all");
  const { fetchTodos, loading } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <Layout>
      <Layout.Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["all"]}
          onClick={(e) => setFilter(e.key)}
          className={styles.menu}
        >
          <Menu.Item key="all" icon={<EyeFilled />} className={styles.menuItem}>
            Все
          </Menu.Item>
          <Menu.Item
            key="completed"
            icon={<CheckCircleFilled />}
            className={styles.menuItem}
          >
            Выполненные
          </Menu.Item>
          <Menu.Item
            key="notCompleted"
            icon={<ClockCircleFilled />}
            className={styles.menuItem}
          >
            Невыполненные
          </Menu.Item>
          <Menu.Item
            key="favorites"
            icon={<FlagFilled />}
            className={styles.menuItem}
          >
            Избранное
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <div className={styles.addtodoContainer}>
        <h1 style={{ fontSize: 30 }}>TODO</h1>
        <AddTodo />
      </div>

      <Layout.Content className={styles.layoutContent}>
        <div
          id="scrollableDiv"
          style={{
            height: "400px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <TodoList filter={filter} />
            </>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default App;
