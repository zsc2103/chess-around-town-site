// Android waitlist signup. Calls a single Supabase function (join_android_waitlist) that validates
// the address and stores it; the table itself is not readable or writable from the browser.
// The URL and anon key below are the same public values that ship inside the iOS app.
(function () {
  var SUPABASE_URL = "https://fumukidrllxkifsjhthi.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bXVraWRybGx4a2lmc2podGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDc4ODEsImV4cCI6MjEwMzg4Mzg4MX0.sewKxN_pW7h2s-nlnUK52_zx75kuuFPcbLBG8l10JC8";

  var form = document.getElementById("waitlist-form");
  if (!form) return;
  var input = document.getElementById("waitlist-email");
  var button = form.querySelector("button");
  var msg = document.getElementById("waitlist-msg");

  function show(text, kind) {
    msg.textContent = text;
    msg.className = "form-msg" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
      show("Please enter a valid email address.", "err");
      input.focus();
      return;
    }
    // Honeypot: real visitors never see or fill this field; bots do.
    if (form.elements["website"] && form.elements["website"].value) {
      show("You're on the list! We'll email you when the Android app launches.", "ok");
      form.reset();
      return;
    }

    button.disabled = true;
    show("Adding you…");

    fetch(SUPABASE_URL + "/rest/v1/rpc/join_android_waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ p_email: email }),
    })
      .then(function (res) {
        if (res.ok) {
          show("You're on the list! We'll email you when the Android app launches.", "ok");
          form.reset();
          return;
        }
        return res.json().then(
          function (body) {
            if (body && body.code === "22023") {
              show("Please enter a valid email address.", "err");
            } else {
              show("Something went wrong. Please try again, or email support@chessaroundtown.com.", "err");
            }
          },
          function () {
            show("Something went wrong. Please try again, or email support@chessaroundtown.com.", "err");
          }
        );
      })
      .catch(function () {
        show("Couldn't reach the server. Please check your connection and try again.", "err");
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
