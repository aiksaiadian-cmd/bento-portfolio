# Bento Portfolio Builder — Work Plan

## TL;DR

> **Quick Summary**: Создать локальный конструктор портфолио-сайта с двумя типами страниц — Bento Grid (4-колоночная сетка с resizable блоками) и Notion-like Rich Text (TipTap блоковый редактор), с переключением Edit/View режимов и полным локальным хранением в браузере.
>
> **Deliverables**:
> - Next.js SPA-приложение с системой страниц (древовидная структура)
> - Bento Grid редактор с resize блоков (4 колонки)
> - Notion-like страницы на TipTap с вложенными блоками
> - Edit ↔ View переключатель в UI
> - Загрузка медиа (Image, Video, GIF) в Base64 LocalStorage
> - Базовый WYSIWYG для текстовых bento-блоков
>
> **Estimated Effort**: Large (~3-5 дней активной работы)
> **Parallel Execution**: YES — 4 волны
> **Critical Path**: Types → Data Layer → Page System → Bento Grid → Content Blocks → Notion Editor → View Mode

---

## Context

### Original Request
Создать конструктор сайтов как bento.me для портфолио. Два режима: редактирование (менять размер блоков, контент) и просмотр. Контент: изображения, видео, GIF, Figma прототипы (пока не нужно), WYSIWYG текст.

### Interview Summary
**Key Decisions**:
- **Стек**: React + Next.js
- **Хранение**: LocalStorage (всё в браузере)
- **Файлы**: Base64 в LocalStorage
- **Типы страниц**: Bento Grid (4 колонки) + Notion-like Rich Text (TipTap)
- **Структура страниц**: Древовидная (как в Notion)
- **Bento WYSIWYG**: Базовый TipTap (жирный, курсив, ссылки, списки, заголовки)
- **Notion Engine**: TipTap (полноценный блоковый редактор)
- **Edit/View Mode**: Переключатель в UI
- **Figma**: Отложено
- **Тестирование**: Jest + React Testing Library (после реализации)
- **Multi-user**: Нет, только для одного пользователя
- **Деплой**: Локальный инструмент (dev-сервер)

### Scope

**IN**:
- Next.js приложение с App Router
- Система страниц: создание, удаление, переименование, древовидная структура
- Bento Grid страницы: 4 колонки, resize блоков (react-grid-layout), добавление/удаление блоков
- Наполнение bento-блоков: изображение, видео, GIF (загрузка через Base64), текст (базовый WYSIWYG)
- Notion-like страницы: полноценный блоковый редактор на TipTap (заголовки, текст, списки, цитаты, изображения, видео, разделители)
- Edit/View режимы: переключатель, в edit режиме — controls, в view — чистое отображение
- Навигация: боковое дерево страниц (как в Notion)
- LocalStorage: автосохранение при изменениях

**OUT**:
- Figma интеграция (на потом)
- Multi-user / авторизация
- Бэкенд / сервер
- Деплой на хостинг (Vercel и т.д.) — только локальная разработка
- Облачное хранение файлов (S3, Cloudinary)
- Реальные домены / SEO
- Плагины / расширения
- Коллаборативное редактирование
- История версий / undo-redo (пока нет)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (будем настраивать)
- **Automated tests**: Tests-after (Jest + React Testing Library)
- **Framework**: Jest + @testing-library/react
- **If tests**: Сначала всё работает, потом покрываем тестами ключевые модули

### QA Policy
Каждый task содержит agent-executed QA сценарии. Evidence сохраняется в `.omo/evidence/task-{N}-{scenario}.{ext}`.

- **UI**: Playwright — открыть браузер, навигировать, взаимодействовать, скриншоты
- **API/Логика**: Bash (curl для эндпоинтов, node REPL для проверки модулей)
- **Хранилище**: Bash — проверить содержимое LocalStorage через devtools protocol

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — всё параллельно, 7 задач):
├── Task 1: Next.js scaffolding + deps
├── Task 2: Types & interfaces
├── Task 3: LocalStorage data engine
├── Task 4: Page CRUD + tree structure
├── Task 5: Layout shell + sidebar navigation
├── Task 6: Edit/View mode context provider
└── Task 7: Media file upload utility (Base64)

Wave 2 (Bento Grid — 7 задач, все параллельны кроме 13):
├── Task 8: Bento Grid renderer (react-grid-layout)
├── Task 9: Block resize controls + add/remove
├── Task 10: Block content — Text Editor (basic WYSIWYG)
├── Task 11: Block content — Image block
├── Task 12: Block content — Video block
├── Task 13: Block content — GIF block (depends: 7)
└── Task 14: Block type selector

Wave 3 (Notion + View — 5 задач):
├── Task 15: TipTap notion editor setup
├── Task 16: Notion block types (heading, list, quote, divider)
├── Task 17: Notion block media (image, video embed)
├── Task 18: Notion block drag-n-drop reorder
├── Task 19: View mode page renderers (both types)

Wave 4 (Polish + Tests — 5 задач):
├── Task 20: Edit/View transitions + keyboard shortcuts
├── Task 21: Page reorder in tree (drag-n-drop)
├── Task 22: Data backup/export (JSON download)
├── Task 23: Image optimization + lazy loading
└── Task 24: Tests for core modules (Jest + RTL)

