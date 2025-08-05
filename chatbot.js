// 神秘占卜 ChatBot 類別
class MysticChatBot {
    constructor() {
        // ⚠️ 重要：請替換為您的 n8n webhook URL
        this.webhookUrl = 'https://jackywu.app.n8n.cloud/webhook/chat';
		
        // 初始化 session ID
        this.sessionId = this.getOrCreateSessionId();
        
        // 創建神秘占卜 UI
        this.createMysticChatBotUI();
        
        // DOM 元素
        this.chatbotToggle = document.getElementById('mysticChatbotToggle');
        this.chatbotPanel = document.getElementById('mysticChatbotPanel');
        this.chatbotClose = document.getElementById('mysticChatbotClose');
        this.messagesContainer = document.getElementById('mysticChatMessages');
        this.messageInput = document.getElementById('mysticMessageInput');
        this.sendButton = document.getElementById('mysticSendButton');
        this.typingIndicator = document.getElementById('mysticTypingIndicator');
        this.notificationBadge = document.getElementById('mysticNotificationBadge');
        
        // 綁定事件
        this.bindEvents();
        
        // 載入對話歷史
        this.loadChatHistory();
        
        // 啟動背景動畫
        this.startMysticAnimations();
        
        console.log('神秘占卜聊天機器人初始化完成，Session ID:', this.sessionId);
    }
    
    createMysticChatBotUI() {
        // 創建神秘占卜 CSS 樣式
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');
            
            .mystic-chatbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: 'Crimson Text', serif;
            }

