
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

                card.style.display = text.includes(searchText) ? "" : "none";

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

    // Load subject resources
    if (currentPage === "subject.html") {
        loadSubjectData();
    }

});


// Load subjects for each year
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
                document.querySelector(`[data-semester="${semester}"]`);

            if (!semesterContainer) {
                console.warn("Semester container not found:", semester);
                return;
            }

            const subjectGrid =
                semesterContainer.querySelector(".semester-card-grid");

            if (!subjectGrid) {
                console.warn("Subject grid not found:", semester);
                return;
            }

            subjectGrid.innerHTML = "";

            subjects.forEach(subject => {

                const card = document.createElement("div");
                card.className = "semester-card";

                const link = document.createElement("a");

                link.href =
                    `subject.html?year=${encodeURIComponent(year)}` +
                    `&semester=${encodeURIComponent(semester)}` +
                    `&subject=${encodeURIComponent(subject)}`;

                link.textContent = "Explore Resources →";

                card.innerHTML = `
                    <h3>${subject}</h3>
                    <p>Books, notes, practicals and other learning resources.</p>
                `;

                card.appendChild(link);
                subjectGrid.appendChild(card);

            });

        });

    }

    catch (error) {
        console.error("Error loading library data:", error);
    }

}


// Load the selected subject's information
async function loadSubjectData() {

    const params = new URLSearchParams(window.location.search);

    const year = params.get("year");
    const semester = params.get("semester");
    const subject = params.get("subject");

    document.getElementById("subjectName").textContent =
        subject || "Subject Not Found";

    document.getElementById("subjectDetails").textContent =
        `${year || ""} | ${semester || ""}`;

}