Wave FINAL (4 parallel reviews):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review
├── F3: Real QA
└── F4: Scope fidelity check
```

---

## TODOs

### Wave 1 — Foundation (Start Immediately)

- [ ] 1. **Project scaffolding + dependencies**

  **What to do**:
  - Инициализировать Next.js проект с TypeScript + App Router (`npx create-next-app@latest`)
  - Установить зависимости:
    - `react-grid-layout` — для bento сетки
    - `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder` — для WYSIWYG
    - `uuid` — для ID блоков
    - `@heroicons/react` — для иконок
    - `react-beautiful-dnd` или `@dnd-kit/core` — для drag-n-drop в дереве страниц
    - `zustand` — для управления состоянием (альтернатива Context API)
    - `clsx` + `tailwind-merge` — для стилизации
  - Настроить `tailwind.config.js` с кастомными цветами/тени для bento-стиля
  - Настроить `tsconfig.json` с алиасом `@/` → `src/`
  - Удалить boilerplate код
  - Создать базовую структуру папок:
    ```
    src/
    ├── app/              # Next.js App Router pages
    ├── components/       # React компоненты
    │   ├── layout/       # Layout, Sidebar, Header
    │   ├── bento/        # Bento grid компоненты
    │   ├── notion/       # Notion editor компоненты
    │   └── shared/       # UI kit (Button, Modal, Input)
    ├── lib/              # Утилиты, helpers
    ├── store/            # Zustand store
    └── types/            # TypeScript типы
    ```

  **Must NOT do**:
  - Не добавлять лишние зависимости (express, prisma, next-auth и т.д.)
  - Не менять конфиг Next.js без необходимости

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: не требуются

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 1-7)
  - **Blocks**: 5, 8, 15
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `npm run dev` запускается без ошибок
  - [ ] `npm run build` проходит без ошибок
  - [ ] Структура папок создана
  - [ ] Все зависимости в `package.json`

  **QA Scenarios**:
  ```
  Scenario: Проект запускается
    Tool: Bash
    Preconditions: npm install выполнено
    Steps:
      1. Запустить npm run dev
      2. curl http://localhost:3000
    Expected Result: Страница загружается, статус 200, нет ошибок в консоли
    Evidence: .omo/evidence/task-1-dev-startup.log

  Scenario: Сборка проекта
    Tool: Bash
    Preconditions: npm install выполнено
    Steps:
      1. Запустить npm run build
    Expected Result: Build completed, 0 errors
    Evidence: .omo/evidence/task-1-build.log
  ```

  **Commit**: YES (группа 1-7)
  - Message: `feat: project scaffolding with Next.js + dependencies`
  - Files: scaffold

---

- [ ] 2. **Types & interfaces**

  **What to do**:
  - Создать `src/types/index.ts` со всеми TypeScript типами:
    ```typescript
    // Тип страницы
    type PageType = 'bento' | 'notion'

    // Страница (узел дерева)
    interface Page {
      id: string           // uuid
      title: string
      type: PageType
      parentId: string | null  // null = корневая
      order: number        // порядок в дереве
      icon: string | null  // emoji иконка (как в Notion)
      content: BentoPageContent | NotionPageContent
      createdAt: number
      updatedAt: number
    }

    // Bento page — сетка с блоками
    interface BentoPageContent {
      type: 'bento'
      layout: BentoLayoutItem[]
      blocks: Record<string, BentoBlock>
    }

    interface BentoLayoutItem {
      i: string        // id блока
      x: number        // колонка (0-3)
      y: number        // ряд
      w: number        // ширина (1-4)
      h: number        // высота (1-...)
      minW?: number
      minH?: number
    }

    // Тип контента блока
    type BentoBlockType = 'text' | 'image' | 'video' | 'gif'

    interface BentoBlock {
      id: string
      type: BentoBlockType
      content: TextContent | MediaContent
      style?: BlockStyle
    }

    interface TextContent {
      html: string  // HTML от TipTap редактора
    }

    interface MediaContent {
      src: string       // Base64 data URL
      alt?: string
      caption?: string
    }

    interface BlockStyle {
      bgColor?: string
      borderRadius?: 'sm' | 'md' | 'lg' | 'full'
      padding?: 'sm' | 'md' | 'lg'
    }

    // Notion page — блоковый редактор
    interface NotionPageContent {
      type: 'notion'
      title: string
      blocks: NotionBlock[]
    }

    type NotionBlockType =
      | 'paragraph' | 'heading1' | 'heading2' | 'heading3'
      | 'bulletList' | 'orderedList' | 'quote'
      | 'divider' | 'image' | 'video'
      | 'code'

    interface NotionBlock {
      id: string
      type: NotionBlockType
      content: any
      children?: NotionBlock[]  // вложенность
    }
    ```

  **Must NOT do**:
  - Не добавлять типы для Figma пока
  - Минимум комментариев в коде (типы говорят сами за себя)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: не требуются

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 1-7)
  - **Blocks**: 3, 4, 8, 15
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `src/types/index.ts` существует
  - [ ] `tsc --noEmit` проходит без ошибок
  - [ ] Все типы используются в других файлах (валидация импортом)

  **QA Scenarios**:
  ```
  Scenario: Типы компилируются
    Tool: Bash
    Preconditions: Файл создан
    Steps:
      1. npx tsc --noEmit src/types/index.ts
    Expected Result: No errors
    Evidence: .omo/evidence/task-2-types-check.log
  ```

  **Commit**: YES (группа 1-7)

---

- [ ] 3. **LocalStorage data engine**

  **What to do**:
  - Создать `src/lib/storage.ts` — прослойка для работы с LocalStorage:
    - `getAllPages(): Page[]` — получить все страницы
    - `getPage(id: string): Page | null`
    - `savePage(page: Page): void`
    - `deletePage(id: string): void`
    - `getTree(): TreeNode[]` — получить дерево страниц
    - `exportData(): string` — JSON дамп всех данных
    - `importData(json: string): void` — восстановить из JSON
    - `getMedia(id: string): string | null` — получить base64 медиа
    - `saveMedia(id: string, base64: string): void`
    - `deleteMedia(id: string): void`
  - Ключ в LocalStorage: `bento-portfolio-data`
  - Добавить автосохранение с debounce (300ms) через `subscribe` из Zustand
  - Создать `src/lib/helpers.ts` с утилитами:
    - `generateId()` — обёртка над uuid
    - `debounce(fn, ms)`
    - `cn()` — `clsx` + `tailwind-merge`
    - `truncate(str, len)`

  **Must NOT do**:
  - Не добавлять шифрование/сжатие данных
  - Не использовать IndexedDB — только LocalStorage

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: не требуются

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 1-7)
  - **Blocks**: 4, 7, 8, 19, 22
  - **Blocked By**: 2 (типы нужны)

  **Acceptance Criteria**:
  - [ ] Все функции экспортируются и не бросают ошибок при пустом хранилище
  - [ ] CRUD операции работают корректно
  - [ ] Tree building работает с parentId

  **QA Scenarios**:
  ```
  Scenario: Сохранение и чтение страницы
    Tool: Bash (node REPL)
    Preconditions: Файлы созданы
    Steps:
      1. Импортировать storage функции
      2. Создать тестовую страницу
      3. savePage(testPage)
      4. const loaded = getPage(testPage.id)
    Expected Result: loaded.id === testPage.id, loaded.title === testPage.title
    Evidence: .omo/evidence/task-3-storage-crud.log

  Scenario: Пустое хранилище
    Tool: Bash (node REPL)
    Preconditions: Чистый LocalStorage
    Steps:
      1. Вызвать getAllPages()
    Expected Result: Возвращает пустой массив []
    Evidence: .omo/evidence/task-3-storage-empty.log
  ```

  **Commit**: YES (группа 1-7)

---

- [ ] 4. **Page CRUD + tree structure (Zustand store)**

  **What to do**:
  - Создать `src/store/pageStore.ts` (Zustand):
    ```typescript
    interface PageStore {
      pages: Page[]
      currentPageId: string | null

      // CRUD
      createPage(title: string, type: PageType, parentId?: string): string
      updatePage(id: string, updates: Partial<Page>): void
      deletePage(id: string): void
      movePage(id: string, newParentId: string | null, newOrder: number): void

      // Навигация
      setCurrentPage(id: string): void
      getCurrentPage(): Page | null
      getTree(): TreeNode[]

      // Media
      uploadMedia(file: File): Promise<string>  // возвращает mediaId
      getMediaUrl(mediaId: string): string | null
    }
    ```
  - При создании страницы: генерировать id, заполнять createdAt/updatedAt
  - При удалении страницы: рекурсивно удалить все дочерние
  - `getTree()` → строит дерево из плоского списка по parentId
  - Store подписан на сохранение в LocalStorage (через `storage.subscribe`)
  - Создать дерево по умолчанию при первом запуске:
    - Главная (bento)
    - Проекты (notion) → подстраницы
    - Контакты (bento)

  **Must NOT do**:
  - Не добавлять undo/redo
  - Не добавлять валидацию на уникальность имени

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: не требуются

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 1-7)
  - **Blocks**: 5, 6, 8, 9, 15, 19
  - **Blocked By**: 2, 3

  **Acceptance Criteria**:
  - [ ] Страницы создаются с правильным типом
  - [ ] getTree() возвращает корректное дерево
  - [ ] Удаление удаляет дочерние рекурсивно
  - [ ] При первом запуске создаются страницы по умолчанию

  **QA Scenarios**:
  ```
  Scenario: CRUD операции
    Tool: Bash (node REPL с jsdom для Zustand)
    Steps:
      1. Создать корневую страницу (root)
      2. Создать дочернюю страницу (child, parentId: root.id)
      3. Переименовать root
      4. Проверить getTree() — child внутри root
      5. Удалить root
      6. Проверить что child тоже удалён
    Expected Result: Все шаги выполнены, дерево корректно
    Evidence: .omo/evidence/task-4-page-crud.log
  ```

  **Commit**: YES (группа 1-7)

---

### Wave 1 — Foundation (Start Immediately) (continued)

- [ ] 5. **Layout shell + sidebar navigation**

  **What to do**:
  - Создать `src/app/layout.tsx` — корневой layout
  - Создать `src/components/layout/AppShell.tsx`:
    - Боковая панель (левая, ~250px): дерево страниц
    - Основная область: рендер текущей страницы
    - Кнопка переключения Edit/View в правом верхнем углу
  - Создать `src/components/layout/Sidebar.tsx`:
    - Рекурсивный рендер дерева страниц
    - Кнопка "New Page" с выбором типа (Bento / Notion)
    - Контекстное меню: Rename, Duplicate, Delete
    - Подсветка текущей страницы
    - Emoji иконка слева от названия
  - Стилизация в bento-стиле: светлые тени, скругления, минимализм

  **Must NOT do**:
  - Не делать навороченные анимации пока

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 5)
  - **Blocks**: 8, 14, 19
  - **Blocked By**: 1, 2, 4

  **Acceptance Criteria**:
  - [ ] Сайдбар рендерит дерево страниц
  - [ ] Клик на страницу делает её текущей
  - [ ] Кнопка New Page создаёт страницу
  - [ ] Edit/View кнопка отображается

  **QA Scenarios**:
  ```
  Scenario: Сайдбар отображается
    Tool: Playwright
    Preconditions: npm run dev запущен
    Steps:
      1. Открыть localhost:3000
      2. Проверить .sidebar виден
      3. Проверить что страницы по умолчанию отображаются
      4. Нажать "New Page" → выбрать Bento
      5. Проверить что новая страница появилась в дереве
    Expected Result: Сайдбар рендерит страницы
    Evidence: .omo/evidence/task-5-sidebar.png
  ```

  **Commit**: YES (группа 1-7)

---

- [ ] 6. **Edit/View mode context provider**

  **What to do**:
  - Создать `src/store/modeStore.ts` (Zustand):
    ```typescript
    type Mode = 'edit' | 'view'
    interface ModeStore { mode: Mode; setMode(mode: Mode): void; toggleMode(): void }
    ```
  - Создать `src/components/layout/ModeToggle.tsx`:
    - Кнопка-переключатель в правом верхнем углу
    - Edit: иконка карандаша, View: иконка глаза
    - Keyboard shortcut: `Cmd+E` / `Ctrl+E`
  - В edit режиме: границы блоков (dashed border), controls
  - В view режиме: скрыть все controls, чистое отображение

  **Must NOT do**:
  - Не рендерить два дерева — только условное переключение CSS

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 6)
  - **Blocks**: 8, 9, 15, 19, 20
  - **Blocked By**: 1, 2

  **Acceptance Criteria**:
  - [ ] modeStore работает, toggleMode() переключает
  - [ ] В edit режиме видны controls
  - [ ] В view режиме controls скрыты
  - [ ] Cmd+E переключает режим

  **QA Scenarios**:
  ```
  Scenario: Переключение режимов
    Tool: Playwright
    Steps:
      1. Проверить data-testid="mode-toggle" текст "Edit"
      2. Нажать → текст "View"
      3. Нажать Ctrl+E → текст "Edit"
    Expected Result: Режим переключается
    Evidence: .omo/evidence/task-6-mode-switch.png
  ```

  **Commit**: YES (группа 1-7)

---

- [ ] 7. **Media file upload utility (Base64)**

  **What to do**:
  - Создать `src/lib/media.ts`:
    - `fileToBase64(file: File): Promise<string>`
    - `getFileType(base64: string): 'image' | 'video' | 'gif'`
    - `validateFile(file: File): { valid: boolean; error?: string }`
  - Валидация: макс 5MB img, 20MB video
  - Поддерживаемые: jpg, png, webp, gif, mp4, webm
  - Создать `src/components/shared/FileUploader.tsx`:
    - Drag-n-drop зона + кнопка выбора
    - Превью после загрузки

  **Must NOT do**:
  - Не сжимать изображения пока

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (Tasks 7)
  - **Blocks**: 11, 12, 13, 16, 17
  - **Blocked By**: 2

  **Acceptance Criteria**:
  - [ ] fileToBase64 возвращает корректную base64 строку
  - [ ] Валидатор отклоняет неподдерживаемые форматы

  **QA Scenarios**:
  ```
  Scenario: Конвертация в Base64
    Tool: Bash (node REPL)
    Steps:
      1. Создать тестовый File
      2. Вызвать fileToBase64(testFile)
      3. Проверить что результат начинается с "data:"
    Expected Result: Base64 строка корректна
    Evidence: .omo/evidence/task-7-base64.log
  ```

  **Commit**: YES (группа 1-7)

---

### Wave 2 — Bento Grid Editor

- [ ] 8. **Bento Grid renderer (react-grid-layout)**

  **What to do**:
  - Создать `src/components/bento/BentoGrid.tsx`:
    - Интеграция `react-grid-layout`
    - 4 колонки, row height: 120px
    - Edit режим: `isDraggable=true`, `isResizable=true`
    - View режим: `isDraggable=false`, `isResizable=false`
    - Auto reflow при resize
  - Создать `src/components/bento/BentoBlockWrapper.tsx`:
    - Обёртка вокруг react-grid-layout элемента
    - Рендерит `BlockContentSwitcher` внутри
    - В edit режиме показывает border + тип блока
  - Создать `src/components/bento/BlockContentSwitcher.tsx`:
    - По типу блока рендерит: TextEditor | ImageBlock | VideoBlock | GifBlock | EmptyBlock

  **Must NOT do**:
  - Не кастомизировать тему react-grid-layout

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocks**: 9
  - **Blocked By**: 1, 2, 3, 4, 5, 6

  **Acceptance Criteria**:
  - [ ] react-grid-layout инициализируется с 4 колонками
  - [ ] Блоки можно перетаскивать в edit режиме
  - [ ] Блоки нельзя перетаскивать в view режиме

  **QA Scenarios**:
  ```
  Scenario: Сетка 4 колонки
    Tool: Playwright
    Preconditions: bento страница с блоками
    Steps:
      1. Открыть bento страницу в edit режиме
      2. Проверить .react-grid-layout существует
      3. Проверить что блоки отображаются
    Expected Result: Сетка 4 колонки, блоки внутри
    Evidence: .omo/evidence/task-8-grid-render.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 9. **Block resize controls + add/remove blocks**

  **What to do**:
  - Создать `src/components/bento/BlockControls.tsx`:
    - Resize handle (правый нижний угол)
    - Delete block (крестик в правом верхнем углу)
    - Показать размер блока: "2×1"
  - Создать `src/components/bento/AddBlockFAB.tsx`:
    - FAB "+" в правом нижнем углу сетки
    - Меню выбора типа блока
    - Новый блок — размер по умолчанию 2×1
  - Обновить pageStore: addBlock, removeBlock, updateBlockContent, updateLayout

  **Must NOT do**:
  - Не добавлять undo/delete пока

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocks**: 14
  - **Blocked By**: 8, 4

  **Acceptance Criteria**:
  - [ ] Resize handle виден в edit режиме
  - [ ] Delete block удаляет блок
  - [ ] FAB "+" создаёт новый блок

  **QA Scenarios**:
  ```
  Scenario: Добавление и удаление блока
    Tool: Playwright
    Steps:
      1. Нажать [data-testid="add-block"]
      2. Выбрать тип "Text"
      3. Проверить новый блок появился
      4. Нажать крестик на блоке
      5. Проверить блок удалён
    Expected Result: Блок создаётся и удаляется
    Evidence: .omo/evidence/task-9-add-delete.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 10. **Block content — Text Editor (basic WYSIWYG)**

  **What to do**:
  - Создать `src/components/bento/blocks/TextBlock.tsx`:
    - TipTap редактор с StarterKit
    - Расширения: Bold, Italic, Strike, Link, BulletList, OrderedList, Heading (h1-h3), Placeholder
    - В edit режиме: тулбар с кнопками форматирования
    - В view режиме: рендер HTML без тулбара
    - Сохранение HTML в `block.content.html`
  - Tулбар: жирный, курсив, заголовки (H2, H3), маркированный список, нумерованный список, ссылка
  - Placeholder: "Напишите текст..."

  **Must NOT do**:
  - Не добавлять image upload в TipTap (у нас отдельный тип блока для изображений)
  - Не добавлять code block, table, blockquote в bento (это для notion страниц)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocked By**: 1, 2

  **Acceptance Criteria**:
  - [ ] TipTap редактор рендерится
  - [ ] Можно писать текст и форматировать (bold, italic, headings)
  - [ ] HTML сохраняется в store
  - [ ] В view режиме тулбар скрыт

  **QA Scenarios**:
  ```
  Scenario: WYSIWYG редактирование
    Tool: Playwright
    Preconditions: bento страница, блок Text
    Steps:
      1. Нажать на текстовый блок
      2. Ввести "Hello World"
      3. Выделить текст → нажать Bold
      4. Проверить что текст стал <strong>
    Expected Result: Текст форматируется
    Evidence: .omo/evidence/task-10-text-edit.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 11. **Block content — Image block**

  **What to do**:
  - Создать `src/components/bento/blocks/ImageBlock.tsx`:
    - В edit режиме: FileUploader для загрузки изображения
    - Drag-n-drop или клик для выбора файла
    - Preview загруженного изображения
    - Alt text поле
    - Caption поле
    - В view режиме: img с object-fit: cover
    - Если изображение не загружено: placeholder "Click to add image"

  **Must NOT do**:
  - Не добавлять crop/resize изображения
  - Не добавлять фильтры

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocked By**: 7 (нужен fileToBase64)

  **Acceptance Criteria**:
  - [ ] Можно загрузить изображение через FileUploader
  - [ ] Изображение отображается в блоке
  - [ ] В view режиме изображение видно

  **QA Scenarios**:
  ```
  Scenario: Загрузка изображения
    Tool: Playwright
    Preconditions: bento страница, Image блок
    Steps:
      1. Нажать на Image блок (пустой)
      2. Выбрать .jpg файл через FileUploader
      3. Проверить что preview отображается
      4. Переключить в view режим
      5. Проверить что img виден
    Expected Result: Изображение загружено и отображается
    Evidence: .omo/evidence/task-11-image.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 12. **Block content — Video block**

  **What to do**:
  - Создать `src/components/bento/blocks/VideoBlock.tsx`:
    - В edit режиме: FileUploader + URL input
    - Локальная загрузка: FileUploader (mp4, webm) → Base64
    - URL вставка: input для ссылки на видео (YouTube/Vimeo embed)
    - Preview: video player с controls
    - В view режиме: video player
    - Placeholder: "Upload video or paste URL"

  **Must NOT do**:
  - Не конвертировать форматы
  - Не добавлять streaming / HLS

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocked By**: 7

  **Acceptance Criteria**:
  - [ ] Можно загрузить mp4 файл
  - [ ] Video player отображается в блоке
  - [ ] URL вставка работает для YouTube

  **QA Scenarios**:
  ```
  Scenario: Загрузка видео
    Tool: Playwright
    Preconditions: Video блок
    Steps:
      1. Выбрать mp4 файл
      2. Проверить video element виден
      3. Проверить что video имеет source
    Expected Result: Видео загружено
    Evidence: .omo/evidence/task-12-video.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 13. **Block content — GIF block**

  **What to do**:
  - Создать `src/components/bento/blocks/GifBlock.tsx`:
    - В edit режиме: FileUploader для .gif файлов
    - Preview с автовоспроизведением
    - В view режиме: img с gif
    - Placeholder: "Click to add GIF"
    - По сути то же что ImageBlock, но с специфичной иконкой/лейблом

  **Must NOT do**:
  - Не конвертировать gif → mp4
  - Не оптимизировать gif

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocked By**: 7

  **Acceptance Criteria**:
  - [ ] Можно загрузить .gif файл
  - [ ] GIF анимируется в preview
  - [ ] В view режиме GIF работает

  **QA Scenarios**:
  ```
  Scenario: Загрузка GIF
    Tool: Playwright
    Preconditions: GIF блок
    Steps:
      1. Выбрать .gif файл
      2. Проверить что img отображается
      3. Проверить что src содержит "data:image/gif"
    Expected Result: GIF загружен
    Evidence: .omo/evidence/task-13-gif.png
  ```

  **Commit**: YES (группа 8-14)

