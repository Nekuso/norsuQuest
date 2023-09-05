class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = {}; // Live objects are in here
        this.configObjects = config.configObjects; // Configuration content

        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
        this.isPaused = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        if (this.walls[`${x},${y}`]) {
            return true;
        }
        //Check for game objects at this position
        return Object.values(this.gameObjects).find((obj) => {
            if (obj.x === x && obj.y === y) {
                return true;
            }
            if (
                obj.intentPosition &&
                obj.intentPosition[0] === x &&
                obj.intentPosition[1] === y
            ) {
                return true;
            }
            return false;
        });
    }

    mountObjects() {
        Object.keys(this.configObjects).forEach((key) => {
            let object = this.configObjects[key];
            object.id = key;

            let instance;
            if (object.type === "Person") {
                instance = new Person(object);
            }
            if (object.type === "TeacherStone") {
                instance = new TeacherStone(object);
            }
            this.gameObjects[key] = instance;
            this.gameObjects[key].id = key;
            instance.mount(this);
        });
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            });
            const result = await eventHandler.init();
            if (result === "LOST_BATTLE") {
                break;
            }
        }
        this.isCutscenePlaying = false;
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find((object) => {
            return (
                `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
            );
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            const relevantScenario = match.talking.find((scenario) => {
                return (scenario.required || []).every((sf) => {
                    return playerState.storyFlags[sf];
                });
            });
            relevantScenario && this.startCutscene(relevantScenario.events);
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
    }
}

window.OverworldMaps = {
    HomeRoom: {
        id: "HomeRoom",
        lowerSrc: "/images/maps/HomeLower.png",
        upperSrc: "/images/maps/HomeUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            },
            mom: {
                type: "Person",
                x: utils.withGrid(4),
                y: utils.withGrid(8),
                src: "/images/characters/people/mom.png",
                behaviorLoop: [
                    { type: "walk", direction: "left", time: 4000 },
                    { type: "stand", direction: "up", time: 2000 },
                    { type: "walk", direction: "right", time: 3200 },
                    { type: "stand", direction: "right", time: 3300 },
                ],
                talking: [
                    {
                        required: ["TALKED_TO_DAD"],

                        events: [
                            {
                                type: "textMessage",
                                text: "Dont forget your ID anak naa sa imong computer.",
                                faceHero: "mom",
                            },
                        ],
                    },
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Panghid sa ni Papa nimo para motor.",
                                faceHero: "mom",
                            },
                        ],
                    },
                ],
            },
            dad: {
                type: "Person",
                x: utils.withGrid(3),
                y: utils.withGrid(4),
                src: "/images/characters/people/dad.png",
                behaviorLoop: [{ type: "stand", direction: "up", time: 2000 }],
                talking: [
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Adto pangayo mama nimo pang plite.",
                            },
                            {
                                type: "addStoryFlag",
                                flag: "TALKED_TO_DAD",
                            },
                        ],
                    },
                ],
            },
            teacherStone: {
                type: "TeacherStone",
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                storyFlag: "USED_TEACHER_STONE",
                teachers: ["m001", "c001"],
            },
        },
        walls: {
            [utils.asGridCoord(0, 1)]: true,
            [utils.asGridCoord(0, 2)]: true,
            [utils.asGridCoord(0, 3)]: true,
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(0, 5)]: true,
            [utils.asGridCoord(0, 6)]: true,
            [utils.asGridCoord(0, 7)]: true,
            [utils.asGridCoord(0, 8)]: true,
            [utils.asGridCoord(0, 9)]: true,
            [utils.asGridCoord(1, 9)]: true,
            [utils.asGridCoord(2, 9)]: true,
            [utils.asGridCoord(3, 9)]: true,
            [utils.asGridCoord(4, 9)]: true,
            [utils.asGridCoord(4, 10)]: true,
            [utils.asGridCoord(5, 11)]: true,
            [utils.asGridCoord(6, 10)]: true,
            [utils.asGridCoord(7, 10)]: true,
            [utils.asGridCoord(8, 9)]: true,
            [utils.asGridCoord(9, 9)]: true,
            [utils.asGridCoord(10, 9)]: true,
            [utils.asGridCoord(11, 8)]: true,
            [utils.asGridCoord(10, 7)]: true,
            [utils.asGridCoord(11, 6)]: true,
            [utils.asGridCoord(10, 5)]: true,
            [utils.asGridCoord(9, 5)]: true,
            [utils.asGridCoord(8, 4)]: true,
            [utils.asGridCoord(7, 4)]: true,
            [utils.asGridCoord(6, 5)]: true,
            [utils.asGridCoord(6, 6)]: true,
            [utils.asGridCoord(6, 7)]: true,
            [utils.asGridCoord(7, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
            [utils.asGridCoord(8, 7)]: true,
            [utils.asGridCoord(5, 5)]: true,
            [utils.asGridCoord(5, 4)]: true,
            [utils.asGridCoord(5, 3)]: true,
            [utils.asGridCoord(4, 3)]: true,
            [utils.asGridCoord(3, 3)]: true,
            [utils.asGridCoord(2, 3)]: true,
            [utils.asGridCoord(1, 3)]: true,
            [utils.asGridCoord(1, 5)]: true,
            [utils.asGridCoord(1, 6)]: true,
            [utils.asGridCoord(2, 6)]: true,
            [utils.asGridCoord(4, 6)]: true,
            [utils.asGridCoord(4, 5)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 9)]: [
                {
                    events: [
                        {
                            type: "textMessage",
                            text: "**I have to pass so I can do my internship**",
                        },
                    ],
                },
            ],
            [utils.asGridCoord(8, 5)]: [
                {
                    events: [
                        { type: "textMessage", text: "ID Found" },
                        {
                            type: "addStoryFlag",
                            flag: "HAS_ID",
                        },
                    ],
                },
            ],
            [utils.asGridCoord(5, 10)]: [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "Outside",
                            x: utils.withGrid(5),
                            y: utils.withGrid(13),
                            direction: "right",
                        },
                    ],
                },
            ],
        },
    },

    Outside: {
        id: "Outside",
        lowerSrc: "/images/maps/OutsideLower.png",
        upperSrc: "/images/maps/OutsideUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(13),
                // x: utils.withGrid(23),
                // y: utils.withGrid(8),
            },
            npc1: {
                type: "Person",
                x: utils.withGrid(27),
                y: utils.withGrid(8),
                src: "/images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 3000 },
                    { type: "stand", direction: "up", time: 3000 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 2100 },
                ],
                talking: [
                    {
                        required: ["DEFEATED_NPC2"],
                        events: [
                            {
                                type: "textMessage",
                                text: "Ugma rako bayad kay nabilin ako wallet sa balay.",
                                faceHero: "npc1",
                            },
                        ],
                    },
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Hatagan tikaw ug 1000 pesos. Basta mapildi nimo tung upaw duol sa gaurd.",
                                faceHero: "npc1",
                            },
                        ],
                    },
                ],
            },
            npc2: {
                type: "Person",
                x: utils.withGrid(15),
                y: utils.withGrid(6),
                src: "/images/characters/people/npc2.png",
                behaviorLoop: [
                    { type: "walk", direction: "down" },
                    { type: "walk", direction: "down" },
                    { type: "stand", direction: "left", time: 6000 },
                    { type: "stand", direction: "up", time: 6000 },
                    { type: "stand", direction: "down", time: 6000 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "up" },
                    { type: "stand", direction: "right", time: 6000 },
                    { type: "stand", direction: "down", time: 6000 },
                    { type: "stand", direction: "up", time: 6000 },
                ],
                talking: [
                    {
                        required: ["DEFEATED_NPC2"],
                        events: [
                            {
                                type: "textMessage",
                                text: "Dili nako mu sukol",
                                faceHero: "npc2",
                            },
                        ],
                    },
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Kaingon kag nahadlok ko nimo?!",
                                faceHero: "npc2",
                            },
                            { type: "battle", enemyId: "npc2" },
                            {
                                type: "addStoryFlag",
                                flag: "DEFEATED_NPC2",
                            },
                            {
                                type: "textMessage",
                                text: "Di nako mu sukol",
                                faceHero: "npc2",
                            },
                        ],
                    },
                ],
            },
            npc3: {
                type: "Person",
                x: utils.withGrid(18),
                y: utils.withGrid(15),
                src: "/images/characters/people/npc3.png",
                behaviorLoop: [
                    { type: "stand", direction: "up", time: 6000 },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "down" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "up" },
                ],
                talking: [
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Dili ko kasulod kay nabilin ako Id sa balay",
                                faceHero: "npc3",
                            },
                        ],
                    },
                ],
            },
            npc4: {
                type: "Person",
                x: utils.withGrid(22),
                y: utils.withGrid(5),
                src: "/images/characters/people/npc4.png",
                behaviorLoop: [
                    { type: "stand", direction: "down", time: 2100 },
                    { type: "stand", direction: "left", time: 5000 },
                    { type: "stand", direction: "up", time: 6000 },
                    { type: "stand", direction: "right", time: 200 },
                ],
                talking: [
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "amboutooocoooom",
                                faceHero: "npc4",
                            },
                            { type: "battle", enemyId: "npc4" },
                        ],
                    },
                ],
            },
            guard: {
                type: "Person",
                x: utils.withGrid(18),
                y: utils.withGrid(10),
                src: "/images/characters/people/guard.png",

                talking: [
                    {
                        required: ["HAS_TALKED_TO_GUARD"],
                        events: [
                            { who: "guard", type: "stand", direction: "down" },
                            {
                                type: "textMessage",
                                text: "Kaingon kag nahadlok ko nimo?!",
                                faceHero: "guard",
                            },
                            { type: "battle", enemyId: "guard" },
                            { who: "guard", type: "walk", direction: "up" },
                            { who: "guard", type: "stand", direction: "down" },
                        ],
                    },
                    {
                        required: ["HAS_ID"],
                        events: [
                            { who: "guard", type: "stand", direction: "down" },
                            {
                                type: "textMessage",
                                text: "Bag nimo dong",
                            },
                            { who: "guard", type: "walk", direction: "up" },
                            { who: "guard", type: "stand", direction: "down" },
                            {
                                type: "addStoryFlag",
                                flag: "HAS_TALKED_TO_GUARD",
                            },
                        ],
                    },
                    {
                        events: [
                            {
                                type: "textMessage",
                                text: "Asa man ka migo? Wala kay Id",
                            },
                            { who: "hero", type: "walk", direction: "down" },
                        ],
                    },
                ],
            },
        },
        walls: {
            // Outer walls
            [utils.asGridCoord(2, 13)]: true,
            [utils.asGridCoord(3, 13)]: true,
            [utils.asGridCoord(3, 14)]: true,
            [utils.asGridCoord(3, 15)]: true,
            [utils.asGridCoord(3, 16)]: true,
            [utils.asGridCoord(3, 18)]: true,
            [utils.asGridCoord(4, 17)]: true,
            [utils.asGridCoord(5, 17)]: true,
            [utils.asGridCoord(6, 17)]: true,
            [utils.asGridCoord(7, 17)]: true,
            [utils.asGridCoord(8, 18)]: true,
            [utils.asGridCoord(9, 18)]: true,
            [utils.asGridCoord(10, 18)]: true,
            [utils.asGridCoord(11, 18)]: true,
            [utils.asGridCoord(12, 18)]: true,
            [utils.asGridCoord(13, 18)]: true,
            [utils.asGridCoord(14, 17)]: true,
            [utils.asGridCoord(15, 17)]: true,
            [utils.asGridCoord(16, 18)]: true,
            [utils.asGridCoord(17, 18)]: true,
            [utils.asGridCoord(18, 18)]: true,
            [utils.asGridCoord(19, 18)]: true,
            [utils.asGridCoord(20, 18)]: true,
            [utils.asGridCoord(21, 18)]: true,
            [utils.asGridCoord(22, 18)]: true,
            [utils.asGridCoord(23, 17)]: true,
            [utils.asGridCoord(24, 17)]: true,
            [utils.asGridCoord(25, 18)]: true,
            [utils.asGridCoord(25, 11)]: true,
            [utils.asGridCoord(26, 18)]: true,
            [utils.asGridCoord(27, 18)]: true,
            [utils.asGridCoord(28, 18)]: true,
            [utils.asGridCoord(29, 18)]: true,
            [utils.asGridCoord(30, 18)]: true,
            [utils.asGridCoord(31, 18)]: true,
            [utils.asGridCoord(32, 18)]: true,
            [utils.asGridCoord(33, 18)]: true,
            [utils.asGridCoord(34, 17)]: true,
            [utils.asGridCoord(34, 16)]: true,
            [utils.asGridCoord(33, 16)]: true,
            [utils.asGridCoord(32, 16)]: true,
            [utils.asGridCoord(34, 15)]: true,
            [utils.asGridCoord(34, 14)]: true,
            [utils.asGridCoord(34, 13)]: true,
            [utils.asGridCoord(34, 12)]: true,
            [utils.asGridCoord(34, 11)]: true,
            [utils.asGridCoord(34, 10)]: true,
            [utils.asGridCoord(34, 9)]: true,
            [utils.asGridCoord(34, 8)]: true,
            [utils.asGridCoord(34, 7)]: true,
            [utils.asGridCoord(34, 6)]: true,
            [utils.asGridCoord(34, 5)]: true,
            [utils.asGridCoord(34, 4)]: true,
            [utils.asGridCoord(34, 3)]: true,
            [utils.asGridCoord(34, 2)]: true,
            [utils.asGridCoord(33, 1)]: true,
            [utils.asGridCoord(32, 1)]: true,
            [utils.asGridCoord(31, 1)]: true,
            [utils.asGridCoord(30, 1)]: true,
            [utils.asGridCoord(29, 1)]: true,
            [utils.asGridCoord(28, 1)]: true,
            [utils.asGridCoord(27, 1)]: true,
            [utils.asGridCoord(26, 1)]: true,
            [utils.asGridCoord(25, 1)]: true,
            [utils.asGridCoord(24, 1)]: true,
            [utils.asGridCoord(23, 1)]: true,
            [utils.asGridCoord(22, 1)]: true,
            [utils.asGridCoord(21, 1)]: true,
            [utils.asGridCoord(19, 1)]: true,
            [utils.asGridCoord(18, 1)]: true,
            [utils.asGridCoord(17, 1)]: true,
            [utils.asGridCoord(16, 1)]: true,
            [utils.asGridCoord(15, 1)]: true,
            [utils.asGridCoord(14, 1)]: true,
            [utils.asGridCoord(13, 1)]: true,
            [utils.asGridCoord(12, 1)]: true,
            [utils.asGridCoord(11, 1)]: true,
            [utils.asGridCoord(10, 1)]: true,
            [utils.asGridCoord(9, 1)]: true,
            [utils.asGridCoord(8, 1)]: true,
            [utils.asGridCoord(7, 1)]: true,
            [utils.asGridCoord(6, 1)]: true,
            [utils.asGridCoord(5, 1)]: true,
            [utils.asGridCoord(4, 1)]: true,
            [utils.asGridCoord(3, 2)]: true,
            [utils.asGridCoord(3, 3)]: true,
            [utils.asGridCoord(3, 4)]: true,
            [utils.asGridCoord(3, 5)]: true,
            [utils.asGridCoord(3, 6)]: true,
            [utils.asGridCoord(3, 7)]: true,
            [utils.asGridCoord(3, 8)]: true,
            [utils.asGridCoord(3, 9)]: true,
            [utils.asGridCoord(3, 10)]: true,
            [utils.asGridCoord(3, 11)]: true,
            [utils.asGridCoord(3, 12)]: true,

            // fences
            [utils.asGridCoord(13, 14)]: true,
            [utils.asGridCoord(14, 14)]: true,
            [utils.asGridCoord(15, 14)]: true,
            [utils.asGridCoord(16, 14)]: true,
            [utils.asGridCoord(17, 14)]: true,
            [utils.asGridCoord(18, 14)]: true,
            [utils.asGridCoord(19, 14)]: true,
            [utils.asGridCoord(20, 14)]: true,
            [utils.asGridCoord(21, 14)]: true,
            [utils.asGridCoord(23, 14)]: true,
            [utils.asGridCoord(24, 14)]: true,
            [utils.asGridCoord(25, 14)]: true,
            [utils.asGridCoord(26, 14)]: true,
            [utils.asGridCoord(27, 14)]: true,
            [utils.asGridCoord(28, 14)]: true,
            [utils.asGridCoord(29, 14)]: true,
            [utils.asGridCoord(30, 14)]: true,
            [utils.asGridCoord(31, 14)]: true,
            [utils.asGridCoord(32, 14)]: true,
            [utils.asGridCoord(33, 14)]: true,

            // Walls
            [utils.asGridCoord(4, 12)]: true,
            [utils.asGridCoord(5, 12)]: true,
            [utils.asGridCoord(6, 12)]: true,
            [utils.asGridCoord(7, 12)]: true,
            [utils.asGridCoord(8, 12)]: true,
            [utils.asGridCoord(9, 12)]: true,
            [utils.asGridCoord(10, 12)]: true,
            [utils.asGridCoord(11, 12)]: true,
            [utils.asGridCoord(12, 12)]: true,
            [utils.asGridCoord(13, 12)]: true,
            [utils.asGridCoord(14, 12)]: true,
            [utils.asGridCoord(15, 12)]: true,
            [utils.asGridCoord(16, 12)]: true,
            [utils.asGridCoord(16, 11)]: true,
            [utils.asGridCoord(17, 11)]: true,
            [utils.asGridCoord(19, 11)]: true,
            [utils.asGridCoord(20, 11)]: true,
            [utils.asGridCoord(21, 11)]: true,
            [utils.asGridCoord(22, 11)]: true,
            [utils.asGridCoord(23, 11)]: true,
            [utils.asGridCoord(24, 11)]: true,
            [utils.asGridCoord(26, 11)]: true,
            [utils.asGridCoord(27, 11)]: true,
            [utils.asGridCoord(27, 12)]: true,
            [utils.asGridCoord(28, 12)]: true,
            [utils.asGridCoord(29, 12)]: true,
            [utils.asGridCoord(30, 12)]: true,
            [utils.asGridCoord(31, 12)]: true,
            [utils.asGridCoord(32, 12)]: true,
            [utils.asGridCoord(33, 12)]: true,

            // Buildings
            [utils.asGridCoord(17, 10)]: true,
            [utils.asGridCoord(17, 9)]: true,
            [utils.asGridCoord(16, 9)]: true,
            [utils.asGridCoord(15, 9)]: true,
            [utils.asGridCoord(14, 8)]: true,
            [utils.asGridCoord(14, 9)]: true,
            [utils.asGridCoord(13, 9)]: true,
            [utils.asGridCoord(12, 9)]: true,
            [utils.asGridCoord(11, 9)]: true,
            [utils.asGridCoord(10, 9)]: true,
            [utils.asGridCoord(9, 9)]: true,
            [utils.asGridCoord(8, 9)]: true,
            [utils.asGridCoord(7, 9)]: true,
            [utils.asGridCoord(6, 9)]: true,
            [utils.asGridCoord(5, 9)]: true,
            [utils.asGridCoord(4, 9)]: true,
            [utils.asGridCoord(13, 7)]: true,
            [utils.asGridCoord(13, 6)]: true,
            [utils.asGridCoord(13, 5)]: true,
            [utils.asGridCoord(14, 4)]: true,
            [utils.asGridCoord(15, 4)]: true,
            [utils.asGridCoord(15, 5)]: true,
            [utils.asGridCoord(16, 3)]: true,
            [utils.asGridCoord(17, 3)]: true,
            [utils.asGridCoord(18, 3)]: true,
            [utils.asGridCoord(19, 3)]: true,
            [utils.asGridCoord(20, 3)]: true,
            [utils.asGridCoord(21, 3)]: true,
            [utils.asGridCoord(22, 3)]: true,
            [utils.asGridCoord(23, 3)]: true,
            [utils.asGridCoord(24, 3)]: true,
            [utils.asGridCoord(25, 3)]: true,
            [utils.asGridCoord(26, 3)]: true,
            [utils.asGridCoord(27, 3)]: true,
            [utils.asGridCoord(28, 3)]: true,
            [utils.asGridCoord(28, 4)]: true,
            [utils.asGridCoord(29, 2)]: true,
            [utils.asGridCoord(30, 2)]: true,
            [utils.asGridCoord(31, 2)]: true,
            [utils.asGridCoord(31, 3)]: true,
            [utils.asGridCoord(31, 4)]: true,
            [utils.asGridCoord(32, 2)]: true,
            [utils.asGridCoord(32, 3)]: true,
            [utils.asGridCoord(32, 4)]: true,
            [utils.asGridCoord(27, 5)]: true,
            [utils.asGridCoord(26, 4)]: true,
            [utils.asGridCoord(25, 4)]: true,
            [utils.asGridCoord(24, 6)]: true,
            [utils.asGridCoord(24, 6)]: true,
            [utils.asGridCoord(23, 6)]: true,
            [utils.asGridCoord(22, 6)]: true,
            [utils.asGridCoord(21, 6)]: true,
            [utils.asGridCoord(20, 6)]: true,
            [utils.asGridCoord(19, 6)]: true,
            [utils.asGridCoord(18, 4)]: true,
            [utils.asGridCoord(17, 4)]: true,
            [utils.asGridCoord(16, 5)]: true,
            [utils.asGridCoord(33, 9)]: true,
            [utils.asGridCoord(32, 9)]: true,
            [utils.asGridCoord(31, 9)]: true,
            [utils.asGridCoord(30, 9)]: true,
            [utils.asGridCoord(29, 9)]: true,
            [utils.asGridCoord(28, 9)]: true,
            [utils.asGridCoord(27, 9)]: true,
            [utils.asGridCoord(26, 9)]: true,
            [utils.asGridCoord(26, 10)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(33, 2)]: [
                {
                    events: [
                        {
                            type: "textMessage",
                            text: "You have to have teacher with level 15 to enter",
                        },
                        { who: "hero", type: "walk", direction: "down" },
                    ],
                },
            ],
            [utils.asGridCoord(14, 5)]: [
                {
                    events: [
                        {
                            type: "textMessage",
                            text: "You have to have teacher with level 15 to enter",
                        },
                        { who: "hero", type: "walk", direction: "down" },
                    ],
                },
            ],
            [utils.asGridCoord(4, 13)]: [
                {
                    events: [
                        {
                            type: "changeMap",
                            map: "HomeRoom",
                            x: utils.withGrid(5),
                            y: utils.withGrid(10),
                            direction: "up",
                        },
                    ],
                },
            ],
        },
    },
};
