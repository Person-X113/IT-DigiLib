document.addEventListener("DOMContentLoaded", () => {

    // Get the current page name
    const currentPage = window.location.pathname.split("/").pop();

    // Homepage search
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        const yearCards = document.querySelectorAll(".year-card");

        searchInput.addEventListener("input", () => {
            const searchText = searchInput.value.toLowerCase();

            yearCards.forEach(card => {
                const text = card.textContent.toLowerCase();

                if (text.includes(searchText)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }


    // Determine which year is being displayed
    let year = "";

    if (currentPage === "fyit.html") {
        year = "FYIT";
    } 
    else if (currentPage === "syit.html") {
        year = "SYIT";
    } 
    else if (currentPage === "tyit.html") {
        year = "TYIT";
    }


    // Load semester and subject information
    if (year) {
        loadYearData(year);
    }

});


async function loadYearData(year) {

    try {

        const response = await fetch("data/library.json");

        if (!response.ok) {
            throw new Error("Unable to load library data.");
        }

        const library = await response.json();

        const yearData = library[year];

        if (!yearData) {
            console.error("Year not found:", year);
            return;
        }


        Object.entries(yearData).forEach(([semester, subjects]) => {

            const semesterContainer = document.querySelector(
                `[data-semester="${semester}"]`
            );

            if (!semesterContainer) {
                return;
            }

            const subjectGrid =
                semesterContainer.querySelector(".semester-card-grid");

            if (!subjectGrid) {
                return;
            }


            // Clear existing placeholder cards
            subjectGrid.innerHTML = "";


            // Create subject cards
            subjects.forEach(subject => {

                const card = document.createElement("div");

                card.className = "semester-card";

                card.innerHTML = `
                    <h3>${subject}</h3>
                    <p>
                        Books, notes, practicals, videos
                        and other learning resources.
                    </p>
                    <a href="#">
                        Explore Resources →
                    </a>
                `;

                subjectGrid.appendChild(card);

            });

        });

    } catch (error) {

        console.error("Error loading library:", error);

    }

}
