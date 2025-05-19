✅ ICU Telemetry Monitor – Detailed LLM Task Breakdown (Visual + Logic Enhancements)
These tasks assume the base layout and basic functionality are complete. Each is atomic, testable, and connects either to visual fidelity or data-driven behavior.

🎨 PHASE A – Visual Fidelity: Match ICU Monitor Appearance
Task A1: Set dark background and global monitor theme
Start: Basic Tailwind layout

End: Black background, neon font colors (green for HR, yellow for SpO₂, blue for RR, red for BP), monitor-like styling

Task A2: Style each VitalBox to match the image
Start: Plain rectangles

End: Boxes display values like:

scss
Copy
Edit
HR
110
(green)
with label font smaller, values large, bold, and neon-colored

Task A3: Add thin separator lines between waveform rows
Start: Floating waveforms

End: Thin white or gray horizontal lines separate ECG, RESP, and SpO₂ areas

Task A4: Add NIBP review table at bottom
Start: No table

End: Render basic table with:

Time

HR

BP

SpO₂

RR
Table should auto-update every 30 seconds using last known values

Task A5: Add blinking “ST HIGHER” alert text if HR > 120
Start: No status

End: Small yellow “ST HIGHER” box flashes at top-left when HR is elevated

🎛️ PHASE B – Rhythm Profiles Affect Vitals + Waveforms
Task B1: Create rhythmProfiles.ts with real clinical presets
Start: Manual vitals

End: Export object:

ts
Copy
Edit
const rhythmProfiles = {
  NSR:    { hr: 75, spo2: 98, rr: 16, bp: { sys: 120, dia: 80 }, ecg: 'nsr', resp: 'normal', spo2Wave: 'normal' },
  ASYS:   { hr: 0,  spo2: 0,  rr: 0,  bp: { sys: 0,   dia: 0  }, ecg: 'flat', resp: 'flat',  spo2Wave: 'flat'  },
  AFIB:   { hr: 140,spo2: 95, rr: 20, bp: { sys: 140, dia: 95 }, ecg: 'afib',resp: 'irregular', spo2Wave: 'noisy' }
};
Task B2: Add dropdown UI to MonitorPage for rhythm selection
Start: Manual vitals only

End: Dropdown menu with NSR, ASYSTOLE, AFib, etc. updates context with selected rhythm preset

Task B3: On rhythm change, override vitals using selected profile
Start: Vitals still fluctuate manually

End: On rhythm change, set:

HR, RR, BP, SpO₂ values from profile

ECG + Resp + SpO₂ waveforms updated using profile waveform keys

Task B4: ECG waveform reflects selected rhythm
Start: Same wave for all rhythms

End:

NSR → normal

ASYSTOLE → flatline

AFIB → chaotic/jittery
You can use predefined waveform arrays and scroll them across canvas

Task B5: Resp and SpO₂ waveforms reflect rhythm
Start: Static waves

End:

normal: sine wave

flat: flatline

irregular: jittery with varied spacing

⚙️ PHASE C – Manual Input Overrides
Task C1: Add manual input fields for HR, SpO₂, RR, BP
Start: Only rhythm presets

End: Under each VitalBox, show optional override field (e.g., <input type="number" />) that replaces the current context value

Task C2: Override disables rhythm profile until reselected
Start: Manual and rhythm conflict

End: If user changes HR manually, rhythm preset disables (display “Manual”)

Task C3: Manually entered values update graphs
Start: Graphs ignore input

End:

HR → changes ECG BPM

RR → changes resp wave frequency

SpO₂ → optionally changes height of SpO₂ wave or display alert below 92

Task C4: Add reset button to restore rhythm control
Start: Manual override stays locked

End: “Reset to Rhythm Profile” button restores vitals + waveforms to match current selected rhythm

📈 PHASE D – Clinical Behavior Polish
Task D1: Add red alert flash for HR > 130, SpO₂ < 90, BP > 160
Start: Static vitals

End: Flashing border and audible ping every 5s if threshold breached

Task D2: Add time-based NIBP update behavior
Start: BP is static

End: BP updates every 60s and logs into table, even if manual override is set

Task D3: Add “Mean” BP calculation
Start: Only SYS/DIA shown

End: Show Mean = (SYS + 2 * DIA) / 3 below BP

Task D4: Add true-to-life refresh rates
Start: All waves scroll at same speed

End:

ECG scrolls per BPM

Resp scrolls per RR

SpO₂ scrolls fixed rate unless overridden

✅ Final Polish & Deployment
Task Z1: Add font that mimics ICU telemetry text (e.g., “Seven Segment” or monospaced)
Start: Default font

End: All vitals use consistent ICU-style font

Task Z2: Host on Vercel with mobile-friendly display
Start: Local only

End: Working on Chrome + Safari mobile, touchable dropdowns, live demo