---

- [ ] 14. **Block type selector**

  **What to do**:
  - Создать `src/components/bento/BlockTypeSelector.tsx`:
    - Открывается при нажатии на пустой блок или кнопку "Change type"
    - Сетка 2×2 с иконками:
      - 📝 Text
      - 🖼 Image
      - 🎬 Video
      - 🎯 GIF
    - При выборе типа: блок инициализируется с контентом по умолчанию
    - При смене типа: существующий контент сбрасывается (с подтверждением)
  - Интегрировать в BlockContentSwitcher и BlockControls

  **Must NOT do**:
  - Не добавлять drag-n-drop из селектора в сетку

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (Tasks 8-14)
  - **Blocked By**: 9

  **Acceptance Criteria**:
  - [ ] Селектор показывает 4 типа блоков
  - [ ] Выбор типа инициализирует блок
  - [ ] Смена типа сбрасывает контент с подтверждением

  **QA Scenarios**:
  ```
  Scenario: Выбор типа блока
    Tool: Playwright
    Preconditions: Edit режим, есть пустой блок
    Steps:
      1. Нажать на пустой блок
      2. Проверить что селектор открыт
      3. Нажать "Image"
      4. Проверить что блок теперь ImageBlock
    Expected Result: Тип блока изменён
    Evidence: .omo/evidence/task-14-type-selector.png
  ```

  **Commit**: YES (группа 8-14)

