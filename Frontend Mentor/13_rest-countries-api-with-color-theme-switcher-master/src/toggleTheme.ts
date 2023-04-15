export default function toggleTheme(
  toggleTrigger: Element,
  className: string,
  activateDarkMode: boolean = false
) {
  toggleTrigger.addEventListener("click", () => {
    document.body.classList.toggle(className);
  });

  if (activateDarkMode) {
    document.body.classList.toggle("dark-mode");
  }
}
