// Els tres textos legals: avís legal, privacitat i condicions d'ús.
//
// Van junts en un sol fitxer perquè comparteixen forma i perquè, quan
// canvia una cosa del servei, s'han de repassar tots tres alhora. El text
// diu el que l'app fa de debò —les dades que hi ha a Supabase, els
// tercers que hi intervenen i com s'esborra un compte—, no una plantilla.
import { Mono, V } from '../../lib/v3';

const ACTUALITZAT = '1 d\'agost de 2026';
const CONTACTE = 'info@infopol.app';

function Doc({ kicker, titol, children }: { kicker: string; titol: string; children: React.ReactNode }) {
  return (
    <div className="v3-page v3-anim legal-doc" style={{ maxWidth: 780, width: '100%' }}>
      <Mono size={10} color={V.terraInk} style={{ letterSpacing: 1.8 }}>{kicker}</Mono>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
        {titol}
      </h1>
      <Mono size={10} color={V.faint} style={{ display: 'block', marginTop: 8, letterSpacing: 1.2 }}>
        ACTUALITZAT EL {ACTUALITZAT.toUpperCase()}
      </Mono>
      <div style={{ marginTop: 26 }}>{children}</div>

      <style>{`
        .legal-doc h2 {
          font-size: 17px; font-weight: 800; letter-spacing: -0.5px;
          color: var(--v-ink); margin: 28px 0 10px;
        }
        .legal-doc p, .legal-doc li {
          font-size: 14.5px; line-height: 1.65; color: var(--v-ink); margin: 0 0 11px;
        }
        .legal-doc ul { margin: 0 0 14px; padding-left: 20px; }
        .legal-doc li { margin-bottom: 6px; }
        .legal-doc li::marker { color: var(--v-terra); }
        .legal-doc strong { font-weight: 700; }
        .legal-doc a { color: var(--v-terra-ink); font-weight: 600; }
        .legal-doc .destacat {
          background: var(--v-surface); border: 1px solid var(--v-hair);
          border-left: 3px solid var(--v-terra); border-radius: 14px;
          padding: 15px 17px; margin: 16px 0;
        }
        .legal-doc .destacat p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── Avís legal ─────────────────────────── */

export function AvisLegal() {
  return (
    <Doc kicker="Informació legal" titol="Avís legal">
      <h2>Qui hi ha darrere d&apos;InfoPol</h2>
      <p>
        InfoPol és un projecte personal fet per un agent de policia local de Catalunya per
        preparar oposicions i per consultar normativa durant el servei. No és un projecte
        oficial de cap administració, cos policial ni ajuntament, i no hi està vinculat.
      </p>
      <ul>
        <li><strong>Web:</strong> infopol.app</li>
        <li><strong>Contacte:</strong> <a href={`mailto:${CONTACTE}`}>{CONTACTE}</a></li>
      </ul>

      <h2>Per a què serveix i per a què no</h2>
      <div className="destacat">
        <p>
          <strong>El contingut d&apos;InfoPol és material d&apos;estudi i de consulta ràpida,
          no una font oficial.</strong> Els resums, esquemes, fitxes i tests s&apos;elaboren a
          partir de textos consolidats publicats al BOE i al DOGC, però poden contenir errors,
          simplificacions o quedar desactualitzats quan canvia una norma.
        </p>
        <p>
          Abans de qualsevol actuació professional —una denúncia, una detenció, un atestat— o
          de donar una resposta a un examen per bona, contrasta-ho sempre amb el text vigent
          publicat oficialment.
        </p>
      </div>
      <p>
        L&apos;ús que facis de la informació és responsabilitat teva. InfoPol no respon dels
        danys que se&apos;n puguin derivar.
      </p>

      <h2>Propietat del contingut</h2>
      <p>
        Els textos legals reproduïts o resumits són d&apos;accés públic i pertanyen als
        organismes que els publiquen. L&apos;elaboració pròpia —redacció dels temes, esquemes,
        preguntes de test, disseny i codi— és de l&apos;autor d&apos;InfoPol.
      </p>
      <p>
        Pots fer servir el material per estudiar i per treballar. No en facis una còpia
        massiva ni el redistribueixis com a producte propi.
      </p>

      <h2>Enllaços a altres llocs</h2>
      <p>
        Quan enllacem al BOE, al DOGC, al Servei Català de Trànsit o a qualsevol altra font,
        només responem de l&apos;enllaç, no del que hi hagi a l&apos;altra banda.
      </p>

      <h2>Disponibilitat</h2>
      <p>
        InfoPol s&apos;ofereix tal com és. Es fa el possible perquè funcioni i estigui al dia,
        però no es garanteix que estigui sempre disponible ni lliure d&apos;errors.
      </p>

      <h2>Llei aplicable</h2>
      <p>
        Aquest avís es regeix per la legislació espanyola.
      </p>
    </Doc>
  );
}

/* ────────────────────────── Privacitat ──────────────────────────── */

export function Privacitat() {
  return (
    <Doc kicker="Les teves dades" titol="Política de privacitat">
      <div className="destacat">
        <p>
          <strong>InfoPol no ven ni cedeix les teves dades a ningú, i no fa servir cookies
          de seguiment ni publicitat.</strong> Les dades que es guarden són les que fan falta
          perquè el teu progrés d&apos;estudi et segueixi entre el mòbil i l&apos;ordinador.
        </p>
      </div>

      <h2>Es pot fer servir sense compte</h2>
      <p>
        Sense iniciar sessió, tot el que fas es queda <strong>només al teu dispositiu</strong>,
        al magatzem local del navegador: el progrés dels tests, els temes llegits, les notes
        de la llibreta, els favorits, l&apos;idioma, el mode fosc i la mida del text. Res
        d&apos;això surt del teu aparell i s&apos;esborra si buides les dades del navegador.
      </p>

      <h2>Què es guarda si crees un compte</h2>
      <p>Amb compte, aquestes dades es desen al servidor perquè les puguis recuperar des de qualsevol dispositiu:</p>
      <ul>
        <li><strong>Del compte:</strong> el correu electrònic i, si el poses, el nom, el cos, el departament i l&apos;avatar.</li>
        <li><strong>De l&apos;estudi:</strong> les respostes dels tests, l&apos;experiència, el nivell, les gemmes, la ratxa, les flashcards, els reptes, els favorits i els subratllats del temari.</li>
        <li><strong>Del xat:</strong> les converses i els missatges que hi escrius, perquè les puguis recuperar.</li>
        <li><strong>Tècniques:</strong> el testimoni de notificacions si les actives, i un comptador d&apos;ús de l&apos;assistent per evitar-ne l&apos;abús.</li>
      </ul>
      <p>
        Si envies un <strong>report d&apos;una pregunta</strong> que creus errònia, s&apos;hi
        desa el que has escrit i el teu correu, per poder-te respondre.
      </p>

      <h2>Qui més hi intervé</h2>
      <p>Per fer funcionar el servei calen aquests proveïdors, i només reben el que necessiten:</p>
      <ul>
        <li><strong>Supabase</strong> — allotja la base de dades i gestiona l&apos;inici de sessió. Servidors a la Unió Europea (Irlanda).</li>
        <li><strong>GitHub Pages</strong> — serveix la web.</li>
        <li><strong>Anthropic</strong> — processa les preguntes del xat per generar la resposta.</li>
        <li><strong>Google</strong> — genera els vectors de cerca del coneixement del xat, i serveix les tipografies.</li>
        <li><strong>Resend</strong> — envia els correus (benvinguda i, si t&apos;hi subscrius, el resum de notícies).</li>
      </ul>
      <div className="destacat">
        <p>
          <strong>Sobre el xat:</strong> el que hi escrius s&apos;envia al proveïdor del model
          per poder-te contestar. No hi posis dades d&apos;una intervenció real —noms,
          matrícules, DNI, adreces ni res que identifiqui una persona. Per a això,
          l&apos;eina del diligenciador treballa al teu dispositiu.
        </p>
      </div>

      <h2>Per què i amb quina base</h2>
      <ul>
        <li><strong>Perquè el servei funcioni</strong> (execució del contracte): compte, progrés i sincronització.</li>
        <li><strong>Amb el teu consentiment:</strong> el resum de notícies per correu i les notificacions. Els pots desactivar quan vulguis.</li>
        <li><strong>Per interès legítim:</strong> evitar l&apos;abús de l&apos;assistent i corregir errors que ens reportes.</li>
      </ul>

      <h2>Quant de temps</h2>
      <p>
        Mentre tinguis el compte obert. Quan l&apos;esborres, s&apos;esborra tot el que hi va
        associat —perfil, progrés, respostes, subratllats, converses del xat i testimonis de
        notificacions— i els reports que haguessis enviat deixen de portar el teu nom i el teu
        correu.
      </p>

      <h2>Els teus drets</h2>
      <p>
        Pots accedir a les teves dades, rectificar-les, esborrar-les, oposar-te al tractament,
        limitar-lo i demanar-ne una còpia portable.
      </p>
      <ul>
        <li><strong>Esborrar el compte:</strong> ho pots fer tu mateix des de <a href="/perfil">Perfil</a>, sense demanar permís a ningú. És immediat i no es pot desfer.</li>
        <li><strong>La resta:</strong> escriu a <a href={`mailto:${CONTACTE}`}>{CONTACTE}</a>.</li>
      </ul>
      <p>
        Si creus que no s&apos;han tractat bé les teves dades, pots reclamar davant
        l&apos;Autoritat Catalana de Protecció de Dades (APDCAT) o l&apos;Agència Espanyola de
        Protecció de Dades (AEPD).
      </p>

      <h2>Seguretat</h2>
      <p>
        Tot va per connexió xifrada. A la base de dades, cada fila de dades personals està
        protegida perquè només hi arribi el seu propietari: ni un altre usuari ni algú sense
        sessió no poden llegir el teu progrés ni les teves converses.
      </p>

      <h2>Menors</h2>
      <p>
        InfoPol està pensat per a persones adultes que preparen una oposició o treballen com
        a agents. No està dirigit a menors de 14 anys.
      </p>
    </Doc>
  );
}

/* ───────────────────────── Condicions d'ús ──────────────────────── */

export function Condicions() {
  return (
    <Doc kicker="Condicions" titol="Condicions d'ús">
      <h2>Què acceptes en fer servir InfoPol</h2>
      <p>
        En crear un compte o fer servir InfoPol acceptes aquestes condicions, l&apos;
        <a href="/avis-legal">avís legal</a> i la <a href="/privacitat">política de privacitat</a>.
        Si no hi estàs d&apos;acord, no facis servir el servei.
      </p>

      <h2>El compte</h2>
      <ul>
        <li>El compte és <strong>personal</strong>: no el comparteixis ni el cedeixis.</li>
        <li>Ets responsable de la teva contrasenya i del que es faci des del teu compte.</li>
        <li>Has de donar un correu real per poder recuperar l&apos;accés.</li>
        <li>El pots esborrar quan vulguis des de <a href="/perfil">Perfil</a>.</li>
      </ul>

      <h2>Ús acceptable</h2>
      <p>No facis servir InfoPol per:</p>
      <ul>
        <li>Extreure&apos;n el contingut de manera massiva o automatitzada per republicar-lo.</li>
        <li>Intentar accedir a dades d&apos;altres usuaris o a parts no públiques del servei.</li>
        <li>Introduir dades personals de tercers al xat: noms, matrícules, DNI, adreces o qualsevol dada d&apos;una intervenció real.</li>
        <li>Sobrecarregar el servei o l&apos;assistent amb peticions automatitzades.</li>
      </ul>

      <h2>L&apos;assistent</h2>
      <p>
        L&apos;assistent genera respostes automàticament i <strong>es pot equivocar</strong>.
        Serveix per orientar-te i per trobar per on buscar, mai per decidir una actuació.
        Contrasta sempre amb el text de la norma. L&apos;ús està limitat per usuari i per dia
        perquè el servei es pugui mantenir.
      </p>

      <h2>Contingut i errors</h2>
      <p>
        El temari, els esquemes i els tests són material d&apos;estudi d&apos;elaboració
        pròpia i poden contenir errors. Si en trobes un, avisa des del mateix test o escriu a{' '}
        <a href={`mailto:${CONTACTE}`}>{CONTACTE}</a>: es corregeix i s&apos;actualitza.
      </p>

      <h2>Preu</h2>
      <p>
        Ara mateix InfoPol és gratuït i sense publicitat. Si algun dia hi ha funcions de
        pagament, s&apos;avisarà abans i el que ja tinguis no es tancarà sense preavís.
      </p>

      <h2>Canvis i final del servei</h2>
      <p>
        Aquestes condicions es poden actualitzar; la data de dalt diu quan es va fer per
        última vegada. Es pot suspendre un compte que incompleixi aquestes condicions, i es
        pot deixar d&apos;oferir el servei avisant-ho amb prou antelació perquè puguis
        endur-te les teves dades.
      </p>

      <h2>Contacte</h2>
      <p>
        Per a qualsevol cosa: <a href={`mailto:${CONTACTE}`}>{CONTACTE}</a>.
      </p>
    </Doc>
  );
}
