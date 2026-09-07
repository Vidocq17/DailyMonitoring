export const SESSIONS = ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'JAMBESFUSION'] as const

export type Session = (typeof SESSIONS)[number]

export interface ExerciseSession {
  label: string
  key: string
}

export const EXERCISES_BY_SESSION: Record<Session, ExerciseSession[]> = {
  PUSH: [
    { label: 'Presse pectorale', key: 'chest_press_machine' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
    { label: 'Développé incliné smith', key: 'developpe_incline_smith' },
    { label: 'Élévations latérales avec haltères', key: 'elevations_laterales_halteres' },
    { label: 'Écartés haut-bas poulie', key: 'ecarte_poulie' },
    { label: 'Dips', key: 'dips_assistes' },
    { label: 'Extension triceps poulie haute', key: 'pushdown_cable' },
    { label: 'Rotation à la poulie', key: 'poulie_rotation' },
    { label: 'Curl inversé à la barre', key: 'curl_inverse_barre' },
  ],
  PULL: [
    { label: 'Tractions supinations', key: 'tractions_supinations' },
    { label: 'Tirage assis poulie', key: 'tirage_poulie_basse' },
    { label: 'Tirage unilatéral', key: 'rowing_unilateral_poulie' },
    { label: 'Pull over poulie bras tendue', key: 'pullover_cable' },
    { label: 'Curl marteau poulie', key: 'curl_marteau_poulie' },
    { label: 'Curl incliné haltères', key: 'curl_incline_halteres' },
    { label: 'Face pull', key: 'face_pull' },
    { label: 'Écartés bas-haut poulie', key: 'ecarte_bas_haut_poulie' },
    { label: 'Rotation à la poulie', key: 'poulie_rotation' },
  ],
  LEGS: [
    { label: 'Squat', key: 'squat' },
    { label: 'Fentes bulgares', key: 'bulgarian_split_squat' },
    { label: 'Extension jambes', key: 'leg_extension' },
    { label: 'Leg curl assis', key: 'leg_curl' },
    { label: 'Adduction', key: 'leg_adduction' },
    { label: 'Abduction', key: 'leg_abduction' },
    { label: 'Élévation mollets', key: 'mollets' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
  ],
  UPPER: [
    { label: 'Développé incliné smith', key: 'developpe_incline_smith' },
    { label: 'Tractions', key: 'tractions_assistees' },
    { label: 'Tirage assis poulie', key: 'tirage_poulie_basse' },
    { label: 'Presse pectorale', key: 'chest_press_machine' },
    { label: 'Curl incliné haltères', key: 'curl_incline_halteres' },
    { label: 'Élévations latérales poulie', key: 'elevations_laterales_poulie' },
    { label: 'Dips', key: 'dips_assistes' },
    { label: 'Crunch poulie', key: 'crunch_poulie' },
    { label: 'Écartés haut-bas poulie', key: 'ecarte_poulie' },
  ],
  LOWER: [
    { label: 'RDL', key: 'souleve_de_terre' },
    { label: 'Fentes bulgares', key: 'bulgarian_split_squat' },
    { label: 'Leg curl assis', key: 'leg_curl' },
    { label: 'Extension jambes', key: 'leg_extension' },
    { label: 'Adduction', key: 'leg_adduction' },
    { label: 'Abduction', key: 'leg_abduction' },
    { label: 'Élévations mollets machine', key: 'mollets' },
    { label: 'Extension du dos', key: 'extension_dos' },
    { label: 'Relevé genoux à la chaise romaine', key: 'releve_genoux_chaise_romaine' },
  ],
  JAMBESFUSION: [
    { label: 'Leg curl', key: 'leg_curl' },
    { label: 'Extension jambes', key: 'leg_extension' },
    { label: 'Extension du dos', key: 'extension_dos' },
    { label: 'RDL', key: 'souleve_de_terre' },
    { label: 'Élévations mollets machine', key: 'mollets' },
    { label: 'Fentes bulgares', key: 'bulgarian_split_squat' },
    { label: 'Rotation à la poulie', key: 'poulie_rotation' },
    { label: 'Élévations des genoux', key: 'elevation_genoux' },
  ],
}

// Flat map for easy lookup
export const SESSION_LABEL_TO_KEY: Record<string, string> = {}
Object.values(EXERCISES_BY_SESSION).forEach((sessionList) => {
  sessionList.forEach((ex) => {
    SESSION_LABEL_TO_KEY[ex.label] = ex.key
  })
})
