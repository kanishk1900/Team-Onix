let caseValidated = false;
let editingCaseId = null;


/*CRITICAL FIELDS*/

const criticalFields = [

    {
        id: "patientName",
        name: "Patient Name"
    },

    {
        id: "age",
        name: "Age"
    },

    {
        id: "gender",
        name: "Gender"
    },

    {
        id: "chiefComplaint",
        name: "Chief Complaint"
    },

    {
        id: "allergies",
        name: "Allergies"
    },

    {
        id: "diagnosis",
        name: "Provisional Diagnosis"
    }

];


/*OPEN CASE FORM*/

function openCaseForm() {

    document
        .getElementById("caseFormSection")
        .classList.remove("hidden");


    window.scrollTo({

        top: document
            .getElementById("caseFormSection")
            .offsetTop - 20,

        behavior: "smooth"

    });

}


/*UPDATE COMPLETENESS*/

function updateCompleteness() {

    let completedFields = 0;


    criticalFields.forEach(function(field) {

        const element =
            document.getElementById(field.id);


        if (element.value.trim() !== "") {

            completedFields++;

        }

    });


    const totalFields =
        criticalFields.length;


    const percentage =
        Math.round(
            (completedFields / totalFields) * 100
        );


    /*
        Show completeness container
    */

    const container =
        document.getElementById(
            "completenessContainer"
        );


    container.classList.remove("hidden");


    /*
        Update percentage
    */

    document
        .getElementById("completenessPercentage")
        .textContent = percentage + "%";


    /*
        Update progress bar
    */

    document
        .getElementById("progressBar")
        .style.width = percentage + "%";


    /*
        Update text
    */

    document
        .getElementById("completenessText")
        .textContent =
        completedFields +
        " of " +
        totalFields +
        " critical fields completed";

}


/*VALIDATE CASE*/

function validateCase() {


    let missingFields = [];


    /*
        Remove previous errors
    */

    criticalFields.forEach(function(field) {

        const element =
            document.getElementById(field.id);

        element.classList.remove(
            "missing-field"
        );

    });


    /*
        Check fields
    */

    criticalFields.forEach(function(field) {

        const element =
            document.getElementById(field.id);


        if (element.value.trim() === "") {

            missingFields.push(
                field.name
            );

            element.classList.add(
                "missing-field"
            );

        }

    });


    /*
        Update completeness
    */

    updateCompleteness();


    const messageBox =
        document.getElementById(
            "validationMessage"
        );


    const submitButton =
        document.getElementById(
            "submitBtn"
        );


    /* INCOMPLETE CASE*/

    if (missingFields.length > 0) {

        caseValidated = false;

        submitButton.disabled = true;


        let listHTML = "<ul>";


        missingFields.forEach(
            function(field) {

                listHTML +=
                    `<li>${field}</li>`;

            }
        );


        listHTML += "</ul>";


        messageBox.innerHTML = `

            <div class="validation-error">

                <h3>
                    ⚠️ Case Incomplete
                </h3>

                <p>
                    ${missingFields.length}
                    critical field(s) are missing.
                </p>

                ${listHTML}

                <p>
                    Please complete these
                    fields before submitting
                    the case.
                </p>

            </div>

        `;


        messageBox.classList.remove(
            "hidden"
        );


        return;

    }


    /* 
       COMPLETE CASE
   */

    caseValidated = true;

    submitButton.disabled = false;


    messageBox.innerHTML = `

        <div class="validation-success">

            <h3>
                ✓ Case Validation Successful
            </h3>

            <p>
                All critical fields have
                been completed.
            </p>

            <p>
                Case completeness: 100%
            </p>

        </div>

    `;


    messageBox.classList.remove(
        "hidden"
    );

}


/*
   SUBMIT CASE
*/

