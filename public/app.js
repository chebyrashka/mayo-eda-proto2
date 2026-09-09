const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- filtered video background ----
  const bgVideo = document.getElementById('bgVideo');
  const backgroundMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncBackgroundVideo(){
    if(backgroundMotion.matches || document.hidden){
      bgVideo.pause();
      return;
    }
    bgVideo.play().catch(() => {});
  }
  backgroundMotion.addEventListener('change', syncBackgroundVideo);
  document.addEventListener('visibilitychange', syncBackgroundVideo);
  document.addEventListener('pointerdown', syncBackgroundVideo, { once:true });
  document.addEventListener('keydown', syncBackgroundVideo, { once:true });
  syncBackgroundVideo();

  // ---- clock ----
  function tick(){
    const d = new Date();
    document.getElementById('clock').textContent = d.toUTCString().slice(17,25) + ' UTC';
  }
  tick(); setInterval(tick, 1000);

  // ---- ticker ----
  const tickerItems = [
    'Active data stewards: 212',
    'Epic Clarity tables: 22,000',
    'SQL data sets: 1,012',
    'APIs deployed: 721',
    'LPR event live streams: 16',
    'PubMed citations: 38 M'
  ];
  const tickerEl = document.getElementById('ticker');
  const full = [...tickerItems, ...tickerItems].map(t => `<span class="dim">›</span> ${t}`).join('<span class="dim">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>');
  tickerEl.innerHTML = full + full;

  // ---- boot sequence ----
  const bootText = document.getElementById('boot-text');
  const bootLines = ['OPENING CHANNEL...','MAPPING SECTORS...','CONSOLE READY.'];
  function runBoot(){
    if(prefersReduced){ document.getElementById('boot').classList.add('hidden'); return; }
    let i = 0, shown = '';
    const cursor = '<span class="cursor"></span>';
    function nextLine(){
      if(i >= bootLines.length){ setTimeout(() => document.getElementById('boot').classList.add('hidden'), 400); return; }
      shown += (shown ? '\n' : '') + bootLines[i];
      bootText.innerHTML = shown + cursor;
      i++;
      setTimeout(nextLine, 520);
    }
    setTimeout(nextLine, 300);
  }
  runBoot();

  // ---- chat logic ----
  const transcript = document.getElementById('transcript');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const lineMap = { services:'lineA', products:'lineB', education:'lineC' };

  const replies = {
    services: "Find Data covers managed pipelines, system integration, and governance frameworks built for enterprise scale. Open the sector on the map for the full guide.",
    products: "Products is what your teams touch directly: dashboards, APIs, and embedded analytics you can drop into existing workflows. Open the sector on the map for the full guide.",
    education: "Learning & Development includes structured training paths and certification tracks for data teams. Open the sector on the map for the full guide.",
    fallback: "I can walk you through three sectors: Find Data, Products, or Learning & Development. Which one do you want to open?"
  };

  function addMessage(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'EDA' ? 'agent' : 'user');
    const label = document.createElement('span');
    label.className = 'who';
    label.textContent = who;
    div.append(label, document.createTextNode(text));
    transcript.appendChild(div);
    transcript.scrollTop = transcript.scrollHeight;
  }
  function highlightLine(topic){
    document.querySelectorAll('.lines line').forEach(l => l.classList.remove('active'));
    const id = lineMap[topic];
    if(id) document.getElementById(id).classList.add('active');
  }
  function respondTo(text){
    const lower = text.toLowerCase();
    let topic = null;
    if(/find data|service|pipeline|integrat|governance/.test(lower)) topic = 'services';
    else if(/product|dashboard|api|analytic/.test(lower)) topic = 'products';
    else if(/educat|train|learn|course|certif/.test(lower)) topic = 'education';
    highlightLine(topic);
    setTimeout(() => addMessage(topic ? replies[topic] : replies.fallback, 'EDA'), 350);
  }
  function sendMessage(text){
    if(!text.trim()) return;
    addMessage(text, 'You');
    respondTo(text);
    chatInput.value = '';
  }
  sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage(chatInput.value); });

  // ================= DETAIL / BROWSE VIEW =================
  const icons = {
    orchestration: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M8.2 7.4 L10.5 15.6 M15.8 7.4 L13.5 15.6 M8.6 6 H15.4"/></svg>',
    shield: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    plug: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0V9z"/><path d="M12 18v3"/></svg>',
    dashboard: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="12" width="4" height="8"/><rect x="10" y="7" width="4" height="13"/><rect x="16" y="3" width="4" height="17"/></svg>',
    api: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4 3 12l5 8M16 4l5 8-5 8"/></svg>',
    layers: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
    ribbon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="5"/><path d="M9 12.5 7 21l5-3 5 3-2-8.5"/></svg>',
    flask: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>',
    people: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M2.5 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5M14 20c.3-2.2 2-4 4-4.3"/></svg>'
  };

  const sectors = {
    services: {
      accent: 'var(--green)',
      eyebrow: 'SECTOR: SVC',
      title: 'Find Data',
      subtitle: 'Managed pipelines, integration, and governance — built to run enterprise data at scale, end to end.',
      cta: 'Talk to a data services specialist',
      features: [
        { icon:'orchestration', title:'Pipeline Orchestration', body:'Automated ingestion and transformation across every source system you run, monitored in real time.' },
        { icon:'shield', title:'Governance & Compliance', body:'Policy enforcement, lineage tracking, and audit-ready reporting built into every pipeline.' },
        { icon:'plug', title:'Integration Layer', body:'Pre-built connectors for the systems you already run, plus a framework for the ones you don\'t.' }
      ],
      stats: [ ['128','Pipelines active'], ['99.98%','Platform uptime'], ['40+','Source integrations'] ],
      steps: [
        ['Connect your sources','Point Axis at the systems you already have — no rip and replace.'],
        ['Define governance rules','Set policy once and it\'s enforced automatically across every pipeline.'],
        ['Monitor and scale','Watch throughput and lineage live as new sources come online.']
      ],
      quote: 'Axis cut our pipeline deployment time from weeks to days.',
      quoteAttr: 'VP of Data Engineering, enterprise customer'
    },
    products: {
      accent: 'var(--orange)',
      eyebrow: 'SECTOR: PRD',
      title: 'Products',
      subtitle: 'Dashboards, APIs, and embedded analytics your teams deploy directly into existing workflows.',
      cta: 'Explore the product catalog',
      features: [
        { icon:'dashboard', title:'Live Dashboards', body:'Configurable views built for the people who need answers, not just charts.' },
        { icon:'api', title:'Developer APIs', body:'REST and streaming APIs with predictable rate limits and clear documentation.' },
        { icon:'layers', title:'Embedded Analytics', body:'Drop analytics into your own applications without building a visualization layer from scratch.' }
      ],
      stats: [ ['2,481','API calls / min'], ['47','Active integrations'], ['12ms','Median latency'] ],
      steps: [
        ['Choose your surface','Dashboard, API, or embedded component — start wherever your team needs it.'],
        ['Connect the API','Authenticate once and pull live data into your own tools.'],
        ['Ship to your teams','Roll out to the people who need it, with usage visibility built in.']
      ],
      quote: 'We embedded Axis analytics into our product in under a sprint.',
      quoteAttr: 'Head of Platform, enterprise customer'
    },
    education: {
      accent: 'var(--yellow)',
      eyebrow: 'SECTOR: L&D',
      title: 'Learning & Development',
      subtitle: 'Structured training paths and certification tracks for data teams who need real skills, not just documentation.',
      cta: 'Browse learning tracks',
      features: [
        { icon:'ribbon', title:'Certification Tracks', body:'Role-based paths from foundations to advanced practitioner, each ending in a credential.' },
        { icon:'flask', title:'Hands-on Labs', body:'Real datasets and real pipelines — no toy examples.' },
        { icon:'people', title:'Team Cohorts', body:'Bring a whole team through a track together, with progress visibility for managers.' }
      ],
      stats: [ ['342','Learners online'], ['18','Certification tracks'], ['94%','Completion rate'] ],
      steps: [
        ['Pick a track','Choose a role-based path suited to where your team is today.'],
        ['Work through labs','Practice on real pipelines, not sandboxed toy data.'],
        ['Certify your team','Finish with a credential that maps to what they actually built.']
      ],
      quote: 'Our data team went from onboarding to shipping in three weeks.',
      quoteAttr: 'Director of Analytics, enterprise customer'
    }
  };

  const consoleView = document.getElementById('view-console');
  const detailView = document.getElementById('view-detail');

  function renderDetail(key){
    const s = sectors[key];
    const featureCards = s.features.map(f => `
      <div class="feature-card">
        <div class="icon">${icons[f.icon]}</div>
        <h4>${f.title}</h4>
        <p>${f.body}</p>
      </div>`).join('');

    const statCards = s.stats.map(([num,label]) => `
      <div>
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label}</div>
      </div>`).join('');

    const stepItems = s.steps.map((st,i) => `
      <div class="step-item">
        <div class="step-num">${i+1}</div>
        <div>
          <strong>${st[0]}</strong>
          <p>${st[1]}</p>
        </div>
      </div>`).join('');

    detailView.style.setProperty('--accent', s.accent);
    detailView.innerHTML = `
      <div class="detail-nav">
        <button class="back-btn" id="backBtn">&larr; Back to console</button>
        <div class="breadcrumb">AXIS / ${s.eyebrow}</div>
      </div>
      <div class="detail-hero">
        <div class="detail-hero-inner">
          <div class="eyebrow">${s.eyebrow}</div>
          <h2>${s.title}</h2>
          <p>${s.subtitle}</p>
          <a class="cta" href="#" id="heroCta">${s.cta}</a>
        </div>
      </div>
      <div class="detail-section">
        <h3>What we deliver</h3>
        <div class="feature-grid">${featureCards}</div>
      </div>
      <div class="stats-band">
        <div class="stats-row">${statCards}</div>
      </div>
      <div class="detail-section">
        <h3>How it works</h3>
        <div class="steps-row">${stepItems}</div>
      </div>
      <div class="quote-band">
        <blockquote>&ldquo;${s.quote}&rdquo;</blockquote>
        <cite>${s.quoteAttr}</cite>
      </div>
      <div class="final-cta">
        <h3>Ready to open this sector?</h3>
        <p>Bring your team in and start where it matters most.</p>
        <a href="#" id="finalCta">${s.cta}</a>
      </div>
      <div class="detail-foot">AXIS console · demo data shown throughout · prototype build</div>
    `;

    document.getElementById('backBtn').addEventListener('click', showConsole);
    ['heroCta','finalCta'].forEach(id => {
      document.getElementById(id).addEventListener('click', e => e.preventDefault());
    });
  }

  function showDetail(key){
    renderDetail(key);
    consoleView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0,0);
    if(prefersReduced){
      detailView.classList.add('visible');
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => detailView.classList.add('visible')));
    }
  }

  function showConsole(){
    detailView.classList.remove('visible');
    const delay = prefersReduced ? 0 : 250;
    setTimeout(() => {
      detailView.style.display = 'none';
      consoleView.style.display = 'block';
      window.scrollTo(0,0);
    }, delay);
  }

  document.querySelectorAll('.node button[data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      showDetail(btn.getAttribute('data-topic'));
    });
  });
