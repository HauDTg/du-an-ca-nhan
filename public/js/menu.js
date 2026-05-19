export function initMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (!menuToggle || !navbar) {
        return;
    }

    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("show");
    });

    const links = navbar.querySelectorAll("a");

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            navbar.classList.remove("show");
        });
    });
}