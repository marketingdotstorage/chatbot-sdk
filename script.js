let last_response_id = "";
let isOpen = false;
let firstOpen = true;
let chat_config = {};

// const CSS_URL = "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/styles.css";
const CSS_URL = "http://localhost:5500/styles.css";
const SERVER_URL = window.UNIT_BOT_CONFIG.server_url || "https://chatbot-api-production-860e.up.railway.app/api/v1";
let disabled = true;

const imgMap = {
    "5x5": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 5x5.png",
    "5x10": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 5x10.png",
    "10x10": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 10x10.png",
    "10x15": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 10x15.png",
    "10x20": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 10x20.png",
    "10x30": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 10x30.png",
    "vehiclexstorage": "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - vehicle.png",
};

(function() {
    const chatbotHTML = `
            <div class="chatbox-box" id="ms-chatbox-wrapper">
                <div class="chatbox-header" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor}">
                    <div class="chatbot-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                        <div class="chatbot-status">
                            <div>UnitBot <span class="beta-badge">BETA</span></div>
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
                <div class="chatbox-messages" id="chatbox-messages"></div>
                <div class="chatbot-send">
                    <input type="text" id="chatbox-input" placeholder="Reply to UnitBot" />
                    <button id="ms-send-btn" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor}">Send</button>
                </div>
            </div>
            <div class="chatbot-fab-wrapper">
                <div class="chatbot-fab" id="ms-chatbot-fab-btn" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ms-chat-icon">
                        <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
    `;

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

        fetch(SERVER_URL + "/chatconfig/" + window.UNIT_BOT_CONFIG.config_id, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
        }).then((data) => data.json()).then((data) => {
            if (data) chat_config = data;
        })
    };
})()

function addLoader() {
    if (document.querySelector("#message-loading")) {
        document.querySelector("#message-loading").remove();
    }
    document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
        <div class="message" id="message-loading">
            <div class="message-avatar">
                <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
            </div>
                                
            <div class="message-content">
                <div class="loader"></div>
            </div>
        </div>    
    `);
}

function handleFirstLoad() {
        addLoader();
        setTimeout(() => {
            document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                <div class="message">
                    <div class="message-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                    </div>
                    <div class="message-content">
                        Hello! I am UnitBot, your storage assistant. I'm here to get you into the best storage unit today.
                    </div>
                </div>
            `);

            
            document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                <div class="message">
                    <div class="message-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                    </div>
                    <div class="message-content">
                        What do you need to store?
                    </div>
                </div>
            `);
            document.querySelector("#message-loading").remove();
        }, 1000)

        addLoader();
        disabled = false;
            
            // setTimeout(() => {
            //     document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
            //         <div class="message message-user ms-pre-prompt">
            //             <div class="message-avatar">

            //             </div>
            //             <div class="message-content" onclick="addMessage('Show me available units')" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor};">
            //                 Show me available units
            //             </div>
            //         </div>
            //     `);
            // }, 1500)        
}

function handleFabClick() {
    isOpen = !isOpen;
    if (firstOpen) handleFirstLoad();
    
    const chatbox = document.getElementById("ms-chatbox-wrapper");

    if (isOpen) {
        chatbox.style.display = "block";
        chatbox.style.opacity = "";
        chatbox.style.transform = "";
        void chatbox.offsetWidth;
        chatbox.classList.add("show");
    } else {
        chatbox.classList.remove("show");
                
        setTimeout(() => {
            chatbox.style.display = "none";
        }, 300);
    }
    firstOpen = false;
}

function initListeners() {
    document.getElementById("ms-chatbox-wrapper").style.display = "none";
    document.querySelector("#ms-chatbot-fab-btn").addEventListener("click", handleFabClick)

    document.querySelector("#ms-close-icon").addEventListener("click", function () {
        isOpen = false;

        const chatbox = document.getElementById("ms-chatbox-wrapper");
        chatbox.style.opacity = "0";
        chatbox.style.transform = "translateY(30px)";
                
        setTimeout(() => {
            chatbox.classList.remove("show");
            chatbox.style.display = "none";
        }, 300);
    })

    document.querySelector("#chatbox-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const input = document.querySelector("#chatbox-input");
            const val = input.value.trim();

            if (val.length) addMessage(val, input);
        }
    })

    document.querySelector("#ms-send-btn").addEventListener("click", function() {
        const input = document.querySelector("#chatbox-input");
        const val = input.value.trim();

        if (val.length) addMessage(val, input);
    })
}

