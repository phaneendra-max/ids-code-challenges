const workingHoursStart = "08:00";
const workingHoursEnd = "18:00";

let events = [
    { name: "Meeting A", start: "09:00", end: "10:30" },
    { name: "Workshop B", start: "10:00", end: "11:30" },
    { name: "Lunch Break", start: "12:00", end: "13:00" },
    { name: "Presentation C", start: "10:30", end: "12:00" }
];

function renderEvents() {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    events.sort((a, b) => a.start.localeCompare(b.start));

    events.forEach((event, index) => {
        const div = document.createElement("div");
        div.className = "event";
        div.innerText = `${event.name} | Start: ${event.start} | End: ${event.end}`;
        div.onclick = () => loadEventForEdit(index);
        eventList.appendChild(div);
    });
}

function detectConflicts() {
    let conflicts = [];

    for (let i = 0; i < events.length - 1; i++) {
        for (let j = i + 1; j < events.length; j++) {
            if (
                (events[i].start < events[j].end && events[i].end > events[j].start) ||
                (events[j].start < events[i].end && events[j].end > events[i].start)
            ) {
                conflicts.push({ event1: events[i], event2: events[j] });
            }
        }
    }

    return conflicts;
}

function suggestResolutions() {
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = "";

    const conflicts = detectConflicts();

    if (conflicts.length === 0) {
        suggestionsDiv.innerText = "No conflicts detected.";
        return;
    }

    conflicts.forEach((conflict) => {
        const suggestion = document.createElement("div");
        suggestion.className = "conflict";

        const alternativeStart = incrementTime(conflict.event1.end, 30);
        const alternativeEnd = incrementTime(alternativeStart, getTimeDifference(conflict.event2.start, conflict.event2.end));

        if (alternativeEnd <= workingHoursEnd) {
            suggestion.innerText = `Conflict between "${conflict.event1.name}" and "${conflict.event2.name}". Suggested resolution: Reschedule "${conflict.event2.name}" to Start: ${alternativeStart}, End: ${alternativeEnd}`;
        } else {
            suggestion.innerText = `Conflict between "${conflict.event1.name}" and "${conflict.event2.name}". No suitable alternative found.`;
        }

        suggestionsDiv.appendChild(suggestion);
    });
}

function incrementTime(time, minutes) {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);

    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");

    return `${newHours}:${newMinutes}`;
}

function getTimeDifference(start, end) {
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
}

function loadEventForEdit(index) {
    const event = events[index];
    document.getElementById("eventName").value = event.name;
    document.getElementById("eventStart").value = event.start;
    document.getElementById("eventEnd").value = event.end;
    document.getElementById("editForm").dataset.index = index;
}

function editEvent() {
    const index = document.getElementById("editForm").dataset.index;
    const name = document.getElementById("eventName").value;
    const start = document.getElementById("eventStart").value;
    const end = document.getElementById("eventEnd").value;

    if (!name || !start || !end) {
        alert("Please fill out all fields.");
        return;
    }

    events[index] = { name, start, end };
    renderEvents();
    document.getElementById("editForm").reset();
}

renderEvents();
