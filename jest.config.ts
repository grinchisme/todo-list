module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Используйте jsdom для тестирования компонентов React
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy", // Мокаем CSS модули
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Подключаем файл с настройками для тестов
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Обработка файлов .js и .jsx
    "^.+\\.tsx?$": "ts-jest", // Обработка файлов .ts и .tsx
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Игнорируем папки с зависимостями и сборкой
};
