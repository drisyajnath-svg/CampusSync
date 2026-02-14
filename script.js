let notificationCount = 0;

window.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("notification-count");
  if (bell) bell.innerText = notificationCount;

  renderEvents();
  loadRequests();
});

const supabaseUrl = "https://glpagziasmxhvqfxfieq.supabase.co";
const supabaseKey = "sb_publishable_GnIo9Op5u_4DdHNghpruHA_vTi9uMwZ";

const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const events = [
  {
    title: "Hackathon 2026",
    time: "9:00 AM",
    type: "Team (3 members)",
    open: true
  },
  {
    title: "AI Workshop",
    time: "2:00 PM",
    type: "Solo",
    open: true
  },
  {
    title: "Design Sprint",
    time: "4:30 PM",
    type: "Team (2 members)",
    open: true
  }
];


// ✅ RENDER EVENTS
function renderEvents() {
  const container = document.getElementById("events-container");
  if (!container) return;

  container.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <h2>${event.title}</h2>
      <p><strong>Time:</strong> ${event.time}</p>
      <p><strong>Type:</strong> ${event.type}</p>
      <button onclick="handleClick('${event.title}', '${event.type}')">
        ${event.type === "Solo" ? "Register" : "Need Team"}
      </button>
    `;

    container.appendChild(card);
  });
}


// ✅ HANDLE EVENT CLICK
function handleClick(title, type) {
  if (type === "Solo") {
    alert(title + " registered successfully!");
    return;
  }

  document.getElementById("team-form").style.display = "flex";
  window.selectedEventTitle = title;
}


// ✅ SUBMIT TEAM REQUEST
const submitBtn = document.getElementById("submit-request");

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {

    const name = document.getElementById("student-name").value;
    const dept = document.getElementById("department").value;
    const gender = document.getElementById("gender").value;

    if (!name || !dept) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabaseClient
      .from("team_requests")
      .insert([
        {
          name: name,
          department: dept,
          gender: gender,
          event_title: window.selectedEventTitle
        }
      ]);

    if (error) {
      console.error(error);
      alert("Error submitting request");
      return;
    }

    alert("Request stored successfully!");

    notificationCount++;
    document.getElementById("notification-count").innerText = notificationCount;

    document.getElementById("team-form").style.display = "none";

    loadRequests();
  });
}


// ✅ LOAD REQUESTS FROM DATABASE
async function loadRequests() {
  const { data, error } = await supabaseClient
    .from("team_requests")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("requests-container");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(req => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>Team Request</h3>
      <p><strong>Name:</strong> ${req.name}</p>
      <p><strong>Department:</strong> ${req.department}</p>
      <p><strong>Gender:</strong> ${req.gender}</p>
      <p><strong>Event:</strong> ${req.event_title}</p>
      <hr>
    `;

    container.appendChild(div);
  });
}
