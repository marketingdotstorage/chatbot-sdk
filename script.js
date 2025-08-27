let last_response_id = "";
let isOpen = false;
const SERVER_URL = "https://chatbot-api-production-860e.up.railway.app/api/v1/chatbot/chat";
// const SERVER_URL = "http://localhost:4200/api/v1/chatbot/chat";
const CSS_URL = "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/styles.css?q=1";
// const CSS_URL = "./styles.css";
const UNIT_URL = "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 5x5.png";


(function() {
    const chatbotHTML = `
            <div class="chatbox-box" id="ms-chatbox-wrapper">
                <div class="chatbox-header" style="background-color: ${window.STOR_BOT_CONFIG.primaryColor}">
                    <div class="chatbot-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/chatbot-avatar.png" />
                        <div class="chatbot-status">
                            <div>${window.STOR_BOT_CONFIG.botName}</div>
                            <div>
                                <div class="status-icon"></div>
                                <div>Online Now</div>
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ms-close-icon" id="ms-close-icon">
                            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="chatbox-messages" id="chatbox-messages">
                    <div class="message">
                        <div class="message-avatar">
                            <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/chatbot-avatar.png" />
                        </div>
                        <div class="message-content">
                            Hello! I am ${window.STOR_BOT_CONFIG.botName}, your storage assistant. How can I help you today?
                        </div>
                    </div>
                </div>
                <input type="text" id="chatbox-input" placeholder="Reply to ${window.STOR_BOT_CONFIG.botName}" />
            </div>
            <div class="chatbot-fab-wrapper">
                <div class="chatbot-fab" id="ms-chatbot-fab-btn" style="background-color: ${window.STOR_BOT_CONFIG.primaryColor}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ms-chat-icon">
                        <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
    `;

                        //     <div class="message">
                    //     <div class="message-avatar">

                    //     </div>
                    //     <div class="message-content pre-prompt" style="border: 1px solid ${window.STOR_BOT_CONFIG.primaryColor};">
                    //         Show me available units
                    //     </div>
                    // </div>
                    // <div class="message">
                    //     <div class="message-avatar">

                    //     </div>
                    //     <div class="message-content pre-prompt" style="border: 1px solid ${window.STOR_BOT_CONFIG.primaryColor};">
                    //         Show me available units
                    //     </div>
                    // </div>

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_URL;
    document.head.appendChild(link);

    link.onload = () => {
        const container = document.createElement("div");
        container.classList.add("ms-chatbot-container")
        container.innerHTML = chatbotHTML;
        document.body.appendChild(container);

        initListeners();
    };
})()

function initListeners() {

    document.querySelector("#ms-chatbot-fab-btn").addEventListener("click", function () {
        isOpen = !isOpen;

        if (isOpen) {
            document.querySelector("#ms-chatbox-wrapper").classList.add("show");

            setTimeout(() => {
                document.querySelector("#ms-chatbox-wrapper").style.opacity = "1";
                document.querySelector("#ms-chatbox-wrapper").style.transform = "translateY(0)";
            }, 10);
        } else {
            const chatbox = document.getElementById("ms-chatbox-wrapper");
            chatbox.style.opacity = "0";
            chatbox.style.transform = "translateY(30px)";
                
            setTimeout(() => {
                chatbox.classList.remove("show");
            }, 300);
        }
    })

    document.querySelector("#ms-close-icon").addEventListener("click", function () {
        isOpen = false;

        const chatbox = document.getElementById("ms-chatbox-wrapper");
        chatbox.style.opacity = "0";
        chatbox.style.transform = "translateY(30px)";
                
        setTimeout(() => {
            chatbox.classList.remove("show");
        }, 300);
    })

    document.querySelector("#chatbox-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const input = document.querySelector("#chatbox-input");
            const val = input.value.trim();

            document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                <div class="message message-user">
                    <div class="message-content" style="background-color: ${window.STOR_BOT_CONFIG.primaryColor}">
                        ${val}
                    </div>
                </div>    
            `);

            input.value = "";

            document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                <div class="message" id="message-loading">
                    <div class="message-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/chatbot-avatar.png" />
                    </div>
                                
                    <div class="message-content">
                        <div class="loader"></div>
                    </div>
                </div>    
            `);

            const element = document.querySelector("#chatbox-messages");
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth"
            });

            fetch(SERVER_URL, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: val, last_response_id, config_id: window.STOR_BOT_CONFIG.config_id }),
            }).then(response => response.json()).then(data => {
                document.querySelector("#message-loading").remove();

                last_response_id = data.last_response_id;

                if (data.chat && data.chat.length) {
                    document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                        <div class="message">
                            <div class="message-avatar">
                                <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/chatbot-avatar.png" />
                            </div>
                                    
                            <div class="message-content">
                                ${data.chat}
                            </div>
                        </div>    
                    `);
                }

                if (data.units && data.units.length) {
                    data.units.forEach((unit) => {
                        document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                            <div class="message">
                                <div class="message-avatar">
                                    <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/chatbot-avatar.png" />
                                </div>
                                        
                                <div class="message-content ms-unit-message">
                                    <img src="${UNIT_URL}" />
                                    <div class="ms-unit-details">
                                        <div>${unit.size} for $${unit.price}</div>
                                        <div>${unit.features}</div>
                                    </div>
                                </div>
                            </div>    
                        `);
                    })
                }

                const element = document.querySelector("#chatbox-messages");
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: "smooth"
                });
            });
        }
    })
}