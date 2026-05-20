import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { useApp } from '../AppContext'
import { api } from '../api'
import Status from '../components/Status'
import ForgeBar from '../components/ForgeBar'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${FORGE.line}`,
          borderRadius: 8, padding: '9px 12px',
          fontFamily: FORGE.mono, fontSize: 12, color: FORGE.fg,
          outline: 'none', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = FORGE.notion}
        onBlur={e  => e.target.style.borderColor = FORGE.line}
      />
    </div>
  )
}

export default function NotionSettings() {
  const navigate = useNavigate()
  const { profile, loadDashboard } = useApp()

  const [dbId,       setDbId]       = useState('')
  const [apiKey,     setApiKey]     = useState('')
  const [checkbox,   setCheckbox]   = useState('Done')
  const [dateStart,  setDateStart]  = useState('')
  const [dateEnd,    setDateEnd]    = useState('')
  const [saving,     setSaving]     = useState(false)
  const [syncing,    setSyncing]    = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [saveOk,     setSaveOk]     = useState(false)

  useEffect(() => {
    if (!profile) return
    setDbId(profile.notion_database_id || '')
    setApiKey(profile.notion_api_key || '')
    setCheckbox(profile.notion_checkbox_field || 'Done')
    setDateStart(profile.notion_date_start_field || '')
    setDateEnd(profile.notion_date_end_field || '')
  }, [profile])

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setSaveOk(false)
    await api.updateProfile({
      notion_database_id:    dbId.trim()       || null,
      notion_api_key:        apiKey.trim()     || null,
      notion_checkbox_field: checkbox.trim()   || 'Done',
      notion_date_start_field: dateStart.trim() || null,
      notion_date_end_field:   dateEnd.trim()   || null,
    })
    setSaving(false)
    setSaveOk(true)
    setTimeout(() => setSaveOk(false), 2500)
  }

  async function handleSync() {
    if (syncing) return
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await api.syncNotion()
      setSyncResult(res)
      await loadDashboard()
    } catch (e) {
      setSyncResult({ error: String(e) })
    } finally {
      setSyncing(false)
    }
  }

  const configured = dbId.trim() && apiKey.trim()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.notion}22`} br={`${FORGE.notion}11`} />
      <Status dark />
      <ForgeBar title="Notion" sub="intégration" right={
        <div onClick={() => navigate(-1)}
          style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, cursor: 'pointer', padding: '5px 10px', border: `1px solid ${FORGE.line}`, borderRadius: 7 }}>
          ← RETOUR
        </div>
      } />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* En-tête */}
          <ForgeBox accent={FORGE.notion} glow={FORGE.notion}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: `${FORGE.notion}22`, border: `1.5px solid ${FORGE.notion}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: FORGE.notion, flexShrink: 0 }}>N</div>
              <div>
                <ForgeTag color={FORGE.notion}>Intégration Notion</ForgeTag>
                <div style={{ marginTop: 5, fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
                  Importe les tâches non cochées depuis ta base Notion.
                  Chaque tâche complétée rapporte <span style={{ color: FORGE.notion }}>+5 XP</span>.
                </div>
              </div>
            </div>
          </ForgeBox>

          {/* Config */}
          <ForgeBox accent={FORGE.notion}>
            <ForgeTag color={FORGE.notion}>Configuration</ForgeTag>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Database ID" value={dbId} onChange={setDbId}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
              <Field label="API Key" value={apiKey} onChange={setApiKey}
                placeholder="secret_…" type="password" />
              <Field label="Champ checkbox" value={checkbox} onChange={setCheckbox}
                placeholder="Done" />
              <Field label="Champ date début (optionnel)" value={dateStart} onChange={setDateStart}
                placeholder="ex : Date" />
              <Field label="Champ date fin (optionnel)" value={dateEnd} onChange={setDateEnd}
                placeholder="laisser vide si inutilisé" />
            </div>

            <div
              onClick={handleSave}
              style={{ marginTop: 16, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: FORGE.mono, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                background: saveOk ? `${FORGE.green}22` : `${FORGE.notion}22`,
                border: `1px solid ${saveOk ? FORGE.green : FORGE.notion}66`,
                color: saveOk ? FORGE.green : FORGE.notion,
              }}>
              {saving ? 'SAUVEGARDE…' : saveOk ? '✓ SAUVEGARDÉ' : 'SAUVER CONFIG'}
            </div>
          </ForgeBox>

          {/* Sync */}
          <ForgeBox accent={configured ? FORGE.notion : FORGE.line}>
            <ForgeTag color={configured ? FORGE.notion : FORGE.fgFaint}>Synchronisation</ForgeTag>
            <div style={{ marginTop: 10, fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
              {configured
                ? 'Sync auto au chargement de l\'app. Lance une sync manuelle ci-dessous.'
                : 'Configure d\'abord le Database ID et l\'API Key.'}
            </div>

            {syncResult && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: syncResult.error ? `${FORGE.fire}18` : `${FORGE.green}18`, border: `1px solid ${syncResult.error ? FORGE.fire : FORGE.green}44`, fontFamily: FORGE.mono, fontSize: 11, color: syncResult.error ? FORGE.fire : FORGE.green }}>
                {syncResult.error
                  ? `⚠ Erreur : ${syncResult.error}`
                  : syncResult.skipped
                    ? '— Notion non configuré'
                    : `✓ ${syncResult.created} tâche${syncResult.created !== 1 ? 's' : ''} importée${syncResult.created !== 1 ? 's' : ''}`}
              </div>
            )}

            <div
              onClick={configured ? handleSync : undefined}
              style={{ marginTop: 12, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: configured ? 'pointer' : 'default', fontFamily: FORGE.mono, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                background: configured ? `${FORGE.notion}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${configured ? FORGE.notion + '66' : FORGE.line}`,
                color: configured ? FORGE.notion : FORGE.fgFaint,
                opacity: syncing ? 0.6 : 1,
              }}>
              {syncing ? 'SYNC EN COURS…' : 'SYNC NOTION'}
            </div>
          </ForgeBox>

          {/* Aide */}
          <ForgeBox pad={14}>
            <div style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint, lineHeight: 1.7 }}>
              <div style={{ color: FORGE.fgDim, marginBottom: 6, fontSize: 10 }}>Comment trouver le Database ID ?</div>
              Ouvre ta base Notion dans le navigateur. L'URL ressemble à :<br />
              <span style={{ color: FORGE.notion }}>notion.so/…/<b>32caractères</b>?v=…</span><br />
              Copie les 32 caractères avant le <span style={{ color: FORGE.notion }}>?v=</span>.
            </div>
          </ForgeBox>

        </div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