---

### Wave 3 — Notion-like Page Editor + View Mode

- [ ] 15. **TipTap Notion editor setup**

  **What to do**:
  - Создать `src/components/notion/NotionEditor.tsx`:
    - Полноценный TipTap редактор для notion-страниц
    - Расширения:
      - StarterKit (paragraph, bold, italic, strike, code, heading, bulletList, orderedList, blockquote)
      - Link
      - Image (с Base64 поддержкой)
      - Placeholder ("Type '/' for commands...")
      - SlashCommand — кастомное меню по `/` для вставки блоков
    - Slash-команды: /heading, /list, /quote, /divider, /image, /video
    - Drag handle слева от каждого блока (как в Notion)
    - Автосохранение при изменениях
    - В view режиме: рендер HTML без редактора
  - Создать `src/components/notion/NotionBlockNode.tsx`:
    - Кастомный рендер для каждого типа блока

  **Must NOT do**:
  - Не добавлять database / table блоки (сложно)
  - Не добавлять toggle блоки

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (Tasks 15-18)
  - **Blocks**: 16, 17, 18
  - **Blocked By**: 1, 2, 4

  **Acceptance Criteria**:
  - [ ] TipTap редактор с StarterKit работает
  - [ ] Slash-команды открывают меню
  - [ ] Автосохранение работает
  - [ ] В view режиме редактор отключён

  **QA Scenarios**:
  ```
  Scenario: Notion редактор
    Tool: Playwright
    Preconditions: notion страница, edit режим
    Steps:
      1. Проверить что редактор загружен
      2. Ввести текст
      3. Напечатать "/" → проверить меню
      4. Выбрать "Heading 1"
    Expected Result: Редактор работает, слэш-меню открывается
    Evidence: .omo/evidence/task-15-notion-editor.png
  ```

  **Commit**: YES (группа 15-19)

