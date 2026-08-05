// Gestió de 2FA (TOTP) des del perfil.
//
// Flux:
// 1) Llistar factors actius via supabase.auth.mfa.listFactors()
// 2) Si no n'hi ha → botó "Activar 2FA":
//    - enroll({ factorType: 'totp' }) → retorna QR + secret
//    - usuari escaneja amb Google Authenticator/Authy
//    - usuari introdueix primer codi de 6 dígits
//    - challenge() + verify() → activat
// 3) Si n'hi ha → estat + botó "Desactivar" (unenroll)
//
// NOTA: Aquest component NOMÉS gestiona l'alta/baixa del factor. El flux
// de login amb MFA challenge (pujar la sessió de aal1 a aal2 abans
// d'accedir a accions sensibles) és una segona fase no implementada
// aquí — sense ella, l'usuari pot tenir MFA enrolled però el seu perfil
// estarà en aal1. Per a accions sensibles ja farem el challenge.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Factor = {
  id: string;
  factor_type: string;
  status: string;
  friendly_name?: string;
  created_at?: string;
};

type EnrollData = {
  factorId: string;
  qrCode: string;
  secret: string;
  uri: string;
};

export default function MfaSection() {
  const [factors, setFactors] = useState<Factor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enroll, setEnroll] = useState<EnrollData | null>(null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  async function loadFactors() {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: e } = await supabase.auth.mfa.listFactors();
      if (e) throw e;
      // Només els factors verificats compten com a "actius".
      const active = (data?.totp ?? data?.all ?? []).filter(
        (f: Factor) => f.status === 'verified',
      );
      setFactors(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error carregant factors');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFactors();
  }, []);

  async function startEnroll() {
    if (!supabase) return;
    setError(null);
    setInfo(null);
    setEnrolling(true);
    try {
      const { data, error: e } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `InfoPol · ${new Date().toLocaleDateString('ca-ES')}`,
      });
      if (e) throw e;
      if (!data) throw new Error('Resposta buida');
      setEnroll({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error iniciant 2FA');
    } finally {
      setEnrolling(false);
    }
  }

  async function verifyEnroll() {
    if (!supabase || !enroll) return;
    if (!/^\d{6}$/.test(code)) {
      setError('El codi ha de ser de 6 dígits.');
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      const { data: ch, error: e1 } = await supabase.auth.mfa.challenge({
        factorId: enroll.factorId,
      });
      if (e1) throw e1;
      if (!ch) throw new Error('Resposta buida');
      const { error: e2 } = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: ch.id,
        code,
      });
      if (e2) throw e2;
      setInfo('2FA activat correctament! 🎉');
      setEnroll(null);
      setCode('');
      await loadFactors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Codi incorrecte o expirat');
    } finally {
      setVerifying(false);
    }
  }

  async function cancelEnroll() {
    if (!supabase || !enroll) {
      setEnroll(null);
      setCode('');
      return;
    }
    try {
      // Si surten sense verificar, treiem el factor pendent perquè no
      // quedi “unverified” penjat al compte.
      await supabase.auth.mfa.unenroll({ factorId: enroll.factorId });
    } catch {
      /* ignorem: si falla, es netejarà al servidor amb el temps */
    }
    setEnroll(null);
    setCode('');
    setError(null);
  }

  async function disableMfa(factorId: string) {
    if (!supabase) return;
    if (!window.confirm('Segur que vols desactivar el 2FA? Et farà més vulnerable.')) {
      return;
    }
    setError(null);
    try {
      const { error: e } = await supabase.auth.mfa.unenroll({ factorId });
      if (e) throw e;
      setInfo('2FA desactivat.');
      await loadFactors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desactivant 2FA');
    }
  }

  if (!supabase) return null;

  return (
    <section
      style={{
        marginTop: 24,
        padding: '20px 22px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 18,
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: 'var(--ink)',
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        🔒 Verificació en dos passos (2FA)
      </h3>
      <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 14 }}>
        Afegeix una capa extra de seguretat al teu compte. Necessitaràs una app
        autenticadora (Google Authenticator, Authy, Microsoft Authenticator, etc.).
      </p>

      {loading && <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Carregant…</p>}

      {error && (
        <p style={{ fontSize: 13, color: '#b91c1c', marginBottom: 8 }}>{error}</p>
      )}
      {info && (
        <p style={{ fontSize: 13, color: '#15803d', marginBottom: 8 }}>{info}</p>
      )}

      {/* Factors actius */}
      {!loading && !enroll && factors && factors.length > 0 && (
        <div>
          <div
            style={{
              padding: 12,
              border: '1px solid #d1fae5',
              background: '#ecfdf5',
              borderRadius: 10,
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#15803d', fontSize: 13.5 }}>
                ✓ 2FA activat (TOTP)
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {factors[0].friendly_name || 'Authenticator'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => disableMfa(factors[0].id)}
              style={{
                padding: '7px 14px',
                borderRadius: 10,
                border: '1px solid #fca5a5',
                background: 'transparent',
                color: '#b91c1c',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Desactivar
            </button>
          </div>
        </div>
      )}

      {/* Sense factor i no enrolling: botó d'activació */}
      {!loading && !enroll && (!factors || factors.length === 0) && (
        <button
          type="button"
          onClick={startEnroll}
          disabled={enrolling}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--ink)',
            color: 'var(--paper)',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: enrolling ? 'not-allowed' : 'pointer',
            opacity: enrolling ? 0.6 : 1,
          }}
        >
          {enrolling ? 'Carregant…' : 'Activar 2FA'}
        </button>
      )}

      {/* Procés d'enroll (QR + codi) */}
      {enroll && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>
            <b>1.</b> Escaneja aquest QR amb la teva app autenticadora:
          </p>
          <div
            style={{
              padding: 12,
              border: '1px solid var(--line)',
              borderRadius: 10,
              background: '#fff',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            <img
              src={enroll.qrCode}
              alt="QR per a configurar 2FA"
              width={180}
              height={180}
              style={{ display: 'inline-block' }}
            />
          </div>
          <details style={{ marginBottom: 12, fontSize: 12.5, color: 'var(--text-3)' }}>
            <summary style={{ cursor: 'pointer' }}>No pots escanejar? Mostra el codi manual</summary>
            <code
              data-allow-select="true"
              style={{
                display: 'block',
                marginTop: 6,
                padding: '8px 10px',
                background: 'var(--paper-2)',
                borderRadius: 6,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                wordBreak: 'break-all',
              }}
            >
              {enroll.secret}
            </code>
          </details>

          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
            <b>2.</b> Introdueix el codi de 6 dígits que mostra l'app:
          </p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid var(--line)',
              fontSize: 16,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.4em',
              textAlign: 'center',
              marginBottom: 10,
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={verifyEnroll}
              disabled={verifying || code.length !== 6}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--ink)',
                color: 'var(--paper)',
                fontWeight: 700,
                fontSize: 13.5,
                cursor: verifying || code.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: verifying || code.length !== 6 ? 0.5 : 1,
              }}
            >
              {verifying ? 'Verificant…' : 'Activar'}
            </button>
            <button
              type="button"
              onClick={cancelEnroll}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid var(--line)',
                background: 'transparent',
                color: 'var(--text-2)',
                fontWeight: 600,
                fontSize: 13.5,
                cursor: 'pointer',
              }}
            >
              Cancel·lar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
