export const connectToServer = (userName) => {
    const SERVER_URL = `ws://localhost:8081?username=${userName}`;

    const socket = new WebSocket(SERVER_URL); // экземпляр WebSocket

    // Обработчик события при открытии соединения
    socket.onopen = () => {
        console.log('Соединение установлено');
        // Отправляем данные аутентификации на сервер, например, имя пользователя
        socket.send(JSON.stringify({ type: 'authentication', username: userName }));
    };

    // Обработчик события при получении сообщения от сервера
    socket.onmessage = (event) => {
        console.log('Получено сообщение от сервера:', event.data);
        // Обрабатываем полученные данные, если это необходимо
    };

    // Обработчик события при закрытии соединения
    socket.onclose = () => {
        console.log('Соединение закрыто');
    };

    // Обработчик события при возникновении ошибки
    socket.onerror = (error) => {
        console.error('Ошибка соединения:', error.message);
    };

    return socket;
};
