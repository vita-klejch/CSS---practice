export default function toggleTheme(toggleTrigger, className, activateDarkMode = false) {
    toggleTrigger.addEventListener("click", () => {
        document.body.classList.toggle(className);
    });
    if (activateDarkMode) {
        document.body.classList.toggle("dark-mode");
    }
}
