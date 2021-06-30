# gdmn-webservice

### Установка

1. Установить Node.js, yarn.

2. Установить репозиторий (https://github.com/gsbelarus/gdmn-webservice/tree/Inventory-honeywell-reader - для Инвентаризации): 
    ```bash
    $ git clone https://github.com/gsbelarus/gdmn-webservice/tree/Inventory-honeywell-reader
    $ cd server
    $ yarn
    $ cd web-interface
    $ yarn    
    ```
### Запуск сервера

1. Копировать файл конфигурации (`./server/config/dev.sample`) в эту же папку и переименовать его в `./server/config/prod.ts`.
2. Заполнить параметры в этом файле.
3. Выполнить команду из папки `./server`.
    ```bash 
    $ yarn start
    ```
4. Подождать инициализацию 

### Запуск web-interface

1. Выполнить команду из папки `./web-service`.
    ```bash 
    $ yarn start
    ```
2. Подождать инициализацию 
3. В запустившемся окне браузера `...`:
  1. Зарегистрировать пользователя Administrator с паролем 1.
  2. Войти под пользователем Administrator
  3. Создать организацию 

### Установка ПИ 

1. Скачать ПИ `https://github.com/GoldenSoftwareLtd/gedemin-apps/tree/master/Web-services`.
2. Установить пакет на базу данных (`GS.Web.Web-services.Конфигурация.Инвентаризация`)
3. Настроить параметры

### Установка приложения на устройство

1. Скачать файл apk на устройство.
2. Установить
3. Запустить

