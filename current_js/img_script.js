document.querySelectorAll(".prikaz").forEach((notText, index) => {
    const popups = document.querySelectorAll(".popup");
    const popup = popups[index];

    notText.addEventListener("click", () => {
        popups.forEach((p) => {
            p.style.display = "none";
            p.classList.remove("fadeOut");
        });

        popup.style.display = "block";
    });

    document.addEventListener("click", (event) => {
        const closeButton = event.target.closest(".close-button");
        if (closeButton && popup.contains(closeButton)) {
            closePopup(popup);
        } else if (
            !popup.contains(event.target) &&
            event.target !== notText &&
            popup.style.display === "block"
        ) {
            closePopup(popup);
        }
    });

    function closePopup(currentPopup) {
        currentPopup.classList.add("fadeOut");
        setTimeout(() => {
            currentPopup.style.display = "none";
            currentPopup.classList.remove("fadeOut");
        }, 700);
    }
});

function openInFullSize(link) {
    const currentPopup = link.closest(".popup");
    window.open(currentPopup.querySelector("img").src, "_blank");
    currentPopup.style.display = "none";
}
