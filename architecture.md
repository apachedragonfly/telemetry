telemetry-monitor-sim/
│
├── public/                          # Static files (icons, fonts)
│   └── alarm.wav                    # Optional sound alert
│
├── src/
│   ├── assets/                      # Icons, wave illustrations
│
│   ├── components/                  # Reusable UI elements
│   │   ├── ECGWaveform.tsx
│   │   ├── RespWaveform.tsx
│   │   ├── SpO2Waveform.tsx
│   │   ├── VitalBox.tsx            # For HR, BP, SpO₂, RR
│   │   ├── AlertIndicator.tsx
│   │   └── TimeDisplay.tsx
│
│   ├── context/                     # Global state for vitals
│   │   └── MonitorContext.tsx
│
│   ├── services/                    # Signal generators, fake data
│   │   ├── ecgGenerator.ts
│   │   ├── respGenerator.ts
│   │   ├── spo2Generator.ts
│   │   └── vitalsMockData.ts
│
│   ├── pages/
│   │   └── MonitorPage.tsx
│
│   ├── hooks/
│   │   └── useVitalsSimulator.ts
│
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
