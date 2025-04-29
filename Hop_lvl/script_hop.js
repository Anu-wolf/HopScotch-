class HopscotchGame {
  constructor(level, levelSequences) {
    this.levelSequences = levelSequences;
    this.currentLevel = level;
    this.availableButtons = this.levelSequences[level];
    this.yPosition = 0;
    this.xPosition = 0;

    // DOM Elements
    this.buttonContainer = document.getElementById('buttonContainer');
    this.destinationContainer = document.getElementById('destinationContainer');
    this.lvlNo = document.getElementById('headingText');
    this.checkButton = document.getElementById('checkButton');
    this.resetButton = document.getElementById('resetButton');
    this.runButton = document.getElementById('runButton');
    this.character = document.getElementById('character');
    this.jump = document.getElementById('jump');
    this.hop = document.getElementById('hop');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.nextlvl = parseInt(this.currentLevel) + 1;

    // Initialize the game
    this.updateButtonVisibility();
    this.addEventListeners();
  }

  updateButtonVisibility() {
    const buttons = Array.from(this.buttonContainer.children);

    buttons.forEach(button => {
      button.style.display = 'block';
    });

    buttons.forEach(button => {
      const buttonId = button.id;
      const isButtonAvailable = this.availableButtons.includes(buttonId);
      if (!isButtonAvailable) {
        button.style.display = 'none';
      }
    });
  }

  addEventListeners() {
    this.resetButton.addEventListener('click', () => this.resetGame());
    this.runButton.addEventListener('click', () => this.runSequence());
    this.checkButton.addEventListener('click', () => this.checkSequence());

    this.buttonContainer.addEventListener('dragstart', event => this.handleDragStart(event));
    this.destinationContainer.addEventListener('dragover', event => this.handleDragOver(event));
    this.destinationContainer.addEventListener('drop', event => this.handleDrop(event));
  }

  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const buttonId = event.dataTransfer.getData('text/plain');
    const draggedButton = document.getElementById(buttonId);

    if (this.availableButtons.includes(buttonId)) {
      this.destinationContainer.appendChild(draggedButton);
      draggedButton.setAttribute("draggable", "false");
      draggedButton.style.cursor = 'no-drop';
    }
  }

  isOrderCorrect(currentOrder) {
    if (currentOrder.length !== this.availableButtons.length) return false;

    for (let i = 0; i < this.availableButtons.length; i++) {
      if (currentOrder[i] !== this.availableButtons[i]) {
        return false;
      }
    }
    return true;
  }

  resetGame() {
    while (this.destinationContainer.firstChild) {
      this.buttonContainer.appendChild(this.destinationContainer.firstChild);
      const buttons = Array.from(this.buttonContainer.children);
      buttons.forEach(button => {
        button.setAttribute("draggable", "true");
        button.style.cursor = 'move';
      });
    }

    this.availableButtons = this.levelSequences[this.currentLevel];
    this.character.style.transform = `translateY(${0}px) translateX(${0}px)`;
    this.updateButtonVisibility();
  }

  moveCharacter(buttonSequence, callback) {
    let index = 0;
    this.character.style.transform = `translateY(0px) translateX(0px)`;

    const characterImg = document.getElementById('characterImg');

    const moveNext = () => {
      if (index >= buttonSequence.length) {
        if (callback) callback();
        return;
      }

    const buttonId = buttonSequence[index];
    let moveDistance;

    // Cycle through animation frames
    const animateJump = () => {
      characterImg.src = 'assets/crouch.png';
      setTimeout(() => {
        characterImg.src = 'assets/jump.png';
        setTimeout(() => {
          characterImg.src = 'assets/stand.png';
        }, 1000); // mid air for 1s
      }, 1000); // crouch for 1s
    };

    switch (buttonId) {
      case 'Hop':
        moveDistance = { y: 80, x: 0 };
        break;
      case 'Skip':
        moveDistance = { y: 150, x: 0 };
        break;
      case 'Jump':
        moveDistance = { y: 80, x: 0 };
        break;
      case 'Skip-HopRight':
        moveDistance = { y: 80, x: 32 };
        break;
      case 'Skip-HopLeft':
        moveDistance = { y: 80, x: -32 };
        break;
      default:
        moveDistance = { y: 0, x: 0 };
        break;
    }

    // Trigger image animation
    animateJump();

    this.yPosition += moveDistance.y;
    this.xPosition = moveDistance.x;
    this.character.style.transform = `translateY(${-this.yPosition}px) translateX(${this.xPosition}px)`;

    index++;
    setTimeout(moveNext, 3000); // 3 secs per movement
  };

  moveNext();
}
  
  runSequence() {
    const currentOrder = Array.from(this.destinationContainer.children).map(button => button.id);
    this.moveCharacter(currentOrder, () => {
      if (this.isOrderCorrect(currentOrder)) {
        alert(`Congratulations! You arranged the buttons correctly for place ${this.currentLevel}.`);
        this.showOverlay();
      } else {
        alert('Oops! The buttons are not in the correct order or some buttons are missing. Use the reset button and run again.');
      }
    });
  }

  checkSequence() {
    const currentOrder = Array.from(this.destinationContainer.children).map(button => button.id);
    this.moveCharacter(currentOrder, () => {
      if (this.isOrderCorrect(currentOrder)) {
        alert('The order is right, now use the run button to finish the level');
      } else {
        alert('The order is not right or it is incomplete. Check the animation & use the reset button to try again !!');
      }
      this.character.style.transform = `translateY(${0}px) translateX(${0}px)`;
      this.xPosition = 0;
      this.yPosition = 0;
    });
  }

  showOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const overlayContent = document.createElement('div');
    overlayContent.classList.add('overlay-content');
    overlay.appendChild(overlayContent);

    const overlayMessage = document.createElement('p');
    overlayMessage.textContent = 'Congratulations! You completed this level.';
    overlayContent.appendChild(overlayMessage);

    const startover = document.createElement('button');
    startover.textContent = 'Start Over';
    startover.addEventListener('click', () => this.redirectToPage(`https://rudhraa-r.github.io/HopScotch-/Hop_lvl/idx_hop${this.currentLevel}.html`));
    overlayContent.appendChild(startover);

    const redirectButton = document.createElement('button');
    redirectButton.textContent = 'Next Level';
    redirectButton.addEventListener('click', () => this.redirectToPage(`https://rudhraa-r.github.io/HopScotch-/Hop_lvl/idx_hop${this.nextlvl}.html`));
    overlayContent.appendChild(redirectButton);

    const mainlvl = document.createElement('button');
    mainlvl.textContent = 'Main Levels';
    mainlvl.addEventListener('click', () => this.redirectToPage("https://rudhraa-r.github.io/HopScotch-/Hop_lvl/index_hop.html"));
    overlayContent.appendChild(mainlvl);
  }

  redirectToPage(url) {
    window.location.href = url;
  }
}

// Initialize the game
const levelSequences = {
  1: ['Skip', 'Hop', 'Jump', 'Hop', 'Jump'],
  2: ['Hop', 'Skip', 'Jump', 'Hop', 'Jump'],
  3: ['Hop', 'Hop', 'Skip', 'Hop', 'Jump'],
  4: ['Hop', 'Hop', 'Hop', 'Skip-HopRight', 'Hop', 'Jump'],
  5: ['Hop', 'Hop', 'Hop', 'Skip-HopLeft', 'Hop', 'Jump'], // Example level with right skip
  6: ['Hop', 'Hop', 'Hop', 'Jump', 'Skip'],
  7: ['Hop', 'Hop', 'Hop', 'Jump', 'Hop', 'Skip-HopRight'],
  8: ['Hop', 'Hop', 'Hop', 'Jump', 'Hop', 'Skip-HopLeft'], // Example level with left skip
  // Add more levels as needed
};

const currentLevel = document.getElementById('headingText').innerHTML;
const game = new HopscotchGame(currentLevel, levelSequences);
