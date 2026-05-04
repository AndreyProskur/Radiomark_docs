---
title: Модель данных (ERD)
sidebar_position: 5
description: ER-диаграммы платформы Radiomark – концептуальная, логическая и физическая модели данных.
---

# Модель данных (ERD)

ER-диаграммы описывают структуру данных платформы на трёх уровнях: от бизнес-сущностей до физической реализации в PostgreSQL.

## Концептуальная модель

На концептуальном уровне показаны основные бизнес-сущности и их связи без технических деталей. Диаграмма отражает ключевые роли (врач, пациент, студент, модератор) и основные объекты: заявка, медицинский снимок, разметка, заключение, отзыв, прогресс студента.

<details>
<summary>📊 Развернуть диаграмму</summary>

```plantuml
@startuml
title Концептуальная модель данных Radiomark

entity Doctor {}
entity Patient {}
entity Student {}
entity Admin {}

entity Case {}
entity MedicalImage {}
entity Annotation {}
entity MedicalConclusion {}
entity Review {}
entity StudentProgress {}

Doctor ||--o{ MedicalImage : "загружает, описывает, размечает"
Doctor ||--o{ Case : "берет в работу"
Doctor ||--o{ Annotation : "создаёт"
Doctor ||--o{ MedicalConclusion : "создаёт"

Patient ||--o{ Case : "создаёт"
Patient ||--o{ Review : "оставляет"

Student ||--o{ MedicalImage : "тренируется на"
Student ||--|| StudentProgress : "имеет"

Admin ||--o{ MedicalImage : "проверяет"

Case ||--|| MedicalImage : "содержит"
MedicalImage ||--o{ Annotation : "содержит"
Case ||--|| MedicalConclusion : "фиксируется"
Review |o--|| Case : "относится к"
@enduml
```
</details>


## Логическая модель

Логическая модель добавляет атрибуты, первичные и внешние ключи, а также справочники статусов и ролей. Здесь появляются таблицы для аудита изменений (история статусов) и разделение часто обновляемых данных (сессии пользователей). Модель нормализована и отражает все бизнес-правила.

<details>
<summary>📊 Развернуть диаграмму</summary>

```plantuml
@startuml
title Логическая модель данных Radiomark

entity User {
  * id : <<PK>>
  * idRole : <<FK>>
  --
  * firstName
  * lastName
  * contacts <<UNIQUE>>
  description
  certificateUrl <<UNIQUE, Nullable>>
  login <<UNIQUE>>
  password
}

entity UserRole {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
}

entity UserSession {
  * idUser <<PK, FK>>
  --
  lastLogin
  lastLogout
}

entity Case {
  * id <<PK>>
  * idPatient <<FK>>
  * idDoctor <<FK>>
  * idStatus <<FK>>
  --
  * fileUrl
  * priority (enum)
  * createdAt
  description
  finishedAt
}

entity CaseStatus {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
}

entity CaseStatusHistory {
  * id <<PK>>
  * idCase <<FK>>
  * idNewStatus <<FK>>
  * idOldStatus <<FK>>
  --
  * changedAt
  * changedBy
}

entity MedicalImage {
  * id <<PK>>
  * idDoctor <<FK>>
  * idStatus <<FK>>
  --
  * fileUrl
  * medicalData
  * description
  * conclusion
  returnReason
}

entity MedicalImageStatus {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
}

entity MedicalImageStatusHistory {
  * id <<PK>>
  * idMedicalImage <<FK>>
  * idNewStatus <<FK>>
  * idOldStatus <<FK>>
  --
  * changedAt
  * changedBy
}

entity Annotation {
  * id <<PK>>
  * idMedicalImage <<FK>>
  --
  * coordinates
  * name
}

entity MedicalConclusion {
  * id <<PK>>
  * idCase <<FK>>
  --
  * conclusion
  * fileUrl
}

entity Review {
  * id <<PK>>
  * idCase <<FK>>
  --
  * rating
  description
}

entity StudentProgress {
  * idStudent <<PK, FK>>
  --
  * viewedCount
  * attemptsCount
  * successCount
  * avgAccuracy
}

UserRole ||--o{ User
User ||--|| UserSession
User ||--o{ MedicalImage 
User ||--o{ Case 
User ||--o| StudentProgress

CaseStatus ||--o{ Case
MedicalImageStatus ||--o{ MedicalImage

CaseStatus |o--o{ CaseStatusHistory : old
CaseStatus ||--o{ CaseStatusHistory : new
Case ||--o{ CaseStatusHistory

MedicalImageStatus |o--o{ MedicalImageStatusHistory : old
MedicalImageStatus ||--o{ MedicalImageStatusHistory : new
MedicalImage ||--o{ MedicalImageStatusHistory

Case ||--|| MedicalImage
Case ||--|| MedicalConclusion
Case ||--o| Review
MedicalImage ||--o{ Annotation
@enduml
```
</details>


## Физическая модель (PostgreSQL)

На физическом уровне выбраны конкретные типы данных, индексы и реализованы паттерны:

- **Горячие данные:** таблица `UserSession` для изоляции часто обновляемых полей `lastLogin` и `lastLogout`.
- **Гибкие данные:** поля `coordinates` и `medicalData` используют `JSONB`, что позволяет избежать частых миграций схемы.
- **Предрасчитанные агрегаты:** таблица `StudentProgress` хранит агрегированную статистику тренировок для мгновенного отображения.
- **История изменений:** таблицы `CaseStatusHistory` и `MedicalImageStatusHistory` обеспечивают полный аудит всех переходов статусов.

