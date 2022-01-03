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

  deal_damage_to_enemy(event) {
    let potential_targets = this.battleEnemyTargets;

    if (potential_targets.length > 0) {
      this.battleEnemyTargets[1].dispatch("receiveDamage", {
        detail: {
          damage: event.detail.damage
        }
      });
    } else {
      // BATTLE IS OVER!
    }

    console.log('battle damage dealer');
  }

}
