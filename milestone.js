// Milestone page — reveal each milestone item as the user scrolls to it
document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".m-item");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    items.forEach(function (item) {
        observer.observe(item);
    });

    // Click-to-enlarge photo lightbox
    const modal = document.getElementById("milestoneModal");
    const modalImg = document.getElementById("milestoneModalImg");
    const photos = document.querySelectorAll(".m-photo");

    photos.forEach(function (photo) {
        photo.addEventListener("click", function () {
            modalImg.src = photo.src;
            modalImg.alt = photo.alt;
            modal.style.display = "flex";
        });
    });

    if (modal) {
        modal.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }
});