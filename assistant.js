const responses = {
    "你好": "你好！我是AI助手，有什么可以帮你的吗？",
    "你是谁": "我是一个AI助手，可以回答你的问题和提供帮助。",
    "再见": "再见！如果还有问题随时问我。",
    "默认回复": "抱歉，我暂时无法理解你的问题。请换个方式问我吧！"
};

function addMessage(message, isUser) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getResponse(input) {
    const normalizedInput = input.toLowerCase().trim();
    return responses[normalizedInput] || responses["默认回复"];
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (message) {
        addMessage(message, true);
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response, false);
        }, 500);

        userInput.value = '';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 初始欢迎消息
window.onload = () => {
    addMessage("你好！我是AI助手，很高兴为你服务。", false);
};