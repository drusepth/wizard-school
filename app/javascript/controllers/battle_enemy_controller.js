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

  disconnect() {

  }

  damage_target(event) {
    console.log('damaging target!!!!');
    // console.log('finished cast');
    // console.log(event.detail);
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
