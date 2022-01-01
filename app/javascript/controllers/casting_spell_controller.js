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

    this.accuracyPowerBarTarget.style.width = '100%';

    this.update_timer_bar();
  }

  update_timer_bar() {
    let timer_percent = Math.ceil(this.time_remaining / this.data.get('max-time') * 100);
    this.timePowerBarTarget.style.width = timer_percent + '%';
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

    console.log('dispatching spellDamageTarget');
    // this.dispatch("spellDamageTarget", {
    //   detail: {
    //     damage: final_damage
    //   }
    // });

    const eventTrigger = new CustomEvent('spellDamageTarget', {
      damage: final_damage
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
}
