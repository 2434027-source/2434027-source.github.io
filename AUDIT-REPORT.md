# Аудит статичного сайта ENG-RUS-SITE (Readymag Export)

**Дата аудита:** 4 февраля 2026  
**Проект:** UCB (United Crypto Boys) — unitedcryptoboys.online

---

## 1. Базовая структура и ошибки

### 1.1 Критичные проблемы

#### Пустой `<title>`
**Файл:** `index.html` (строка ~95)

```html
<!-- СЕЙЧАС -->
<title></title>

<!-- ДОЛЖНО БЫТЬ -->
<title>UCB — United Crypto Boys | Крипто-сообщество</title>
```

**Проблема:** Пустой title сильно вредит SEO и отображению во вкладках браузера.

---

#### Зависимость от внешнего CDN в viewer.js
**Файл:** `dist/viewer.js`

Все ES-модули импортируются с хардкодом URL:
```javascript
import{a as H}from"https://st-p.rmcdn1.net/1877c947/dist/c/c-3CXLXPWW.js";
```

**Работает ли:** Да, благодаря `<script type="importmap">` в index.html:
```json
{"imports":{"https://st-p.rmcdn1.net/1877c947/":"/"}}
```
Браузер подменяет CDN на локальные пути. Но:
- При отключении importmap (например, в старых браузерах) — загрузка пойдёт с CDN
- Дополнительный DNS-запрос к rmcdn1.net
- Зависимость от доступности внешнего сервиса

**Рекомендация:** Для полностью автономного экспорта можно пересобрать viewer.js с относительными путями (если Readymag даёт такую опцию) или оставить как есть — importmap решает проблему.

---

#### Несоответствие путей favicon
**index.html** ссылается на:
```
img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_144.png
```

**sorry.html** ссылается на:
```
/dist/img/favicons/favicon.ico
/dist/img/favicons/apple-touch-icon-*.png
```

В проекте есть **оба** набора:
- `img/664b1fa9319de2006fe1d050/Favicon-*.png` (16, 57, 72, 114, 144)
- `dist/img/favicons/` (favicon.ico, apple-touch-icon-*)

**Рекомендация:** Добавить `favicon.ico` для старых браузеров и унифицировать пути.

---

### 1.2 Мусор от конструктора

| Что | Где | Рекомендация |
|-----|-----|---------------|
| `data-project`, `data-user`, `data-exported-at` в meta | index.html | Можно удалить — служебная информация Readymag |
| `data-content` с огромным JSON | index.html | Не удалять — это данные для рендера |
| `id="viewport"` у meta viewport | Избыточно | Можно убрать, если не используется в JS |
| `id="fake"` div с `style="position:fixed;opacity:1"` | index.html body | Вероятно для тестов — проверить, используется ли в JS |
| `dns-prefetch` на `st-p.rmcdn1.net` | index.html | При локальной работе через importmap — можно удалить |

---

### 1.3 Валидность HTML

- **Doctype:** `<!doctype html>` — корректно
- **charset:** UTF-8 задан
- **Семантика:** Контент рендерится через JS (React/Backbone), в исходном HTML почти нет контента — только `<div id="root">`, `<div id="mags">` и т.д. Семантические теги (header, main, section) генерируются скриптами.

---

## 2. Favicon и метатеги

### 2.1 Текущее состояние

**Есть:**
- `<link rel="icon">` → PNG 144×144
- `apple-touch-icon-precomposed` для 144, 114, 72, 57
- `meta name="description"` (кириллица может отображаться некорректно из-за кодировки)
- `meta name="keywords"`
- `meta name="viewport"`
- OG: `og:type`, `og:url`, `og:image`, `og:title`, `og:description`, `og:site_name`
- Twitter: `twitter:card`, `twitter:site` (указан @readymag — лучше заменить на свой)
- `fb:app_id`
- `rel="canonical"`, `rel="next"`

**Нет:**
- `favicon.ico` (есть в dist/img/favicons/, но не подключён)
- `<title>` — пустой
- `og:image:width`, `og:image:height`
- `theme-color` для мобильных