---

- [ ] 16. **Notion block types (heading, paragraph, list, quote, divider)**

  **What to do**:
  - Расширить ноушн-редактор специализированными блоками:
    - **Heading 1/2/3**: крупные заголовки
    - **Paragraph**: обычный текст
    - **Bullet List** / **Ordered List**: списки
    - **Quote**: цитата с левой полосой
    - **Divider**: горизонтальная линия (---)
    - **Code**: code block с моноширинным шрифтом
  - Каждый блок имеет свой стиль рендера
  - Вложенность: можно сделать Tab для indent (пока без nested nodes)

  **Must NOT do**:
  - Не добавлять callout, toggle, table
  - Не добавлять nested page ссылки

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (Tasks 15-18)
  - **Blocked By**: 15

  **Acceptance Criteria**:
  - [ ] Все типы блоков рендерятся
  - [ ] Quote имеет стиль с полосой
  - [ ] Divider рендерит hr
  - [ ] Code блок моноширинный

  **QA Scenarios**:
  ```
  Scenario: Все типы блоков
    Tool: Playwright
    Preconditions: notion страница в edit
    Steps:
      1. Через слэш-меню создать Heading 1
      2. Создать Bullet List
      3. Создать Quote
      4. Создать Divider
      5. Проверить что все блоки отображаются
    Expected Result: Все типы блоков работают
    Evidence: .omo/evidence/task-16-block-types.png
  ```

  **Commit**: YES (группа 15-19)

