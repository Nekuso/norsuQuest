class PlayerState {
    constructor() {
        this.teachers = {
            t1: {
                teacherId: "i001",
                level: 1,
                xp: 0,
                hp: 50,
                maxHp: 50,
                maxXp: 100,
                status: null,
            },
        };
        this.lineup = ["t1"];
        this.items = [
            { actionId: "item_clearStatus", instanceId: "item1" },
            { actionId: "item_clearStatus", instanceId: "item1" },
            { actionId: "item_regenHp", instanceId: "item2" },
            { actionId: "item_regenHp", instanceId: "item3" },
        ];

        this.storyFlags = {
            // TALKED_TO_DAD: true,
        };
    }

    addTeacher(teacherId) {
        const newId = `p${Date.now()}` + Math.floor(Math.random() * 99999);
        this.teachers[newId] = {
            teacherId,
            hp: 50,
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level: 1,
            status: null,
        };
        if (this.lineup.length < 3) {
            this.lineup.push(newId);
        }
        utils.emitEvent("LineupChanged");
        console.log(this);
    }

    swapLineup(oldId, incomingId) {
        const oldIndex = this.lineup.indexOf(oldId);
        this.lineup[oldIndex] = incomingId;
        utils.emitEvent("LineupChanged");
    }

    moveToFront(futureFrontId) {
        this.lineup = this.lineup.filter((id) => id !== futureFrontId);
        this.lineup.unshift(futureFrontId);
        utils.emitEvent("LineupChanged");
    }
}
window.playerState = new PlayerState();
