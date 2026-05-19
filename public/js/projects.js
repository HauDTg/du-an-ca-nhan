export function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterButtons.length === 0 || projectCards.length === 0) {
        return;
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.getAttribute("data-filter");

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            projectCards.forEach(function (card) {
                const category = card.getAttribute("data-category");

                if (filter === "all" || filter === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}