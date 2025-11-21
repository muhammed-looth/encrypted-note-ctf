console.log("Chat system active.");


function sendMessage() {
const msg = document.getElementById("msgInput").value;
if (!msg) return;


const box = document.getElementById("chatBox");
const div = document.createElement("div");
div.textContent = msg;
box.appendChild(div);


document.getElementById("msgInput").value = "";
}


// Deep hidden hint inside reversed string
tconst = "FF9B22A0_tnirp_4tratS";
// reverse it manually