            .mystic-chatbot-toggle {
                width: 70px;
                height: 70px;
                background: radial-gradient(circle at center, #1a0033, #2d1b69, #0f001f);
                border: 3px solid #9d4edd;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 
                    0 0 20px rgba(157, 78, 221, 0.6),
                    0 0 40px rgba(157, 78, 221, 0.3),
                    inset 0 0 20px rgba(157, 78, 221, 0.1);
                transition: all 0.4s ease;
                color: #e0aaff;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: mysticPulse 3s ease-in-out infinite;
                overflow: hidden;
            }

            .mystic-chatbot-toggle::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: conic-gradient(from 0deg, #9d4edd, #c77dff, #e0aaff, #f3e8ff, #9d4edd);
                border-radius: 50%;
                z-index: -1;
                animation: rotate 4s linear infinite;
            }

            @keyframes mysticPulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 
                        0 0 20px rgba(157, 78, 221, 0.6),
                        0 0 40px rgba(157, 78, 221, 0.3);
                }
                50% { 
                    transform: scale(1.05);
                    box-shadow: 
                        0 0 30px rgba(157, 78, 221, 0.8),
                        0 0 60px rgba(157, 78, 221, 0.4);
                }
            }

            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .mystic-chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 
                    0 0 30px rgba(157, 78, 221, 0.8),
                    0 0 60px rgba(157, 78, 221, 0.5);
            }

            .mystic-chatbot-panel {
                position: absolute;
                bottom: 90px;
                right: 0;
                width: 380px;
                height: 550px;
                background: linear-gradient(135deg, #0f001f 0%, #1a0033 50%, #2d1b69 100%);
                border-radius: 20px;
                box-shadow: 
                    0 20px 40px rgba(0,0,0,0.7),
                    0 0 20px rgba(157, 78, 221, 0.3),
                    inset 0 1px 0 rgba(255,255,255,0.1);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 2px solid rgba(157, 78, 221, 0.5);
                backdrop-filter: blur(10px);
            }

            .mystic-chatbot-panel::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(157, 78, 221, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(199, 125, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(224, 170, 255, 0.05) 0%, transparent 50%);
                pointer-events: none;
                z-index: 0;
            }

            .mystic-chatbot-panel.active {
                display: flex;
                animation: mysticSlideUp 0.5s ease-out;
            }

            @keyframes mysticSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .mystic-chatbot-header {
                background: linear-gradient(135deg, #2d1b69 0%, #9d4edd 100%);
                color: #f3e8ff;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                z-index: 1;
                border-bottom: 1px solid rgba(157, 78, 221, 0.3);
            }

            .mystic-chatbot-title {
                font-size: 18px;
                font-weight: 600;
                font-family: 'Cinzel', serif;
                text-shadow: 0 0 10px rgba(157, 78, 221, 0.5);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .mystic-chatbot-close {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(157, 78, 221, 0.3);
                color: #f3e8ff;
                font-size: 18px;
                cursor: pointer;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .mystic-chatbot-close:hover {
                background: rgba(157, 78, 221, 0.3);
                transform: rotate(90deg);
                box-shadow: 0 0 15px rgba(157, 78, 221, 0.5);
            }

            .mystic-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                background: rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 1;
            }

            .mystic-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.5;
                word-wrap: break-word;
                font-size: 14px;
                animation: mysticMessageSlide 0.4s ease-out;
                position: relative;
                backdrop-filter: blur(5px);
            }

            @keyframes mysticMessageSlide {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .mystic-message.user {
                background: linear-gradient(135deg, #9d4edd, #c77dff);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 6px;
                box-shadow: 0 4px 15px rgba(157, 78, 221, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .mystic-message.ai {
                background: linear-gradient(135deg, rgba(15, 0, 31, 0.9), rgba(45, 27, 105, 0.9));
                color: #e0aaff;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(157, 78, 221, 0.3);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .mystic-message.system {
                background: linear-gradient(135deg, rgba(45, 27, 105, 0.8), rgba(157, 78, 221, 0.8));
                color: #f3e8ff;
                align-self: center;
                font-size: 13px;
                max-width: 90%;
                text-align: center;
                font-style: italic;
                border: 1px solid rgba(157, 78, 221, 0.5);
            }

            .mystic-message.error-message {
                background: linear-gradient(135deg, #6a0572, #ab2567);
                color: #ffc0cb;
                align-self: center;
                font-size: 13px;
                max-width: 90%;
                text-align: center;
                border: 1px solid rgba(171, 37, 103, 0.5);
            }

            .mystic-typing-indicator {
                display: none;
                align-self: flex-start;
                padding: 12px 16px;
                background: linear-gradient(135deg, rgba(15, 0, 31, 0.9), rgba(45, 27, 105, 0.9));
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(157, 78, 221, 0.3);
                backdrop-filter: blur(5px);
            }

            .mystic-typing-dots {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .mystic-typing-dot {
                width: 8px;
                height: 8px;
                background: #9d4edd;
                border-radius: 50%;
                animation: mysticTyping 1.8s infinite;
                box-shadow: 0 0 6px rgba(157, 78, 221, 0.5);
            }

            .mystic-typing-dot:nth-child(2) {
                animation-delay: 0.3s;
            }

            .mystic-typing-dot:nth-child(3) {
                animation-delay: 0.6s;
            }

            @keyframes mysticTyping {
                0%, 60%, 100% {
                    transform: scale(0.8);
                    opacity: 0.4;
                }
                30% {
                    transform: scale(1.2);
                    opacity: 1;
                    box-shadow: 0 0 12px rgba(157, 78, 221, 0.8);
                }
            }

            .mystic-chat-input {
                padding: 20px;
                border-top: 1px solid rgba(157, 78, 221, 0.3);
                display: flex;
                gap: 12px;
                background: linear-gradient(135deg, rgba(15, 0, 31, 0.8), rgba(45, 27, 105, 0.8));
                position: relative;
                z-index: 1;
                backdrop-filter: blur(10px);
            }

            .mystic-input-field {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid rgba(157, 78, 221, 0.3);
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: all 0.3s ease;
                background: rgba(15, 0, 31, 0.6);
                color: #e0aaff;
                font-family: 'Crimson Text', serif;
                backdrop-filter: blur(5px);
            }

            .mystic-input-field::placeholder {
                color: rgba(224, 170, 255, 0.6);
                font-style: italic;
            }

            .mystic-input-field:focus {
                border-color: #9d4edd;
                box-shadow: 0 0 15px rgba(157, 78, 221, 0.4);
                background: rgba(15, 0, 31, 0.8);
            }

            .mystic-send-button {
                padding: 12px 20px;
                background: linear-gradient(135deg, #9d4edd 0%, #c77dff 100%);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                font-family: 'Cinzel', serif;
                box-shadow: 0 4px 15px rgba(157, 78, 221, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .mystic-send-button:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(157, 78, 221, 0.5);
                background: linear-gradient(135deg, #c77dff 0%, #e0aaff 100%);
            }

            .mystic-send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
                background: linear-gradient(135deg, rgba(157, 78, 221, 0.3), rgba(199, 125, 255, 0.3));
            }

            .mystic-notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: radial-gradient(circle, #ab2567, #6a0572);
                color: white;
                border-radius: 50%;
                font-size: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                animation: mysticPulseNotification 2s infinite;
                font-weight: bold;
                border: 2px solid #9d4edd;
                box-shadow: 0 0 15px rgba(171, 37, 103, 0.6);
            }

            @keyframes mysticPulseNotification {
                0% { 
                    transform: scale(1);
                    box-shadow: 0 0 15px rgba(171, 37, 103, 0.6);
                }
                50% { 
                    transform: scale(1.15);
                    box-shadow: 0 0 25px rgba(171, 37, 103, 0.8);
                }
                100% { 
                    transform: scale(1);
                    box-shadow: 0 0 15px rgba(171, 37, 103, 0.6);
                }
            }

            /* 星星背景動畫 */
            .mystic-stars {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
            }

            .mystic-star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: #e0aaff;
                border-radius: 50%;
                animation: twinkle 3s ease-in-out infinite;
            }

            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
            }

            /* 響應式設計 */
            @media (max-width: 768px) {
                .mystic-chatbot-panel {
                    width: 350px;
                    height: 500px;
                    bottom: 80px;
                }
            }

            @media (max-width: 480px) {
                .mystic-chatbot-widget {
                    bottom: 15px;
                    right: 15px;
                }
                
                .mystic-chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                }
                
                .mystic-chatbot-panel {
                    width: calc(100vw - 30px);
                    height: 75vh;
                    bottom: 85px;
                    right: -15px;
                }
            }

            .mystic-chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .mystic-chat-messages::-webkit-scrollbar-track {
                background: rgba(15, 0, 31, 0.3);
                border-radius: 3px;
            }

            .mystic-chat-messages::-webkit-scrollbar-thumb {
                background: rgba(157, 78, 221, 0.5);
                border-radius: 3px;
            }

            .mystic-chat-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(157, 78, 221, 0.7);
            }
        `;
        document.head.appendChild(style);
        
        // 創建神秘占卜 ChatBot HTML
        const chatbotHTML = `
            <div class="mystic-chatbot-widget" id="mysticChatbotWidget">
                <button class="mystic-chatbot-toggle" id="mysticChatbotToggle">
                    🔮
                    <div class="mystic-notification-badge" id="mysticNotificationBadge">!</div>
                </button>
                
                <div class="mystic-chatbot-panel" id="mysticChatbotPanel">
                    <div class="mystic-stars" id="mysticStars"></div>
                    
                    <div class="mystic-chatbot-header">
                        <div class="mystic-chatbot-title">
                            ✨ 神秘占卜師 ✨
                        </div>
                        <button class="mystic-chatbot-close" id="mysticChatbotClose">
                            ✕
                        </button>
                    </div>
                    
                    <div class="mystic-chat-messages" id="mysticChatMessages">
                        <div class="mystic-message system">
                            🌟 歡迎來到神秘的占卜世界 🌟<br>
                            我是您的專屬占卜師，可以為您解答命運的疑問...
                        </div>
                    </div>
                    
                    <div class="mystic-typing-indicator" id="mysticTypingIndicator">
                        <div class="mystic-typing-dots">
                            <div class="mystic-typing-dot"></div>
                            <div class="mystic-typing-dot"></div>
                            <div class="mystic-typing-dot"></div>
                        </div>
                    </div>
                    
                    <div class="mystic-chat-input">
                        <input 
                            type="text" 
                            class="mystic-input-field" 
                            id="mysticMessageInput" 
                            placeholder="訴說您心中的疑問..."
                            maxlength="500"
                        >
                        <button class="mystic-send-button" id="mysticSendButton" disabled>占卜</button>
                    </div>
                </div>
            </div>
        `;
        
        // 插入到 body 末尾
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    startMysticAnimations() {
        // 創建星星背景
        this.createStars();
        
        // 每隔一段時間重新生成星星
        setInterval(() => {
            this.createStars();
        }, 10000);
    }
    
    createStars() {
        const starsContainer = document.getElementById('mysticStars');
        if (!starsContainer) return;
        
        // 清除舊星星
        starsContainer.innerHTML = '';
        
        // 創建新星星
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'mystic-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 3) + 's';
            starsContainer.appendChild(star);
        }
    }
    
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('mystic_chatbot_session_id');
        if (!sessionId) {
            sessionId = 'mystic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('mystic_chatbot_session_id', sessionId);
        }
        return sessionId;
    }
    
    bindEvents() {
        // 聊天機器人開關
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        this.chatbotClose.addEventListener('click', () => {
            this.closeChatbot();
        });
        
        // 發送按鈕點擊事件
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 輸入框按鍵事件
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 輸入框輸入事件
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = this.messageInput.value.trim() === '';
        });
        
        // 點擊外部關閉聊天機器人
        document.addEventListener('click', (e) => {
            if (!this.chatbotToggle.contains(e.target) && 
                !this.chatbotPanel.contains(e.target) && 
                this.chatbotPanel.classList.contains('active')) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        if (this.chatbotPanel.classList.contains('active')) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.chatbotPanel.classList.add('active');
        this.messageInput.focus();
        this.hideNotification();
        this.scrollToBottom();
    }
    
    closeChatbot() {
        this.chatbotPanel.classList.remove('active');
    }
    
    showNotification() {
        this.notificationBadge.style.display = 'flex';
    }
    
    hideNotification() {
        this.notificationBadge.style.display = 'none';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // 顯示用戶訊息
        this.addMessage(message, 'user');
        
        // 清空輸入框並禁用發送按鈕
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // 顯示打字指示器
        this.showTypingIndicator();
        
        try {
            // 發送請求到 n8n webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.message) {
                this.addMessage(data.message, 'ai');
                
                // 儲存對話到本地
                this.saveChatToLocal(message, data.message);
                
                // 如果聊天機器人已關閉，顯示通知
                if (!this.chatbotPanel.classList.contains('active')) {
                    this.showNotification();
                }
            } else {
                throw new Error('神秘力量無法感應');
            }
            
        } catch (error) {
            console.error('占卜時發生神秘干擾:', error);
            this.addMessage('🌙 抱歉，神秘的力量暫時受到干擾，請稍後再試...', 'error-message');
        } finally {
            // 隱藏打字指示器
            this.hideTypingIndicator();
        }
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mystic-message ${type}`;
        messageDiv.textContent = content;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    saveChatToLocal(userMessage, aiMessage) {
        const chatHistory = JSON.parse(localStorage.getItem('mystic_chatbot_history') || '[]');
        
        chatHistory.push({
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userMessage: userMessage,
            aiMessage: aiMessage
        });
        
        // 限制歷史記錄數量（最多保存 100 條）
        if (chatHistory.length > 100) {
            chatHistory.splice(0, chatHistory.length - 100);
        }
        
        localStorage.setItem('mystic_chatbot_history', JSON.stringify(chatHistory));
    }
    
    loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem('mystic_chatbot_history') || '[]');
        const currentSessionHistory = chatHistory.filter(chat => chat.sessionId === this.sessionId);
        
        // 只載入最近的 10 條對話
        const recentHistory = currentSessionHistory.slice(-10);
        
        recentHistory.forEach(chat => {
            this.addMessage(chat.userMessage, 'user');
            this.addMessage(chat.aiMessage, 'ai');
        });
        
        if (recentHistory.length === 0) {
            // 如果沒有歷史記錄，顯示神秘歡迎訊息
            setTimeout(() => {
                this.addMessage('🔮 我感受到了您的到來... 命運的絲線正在交織，有什麼困擾著您的心靈嗎？讓我為您揭開迷霧，探尋答案... ✨', 'ai');
            }, 1500);
        }
    }
    
    // 清除對話歷史的方法（可以在控制台調用）
    clearHistory() {
        localStorage.removeItem('mystic_chatbot_history');
        localStorage.removeItem('mystic_chatbot_session_id');
        location.reload();
    }
}

// 初始化神秘占