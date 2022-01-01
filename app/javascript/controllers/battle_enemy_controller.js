import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'container', 'type', 'image', 'name', 'level', 'element',
    'healthBar', 'activityBar'
  ];

  initialize() { }

  update_targeting() {
    let targeted_classes = ['border-2', 'border-indigo-500'];

    if (this.targeted == true) {
      this.containerTarget.classList.add(...targeted_classes);
    } else {
      this.containerTarget.classList.remove(...targeted_classes);
    }
  }

  update_health_bar() {
    let health_percent = Math.ceil(this.current_health / this.max_health * 100);
    this.healthBarTarget.style.width = health_percent + '%';
  }

  update_activity_bar() {
    this.activityBarTarget.style.width = '0%';
  }

  connect() {
    this.typeTarget.textContent = this.data.get('type');
    this.imageTarget.src = this.data.get('image');
    this.nameTarget.textContent = this.data.get('name');
    this.levelTarget.textContent = 'Level ' + this.data.get('level');
    this.elementTarget.textContent = 'Water';

    this.update_targeting();
    this.update_health_bar();
    this.update_activity_bar();
  }

  debug() {
    console.log('caught debug in battle enemy controller');
  }

  disconnect() { }

  receive_damage(event) {
    if (this.targeted) {
      this.animate_damage_taken();

      this.remove_life(event.detail.damage);
      this.update_health_bar();
    }
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

  get targeted() {
    if (this.data.has('targeted')) {
      return this.data.get('targeted') == 'true';
    } else {
      return false;
    }
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
