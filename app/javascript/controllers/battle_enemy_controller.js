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
    let activity_percent = Math.ceil(this.time_until_next_attack / (parseInt(this.data.get('attack-interval'))) * 100)
    this.activityBarTarget.style.width = (100 - activity_percent) + '%';
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

  die() {
    this.pause_battle();

    this.element.classList.add('transform', 'opacity-0', 'transition', 'duration-1000');
    setTimeout(() => {
      this.element.remove();

      if (this.targeted) {
        this.dispatch("acquireNewTarget", {
          detail: { }
        });
      }
    }, 1000);
  }

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

      this.die();
    }

    this.data.set('current-health', current_health);
  }

  resume_battle() {
    let interval = setInterval(this.activity_timer_tick.bind(this), 50);

    this.data.set('activity-interval', interval);
  }

  pause_battle() {
    if (this.data.get('activity-interval')) {
      clearInterval(this.data.get('activity-interval'));
    }
  }

  activity_timer_tick() {
    let time_delta_per_tick = 0.05;
    let seconds_remaining = this.time_until_next_attack - time_delta_per_tick;

    if (seconds_remaining <= 0) {
      this.attack_player();

      seconds_remaining = parseInt(this.data.get('attack-interval'));
    }

    this.data.set('seconds-remaining-until-attack', seconds_remaining);
    this.update_activity_bar();
  }

  attack_player() {
    let damage = parseInt(this.data.get('damage'));

    const eventTrigger = new CustomEvent('playerDamage', {
      detail: {
        damage: damage
      }
    });
    document.dispatchEvent(eventTrigger);

    this.containerTarget.classList.add('animate-bounce');
    setTimeout(this.reset_container_animations.bind(this), 1500);
  }

  animate_damage_taken() {
    this.imageTarget.classList.add('animate-spin');
    setTimeout(this.reset_image_animations.bind(this), 1320);
  }

  reset_image_animations() {
    this.imageTarget.classList.remove(...[
      'animate-spin', 'animate-bounce'
    ]);
  }

  reset_container_animations() {
    this.containerTarget.classList.remove(...[
      'animate-spin', 'animate-bounce'
    ]);
  }

  get targeted() {
    if (this.data.has('targeted')) {
      return this.data.get('targeted') == 'true';
    } else {
      return false;
    }
  }

  get time_until_next_attack() {
    if (this.data.has('seconds-remaining-until-attack')) {
      return parseFloat(this.data.get('seconds-remaining-until-attack'));
    } else {
      return parseFloat(this.data.get('attack-interval'));
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
