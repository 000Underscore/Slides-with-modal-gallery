class CrewModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
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
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        
        :host([active]) {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .modal-content {
          background: #1a1f3a;
          border-radius: 20px;
          padding: 40px;
          width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }
        
        .close-btn {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 16px;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        .filter-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          font-weight: 500;
        }
        
        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .crew-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .crew-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .crew-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .crew-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .crew-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .crew-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        ..crew-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .crew-item.selected:hover {
          background: rgba(102, 126, 234, 0.3) !important;
        }
        
        .crew-item.selected {
          background: rgba(102, 126, 234, 0.2) !important;
          border-color: #667eea;
        }
        
        .crew-item-photo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          flex-shrink: 0;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .crew-item-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .crew-item-info {
          flex-grow: 1;
        }
        
        .crew-item-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #fff;
        }
        
        .crew-item-rank {
          font-size: 14px;
          color: #a0aec0;
        }
      </style>
      
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Équipage</h2>
          <button class="close-btn">✕</button>
        </div>
        <div class="filter-buttons">
          <button class="filter-btn active" data-type="none">
            Ordre Original
          </button>
          <button class="filter-btn" data-type="name">
            Nom (A-Z)
          </button>
          <button class="filter-btn" data-type="rank">
            Rang
          </button>
        </div>
        <div class="crew-list" id="crewList">
          <!-- Liste dynamique -->
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.closeModal();
      }
    });
    
    // Ajouter les écouteurs pour les boutons de filtre
    const filterButtons = this.shadowRoot.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        this.sortBy(type, btn);
      });
    });
    
    // Écouteur pour le bouton de fermeture
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });
  }

  updateCrewList(crewMembers, currentSlide) {
    const list = this.shadowRoot.getElementById("crewList");
    list.innerHTML = "";

    crewMembers.forEach((member, index) => {
      const item = document.createElement("div");
      item.className = "crew-item";
      if (index === currentSlide) {
        item.classList.add('selected');
      }
      
      item.onclick = () => {
        const slide = document.querySelector('crew-slide');
        if (slide) {
          slide.currentSlide = index;
          slide.displaySlide(index);
        }
        this.closeModal();
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

  closeModal() {
    this.removeAttribute('active');
  }

  sortBy(type, buttonElement) {
    const buttons = this.shadowRoot.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => btn.classList.remove("active"));
    if (buttonElement) {
      buttonElement.classList.add("active");
    }

    const slide = document.querySelector('crew-slide');
    if (slide) {
      slide.sortBy(type);
      this.updateCrewList(slide.displayedCrew, slide.currentSlide);
    }
  }
}

customElements.define('crew-modal', CrewModal);