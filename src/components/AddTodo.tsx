import React, { useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { Input, Button } from "antd";
import styles from "../styles/AddTodo.module.css";
import { PlusCircleFilled } from "@ant-design/icons";

const AddTodo: React.FC = () => {
  const [description, setDescription] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = async () => {
    if (description.trim()) {
      await addTodo(description);
      setDescription("");
    }
  };

  return (
    <div className={styles.container}>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Добавить описание задачи"
        style={{ marginBottom: 10, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleSubmit} icon={<PlusCircleFilled />}>
        Добавить
      </Button>
    </div>
  );
};

export default AddTodo;
