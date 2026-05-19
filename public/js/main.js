import { initMenu } from "./menu.js";
import { initProjectFilter } from "./projects.js";
import { initFaq } from "./faq.js";
import { initBackToTop } from "./scroll.js";
import { initContactForm } from "./contact.js";

document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initProjectFilter();
    initFaq();
    initBackToTop();
    initContactForm();
});