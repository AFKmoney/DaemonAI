import { WaveType } from './ope.js';
export class BrainWaves {
    currentWave = WaveType.ALPHA;
    amplitude = 0.4;
    phase = 0;
    update(surprise, uncertainty, focus) {
        if (focus > 0.8) {
            this.currentWave = WaveType.BETA;
            this.amplitude = 0.5;
        }
        else if (surprise > 200) {
            this.currentWave = WaveType.GAMMA;
            this.amplitude = 0.8;
        }
        else if (uncertainty > 0.7) {
            this.currentWave = WaveType.THETA;
            this.amplitude = 0.6;
        }
        else {
            this.currentWave = WaveType.ALPHA;
            this.amplitude = 0.4;
        }
        this.phase += 0.1;
    }
    getModulation() {
        // Sinusoidal oscillation to network drift
        return Math.sin(this.phase * (this.currentWave / 10)) * this.amplitude;
    }
}