---

- [ ] 17. **Notion block media (image, video)**

  **What to do**:
  - Создать `src/components/notion/blocks/NotionImage.tsx`:
    - Вставка изображения в ноушн-страницу
    - Через слэш-команду /image → FileUploader
    - Base64 хранение
    - Возможность изменения ширины (full-width / page-width)
  - Создать `src/components/notion/blocks/NotionVideo.tsx`:
    - Вставка видео в ноушн-страницу
    - Через слэш-команду /video → URL input + FileUploader
    - Embed YouTube/Vimeo + локальный mp4

  **Must NOT do**:
  - Не добавлять галерею / карусель

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (Tasks 15-18)
  - **Blocked By**: 15, 7

  **Acceptance Criteria**:
  - [ ] /image вставляет изображение
  - [ ] /video вставляет видео
  - [ ] YouTube embed работает

  **QA Scenarios**:
  ```
  Scenario: Вставка медиа
    Tool: Playwright
    Preconditions: notion страница в edit
    Steps:
      1. /image → загрузить изображение
      2. Проверить что img виден
      3. /video → вставить YouTube URL
      4. Проверить что iframe загружен
    Expected Result: Медиа вставляется в ноушн страницу
    Evidence: .omo/evidence/task-17-notion-media.png
  ```

  **Commit**: YES (группа 15-19)

---

