---
title: Нефункциональные требования
sidebar_position: 2
description: Требования к безопасности, производительности, надёжности и масштабируемости платформы Radiomark
---

# Нефункциональные требования

## Производительность и надёжность

### Метрики

<div className="cards">

<div className="card">
  <h3>⚡ API: время ответа ≤ 500 мс</h3>
  <p>95% запросов укладываются в 500 миллисекунд при нагрузке до 500 RPS.</p>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
</div>

<div className="card">
  <h3>📤 Загрузка DICOM ≤ 3 секунд</h3>
  <p>95% загрузок файлов до 50 МБ завершаются за 3 секунды при 50 одновременных загрузках.</p>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
</div>

<div className="card">
  <h3>🟢 Доступность 99.0% в месяц</h3>
  <p>Допустимый простой — не более 7.2 часов в месяц. Восстановление после сбоя < 24 часов.</p>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
</div>

</div>

### Обоснование метрик

<details>
<summary>📊 Почему выбраны такие значения</summary>

- **500 мс** — хорошая практика при работе с API, обеспечивает комфортную скорость взаимодействия.
- **50 МБ** — типичный размер DICOM‑файла (обычно 10‑40 МБ) с небольшим запасом.
- **500 RPS** — ожидаемая активность ~10‑20% от 2000 пользователей на MVP.
- **3 секунды** — при скорости интернета 150 Мбит/с загрузка занимает ≈2.6 секунды, с запасом.
- **99.0% доступности** — простой до 7.2 часов в месяц, приемлемо для образовательного и консультационного сервиса.

</details>


## Безопасность и нормативное соответствие

### Метрики
<div className="cards">

<div className="card">
  <h3>🔒 Защита медицинских данных</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
  <ul>
    <li>HTTPS (TLS 1.3) для передачи данных</li>
    <li>AES‑256 для хранения изображений</li>
    <li>Ролевая модель доступа (RBAC)</li>
    <li>Логирование всех действий</li>
    <li>Логи хранятся ≥1 года, доступны только администраторам</li>
  </ul>
</div>

<div className="card">
  <h3>⚖️ Соответствие законодательству</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
  <ul>
    <li>Согласие пользователей на обработку ПД</li>
    <li>Хранение медицинских заключений не менее 5 лет</li>
  </ul>
</div>

</div>


## Удобство использования и совместимость

### Метрики

<div className="cards">

<div className="card">
  <h3>🧭 Простота ключевых действий</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--warning">SHOULD HAVE</span></p>
  <ul>
    <li>Создание заявки пациентом ≤ 3 шага</li>
    <li>Загрузка снимка врачом ≤ 3 шага</li>
    <li>Просмотр снимка ≤ 4 шага</li>
    <li>Локализация: русский язык</li>
    <li>Информативные сообщения об успехе / ошибке</li>
  </ul>
</div>

<div className="card">
  <h3>🌐 Поддержка браузеров</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--danger">MUST HAVE</span></p>
  <ul>
    <li>Google Chrome</li>
    <li>Яндекс.Браузер</li>
    <li>Safari</li>
  </ul>
</div>

</div>


## Вместительность, масштабируемость и поддерживаемость

### Метрики

<div className="cards">

<div className="card">
  <h3>💾 Объём хранимых данных</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--warning">SHOULD HAVE</span></p>
  <ul>
    <li>Минимум 10 000 DICOM в первые полгода</li>
    <li>Общий объём хранилища > 1 ТБ</li>
  </ul>
</div>

<div className="card">
  <h3>📈 Масштабируемость</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--info">COULD HAVE</span></p>
  <ul>
    <li>Горизонтальное масштабирование</li>
    <li>Хранение файлов в объектном хранилище (S3/MinIO)</li>
  </ul>
</div>

<div className="card">
  <h3>🛠️ Поддерживаемость</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--info">COULD HAVE</span></p>
  <ul>
    <li>Актуальная OpenAPI‑документация</li>
    <li>Контроль версий (Git)</li>
    <li>Покрытие backend‑кода тестами > 60%</li>
  </ul>
</div>

</div>


## Мониторинг и наблюдаемость

### Метрики

<div className="cards">

<div className="card">
  <h3>📊 Мониторинг и логирование</h3>
  <p><strong>Приоритет:</strong> <span className="badge badge--warning">SHOULD HAVE</span></p>
  <ul>
    <li>Логирование всех операций с медицинскими данными</li>
    <li>Мгновенное уведомление администраторов о критических сбоях</li>
    <li>Стек: ElasticSearch + Kibana, Prometheus + Grafana</li>
  </ul>
</div>

</div>

---

:::tip[Приоритеты требований]

- **MUST HAVE** — обязательно для запуска MVP.
- **SHOULD HAVE** — желательно, но не блокирует запуск.
- **COULD HAVE** — может быть отложено до следующих версий.

:::

:::note[Примечание]

Порог размера файла в функциональных требованиях (100 МБ) позволяет отправлять как отдельные снимки, так и крупные исследования, содержащие несколько изображений.

:::
