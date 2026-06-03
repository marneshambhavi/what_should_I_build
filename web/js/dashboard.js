document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch logged-in user name dynamically
    fetch('GetSessionServlet')
        .then(response => response.text())
        .then(username => {
            const usernameSpan = document.querySelector('.username');
            const greetingH1 = document.querySelector('.greeting h1');
            const greetingP = document.querySelector('.greeting p');
            const profileLink = document.querySelector('.sidebar-right > a');

            if (username && username.trim() !== "" && username !== "Guest") {
                if (usernameSpan) usernameSpan.innerText = username;
                if (greetingH1) greetingH1.innerText = `Hey, ${username}!`;
            } else {
                if (usernameSpan) {
                    usernameSpan.innerText = "Guest (Click to Login)";
                    usernameSpan.style.color = "#ef4444";
                }
                if (greetingH1) greetingH1.innerText = "Hey, Guest!";
                if (greetingP) greetingP.innerText = "Please log in to save your awesome project ideas!";
                if (profileLink) {
                    profileLink.setAttribute('href', 'login.html');
                }
            }
        })
        .catch(err => console.error("Error fetching session:", err));

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
    let currentTech = '';
    let currentDiff = '';
    let currentTimeline = '';
    let currentIdeaTitle = '';
    let currentIdeaDesc = '';

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
            
            // Capture User Preferences from Form
            currentTech = document.getElementById('tech-stack').value;
            currentDiff = document.getElementById('difficulty').value;
            currentTimeline = document.getElementById('timeline').value;

            // Reset shuffle count for new generation
            shuffleCount = 3;
            fetchGeneratedIdea(currentTech, currentDiff, currentTimeline);
        });
    }

    // --- ALGORITHM FETCH: Calls Servlet to query matching random idea ---
    function fetchGeneratedIdea(tech, diff, timeline) {
        const params = new URLSearchParams();
        params.append('techStack', tech);
        params.append('difficulty', diff);
        params.append('timeline', timeline);

        fetch('GenerateIdeaServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(response => response.json())
        .then(data => {
            currentIdeaTitle = data.title;
            currentIdeaDesc = data.description;
            renderIdeaCard();
        })
        .catch(err => {
            console.error("Error generating idea:", err);
            alert("Oops! Failed to connect to the idea generator. Please check your connection.");
        });
    }

    function renderIdeaCard() {
        resultContainer.style.display = 'block';
        
        let shuffleBtnStyle = "padding: 10px 20px; font-size: 1rem; flex: 1; background-color: #555; color: white;";
        if (shuffleCount <= 0) {
            shuffleBtnStyle += " opacity: 0.5; cursor: not-allowed;";
        }

        resultContainer.innerHTML = `
            <div class="idea-card glass-panel" style="background: rgba(0,0,0,0.4); text-align: left; padding: 25px; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px;">
                <h4 style="color: #ffd700; font-family: 'Audiowide', sans-serif; font-size: 1.2rem; margin-top: 0; margin-bottom: 10px;">${currentIdeaTitle}</h4>
                <p style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 20px;">${currentIdeaDesc}</p>
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
            fetchGeneratedIdea(currentTech, currentDiff, currentTimeline);
        }
    }

    // --- SAVE IDEA TO DATABASE via SERVLET ---
    function saveIdea() {
        const params = new URLSearchParams();
        params.append('title', currentIdeaTitle);
        params.append('description', currentIdeaDesc);
        params.append('techStack', currentTech);
        params.append('timeline', currentTimeline);

        fetch('SaveIdeaServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(response => {
            if (response.ok) {
                // Add to My Projects list on the right sidebar
                const newListItem = document.createElement('li');
                newListItem.innerHTML = `
                    <div class="item-text">
                        <h4 style="font-size: 1.1rem; margin: 0 0 4px 0;">${currentIdeaTitle.substring(0, 22)}...</h4>
                        <p class="status text-green" style="font-size: 1rem; color: #4ade80 !important; margin: 0;">Just Saved</p>
                    </div>
                `;
                projectList.prepend(newListItem); // Add to top of list
                
                // Update UI to show it's saved
                const saveBtn = document.getElementById('save-idea-btn');
                saveBtn.innerText = '✅ Saved!';
                saveBtn.style.backgroundColor = '#4ade80';
                saveBtn.disabled = true;
            } else {
                alert("Could not save the project. Please check if you are logged in!");
            }
        })
        .catch(err => {
            console.error("Error saving idea:", err);
            alert("Error trying to connect to the database.");
        });
    }
});