- [ ] 18. **Notion block drag-n-drop reorder**

  **What to do**:
  - Добавить drag handle (6 dots) слева от каждого блока (виден при hover в edit режиме)
  - Использовать @dnd-kit/core + @dnd-kit/sortable для перетаскивания блоков
  - При drag: остальные блоки сдвигаются, показывается целевая позиция
  - После drop: порядок блоков сохраняется в store
  - Drag handle появляется только в edit режиме

  **Must NOT do**:
  - Не добавлять перетаскивание между страницами
  - Не добавлять nested drag (пока)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (Tasks 15-18)
  - **Blocked By**: 15, 16

  **Acceptance Criteria**:
  - [ ] Drag handle виден при hover в edit режиме
  - [ ] Блоки можно перетаскивать
  - [ ] Порядок сохраняется после перезагрузки

  **QA Scenarios**:
  ```
  Scenario: Перетаскивание блоков
    Tool: Playwright
    Preconditions: notion страница с 3+ блоками в edit
    Steps:
      1. Навести на drag handle первого блока
      2. Перетащить вниз на 2 позиции
      3. Проверить порядок блоков в store
      4. Перезагрузить страницу
      5. Проверить что порядок сохранился
    Expected Result: Блоки перетаскиваются, порядок сохраняется
    Evidence: .omo/evidence/task-18-drag-reorder.png
  ```

  **Commit**: YES (группа 15-19)

---

- [ ] 19. **View mode page renderers (both types)**

  **What to do**:
  - Создать `src/components/view/PageRenderer.tsx`:
    - Определяет тип страницы и рендерит соответствующий view-компонент
  - Создать `src/components/view/BentoView.tsx`:
    - Рендер bento страницы в view режиме
    - react-grid-layout с isDraggable=false, isResizable=false
    - Все блоки отображаются без controls
    - Чистый, презентабельный вид
  - Создать `src/components/view/NotionView.tsx`:
    - Рендер notion страницы в view режиме
    - HTML рендер TipTap контента без редактора
    - Все стили сохраняются
  - Анимация перехода: плавное исчезновение controls при switch режима

  **Must NOT do**:
  - Не добавлять PDF export / print styles пока

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (Tasks 19)
  - **Blocks**: 20
  - **Blocked By**: 8, 15, 5, 6

  **Acceptance Criteria**:
  - [ ] Bento страница в view без controls
  - [ ] Notion страница отображается корректно
  - [ ] Переключение edit→view работает

  **QA Scenarios**:
  ```
  Scenario: View режим для bento
    Tool: Playwright
    Preconditions: bento страница с контентом
    Steps:
      1. Переключить в view режим
      2. Проверить что .block-controls не существует
      3. Проверить что контент отображается
    Expected Result: Bento страница чистая, без controls
    Evidence: .omo/evidence/task-19-view-bento.png

  Scenario: View режим для notion
    Tool: Playwright
    Preconditions: notion страница с контентом
    Steps:
      1. Переключить в view режим
      2. Проверить что TipTap тулбар скрыт
      3. Проверить что контент отображается
    Expected Result: Notion страница чистая
    Evidence: .omo/evidence/task-19-view-notion.png
  ```

  **Commit**: YES (группа 15-19)

---

### Wave 4 — Polish & Tests

- [ ] 20. **Edit/View transitions + keyboard shortcuts**

  **What to do**:
  - Плавный transition между edit и view режимами (CSS opacity)
  - Клавиатурные шорткаты:
    - `Cmd+E` / `Ctrl+E` — toggle edit/view
    - `Cmd+S` / `Ctrl+S` — force save
    - `Cmd+N` / `Ctrl+N` — новая страница
    - `Cmd+Backspace` — удалить текущую страницу (с подтверждением)
  - Индикатор saved/unsaved состояния (точка в сайдбаре)
  - Автосохранение при переключении режима

  **Must NOT do**:
  - Не переопределять системные шорткаты браузера

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (Tasks 20-24)
  - **Blocked By**: 6, 19

  **Acceptance Criteria**:
  - [ ] Cmd+E переключает режим
  - [ ] Cmd+S форсирует сохранение
  - [ ] Transition анимация работает

  **QA Scenarios**:
  ```
  Scenario: Клавиатурные шорткаты
    Tool: Playwright
    Preconditions: Любая страница
    Steps:
      1. Нажать Ctrl+E
      2. Проверить что режим изменился
      3. Нажать Ctrl+S
      4. Проверить .saved-indicator
    Expected Result: Шорткаты работают
    Evidence: .omo/evidence/task-20-shortcuts.png
  ```

  **Commit**: YES (группа 20-24)

---

- [ ] 21. **Page reorder in tree (drag-n-drop)**

  **What to do**:
  - Добавить drag-n-drop для страниц в сайдбаре
  - Использовать @dnd-kit (уже установлен)
  - Можно перетаскивать страницы:
    - Изменение порядка (выше/ниже)
    - Вложить в другую страницу (drop с отступом)
    - Извлечь из родителя (drop на корневой уровень)
  - Визуальная индикация: полоса между страницами, отступ для вложенности
  - После drop: `pageStore.movePage(id, newParentId, newOrder)`

  **Must NOT do**:
  - Не добавлять multi-select страниц

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (Tasks 20-24)
  - **Blocked By**: 5

  **Acceptance Criteria**:
  - [ ] Страницы можно перетаскивать в дереве
  - [ ] Вложенность работает
  - [ ] Порядок сохраняется

  **QA Scenarios**:
  ```
  Scenario: Drag-n-drop страниц
    Tool: Playwright
    Preconditions: 3+ страницы
    Steps:
      1. Перетащить страницу B под страницу A
      2. Проверить parentId в store
      3. Перетащить страницу наверх
      4. Проверить order
    Expected Result: Страницы перетаскиваются
    Evidence: .omo/evidence/task-21-page-drag.png
  ```

  **Commit**: YES (группа 20-24)

