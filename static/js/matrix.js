console.log("%cACCESS LOGGED | TRACE INITIATED", "color:red; font-size:18px");

const redacted = document.querySelectorAll(".redacted");

redacted.forEach(el => {
    el.addEventListener("click", () => {
        el.style.transition = "0.5s";
        el.style.background = "transparent";
        el.style.color = "#00ff9f";
        el.innerText = el.dataset.real || "UNMASKED";
    });
});

// Fake location reveal effect
setTimeout(() => {
    document.getElementById("location").innerHTML = "Mumbai, India";
}, 5000);
