---
title: Модель данных (ERD)
sidebar_position: 3
---

# ER-диаграммы Radiomark

## Концептуальная модель
```plantuml
@startuml
title Концептуальная модель Radiomark
entity Doctor {}
entity Patient {}
entity Student {}
entity Moderator {}
entity Case {}
entity MedicalImage {}
entity Annotation {}
entity MedicalConclusion {}
entity Review {}
entity StudentProgress {}

Doctor ||--o{ MedicalImage
Doctor ||--o{ Case
Doctor ||--o{ Annotation
Doctor ||--o{ MedicalConclusion
Patient ||--o{ Case
Patient ||--o{ Review
Student ||--o{ MedicalImage
Student ||--|| StudentProgress
Moderator ||--o{ MedicalImage
Case ||--|| MedicalImage
Case ||--|| MedicalConclusion
MedicalImage ||--o{ Annotation
Review |o--|| Case
@enduml