---

- [ ] 22. **Data backup/export (JSON download)**

  **What to do**:
  - Создать `src/components/shared/DataManager.tsx`:
    - Кнопка "Export Data" — скачать JSON всех страниц и медиа
    - Кнопка "Import Data" — загрузить JSON и восстановить
    - Кнопка "Reset All" — очистить всё (с подтверждением)
  - Export: собрать все страницы + медиа в один JSON → скачать как `.bento-portfolio.json`
  - Import: валидировать JSON → заменить все данные в LocalStorage
  - Разместить в настройках (шестерёнка внизу сайдбара)

  **Must NOT do**:
  - Не добавлять авто-бэкап в localStorage (уже есть)
  - Не добавлять cloud sync

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (Tasks 20-24)
  - **Blocked By**: 3

  **Acceptance Criteria**:
  - [ ] Export скачивает .json файл
  - [ ] Import восстанавливает данные из .json
  - [ ] Reset очищает всё

  **QA Scenarios**:
  ```
  Scenario: Export/Import
    Tool: Playwright
    Preconditions: Есть страницы
    Steps:
      1. Нажать Export
      2. Проверить что файл скачался
      3. Очистить данные
      4. Import скачанный файл
      5. Проверить что страницы восстановлены
    Expected Result: Export/Import работает
    Evidence: .omo/evidence/task-22-export-import.log
  ```

  **Commit**: YES (группа 20-24)

---

- [ ] 23. **Image optimization + lazy loading**

  **What to do**:
  - Добавить lazy loading для изображений (loading="lazy")
  - Добавить fade-in анимацию при загрузке изображений
  - Для больших изображений: добавить блюр placeholder
  - Video: preload="metadata" для быстрой загрузки
  - Добавить aspect-ratio контейнеры для избежания layout shift (CLS)
  - Оптимизировать render: React.memo для блоков, useMemo для layout вычислений

  **Must NOT do**:
  - Не добавлять next/image (нам нужна работа с Base64)
  - Не добавлять серверную оптимизацию

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (Tasks 20-24)
  - **Blocked By**: 8, 10, 11, 12, 13

  **Acceptance Criteria**:
  - [ ] Все изображения имеют loading="lazy"
  - [ ] Нет layout shift при загрузке
  - [ ] Video имеет preload="metadata"

  **QA Scenarios**:
  ```
  Scenario: Lazy loading
    Tool: Playwright
    Steps:
      1. Открыть страницу с изображениями
      2. Проверить атрибут loading="lazy" на img
      3. Проверить aspect-ratio container
    Expected Result: Оптимизация применена
    Evidence: .omo/evidence/task-23-lazy-loading.log
  ```

  **Commit**: YES (группа 20-24)

---

- [ ] 24. **Tests for core modules (Jest + RTL)**

  **What to do**:
  - Установить Jest + @testing-library/react + @testing-library/jest-dom
  - Настроить jest.config.ts для Next.js
  - Написать тесты:
    - `src/lib/__tests__/storage.test.ts`:
      - getAllPages returns empty array initially
      - savePage stores and retrieves page
      - deletePage removes page
      - getTree builds correct hierarchy
    - `src/store/__tests__/pageStore.test.ts`:
      - createPage generates correct structure
      - deletePage recursively deletes children
      - movePage updates parentId
    - `src/lib/__tests__/media.test.ts`:
      - fileToBase64 converts correctly
      - validateFile rejects invalid types
    - `src/store/__tests__/modeStore.test.ts`:
      - toggleMode switches between edit/view
      - setMode sets correct mode
  - Запустить: `npm test` → все проходят

  **Must NOT do**:
  - Не писать тесты для UI компонентов (Playwright QA покрывает)
  - Не писать snapshot тесты

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (Tasks 20-24)
  - **Blocked By**: 2, 3, 4, 7, 6

  **Acceptance Criteria**:
  - [ ] jest.config.ts настроен
  - [ ] Все тесты проходят: `npm test` → PASS
  - [ ] Покрытие: storage, pageStore, media, modeStore

  **QA Scenarios**:
  ```
  Scenario: Запуск тестов
    Tool: Bash
    Preconditions: Тесты написаны
    Steps:
      1. npm test
    Expected Result: All tests pass
    Evidence: .omo/evidence/task-24-tests.log
  ```

  **Commit**: YES (группа 20-24)

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .omo/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration. Test edge cases: empty state, invalid input, rapid actions. Save to `.omo/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1-7**: `feat: project scaffolding + data layer` — wave-1 foundation
- **8-14**: `feat: bento grid editor + content blocks` — wave-2 bento
- **15-19**: `feat: notion-like page editor + view mode` — wave-3 notion
- **20-24**: `feat: polish + tests` — wave-4 finalization
- **F1-F4**: `chore: verification fixes` — review corrections

---

## Success Criteria

### Verification Commands
```bash
npm run dev  # Expected: Next.js app starts on localhost:3000
npm run build  # Expected: build succeeds with 0 errors
npm test  # Expected: all tests pass
```

### Final Checklist
- [ ] Можно создать Bento страницу с блоками, изменить их размер
- [ ] Можно вставить изображение/видео/GIF в блок
- [ ] WYSIWYG текст в bento-блоке работает (жирный, курсив, списки)
- [ ] Notion-like страница с полноценным редактором
- [ ] Edit/View переключение работает
- [ ] Древовидная навигация по страницам
- [ ] Все данные сохраняются в LocalStorage и восстанавливаются при перезагрузке
- [ ] Все тесты проходят
