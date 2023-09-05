window.Actions = {
    // Attacks
    bonk: {
        name: "Bonk!",
        description: "Bonk the enemy with a book",
        success: [
            { type: "textMessage", text: "{CASTER} used {ACTION}!" },
            { type: "animation", animation: "spin" },
            { type: "stateChange", damage: 10 },
        ],
    },

    // Stats Attack
    // regen
    regen: {
        name: "Mineral Water",
        description: "Drinks mineral water to recover HP",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} drinked {ACTION}!" },
            { type: "stateChange", status: { type: "regen", expiresIn: 4 } },
        ],
    },

    teachLaravel: {
        name: "Teaches Laravel",
        description: "Teaches Laravel to the enemy",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION}!" },
            { type: "animation", animation: "glob", color: "skyblue" },
            {
                type: "stateChange",
                status: { type: "confusion", expiresIn: 3 },
            },
            {
                type: "textMessage",
                text: "{TARGET} is confused and having brain farts!",
            },
        ],
    },

    teachLinear: {
        name: "Teaches Linear Equation",
        description: "Teaches Linear Equation to the enemy",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION}!" },
            { type: "animation", animation: "glob", color: "skyblue" },
            {
                type: "stateChange",
                status: { type: "confusion", expiresIn: 5 },
            },
            {
                type: "textMessage",
                text: "{TARGET} is confused and having brain farts!",
            },
        ],
    },

    nWord: {
        name: "Uses the N word",
        description: "Uses the N word to the enemy",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION}!" },
            { type: "animation", animation: "glob", color: "skyblue" },
            {
                type: "stateChange",
                status: { type: "confusion", expiresIn: 5 },
            },
            {
                type: "textMessage",
                text: "{TARGET} is confused!",
            },
        ],
    },

    // confusion
    teachPHP: {
        name: "Teach PHP",
        description: "Teaches PHP to the enemy",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION}!" },
            { type: "animation", animation: "glob", color: "skyblue" },
            {
                type: "stateChange",
                status: { type: "confusion", expiresIn: 3 },
            },
            {
                type: "textMessage",
                text: "{TARGET} is confused and having brain farts!",
            },
        ],
    },

    teachMath: {
        name: "Teach Linear equation",
        description: "Teaches Linear equation to the enemy",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION}!" },
            { type: "animation", animation: "glob", color: "skyblue" },
            {
                type: "stateChange",
                status: { type: "confusion", expiresIn: 4 },
            },
            {
                type: "textMessage",
                text: "{TARGET} is confused and having brain farts!",
            },
        ],
    },

    //Items
    item_clearStatus: {
        name: "Machiato",
        description: "Drinks Machiato to clear status effects",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} drinks {ACTION}!" },
            { type: "stateChange", status: null },
            { type: "textMessage", text: "Refreshiiiiiing!" },
        ],
    },

    item_regenHp: {
        name: "Burger",
        description: "Eat Chili Cheese Burger With Egg to recover HP",
        targetType: "friendly",
        success: [
            {
                type: "textMessage",
                text: "{CASTER} eats Chili Cheese {ACTION} With Egg!",
            },
            { type: "stateChange", recover: 20 },
        ],
    },
};
