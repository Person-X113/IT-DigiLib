const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const searchTerm =
        searchInput.value.toLowerCase();

    const cards =
        document.querySelectorAll(".subject-card");

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = "block";
        } 
        else {
            card.style.display = "none";
        }
    });
});
