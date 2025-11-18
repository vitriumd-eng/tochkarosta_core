# ПРИМЕР: Frontend (Next.js) - Telegram WebApp flow snippet

1. Add a button on the login page:
```jsx
<button id="tg-login">Войти через Telegram</button>
```

2. Telegram WebApp init (example):
```js
// Using Telegram Web Apps
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.init();
  document.getElementById('tg-login').addEventListener('click', () => {
    // Use tg.WebApp.openTelegram or redirect to bot start with deep link
    // After authentication Telegram will provide initData
    const initData = tg.initData; // ПРИМЕР
    // Parse and send to gateway
    fetch('/gateway/oauth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'telegram',
        external_id: initData.user.id,
        username: initData.user.username,
        first_name: initData.user.first_name,
        signature: initData.hash // ПРИМЕР field name
      })
    }).then(r => r.json()).then(console.log);
  });
}
```

