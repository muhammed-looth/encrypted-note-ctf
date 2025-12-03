const buttons = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".section");

buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        buttons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");

        sections.forEach(sec=>{
            sec.classList.remove("active");
            if(sec.id === btn.dataset.target) sec.classList.add("active");
        });
    });
});

console.log("%cMATRIX NODE ACCESS RECORDED.", "color:red; font-size:16px");
