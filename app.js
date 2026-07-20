// ProResume Studio Application Logic

const initialData = {
  profile: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Software Engineer & Cloud Architect",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    github: "https://github.com/example-user",
    linkedin: "https://linkedin.com/in/example-user",
    summary: "Experienced Software Engineer specializing in scalable full-stack web applications, microservice architectures, and automated CI/CD cloud deployments. Proven track record of improving application performance and establishing robust cloud security protocols."
  },
  experience: [
    {
      id: "exp_1",
      role: "Senior Full Stack Engineer",
      company: "Acme Systems Corp",
      location: "San Francisco, CA",
      dates: "2022 - Present",
      bullets: [
        "Architected microservices serving over 1M daily users with 99.99% uptime.",
        "Optimized database query response times by 35% using Redis caching layers.",
        "Automated cloud deployments on AWS using Terraform and Docker containers."
      ]
    },
    {
      id: "exp_2",
      role: "Cloud DevOps Consultant",
      company: "Tech Solutions Inc",
      location: "Remote",
      dates: "2020 - 2022",
      bullets: [
        "Automated multi-region Kubernetes deployments using GitHub Actions CI/CD pipelines.",
        "Conducted OWASP security audits to harden production infrastructure and web applications."
      ]
    }
  ],
  awards: [
    {
      id: "award_1",
      title: "Excellence in Engineering Award",
      organization: "Global Tech Summit 2025",
      dates: "October 2025",
      bullets: [
        "Recognized for outstanding technical leadership and keynotes on Autonomous Computing.",
        "Delivered workshops on microservice security and resilient cloud infrastructure."
      ]
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "CloudFlow Orchestrator",
      stack: "React, Node.js, TypeScript, AWS, Docker",
      link: "https://github.com/example-user/cloudflow",
      description: "Production-grade multi-tenant workflow automation platform featuring automated job queuing and real-time telemetry."
    },
    {
      id: "proj_2",
      title: "DevOps Telemetry Dashboard",
      stack: "Python, Flask, Docker, Kubernetes, Prometheus",
      link: "https://github.com/example-user/telemetry-dashboard",
      description: "Lightweight monitoring tool processing container log streams and server metrics for automated alert dispatching."
    }
  ],
  skills: {
    cyber: "OWASP Auditing, Web Application Penetration Testing, Threat Modeling, Vulnerability Scanning (Nessus), Wireshark, Nmap.",
    cloud: "AWS (EC2, S3, RDS, IAM, VPC), Docker, Kubernetes, Terraform IaC, GitHub Actions CI/CD, Linux Administration.",
    dev: "TypeScript, JavaScript (ES6+), React, Next.js, Node.js, Express, Python, PostgreSQL, MongoDB, REST APIs."
  },
  education: [
    {
      id: "edu_1",
      degree: "B.S. in Computer Science",
      school: "University of Technology",
      dates: "2016 - 2020",
      notes: "Focus on Distributed Systems, Algorithms, and Software Architecture."
    }
  ],
  certifications: "• AWS Certified Solutions Architect – Associate\n• Certified Information Systems Security Professional (CISSP)\n• CompTIA Security+ Certified Analyst",
  design: {
    template: "template-executive",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    fontFamily: "'Inter', sans-serif"
  }
};

let appState = JSON.parse(JSON.stringify(initialData));

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  bindStaticInputs();
  renderExperienceList();
  renderAwardsList();
  renderProjectsList();
  renderEducationList();
  renderResume();

  // Dynamic Add Triggers
  document.getElementById("addExpBtn").addEventListener("click", addExperience);
  document.getElementById("addAwardBtn").addEventListener("click", addAward);
  document.getElementById("addProjectBtn").addEventListener("click", addProject);
  document.getElementById("addEduBtn").addEventListener("click", addEducation);

  // GitHub Auto Fetch
  document.getElementById("loadGithubBtn").addEventListener("click", fetchGithubRepos);
  document.getElementById("exportJsonBtn").addEventListener("click", exportStateJson);

  // Design Listeners
  document.getElementById("select-template").addEventListener("change", (e) => {
    appState.design.template = e.target.value;
    renderResume();
  });

  document.getElementById("select-color").addEventListener("change", (e) => {
    const [primary, accent] = e.target.value.split("|");
    appState.design.primaryColor = primary;
    appState.design.accentColor = accent;
    renderResume();
  });

  document.getElementById("select-font").addEventListener("change", (e) => {
    appState.design.fontFamily = e.target.value;
    renderResume();
  });
});

