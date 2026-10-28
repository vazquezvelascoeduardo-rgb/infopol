import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { TestTopic, TestQuestion } from '../../data/tests/types';
import TestSession from './TestSession';

type Topic = { slug: string; title: string; module: string; question_count: number; source_count: number };
type Access = { user_id: string; email: string; active: boolean };

export default function Ispc() {
  const { user } = useAuth();
  const { slug } = useParams();
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState<TestTopic>();
  const [admin, setAdmin] = useState(false);
  const [access, setAccess] = useState<Access[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [loadedFor, setLoadedFor] = useState('');
  const identity = `${user?.id ?? ''}:${slug ?? ''}`;

  useEffect(() => {
    let active = true;
    setState('loading'); setTopic(undefined); setAdmin(false); setAccess([]);
    async function load() {
      if (!user || !supabase) { if (active) setState('denied'); return; }
      try {
        const permission = await supabase.from('ispc_access').select('active').eq('user_id', user.id).maybeSingle();
        if (permission.error) throw permission.error;
        if (!permission.data?.active) {
          if (active) { setTopic(undefined); setTopics([]); setState('denied'); }
          return;
        }
        const [catalog, role] = await Promise.all([
          supabase.from('ispc_topics').select('*').order('slug'),
          supabase.from('ispc_admins').select('user_id').eq('user_id', user.id).maybeSingle(),
        ]);
        if (catalog.error || role.error) throw catalog.error || role.error;
        let selected: TestTopic | undefined;
        if (slug) {
          const meta = (catalog.data as Topic[]).find(t => t.slug === slug);
          if (meta) {
            const result = await supabase.from('ispc_questions').select('id,text,options,correct,reference,explanation').eq('topic_slug', slug).order('id').limit(1000);
            if (result.error) throw result.error;
            selected = { slug, title: meta.title, description: 'Material de preparació ISPC · Accés privat', icon: '🔒', accent: '', questions: result.data as TestQuestion[] };
          }
        }
        let members: Access[] = [];
        if (role.data && !slug) {
          const result = await supabase.from('ispc_access').select('user_id,email,active').order('email');
          if (result.error) throw result.error;
          members = result.data;
        }
        if (active) {
          setTopics(catalog.data); setTopic(selected); setAdmin(!!role.data); setAccess(members);
          setLoadedFor(identity); setState('ready');
        }
      } catch { if (active) { setTopic(undefined); setState('error'); } }
    }
    void load();
    // Revalida el permís sense persistir les preguntes al dispositiu.
    const check = async () => {
      if (!supabase || !user) return;
      const result = await supabase.from('ispc_access').select('active').eq('user_id', user.id).maybeSingle();
      if (active && (result.error || !result.data?.active)) { setTopic(undefined); setTopics([]); setState(result.error ? 'error' : 'denied'); }
    };
    const timer = window.setInterval(() => { void check(); }, 30000);
    const focus = () => { void check(); };
    window.addEventListener('focus', focus);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [user?.id, slug, reload]);

  async function changeAccess(target: string, enabled: boolean) {
    if (!supabase || busy) return;
    setBusy(true); setMessage('');
    const { error } = await supabase.rpc('ispc_set_access', { target_email: target, enabled });
    setBusy(false);
    if (error) setMessage(error.message);
    else { setEmail(''); setMessage(enabled ? 'Accés autoritzat.' : 'Accés desactivat.'); setReload(n => n + 1); }
  }

  if (state === 'ready' && loadedFor === identity && slug && topic?.questions.length) return <TestSession key={identity} privateTopic={topic} />;
  return <div className="mx-auto max-w-5xl px-4 py-6" style={{ color: 'var(--v-ink)' }}>
    <Link to={slug ? '/ispc' : '/policia-local'} className="underline">← {slug ? 'Temes ISPC' : 'Tests'}</Link>
    <h1 className="text-3xl font-bold mt-5">ISPC · Exàmens per temes</h1>
    <p className="mt-2 mb-6" style={{ color: 'var(--v-muted)' }}>Espai privat per a usuaris autoritzats.</p>
    {(state === 'loading' || (state === 'ready' && loadedFor !== identity)) && <p role="status">Comprovant l'accés…</p>}
    {state === 'denied' && <p>El teu compte no té autorització per accedir al material ISPC. Demana l'accés a l'administrador d'InfoPol.</p>}
    {state === 'error' && <div role="alert"><p>No s'ha pogut comprovar l'accés. Cal connexió per consultar aquest material.</p><button className="underline mt-3" onClick={() => setReload(n => n + 1)}>Torna-ho a provar</button></div>}
    {state === 'ready' && loadedFor === identity && <>
      {slug ? <p>Aquest tema encara no té preguntes disponibles. <Link to="/ispc" className="underline">Torna als temes</Link></p> : <>
        <p className="mb-6 text-sm">Tests de preparació basats en el material aportat. Les correccions indiquen la font original; no són exàmens oficials nous ni una garantia de normativa actualitzada.</p>
        {[...new Set(topics.map(t => t.module))].map(module => <section key={module} className="mb-7">
          <h2 className="text-xl font-bold mb-3">{module}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{topics.filter(t => t.module === module).map(t => <div key={t.slug} className="rounded-2xl p-5" style={{ background: 'var(--v-surface)' }}>
            <h3 className="font-bold">{t.title}</h3>
            <p className="text-sm my-2">{t.question_count ? `${t.question_count} preguntes` : 'Preguntes en preparació'} · {t.source_count} documents</p>
            {t.question_count > 0 && <Link className="underline font-semibold" style={{ color: 'var(--v-terra-ink)' }} to={`/ispc/${t.slug}`}>Fes un test →</Link>}
          </div>)}</div>
        </section>)}
        {admin && <section className="rounded-2xl p-5 mt-8" style={{ background: 'var(--v-surface)' }}>
          <h2 className="text-xl font-bold">Gestiona els accessos</h2>
          <p className="text-sm my-2">L'usuari ha de tenir un compte d'InfoPol amb el correu verificat.</p>
          <form onSubmit={e => { e.preventDefault(); void changeAccess(email, true); }} className="flex flex-wrap gap-3 my-4">
            <label className="flex-1">Correu electrònic<input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="block border rounded-lg p-3 w-full" style={{ background: 'var(--v-paper)' }} /></label>
            <button disabled={busy} className="underline font-bold" type="submit">Autoritza</button>
          </form>
          <p role="status">{message}</p>
          {access.map(a => <div key={a.user_id} className="flex flex-wrap gap-3 justify-between py-3 border-b"><span>{a.email} · {a.active ? 'Actiu' : 'Desactivat'}</span>{a.user_id !== user?.id && <button disabled={busy} className="underline" onClick={() => void changeAccess(a.email, !a.active)}>{a.active ? 'Desactiva' : 'Autoritza'}</button>}</div>)}
        </section>}
      </>}
    </>}
  </div>;
}
