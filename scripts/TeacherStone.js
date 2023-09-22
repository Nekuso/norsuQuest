class TeacherStone extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "resources/images/characters/teacher-stone.png",
            animations: {
                "used-down": [[0, 0]],
                "unused-down": [[1, 0]],
            },
            currentAnimation: "used-down",
        });
        this.storyFlag = config.storyFlag;
        this.teachers = config.teachers;

        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    {
                        type: "textMessage",
                        text: "You have already used this.",
                    },
                ],
            },
            {
                events: [
                    {
                        type: "textMessage",
                        text: "Contacting teacher about INC...",
                    },
                    { type: "craftingMenu", teachers: this.teachers },
                    { type: "addStoryFlag", flag: this.storyFlag },
                ],
            },
        ];
    }

    update() {
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
            ? "used-down"
            : "unused-down";
    }
}
