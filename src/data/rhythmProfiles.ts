// Define clinical rhythm profiles with realistic vital sign values
export interface RhythmProfile {
  hr: number;
  spo2: number;
  rr: number;
  bp: { sys: number; dia: number };
  ecg: 'nsr' | 'afib' | 'svt' | 'vt' | 'vfib' | 'flat' | 'paced' | 'avblock';
  resp: 'normal' | 'rapid' | 'slow' | 'irregular' | 'flat';
  spo2Wave: 'normal' | 'weak' | 'noisy' | 'flat';
  description: string;
}

export type RhythmKey = 'NSR' | 'AFIB' | 'SVT' | 'VT' | 'VFIB' | 'ASYSTOLE' | 'PACED' | 'AV-BLOCK';

const rhythmProfiles: Record<RhythmKey, RhythmProfile> = {
  'NSR': {
    hr: 75,
    spo2: 98,
    rr: 16,
    bp: { sys: 120, dia: 80 },
    ecg: 'nsr',
    resp: 'normal',
    spo2Wave: 'normal',
    description: 'Normal Sinus Rhythm with normal vital signs.'
  },
  
  'AFIB': {
    hr: 140,
    spo2: 95,
    rr: 20,
    bp: { sys: 140, dia: 95 },
    ecg: 'afib',
    resp: 'irregular',
    spo2Wave: 'noisy',
    description: 'Atrial Fibrillation with tachycardia and elevated blood pressure.'
  },
  
  'SVT': {
    hr: 165,
    spo2: 94,
    rr: 22,
    bp: { sys: 110, dia: 70 },
    ecg: 'svt',
    resp: 'rapid',
    spo2Wave: 'weak',
    description: 'Supraventricular Tachycardia with decreased oxygen saturation and rapid breathing.'
  },
  
  'VT': {
    hr: 180,
    spo2: 88,
    rr: 24,
    bp: { sys: 90, dia: 60 },
    ecg: 'vt',
    resp: 'rapid',
    spo2Wave: 'weak',
    description: 'Ventricular Tachycardia with hypoxemia and hypotension.'
  },
  
  'VFIB': {
    hr: 0, // Technically not measurable in real VFib
    spo2: 80,
    rr: 8,
    bp: { sys: 60, dia: 30 },
    ecg: 'vfib',
    resp: 'irregular',
    spo2Wave: 'flat',
    description: 'Ventricular Fibrillation - life-threatening cardiac emergency.'
  },
  
  'ASYSTOLE': {
    hr: 0,
    spo2: 0,
    rr: 0,
    bp: { sys: 0, dia: 0 },
    ecg: 'flat',
    resp: 'flat',
    spo2Wave: 'flat',
    description: 'Asystole - no cardiac electrical activity.'
  },
  
  'PACED': {
    hr: 72,
    spo2: 96,
    rr: 17,
    bp: { sys: 128, dia: 82 },
    ecg: 'paced',
    resp: 'normal',
    spo2Wave: 'normal',
    description: 'Pacemaker rhythm with normal vital signs.'
  },
  
  'AV-BLOCK': {
    hr: 46,
    spo2: 93,
    rr: 14,
    bp: { sys: 105, dia: 70 },
    ecg: 'avblock',
    resp: 'normal',
    spo2Wave: 'weak',
    description: 'AV Block with bradycardia and normal blood pressure.'
  }
};

export default rhythmProfiles; 