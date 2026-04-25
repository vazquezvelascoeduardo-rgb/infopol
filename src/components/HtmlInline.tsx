// Renderitza un document HTML d'una infografia COM A PART del DOM de
// l'app (sense iframe). Aïllament d'estils via "scoping": s'extreu el
// <style> del <head> de la fitxa, es prefixa cada selector amb la
// classe del contenidor (`.fitxa-html-scope`) i s'injecta. El cos
// (<body>) es renderitza dins d'aquest contenidor.
//
// Avantatges respecte de l'iframe:
//   - Scroll natural i sense recàlcul d'alçada.
//   - La cerca del navegador (Ctrl+F) troba el text de la infografia.
//   - El tema clar/fosc usa les mateixes variables que la resta de l'app.
//   - Els scripts inline funcionen perquè comparteixen el `document`.
import { useEffect, useRef } from 'react';

type Props = { html: string; title: string };

const SCOPE_CLASS = 'fitxa-html-scope';

// Sobreescriptura de variables CSS per al MODE CLAR. La classe
// `ipol-light` s'afegeix al contenidor quan l'app està en mode clar i
// força una paleta blanc/dorat real (no inversió de colors).
const LIGHT_THEME_CSS = `
  .${SCOPE_CLASS}.ipol-light {
    background: #ffffff !important;
    background-image: none !important;
    color: #0a1628 !important;

    /* Esquema de variables principal */
    --bg-main: #ffffff !important;
    --bg-section: #f8fafc !important;
    --text-main: #0a1628 !important;
    --text-secondary: #475569 !important;
    --border: #c8a028 !important;

    /* Variants amb prefix "accent-" */
    --accent-gold: #b8920e !important;
    --accent-blue: #1a5c96 !important;
    --alert-red: #b91c1c !important;
    --positive-green: #15803d !important;

    /* Variants amb noms curts (catàleg de trànsit) */
    --bg: #ffffff !important;
    --txt: #0a1628 !important;
    --gold: #b8920e !important;
    --blue: #1a5c96 !important;
    --blue-royal: #1a5c96 !important;
    --green: #15803d !important;
    --red: #b91c1c !important;
  }

  /* En mode clar, donar més definició a les seccions sobre fons blanc. */
  .${SCOPE_CLASS}.ipol-light .section,
  .${SCOPE_CLASS}.ipol-light .subsection,
  .${SCOPE_CLASS}.ipol-light .card,
  .${SCOPE_CLASS}.ipol-light .panel,
  .${SCOPE_CLASS}.ipol-light .box {
    border-color: #e2e8f0 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
  }
`;

