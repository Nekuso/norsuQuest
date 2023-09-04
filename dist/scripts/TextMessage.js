class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("text__message");

    this.element.innerHTML = `
      <p class="text__message__p"></p>
      <button class="text__message__button">Next</button>
      `;

    // Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".text__message__p"),
      text: this.text,
    });

    this.element
      .querySelector(".text__message__button")
      .addEventListener("click", () => {
        this.done();
      });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
