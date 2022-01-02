import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'battleEnemy'
  ];

  initialize() { }

  connect() {

  }

  debug() {
    console.log('caught debug in global battle controller');
  }

  disconnect() { }

  acquire_next_target() {
    let potential_targets = this.battleEnemyTargets;

    if (potential_targets.length > 0) {
      this.battleEnemyTargets[1].dispatch("focusThisTarget");
    } else {
      // BATTLE IS OVER!
    }
  }


}