// Prefixa un selector individual amb el scope. Tracta casos especials:
//   :root, html, body  →  .fitxa-html-scope
//   html.foo, body.foo →  .fitxa-html-scope.foo
//   .foo .bar          →  .fitxa-html-scope .foo .bar
function prefixSelector(selector: string, scope: string): string {
  const sel = selector.trim();
  if (!sel) return sel;

  const scopeSel = `.${scope}`;

  // :root, html, body → escope arrel
  if (sel === ':root' || sel === 'html' || sel === 'body') return scopeSel;

  // html.x, html#x, html[...] → .scope.x / .scope#x / etc.
  if (/^html[.#\[]/.test(sel)) return scopeSel + sel.slice(4);
  if (/^body[.#\[]/.test(sel)) return scopeSel + sel.slice(4);

  // html > x, body > x, body x ...
  if (/^(?:html|body)\s|^(?:html|body)[>~+]/.test(sel)) {
    return scopeSel + sel.replace(/^(?:html|body)/, '');
  }

  return `${scopeSel} ${sel}`;
}

// Recorre les regles CSS i prefixa les selector-rules. Les @media
// es processen recursivament. @keyframes i @font-face queden globals
// (els noms són globals per definició).
function scopeRule(rule: CSSRule, scope: string): string {
  // CSSStyleRule
  if (rule.constructor.name === 'CSSStyleRule' || (typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule)) {
    const styleRule = rule as CSSStyleRule;
    const selectors = styleRule.selectorText
      .split(',')
      .map((s) => prefixSelector(s, scope))
      .join(', ');
    return `${selectors} { ${styleRule.style.cssText} }`;
  }

  // CSSMediaRule
  if (rule.constructor.name === 'CSSMediaRule' || (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule)) {
    const mediaRule = rule as CSSMediaRule;
    const inner = Array.from(mediaRule.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
    return `@media ${mediaRule.conditionText} { ${inner} }`;
  }

  // CSSSupportsRule
  if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule) {
    const supRule = rule as CSSSupportsRule;
    const inner = Array.from(supRule.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
    return `@supports ${supRule.conditionText} { ${inner} }`;
  }

  // @keyframes, @font-face, @import, etc. — globals, deixar tal qual.
  return rule.cssText;
}

// Aïlla un CSS aplicant un prefix a tots els selectors. Fa servir el
// CSSOM del navegador (afegint i eliminant immediatament un <style>
// amb media="not all" perquè no apliqui mai els estils crus).
function scopeCSS(cssText: string, scope: string): string {
  if (!cssText.trim()) return '';
  if (typeof document === 'undefined') return cssText;

  const styleEl = document.createElement('style');
  styleEl.media = 'not all';
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
  try {
    const sheet = styleEl.sheet as CSSStyleSheet | null;
    if (!sheet) return cssText;
    return Array.from(sheet.cssRules)
      .map((r) => scopeRule(r, scope))
      .join('\n');
  } catch {
    // Davant qualsevol error de parse, tornem el CSS sense scope —
    // millor mostrar la fitxa una mica sortida que no res.
    return cssText;
  } finally {
    styleEl.remove();
  }
}

// Embolcalla un script en una IIFE amb try/catch per dos motius:
//   1) Aïllament: variables top-level (let/const) no contaminen
//      l'scope global ni provoquen errors de redeclaració quan es
//      torna a una fitxa ja visitada.
//   2) Tolerància a errors: si el script peta, no trenca la app.
// Com que les funcions declarades dins de la IIFE serien LOCALS i els
// handlers inline (`onclick="toggle(this)"`) busquen funcions a window,
// detectem totes les declaracions `function NAME(...)` i les exposem
// explícitament com a `window.NAME`.
function wrapScript(source: string): string {
  const fnNames = new Set<string>();
  for (const m of source.matchAll(/^\s*function\s+([a-zA-Z_$][\w$]*)\s*\(/gm)) {
    fnNames.add(m[1]);
  }
  const exposes = [...fnNames]
    .map((n) => `try { window[${JSON.stringify(n)}] = ${n}; } catch (_e) {}`)
    .join('\n');
  return `;(function(){\ntry {\n${source}\n${exposes}\n} catch (e) { console.error('[infopol/fitxa] script error:', e); }\n})();`;
}

// Reactiva els <script> que el navegador NO executa quan s'inserten
// via innerHTML. Crea un nou <script> amb el mateix contingut/src
// (després d'embolcallar-lo) i el substitueix.
function executeScripts(container: HTMLElement) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    for (const attr of Array.from(oldScript.attributes)) {
      // Si és un script extern (src), no podem embolcallar-lo:
      // el copiem tal qual.
      if (attr.name === 'src') {
        newScript.setAttribute(attr.name, attr.value);
      } else if (attr.name !== 'type') {
        newScript.setAttribute(attr.name, attr.value);
      }
    }
    const src = oldScript.textContent || '';
    newScript.textContent = src.trim() ? wrapScript(src) : '';
    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });
}

export default function HtmlInline({ html }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) Parseja el document.
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 2) Extreu i aïlla els <style> del <head>.
    const styleEls = Array.from(doc.head.querySelectorAll('style'));
    const cssRaw = styleEls.map((s) => s.textContent || '').join('\n');
    const cssScoped = scopeCSS(cssRaw, SCOPE_CLASS);

    // 3) Munta el contenidor: classe d'scope + estils + cos.
    container.className = SCOPE_CLASS;
    container.innerHTML = '';

    if (cssScoped.trim()) {
      const styleNode = document.createElement('style');
      styleNode.setAttribute('data-fitxa-style', '');
      styleNode.textContent = cssScoped + '\n' + LIGHT_THEME_CSS;
      container.appendChild(styleNode);
    } else {
      // Fitxa sense estils propis: només el bloc de tema clar.
      const styleNode = document.createElement('style');
      styleNode.textContent = LIGHT_THEME_CSS;
      container.appendChild(styleNode);
    }

    // 4) Insereix el cos i reactiva els scripts.
    const bodyHtml = doc.body ? doc.body.innerHTML : '';
    const bodyHost = document.createElement('div');
    bodyHost.setAttribute('data-fitxa-body', '');
    bodyHost.innerHTML = bodyHtml;
    container.appendChild(bodyHost);
    executeScripts(bodyHost);

    // 5) Sincronitza el tema (clar/fosc) amb la classe `dark` del <html>.
    function applyTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      container!.classList.toggle('ipol-light', !isDark);
    }
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      themeObserver.disconnect();
      // Buidem el contenidor en desmuntar perquè els <style> i scripts
      // d'aquesta fitxa no segueixin actius en navegar a una altra.
      if (container) container.innerHTML = '';
    };
  }, [html]);

  return <div ref={containerRef} />;
}
