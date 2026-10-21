let timerInterval = null;
let seconds = 0;
let startedAt = 0;   // Date.now() when the current run segment began
let accumulated = 0; // ms already counted from earlier segments (before a pause)

function formatTime(totalSec) {
  const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
  const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
  const secs = (totalSec % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function tick() {
  const elapsed = accumulated + Date.now() - startedAt;
  seconds = Math.floor(elapsed / 1000);
  document.getElementById('timer').textContent = formatTime(seconds);
  // schedule the next update for the exact start of the next second
  timerInterval = setTimeout(tick, 1000 - (elapsed % 1000) + 5);
}

function startTimer() {
  if (timerInterval) return;
  startedAt = Date.now();
  tick();
}

function pauseTimer() {
  if (!timerInterval) return;
  accumulated += Date.now() - startedAt;
  clearTimeout(timerInterval);
  timerInterval = null;
  seconds = Math.floor(accumulated / 1000);
}

function resetTimer() {
  pauseTimer();
  accumulated = 0;
  seconds = 0;
  document.getElementById('timer').textContent = "00:00:00";
  document.getElementById('saveRunForm').style.display = 'none';
}

function stopTimer() {
  pauseTimer();
  if (seconds === 0) return alert('Timer has not started');
  document.getElementById('timer').textContent = formatTime(seconds);
  document.getElementById('saveRunForm').style.display = 'block';
  document.getElementById('runDate').value = new Date().toISOString().split('T')[0];
}

async function saveRun(e) {
  e.preventDefault();
  const session = await checkAuth(true);
  if (!session) return;

  const activityName = document.getElementById('activityName').value.trim();
  const distance = parseFloat(document.getElementById('distance').value);
  const runDate = document.getElementById('runDate').value;
  const notes = document.getElementById('notes').value;

  if (!activityName) return showMessage('msg', 'Enter an activity name.');
  if (isNaN(distance) || distance <= 0) return showMessage('msg', 'Distance must be greater than 0.');

  // Fixed: Wrapped with parseFloat() so Supabase receives a proper number instead of a string
  const pace = parseFloat(((seconds / 60) / distance).toFixed(2));

  const { error } = await supabase.from('runs').insert([{
    user_id: session.user.id,
    activity_name: activityName,
    distance: distance,
    duration_seconds: seconds,
    pace: pace,
    run_date: runDate,
    notes: notes
  }]);

  if (error) {
    console.error('Supabase error:', error);
    showMessage('msg', error.message);
  } else {
    showMessage('msg', 'Run saved successfully!', false);
    setTimeout(() => window.location.href = 'history.html', 1500);
  }
}