---

### 2.2 Рекомендуемый блок метатегов

```html
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=10.0"/>
  
  <!-- Favicon -->
  <link rel="icon" href="dist/img/favicons/favicon.ico" type="image/x-icon" sizes="any"/>
  <link rel="icon" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_144.png" type="image/png" sizes="144x144"/>
  <link rel="apple-touch-icon" sizes="180x180" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_144.png"/>
  <link rel="apple-touch-icon" sizes="152x152" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_144.png"/>
  <link rel="apple-touch-icon" sizes="144x144" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_144.png"/>
  <link rel="apple-touch-icon" sizes="120x120" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_114.png"/>
  <link rel="apple-touch-icon" sizes="76x76" href="img/664b1fa9319de2006fe1d050/Favicon-6734680f-a0c5-4faa-84bb-f6c5aa854009_72.png"/>
  
  <!-- Title и описание -->
  <title>UCB — United Crypto Boys | Крипто-сообщество трейдеров</title>
  <meta name="description" content="UCB - это символ нашего крипто-братства. Мы сообщество трейдеров и новаторов, объединенных целью покорить мир криптовалют вместе."/>
  <meta name="keywords" content="UCB, united crypto boys, crypto, криптовалюта, трейдинг"/>
  
  <!-- Open Graph -->
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="https://unitedcryptoboys.online/"/>
  <meta property="og:title" content="UCB — United Crypto Boys"/>
  <meta property="og:description" content="UCB - это символ нашего крипто-братства. Мы сообщество трейдеров и новаторов."/>
  <meta property="og:image" content="https://unitedcryptoboys.online/img/664b1fa9319de2006fe1d050/5339356/gKsI0tdbgD-guGn0gNDCD.jpg"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:site_name" content="UCB"/>
  <meta property="og:locale" content="ru_RU"/>
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="UCB — United Crypto Boys"/>
  <meta name="twitter:description" content="UCB - это символ нашего крипто-братства."/>
  <meta name="twitter:image" content="https://unitedcryptoboys.online/img/664b1fa9319de2006fe1d050/5339356/gKsI0tdbgD-guGn0gNDCD.jpg"/>
  <!-- Замените @readymag на свой аккаунт или удалите -->
  <!-- <meta name="twitter:site" content="@your_handle"/> -->
  
  <!-- Дополнительно -->
  <meta name="theme-color" content="#000000"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-title" content="UCB"/>
</head>
```

**Важно:** `og:image` сейчас ведёт на `c-p.rmcdn1.net`. Для самодостаточного сайта лучше использовать свой домен, например:
```
https://unitedcryptoboys.online/img/664b1fa9319de2006fe1d050/5339356/gKsI0tdbgD-guGn0gNDCD.jpg
```

---

## 3. Адаптив и responsive-верстка

### 3.1 Особенности Readymag

Сайт использует **Readymag Viewer** — горизонтальный/вертикальный скролл страниц. Адаптивность заложена в:
- `viewer.css` (~184 KB)
- Конфигурации viewport в ServerData (`viewport_phone_portrait`, `desktopWidth: 1400`)
- Масштабирование через `scalableviewer: true`

### 3.2 Что проверить вручную

| Разрешение | Что проверить |
|------------|---------------|
| 320–480px | Текст читаемый, кнопки/ссылки не менее 44×44px, нет горизонтального скролла |
| 768–1024px | Сетка не ломается, контент не обрезается |
| ≥1440px | Масштабирование (scalewidth: 5000) — как выглядит на широких экранах |

### 3.3 Потенциальные проблемы

1. **Минимальный размер кликабельных областей** — в CSS есть `-webkit-tap-highlight-color: transparent`, но размеры кнопок/ссылок задаются через JS. Стоит проверить touch-элементы на мобильных.

2. **Горизонтальный скролл** — при `overflow` на body/html возможен нежелательный скролл. В viewer.css нужно искать `overflow-x`.

3. **Медиазапросы** — в `viewer.css` мало явных `@media` (поиск показал 1 вхождение). Большая часть адаптива, скорее всего, в JS.

