// 创建神经网络
const net = new brain.recurrent.LSTM();

// 训练数据
const trainingData = [
    { input: "你好", output: "greeting" },
    { input: "嗨", output: "greeting" },
    { input: "早上好", output: "greeting" },
    { input: "晚上好", output: "greeting" },
    { input: "再见", output: "farewell" },
    { input: "拜拜", output: "farewell" },
    { input: "下次见", output: "farewell" },
    { input: "你是谁", output: "identity" },
    { input: "你叫什么名字", output: "identity" },
    { input: "介绍一下自己", output: "identity" }
];

// 回复模板
const responses = {
    "greeting": [
        "你好！很高兴见到你！",
        "嗨！有什么我可以帮你的吗？",
        "你好啊！今天过得怎么样？"
    ],
    "farewell": [
        "再见！希望很快能再次见到你！",
        "拜拜！祝你有愉快的一天！",
        "下次见！"
    ],
    "identity": [
        "我是你的AI助手，使用Brain.js开发！",
        "我是一个简单的聊天机器人，随时准备帮助你。",
        "你可以叫我小助手，很高兴认识你！"
    ],
    "unknown": [
        "抱歉，我可能没有理解你的意思。",
        "能换个方式说吗？",
        "这个问题有点难，我们聊点别的吧。"
    ]
};

// 训练网络
console.log('开始训练模型...');
net.train(trainingData, {
    iterations: 2000,
    errorThresh: 0.005,
    log: true,
    logPeriod: 100
});
console.log('模型训练完成！');

function getRandomResponse(category) {
    const possibleResponses = responses[category] || responses.unknown;
    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}

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

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (message) {
        addMessage(message, true);
        userInput.value = '';

        // 使用模型预测类别
        const output = net.run(message);
        const response = getRandomResponse(output);

        setTimeout(() => {
            addMessage(response, false);
        }, 500);
    }
}

// 页面加载时显示欢迎信息
window.onload = () => {
    addMessage("你好！我是基于Brain.js的AI助手，很高兴为你服务！", false);
};