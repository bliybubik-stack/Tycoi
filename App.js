const canvas =
    document.getElementById(
        "gameCanvas"
    );

const engine =
    new FactoryEngine(
        canvas
    );


let currentCategory =
    "conveyor";

let selectedDefinition =
    null;


/* =========================
   OBJECT LIST
========================= */

function renderObjects() {

    const list =
        document.getElementById(
            "objectList"
        );

    list.innerHTML = "";

    const objects =
        OBJECTS.filter(
            o =>
                o.category ===
                currentCategory
        );

    objects.forEach(
        object => {

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "object-card";

            card.innerHTML = `

                <div class="object-preview">
                    ${object.icon}
                </div>

                <div class="object-info">

                    <div class="object-name">
                        ${object.name}
                    </div>

                    <div class="object-desc">
                        $${formatNumber(object.cost)}
                        ·
                        ${object.description}
                    </div>

                </div>
            `;


            card.addEventListener(
                "click",
                () => {

                    selectedDefinition =
                        object;

                    engine.selectedObject =
                        object;

                    document
                        .querySelectorAll(
                            ".object-card"
                        )
                        .forEach(
                            c =>
                                c.classList.remove(
                                    "selected"
                                )
                        );

                    card.classList.add(
                        "selected"
                    );

                }
            );


            list.appendChild(
                card
            );
        }
    );
}


renderObjects();


/* =========================
   CATEGORY TABS
========================= */

document
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    currentCategory =
                        tab.dataset.category;

                    document
                        .querySelectorAll(
                            ".tab"
                        )
                        .forEach(
                            t =>
                                t.classList.remove(
                                    "active"
                                )
                        );

                    tab.classList.add(
                        "active"
                    );

                    renderObjects();
                }
            );
        }
    );


/* =========================
   MOUSE POSITION
========================= */

canvas.addEventListener(
    "mousemove",
    e => {

        engine.lastMouseWorld =
            engine.screenToWorld(
                e.clientX,
                e.clientY
            );
    }
);


/* =========================
   SELECTED OBJECT
========================= */

window.addEventListener(
    "factorySelect",
    e => {

        engine.selectedObject =
            e.detail;

        showInspector(
            e.detail
        );
    }
);


function showInspector(object) {

    const panel =
        document.getElementById(
            "inspectorContent"
        );

    const d =
        object.data;

    panel.innerHTML = `

        <div class="inspector-title">
            ${d.name}
        </div>

        <div class="inspector-type">
            ${d.category.toUpperCase()}
        </div>

        <div class="inspector-row">
            <span>TYPE</span>
            <span>${d.type}</span>
        </div>

        <div class="inspector-row">
            <span>COST</span>
            <span>$${formatNumber(d.cost)}</span>
        </div>

        ${
            d.multiplier
            ? `
                <div class="inspector-row">
                    <span>MULTIPLIER</span>
                    <span>${d.multiplier}×</span>
                </div>
            `
            : ""
        }

        ${
            d.speed
            ? `
                <div class="inspector-row">
                    <span>SPEED</span>
                    <span>${d.speed}×</span>
                </div>
            `
            : ""
        }

        ${
            d.interval
            ? `
                <div class="inspector-row">
                    <span>INTERVAL</span>
                    <span>${d.interval}s</span>
                </div>
            `
            : ""
        }

        <div class="inspector-row">
            <span>POSITION</span>
            <span>
                ${object.x},
                ${object.y}
            </span>
        </div>

        <button
            class="delete-object"
            id="deleteSelected"
        >
            DELETE OBJECT
        </button>
    `;


    document
        .getElementById(
            "deleteSelected"
        )
        .onclick =
        () => {

            const index =
                engine.objects.indexOf(
                    object
                );

            if(index !== -1) {

                engine.money +=
                    Math.floor(
                        object.data.cost *
                        .5
                    );

                engine.objects.splice(
                    index,
                    1
                );
            }

            engine.selectedObject =
                null;

            resetInspector();
        };
}


function resetInspector() {

    document
        .getElementById(
            "inspectorContent"
        )
        .innerHTML = `

        <div class="empty-inspector">

            <div class="empty-icon">
                ＋
            </div>

            <div>
                SELECT AN OBJECT
            </div>

            <small>
                Click something inside your factory
            </small>

        </div>
    `;
}


/* =========================
   PLAY / PAUSE
========================= */

