// Example for chat.html - simple scroll and clear input
document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('message');

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;

        // Append message to chat box (demo)
        const userMessage = document.createElement('div');
        userMessage.textContent = `You: ${message}`;
        userMessage.style.marginBottom = "10px";
        chatBox.appendChild(userMessage);

        // Scroll chat box to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear input
        messageInput.value = "";

        // TODO: Add real send message to server code here (e.g., fetch or socket)
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById('chatBox');
    if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
});
