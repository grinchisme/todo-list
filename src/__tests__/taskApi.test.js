// src/__tests__/taskApi.test.js

const axios = require("axios"); // Импортируем axios
jest.mock("axios"); // Мокаем axios

const { getTasks } = require("../api/taskApi"); // Импортируем функцию getTasks

describe("taskApi", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Очищаем моки после каждого теста
  });

  test("fetches tasks successfully", async () => {
    const mockTasks = {
      data: {
        data: [
          {
            id: 1,
            attributes: {
              description: "Test Task",
              status: "open",
            },
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageCount: 1,
            pageSize: 10,
            total: 1,
          },
        },
      },
    };

    // Мокируем успешный ответ от axios
    axios.get.mockResolvedValue(mockTasks);

    const response = await getTasks(1); // Вызов функции
    console.log("Response:", response); // Добавляем вывод для отладки

    expect(response).toEqual(mockTasks.data); // Проверяем, что ответ совпадает с мокированным
    expect(axios.get).toHaveBeenCalledWith("/tasks?pagination[page]=1"); // Проверяем вызов axios
  });

  test("handles errors correctly", async () => {
    const errorMessage = "Network Error";
    axios.get.mockRejectedValue(new Error(errorMessage)); // Мокируем ошибку

    try {
      await getTasks(1);
    } catch (error) {
      console.error("Caught error:", error.message); // Добавляем вывод для отладки
      expect(error.message).toBe(errorMessage); // Проверяем сообщение об ошибке
    }

    expect(axios.get).toHaveBeenCalledWith("/tasks?pagination[page]=1"); // Проверяем вызов axios
  });
});
