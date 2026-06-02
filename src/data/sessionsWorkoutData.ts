export const SESSIONS = ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER'] as const

export type Session = (typeof SESSIONS)[number]

export interface ExerciseSession {
  label: string
  key: string
}

export const EXERCISES_BY_SESSION: Record<Session, ExerciseSession[]> = {
  PUSH: [
    { label: 'Presse pectorale', key: 'chest_press_machine' },
    { label: 'Élévations latérales avec haltères', key: 'elevations_laterales_halteres' },
    { label: 'Écartés haut-bas poulie', key: 'ecarte_poulie' },
    { label: 'Extension triceps poulie haute', key: 'pushdown_cable' },
    { label: 'Face pull', key: 'face_pull' },
    { label: 'Dips', key: 'dips_assistes' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
  ],
  PULL: [
    { label: 'Tractions supinations', key: 'tractions_supinations' },
    { label: 'Tirage unilatéral', key: 'rowing_unilateral_poulie' },
    { label: 'Tirage assis poulie', key: 'tirage_poulie_basse' },
    { label: 'Pull over poulie bras tendue', key: 'pullover_cable' },
    { label: 'Curl marteau poulie', key: 'curl_marteau_poulie' },
    { label: 'Face pull', key: 'face_pull' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
  ],
  LEGS: [
    { label: 'Crunch poulie', key: 'crunch_poulie' },
    { label: 'Presse cuisses', key: 'presse_incline' },
    { label: 'Extension jambes', key: 'leg_extension' },
    { label: 'Leg curl assis', key: 'leg_curl' },
    { label: 'Adduction', key: 'leg_adduction' },
    { label: 'Abduction', key: 'leg_abduction' },
    { label: 'Extension dos', key: 'extension_dos' },
    { label: 'Élévation mollets', key: 'mollets' },
  ],
  UPPER: [
    { label: 'Élévation incliné smith', key: 'developpe_incline_halteres' },
    { label: 'Dips', key: 'dips_assistes' },
    { label: 'Tractions', key: 'tractions_assistees' },
    { label: 'Rowing haltères poitrine appuyée', key: 'rowing_poitrine_appuyee' },
    { label: 'Curl barre EZ', key: 'curl_barre' },
    { label: 'Élévations latérales poulie', key: 'elevations_laterales_poulie' },
  ],
  LOWER: [
    { label: 'RDL', key: 'souleve_de_terre' },
    { label: 'Fentes bulgares', key: 'bulgarian_split_squat' },
    { label: 'Leg curl allongé', key: 'leg_curl' },
    { label: 'Élévations mollets machine', key: 'mollets' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
    { label: 'Extension du dos', key: 'extension_dos' },
  ],
}

// Flat map for easy lookup
export const SESSION_LABEL_TO_KEY: Record<string, string> = {}
Object.values(EXERCISES_BY_SESSION).forEach((sessionList) => {
  sessionList.forEach((ex) => {
    SESSION_LABEL_TO_KEY[ex.label] = ex.key
  })
})
