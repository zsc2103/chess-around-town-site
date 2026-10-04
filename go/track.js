// Flyer QR landing: record one scan for this flyer, then forward to the home page.
// Stores only which flyer and when (no cookies, no identity). Never traps the visitor here.
(function () {
  var SUPABASE_URL = "https://fumukidrllxkifsjhthi.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bXVraWRybGx4a2lmc2podGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDc4ODEsImV4cCI6MjEwMzg4Mzg4MX0.sewKxN_pW7h2s-nlnUK52_zx75kuuFPcbLBG8l10JC8";
  var flyer = document.currentScript && document.currentScript.getAttribute("data-flyer");
  var dest = flyer ? "/?src=" + encodeURIComponent(flyer) : "/";
  var done = false;
  function go() {
    if (done) return;
    done = true;
    window.location.replace(dest);
  }
  setTimeout(go, 1500);
  if (!flyer) { go(); return; }
  try {
    fetch(SUPABASE_URL + "/rest/v1/rpc/track_flyer_scan", {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ p_flyer: flyer }),
    }).then(go, go);
  } catch (e) {
    go();
  }
})();
