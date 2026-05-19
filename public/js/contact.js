export function initContactForm() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (!form || !formMessage) {
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.textContent = result.message || "Gửi yêu cầu thành công!";
                formMessage.style.color = "#16a34a";
                form.reset();
            } else {
                formMessage.textContent = "Có lỗi xảy ra, vui lòng thử lại.";
                formMessage.style.color = "#dc2626";
            }
        } catch (error) {
            formMessage.textContent = "Không thể gửi yêu cầu. Vui lòng thử lại sau.";
            formMessage.style.color = "#dc2626";
        }
    });
}