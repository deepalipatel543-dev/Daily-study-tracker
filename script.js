let studies = JSON.parse(localStorage.getItem("studies")) || [];

let dailyGoal =
    Number(localStorage.getItem("dailyGoal")) || 0;


// GET TODAY'S DATE
function getToday() {

    let today = new Date();

    let year = today.getFullYear();

    let month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    let day = String(
        today.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// PAGE LOAD
window.onload = function () {

    document.getElementById("studyDate").value =
        getToday();

    document.getElementById("dailyGoal").value =
        dailyGoal > 0 ? dailyGoal : "";

    displayStudies();

    updateDashboard();

    updateWeeklyChart();

    updateSubjectSummary();

    updateGoalStatus();
};


// ADD STUDY
function addStudy() {

    let subject =
        document.getElementById("subject").value.trim();

    let topic =
        document.getElementById("topic").value.trim();

    let hours =
        Number(
            document.getElementById("hours").value
        );

    let date =
        document.getElementById("studyDate").value;


    if (
        subject === "" ||
        topic === "" ||
        hours <= 0 ||
        date === ""
    ) {

        alert("Please fill all fields correctly!");

        return;
    }


    let study = {

        id: Date.now(),

        subject: subject,

        topic: topic,

        hours: hours,

        date: date,

        completed: false

    };


    studies.push(study);


    localStorage.setItem(
        "studies",
        JSON.stringify(studies)
    );


    displayStudies();

    updateDashboard();

    updateWeeklyChart();

    updateSubjectSummary();

    updateGoalStatus();


    document.getElementById("subject").value = "";

    document.getElementById("topic").value = "";

    document.getElementById("hours").value = "";

    document.getElementById("studyDate").value =
        getToday();


    alert("Study added successfully!");
}


// DISPLAY STUDIES
function displayStudies(list = studies) {

    let studyList =
        document.getElementById("studyList");


    studyList.innerHTML = "";


    if (list.length === 0) {

        studyList.innerHTML =
            "<p>No study records found.</p>";

        return;
    }


    list.forEach(function (study) {

        let div =
            document.createElement("div");


        div.className = "study-item";


        div.innerHTML = `

            <b>Subject:</b>
            ${study.subject}

            <br>

            <b>Topic:</b>
            ${study.topic}

            <br>

            <b>Study Time:</b>
            ${study.hours} hours

            <br>

            <b>Date:</b>
            ${study.date || "No date"}

            <br>

            <b>Status:</b>

            <span class="status">
                ${
                    study.completed
                    ? "Completed"
                    : "Pending"
                }
            </span>

            <br>


            <button
                onclick="completeStudy(${study.id})"
                ${study.completed ? "disabled" : ""}
            >

                ${
                    study.completed
                    ? "Completed"
                    : "Mark Complete"
                }

            </button>


            <button
                onclick="deleteStudy(${study.id})"
            >

                Delete

            </button>

        `;


        studyList.appendChild(div);

    });
}


// COMPLETE STUDY
function completeStudy(id) {

    studies.forEach(function (study) {

        if (study.id === id) {

            study.completed = true;

        }

    });


    localStorage.setItem(
        "studies",
        JSON.stringify(studies)
    );


    displayStudies();

    updateDashboard();

    updateWeeklyChart();

    updateSubjectSummary();

    updateGoalStatus();
}


// DELETE STUDY
function deleteStudy(id) {

    studies =
        studies.filter(function (study) {

            return study.id !== id;

        });


    localStorage.setItem(
        "studies",
        JSON.stringify(studies)
    );


    displayStudies();

    updateDashboard();

    updateWeeklyChart();

    updateSubjectSummary();

    updateGoalStatus();
}


// SEARCH + DATE FILTER
function filterStudies() {

    let search =
        document
            .getElementById("searchStudy")
            .value
            .toLowerCase();


    let selectedDate =
        document
            .getElementById("filterDate")
            .value;


    let filtered =
        studies.filter(function (study) {

            let subject =
                study.subject.toLowerCase();

            let topic =
                study.topic.toLowerCase();


            let searchMatch =
                subject.includes(search) ||
                topic.includes(search);


            let dateMatch =
                selectedDate === "" ||
                study.date === selectedDate;


            return (
                searchMatch &&
                dateMatch
            );

        });


    displayStudies(filtered);
}


// CLEAR FILTERS
function clearFilters() {

    document.getElementById(
        "searchStudy"
    ).value = "";


    document.getElementById(
        "filterDate"
    ).value = "";


    displayStudies();
}


// DASHBOARD
function updateDashboard() {

    let totalHours = 0;


    studies.forEach(function (study) {

        totalHours +=
            Number(study.hours) || 0;

    });


    let totalSessions =
        studies.length;


    let completedSessions =
        studies.filter(function (study) {

            return study.completed === true;

        }).length;


    let averageHours = 0;


    if (totalSessions > 0) {

        averageHours =
            totalHours / totalSessions;

    }


    let progress = 0;


    if (totalSessions > 0) {

        progress =
            (completedSessions /
                totalSessions) * 100;

    }


    document.getElementById(
        "totalHours"
    ).textContent =
        totalHours.toFixed(1) + " hrs";


    document.getElementById(
        "totalSessions"
    ).textContent =
        totalSessions;


    document.getElementById(
        "averageHours"
    ).textContent =
        averageHours.toFixed(1) + " hrs";


    document.getElementById(
        "progress"
    ).textContent =
        progress.toFixed(0) + "%";
}


// WEEKLY CHART
function updateWeeklyChart() {

    let weeklyHours = {

        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0

    };


    studies.forEach(function (study) {

        if (!study.date) {
            return;
        }


        let date =
            new Date(
                study.date + "T00:00:00"
            );


        let days = [

            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"

        ];


        let day =
            days[date.getDay()];


        weeklyHours[day] +=
            Number(study.hours) || 0;

    });


    let maxHours = 1;


    Object.values(weeklyHours)
        .forEach(function (hours) {

            if (hours > maxHours) {

                maxHours = hours;

            }

        });


    let barIds = {

        Mon: "monBar",
        Tue: "tueBar",
        Wed: "wedBar",
        Thu: "thuBar",
        Fri: "friBar",
        Sat: "satBar",
        Sun: "sunBar"

    };


    Object.keys(barIds)
        .forEach(function (day) {

            let bar =
                document.getElementById(
                    barIds[day]
                );


            if (!bar) {
                return;
            }


            let hours =
                weeklyHours[day];


            let height =
                (hours / maxHours) * 200;


            bar.style.height =
                height + "px";


            bar.title =
                hours + " hours";

        });
}


// SUBJECT-WISE SUMMARY
function updateSubjectSummary() {

    let summary = {};


    studies.forEach(function (study) {

        let subject =
            study.subject.trim();


        if (subject === "") {
            return;
        }


        if (!summary[subject]) {

            summary[subject] = 0;

        }


        summary[subject] +=
            Number(study.hours) || 0;

    });


    let subjectSummary =
        document.getElementById(
            "subjectSummary"
        );


    subjectSummary.innerHTML = "";


    if (Object.keys(summary).length === 0) {

        subjectSummary.innerHTML =
            "<p>No subject data available.</p>";

        return;
    }


    Object.keys(summary).forEach(function (subject) {

        let div =
            document.createElement("div");


        div.className =
            "study-item";


        div.innerHTML = `

            <b>${subject}</b>

            <br>

            Total Study Time:
            ${summary[subject].toFixed(1)} hours

        `;


        subjectSummary.appendChild(div);

    });

}


// SET DAILY GOAL
function setDailyGoal() {

    let goal =
        Number(
            document.getElementById("dailyGoal").value
        );


    if (goal <= 0) {

        alert("Please enter a valid goal!");

        return;
    }


    dailyGoal = goal;


    localStorage.setItem(
        "dailyGoal",
        dailyGoal
    );


    updateGoalStatus();


    alert("Daily goal set successfully!");
}


// UPDATE GOAL STATUS
function updateGoalStatus() {

    let goalStatus =
        document.getElementById("goalStatus");


    if (!goalStatus) {
        return;
    }


    if (dailyGoal <= 0) {

        goalStatus.innerHTML = `
            <p>No daily goal set.</p>
        `;

        return;
    }


    let today =
        getToday();


    let todayHours = 0;


    studies.forEach(function (study) {

        if (study.date === today) {

            todayHours +=
                Number(study.hours) || 0;

        }

    });


    let percentage =
        (todayHours / dailyGoal) * 100;


    if (percentage > 100) {
        percentage = 100;
    }


    let remaining =
        dailyGoal - todayHours;


    if (remaining < 0) {
        remaining = 0;
    }


    goalStatus.innerHTML = `

        <p>
            <b>Today's Progress:</b>
            ${todayHours.toFixed(1)}
            / ${dailyGoal.toFixed(1)} hours
        </p>

        <p>
            <b>Goal Completion:</b>
            ${percentage.toFixed(0)}%
        </p>

        <p>
            ${
                remaining > 0
                ? "You need " +
                  remaining.toFixed(1) +
                  " more hours."
                : "🎉 Daily goal completed!"
            }
        </p>

    `;
}