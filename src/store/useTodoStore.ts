import { create } from "zustand";
import { getTasks, addTask, deleteTask, updateTask } from "../api/taskApi";

export interface Todo {
  id: number;
  description: string;
  completed: boolean;
  favorite: boolean;
}

// Интерфейс для описания ответа от API при добавлении задачи
interface AddTaskResponse {
  id: number;
  attributes: {
    description: string;
    status: string;
  };
}

interface TodoStore {
  todos: Todo[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  fetchTodos: (page?: number) => Promise<void>;
  addTodo: (description: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => void;
}

// Функция для загрузки избранных задач из локального хранилища
const loadFavoritesFromLocalStorage = (): Todo[] => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

// Функция для сохранения избранных задач в локальном хранилище
const saveFavoritesToLocalStorage = (todos: Todo[]) => {
  const favorites = todos.filter((todo) => todo.favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: loadFavoritesFromLocalStorage(),
  page: 1,
  hasMore: true,
  loading: false,

  fetchTodos: async () => {
    const { page, todos } = get();
    set({ loading: true });

    try {
      const response = await getTasks(page);
      const tasks = response.data.map((task: any) => ({
        id: task.id,
        description: task.attributes.description,
        completed: task.attributes.status === "done",
        favorite: false,
      }));

      // Фильтруем задачи, чтобы избежать дубликатов
      const uniqueTasks = tasks.filter(
        (newTask) =>
          !todos.some((existingTask) => existingTask.id === newTask.id)
      );

      const { pageCount } = response.meta.pagination;

      set({
        todos: [...todos, ...uniqueTasks],
        page: page + 1,
        hasMore: page < pageCount,
        loading: false,
      });
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
      set({ loading: false });
    }
  },

  addTodo: async (description: string) => {
    // Проверка на уникальность перед добавлением
    const existingTodo = get().todos.find(
      (todo) =>
        todo.description.trim().toLowerCase() ===
        description.trim().toLowerCase()
    );
    if (existingTodo) {
      console.warn("Задача с таким описанием уже существует");
      return; // Не добавляем дубликат
    }

    try {
      // Указываем явно тип для newTask
      const newTask: AddTaskResponse = await addTask(description);
      const newTodo: Todo = {
        id: newTask.id,
        description: newTask.attributes.description,
        completed: newTask.attributes.status === "done",
        favorite: false,
      };

      set((state) => {
        const updatedTodos = [...state.todos, newTodo];
        saveFavoritesToLocalStorage(updatedTodos); // Обновляем локальное хранилище
        return { todos: updatedTodos };
      });
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  },

  deleteTodo: async (id: number) => {
    try {
      await deleteTask(id);
      set((state) => {
        const updatedTodos = state.todos.filter((todo) => todo.id !== id);
        saveFavoritesToLocalStorage(updatedTodos); // Обновляем локальное хранилище
        return { todos: updatedTodos };
      });
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  },

  toggleComplete: async (id: number) => {
    set((state) => {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        updateTask(id, updatedTodo.completed);
        return {
          todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
        };
      }
      return state;
    });
  },

  toggleFavorite: (id: number) => {
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, favorite: !todo.favorite } : todo
      );
      saveFavoritesToLocalStorage(updatedTodos); // Обновляем локальное хранилище
      return { todos: updatedTodos };
    });
  },
}));
