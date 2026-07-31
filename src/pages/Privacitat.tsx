// Política de privacitat — explicació de què es desa i per què.
import { useT } from '../lib/i18n';
import { A } from '../lib/design';

export default function Privacitat() {
  const { t, locale } = useT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 style={{ fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,34px)', letterSpacing: -1, color: A.ink, margin: 0 }}>{t('privacy.title')}</h1>
        <p style={{ marginTop: 6, fontFamily: A.mono, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: A.inkMuted }}>
          {t('privacy.updated')}: 27/07/2026
        </p>
      </header>

      <Section title={t('privacy.s1.title')}>
        <p>{t('privacy.s1.p1')}</p>
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
          {t('privacy.s1.highlight')}
        </p>
      </Section>

      <Section title={t('privacy.s2.title')}>
        <p>{t('privacy.s2.intro')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>infopol-theme:</strong> {t('privacy.s2.theme')}</li>
          <li><strong>infopol-locale:</strong> {t('privacy.s2.locale')}</li>
          <li><strong>infopol-rgpd:</strong> {t('privacy.s2.rgpd')}</li>
          <li><strong>{t('privacy.s2.swTitle')}:</strong> {t('privacy.s2.sw')}</li>
        </ul>
        <p className="mt-2">{t('privacy.s2.howClear')}</p>
      </Section>

      <Section title={t('privacy.s3.title')}>
        <p>{t('privacy.s3.p1')}</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>{t('privacy.s3.fonts')}</li>
          <li>{t('privacy.s3.maps')}</li>
          <li>{t('privacy.s3.aiac')}</li>
          <li>{t('privacy.s3.farmacia')}</li>
        </ul>
        <p className="mt-2">{t('privacy.s3.note')}</p>
      </Section>

      <Section title={t('privacy.s4.title')}>
        <p>{t('privacy.s4.p1')}</p>
      </Section>

      {/* Assistent amb IA (InfoPol Chat) — tractament específic. */}
      <Section title={locale === 'ca' ? "Assistent amb IA (InfoPol Chat)" : 'Asistente con IA (InfoPol Chat)'}>
        {locale === 'ca' ? (
          <>
            <p>
              L&apos;assistent és una funció opcional i només disponible amb sessió iniciada. Quan hi
              escrius, el text de la conversa i els fitxers que hi adjuntis (fotos o PDF) s&apos;envien
              al proveïdor del model d&apos;intel·ligència artificial perquè elabori la resposta.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Els adjunts no es desen.</strong> Les fotos i documents viatgen amb la
                consulta, s&apos;utilitzen per generar la resposta i es descarten. No es guarden als
                nostres servidors ni s&apos;associen al teu compte.
              </li>
              <li>
                <strong>Les converses no es desen al servidor.</strong> L&apos;historial viu al teu
                navegador o dispositiu durant la sessió.
              </li>
              <li>
                <strong>Proveïdors:</strong> fem servir <strong>Anthropic</strong> (generació de
                respostes) i <strong>Google</strong> (cerca semàntica al nostre corpus normatiu), que
                actuen com a encarregats del tractament. El processament pot fer-se fora de l&apos;Espai
                Econòmic Europeu, amb les garanties previstes al RGPD.
              </li>
              <li>
                <strong>Ús:</strong> desem un comptador diari de consultes per usuari per aplicar els
                límits del servei. No desem el contingut de les consultes.
              </li>
            </ul>
            <p className="font-semibold" style={{ color: A.terraInk }}>
              Important: no adjuntis ni escriguis dades personals que no siguin imprescindibles
              (DNI, matrícules, imatges de persones o documents identificatius). Ets responsable de
              la informació que hi introdueixes i del deure de secret professional que t&apos;afecti.
            </p>
            <p>
              Les respostes de l&apos;assistent són orientatives, poden contenir errors i no
              constitueixen assessorament jurídic. Verifica-ho sempre amb la norma vigent abans de
              tramitar o signar res.
            </p>
          </>
        ) : (
          <>
            <p>
              El asistente es una función opcional y solo está disponible con sesión iniciada. Cuando
              escribes en él, el texto de la conversación y los archivos que adjuntes (fotos o PDF) se
              envían al proveedor del modelo de inteligencia artificial para elaborar la respuesta.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Los adjuntos no se guardan.</strong> Las fotos y documentos viajan con la
                consulta, se usan para generar la respuesta y se descartan. No se almacenan en
                nuestros servidores ni se asocian a tu cuenta.
              </li>
              <li>
                <strong>Las conversaciones no se guardan en el servidor.</strong> El historial vive en
                tu navegador o dispositivo durante la sesión.
              </li>
              <li>
                <strong>Proveedores:</strong> usamos <strong>Anthropic</strong> (generación de
                respuestas) y <strong>Google</strong> (búsqueda semántica en nuestro corpus
                normativo), que actúan como encargados del tratamiento. El procesamiento puede
                realizarse fuera del Espacio Económico Europeo, con las garantías previstas en el
                RGPD.
              </li>
              <li>
                <strong>Uso:</strong> guardamos un contador diario de consultas por usuario para
                aplicar los límites del servicio. No guardamos el contenido de las consultas.
              </li>
            </ul>
            <p className="font-semibold" style={{ color: A.terraInk }}>
              Importante: no adjuntes ni escribas datos personales que no sean imprescindibles (DNI,
              matrículas, imágenes de personas o documentos identificativos). Eres responsable de la
              información que introduces y del deber de secreto profesional que te afecte.
            </p>
            <p>
              Las respuestas del asistente son orientativas, pueden contener errores y no constituyen
              asesoramiento jurídico. Verifícalo siempre con la norma vigente antes de tramitar o
              firmar nada.
            </p>
          </>
        )}
      </Section>

      <Section title={t('privacy.s5.title')}>
        <p>{t('privacy.s5.p1')}</p>
        <p>{t('privacy.s5.contact')}: info@infopol.app</p>
      </Section>

      <p className="mt-8 text-xs text-text-3">
        {locale === 'ca'
          ? 'Aquesta política pot modificar-se. La versió vigent és la publicada en aquesta pàgina.'
          : 'Esta política puede modificarse. La versión vigente es la publicada en esta página.'}
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 style={{ fontFamily: A.display, fontWeight: 700, fontSize: 18, letterSpacing: -0.4, color: A.terraInk, marginBottom: 8 }}>{title}</h2>
      <div className="space-y-2 leading-relaxed" style={{ fontSize: 15, color: A.inkSoft }}>
        {children}
      </div>
    </section>
  );
}
