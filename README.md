# Telemetry Monitor Simulator

A medical telemetry monitor simulator for healthcare education and training.

## Overview

This application simulates a medical telemetry monitor, displaying vital signs and waveforms that are commonly seen in intensive care settings. It's designed for healthcare education, allowing students and instructors to practice monitoring and interpreting vital signs in a safe, simulated environment.

## Features

- Real-time ECG, respiratory, and SpO₂ waveforms
- Vital sign monitoring (HR, BP, SpO₂, RR)
- Multiple cardiac rhythm options (NSR, AFib, SVT, VT, VFib, Asystole, etc.)
- Alert conditions with visual and audio cues
- Responsive layout for desktop, tablet, and mobile
- Realistic medical monitor appearance

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Canvas API for waveforms
- Howler.js for audio alerts

## Deployment to Vercel

This application is ready to be deployed to Vercel. Follow these steps:

1. Create a Vercel account at https://vercel.com if you don't already have one.

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Follow the prompts in the CLI to complete the deployment.

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

## Local Development

To run the application locally:

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/telemetry-monitor-sim.git
   cd telemetry-monitor-sim
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Usage

- Use the rhythm dropdown to change cardiac rhythms
- Observe how vital signs fluctuate over time
- Note the alert indicators when vitals go outside normal ranges
- Use the reset button to return to normal baseline values

## License

MIT
