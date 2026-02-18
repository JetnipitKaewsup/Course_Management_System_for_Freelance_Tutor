const { createClient } = supabase;

const supabaseUrl = "https://gauilfvztemzztwncuku.supabase.co";
const supabaseKey = "sb_publishable_g7hW-cLcITvnV_PqY9CeVQ_fNpLlvaN";

const db = createClient(supabaseUrl, supabaseKey);

const showHours = document.querySelector(".showHours");
const selectMonth = document.getElementById("month");
const selectYear = document.getElementById("year");

async function getHours(month, year) {
  let firstDay;
  let nextMonth;

  if (year === "all") {
    firstDay = "1900-01-01";
    nextMonth = "2100-01-01";
  } else {
    const christianYear = parseInt(year) - 543;

    if (month === "all") {
      firstDay = `${christianYear}-01-01`;
      nextMonth = `${christianYear + 1}-01-01`;
    } else {
      const monthNum = parseInt(month);

      firstDay = `${christianYear}-${String(monthNum).padStart(2, "0")}-01`;
      nextMonth =
        month === 12
          ? `${christianYear + 1}-01-01`
          : `${christianYear}-${String(monthNum + 1).padStart(2, "0")}-01`;
    }
  }

  const { data, error } = await db
    .from("classsession")
    .select("*")
    .gte("session_date", firstDay)
    .lt("session_date", nextMonth);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

async function displayHours() {
  const month = selectMonth.value;
  const year = selectYear.value;

  const sessions = await getHours(month, year);

  let totalMinutes = 0;

  sessions.forEach((session) => {
    const start = new Date(`1970-01-01T${session.start_time}`);
    const end = new Date(`1970-01-01T${session.end_time}`);

    const diff = (end - start) / 1000 / 60;
    totalMinutes += diff;
  });

  const totalHours = totalMinutes / 60;

  document.querySelector(".showHours").textContent = `${totalHours}`;
}

async function getStudent() {}

selectMonth.addEventListener("change", displayHours);
selectYear.addEventListener("change", displayHours);
