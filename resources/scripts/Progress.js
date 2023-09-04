class Progress {
    constructor() {
        this.mapId = "HomeRoom";
        this.startingHeroX = 0;
        this.startingHeroY = 0;
        this.startingHeroDirection = "down";
        this.saveFileKey = "NorsuQuest_SaveFile1";
    }

    save() {
        var loggedUser = document
            .getElementById("logged-user")
            .getAttribute("data-user");

        const data = {
            loggedUser: loggedUser,
            mapId: this.mapId,
            startingHeroX: this.startingHeroX,
            startingHeroY: this.startingHeroY,
            startingHeroDirection: this.startingHeroDirection,
            playerState: {
                teachers: playerState.teachers,
                lineup: playerState.lineup,
                items: playerState.items,
                storyFlags: playerState.storyFlags,
            },
        };

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "{{ route('save') }}");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader(
            "X-CSRF-TOKEN",
            document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content")
        );
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log("Data saved successfully.");
            } else {
                console.error("Failed to save data.");
            }
        };
        xhr.send(JSON.stringify({ data: data }));

        window.localStorage.setItem(
            this.saveFileKey,
            JSON.stringify({
                loggedUser: loggedUser,
                mapId: this.mapId,
                startingHeroX: this.startingHeroX,
                startingHeroY: this.startingHeroY,
                startingHeroDirection: this.startingHeroDirection,
                playerState: {
                    teachers: playerState.teachers,
                    lineup: playerState.lineup,
                    items: playerState.items,
                    storyFlags: playerState.storyFlags,
                },
            })
        );
    }

    getSaveFile() {
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null;
    }
    deleteSaveFile() {
        window.localStorage.removeItem(this.saveFileKey);
    }

    load() {
        const file = this.getSaveFile();
        if (file) {
            this.mapId = file.mapId;
            this.startingHeroX = file.startingHeroX;
            this.startingHeroY = file.startingHeroY;
            this.startingHeroDirection = file.startingHeroDirection;
            Object.keys(file.playerState).forEach((key) => {
                playerState[key] = file.playerState[key];
            });
        }
    }
}