// Setup Editor Navigation Tabs
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      tab.classList.add("active");
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.add("active");
    });
  });
}

// Bind Profile and Skill Text Area Inputs
function bindStaticInputs() {
  const bindIdToKey = (id, objectPath) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      const keys = objectPath.split(".");
      if (keys.length === 2) {
        appState[keys[0]][keys[1]] = e.target.value;
      } else {
        appState[keys[0]] = e.target.value;
      }
      renderResume();
    });
  };

  bindIdToKey("input-fullName", "profile.fullName");
  bindIdToKey("input-jobTitle", "profile.jobTitle");
  bindIdToKey("input-email", "profile.email");
  bindIdToKey("input-phone", "profile.phone");
  bindIdToKey("input-location", "profile.location");
  bindIdToKey("input-github", "profile.github");
  bindIdToKey("input-linkedin", "profile.linkedin");
  bindIdToKey("input-summary", "profile.summary");

  bindIdToKey("input-secSkills", "skills.cyber");
  bindIdToKey("input-cloudSkills", "skills.cloud");
  bindIdToKey("input-devSkills", "skills.dev");
  bindIdToKey("input-certifications", "certifications");
}

// Experience List Management
function renderExperienceList() {
  const container = document.getElementById("experience-list-container");
  container.innerHTML = "";

  appState.experience.forEach((exp, index) => {
    const card = document.createElement("div");
    card.className = "dynamic-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <button class="btn btn-danger" onclick="removeExperience('${exp.id}')">Remove Job</button>
      </div>
      <div class="form-group">
        <label>Role / Position Title</label>
        <input type="text" value="${escapeHtml(exp.role)}" oninput="updateExp('${exp.id}', 'role', this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Company</label>
          <input type="text" value="${escapeHtml(exp.company)}" oninput="updateExp('${exp.id}', 'company', this.value)">
        </div>
        <div class="form-group">
          <label>Dates</label>
          <input type="text" value="${escapeHtml(exp.dates)}" oninput="updateExp('${exp.id}', 'dates', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label>Bullets (One bullet per line)</label>
        <textarea rows="3" oninput="updateExpBullets('${exp.id}', this.value)">${escapeHtml(exp.bullets.join('\n'))}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function addExperience() {
  const newExp = {
    id: `exp_${Date.now()}`,
    role: "Senior DevSecOps Engineer",
    company: "Tech Enterprise",
    location: "Remote",
    dates: "2024 - Present",
    bullets: ["Implemented zero-trust security architecture across multi-region AWS cloud instances."]
  };
  appState.experience.push(newExp);
  renderExperienceList();
  renderResume();
}

window.removeExperience = function(id) {
  appState.experience = appState.experience.filter(e => e.id !== id);
  renderExperienceList();
  renderResume();
};

window.updateExp = function(id, field, value) {
  const item = appState.experience.find(e => e.id === id);
  if (item) {
    item[field] = value;
    renderResume();
  }
};

window.updateExpBullets = function(id, textValue) {
  const item = appState.experience.find(e => e.id === id);
  if (item) {
    item.bullets = textValue.split("\n").filter(line => line.trim().length > 0);
    renderResume();
  }
};

// Awards List Management
function renderAwardsList() {
  const container = document.getElementById("awards-list-container");
  if (!container) return;
  container.innerHTML = "";

  (appState.awards || []).forEach(award => {
    const card = document.createElement("div");
    card.className = "dynamic-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <button class="btn btn-danger" onclick="removeAward('${award.id}')">Remove Award</button>
      </div>
      <div class="form-group">
        <label>Award / Title</label>
        <input type="text" value="${escapeHtml(award.title)}" oninput="updateAward('${award.id}', 'title', this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Organization / Host</label>
          <input type="text" value="${escapeHtml(award.organization)}" oninput="updateAward('${award.id}', 'organization', this.value)">
        </div>
        <div class="form-group">
          <label>Dates</label>
          <input type="text" value="${escapeHtml(award.dates)}" oninput="updateAward('${award.id}', 'dates', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label>Bullets / Highlights (One per line)</label>
        <textarea rows="3" oninput="updateAwardBullets('${award.id}', this.value)">${escapeHtml((award.bullets || []).join('\n'))}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function addAward() {
  if (!appState.awards) appState.awards = [];
  const newAward = {
    id: `award_${Date.now()}`,
    title: "Honorable Speaker / Award Title",
    organization: "Organization / Institution",
    dates: "2026",
    bullets: ["Delivered keynote sessions on advanced AI architecture and security."]
  };
  appState.awards.push(newAward);
  renderAwardsList();
  renderResume();
}

window.removeAward = function(id) {
  appState.awards = appState.awards.filter(a => a.id !== id);
  renderAwardsList();
  renderResume();
};

window.updateAward = function(id, field, value) {
  const item = appState.awards.find(a => a.id === id);
  if (item) {
    item[field] = value;
    renderResume();
  }
};

window.updateAwardBullets = function(id, textValue) {
  const item = appState.awards.find(a => a.id === id);
  if (item) {
    item.bullets = textValue.split("\n").filter(line => line.trim().length > 0);
    renderResume();
  }
};

// Projects List Management
function renderProjectsList() {
  const container = document.getElementById("projects-list-container");
  container.innerHTML = "";

  appState.projects.forEach(proj => {
    const card = document.createElement("div");
    card.className = "dynamic-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <button class="btn btn-danger" onclick="removeProject('${proj.id}')">Remove Project</button>
      </div>
      <div class="form-group">
        <label>Project Name</label>
        <input type="text" value="${escapeHtml(proj.title)}" oninput="updateProject('${proj.id}', 'title', this.value)">
      </div>
      <div class="form-group">
        <label>Technologies / Stack</label>
        <input type="text" value="${escapeHtml(proj.stack)}" oninput="updateProject('${proj.id}', 'stack', this.value)">
      </div>
      <div class="form-group">
        <label>Project / Repository URL</label>
        <input type="url" value="${escapeHtml(proj.link)}" oninput="updateProject('${proj.id}', 'link', this.value)">
      </div>
      <div class="form-group">
        <label>Description & Impact</label>
        <textarea rows="2" oninput="updateProject('${proj.id}', 'description', this.value)">${escapeHtml(proj.description)}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function addProject() {
  const newProj = {
    id: `proj_${Date.now()}`,
    title: "New Cloud Automation Tool",
    stack: "Python, Terraform, Docker",
    link: "https://github.com/Mr-Gt-hash",
    description: "Automated container security scanning script detecting secret leaks in CI/CD pipelines."
  };
  appState.projects.push(newProj);
  renderProjectsList();
  renderResume();
}

window.removeProject = function(id) {
  appState.projects = appState.projects.filter(p => p.id !== id);
  renderProjectsList();
  renderResume();
};

window.updateProject = function(id, field, value) {
  const item = appState.projects.find(p => p.id === id);
  if (item) {
    item[field] = value;
    renderResume();
  }
};

// Education List Management
function renderEducationList() {
  const container = document.getElementById("education-list-container");
  container.innerHTML = "";

  appState.education.forEach(edu => {
    const card = document.createElement("div");
    card.className = "dynamic-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <button class="btn btn-danger" onclick="removeEducation('${edu.id}')">Remove</button>
      </div>
      <div class="form-group">
        <label>Degree / Certificate</label>
        <input type="text" value="${escapeHtml(edu.degree)}" oninput="updateEdu('${edu.id}', 'degree', this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Institution</label>
          <input type="text" value="${escapeHtml(edu.school)}" oninput="updateEdu('${edu.id}', 'school', this.value)">
        </div>
        <div class="form-group">
          <label>Years</label>
          <input type="text" value="${escapeHtml(edu.dates)}" oninput="updateEdu('${edu.id}', 'dates', this.value)">
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function addEducation() {
  const newEdu = {
    id: `edu_${Date.now()}`,
    degree: "Cloud Architecture Specialization",
    school: "AWS Academy",
    dates: "2023",
    notes: ""
  };
  appState.education.push(newEdu);
  renderEducationList();
  renderResume();
}

window.removeEducation = function(id) {
  appState.education = appState.education.filter(e => e.id !== id);
  renderEducationList();
  renderResume();
};

window.updateEdu = function(id, field, value) {
  const item = appState.education.find(e => e.id === id);
  if (item) {
    item[field] = value;
    renderResume();
  }
};

// Main Resume Rendering Canvas Generator
function renderResume() {
  const paper = document.getElementById("resumePaper");
  if (!paper) return;

  // Set CSS Variables for Colors and Typography
  paper.style.setProperty("--resume-primary", appState.design.primaryColor);
  paper.style.setProperty("--resume-accent", appState.design.accentColor);
  paper.style.setProperty("--resume-font", appState.design.fontFamily);

  paper.className = `paper-canvas ${appState.design.template}`;

  const p = appState.profile;

  if (appState.design.template === "template-creative") {
    paper.innerHTML = `
      <div class="sidebar">
        <div class="name">${escapeHtml(p.fullName)}</div>
        <div class="job-title">${escapeHtml(p.jobTitle)}</div>
        
        <div class="section-title">Contact</div>
        <div class="sidebar-text">
          ${escapeHtml(p.email)}<br>
          ${escapeHtml(p.phone)}<br>
          ${escapeHtml(p.location)}
        </div>

        <div class="section-title">Links</div>
        <div class="sidebar-text">
          <a href="${escapeHtml(p.github)}" target="_blank" style="color:#93c5fd;text-decoration:none;">GitHub</a><br>
          <a href="${escapeHtml(p.linkedin)}" target="_blank" style="color:#93c5fd;text-decoration:none;">Portfolio</a>
        </div>

        <div class="section-title">Skills Overview</div>
        <div class="sidebar-text">
          <strong>Security:</strong> ${escapeHtml(appState.skills.cyber)}<br><br>
          <strong>Cloud:</strong> ${escapeHtml(appState.skills.cloud)}
        </div>
      </div>

      <div class="main-col">
        <section class="section">
          <div class="section-title">Professional Summary</div>
          <p class="summary">${escapeHtml(p.summary)}</p>
        </section>

        <section class="section">
          <div class="section-title">Experience</div>
          ${renderExpHtml()}
        </section>

        <section class="section">
          <div class="section-title">Awards & Achievements</div>
          ${renderAwardsHtml()}
        </section>

        <section class="section">
          <div class="section-title">Featured Projects</div>
          ${renderProjectsHtml()}
        </section>

        <section class="section">
          <div class="section-title">Education & Certifications</div>
          ${renderEduHtml()}
        </section>
      </div>
    `;
  } else {
    // Standard Executive & Minimalist Layouts
    paper.innerHTML = `
      <header>
        <div>
          <h1 class="name">${escapeHtml(p.fullName)}</h1>
          <div class="job-title">${escapeHtml(p.jobTitle)}</div>
        </div>
        <div class="contact-info">
          <div>${escapeHtml(p.email)} | ${escapeHtml(p.phone)}</div>
          <div>${escapeHtml(p.location)}</div>
          <div><a href="${escapeHtml(p.github)}" target="_blank">${escapeHtml(p.github.replace('https://', ''))}</a></div>
        </div>
      </header>

      <section class="section">
        <div class="section-title">Professional Summary</div>
        <p class="summary">${escapeHtml(p.summary)}</p>
      </section>

      <section class="section">
        <div class="section-title">Technical Expertise</div>
        <div class="skills-grid">
          <div>
            <div class="skill-group-title">Cyber Security & Vulnerability Auditing</div>
            <div class="skill-list">${escapeHtml(appState.skills.cyber)}</div>
          </div>
          <div>
            <div class="skill-group-title">Cloud Infrastructure & DevOps</div>
            <div class="skill-list">${escapeHtml(appState.skills.cloud)}</div>
          </div>
          <div style="grid-column: span 2;">
            <div class="skill-group-title">Full Stack Development & Scripting</div>
            <div class="skill-list">${escapeHtml(appState.skills.dev)}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">Professional Experience</div>
        ${renderExpHtml()}
      </section>

      <section class="section">
        <div class="section-title">Awards & Achievements</div>
        ${renderAwardsHtml()}
      </section>

      <section class="section">
        <div class="section-title">Key Projects & Systems</div>
        ${renderProjectsHtml()}
      </section>

      <section class="section">
        <div class="section-title">Education & Credentials</div>
        ${renderEduHtml()}
        <div style="margin-top: 0.8rem; font-size: 0.82rem; color: var(--resume-muted);">
          <strong>Certifications:</strong><br>
          ${escapeHtml(appState.certifications).replace(/\n/g, '<br>')}
        </div>
      </section>
    `;
  }

  evaluateATS();
}

function renderExpHtml() {
  return appState.experience.map(exp => `
    <div style="margin-bottom: 0.75rem; page-break-inside: avoid; break-inside: avoid;">
      <div class="item-header">
        <span>${escapeHtml(exp.role)}</span>
        <span>${escapeHtml(exp.company)}</span>
      </div>
      <div class="item-sub">
        <span>${escapeHtml(exp.location || '')}</span>
        <span>${escapeHtml(exp.dates)}</span>
      </div>
      <ul class="bullets">
        ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderAwardsHtml() {
  if (!appState.awards || appState.awards.length === 0) return '';
  return appState.awards.map(award => `
    <div style="margin-bottom: 0.75rem; page-break-inside: avoid; break-inside: avoid;">
      <div class="item-header">
        <span>${escapeHtml(award.title)}</span>
        <span>${escapeHtml(award.organization)}</span>
      </div>
      <div class="item-sub">
        <span></span>
        <span>${escapeHtml(award.dates)}</span>
      </div>
      <ul class="bullets">
        ${(award.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderProjectsHtml() {
  return appState.projects.map(proj => `
    <div style="margin-bottom: 0.65rem; page-break-inside: avoid; break-inside: avoid;">
      <div class="item-header">
        <span><a href="${escapeHtml(proj.link)}" target="_blank" style="color:var(--resume-primary);text-decoration:none;">${escapeHtml(proj.title)} 🔗</a></span>
        <span style="font-size:0.76rem;font-weight:600;color:var(--resume-accent);">${escapeHtml(proj.stack)}</span>
      </div>
      <p style="font-size:0.8rem;color:var(--resume-text);margin-top:0.15rem;line-height:1.35;">${escapeHtml(proj.description)}</p>
    </div>
  `).join('');
}

function renderEduHtml() {
  return appState.education.map(edu => `
    <div style="margin-bottom: 0.45rem; page-break-inside: avoid; break-inside: avoid;">
      <div class="item-header">
        <span>${escapeHtml(edu.degree)}</span>
        <span>${escapeHtml(edu.dates)}</span>
      </div>
      <div class="item-sub">
        <span>${escapeHtml(edu.school)}</span>
      </div>
    </div>
  `).join('');
}

// GitHub Repos API Loader
async function fetchGithubRepos() {
  const btn = document.getElementById("loadGithubBtn");
  btn.innerText = "⏳ Syncing...";
  try {
    const res = await fetch("https://api.github.com/users/Mr-Gt-hash/repos?sort=updated&per_page=6");
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();

    const fetchedProjects = data.map(repo => ({
      id: `proj_gh_${repo.id}`,
      title: repo.name,
      stack: repo.language || "TypeScript / Python",
      link: repo.html_url,
      description: repo.description || "Open-source repository created by Gaurav Thakur."
    }));

    appState.projects = fetchedProjects;
    renderProjectsList();
    renderResume();
    btn.innerText = "✅ Synced from GitHub!";
    setTimeout(() => { btn.innerText = "✨ Load GitHub Data"; }, 3000);
  } catch (err) {
    alert("Could not fetch repositories from GitHub directly. Using current portfolio items.");
    btn.innerText = "✨ Load GitHub Data";
  }
}

// ATS Score Calculation Engine
function evaluateATS() {
  let score = 70;
  const fullContent = JSON.stringify(appState).toLowerCase();
  
  const keywords = ["aws", "docker", "kubernetes", "penetration", "owasp", "node.js", "react", "ci/cd", "terraform", "python", "security"];
  keywords.forEach(kw => {
    if (fullContent.includes(kw)) score += 2;
  });

  const actionVerbs = ["lead", "uncovered", "refactored", "automated", "provided", "conducted", "configured", "constructed", "built"];
  actionVerbs.forEach(av => {
    if (fullContent.includes(av)) score += 1;
  });

  score = Math.min(score, 98);

  const circle = document.getElementById("atsScoreCircle");
  const label = document.getElementById("atsRatingLabel");
  if (circle && label) {
    circle.innerText = `${score}%`;
    if (score >= 90) {
      label.innerText = "Excellent ATS Match";
    } else if (score >= 80) {
      label.innerText = "Good ATS Alignment";
    } else {
      label.innerText = "Needs Optimization";
    }
  }
}

function exportStateJson() {
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `${appState.profile.fullName.replace(/\s+/g, '_')}_Resume_Data.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function downloadPdf() {
  const element = document.getElementById("resumePaper");
  const opt = {
    margin:       [6, 6, 6, 6],
    filename:     `${appState.profile.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  const btn = document.getElementById("downloadPdfBtn");
  if (btn) btn.innerText = "⏳ Generating PDF...";

  html2pdf().set(opt).from(element).save().then(() => {
    if (btn) btn.innerText = "⬇️ Download PDF";
  }).catch(err => {
    console.error("PDF generation error:", err);
    window.print();
    if (btn) btn.innerText = "⬇️ Download PDF";
  });
}

function downloadHtml() {
  const paperHtml = document.getElementById("resumePaper").outerHTML;
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(appState.profile.fullName)} - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Outfit:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
    body { font-family: ${appState.design.fontFamily}; background: #f8fafc; color: #1e293b; padding: 2rem; }
    .paper-canvas { max-width: 820px; margin: 0 auto; background: #fff; padding: 2.5rem; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .template-executive header { border-bottom: 3px solid ${appState.design.primaryColor}; padding-bottom: 1.2rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; }
    .name { font-size: 2.2rem; font-weight: 800; color: ${appState.design.primaryColor}; }
    .job-title { font-size: 1rem; font-weight: 700; color: ${appState.design.accentColor}; text-transform: uppercase; margin-top: 0.3rem; }
    .section-title { font-size: 0.95rem; font-weight: 800; text-transform: uppercase; color: ${appState.design.primaryColor}; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; margin-bottom: 0.85rem; margin-top: 1.4rem; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .item-header { display: flex; justify-content: space-between; font-weight: 700; color: ${appState.design.primaryColor}; }
    .item-sub { display: flex; justify-content: space-between; font-size: 0.82rem; color: #64748b; margin-bottom: 0.4rem; }
    ul.bullets { padding-left: 1.1rem; font-size: 0.83rem; line-height: 1.5; }
  </style>
</head>
<body>
  ${paperHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = `${appState.profile.fullName.replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Bind PDF & HTML Download buttons
document.addEventListener("DOMContentLoaded", () => {
  const pdfBtn = document.getElementById("downloadPdfBtn");
  if (pdfBtn) pdfBtn.addEventListener("click", downloadPdf);

  const htmlBtn = document.getElementById("downloadHtmlBtn");
  if (htmlBtn) htmlBtn.addEventListener("click", downloadHtml);
});

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
