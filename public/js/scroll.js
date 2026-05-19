export function initBackToTop() {
    const backToTop = document.getElementById("backToTop");

    if (!backToTop) {
        return;
    }

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}