function submitCase() {

    if (!caseValidated) {

        alert(
            "Please validate the case before submitting."
        );

        return;
    }


    /*GENERATE FINAL CASE ID*/

    const randomNumber =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const caseId =
        "PC-2026-" +
        randomNumber;


    /* 
       COLLECT PATIENT DATA
    */

    const patientName =
        document
            .getElementById("patientName")
            .value;

    const age =
        document
            .getElementById("age")
            .value;

    const gender =
        document
            .getElementById("gender")
            .value;

    const complaint =
        document
            .getElementById("chiefComplaint")
            .value;

    const allergies =
        document
            .getElementById("allergies")
            .value;

    const diagnosis =
        document
            .getElementById("diagnosis")
            .value;


    /* 
       DISPLAY SUMMARY
     */

    document
        .getElementById("caseId")
        .textContent = caseId;

    document
        .getElementById("summaryName")
        .textContent = patientName;

    document
        .getElementById("summaryAge")
        .textContent = age;

    document
        .getElementById("summaryGender")
        .textContent = gender;

    document
        .getElementById("summaryComplaint")
        .textContent = complaint;

    document
        .getElementById("summaryAllergies")
        .textContent = allergies;

    document
        .getElementById("summaryDiagnosis")
        .textContent = diagnosis;


    /* 
       GET SAVED CASES
     */

    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];


    /* 
       CREATE FINAL CASE
     */

    const patientCase = {

        caseId: caseId,

        patientName: patientName,

        age: age,

        gender: gender,

        complaint: complaint,

        allergies: allergies,

        diagnosis: diagnosis,

        date:
            new Date()
                .toLocaleString(),

        status: "Complete",

        completeness: 100
    };


    /* 
       IF EDITING DRAFT
       REPLACE THE DRAFT
     */

    if (editingCaseId) {

        const index =
            cases.findIndex(function(patientCase) {

                return patientCase.caseId === editingCaseId;

            });


        if (index !== -1) {

            cases[index] = patientCase;

        } else {

            cases.push(patientCase);

        }

    } else {

        /* New case */

        cases.push(patientCase);

    }


    /* 
       SAVE
     */

    localStorage.setItem(
        "patientCases",
        JSON.stringify(cases)
    );


    /* Reset editing mode */

    editingCaseId = null;


    /* 
       HIDE FORM
     */

    document
        .getElementById("caseFormSection")
        .classList.add("hidden");


    /* 
       SHOW SUMMARY
     */

    document
        .getElementById("summarySection")
        .classList.remove("hidden");


    /* Scroll to top */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}

/* 
   CREATE NEW CASE
 */

function createNewCase() {

    location.reload();

}


/* 
   LOAD DASHBOARD
 */