**Рекомендация:** Запустить сайт в Chrome DevTools, включить Device Toolbar и проверить 320px, 375px, 768px, 1024px, 1440px. При проблемах — добавить/скорректировать медиазапросы в `viewer.css` или через кастомный CSS.

---

## 4. Оптимизация производительности

### 4.1 Текущая картина

| Ресурс | Количество/размер | Комментарий |
|--------|-------------------|-------------|
| JS chunks (dist/c/) | 58+ файлов | modulepreload для каждого |
| viewer.js | ~1 строка импортов | type="module", не блокирует |
| viewer.css | ~184 KB | Блокирует рендер |
| Шрифты | Google Fonts (preconnect) | Roboto, Georgia, Montserrat, и др. |
| Изображения | 80+ в img/ | JPG, PNG, SVG — без loading="lazy" (контент через JS) |

### 4.2 Конкретные шаги

#### 1. Подключить viewer.css асинхронно (осторожно)

```html
<!-- Вариант: media="print" + onload для неблокирующей загрузки -->
<link rel="stylesheet" href="dist/viewer.css" media="print" onload="this.media='all'"/>
<noscript><link rel="stylesheet" href="dist/viewer.css"/></noscript>
```

**Риск:** Возможен FOUC (мигание без стилей). Для SPA с быстрым рендером — тестировать.

#### 2. Preload критичных ресурсов

```html
<link rel="preload" href="dist/viewer.css" as="style"/>
<link rel="preload" href="dist/viewer.js" as="script"/>
```

#### 3. Шрифты

Сейчас:
```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
```

Добавить `font-display: swap` при подключении шрифтов (если подключаются через @import или link) — чтобы текст отображался до загрузки шрифтов.

#### 4. Изображения

Контент рисуется JS, изображения подставляются динамически. В коде Readymag viewer нужно искать создание `<img>` и добавлять:
- `loading="lazy"` для изображений ниже первого экрана
- `width` и `height` для снижения CLS
- При возможности — `srcset` и `sizes` для ретины

Это потребует правок в минифицированном viewer.js или в исходниках Readymag (если доступны).

#### 5. Уменьшить количество modulepreload

58 preload — много. Браузер и так загрузит модули по мере импортов. Можно оставить только критичные (первые 5–10), остальные удалить — замерять влияние на LCP/FCP.

---

### 4.3 Чек-лист по скорости

- [ ] Заполнить `<title>`
- [ ] Добавить `rel="preload"` для viewer.css и viewer.js
- [ ] Проверить, что шрифты с `font-display: swap`
- [ ] Сократить modulepreload до 5–10 ключевых
- [ ] Конвертировать тяжёлые PNG/JPG в WebP (вручную или скриптом)
- [ ] Убедиться, что og:image и важные картинки сжаты (TinyPNG, Squoosh)

---

## 5. Доступность (A11y) и семантика

### 5.1 Семантика

- Исходный HTML почти пустой — контент в `<div id="root">`.
- Семантические теги (header, nav, main, section, footer) создаются JS. Без запуска сайта и просмотра DOM после рендера сложно оценить.
- **Рекомендация:** Открыть сайт, включить «Inspect» и проверить структуру. Должны быть заголовки h1–h6, landmark-роли (banner, main, contentinfo).

### 5.2 Доступность

| Проблема | Где | Решение |
|----------|-----|---------|
| Alt у изображений | Генерируются в JS | В коде виджетов Readymag должны быть alt. Проверить в DevTools. |
| Заголовки h1–h6 | В контенте | Убедиться, что иерархия не нарушена (один h1, логичный порядок). |
| Контраст | Зависит от цветов в проекте | Проверить в DevTools (Lighthouse Accessibility, Contrast). |
| Фокус | Есть стили `:focus-visible` | В index.html есть блок «Видимый фокус для доступности» — хорошо. |
| Кнопки/ссылки | div/span с обработчиками | Должны быть `<button>` или `<a>` с `role` и `tabindex` при необходимости. |

### 5.3 Пример улучшения фокуса (уже есть)

