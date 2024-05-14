Простой файловый обменник
Простой файловый обменник представляет собой приложение, разработанное для обмена файлами между клиентами через веб-интерфейс. В этом репозитории содержатся исходный код серверной и клиентской частей приложения.

Особенности
Обмен файлами между клиентами через веб-интерфейс
Использует Node.js и Express на серверной стороне
Взаимодействие с базой данных PostgreSQL для хранения метаданных о файлах
Клиентская часть реализована с использованием React
Требования
Node.js (рекомендуемая версия 14.x)
Docker (опционально, для удобства развертывания)
Установка
Склонируйте репозиторий:
bash
Копировать код
git clone <URL репозитория>
cd файловый-обменник
Установите зависимости для сервера и клиента:
bash
Копировать код
cd server
npm install
cd ../client
npm install
Создайте базу данных PostgreSQL и настройте соединение в файле server/config/db.js.

Запустите сервер и клиент:

bash
Копировать код
cd server
npm start

cd ../client
npm start
По умолчанию, сервер запускается на порту 5000, а клиент на порту 3000. Откройте браузер и перейдите по адресу http://localhost:3000 для доступа к клиентскому приложению.
Использование
После запуска приложения, пользователи могут зарегистрироваться, войти в систему, загружать файлы, просматривать доступные файлы и скачивать их. Вся информация о загруженных файлах сохраняется в базе данных PostgreSQL.

Развитие проекта
Проект находится в стадии разработки и может быть расширен следующими функциями:

Улучшенная аутентификация и авторизация
Поддержка загрузки нескольких файлов одновременно
Реализация возможности обмена файлами между пользователями
Добавление функционала поиска и фильтрации файлов
Создание административной панели для управления пользователями и файлами
Лицензия
Этот проект лицензирован в соответствии с MIT License.
