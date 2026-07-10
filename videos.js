// SECRET VIDEO FILES
// Pinapatugtog ng browser mismo yung mga video gamit ang native <video controls>.
// Kapag na-upload na yung video1.mp4 hanggang video10.mp4 sa parehong folder
// ng videos.html, awtomatiko na silang lalabas at magagana dito.

document.querySelectorAll(".video-card video").forEach((vid) => {
    vid.addEventListener("play", () => {
        console.log("Now playing:", vid.querySelector("source").src);
    });
});