document
    .getElementById(
        "playButton"
    )
    .onclick =
    () => {

        engine.running =
            true;

        document
            .getElementById(
                "playButton"
            )
            .classList.add(
                "active"
            );

        document
            .getElementById(
                "pauseButton"
            )
            .classList.remove(
                "active"
            );
    };


document
    .getElementById(
        "pauseButton"
    )
    .onclick =
    () => {

        engine.running =
            false;

        document
            .getElementById(
                "pauseButton"
            )
            .classList.add(
                "active"
            );

        document
            .getElementById(
                "playButton"
            )
            .classList.remove(
                "active"
            );
    };


/* =========================
   CLEAR FACTORY
========================= */

document
    .getElementById(
        "clearButton"
    )
    .onclick =
    () => {

        if(
            !confirm(
                "Clear this floor?"
            )
        ) return;

        engine.objects = [];

        engine.items = [];

        resetInspector();
    };


/* =========================
   FLOORS
========================= */

let currentFloor = 1;

const floors = {

    1: [],

    2: [],

    3: [],

    4: [],

    5: []
};


function saveFloor() {

    floors[currentFloor] =
        JSON.parse(
            JSON.stringify(
                engine.objects.map(
                    o => ({
                        id:o.id,
                        x:o.x,
                        y:o.y,
                        rotation:o.rotation
                    })
                )
            )
        );
}


function loadFloor(number) {

    saveFloor();

    currentFloor =
        Math.max(
            1,
            number
        );

    engine.objects = [];

    const saved =
        floors[currentFloor] || [];

    saved.forEach(
        savedObject => {

            const data =
                OBJECTS.find(
                    o =>
                        o.id ===
                        savedObject.id
                );

            if(!data) return;

            engine.objects.push({

                uid:
                    crypto.randomUUID(),

                id:
                    data.id,

                x:
                    savedObject.x,

                y:
                    savedObject.y,

                rotation:
                    savedObject.rotation,

                data
            });
        }
    );

    updateFloorUI();
}


document
    .getElementById(
        "previousFloor"
    )
    .onclick =
    () => {

        if(currentFloor > 1)
            loadFloor(
                currentFloor - 1
            );
    };


document
    .getElementById(
        "nextFloor"
    )
    .onclick =
    () => {

        loadFloor(
            currentFloor + 1
        );
    };


function updateFloorUI() {

    const number =
        String(
            currentFloor
        ).padStart(
            2,
            "0"
        );

    document
        .getElementById(
            "floorDisplay"
        )
        .textContent =
        number;

    document
        .getElementById(
            "floorNumber"
        )
        .textContent =
        number;
}


updateFloorUI();


/* =========================
   STATS
========================= */

window.addEventListener(
    "factoryTick",
    e => {

        document
            .getElementById(
                "money"
            )
            .textContent =
            "$" +
            formatNumber(
                e.detail.money
            );

        document
            .getElementById(
                "production"
            )
            .textContent =
            formatNumber(
                e.detail.production
            ) +
            "/s";
    }
);


/* =========================
   NUMBER FORMAT
========================= */

function formatNumber(number) {

    if(
        !Number.isFinite(
            number
        )
    ) return "∞";

    if(
        Math.abs(number) < 1000
    ) {

        return Math.floor(
            number
        ).toString();
    }

    const suffixes = [
        "K",
        "M",
        "B",
        "T",
        "Qa",
        "Qi",
        "Sx",
        "Sp",
        "Oc",
        "No",
        "Dc"
    ];

    let index = -1;

    while(
        Math.abs(number) >= 1000 &&
        index <
        suffixes.length - 1
    ) {

        number /= 1000;

        index++;
    }

    return (
        number.toFixed(
            number < 10
            ? 2
            : 1
        )
        +
        suffixes[index]
    );
}


/* =========================
   KEYBOARD
========================= */

window.addEventListener(
    "keydown",
    e => {

        if(e.key === "Escape") {

            selectedDefinition =
                null;

            engine.selectedObject =
                null;

            document
                .querySelectorAll(
                    ".object-card"
                )
                .forEach(
                    c =>
                        c.classList.remove(
                            "selected"
                        )
                );
        }


        if(
            e.key === "Delete" &&
            engine.selectedObject &&
            engine.selectedObject.uid
        ) {

            const index =
                engine.objects.indexOf(
                    engine.selectedObject
                );

            if(index !== -1) {

                engine.money +=
                    Math.floor(
                        engine
                            .objects[index]
                            .data
                            .cost *
                        .5
                    );

                engine.objects.splice(
                    index,
                    1
                );
            }

            engine.selectedObject =
                null;

            resetInspector();
        }
    }
);
