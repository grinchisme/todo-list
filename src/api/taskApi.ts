import axios, { AxiosError } from "axios";

const API_URL = "https://cms.laurence.host/api";
const TOKEN =
  "14559a59b7d0d3df78e13cf68027a1c028582383475c344a8829133310c211d35462b185d2c60a3a37aeda75cc955cdbca104bec98b6fee88628244d82bf8bc8215d78e878b4b84d8d24a2e3e486f241d9e0285455b624d560b0068b882ba96d964e9271c6b57ff505ca4e28f3bc429d0bb7bd9f092ef233a3268b1b84bbbe0c"; // Вставь свой ключ

const apiWithAuth = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const getTasks = async (page: number = 1) => {
  try {
    const response = await apiWithAuth.get(`/tasks?pagination[page]=${page}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Ошибка при получении задач:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError;
  }
};

export const addTask = async (description: string) => {
  try {
    const response = await apiWithAuth.post("/tasks", {
      data: {
        description,
        status: "open",
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Ошибка при добавлении задачи:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError;
  }
};

export const updateTask = async (id: number, completed: boolean) => {
  try {
    const status = completed ? "done" : "open";
    const response = await apiWithAuth.put(`/tasks/${id}`, {
      data: { status },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Ошибка при обновлении задачи:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError;
  }
};

export const deleteTask = async (id: number) => {
  try {
    await apiWithAuth.delete(`/tasks/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Ошибка при удалении задачи:",
      axiosError.response?.data || axiosError.message
    );
    throw axiosError;
  }
};
