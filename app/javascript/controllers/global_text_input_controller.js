import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['activated', 'remaining'];

  initialize() { }

  connect() {
    window.addEventListener('keypress', this.process_keypress.bind(this));

    this.initialize_texts();
  }

  initialize_texts() {
    this.data.set('index', 0);
    this.activatedTarget.textContent = '';
    this.remainingTarget.textContent = this.message;
  }

  process_keypress(event) {
    let current_index = this.index;
    let expected_key = this.message[current_index];
    let continuing_spell = this.index > 0;

    if (event.key == expected_key) {
      current_index += 1;

      this.activatedTarget.textContent = this.message.substring(0, current_index);
      this.remainingTarget.textContent = this.message.substring(current_index);

      this.data.set('index', current_index);

    } else {
      if (continuing_spell) {
        this.dispatch("incorrectSpellCharacter", {
          detail: {
            entered:  event.key,
            expected: expected_key
          }
        });
      }

      console.log(event.key + " != " + expected_key);
    }

    // Emit startedCastingSpell if we just triggered the first character
    if (this.index == 1 && event.key == expected_key) {
      this.dispatch("startedCastingSpell", {
        detail: {
          started_at: new Date().getTime()
        }
      });
    }
    
    if (this.index >= this.message.length) {
      console.log('done casting spell');
      this.dispatch("finishedCastingSpell", {
        detail: {
          finished_at: new Date().getTime()
        }
      });

      this.initialize_texts();
    }
  }
  
  get message() {
    if (this.data.has('message')) {
      return this.data.get('message');
    } else {
      alert('Error: no message configured');
    }
  }

  get index() {
    if (this.data.has('index')) {
      return parseInt(this.data.get('index'));
    } else {
      return 0;
    }
  }
}