function loadDashboard() {

    /*
        Get saved cases from LocalStorage
    */

    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];


    /*
        Calculate statistics
    */

    const total =
        cases.length;


    const complete =
        cases.filter(function(patientCase) {

            return patientCase.status === "Complete";

        }).length;


    const incomplete =
        total - complete;


    /*
        Display statistics
    */

    document
        .getElementById("totalCases")
        .textContent = total;


    document
        .getElementById("completeCases")
        .textContent = complete;


    document
        .getElementById("incompleteCases")
        .textContent = incomplete;


    /*
        Display recent cases
    */

    const recentCases =
        document.getElementById("recentCases");


    /*
        If there are no cases
    */

    if (cases.length === 0) {

        recentCases.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    No patient cases yet
                </h3>

                <p>
                    Create your first digital
                    patient case to see it here.
                </p>

                <button
                    class="primary-btn"
                    onclick="openCaseForm()">

                    Create First Case

                </button>

            </div>

        `;

        return;

    }


    /*
        Show newest cases first
    */

    const latestCases =
        cases.slice(-5).reverse();


    let html = "";


    latestCases.forEach(function(patientCase) {

        html += `

            <div class="case-item">

                <div class="case-main">

                    <h3>
                        ${patientCase.patientName}
                    </h3>

                    <p>
                        ${patientCase.age}
                        years •
                        ${patientCase.gender}
                    </p>

                    <p>
                        ${patientCase.complaint}
                    </p>

                    <small>
                        Case ID:
                        ${patientCase.caseId}
                        •
                        ${patientCase.date}
                    </small>

                </div>


                <div class="case-actions">

                    <div class="case-status">

                        ${
                            patientCase.status === "Complete"
                                ? "✓ COMPLETE"
                                : "⚠ INCOMPLETE"
                        }

                    </div>

                    ${
                        patientCase.status === "Complete"

                            ? `
                                <button
                                    class="view-case-btn"
                                    onclick="viewCase('${patientCase.caseId}')">

                                    View Case →

                                </button>
                                `

                            : `
                                <button
                                    class="view-case-btn"
                                    onclick="resumeDraft('${patientCase.caseId}')">

                                    Resume Draft →

                                </button>
                                `
                    }

                </div>

            </div>

        `;

    });


    recentCases.innerHTML = html;

}


/* 
   RESUME DRAFT
*/

function resumeDraft(caseId) {

    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];

    const patientCase =
        cases.find(function(item) {
            return item.caseId === caseId;
        });

    if (!patientCase) {
        alert("Draft case not found.");
        return;
    }

    /* Remember which draft we are editing */
    editingCaseId = caseId;

    /* Reset validation */
    caseValidated = false;

    document.getElementById("submitBtn").disabled = true;

    document
        .getElementById("validationMessage")
        .classList.add("hidden");

    /* Fill saved patient information */

    document.getElementById("patientName").value =
        patientCase.patientName || "";

    document.getElementById("age").value =
        patientCase.age || "";

    document.getElementById("gender").value =
        patientCase.gender || "";

    document.getElementById("chiefComplaint").value =
        patientCase.complaint || "";

    document.getElementById("allergies").value =
        patientCase.allergies || "";

    document.getElementById("diagnosis").value =
        patientCase.diagnosis || "";

    /* Hide other sections */

    document
        .getElementById("dashboardSection")
        .classList.add("hidden");

    document
        .getElementById("caseDetailsSection")
        .classList.add("hidden");

    document
        .getElementById("summarySection")
        .classList.add("hidden");

    /* Show form */

    document
        .getElementById("caseFormSection")
        .classList.remove("hidden");

    /* Update completeness */

    updateCompleteness();

    /* Scroll to form */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =
   LOAD DASHBOARD ON START
 */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

    }
);


/* 
   VIEW PATIENT CASE
 */

function viewCase(caseId) {

    /*
        Get saved cases
    */

    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];


    /*
        Find selected case
    */

    const patientCase =
        cases.find(function(item) {

            return item.caseId === caseId;

        });


    /*
        Safety check
    */

    if (!patientCase) {

        alert("Patient case not found.");

        return;

    }


    /* 
   CALCULATE CASE STATUS
*/

const completedFields =
    criticalFields.filter(function(field) {

        const value =
            patientCase[
                field.id === "chiefComplaint"
                    ? "complaint"
                    : field.id
        ];

        return value &&
               value.toString().trim() !== "";

    }).length;


const completeness =
    Math.round(
        (completedFields / criticalFields.length) * 100
    );


const isComplete =
    patientCase.status === "Complete";


/* 
   UPDATE STATUS DISPLAY
 */

document
    .getElementById("detailsStatusBadge")
    .textContent =
        isComplete
            ? "COMPLETE"
            : "⚠ INCOMPLETE";


document
    .getElementById("detailsStatus")
    .textContent =
        isComplete
            ? "✓ Complete"
            : "⚠ Incomplete";


document
    .getElementById("detailsStatus")
    .className =
        isComplete
            ? "status-complete"
            : "status-incomplete";


document
    .getElementById("detailsCompleteness")
    .textContent =
        completeness + "%";


document
    .getElementById("detailsCompletenessText")
    .textContent =
        isComplete
            ? "All critical fields were completed before submission."
            : completedFields +
              " of " +
              criticalFields.length +
              " critical fields have been completed.";


    /*
        Fill case details
    */

    document
        .getElementById("detailsPatientName")
        .textContent =
        patientCase.patientName;


    document
        .getElementById("detailsCaseId")
        .textContent =
        patientCase.caseId;


    document
        .getElementById("detailsName")
        .textContent =
        patientCase.patientName;


    document
        .getElementById("detailsAge")
        .textContent =
        patientCase.age + " years";


    document
        .getElementById("detailsGender")
        .textContent =
        patientCase.gender;


    document
        .getElementById("detailsId")
        .textContent =
        patientCase.caseId;


    document
        .getElementById("detailsDate")
        .textContent =
        patientCase.date;


    document
        .getElementById("detailsComplaint")
        .textContent =
        patientCase.complaint;


    document
        .getElementById("detailsAllergies")
        .textContent =
        patientCase.allergies;


    document
        .getElementById("detailsDiagnosis")
        .textContent =
        patientCase.diagnosis;


    /*
        Hide dashboard
    */

    document
        .getElementById("dashboardSection")
        .classList.add("hidden");


    /*
        Hide form if open
    */

    const form =
        document.getElementById(
            "caseFormSection"
        );


    if (form) {

        form.classList.add("hidden");

    }


    /*
        Show details
    */

    document
        .getElementById("caseDetailsSection")
        .classList.remove("hidden");


    /*
        Scroll to top
    */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =
   BACK TO DASHBOARD
 */

function backToDashboard() {

    document
        .getElementById("caseDetailsSection")
        .classList.add("hidden");


    document
        .getElementById("dashboardSection")
        .classList.remove("hidden");


    loadDashboard();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* 
   SEARCH CASES
*/

function searchCases() {

    const searchInput =
        document
            .getElementById("caseSearch")
            .value
            .toLowerCase()
            .trim();


    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];


    const recentCases =
        document.getElementById(
            "recentCases"
        );


    /*
        Filter cases
    */

    const filteredCases =
        cases
            .slice()
            .reverse()
            .filter(function(patientCase) {

                return (

                    patientCase.patientName
                        .toLowerCase()
                        .includes(searchInput)

                    ||

                    patientCase.caseId
                        .toLowerCase()
                        .includes(searchInput)

                );

            });


    /*
        No matching cases
    */

    if (filteredCases.length === 0) {

        recentCases.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔍
                </div>

                <h3>
                    No cases found
                </h3>

                <p>
                    Try searching with a
                    different patient name
                    or Case ID.
                </p>

            </div>

        `;

        return;

    }


    /*
        Create results
    */

    let html = "";


    filteredCases.forEach(function(patientCase) {

        html += `

            <div class="case-item">

                <div class="case-main">

                    <h3>
                        ${patientCase.patientName}
                    </h3>

                    <p>
                        ${patientCase.age}
                        years •
                        ${patientCase.gender}
                    </p>

                    <p>
                        ${patientCase.complaint}
                    </p>

                    <small>
                        Case ID:
                        ${patientCase.caseId}
                        •
                        ${patientCase.date}
                    </small>

                </div>


                <div class="case-actions">

                    <div class="case-status">

                        ${
                            patientCase.status === "Complete"
                                ? "✓ COMPLETE"
                                : "⚠ INCOMPLETE"
                        }

                </div>

                    <button
                        class="view-case-btn"
                        onclick="viewCase('${patientCase.caseId}')">

                        View Case →

                    </button>

                </div>

            </div>

        `;

    });


    recentCases.innerHTML = html;

}



