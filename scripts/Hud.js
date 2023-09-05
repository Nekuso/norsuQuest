class Hud {
    constructor() {
        this.scoreboards = [];
    }

    update() {
        this.scoreboards.forEach((s) => {
            s.update(window.playerState.teachers[s.id]);
        });
    }

    createElement() {
        if (this.element) {
            this.element.remove();
            this.scoreboards = [];
        }

        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        const { playerState } = window;
        playerState.lineup.forEach((key) => {
            const teacher = playerState.teachers[key];
            const scoreboard = new Combatant(
                {
                    id: key,
                    ...Teachers[teacher.teacherId],
                    ...teacher,
                },
                null
            );
            scoreboard.createElement();
            this.scoreboards.push(scoreboard);
            this.element.appendChild(scoreboard.hudElement);
        });
        this.update();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        document.addEventListener("PlayerStateUpdated", () => {
            this.update();
        });

        document.addEventListener("LineupChanged", () => {
            this.createElement();
            container.appendChild(this.element);
        });
    }
}
