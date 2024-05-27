export const connectToServer = (sender) => {
    const SERVER_URL = `ws://localhost:8082?sender=${sender}`;

    const socket = new WebSocket(SERVER_URL); // экземпляр WebSocket

    // Обработчик события при открытии соединения
    socket.onopen = () => {
        console.log('Соединение установлено');
        socket.send(JSON.stringify({ type: 'authentication', sender: sender }));
    };

    // Обработчик события при получении сообщения от сервера
    socket.onmessage = (event) => {
        console.log('Получено сообщение от сервера:', event.data);
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
