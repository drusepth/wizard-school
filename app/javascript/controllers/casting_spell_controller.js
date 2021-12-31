import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    'elementName'
  ];

  initialize() { }

  connect() {
    this.elementNameTarget.textContent = this.data.get('element');
  }

  disconnect() {

  }
}
