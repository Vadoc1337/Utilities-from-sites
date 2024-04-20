// Немного отдает легаси кодом, но что поделать, не мы такие, жизнь такая
document.addEventListener("DOMContentLoaded", function () {
    // Click event for scroll links
    var scrollLinks = document.querySelectorAll(".scroll-link");
    scrollLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var targetId = this.getAttribute("data-target");
            scrollToElement(targetId);
        });
    });

    // Function to scroll to a specific element
    function scrollToElement(elementId) {
        var targetElement = document.getElementById(elementId);

        if (targetElement) {
            // Remove highlight class from any previously highlighted element
            var highlightedElements = document.querySelectorAll(".highlight");
            highlightedElements.forEach(function (highlightedElement) {
                highlightedElement.classList.remove("highlight");
            });

            // Use native JavaScript for smooth scrolling
            var start = window.pageYOffset;
            var targetOffset = targetElement.getBoundingClientRect().top;
            var startTime =
                "now" in window.performance
                    ? performance.now()
                    : new Date().getTime();

            function scroll() {
                var currentTime =
                    "now" in window.performance
                        ? performance.now()
                        : new Date().getTime();
                var time = Math.min(1, (currentTime - startTime) / 1000);

                window.scrollTo(0, start + targetOffset * easeInOutQuad(time));

                if (time < 1) requestAnimationFrame(scroll);
                else targetElement.classList.add("highlight");
            }

            scroll();
        }
    }

    // Easing function for smooth scrolling
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
});
