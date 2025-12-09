// Secret encrypted values
const encrypted = [145, 233, 352, 91, 187];
let keys = encrypted.map(v => ((v ^ 133) % 91) + 5);

const panel = document.getElementById("panel");

// Load audio
const staticSound = new Audio("/static/audio/tune.mp3");
const successSound = new Audio("/static/audio/hum.mp3");
const unlockSound = new Audio("/static/audio/unlock.mp3");

staticSound.volume = 0.3;
successSound.volume = 0.7;

keys.forEach(value => {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 1;
  slider.max = 100;
  slider.value = Math.floor(Math.random() * 100);
  slider.classList.add("slider");
  slider.dataset.target = value;

  slider.addEventListener("input", () => staticSound.play());
  panel.appendChild(slider);
});

function checkAll() {
  let complete = true;

  document.querySelectorAll(".slider").forEach(slider => {
    if (Math.abs(slider.value - slider.dataset.target) < 3) {
      slider.classList.add("correct");
      successSound.play();
    } else {
      slider.classList.remove("correct");
      complete = false;
    }
  });

  if (complete) revealFlag();
}

document.addEventListener("input", checkAll);

function revealFlag() {
  const flag = document.getElementById("flag");
  document.body.classList.add("flash");
  unlockSound.play();

  flag.classList.remove("hidden");
  flag.innerHTML = `
  <span style="color:#ff004c;">ACCESS GRANTED</span><br><br>
  <strong>Hidden-Key-Fragment Part (7):<br><br>   NEtKcW1IQ1F4ZmRPWWI1cGp0VVZRQ2V2ZXdLQmdRRFpJL1h3RWNsMVBWSGV2QzJQeFRqaUlpK2FXUnAwNVFxWQphclJKT1ZUOGhGRmZveEUzRWZMUitmY3VtOGhlZUtabUpLNTFrL2VWZXJSRURYWFBJYlNGL1JFWnR5UlJZQ0NBCkhWelFkUzkwM3YzZ2Y0WEJ4bit3aDNsTlpUSEFSUzJxTkZlN042U1Z6R24relVjZlBoUFdmSjV0Sk9YZ0VEcWg=  </strong>
  <strong><br><br>!NEXT CHALLENGE! <br><br> https://encrypted-note-ctf.onrender.com/ed9d3d832af899035363a69fd53cd3be8f71501c </strong>
  `;
  flag.style.opacity = 1;
}
