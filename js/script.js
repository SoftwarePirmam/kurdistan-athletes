const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".navbar nav");

if (toggle && nav) {
    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        document.body.classList.toggle("nav-lock", open);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
            document.body.classList.remove("nav-lock");
        });
    });
}

document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const lines = [];

        data.forEach((value, key) => {
            const label = key.replace(/-/g, " ");
            lines.push(`${label}: ${String(value).trim()}`);
        });

        const subject = encodeURIComponent(form.dataset.subject || "Kurdistan Athletes");
        const body = encodeURIComponent(lines.join("\n\n"));
        const address = form.dataset.mailto;

        window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;

        let note = form.querySelector(".form-note");
        if (!note) {
            note = document.createElement("p");
            note.className = "form-note";
            form.appendChild(note);
        }

        note.textContent = `Your email app should open with this message. If it does not, write to ${address}.`;
    });
});
