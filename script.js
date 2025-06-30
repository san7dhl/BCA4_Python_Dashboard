let studentData = [];

fetch("students.json")
  .then((response) => response.json())
  .then((data) => {
    studentData = data;
    const select = document.getElementById("studentSelect");
    data.forEach((s) => {
      select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  });

function showStudent() {
  const id = document.getElementById("studentSelect").value;
  const s = studentData.find((stu) => stu.id === id);
  if (!s) return;

  const msg = getMessage(s);

  document.getElementById("dashboardArea").innerHTML = `
        <h2>Dear ${s.name},</h2>
        <p>${msg}</p>

        ${progressBar(s.attConcept, "Concept Attendance")}
        ${progressBar(s.attApplied, "Applied Attendance")}
        ${progressBar((s.marksConcept / 50) * 100, "Theory Marks (%)")}
        ${progressBar((s.marksApplied / 40) * 100, "Applied Marks (%)")}

        <div id="radar" style="height:350px; margin-top:30px;"></div>
    `;

  Plotly.newPlot(
    "radar",
    [
      {
        type: "scatterpolar",
        r: [
          s.attConcept,
          s.attApplied,
          (s.marksConcept / 50) * 100,
          (s.marksApplied / 40) * 100,
        ],
        theta: [
          "Concept Attendance",
          "Applied Attendance",
          "Theory Marks",
          "Applied Marks",
        ],
        fill: "toself",
        marker: { color: "#4cafaf" },
      },
    ],
    {
      polar: { radialaxis: { visible: true, range: [0, 100] } },
      showlegend: false,
      title: "Performance Snapshot",
    }
  );
}

function progressBar(val, label) {
  const color = val > 90 ? "#4cafaf" : val >= 75 ? "#ffc107" : "#ff5252";
  return `
    <div class="progress-container">
        <div class="progress-label">${label}: ${val.toFixed(1)}%</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width:${val}%; background:${color}">${val.toFixed(
    1
  )}%</div>
        </div>
    </div>`;
}

function getMessage(s) {
  let msg = "";
  msg +=
    s.attConcept < 75
      ? "Your Concept Attendance is low. Attend all upcoming classes to improve. "
      : s.attConcept < 90
      ? "Your Concept Attendance is fair. Try to attend all upcoming classes regularly. "
      : "Great job on Concept Attendance. ";
  msg +=
    s.attApplied < 75
      ? "Applied Attendance is low. Attend practical sessions regularly. "
      : s.attApplied < 90
      ? "Applied Attendance is okay. Aim to attend all sessions. "
      : "Excellent Applied Attendance. ";
  msg +=
    s.marksConcept < 30
      ? "Theory marks are low. Spend more time preparing. Feel free to ask me for extra help. "
      : s.marksConcept < 40
      ? "Theory marks are average. With extra effort, you can do better. "
      : "Good Theory marks. Keep it up. ";
  msg +=
    s.marksApplied < 25
      ? "Applied marks are low. Practice practical tasks regularly and ask for extra support. "
      : s.marksApplied < 30
      ? "Applied marks are fair. With a little more practice, you can improve. "
      : "Good Applied performance. Keep practicing. ";
  return msg;
}