<details> 
<summary>📊 Развернуть диаграмму</summary>

```plantuml
@startuml
title Физическая модель данных Radiomark

entity User {
  * id : SERIAL <<PK>>
  * idRole : SMALLINT <<FK>>
  --
  * firstName : VARCHAR(100)
  * lastName : VARCHAR(200)
  * contacts : VARCHAR(100) <<UNIQUE>>
  description : TEXT
  certificateUrl : TEXT <<UNIQUE, Nullable>>
  * login : VARCHAR(100) <<UNIQUE>>
  * password : VARCHAR(255)
}

entity UserRole {
  * id : SMALLINT <<PK>>
  --
  * code : VARCHAR(50) <<UNIQUE>>
  * name : VARCHAR(100)
}

entity UserSession {
  * idUser : INTEGER <<PK, FK>>
  --
  * lastLogin : TIMESTAMPTZ
  * lastLogout : TIMESTAMPTZ
}

entity Case {
  * id : SERIAL <<PK>>
  * idPatient : INTEGER <<FK>>
  * idDoctor : INTEGER <<FK>>
  * idStatus : SMALLINT <<FK>>
  --
  * fileUrl : TEXT
  * priority : ENUM
  * createdAt : TIMESTAMPTZ
  description : TEXT
  finishedAt : TIMESTAMPTZ
}

entity CaseStatus {
  * id : SMALLINT <<PK>>
  --
  * code : VARCHAR(50) <<UNIQUE>>
  * name : VARCHAR(100)
}

entity CaseStatusHistory {
  * id : SERIAL <<PK>>
  * idCase : INTEGER <<FK>>
  * idNewStatus : SMALLINT <<FK>>
  * idOldStatus : SMALLINT <<FK>>
  --
  * changedAt : TIMESTAMPTZ
  * changedBy : INTEGER
}

entity MedicalImage {
  * id : SERIAL <<PK>>
  * idDoctor : INTEGER <<FK>>
  * idStatus : SMALLINT <<FK>>
  --
  * fileUrl : TEXT
  * medicalData : JSONB
  * description : TEXT
  * conclusion : TEXT
  returnReason : TEXT
}

entity MedicalImageStatus {
  * id : SMALLINT <<PK>>
  --
  * code : VARCHAR(50) <<UNIQUE>>
  * name : VARCHAR(100)
}

entity MedicalImageStatusHistory {
  * id : SERIAL <<PK>>
  * idMedicalImage : INTEGER <<FK>>
  * idNewStatus : SMALLINT <<FK>>
  * idOldStatus : SMALLINT <<FK>>
  --
  * changedAt : TIMESTAMPTZ
  * changedBy : INTEGER
}

entity Annotation {
  * id : SERIAL <<PK>>
  * idMedicalImage : INTEGER <<FK>>
  --
  * coordinates : JSONB
  * name : VARCHAR(200)
}

entity MedicalConclusion {
  * id : SERIAL <<PK>>
  * idCase : INTEGER <<FK>>
  --
  * conclusion : TEXT
  * fileUrl : TEXT
}

entity Review {
  * id : SERIAL <<PK>>
  * idCase : INTEGER <<FK>>
  --
  * rating : SMALLINT
  description : TEXT
}

entity StudentProgress {
  * idStudent : INTEGER <<PK, FK>>
  --
  * viewedCount : INTEGER
  * attemptsCount : INTEGER
  * successCount : INTEGER
  * avgAccuracy : DECIMAL(5,2)
}

UserRole ||--o{ User
User ||--|| UserSession
User ||--o{ MedicalImage
User ||--o{ Case
User ||--o| StudentProgress

CaseStatus ||--o{ Case
MedicalImageStatus ||--o{ MedicalImage

CaseStatus |o--o{ CaseStatusHistory : old
CaseStatus ||--o{ CaseStatusHistory : new
Case ||--o{ CaseStatusHistory

MedicalImageStatus |o--o{ MedicalImageStatusHistory : old
MedicalImageStatus ||--o{ MedicalImageStatusHistory : new
MedicalImage ||--o{ MedicalImageStatusHistory

Case ||--|| MedicalImage
Case ||--|| MedicalConclusion
Case ||--o| Review
MedicalImage ||--o{ Annotation
@enduml
```
</details>

## Ключевые решения

| Решение | Описание |
|:--------|:---------|
| **Единая таблица пользователей** | Все роли (врач, пациент, студент, модератор) хранятся в `User` с ссылкой на справочник `UserRole`. Упрощает аутентификацию и связи. |
| **Разделение сессий** | Часто обновляемые `lastLogin`/`lastLogout` вынесены в `UserSession`, чтобы не блокировать основную запись пользователя при каждом входе. |
| **JSONB для гибких данных** | Координаты разметки (`Annotation.coordinates`) и клинические параметры (`MedicalImage.medicalData`) хранятся в JSONB. Это позволяет избежать частых миграций схемы. |
| **История статусов** | Для заявок и снимков ведутся таблицы истории (`CaseStatusHistory`, `MedicalImageStatusHistory`). Обеспечивается полный аудит изменений. |
| **Предрасчитанные агрегаты** | `StudentProgress` хранит агрегированную статистику тренировок, что позволяет мгновенно отображать прогресс без выполнения тяжёлых запросов. |

:::tip[Подробнее о технологиях хранения]
Обоснование выбора PostgreSQL, JSONB и других технологий — в разделе [Технологии хранения](../architecture/storage-technologies).
:::
