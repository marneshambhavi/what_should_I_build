document.addEventListener('DOMContentLoaded', () => {
    
    // Mood Tracker Logic
    const moodBtns = document.querySelectorAll('.mood-btn');
    if (moodBtns.length > 0) {
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Modal Elements
    const modal = document.getElementById('idea-modal');
    const generateBtn = document.getElementById('generate-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('idea-form');
    const resultContainer = document.getElementById('idea-result-container');
    const projectList = document.querySelector('.project-list');
    
    let shuffleCount = 3;
    let currentIdea = null;

    // Sample Ideas
    const ideas = [
        "Build a retro snake game using Canvas API",
        "Create a Pomodoro timer with pixel art themes",
        "Develop a weather app that changes 8-bit backgrounds based on weather",
        "Build a to-do list where tasks are enemies you defeat",
        "Create a personal finance tracker that looks like an RPG inventory"
    ];

    // Open Modal
    if (generateBtn && modal) {
        generateBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    // Close Modal
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            modal.style.display = 'none';
            
            // Reset shuffle count for new generation
            shuffleCount = 3;
            generateRandomIdea();
        });
    }

    function generateRandomIdea() {
        const randomIndex = Math.floor(Math.random() * ideas.length);
        currentIdea = ideas[randomIndex];
        renderIdeaCard();
    }

    function renderIdeaCard() {
        resultContainer.style.display = 'block';
        
        let shuffleBtnStyle = "padding: 10px 20px; font-size: 1rem; flex: 1; background-color: #555; color: white;";
        if (shuffleCount <= 0) {
            shuffleBtnStyle += " opacity: 0.5; cursor: not-allowed;";
        }

        resultContainer.innerHTML = `
            <div class="idea-card glass-panel" style="background: rgba(0,0,0,0.4); text-align: left; padding: 25px; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px;">
                <h4 style="color: #ffd700; font-family: 'Audiowide', sans-serif; font-size: 1.2rem; margin-top: 0; margin-bottom: 10px;">Generated Idea:</h4>
                <p style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 20px;">${currentIdea}</p>
                <div style="display: flex; gap: 15px;">
                    <button id="save-idea-btn" class="btn-primary" style="padding: 10px 20px; font-size: 1rem; flex: 1;">💾 Save</button>
                    <button id="shuffle-idea-btn" class="btn-primary" style="${shuffleBtnStyle}" ${shuffleCount <= 0 ? 'disabled' : ''}>
                        🎲 Shuffle (${shuffleCount})
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners to new dynamically created buttons
        document.getElementById('save-idea-btn').addEventListener('click', saveIdea);
        document.getElementById('shuffle-idea-btn').addEventListener('click', shuffleIdea);
    }

    function shuffleIdea() {
        if (shuffleCount > 0) {
            shuffleCount--;
            generateRandomIdea();
        }
    }

    function saveIdea() {
        // Add to My Projects list on the right sidebar
        const newListItem = document.createElement('li');
        newListItem.innerHTML = `
            <div class="item-text">
                <h4 style="font-size: 1.1rem; margin: 0 0 4px 0;">${currentIdea.substring(0, 22)}...</h4>
                <p class="status text-green" style="font-size: 1rem; color: #4ade80 !important; margin: 0;">Just Saved</p>
            </div>
        `;
        projectList.prepend(newListItem); // Add to top of list
        
        // Update UI to show it's saved
        const saveBtn = document.getElementById('save-idea-btn');
        saveBtn.innerText = '✅ Saved!';
        saveBtn.style.backgroundColor = '#4ade80';
        saveBtn.disabled = true;
    }
});
