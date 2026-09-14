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


    // Determine the current year
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


    // Load subjects
    if (year) {
        loadYearData(year);
    }

});


async function loadYearData(year) {

    try {

        const response = await fetch("data/library.json");

        if (!response.ok) {
            throw new Error("Could not load library.json");
        }

        const library = await response.json();

        const yearData = library[year];

        if (!yearData) {
            throw new Error("Year not found: " + year);
        }


        Object.entries(yearData).forEach(([semester, subjects]) => {

            const semesterContainer =
                document.querySelector(
                    `[data-semester="${semester}"]`
                );

            if (!semesterContainer) {
                console.warn(
                    "Semester container not found:",
                    semester
                );
                return;
            }


            const subjectGrid =
                semesterContainer.querySelector(
                    ".semester-card-grid"
                );

            if (!subjectGrid) {
                console.warn(
                    "Subject grid not found:",
                    semester
                );
                return;
            }


            // Remove placeholder content
            subjectGrid.innerHTML = "";


            // Create a card for every subject
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

    }

    catch (error) {

        console.error(
            "Error loading library data:",
            error
        );

    }

}
