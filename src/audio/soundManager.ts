import { synth } from './synth';

export class SoundManager {
  static click() {
    synth.playClick();
  }

  static pencil() {
    synth.playPencil();
  }

  static erase() {
    synth.playErase();
  }

  static unitComplete() {
    synth.playUnitComplete();
  }

  static error() {
    synth.playError();
  }

  static fanfare() {
    synth.playVictoryFanfare();
  }

  static toggleZenDrone(enable?: boolean): boolean {
    return synth.toggleZenDrone(enable);
  }

  static setMuted(muted: boolean) {
    synth.setMuted(muted);
  }
}
