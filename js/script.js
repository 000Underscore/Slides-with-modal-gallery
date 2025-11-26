const crewMembers = [
  {
    name: "Sarah Mitchell",
    rank: "Commandante",
    description:
      "Vétéran de 15 ans dans l'exploration spatiale, Sarah a dirigé 8 missions réussies. Son expertise en navigation et son leadership inspirant font d'elle le choix parfait pour cette mission critique.",
    initial: "S",
    photo: "/img/anousheh_ansari.png", // Ajoutez l'URL de la photo ici (ex: "https://example.com/photo.jpg")
    rankOrder: 1,
  },
  {
    name: "Marcus Chen",
    rank: "Pilote Principal",
    description:
      "Ancien pilote de chasse, Marcus possède plus de 3000 heures de vol spatial. Sa précision et son sang-froid en situation d'urgence sont légendaires parmi ses pairs.",
    initial: "M",
    photo: "/img/douglas_hurley.png", // Ajoutez l'URL de la photo ici
    rankOrder: 2,
  },
  {
    name: "Dr. Elena Volkov",
    rank: "Médecin de Bord",
    description:
      "Spécialiste en médecine spatiale, Elena a développé plusieurs protocoles de santé pour les vols longue durée. Elle veille sur le bien-être physique et mental de l'équipage.",
    initial: "E",
    photo: "/img/mark_shuttleworth.png", // Ajoutez l'URL de la photo ici
    rankOrder: 4,
  },
  {
    name: "James O'Connor",
    rank: "Ingénieur en Chef",
    description:
      "Génie mécanique diplômé du MIT, James peut réparer n'importe quel système à bord. Sa créativité dans la résolution de problèmes techniques a sauvé plusieurs missions.",
    initial: "J",
    photo: "/img/victor_glover.png", // Ajoutez l'URL de la photo ici
    rankOrder: 3,
  },
  {
    name: "Yuki Tanaka",
    rank: "Spécialiste Sciences",
    description:
      "Astrophysicienne renommée, Yuki est responsable de toutes les expériences scientifiques de la mission. Ses recherches sur les exoplanètes ont révolutionné le domaine.",
    initial: "Y",
    photo: "", // Ajoutez l'URL de la photo ici
    rankOrder: 5,
  },
];

let currentSlide = 0;
let displayedCrew = [...crewMembers];
let currentSort = "none";

function displaySlide(index) {
  const member = displayedCrew[index];
  const content = document.getElementById("slideContent");

  const photoContent = member.photo
    ? `<img src="${member.photo}" alt="${member.name}">`
    : member.initial;

  content.innerHTML = `
                <div class="crew-photo">${photoContent}</div>
                <h1 class="crew-name">${member.name}</h1>
                <p class="crew-rank">${member.rank}</p>
                <p class="crew-description">${member.description}</p>
            `;

  document.getElementById("slideIndicator").textContent = `${index + 1} / ${
    displayedCrew.length
  }`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % displayedCrew.length;
  displaySlide(currentSlide);
}

function previousSlide() {
  currentSlide =
    (currentSlide - 1 + displayedCrew.length) % displayedCrew.length;
  displaySlide(currentSlide);
}

function openModal() {
  document.getElementById("modal").classList.add("active");
  updateCrewList();
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

function updateCrewList() {
  const list = document.getElementById("crewList");
  list.innerHTML = "";

  displayedCrew.forEach((member, index) => {
    const item = document.createElement("div");
    item.className = "crew-item";
    item.onclick = () => {
      currentSlide = index;
      displaySlide(currentSlide);
      closeModal();
    };

    const photoContent = member.photo
      ? `<img src="${member.photo}" alt="${member.name}">`
      : member.initial;

    item.innerHTML = `
                    <div class="crew-item-photo">${photoContent}</div>
                    <div class="crew-item-info">
                        <div class="crew-item-name">${member.name}</div>
                        <div class="crew-item-rank">${member.rank}</div>
                    </div>
                `;

    list.appendChild(item);
  });
}

function sortBy(type) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  currentSort = type;

  if (type === "name") {
    displayedCrew = [...crewMembers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (type === "rank") {
    displayedCrew = [...crewMembers].sort((a, b) => a.rankOrder - b.rankOrder);
  } else {
    displayedCrew = [...crewMembers];
  }

  currentSlide = 0;
  displaySlide(currentSlide);
  updateCrewList();
}

// Fermer la modale en cliquant à l'extérieur
document.getElementById("modal").onclick = function (e) {
  if (e.target === this) {
    closeModal();
  }
};

// Initialisation
displaySlide(0);