В index.html присутствует:
```css
/* Видимый фокус для доступности */
:focus { outline: 2px solid ... }
:focus:not(:focus-visible) { outline: none }
:focus-visible { outline: 2px solid ... }
```

Это хорошая практика.

---

## 6. JavaScript и потенциальные баги

### 6.1 Зависимости

- **Backbone.js** — загружается из chunk
- **React** (по структуре viewer.js) — используется для роутинга и оболочки
- **Readymag Viewer** — кастомная логика

### 6.2 Потенциальные проблемы

1. **Обращения к несуществующим элементам**  
   Код ожидает `#root`, `#mags`, `#service-pages`, `#tmp`, `.popups`. Они есть в index.html. Риск низкий.

2. **Resize**  
   Viewer, скорее всего, подписан на `resize`. При быстром изменении окна возможны артефакты. Нужно тестировать.

3. **Memory leaks**  
   Много `setTimeout` и подписок. Без профилирования сложно сказать. Рекомендуется проверка через Chrome DevTools → Memory.

4. **IE**  
   В коде есть редирект на `sorry.html` для IE 6–9. Корректно.

5. **Динамический import**  
   `import("https://st-p.rmcdn1.net/.../c-CN6L2CXM.js")` для Web Vitals — при `isDownloadedSource` может не сработать. Проверить в офлайн-режиме.

### 6.3 Рекомендации

- Запустить сайт, открыть Console — проверить ошибки и предупреждения.
- Проверить вкладку Network — все ли ресурсы загружаются (особенно при локальном запуске).
- Убедиться, что `window.ServerData` и `window.viewerConfig` доступны до загрузки viewer.js.

---

## 7. Файлы snippets

**snippets/1.html** и **snippets/2.html** — очень большие (~19 MB каждый). Вероятно, это HTML-снимки страниц для превью или SEO.  

**Рекомендация:** Если не используются — удалить или вынести из корня. Если используются для prerender/SSR — проверить, что они действительно подключаются.

---

## 8. Финальный чек-лист

### Критичные ошибки

- [ ] **Заполнить `<title>`** — обязательно
- [ ] **Проверить кодировку** — meta description с кириллицей может отображаться некорректно (проверить в валидаторе)
- [ ] **Добавить favicon.ico** в `<head>` для старых браузеров
- [ ] **Заменить twitter:site** с @readymag на свой аккаунт или удалить

### Рекомендации по оптимизации

- [ ] Preload для viewer.css и viewer.js
- [ ] Сократить количество modulepreload (оставить 5–10)
- [ ] Конвертировать изображения в WebP
- [ ] Добавить `loading="lazy"` для изображений ниже fold (если возможно через настройки Readymag)
- [ ] Проверить размер og:image (рекомендуется 1200×630)

### Косметические улучшения

- [ ] Удалить `data-project`, `data-user`, `data-exported-at` из meta generator
- [ ] Добавить `theme-color`
- [ ] Унифицировать пути к favicon (img/... vs dist/img/favicons/)
- [ ] Удалить неиспользуемые `snippets`, если они не нужны
- [ ] Добавить `og:image:width` и `og:image:height`
- [ ] Добавить `og:locale` для русского контента

---

## 9. Про отчёт Lighthouse/PageSpeed

В запросе был указан блок для вставки отчёта Lighthouse/PageSpeed, но сам отчёт не приложен.

**Чтобы получить более точные рекомендации:**
1. Откройте сайт в Chrome.
2. DevTools → Lighthouse.
3. Выберите категории (Performance, Accessibility, Best Practices, SEO).
4. Запустите для Mobile и Desktop.
5. Экспортируйте отчёт (JSON или «Save as HTML») и вставьте сюда или приложите файл.

На основе отчёта можно будет:
- Точно указать проблемные ресурсы (картинки, скрипты, шрифты)
- Дать приоритизированный список по метрикам (LCP, FCP, CLS, TBT)
- Предложить конкретные правки под ваши цифры

---

*Аудит выполнен на основе статического анализа кода. Для полной картины рекомендуется ручное тестирование и запуск Lighthouse.*
