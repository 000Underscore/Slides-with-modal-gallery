import { crewMembers } from "./data.js";

class CrewSlide extends HTMLElement {
  constructor() {
    super();
    this.currentSlide = 0;
    this.displayedCrew = [...crewMembers];
    this.currentSort = "none";
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Forcer la mise à jour après le rendu
    requestAnimationFrame(() => {
      this.displaySlide(0);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
          color: #fff;
        }
        
        .slide-container {
          width: 700px;
          height: 650px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          animation: fadeIn 0.6s ease-out;
          display: flex;
          flex-direction: column;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gallery-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gallery-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        .gallery-icon svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
        
        .slide-content {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        
        .crew-photo {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0 auto 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 80px;
          font-weight: bold;
          color: #fff;
          border: 4px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          transition: transform 0.3s;
          flex-shrink: 0;
        }
        
        .crew-photo:hover {
          transform: scale(1.05);
        }
        
        .crew-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .crew-name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
        }
        
        .crew-rank {
          font-size: 18px;
          color: #a0aec0;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
          flex-shrink: 0;
        }
        
        .crew-description {
          font-size: 16px;
          line-height: 1.6;
          color: #cbd5e0;
          margin-bottom: 40px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          height: 100px;
          flex-shrink: 0;
        }
        
        .navigation {
          display: flex;
          justify-content: center;
          gap: 20px;
          align-items: center;
          margin-top: auto;
        }
        
        .nav-btn {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
        }
        
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
        
        .nav-btn svg {
          width: 20px;
          height: 20px;
          fill: #fff;
        }
        
        .slide-indicator {
          color: #a0aec0;
          font-size: 14px;
          font-weight: 500;
        }
      </style>
      
      <div class="slide-container">
        <div class="gallery-icon" onclick="this.getRootNode().host.openModal()">
          <svg viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
        </div>

        <div class="slide-content" id="slideContent">
          <!-- Contenu dynamique -->
        </div>

        <div class="navigation">
          <button class="nav-btn" onclick="this.getRootNode().host.previousSlide()">
            <svg viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <span class="slide-indicator" id="slideIndicator">1 / 5</span>
          <button class="nav-btn" onclick="this.getRootNode().host.nextSlide()">
            <svg viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Pas besoin d'écouteur ici, tout est géré dans le HTML avec onclick
  }

  displaySlide(index) {
    console.log('displaySlide appelé avec index:', index, 'displayedCrew:', this.displayedCrew);
    
    if (!this.displayedCrew || this.displayedCrew.length === 0) {
      console.error('Aucun membre d\'équipage disponible');
      return;
    }
    
    const member = this.displayedCrew[index];
    const content = this.shadowRoot.getElementById("slideContent");

    if (!content) {
      console.error('Contenu slide non trouvé');
      return;
    }

    const photoContent = member.photo
      ? `<img src="${member.photo}" alt="${member.name}">`
      : member.initial;

    content.innerHTML = `
      <div class="crew-photo">${photoContent}</div>
      <h1 class="crew-name">${member.name}</h1>
      <p class="crew-rank">${member.rank}</p>
      <p class="crew-description">${member.description}</p>
    `;

    const indicator = this.shadowRoot.getElementById("slideIndicator");
    if (indicator) {
      indicator.textContent = `${index + 1} / ${this.displayedCrew.length}`;
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.displayedCrew.length;
    this.displaySlide(this.currentSlide);
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.displayedCrew.length) % this.displayedCrew.length;
    this.displaySlide(this.currentSlide);
  }

  openModal() {
    const modal = document.querySelector('crew-modal');
    if (modal) {
      modal.setAttribute('active', '');
      modal.updateCrewList(this.displayedCrew, this.currentSlide);
    }
  }

  sortBy(type) {
    this.currentSort = type;

    if (type === "name") {
      this.displayedCrew = [...crewMembers].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (type === "rank") {
      this.displayedCrew = [...crewMembers].sort((a, b) => a.rankOrder - b.rankOrder);
    } else {
      this.displayedCrew = [...crewMembers];
    }

    this.currentSlide = 0;
    this.displaySlide(this.currentSlide);
  }
}

customElements.define('crew-slide', CrewSlide);