const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let publicDir = __dirname;
if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
  publicDir = path.join(__dirname, 'public');
}

app.use(express.static(publicDir));

// ── Browser detection ──
function needsSafari(ua) {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return false;
  if (/CriOS/i.test(ua)) return true;
  if (/EdgiOS/i.test(ua)) return true;
  if (/FxiOS/i.test(ua)) return true;
  if (/OPiOS/i.test(ua)) return true;
  if (/Chrome\//i.test(ua) && !/Safari/i.test(ua)) return true;
  if (/Edg\//i.test(ua)) return true;
  return false;
}

// ── Safari redirect page ──
function safariPage(returnUrl) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>ViaSegura — Abre en Safari</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#0f1114;color:#F2F2F2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px}.stripe{width:100%;height:8px;background:repeating-linear-gradient(-45deg,#FFD600,#FFD600 12px,#111 12px,#111 24px);position:fixed;top:0;left:0}.icon{font-size:64px;margin-bottom:24px}h1{font-size:28px;font-weight:800;margin-bottom:12px;background:linear-gradient(135deg,#FF6B00,#FFD600);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{font-size:16px;line-height:1.7;color:#8A919A;max-width:400px;margin-bottom:20px}.url-box{background:#1c2127;border:2px solid #FFD600;border-radius:12px;padding:16px 24px;font-size:18px;font-weight:700;color:#FFD600;letter-spacing:1px;margin-bottom:16px}.copy-btn{background:linear-gradient(135deg,#FF6B00,#FFD600);color:#0f1114;border:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;margin-bottom:12px}.copy-btn:active{transform:scale(0.95)}.copied{color:#4ADE80;font-size:14px;display:none}.back{color:#FF6B00;text-decoration:none;font-size:14px;font-weight:600;margin-top:24px;display:inline-block}.steps{font-size:13px;color:#8A919A;line-height:1.8;margin-top:20px}.steps strong{color:#F2F2F2}</style>
</head><body>
<div class="stripe"></div>
<div class="icon">🚧</div>
<h1>Abre en Safari</h1>
<p>El asistente de voz ViaSegura funciona mejor en Safari. Copia el enlace y ábrelo en Safari.</p>
<p style="font-size:14px;">The ViaSegura voice assistant works best in Safari. Copy the link and open it in Safari.</p>
<div class="url-box">viasegura.zone${returnUrl}</div>
<button class="copy-btn" onclick="copyURL()">Copiar Enlace / Copy Link</button>
<div class="copied" id="copiedMsg">✓ Copiado / Copied!</div>
<div class="steps"><strong>1.</strong> Copia el enlace<br><strong>2.</strong> Abre Safari<br><strong>3.</strong> Pega el enlace<br><strong>4.</strong> ¡Listo!</div>
<a href="/" class="back">← Volver / Back</a>
<script>function copyURL(){navigator.clipboard.writeText('https://viasegura.zone${returnUrl}').then(function(){document.getElementById('copiedMsg').style.display='block';setTimeout(function(){document.getElementById('copiedMsg').style.display='none'},3000);});}</script>
</body></html>`;
}

// ── Module data ──
const MODULES = {
  1: {
    icon: '🏗️',
    es: { title: 'Fundamentos', subtitle: 'Sobre la Autora · Introducción · Objetivo del Manual · ¿Qué es una Obra Vial? · ¿Qué es un Abanderado? · Rol Nivel 1 · Funciones y Responsabilidades · Diferencia Nivel 1 vs Nivel 2 · Dónde Trabajan', intro: 'Bienvenidos al frente de la Seguridad Vial. En cada obra de construcción, mantenimiento o reparación vial, hay una figura clave que protege vidas, orienta el tránsito y mantiene el orden en medio del caos del asfalto: el Abanderado. Los abanderados juegan un papel vital en la industria de la construcción de carreteras — éste manual ha sido creado como herramienta fundamental para preparar y guiar a quienes asumen esta responsabilidad con orgullo y compromiso.', intro2: 'Ser abanderado no es simplemente sostener una paleta o una bandera; es asumir el rol de guardián del paso seguro, de defensor entre el conductor distraído y el trabajador enfocado. Es estar alerta, visible y capacitado para actuar con precisión, incluso en condiciones extremas. Tu preparación comienza hoy. Tu compromiso puede salvar vidas. ¡Bienvenido al Equipo!' },
    en: { title: 'Foundations', subtitle: 'About the Author · Introduction · Manual Objective · What is a Roadway Project? · What is a Flagger? · Level 1 Role · Functions & Responsibilities · Level 1 vs Level 2 · Where Flaggers Work', intro: 'Welcome to the front line of Roadway Safety. In every construction, maintenance, or repair project, there is a key figure who protects lives, directs traffic, and maintains order amid the chaos of asphalt: the Flagger. Flaggers play a vital role in the highway construction industry — this manual was created as a fundamental tool to prepare and guide those who take on this responsibility with pride and commitment.', intro2: 'Being a flagger is not simply holding a paddle or a flag; it is assuming the role of guardian of safe passage, defender between the distracted driver and the focused worker. It is being alert, visible, and trained to act with precision, even in extreme conditions. Your training starts today. Your commitment can save lives. Welcome to the Team!' }
  },
  2: {
    icon: '👷',
    es: { title: 'Estándares Profesionales', subtitle: 'Requisitos · Deberes · Relaciones Públicas · Conducta y Ética Profesional', intro: 'Debido a que los abanderados son responsables de la seguridad pública y hacen el mayor número de contactos con el público de todos los trabajadores de carreteras, deben estar capacitados en prácticas seguras de control de tráfico y técnicas de contacto con el público. Los abanderados deben demostrar habilidades de comunicación efectiva, atención constante, resistencia física y mental, y conocimiento de normas y regulaciones.', intro2: 'Las tareas de un abanderado van más allá de simplemente sostener una paleta. Requieren profesionalismo, ética, respeto por el público y un compromiso inquebrantable con la seguridad de todos en la zona de trabajo.' },
    en: { title: 'Professional Standards', subtitle: 'Requirements · Duties · Public Relations · Professional Conduct & Ethics', intro: 'Because flaggers are responsible for public safety and make the most public contacts of all highway workers, they must be trained in safe traffic control practices and public contact techniques. Flaggers must demonstrate effective communication skills, constant attention, physical and mental endurance, and knowledge of rules and regulations.', intro2: 'A flagger\'s tasks go far beyond simply holding a paddle. They require professionalism, ethics, respect for the public, and an unwavering commitment to the safety of everyone in the work zone.' }
  },
  3: {
    icon: '📋',
    es: { title: 'Regulaciones y Equipo', subtitle: 'PR OSHA · MUTCD · Sanciones · Vestimenta · Comunicación · Herramientas', intro: 'Las regulaciones de seguridad en Puerto Rico están bajo la supervisión de PR OSHA, que establece normas para proteger a los trabajadores en zonas de construcción. La Ley de Seguridad y Salud en el Trabajo (Ley Núm. 16 de 1975) garantiza un ambiente de trabajo seguro. Las normas del MUTCD establecen los estándares nacionales para dispositivos de control de tráfico.', intro2: 'Este módulo cubre todo el equipo obligatorio: chalecos reflectantes clase 2 o 3, cascos, botas de seguridad, guantes, protección auditiva y visual, y las herramientas básicas que todo abanderado debe dominar para el control seguro del tránsito.' },
    en: { title: 'Regulations & Equipment', subtitle: 'PR OSHA · MUTCD · Sanctions · PPE · Communication · Tools', intro: 'Safety regulations in Puerto Rico are supervised by PR OSHA, which establishes standards to protect workers in construction zones. The Occupational Safety and Health Act (Law No. 16 of 1975) guarantees a safe work environment. MUTCD standards establish national requirements for traffic control devices.', intro2: 'This module covers all mandatory equipment: Class 2 or 3 reflective vests, hard hats, safety boots, gloves, hearing and eye protection, and the basic tools every flagger must master for safe traffic control.' }
  },
  4: {
    icon: '🚦',
    es: { title: 'Señalización y Control de Tránsito', subtitle: 'Paletas PARE/DESPACIO · Banderas · Dispositivos · Canalización · Procedimientos', intro: 'Los abanderados deberán usar una paleta PARE/DESPACIO, una bandera, o un Dispositivo Automático de Asistencia al Abanderado (AFAD) para controlar a los usuarios de la carretera que se acerquen a una zona TTC. Hay tres funciones básicas: detener el tránsito, dejar pasar el tránsito detenido, y reducir la velocidad del tránsito.', intro2: 'Este es el módulo más técnico del manual. Cubre la forma correcta de señalizar con paletas y banderas según el MUTCD, los criterios de uso, los dispositivos de señalización y canalización, y los procedimientos paso a paso para el control seguro del tráfico en zonas de construcción.' },
    en: { title: 'Signaling & Traffic Control', subtitle: 'STOP/SLOW Paddles · Flags · Devices · Channelization · Procedures', intro: 'Flaggers shall use a STOP/SLOW paddle, a flag, or an Automated Flagger Assistance Device (AFAD) to control road users approaching a TTC zone. There are three basic functions: stopping traffic, letting stopped traffic proceed, and slowing traffic.', intro2: 'This is the most technical module in the manual. It covers the correct way to signal with paddles and flags per the MUTCD, usage criteria, signaling and channelization devices, and step-by-step procedures for safe traffic control in construction zones.' }
  },
  5: {
    icon: '🔶',
    es: { title: 'Zona de Trabajo', subtitle: 'Componentes TTC · Posicionamiento Seguro · Importancia de la Seguridad', intro: 'La zona TTC (Temporary Traffic Control) es un área donde las condiciones para los usuarios de la vía se modifican debido a trabajos, incidentes o eventos especiales. Incluye el área de advertencia anticipada, el área de transición, el área de actividad y el área de terminación. Cada componente tiene un propósito crítico para la seguridad.', intro2: 'El posicionamiento del abanderado es literalmente una cuestión de vida o muerte. Este módulo enseña exactamente dónde pararse, cómo mantener distancia segura de los vehículos, y por qué cada metro importa cuando estás entre el tráfico y los trabajadores.' },
    en: { title: 'Work Zone Components', subtitle: 'TTC Components · Safe Positioning · Importance of Safety', intro: 'The TTC (Temporary Traffic Control) zone is an area where conditions for road users are modified due to work, incidents, or special events. It includes the advance warning area, transition area, activity area, and termination area. Each component has a critical safety purpose.', intro2: 'Flagger positioning is literally a matter of life or death. This module teaches exactly where to stand, how to maintain safe distance from vehicles, and why every meter matters when you\'re between traffic and workers.' }
  },
  6: {
    icon: '🚨',
    es: { title: 'Protocolos de Emergencia', subtitle: 'Emergencias · Climas Extremos · Policía · Protocolos Básicos', intro: 'Ante una emergencia, el abanderado debe mantener la calma y evaluar la situación, alertar a los trabajadores cercanos, contactar servicios de emergencia al 9-1-1, y proteger el área redirigiendo el tráfico si es seguro hacerlo. La información precisa salva vidas: ubicación exacta, tipo de emergencia, número de personas involucradas.', intro2: 'Este módulo también cubre los protocolos para climas extremos — calor intenso, lluvias, tormentas eléctricas, niebla — y cómo interactuar profesionalmente con la policía cuando llegan a la zona de trabajo. Cada protocolo fue diseñado para que el abanderado sepa exactamente qué hacer.' },
    en: { title: 'Emergency Protocols', subtitle: 'Emergencies · Extreme Weather · Police · Basic Protocols', intro: 'In an emergency, the flagger must stay calm and assess the situation, alert nearby workers, contact emergency services at 9-1-1, and protect the area by redirecting traffic if safe to do so. Accurate information saves lives: exact location, type of emergency, number of people involved.', intro2: 'This module also covers extreme weather protocols — intense heat, rain, thunderstorms, fog — and how to interact professionally with police when they arrive at the work zone. Each protocol is designed so the flagger knows exactly what to do.' }
  },
  7: {
    icon: '⚠️',
    es: { title: 'Guía Práctica', subtitle: 'Acciones No Autorizadas · Coordinación Inicial · Consejos Prácticos', intro: 'Es igualmente importante saber lo que NO puedes hacer como Abanderado Nivel 1. No puedes supervisar a otros abanderados, modificar señalización, tomar decisiones sobre flujo vehicular complejo, intervenir en emergencias médicas, dar instrucciones a maquinaria pesada, ni operar bajo condiciones extremas sin autorización.', intro2: 'La coordinación inicial antes del comienzo del trabajo y los consejos prácticos del día a día son lo que separa a un abanderado competente de uno excepcional. Este módulo te da las herramientas para ser el mejor en tu puesto desde el primer día.' },
    en: { title: 'Practical Guidance', subtitle: 'Unauthorized Actions · Initial Coordination · Practical Tips', intro: 'It is equally important to know what you CANNOT do as a Level 1 Flagger. You cannot supervise other flaggers, modify signage, make complex traffic flow decisions, intervene in medical emergencies, give instructions to heavy machinery, or operate under extreme conditions without authorization.', intro2: 'Initial coordination before work begins and practical day-to-day tips are what separates a competent flagger from an exceptional one. This module gives you the tools to be the best at your post from day one.' }
  },
  8: {
    icon: '🎓',
    es: { title: 'Certificación y Futuro', subtitle: 'Capacitación · Certificación · Desafíos · Recompensas · El Futuro · Conclusión', intro: 'La capacitación es crucial para los abanderados y en muchos lugares es obligatoria. Las certificaciones clave incluyen OSHA 30 horas, cursos de control de tráfico con examen de certificación (vigencia 2 años), y entrenamiento opcional en primeros auxilios para Nivel 2.', intro2: 'Los abanderados enfrentan desafíos — clima extremo, riesgo de accidentes, vigilancia constante. Pero las recompensas son significativas: contribuir directamente a la seguridad del público, oportunidades de avance en la industria, y la satisfacción de saber que tu trabajo salva vidas cada día.' },
    en: { title: 'Certification & Future', subtitle: 'Training · Certification · Challenges · Rewards · The Future · Conclusion', intro: 'Training is crucial for flaggers and in many places it is mandatory. Key certifications include OSHA 30-hour, traffic control courses with certification exam (valid 2 years), and optional first aid training for Level 2.', intro2: 'Flaggers face challenges — extreme weather, accident risk, constant vigilance. But the rewards are significant: directly contributing to public safety, advancement opportunities in the industry, and the satisfaction of knowing your work saves lives every day.' }
  }
};

// ── Module preview page ──
function modulePage(num, ua) {
  const mod = MODULES[num];
  if (!mod) return null;

  const showWidget = !needsSafari(ua);

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>ViaSegura — Módulo ${num}: ${mod.es.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--deep:#0f1114;--surface:#161a1f;--card:#1c2127;--orange:#FF6B00;--yellow:#FFD600;--white:#F2F2F2;--muted:#8A919A;--gradient:linear-gradient(135deg,#FF6B00,#FFD600);--radius:16px}
body{font-family:'Inter',sans-serif;background:var(--deep);color:var(--white);min-height:100vh;overflow-x:hidden}
.stripe{width:100%;height:8px;background:repeating-linear-gradient(-45deg,var(--yellow),var(--yellow) 12px,#111 12px,#111 24px);position:fixed;top:0;left:0;z-index:200}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,107,0,.06) 0%,transparent 60%);pointer-events:none;z-index:0}
.lang-toggle{position:fixed;top:20px;right:20px;z-index:150;display:flex;background:var(--surface);border:1px solid rgba(255,107,0,.15);border-radius:50px;overflow:hidden}
.lang-btn{padding:8px 16px;font-size:12px;font-weight:600;border:none;background:transparent;color:var(--muted);cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
.lang-btn.active{background:var(--gradient);color:var(--deep)}
.lang-es{display:inline}.lang-en{display:none}body.en .lang-es{display:none}body.en .lang-en{display:inline}
.page{position:relative;z-index:1;max-width:700px;margin:0 auto;padding:80px 24px 120px}
.back{display:inline-flex;align-items:center;gap:6px;color:var(--orange);text-decoration:none;font-size:13px;font-weight:600;margin-bottom:32px;transition:transform .2s}
.back:hover{transform:translateX(-4px)}
.mod-label{font-size:12px;font-weight:700;letter-spacing:3px;color:var(--orange);text-transform:uppercase;margin-bottom:8px}
.mod-icon{font-size:48px;margin-bottom:16px}
.mod-title{font-size:clamp(24px,5vw,36px);font-weight:800;line-height:1.15;margin-bottom:8px}
.mod-title .accent{background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.mod-subtitle{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.6}
.divider{width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--orange),transparent);margin:0 0 32px;border:none}
.intro-text{font-size:15px;line-height:1.85;color:#c8c8d0;font-weight:300;margin-bottom:20px}
.preview-label{display:inline-block;padding:4px 12px;border-radius:50px;background:rgba(255,107,0,.08);border:1px solid rgba(255,107,0,.12);font-size:10px;font-weight:700;color:var(--orange);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px}
.cta-box{background:var(--card);border:1px solid rgba(255,107,0,.1);border-radius:var(--radius);padding:32px 28px;text-align:center;margin-top:40px}
.cta-box h3{font-size:18px;font-weight:800;margin-bottom:8px}
.cta-box p{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:20px}
.cta-btn{display:inline-block;padding:14px 36px;border-radius:50px;background:var(--gradient);color:var(--deep);font-size:15px;font-weight:800;text-decoration:none;font-family:'Inter',sans-serif;transition:all .3s;box-shadow:0 4px 20px rgba(255,107,0,.3)}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,107,0,.4)}
.cta-btn:active{transform:scale(.97)}
.nav-modules{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:32px}
.nav-pill{padding:8px 16px;border-radius:50px;background:var(--surface);border:1px solid rgba(255,107,0,.06);color:var(--muted);text-decoration:none;font-size:12px;font-weight:600;transition:all .2s}
.nav-pill:hover,.nav-pill.active{border-color:var(--orange);color:var(--orange);background:rgba(255,107,0,.06)}
${showWidget ? 'elevenlabs-convai{position:fixed!important;bottom:24px!important;right:24px!important;z-index:999!important}' : ''}
@media(max-width:600px){.page{padding:60px 20px 100px}.mod-icon{font-size:40px}.cta-box{padding:24px 20px}.lang-btn{padding:6px 12px;font-size:11px}}
</style></head>
<body>
<div class="stripe"></div>
<div class="lang-toggle">
  <button class="lang-btn active" id="btnES" onclick="setLang('es')">Español</button>
  <button class="lang-btn" id="btnEN" onclick="setLang('en')">English</button>
</div>
<div class="page">
  <a href="/" class="back">← <span class="lang-es">Todos los Módulos</span><span class="lang-en">All Modules</span></a>
  <div class="mod-label">MÓDULO ${num}</div>
  <div class="mod-icon">${mod.icon}</div>
  <h1 class="mod-title">
    <span class="lang-es"><span class="accent">${mod.es.title}</span></span>
    <span class="lang-en"><span class="accent">${mod.en.title}</span></span>
  </h1>
  <div class="mod-subtitle">
    <span class="lang-es">${mod.es.subtitle}</span>
    <span class="lang-en">${mod.en.subtitle}</span>
  </div>
  <hr class="divider">
  <div class="preview-label">
    <span class="lang-es">Vista Previa del Módulo</span>
    <span class="lang-en">Module Preview</span>
  </div>
  <p class="intro-text">
    <span class="lang-es">${mod.es.intro}</span>
    <span class="lang-en">${mod.en.intro}</span>
  </p>
  <p class="intro-text">
    <span class="lang-es">${mod.es.intro2}</span>
    <span class="lang-en">${mod.en.intro2}</span>
  </p>

  <div class="cta-box">
    <h3>
      <span class="lang-es">¿Quieres el módulo completo?</span>
      <span class="lang-en">Want the full module?</span>
    </h3>
    <p>
      <span class="lang-es">El Manual para Abanderados Vial de Puerto Rico Nivel 1 incluye los 8 módulos completos con diagramas, checklists, procedimientos paso a paso, y acceso a Leo — tu experto de seguridad vial con IA.</span>
      <span class="lang-en">The Puerto Rico Level 1 Road Flagger Manual includes all 8 complete modules with diagrams, checklists, step-by-step procedures, and access to Leo — your AI-powered safety expert.</span>
    </p>
    <a href="/tour" class="cta-btn">
      <span class="lang-es">🎙️ Habla con Leo</span>
      <span class="lang-en">🎙️ Talk to Leo</span>
    </a>
  </div>

  <div class="nav-modules">
    ${[1,2,3,4,5,6,7,8].map(n => `<a href="/modulo/${n}" class="nav-pill${n === num ? ' active' : ''}">${n}</a>`).join('')}
  </div>
</div>
${showWidget ? '<elevenlabs-convai agent-id="agent_9101kjkezryne7prd85mt7g3mdah"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>' : ''}
<script>function setLang(lang){if(lang==='en'){document.body.classList.add('en');document.getElementById('btnEN').classList.add('active');document.getElementById('btnES').classList.remove('active');}else{document.body.classList.remove('en');document.getElementById('btnES').classList.add('active');document.getElementById('btnEN').classList.remove('active');}}</script>
</body></html>`;
}

// ── Routes ──

// Module pages
app.get('/modulo/:id', (req, res) => {
  const num = parseInt(req.params.id);
  if (num < 1 || num > 8) return res.redirect('/');
  const ua = req.headers['user-agent'] || '';
  const html = modulePage(num, ua);
  res.send(html);
});

// Tour page (Leo widget)
app.get('/tour', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  if (needsSafari(ua)) return res.send(safariPage('/tour'));

  res.send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>ViaSegura — Habla con Leo</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#0f1114;color:#F2F2F2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px}.stripe{width:100%;height:8px;background:repeating-linear-gradient(-45deg,#FFD600,#FFD600 12px,#111 12px,#111 24px);position:fixed;top:0;left:0;z-index:200}h1{font-size:28px;font-weight:800;margin-bottom:8px;background:linear-gradient(135deg,#FF6B00,#FFD600);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.sub{font-size:14px;color:#8A919A;margin-bottom:24px;line-height:1.6;max-width:400px}.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:50px;background:rgba(255,107,0,.08);border:1px solid rgba(255,107,0,.15);font-size:12px;font-weight:600;color:#FF6B00;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px}.badge::before{content:'';width:8px;height:8px;border-radius:50%;background:#4ADE80;box-shadow:0 0 8px #4ADE80;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.back{color:#FF6B00;text-decoration:none;font-size:14px;font-weight:600;margin-top:24px;display:inline-block}elevenlabs-convai{position:fixed!important;bottom:24px!important;right:24px!important;z-index:999!important}</style>
</head><body>
<div class="stripe"></div>
<div class="badge">Agente de Voz — Activo</div>
<h1>ViaSegura</h1>
<p class="sub">Toca el botón de voz abajo para hablar con Leo — tu experto en el Manual de Abanderados Vial de Puerto Rico.<br><br>Tap the voice button below to talk to Leo — your expert on the Puerto Rico Road Flagger Manual.</p>
<a href="/" class="back">← Volver al Inicio / Back to Home</a>
<elevenlabs-convai agent-id="agent_9101kjkezryne7prd85mt7g3mdah"></elevenlabs-convai>
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
</body></html>`);
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log('ViaSegura running on port ' + PORT);
});