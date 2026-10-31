
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

        const resourceContainer =
            document.getElementById("resourceContainer");

        let hasResources = false;

        document.querySelectorAll("[data-category]").forEach(container => {

            const category = container.dataset.category;
            const resources = subjectResources?.[category] || [];

            const section = container.closest(".semester-section");

            container.innerHTML = "";

            // Hide categories without resources
            if (resources.length === 0) {
                section.style.display = "none";
                return;
            }

            // Show categories containing resources
            section.style.display = "";
            hasResources = true;

            resources.forEach(resource => {

                const row = document.createElement("div");
                row.className = "semester-card";

                const heading = document.createElement("h3");
                heading.textContent = resource.name;

                const link = document.createElement("a");
                link.href = resource.url;
                link.textContent = "Open Resource →";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                row.appendChild(heading);
                row.appendChild(link);

                container.appendChild(row);

            });

        });

        // Display a message if the subject has no resources
        let emptyMessage = document.getElementById("emptyMessage");

        if (!hasResources) {

            if (!emptyMessage) {
                emptyMessage = document.createElement("p");
                emptyMessage.id = "emptyMessage";
                emptyMessage.textContent =
                    "Resources for this subject will be added soon.";

                emptyMessage.style.textAlign = "center";
                emptyMessage.style.padding = "30px";
                resourceContainer.appendChild(emptyMessage);
            }

        } else if (emptyMessage) {
            emptyMessage.remove();
        }

    }

    catch (error) {
        console.error("Error loading subject resources:", error);
    }

}

