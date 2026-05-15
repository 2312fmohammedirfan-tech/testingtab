// Usability Testing Lab Logic
const Lab = {
    currentStep: 1,
    data: {
        product: "FoodGo Mobile App",
        objectives: [
            "Check if users can order food easily",
            "Measure time to complete a pizza order",
            "Identify confusing screens in the checkout flow"
        ],
        users: [
            { type: "College Students", experience: "Moderate" },
            { type: "Working Professionals", experience: "High" }
        ],
        tasks: [
            { id: 1, name: "Login/Register", expected: "User enters successfully" },
            { id: 2, name: "Search for 'Pizza'", expected: "Search results show La Pizzeria" },
            { id: 3, name: "Add Margherita Pizza to cart", expected: "Item added successfully" },
            { id: 4, name: "Complete payment", expected: "Reach success screen" }
        ],
        observations: [],
        metrics: {
            successRate: 0,
            avgTime: 0
        }
    },
    timerInterval: null,
    seconds: 0,

    init() {
        this.renderStep(1);
        this.initEventListeners();
        lucide.createIcons();
    },

    initEventListeners() {
        // Sidebar Navigation
        document.querySelectorAll('.nav-step').forEach(btn => {
            btn.onclick = () => this.renderStep(parseInt(btn.dataset.step));
        });

        // Header Buttons
        document.getElementById('btn-next-step').onclick = () => {
            if (this.currentStep < 14) this.renderStep(this.currentStep + 1);
        };

        // Observation Logging
        document.getElementById('btn-add-obs').onclick = () => this.addObservation();

        // Testing Flow
        document.getElementById('btn-complete-task').onclick = () => this.endTask(true);
        document.getElementById('btn-fail-task').onclick = () => this.endTask(false);
    },

    renderStep(stepId) {
        this.currentStep = stepId;
        const container = document.getElementById('step-content');
        const title = document.getElementById('current-step-title');
        const desc = document.getElementById('current-step-desc');
        const overlay = document.getElementById('testing-overlay');

        // Update active class in sidebar
        document.querySelectorAll('.nav-step').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.step) === stepId);
        });

        // Toggle Testing Overlay
        if (stepId === 8 || stepId === 9) {
            overlay.classList.remove('hidden');
            this.startSession();
        } else {
            overlay.classList.add('hidden');
            this.stopTimer();
        }

        switch(stepId) {
            case 1:
                title.innerText = "Step 1: Goal & Objectives";
                desc.innerText = "What are we trying to find out?";
                container.innerHTML = `
                    <div class="input-field">
                        <label>Main Product</label>
                        <input type="text" value="${this.data.product}" id="input-product">
                    </div>
                    <div style="margin-top: 24px;">
                        <label style="display: block; margin-bottom: 12px; font-weight: 500;">Core Objectives</label>
                        <div id="obj-list">
                            ${this.data.objectives.map(obj => `
                                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                                    <input type="text" value="${obj}" style="flex: 1;">
                                    <button class="btn btn-secondary" style="padding: 10px;"><i data-lucide="trash-2"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-secondary" style="margin-top: 8px;"><i data-lucide="plus"></i> Add Objective</button>
                    </div>
                `;
                break;
            case 4:
                title.innerText = "Step 4: Scenarios & Tasks";
                desc.innerText = "Real-life tasks users must complete.";
                container.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--glass-border);">
                                <th style="padding: 12px;">Task</th>
                                <th style="padding: 12px;">Expected Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.tasks.map(task => `
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 16px;">${task.name}</td>
                                    <td style="padding: 16px; color: var(--text-muted);">${task.expected}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                break;
            case 11:
                title.innerText = "Step 11: Analysis";
                desc.innerText = "Summary of findings and metrics.";
                this.renderAnalysis(container);
                break;
            case 14:
                title.innerText = "Step 14: Final Usability Report";
                desc.innerText = "Your complete research findings.";
                this.renderFinalReport(container);
                break;
            default:
                container.innerHTML = `<p style="color: var(--text-dim); text-align: center; margin-top: 100px;">Step content for ${stepId} is ready for your input.</p>`;
        }

        lucide.createIcons();
    },

    startSession() {
        this.seconds = 0;
        this.startTimer();
        this.updateObservationList();
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.seconds++;
            const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            const secs = (this.seconds % 60).toString().padStart(2, '0');
            document.getElementById('session-timer').innerText = `${mins}:${secs}`;
        }, 1000);
    },

    stopTimer() {
        clearInterval(this.timerInterval);
    },

    addObservation() {
        const note = document.getElementById('obs-note').value;
        const severity = document.getElementById('obs-severity').value;
        if (!note) return;

        this.data.observations.push({
            task: "Task 3",
            note,
            severity,
            time: document.getElementById('session-timer').innerText
        });

        document.getElementById('obs-note').value = '';
        this.updateObservationList();
    },

    updateObservationList() {
        const list = document.getElementById('logged-observations');
        list.innerHTML = this.data.observations.map(obs => `
            <div class="obs-card ${obs.severity.toLowerCase()}">
                <p>${obs.note}</p>
                <div class="obs-meta">
                    <span>${obs.severity} Severity</span>
                    <span>${obs.time}</span>
                </div>
            </div>
        `).join('');
    },

    endTask(success) {
        alert(success ? "Task marked as Success!" : "Task marked as Failure.");
        // In a real app, we'd move to the next task in the array
    },

    renderAnalysis(container) {
        const highCount = this.data.observations.filter(o => o.severity === 'High').length;
        container.innerHTML = `
            <div class="input-grid">
                <div class="current-task-display" style="text-align: center;">
                    <p class="label">TASK SUCCESS RATE</p>
                    <h2 style="color: var(--success);">75%</h2>
                </div>
                <div class="current-task-display" style="text-align: center;">
                    <p class="label">CRITICAL ISSUES</p>
                    <h2 style="color: var(--error);">${highCount}</h2>
                </div>
            </div>
            <h3>Key Findings</h3>
            <div style="margin-top: 20px;">
                ${this.data.observations.length === 0 ? '<p>No observations logged yet.</p>' : 
                    this.data.observations.map(obs => `
                        <div style="padding: 16px; background: var(--glass); border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between;">
                            <span>${obs.note}</span>
                            <span style="color: ${obs.severity === 'High' ? 'var(--error)' : 'var(--warning)'}; font-weight: 600;">${obs.severity}</span>
                        </div>
                    `).join('')
                }
            </div>
        `;
    },

    renderFinalReport(container) {
        container.innerHTML = `
            <div style="background: var(--bg-surface); padding: 40px; border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
                <h1 style="margin-bottom: 24px;">Usability Testing Report: ${this.data.product}</h1>
                <section style="margin-bottom: 32px;">
                    <h3 style="color: var(--primary); margin-bottom: 12px;">1. Executive Summary</h3>
                    <p>The usability test revealed that while the overall flow is functional, users encountered significant friction during the checkout process.</p>
                </section>
                <section style="margin-bottom: 32px;">
                    <h3 style="color: var(--primary); margin-bottom: 12px;">2. Methodology</h3>
                    <ul>
                        <li>Participants: 5</li>
                        <li>Method: Moderated Remote</li>
                        <li>Duration: 20 mins per session</li>
                    </ul>
                </section>
                <section>
                    <h3 style="color: var(--primary); margin-bottom: 12px;">3. Recommendations</h3>
                    <div style="padding: 16px; background: rgba(255,107,1,0.05); border-radius: 8px; border-left: 4px solid var(--primary);">
                        <p><strong>Visibility:</strong> Increase the contrast of the 'Checkout' button on the cart screen.</p>
                    </div>
                </section>
                <button class="btn btn-primary" style="margin-top: 32px; width: 100%;" onclick="alert('Exporting to Markdown...')">
                    <i data-lucide="download"></i> Download Report (.md)
                </button>
            </div>
        `;
    }
};

window.onload = () => Lab.init();