function rentUnit(pricingGroupId, url) {
    const cartId = ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, e => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16))
    localStorage.setItem("@CUBBY/CART", JSON.stringify({cartId: cartId, pricingGroups: [pricingGroupId], selectedValueTier: null}));
    console.log(url);
    window.location.href = url;
}

function getImageUrl(dimensions) {
    const imgUrl = imgMap[`${dimensions[0]}x${dimensions[1]}`];
    if (imgUrl) return imgUrl;

    return "https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/Unit - NoSize - 5x10.png";
}

function addMessage(message, input) {
    if (disabled) return;

    document.querySelectorAll(".ms-pre-prompt").forEach((el) => {
        el.remove();
    })

    document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
        <div class="message message-user">
            <div class="message-content" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor}">
                ${message}
            </div>
        </div>    
    `);

    if (input) input.value = "";
    disabled = true;
    addLoader();

    const element = document.querySelector("#chatbox-messages");
    element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth"
    });

    fetch(SERVER_URL + "/chatbot/chat", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message, last_response_id, config_id: window.UNIT_BOT_CONFIG.config_id, origin_url: window.location.origin }),
    }).then(response => response.json()).then(data => {
        disabled = false;
        document.querySelector("#message-loading").remove();

        last_response_id = data.last_response_id;
        let chat = "";

        try {
            const parsed = JSON.parse(data.data);
            chat = parsed.message;
        } catch (er) {
            chat = data.data;
        }

        if (data.facilities && data.facilities.length) {
            data.facilities.forEach((facility) => {
                document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                    <div class="message">
                        <div class="message-avatar">
                            <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                        </div>

                        <div class="message-content ms-facility-message">
                            <div>
                                <div class="facility-name">${facility.name}</div>
                                <div class="address">${facility.address.full_address}</div>
                            </div>
                            <svg onclick="addMessage('${facility.name}')" class="select-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
                            </svg>
                        </div>
                    </div>
                `)
            })
        }

        if (data.units && data.units.length) {
            data.units.forEach((unit) => {
                document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                    <div class="message">
                        <div class="message-avatar">
                            <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                        </div>
                                        
                        <div class="message-content ms-unit-message">
                            <img src="${getImageUrl(unit.dimensions)}" />
                            <div class="ms-unit-details">
                                <div>${unit.size} for $${unit.price}</div>
                                <div>${unit.features}</div>
                                <div class="ms-unit-ctas">
                                    ${unit.rent_url ? `<div onclick="rentUnit('${unit.pricingGroupId}', '${unit.rent_url}')" style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor};">Rent Now</div>` : ""}
                                    ${unit.reserve_url ? `<a href="${unit.reserve_url}"><div style="background-color: ${window.UNIT_BOT_CONFIG.primaryColor};">Reserve</div></a>` : ""}
                                </div>
                            </div>
                        </div>
                    </div>    
                `);
            })
        }

        if (chat.length) {
            document.querySelector("#chatbox-messages").insertAdjacentHTML("beforeend", `
                <div class="message">
                    <div class="message-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/marketingdotstorage/chatbot-sdk@main/assets/unitbot.png" />
                    </div>
                                    
                    <div class="message-content">
                        ${chat}
                    </div>
                </div>    
            `);
        }


        try {
            const parsed = JSON.parse(data.data);
            const intent = parsed.intent;

            if (intent === "request_location")  {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const zipCode = await getZipCode(position.coords.latitude, position.coords.longitude);
                    
                    if (zipCode) {
                        addMessage(zipCode);
                    }
                });
            }
        } catch (er) {}

        const element = document.querySelector("#chatbox-messages");
        element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth"
        });
    }).catch((error) => {
        disabled = false;
    })
}

async function getZipCode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Unitbot/1.0' }
  });
  const data = await res.json();

  return data?.address?.postcode || null;
}