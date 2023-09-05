class CraftingMenu {
    constructor({ teachers, onComplete }) {
        this.teachers = teachers;
        this.onComplete = onComplete;
    }

    getOptions() {
        return this.teachers.map((id) => {
            const base = Teachers[id];
            return {
                label: base.name,
                description: base.description,
                handler: () => {
                    playerState.addTeacher(id);
                    this.close();
                },
            };
        });
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("CraftingMenu");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = `
        <h2>Create a Teacher</h2>
      `;
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container,
        });
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions());

        container.appendChild(this.element);
    }
}
