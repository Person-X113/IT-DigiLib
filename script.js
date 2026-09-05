const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener("keyup", function () {

    const searchTerm =
        searchInput.value.toLowerCase();

    const yearCards =
        document.querySelectorAll(".year-card");


    yearCards.forEach(card => {

        const text =
            card.innerText.toLowerCase();


        if (text.includes(searchTerm)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});
