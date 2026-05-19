export function initFaq() {
    const faqButtons = document.querySelectorAll(".faq-item button");

    if (faqButtons.length === 0) {
        return;
    }

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const currentItem = button.parentElement;

            document.querySelectorAll(".faq-item").forEach(function (item) {
                if (item !== currentItem) {
                    item.classList.remove("open");
                }
            });

            currentItem.classList.toggle("open");
        });
    });
}