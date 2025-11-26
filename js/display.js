import { crewMembers } from "./data.js";

let currentSlide = 0;
let displayedCrew = [...crewMembers];
let currentSort = "none";

window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.openModal = openModal;
window.closeModal = closeModal;
window.sortBy = sortBy;

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

function sortBy(type, buttonElement) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

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

document.getElementById("modal").onclick = function (e) {
  if (e.target === this) {
    closeModal();
  }
};

displaySlide(0);

export { nextSlide, previousSlide, openModal, closeModal, sortBy };
