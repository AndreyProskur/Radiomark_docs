---
title: UML диаграммы
sidebar_position: 3
description: UML-диаграммы платформы Radiomark – диаграмма прецедентов (Use Case) и диаграмма последовательности (Sequence) для процесса загрузки и разметки снимков.
---

# UML диаграммы Radiomark

## Диаграмма прецедентов (Use Case Diagram)

На диаграмме показаны основные действующие лица платформы и их ключевые сценарии использования.

```plantuml
@startuml
left to right direction

actor "Врач-рентгенолог" as Doctor
actor "Студент" as Student
actor "Пациент" as Patient
actor "Администратор платформы" as Admin

package "Платформа Radiomark" {

  usecase "Загрузить медицинский снимок" as UC1
  usecase "Разметить снимок и добавить описание снимка" as UC2
  usecase "Просмотреть снимок" as UC3
  usecase "Тренировать навыки разметки и описания снимков" as UC4
  usecase "Создать заявку на диагностику" as UC5
  usecase "Посмотреть свою заявку" as UC6
  usecase "Управлять пользователями" as UC7
  usecase "Проводить модерацию снимка" as UC8
  usecase "Получить уведомление\nо новом снимке" as UC9
  usecase "Отправить снимок на доработку" as UC10
}

Doctor --> UC1
Doctor --> UC3

Student --> UC3
Student --> UC4

Patient --> UC5
Patient --> UC6

Admin --> UC7
Admin --> UC8
Admin --> UC9

UC1 ..> UC2: extend
UC5 ..> UC1: include
UC8 ..> UC10: extend

@enduml
```
## Диаграмма последовательности: Загрузка и разметка снимка врачом

На диаграмме показано взаимодействие между врачом, фронтендом, бэкендом, базой данных и администратором в процессе загрузки, разметки и сохранения медицинского снимка.

```plantuml
@startuml
title Sequence Diagram: Загрузка и разметка снимка врачом-рентгенологом

actor "Врач-рентгенолог" as Doctor
participant "Frontend (Web интерфейс)" as Front
participant "Backend сервис" as Back
database "База данных снимков" as DB
actor "Администратор платформы" as Admin

== Загрузка снимка ==

Doctor -> Front: Открыть форму загрузки
activate Front
Front -> Back: Запрос формы загрузки
activate Back
Back --> Front: Данные формы загрузки
deactivate Back
Front --> Doctor: Отобразить форму
deactivate Front

Doctor -> Front: Выбрать файл снимка
activate Front
Front -> Back: Отправить файл
activate Back

Back -> Back: Проверить формат и размер файла

alt Файл валиден
    Back --> Front: Файл принят + данные интерфейса разметки
    Front --> Doctor: Открыть инструменты разметки

else Файл невалиден
    Back --> Front: Ошибка валидации (формат/размер)
    deactivate Back
    Front --> Doctor: Показать сообщение об ошибке
deactivate Front
end


== Разметка и описание снимка ==

Doctor -> Front: Добавить/изменить элемент разметки
activate Front
Front -> Front: Обновить отображение
Front --> Doctor: Разметка сохранена

Doctor -> Front: Ввести или изменить описание снимка
Front -> Front: Обновить данные формы
Front --> Doctor: Описание сохранено
deactivate Front

== Сохранение снимка ==

Doctor -> Front: Сохранить снимок
activate Front
Front -> Back: Отправить файл, разметку и описание
activate Back
Back -> Back: Валидировать данные

alt Обязательные поля заполнены
    Back -> DB: Сохранить снимок и метаданные
    DB --> Back: ID снимка
    Back --> Front: Подтверждение сохранения
    Front --> Doctor: Снимок успешно сохранён
    Back -> Admin: Уведомление о новом снимке

else Есть незаполненные поля
    Back --> Front: Ошибка валидации данных
    deactivate Back
    Front -> Front: Подсветить обязательные поля
    Front --> Doctor: Сообщение о необходимости заполнения
    deactivate Front
end

@enduml
```
