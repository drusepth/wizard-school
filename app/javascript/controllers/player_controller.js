import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'healthBar', 'currentHealth', 'maxHealth'
  ];

  initialize() { }

  update_health_bar() {
    let health_percent = Math.ceil(this.current_health / this.max_health * 100);

    this.healthBarTarget.style.width = health_percent + '%';

    this.currentHealthTarget.textContent = this.current_health;
    this.maxHealthTarget.textContent = this.data.get('max-health');
  }

  connect() {
    this.update_health_bar();
  }

  disconnect() { }

  receive_damage(event) {
    this.animate_damage_taken();

    this.remove_life(event.detail.damage);
    this.update_health_bar();
  }

  remove_life(amount) {
    let current_health = this.current_health;
    current_health -= amount;

    if (current_health < 0) {
      current_health = 0;
    }

    this.data.set('current-health', current_health);
  }

  animate_damage_taken() {
    this.imageTarget.classList.add('animate-spin');
    setTimeout(this.reset_animations.bind(this), 1320);
  }

  reset_animations() {
    this.imageTarget.classList.remove('animate-spin');
  }

  get current_health() {
    if (this.data.has('current-health')) {
      return parseInt(this.data.get('current-health'));
    } else {
      return this.max_health;
    }
  }

  get max_health() {
    return parseInt(this.data.get('max-health'));
  }
}
