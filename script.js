
document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop();

    // Determine current year
    let year = "";

    if (currentPage === "fyit.html") year = "FYIT";
    else if (currentPage === "syit.html") year = "SYIT";
    else if (currentPage === "tyit.html") year = "TYIT";

    // Load subjects
    if (year) {
        loadYearData(year);
    }

    // Load subject resources
    if (currentPage === "subject.html") {
        loadSubjectData();
    }

});


// Load subjects for FYIT, SYIT and TYIT
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

            if (!semesterContainer) return;

            const subjectGrid =
                semesterContainer.querySelector(".semester-card-grid");

            if (!subjectGrid) return;

            subjectGrid.innerHTML = "";

            subjects.forEach(subject => {

                const row = document.createElement("div");
                row.className = "semester-card";

                const heading = document.createElement("h3");
                heading.textContent = subject;

                const link = document.createElement("a");

                link.href =
                    `subject.html?year=${encodeURIComponent(year)}` +
                    `&semester=${encodeURIComponent(semester)}` +
                    `&subject=${encodeURIComponent(subject)}`;

                link.textContent = "Explore Resources →";

                row.appendChild(heading);
                row.appendChild(link);

                subjectGrid.appendChild(row);

            });

        });

    }

    catch (error) {
        console.error("Error loading library data:", error);
    }

}


// Load resources for the selected subject
async function loadSubjectData() {

    try {

        const params = new URLSearchParams(window.location.search);

        const year = params.get("year");
        const semester = params.get("semester");
        const subject = params.get("subject");

        document.getElementById("subjectName").textContent =
            subject || "Subject Not Found";

        document.getElementById("subjectDetails").textContent =
            `${year || ""} | ${semester || ""}`;

        const response = await fetch("data/library.json");

        if (!response.ok) {
            throw new Error("Could not load library.json");
        }

        const library = await response.json();

        const subjectResources = library.resources?.[subject];

        document.querySelectorAll("[data-category]").forEach(container => {

            const category = container.dataset.category;
            const resources = subjectResources?.[category] || [];

            container.innerHTML = "";

            if (resources.length === 0) {
                container.innerHTML =
                    "<p>Resources will be added soon.</p>";
                return;
            }

            resources.forEach(resource => {

                const card = document.createElement("div");
                card.className = "semester-card";

                const heading = document.createElement("h3");
                heading.textContent = resource.name;

                const link = document.createElement("a");
                link.href = resource.url;
                link.textContent = "Open Resource →";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                card.appendChild(heading);
                card.appendChild(link);

                container.appendChild(card);

            });

        });

    }

    catch (error) {
        console.error("Error loading subject resources:", error);
    }

}
