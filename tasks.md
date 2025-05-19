🧠 Telemetry Monitor Simulator – Task-by-Task Build Plan
Each task:

🧩 Solves one concern

✅ Has clear start & end conditions

🧪 Is testable immediately

🔄 Is designed for stepwise execution and LLM chaining

⚙️ PHASE 1 – Project Bootstrapping
Task 1: Initialize Vite + React + TypeScript project
Start: No project yet

End: npm run dev opens to “Telemetry Sim v0.1”

Task 2: Install Tailwind CSS and initialize config
Start: No Tailwind

End: Tailwind works (verified by bg-red-500 test in App.tsx)

Task 3: Clean up boilerplate
Start: Vite default styles/files

End: Project contains a single App.tsx component with placeholder text

🧱 PHASE 2 – Basic Layout
Task 4: Create MonitorPage.tsx
Start: Only App.tsx

End: App.tsx imports and renders <MonitorPage /> with “Monitor Ready” message

Task 5: Set up src/components/VitalBox.tsx
Start: No vital readouts

End: VitalBox shows hardcoded HR, BP, SpO₂, and RR values in a styled black box with colored labels (green, red, yellow, blue)

Task 6: Display vitals grid layout in MonitorPage.tsx
Start: Single column

End: Grid of 2x2 VitalBox components (HR, BP, SpO₂, RR) matching general telemetry style

🎛️ PHASE 3 – Canvas Waveform Rendering
Task 7: Create ECGWaveform.tsx component
Start: No waveform

End: 500x200 <canvas> with black background, test green line drawn statically

Task 8: Animate scrolling ECG wave using requestAnimationFrame
Start: Static ECG line

End: Green waveform scrolls left continuously, repeating pattern

Task 9: Render ECGWaveform at top of MonitorPage
Start: Component not used

End: Canvas appears above vitals grid, scrolling left continuously

Task 10: Repeat for RespWaveform.tsx and SpO2Waveform.tsx
Start: One canvas

End: All three waveform components scroll (green, blue, yellow)

🧬 PHASE 4 – State and Vitals
Task 11: Create MonitorContext.tsx with vitals state
ts
Copy
Edit
{
  hr: number,
  bp: { sys: number, dia: number },
  spo2: number,
  rr: number,
  rhythm: string
}
End: Wrap <App /> in <MonitorProvider>, provide initial mock vitals

Task 12: Update VitalBox to use context instead of hardcoded values
Start: Static display

End: VitalBox reads HR, BP, etc., from context provider

Task 13: Create useVitalsSimulator.ts hook
Start: Vitals static

End: Hook updates vitals every second using sinusoidal/random variation

Task 14: Attach simulator hook to MonitorPage
Start: Vitals constant

End: HR, RR, SpO₂, BP update in real time with small fluctuations

🚨 PHASE 5 – Alerts and Flashing
Task 15: Create AlertIndicator.tsx
Start: No alert logic

End: If HR > 120 or SpO₂ < 92, surrounding box border flashes red

Task 16: Integrate alert into each VitalBox
Start: No dynamic border

End: Critical vitals flash (CSS or Tailwind animation class)

Task 17: Play alert tone with Howler.js (optional)
Start: Silent

End: alarm.wav plays when any vital is outside safe range

⏱️ PHASE 6 – Time & Rhythm
Task 18: Create TimeDisplay.tsx
Start: No time shown

End: Footer shows current time like monitor (“16:42:39” format)

Task 19: Add rhythm dropdown in corner for instructor override
Start: Rhythm = 'NSR'

End: Dropdown changes rhythm in context (NSR, AFib, Asystole, etc.)

Task 20: Update ECG waveform pattern based on rhythm
Start: Same wave for all rhythms

End: Different patterns rendered (AFib = erratic, Asystole = flatline)

🧪 PHASE 7 – Testing & Polish
Task 21: Add global reset button
Start: No way to reset

End: Button resets all vitals and rhythm to default

Task 22: Add responsive layout
Start: Desktop-only

End: Works on mobile and tablet, with vertical stacking

Task 23: Apply final Tailwind styling
Start: Utility classes only

End: Looks close to ICU monitor: black background, bright vital colors, clean alignment

Task 24: Deploy to Vercel
Start: Local only

End: Live URL shared

