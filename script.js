document.addEventListener('DOMContentLoaded', function () {
  // =====================================================
  // Core state
  // =====================================================
  let userIntervened = false;
  let currentScreenIndex = 0;
  let isScrolling = false;
  let screens = [];
  let planeEl = null;
  let lastExitY = null;
  const PLANE_W = 100, PLANE_H = 100;

  // Trail state variables
  let trailCanvas, ctx;
  let activeTrailPoints = [];
  let settledTrails = []; // Will store { points: [...], opacity: 1.0, isFading: false }
  const SUZLON_TEAL = '#00978D';


  // =====================================================
  // Frame alignments
  // =====================================================
  const frameAlignments = [
    'left', 'left', 'right', 'left', 'right', 'left', 'left', 'right', 
    'right', 'left', 'right', 'left', 'left', 'right', 'left', 'right', 
    'right', 'left', 'right', 'left', 'right', 'right', 'left', 'right', 
    'right', 'left', 'left', 'right', 'left', 'right', 'left', 'right', 
    'left', 'right', 'left', 'left'
  ];

  // =====================================================
  // Full timeline data
  // =====================================================
  const xlsxTimeline = [
    { "Frame": 1,  "Title": "India's most<br>trusted winds", "H1Copy": "<br><br><br>START THE JOURNEY", "BodyCopy": "", "H2Copy-2": "" },
    { "Frame": 2,  "Title": "1995", "H1Copy": "Formation of <br>Suzlon Energy Limited", "BodyCopy": "India's first renewable energy <br>company was born from one <br>man's conviction that progress <br>and the planet can go together.", "H2Copy-2": "So, what happened next?  <br>CONTINUE." },
    { "Frame": 3,  "Title": "1996", "H1Copy": "First 0.27 MW wind turbine commissioned", "BodyCopy": "Suzlon got its first order from PSU giant-IPCL, with the first wind turbine being installed at Dhank, Gujarat.", "H2Copy-2": "Take the journey ahead.<br>CONTINUE." },
    { "Frame": 4,  "Title": "1997", "H1Copy": "First wind energy manufacturing facility", "BodyCopy": "India's Aatmanirbhar journey in wind began with Suzlon's first turbine manufacturing facility at Daman, with only 800 MW annual capacity.", "H2Copy-2": "From 800 MW to 4,500 MW capacity.<br>CONTINUE." },
    { "Frame": 5,  "Title": "2000", "H1Copy": "First private sector project", "BodyCopy": "India Inc. bought into the promise of wind energy when Suzlon won Tata Finance's turnkey wind farm project to reduce its power costs and carbon footprint alike. The journey from one customer to over 1,900.", "H2Copy-2": "Trust built, one turbine at a time.<br>CONTINUE." },
    { "Frame": 6,  "Title": "2001", "H1Copy": "First 1 MW wind turbine commissioned", "BodyCopy": "Suzlon installed India's first, game-changing megawatt-class wind turbine at Vankusawade, Satara, for Niskalp Investments, elevating the renewables game in India from kilowatts to megawatts.", "H2Copy-2": "Explore India's rise as a global renewables powerhouse.<br>CONTINUE." },
    { "Frame": 7,  "Title": "2001", "H1Copy": "AE Rotor Holding BV, Netherlands, established", "BodyCopy": "Suzlon established its first office on foreign soil with a rotor technology setup in the Netherlands, marking Suzlon's endeavour to harness the best global minds.", "H2Copy-2": "Explore India's rise as a global renewables powerhouse.<br>CONTINUE." },
    { "Frame": 8,  "Title": "2002", "H1Copy": "India made its first blades in India", "BodyCopy": "Crafted locally in Daman, India's first-ever wind turbine blades- Suzlon's S60 marked a breakthrough in homegrown wind tech and manufacturing, paving the way for more jobs, local capacity, and a new wind economy.", "H2Copy-2": "India on the global wind energy map.<br>CONTINUE." },
    { "Frame": 9,  "Title": "2002 - 2005", "H1Copy": "Expanding to Australia, Denmark, Germany, Portugal, and many others across Europe", "BodyCopy": "With technology widely accepted, business models that were customer centric, and Indian ingenuity, Suzlon rapidly entered markets across continents, often featuring among the top 3 in each geography.", "H2Copy-2": "Across 17 countries on 6 continents.<br>CONTINUE." },
    { "Frame": 10, "Title": "2003", "H1Copy": "Suzlon enters the U.S. market", "BodyCopy": "India's first wind energy deliveries to the U.S. started with Suzlon's first order there. It also flagged off the journey of Indian wind energy exports to the world - the start of a global company in the making.", "H2Copy-2": "From 22 MW to over 6,000 MW of exports.<br>CONTINUE." },
    { "Frame": 11, "Title": "2003", "H1Copy": "Asia's largest wind farm in Maharashtra", "BodyCopy": "Suzlon set global benchmarks by building Asia's largest wind farm at Vankusawade, Maharashtra...", "H2Copy-2": "From one turbine to wind farms to power plants.<br>CONTINUE." },
    { "Frame": 12, "Title": "2004", "H1Copy": "Introducing China to wind manufacturing", "BodyCopy": "Suzlon established China's first wind energy manufacturing facility in Tianjin...", "H2Copy-2": "Building a sustainable world, one nation at a time.<br>CONTINUE." },
    { "Frame": 13, "Title": "2005", "H1Copy": "Taking wind energy public...", "BodyCopy": "Suzlon brought wind and its magic to every Indian through its public listing...", "H2Copy-2": "A journey from 5+ lakh to 55+ lakh retail investors.<br>CONTINUE." },
    { "Frame": 14, "Title": "2005", "H1Copy": "Suzlon ranked 9th globally by BTM Report", "BodyCopy": "Suzlon became the first and only Indian wind company to enter the global top ten...", "H2Copy-2": "Taking India to the world.<br>CONTINUE." },
    { "Frame": 15, "Title": "2005", "H1Copy": "First 2 MW turbine commissioned", "BodyCopy": "Dedicated on Independence Day, symbolising freedom from fossil fuels...", "H2Copy-2": "An odyssey of innovation from 0.2 MW to 3.15 MW.<br>CONTINUE." },
    { "Frame": 16, "Title": "2005", "H1Copy": "1,000 MW milestone crossed", "BodyCopy": "What began as a cottage industry matured into an established sector...", "H2Copy-2": "From \"good-to-have\" to critical for India's energy transition.<br>CONTINUE." },
    { "Frame": 17, "Title": "2006", "H1Copy": "Hansen Transmissions acquired", "BodyCopy": "Belgium's Hansen became part of the Suzlon family...", "H2Copy-2": "Ambition to action, a win for the planet.<br>CONTINUE." },
    { "Frame": 18, "Title": "2006", "H1Copy": "Ranked fifth WTG manufacturer globally", "BodyCopy": "As Suzlon grew from strength to strength...", "H2Copy-2": "Achieving climate action through Indian ambition.<br>CONTINUE." },
    { "Frame": 19, "Title": "2007", "H1Copy": "SE Forge Limited formed", "BodyCopy": "India's first dedicated foundries for wind energy...", "H2Copy-2": "Indigenising wind manufacturing ecosystem...<br>CONTINUE." },
    { "Frame": 20, "Title": "2007", "H1Copy": "Asia's first blade testing facility established", "BodyCopy": "India became the only country after the Netherlands and the USA...", "H2Copy-2": "Leading the world in R&D and Testing.<br>CONTINUE." },
    { "Frame": 21, "Title": "2007", "H1Copy": "First wind energy company to receive FDI", "BodyCopy": "A 40 MW project from British Petroleum...", "H2Copy-2": "Making India a credible renewables investment hub.<br>CONTINUE." },
    { "Frame": 22, "Title": "2008", "H1Copy": "Harvard Business school case study", "BodyCopy": "\"The Suzlon Edge\" analysed bold strategies...", "H2Copy-2": "A journey that caught history's eye.<br>CONTINUE." },
    { "Frame": 23, "Title": "2009", "H1Copy": "Suzlon and TERI University sign an MoU", "BodyCopy": "Introduced the first M.Tech in Renewable Energy...", "H2Copy-2": "The story of building a nation.<br>CONTINUE." },
    { "Frame": 24, "Title": "2010", "H1Copy": "Ranked third WTG manufacturer globally", "BodyCopy": "First and only Indian wind energy company to reach the global top three...", "H2Copy-2": "From No. 1 in India to No. 3 in the world.<br>CONTINUE." },
    { "Frame": 25, "Title": "2010", "H1Copy": "Among the world's greenest HQ", "BodyCopy": "Suzlon One Earth in Pune...", "H2Copy-2": "As wind found a home, so did sustainability.<br>CONTINUE." },
    { "Frame": 26, "Title": "2014", "H1Copy": "Asia's largest wind park in Gujarat", "BodyCopy": "At 1,100 MW, the Kutch Wind Park...", "H2Copy-2": "Scaling climate action with every wind park.<br>CONTINUE." },
    { "Frame": 27, "Title": "2014", "H1Copy": "Hybrid Lattice Tower", "BodyCopy": "120m hybrid lattice-tubular tower at Jamanwada...", "H2Copy-2": "Marching ahead with a passion for innovation.<br>CONTINUE." },
    { "Frame": 28, "Title": "2017", "H1Copy": "11 GW milestone achieved", "BodyCopy": "More wind energy for more cities, industries, and homes...", "H2Copy-2": "From milestone to movement...<br>CONTINUE." },
    { "Frame": 29, "Title": "2018", "H1Copy": "S128 commissioned", "BodyCopy": "140m hub / 128m rotor...", "H2Copy-2": "Turbines that stand as tall as the nation.<br>CONTINUE." },
    { "Frame": 30, "Title": "2020", "H1Copy": "Restructuring for growth", "BodyCopy": "Debt, org, and business-model restructuring + ₹1,200 cr Rights Issue...", "H2Copy-2": "Progress built on resilience.<br>CONTINUE." },
    { "Frame": 31, "Title": "2022-23", "H1Copy": "Debt-free and positioned to lead", "BodyCopy": "₹1,200 cr Rights + ₹2,000 cr QIP oversubscribed...", "H2Copy-2": "Investors backed the future of wind.<br>CONTINUE." },
    { "Frame": 32, "Title": "2023", "H1Copy": "20 GW installed worldwide", "BodyCopy": "Only Indian company to install over 20 GW across 17 countries...", "H2Copy-2": "Transforming energy that transforms lives.<br>CONTINUE." },
    { "Frame": 33, "Title": "2023", "H1Copy": "S144 — 3 MW platform", "BodyCopy": "Built for India's diverse wind sites...", "H2Copy-2": "Innovation meets inclusivity...<br>CONTINUE." },
    { "Frame": 34, "Title": "2024", "H1Copy": "Safeguarding India's renewable assets", "BodyCopy": "Acquisition of Renom Energy Services...", "H2Copy-2": "From powering turbines to protecting assets.<br>CONTINUE." },
    { "Frame": 35, "Title": "2025", "H1Copy": "Best year in a decade", "BodyCopy": "Record 5.6 GW order book...", "H2Copy-2": "From wind to possibility...<br>CONTINUE." }
  ];
  const screenData = [];

  (function applyTimelineAndImages() {
    function guessEraFromTitle(title) {
        const t = String(title || '').trim();
        const m = t.match(/(\d{4})(?:\s*[\-\u2012-\u2015\u2212]\s*(\d{2,4}))?/);
        if (!m) return '';
        const y1 = parseInt(m[1], 10);
        if (y1 <= 1999) return '1995-1999';
        if (y1 <= 2004) return '2000-2004';
        if (y1 <= 2009) return '2005-2009';
        if (y1 <= 2014) return '2010-2014';
        if (y1 <= 2019) return '2015-2019';
        return '2020-2024';
    }
    for (let i = 0; i < xlsxTimeline.length; i++) {
        const src = xlsxTimeline[i];
        const frameNumber = i + 1;
        const desktopImage = `Asset-${frameNumber}-4x-100.jpg`;
        const mobileImage = `Asset-${frameNumber}-4x-100_Mobile.jpg`;
        screenData.push({
            era: guessEraFromTitle(src.Title),
            headline: src.Title || "",
            subhead: src.H1Copy || "",
            body: src.BodyCopy || "",
            subhead2: src["H2Copy-2"] || "",
            imageDesktop: desktopImage,
            imageMobile: mobileImage
        });
    }

    // MODIFIED: Manually set the era for the final frame to match the new nav link
    if (screenData[34]) {
        screenData[34].era = '2025 Onwards';
    }
  })();

  const screenContainer = document.getElementById('screen-container');
  const topNavContainer = document.getElementById('top-nav');
  const homeBtn = document.getElementById('home-btn');

  function buildScreens() {
    screenContainer.innerHTML = "";
    screenData.forEach((data, index) => {
        const screen = document.createElement('section');
        let alignmentClass = (index === 0) 
            ? 'align-left-center' 
            : (frameAlignments[index] === 'right' ? 'align-right-center' : 'align-left-center');
        
        screen.className = `screen ${alignmentClass}`;
        screen.id = `screen-${index}`;
        
        let sub2Html = (data.subhead2 || "").replace(
            /(CONTINUE\.?)\s*$/i,
            `<span class="continue-cta" role="button" tabindex="0" aria-label="Continue to next frame">$1</span>`
        );

        screen.innerHTML = `
            <div class="screen-foreground-bg"></div>
            <div class="screen-content">
              <h1 class="screen-headline">${data.headline}</h1>
              <h2 class="screen-subhead">${data.subhead || ""}</h2>
              <p class="screen-body">${data.body || ""}</p>
              ${sub2Html ? `<h2 class="screen-subhead2 fly-left">${sub2Html}</h2>` : ''}
            </div>`;

        const fg = screen.querySelector('.screen-foreground-bg');
        fg.style.setProperty('--bg-desktop', `url(images/${data.imageDesktop})`);
        fg.style.setProperty('--bg-mobile', `url(images/${data.imageMobile})`);
        screenContainer.appendChild(screen);
    });
    screens = document.querySelectorAll('.screen');
  }

  function buildTopNav() {
    // MODIFIED: Added "2025 Onwards" to the navigation data
    const topNavData = [
        { label: '1995-1999', screenIndex: 1 },
        { label: '2000-2004', screenIndex: 4 },
        { label: '2005-2009', screenIndex: 12 },
        { label: '2010-2014', screenIndex: 23 },
        { label: '2015-2019', screenIndex: 27 },
        { label: '2020-2024', screenIndex: 29 },
        { label: '2025 Onwards', screenIndex: 34 }
    ];
    topNavContainer.innerHTML = topNavData.map(d => 
        `<a href="#" data-target-index="${d.screenIndex}">${d.label}</a>`
    ).join('');
  }
  
  function createNavArrows() {
    const arrows = document.createElement('div');
    arrows.className = 'screen-arrows';
    arrows.innerHTML = `
      <button class="arrow-btn prev" aria-label="Previous screen" title="Previous"><svg viewBox="0 0 24 24" width="24" height="24"><polygon points="15,6 9,12 15,18"></polygon></svg></button>
      <button class="arrow-btn next" aria-label="Next screen" title="Next"><svg viewBox="0 0 24 24" width="24" height="24"><polygon points="9,6 15,12 9,18"></polygon></svg></button>`;
    document.body.appendChild(arrows);
  }

  function updateNavigation() {
    const topNavLinks = document.querySelectorAll('#top-nav a');
    const currentEra = screenData[currentScreenIndex]?.era;
    topNavLinks.forEach(link => link.classList.toggle('active', link.textContent === currentEra));
  }

  function goToScreen(index) {
    if (isScrolling) return;
    isScrolling = true;
    currentScreenIndex = index;
    screens.forEach((screen, i) => screen.classList.toggle("active-screen", i === currentScreenIndex));
    updateNavigation();
    setTimeout(() => { isScrolling = false; }, 4700);
  }

  function wireNavigationHandlers() {
    document.body.addEventListener('click', (e) => {
        userIntervened = true;
        if (e.target.closest('.prev')) { requestNav(currentScreenIndex - 1, -1); }
        if (e.target.closest('.next')) { requestNav(currentScreenIndex + 1, +1); }
        if (e.target.closest('.continue-cta')) { requestNav(currentScreenIndex + 1, +1); }
        if (e.target.closest('.header-logo') || e.target.closest('#home-btn')) { e.preventDefault(); requestNav(0, -1); }
        if (e.target.closest('#top-nav a')) { e.preventDefault(); requestNav(parseInt(e.target.dataset.targetIndex, 10), +1); }
    });
    window.addEventListener('wheel', e => { if (!isScrolling) { userIntervened = true; e.deltaY > 5 ? requestNav(currentScreenIndex + 1, +1) : e.deltaY < -5 && requestNav(currentScreenIndex - 1, -1); }}, { passive: true });
    window.addEventListener('keydown', e => {
        if (isScrolling) return;
        userIntervened = true;
        if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) requestNav(currentScreenIndex + 1, +1);
        if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) requestNav(currentScreenIndex - 1, -1);
    });
  }

  function ensurePlane() {
    if (!planeEl || !planeEl.isConnected) {
        planeEl = document.createElement('div');
        planeEl.className = 'plane';
        document.getElementById('plane-container').appendChild(planeEl);
    }
    return planeEl;
  }
  
  function placePlane(x, y, deg = 0) {
    ensurePlane().style.transform = `translate(${x}px, ${y}px) rotate(${deg}deg)`;
  }
  
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  
  function tween(ms, update, done) {
    const t0 = performance.now();
    const step = now => {
        const t = clamp((now - t0) / ms, 0, 1);
        update(t);
        if (t < 1) requestAnimationFrame(step);
        else done?.();
    };
    requestAnimationFrame(step);
  }

  function initTrailCanvas() {
      trailCanvas = document.getElementById('plane-trail');
      if (!trailCanvas) {
          console.error("Canvas element #plane-trail not found!");
          return;
      }
      ctx = trailCanvas.getContext('2d');
      const resizeCanvas = () => {
          trailCanvas.width = window.innerWidth;
          trailCanvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      animateFrame();
  }

  function drawTrailFromPoints(points) {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
  }

  function animateFrame() {
      requestAnimationFrame(animateFrame);
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      
      ctx.strokeStyle = SUZLON_TEAL;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([5, 15]);
      
      settledTrails.forEach(trail => {
          ctx.globalAlpha = trail.opacity;
          drawTrailFromPoints(trail.points);
      });
      
      ctx.globalAlpha = 1.0;
      drawTrailFromPoints(activeTrailPoints);
  }

  function fadeLastTrail() {
    if (settledTrails.length > 0) {
        const trailToFade = settledTrails[settledTrails.length - 1];
        if (trailToFade.isFading) return;
        trailToFade.isFading = true;

        tween(1000, t => { trailToFade.opacity = 1 - t; }, 
            () => { settledTrails = settledTrails.filter(t => t.opacity > 0); });
    }
  }

  function planeExitRight(onDone) {
      fadeLastTrail();
      activeTrailPoints = [];
      const r = ensurePlane().getBoundingClientRect();
      const startX = r.left, startY = r.top;
      const targetX = window.innerWidth + PLANE_W;
      const targetY = clamp(Math.random() * innerHeight, innerHeight * 0.15, innerHeight * 0.85);
      
      tween(1000, t => {
          const x = startX + (targetX - startX) * t;
          const y = startY + (targetY - startY) * t;
          placePlane(x, y, 0);
          activeTrailPoints.push({ x: x + PLANE_W / 2, y: y + PLANE_H / 2 });
      }, () => { lastExitY = targetY; onDone?.(); });
  }

  function getCubicBezierPoint(t, p0, p1, p2, p3) {
      const u = 1 - t, tt = t*t, uu = u*u, uuu = uu*u, ttt = tt*t;
      return {
          x: uuu*p0.x + 3*uu*t*p1.x + 3*u*tt*p2.x + ttt*p3.x,
          y: uuu*p0.y + 3*uu*t*p1.y + 3*u*tt*p2.y + ttt*p3.y
      };
  }

  function animatePlaneWithLoop(pathPoints, duration, onDone) {
      const [p0, p1, p2, p3] = pathPoints;
      activeTrailPoints = [];
      let lastPoint = p0;
      
      tween(duration, t => {
          const currentPoint = getCubicBezierPoint(t, p0, p1, p2, p3);
          const angle = Math.atan2(currentPoint.y - lastPoint.y, currentPoint.x - lastPoint.x) * (180 / Math.PI);
          placePlane(currentPoint.x, currentPoint.y, angle);
          activeTrailPoints.push({ x: currentPoint.x + PLANE_W / 2, y: currentPoint.y + PLANE_H / 2 });
          lastPoint = currentPoint;
      }, () => {
          if (activeTrailPoints.length > 1) {
              settledTrails.push({ points: activeTrailPoints, opacity: 1.0, isFading: false });
          }
          activeTrailPoints = [];
          onDone?.();
      });
  }

  function getAnimationPath(screenIndex, direction) {
      let p3; 
      if (screenIndex >= 1 && screenIndex <= 34) {
          const ctaEl = document.querySelector(`#screen-${screenIndex} .continue-cta`);
          if (ctaEl) {
              const ctaRect = ctaEl.getBoundingClientRect();
              const offsetX = 10 + Math.random() * 30;
              const offsetY = 10 + Math.random() * 30;
              p3 = {
                  x: clamp(ctaRect.right + offsetX, 8, innerWidth - PLANE_W - 8),
                  y: clamp(ctaRect.bottom + offsetY, 8, innerHeight - PLANE_H - 8)
              };
          }
      }
  
      if (!p3) {
          const rect = document.querySelector(`#screen-${screenIndex} .screen-subhead2, #screen-${screenIndex} .screen-subhead`)?.getBoundingClientRect()
              || { left: 80, bottom: 120, right: 80, top: 120 };
          
          p3 = { 
              x: clamp(rect.left, 8, innerWidth - PLANE_W - 8), 
              y: clamp(rect.bottom + 16, 8, innerHeight - PLANE_H - 8) 
          };
      }
  
      const fromRightTop = screenIndex === 0 || direction < 0 || lastExitY === null;
      const p0 = fromRightTop 
          ? { x: innerWidth + PLANE_W, y: -PLANE_H } 
          : { x: -PLANE_W, y: clamp(lastExitY, 8, innerHeight - PLANE_H - 8) };
      
      const mid = { x: innerWidth / 2, y: innerHeight / 2 };
      const radius = Math.min(innerWidth, innerHeight) * (0.8 + Math.random() * 0.5);
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = angle1 + Math.PI + (Math.random() - 0.5);
      const p1 = { x: mid.x + Math.cos(angle1) * radius, y: mid.y + Math.sin(angle1) * radius };
      const p2 = { x: mid.x + Math.cos(angle2) * radius, y: mid.y + Math.sin(angle2) * radius };
      
      return [p0, p1, p2, p3];
  }

  function requestNav(targetIndex, direction) {
      if (isScrolling) return;

      const totalScreens = screenData.length;
      targetIndex = (targetIndex + totalScreens) % totalScreens;
      if (targetIndex === currentScreenIndex && userIntervened) return;

      const afterSwitch = () => {
          const path = getAnimationPath(targetIndex, direction);
          animatePlaneWithLoop(path, 4500);
      };

      if (direction > 0) {
          planeExitRight(() => {
              goToScreen(targetIndex);
              afterSwitch();
          });
      } else {
          fadeLastTrail();
          goToScreen(targetIndex);
          afterSwitch();
      }
  }

  buildScreens();
  buildTopNav();
  createNavArrows();
  wireNavigationHandlers();
  initTrailCanvas();
  
  goToScreen(0);
  const initialPath = getAnimationPath(0, -1);
  animatePlaneWithLoop(initialPath, 4500);
});
