const supabaseUrl = "https://glpagziasmxhvqfxfieq.supabase.co";
const supabaseKey = "sb_publishable_GnIo9Op5u_4DdHNghpruHA_vTi9uMwZ";

const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function loadAdminRequests() {
  const { data, error } = await supabaseClient
    .from("team_requests")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("admin-requests");
  container.innerHTML = "";

  data.forEach((req) => {
    const card = document.createElement("div");
    card.classList.add("admin-card");

   card.innerHTML = `
  <h3>${req.name}</h3>
  <p>Department: ${req.department}</p>
  <p>Gender: ${req.gender}</p>
  <p>Event: ${req.event_title}</p>

  <button class="accept-btn" onclick="acceptRequest(${req.id})">Accept</button>
  <button class="reject-btn" onclick="rejectRequest(${req.id})">Reject</button>

  <hr>
`;


    container.appendChild(card);
  });
}

loadAdminRequests();

async function acceptRequest(id) {
  const { error } = await supabaseClient
    .from("team_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Error accepting request");
    return;
  }

  alert("Request Accepted ✅");

  // ✅ reload admin list
  loadAdminRequests();
}

async function rejectRequest(id) {
  const { error } = await supabaseClient
    .from("team_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Error rejecting request");
    return;
  }

  alert("Request Rejected ❌");

  // ✅ reload admin list
  loadAdminRequests();
}
