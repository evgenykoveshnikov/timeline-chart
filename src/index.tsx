import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import '../src/styles/global.scss'; // Глобальные стили (опционально)

// Получаем корневой элемент
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);