const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

const glitch = document.getElementById("glitchSound");
const pulse = document.getElementById("pulseSound");
const unlock = document.getElementById("unlockSound");

let echoCount = 0;
let unlocked = false;

function print(text) {
    output.innerHTML += text + "\n";
    output.scrollTop = output.scrollHeight;
}

function glitchFlash() {
    document.body.style.background = "#0f0";
    setTimeout(() => {
        document.body.style.background = "#010101";
    }, 90);
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const cmd = input.value.trim();
        input.value = "";

        print("> " + cmd);

        if (!unlocked) handleCommand(cmd);
    }
});

function handleCommand(cmd) {
    glitch.play();

    // random glitch flash
    if (Math.random() > 0.6) glitchFlash();

    // commands that progress the puzzle
    if (cmd.toLowerCase() === "echo") {
        echoCount++;
        pulse.play();
        print("...the echo listens...");
        
        if (echoCount === 4) {
            secretReveal();
        }
    } else if (cmd.toLowerCase() === "help") {
        print("commands: echo, listen, trace");
    } else if (cmd.toLowerCase() === "listen") {
        print("you hear... static.");
    } else if (cmd.toLowerCase() === "trace") {
        print("trace incomplete. signal weak.");
    } else {
        print("unknown command.");
    }
}

// FINAL SECRET REVEAL
function secretReveal() {
    unlocked = true;

    setTimeout(() => {
        unlock.play();
        print("\n=== SIGNAL RESTORED ===\n");
        print("KEY PART 9:\n");
        print("LS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS0KTUlJRXZ3SUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2t3Z2dTbEFnRUFBb0lCQVFEUUJPZWpydnJUTVFlagowcno5OEI1Mmpod2lSTk5leThDYmplRE9rVGQrR0V5Nk5zK0orc3RWbjUycE1iMFAxWTdTYkFNalF0TjJVZUd1");
        print("\nNEXT: https://encrypted-note-ctf.onrender.com/9424ac79de34c97c74261622b533d185ca13968a");
    }, 2000);
}
