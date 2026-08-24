/* Ricerca libera per titolo/parola chiave sui contenuti della pagina.
   L'indice va esteso man mano che si aggiungono nuovi viaggi o pagine. */
(function () {
  var SEARCH_INDEX = [
    {
      title: "Camp estivo in Trentino Alto Adige",
      tag: "Campo estivo",
      keywords: "trentino alto adige camp estivo bambini ragazzi montagna",
      img: "assets/trip-trentino.jpg",
      targetId: "trip-trentino"
    },
    {
      title: "Vacanza studio a Dublino",
      tag: "Vacanza studio",
      keywords: "dublino irlanda vacanza studio inglese college studenti",
      img: "assets/blog-vacanze-studio.jpg",
      targetId: "trip-dublino"
    },
    {
      title: "Lisbona e Madeira",
      tag: "Viaggio di istruzione",
      keywords: "lisbona madeira portogallo viaggio istruzione scuola scuole superiori",
      img: "assets/trip-madeira.jpg",
      targetId: "trip-madeira"
    },
    {
      title: "Lapponia e aurora boreale",
      tag: "Famiglie",
      keywords: "lapponia rovaniemi finlandia aurora boreale neve famiglie",
      img: "assets/trip-rovaniemi.jpg",
      targetId: "trip-rovaniemi"
    }
  ];

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  var openBtn = document.getElementById("nav-search-open");
  var scrim = document.getElementById("search-modal-scrim");
  var modal = document.getElementById("search-modal");
  var closeBtn = document.getElementById("search-modal-close");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var hint = document.getElementById("search-hint");
  if (!openBtn || !modal) return;

  function openSearch() {
    modal.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(function () { input.focus(); }, 150);
  }
  function closeSearch() {
    modal.classList.remove("is-open");
    scrim.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
  scrim.addEventListener("click", closeSearch);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeSearch();
  });

  function renderResults(query) {
    var q = normalize(query.trim());
    if (!q) {
      results.innerHTML = "";
      hint.textContent = "Digita per iniziare la ricerca.";
      results.appendChild(hint);
      return;
    }
    var matches = SEARCH_INDEX.filter(function (item) {
      return normalize(item.title + " " + item.tag + " " + item.keywords).indexOf(q) !== -1;
    });
    results.innerHTML = "";
    if (!matches.length) {
      var empty = document.createElement("p");
      empty.className = "search-hint";
      empty.textContent = "Nessun risultato per \"" + query + "\". Prova con un'altra parola o contattaci per un preventivo su misura.";
      results.appendChild(empty);
      return;
    }
    matches.forEach(function (item) {
      var a = document.createElement("a");
      a.href = "#" + item.targetId;
      a.className = "search-result-item";
      a.innerHTML =
        '<img src="' + item.img + '" alt="">' +
        '<span class="search-result-info"><strong>' + item.title + '</strong><span>' + item.tag + "</span></span>" +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      a.addEventListener("click", function (e) {
        e.preventDefault();
        closeSearch();
        var target = document.getElementById(item.targetId);
        if (!target) return;
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("is-search-highlight");
          setTimeout(function () { target.classList.remove("is-search-highlight"); }, 1800);
        }, 250);
      });
      results.appendChild(a);
    });
  }

  input.addEventListener("input", function () { renderResults(input.value); });
})();