function printCase() {

    window.print();

}


/* 
   SAVE CASE AS DRAFT
 */

function saveDraft() {

    const patientName =
        document.getElementById("patientName").value;

    const age =
        document.getElementById("age").value;

    const gender =
        document.getElementById("gender").value;

    const complaint =
        document.getElementById("chiefComplaint").value;

    const allergies =
        document.getElementById("allergies").value;

    const diagnosis =
        document.getElementById("diagnosis").value;


    /* Calculate completeness */

    const completedFields =
        criticalFields.filter(function(field) {

            return document
                .getElementById(field.id)
                .value
                .trim() !== "";

        }).length;


    const completeness =
        Math.round(
            (completedFields / criticalFields.length) * 100
        );


    /* Get existing cases */

    let cases =
        JSON.parse(
            localStorage.getItem("patientCases")
        ) || [];


    /* 
       UPDATE EXISTING DRAFT
     */

    if (editingCaseId) {

        const index =
            cases.findIndex(function(patientCase) {
                return patientCase.caseId === editingCaseId;
            });


        if (index !== -1) {

            cases[index].patientName =
                patientName || "Unnamed Patient";

            cases[index].age =
                age;

            cases[index].gender =
                gender;

            cases[index].complaint =
                complaint;

            cases[index].allergies =
                allergies;

            cases[index].diagnosis =
                diagnosis;

            cases[index].completeness =
                completeness;

            cases[index].status =
                "Incomplete";


            localStorage.setItem(
                "patientCases",
                JSON.stringify(cases)
            );


            alert(
                "Draft updated.\n\n" +
                "Completeness: " +
                completeness +
                "%"
            );


            loadDashboard();

            return;
        }
    }


    /* 
       CREATE NEW DRAFT
     */

    const draftId =
        "DRAFT-" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const draftCase = {

        caseId: draftId,

        patientName:
            patientName || "Unnamed Patient",

        age: age,

        gender: gender,

        complaint: complaint,

        allergies: allergies,

        diagnosis: diagnosis,

        date:
            new Date()
                .toLocaleString(),

        status: "Incomplete",

        completeness: completeness
    };


    cases.push(draftCase);


    localStorage.setItem(
        "patientCases",
        JSON.stringify(cases)
    );


    alert(
        "Case saved as draft.\n\n" +
        "Completeness: " +
        completeness +
        "%"
    );


    loadDashboard();
}