import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Список текстовых форматов, которые нужно обрабатывать
const textFileExtensions = /\.(txt|md|js|ts|json|html|css|env|yml|yaml)$/i;

// Функция чтения директории
const readDirectory = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("❌ Ошибка чтения директории:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`❌ Ошибка получения информации о файле ${file}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          readDirectory(filePath);
        } else {
          const isTextFile = textFileExtensions.test(file) || file.startsWith(".env");

          if (isTextFile) {
            console.log(`📜 ${file}`);

            try {
              const content = fs.readFileSync(filePath, "utf8");
              console.log("🔍 Содержимое:");
              console.log(content.substring(0, 5000)); // Ограничиваем вывод 5000 символами
              console.log("—".repeat(50));
            } catch (error) {
              console.error(`❌ Ошибка чтения файла ${file}:`, error.message);
            }
          } else {
            console.log(`📁 Бинарный файл (не читаем): ${file}`);
          }
        }
      });
    });
  });
};

// Читаем пути из файла
const readDirectoriesFromFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Ошибка чтения файла с путями:", err);
      return;
    }

    const directories = data.split("\n").map((line) => line.trim()).filter(Boolean);

    directories.forEach((dirOrFile) => {
      fs.stat(dirOrFile, (err, stats) => {
        if (err) {
          console.error("❌ Ошибка получения информации о пути:", err);
          return;
        }

        if (stats.isDirectory()) {
          console.log(`📂 Обрабатываем директорию: ${dirOrFile}`);
          readDirectory(dirOrFile);
        } else if (stats.isFile()) {
          const isTextFile = textFileExtensions.test(dirOrFile) || dirOrFile.startsWith(".env");
          console.log(`📜 ${dirOrFile}`);

          if (isTextFile) {
            try {
              const content = fs.readFileSync(dirOrFile, "utf8");
              console.log("🔍 Содержимое:");
              console.log(content.substring(0, 5000)); // Ограничиваем вывод 5000 символами
              console.log("—".repeat(50));
            } catch (error) {
              console.error(`❌ Ошибка чтения файла ${dirOrFile}:`, error.message);
            }
          } else {
            console.log(`📁 Бинарный файл (не читаем): ${dirOrFile}`);
          }
        }
      });
    });
  });
};

// Читаем список директорий из файла dirs.txt
const directoriesFile = "dirs.txt";
readDirectoriesFromFile(directoriesFile);
