import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'elementName', 'spellName', 'accuracyPowerBar', 'timePowerBar',
    'spellIncantation'
  ];

  initialize() { }

  connect() {
    this.elementNameTarget.textContent = this.data.get('element');
    this.spellNameTarget.textContent = this.data.get('name');

    this.initialize_state();

    this.update_timer_bar();
    this.update_accuracy_bar();
  }

  initialize_state() {
    this.data.set('seconds-remaining', this.data.get('max-time'));
    this.data.set('accuracy', 100);
  }

  update_timer_bar() {
    let timer_percent = Math.ceil(this.time_remaining / this.data.get('max-time') * 100);
    this.timePowerBarTarget.style.width = timer_percent + '%';
  }

  update_accuracy_bar() {
    this.accuracyPowerBarTarget.style.width = this.accuracy + '%';
  }

  disconnect() { }

  debug() {
    console.log('caught debug!');
  }

  create_ticking_timer() {
    let interval = setInterval(this.ticking_timer_tick.bind(this), 1000);

    this.data.set('cast-interval', interval);
  }

  start_casting(event) {
    this.create_ticking_timer();
    this.data.set('seconds-remaining', this.data.get('max-time'));
  }

  ding_accuracy(event) {
    let accuracy_penalty = 3;
    this.data.set('accuracy', this.accuracy - accuracy_penalty);

    this.update_accuracy_bar();
  }

  finish_casting(event) {
    let damage_base = this.data.get('base-damage');
    let time_multiplier = this.time_remaining / this.data.get('max-time');
    let accuracy_multipler = 1;
    let element_multiplier = 1;
    let buff_multiplier = 1;
    let debuff_multiplier = 1;
    let variance_multiplier = 1; // todo random between 0.85 - 1.15
    let critical_hit_multiplier = 1; // todo 90% of 1, 10% of 2

    let final_damage = Math.floor(
      damage_base 
        * time_multiplier
        * accuracy_multipler
        * element_multiplier
        * buff_multiplier
        * debuff_multiplier
        * variance_multiplier
        * critical_hit_multiplier
    );

    if (this.data.has('cast-interval')) {
      clearInterval(this.data.get('cast-interval'));
    }

    // We dispatch the event to the full document (unscoped) so all
    // enemies can receive it, rather than a specific one.
    const eventTrigger = new CustomEvent('spellDamageTarget', {
      detail: {
        damage: final_damage
      }
    });
    document.dispatchEvent(eventTrigger);
  }

  ticking_timer_tick() {
    let time_delta_per_tick = 1;
    let seconds_remaining = this.time_remaining;

    this.data.set('seconds-remaining', seconds_remaining - time_delta_per_tick);
    this.update_timer_bar();
  }

  get time_remaining() {
    if (this.data.has('seconds-remaining')) {
      return parseInt(this.data.get('seconds-remaining'));
    } else {
      return parseInt(this.data.get('max-time'));
    }
  }

  get accuracy() {
    if (this.data.has('accuracy')) {
      return parseInt(this.data.get('accuracy'));
    } else {
      return 100;
    }
  }
}
