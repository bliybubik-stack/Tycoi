/* ============================================================
   FACTORY GAME — APP.JS
   ============================================================ */

(() => {

    "use strict";


    /* ============================================================
       GLOBAL STATE
    ============================================================ */

    const state = {

        currentCategory: "all",

        selectedDefinition: null,

        selectedObject: null,

        currentFloor: 1,

        floors: {},

        floorNames: {},

        autoSave: true,

        sound: false,

        muted: true,

        uiOpen: true,

        draggingMenu: false,

        lastMoney: 0,

        lastProduction: 0,

        messageTimeout: null
    };


    /* ============================================================
       DOM
    ============================================================ */

    const $ = selector =>
        document.querySelector(selector);

    const $$ = selector =>
        [...document.querySelectorAll(selector)];


    const canvas =
        $("#gameCanvas") ||
        $("#canvas") ||
        document.querySelector("canvas");


    if (!canvas) {

        console.error(
            "Factory Engine: canvas not found."
        );

        return;
    }


    /* ============================================================
       ENGINE
    ============================================================ */

    const engine =
        window.engine ||
        new FactoryEngine(canvas);


    window.engine =
        engine;


    /* ============================================================
       HELPERS
    ============================================================ */

    function formatMoney(value) {

        value =
            Number(value) || 0;


        if(value >= 1e12)
            return (
                "$" +
                (value / 1e12).toFixed(2) +
                "T"
            );


        if(value >= 1e9)
            return (
                "$" +
                (value / 1e9).toFixed(2) +
                "B"
            );


        if(value >= 1e6)
            return (
                "$" +
                (value / 1e6).toFixed(2) +
                "M"
            );


        if(value >= 1e3)
            return (
                "$" +
                (value / 1e3).toFixed(2) +
                "K"
            );


        return (
            "$" +
            Math.floor(value)
        );
    }


    function formatNumber(value) {

        value =
            Number(value) || 0;


        if(value >= 1e12)
            return (
                (value / 1e12).toFixed(2) +
                "T"
            );


        if(value >= 1e9)
            return (
                (value / 1e9).toFixed(2) +
                "B"
            );


        if(value >= 1e6)
            return (
                (value / 1e6).toFixed(2) +
                "M"
            );


        if(value >= 1e3)
            return (
                (value / 1e3).toFixed(2) +
                "K"
            );


        return Math.floor(value);
    }


    function capitalize(text) {

        return String(text || "")
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                c => c.toUpperCase()
            );
    }


    function getObjectList() {

        if(
            typeof OBJECTS !==
            "undefined"
        ) {

            return OBJECTS;
        }


        if(
            Array.isArray(
                window.OBJECTS
            )
        ) {

            return window.OBJECTS;
        }


        return [];
    }


    function getCategories() {

        const objects =
            getObjectList();


        const categories = [
            "all"
        ];


        for(
            const object of objects
        ) {

            const category =
                object.category ||
                object.type ||
                "other";


            if(
                !categories.includes(
                    category
                )
            ) {

                categories.push(
                    category
                );
            }
        }


        return categories;
    }


    function getObjectCategory(
        object
    ) {

        return (
            object.category ||
            object.type ||
            "other"
        );
    }


    /* ============================================================
       OBJECT MENU
    ============================================================ */

    function renderObjectMenu() {

        const menu =
            $(
                "#objectList"
            ) ||
            $(
                "#objects"
            ) ||
            $(
                "#buildList"
            );


        if(!menu)
            return;


        const objects =
            getObjectList();


        const filtered =
            objects.filter(
                object => {

                    if(
                        state.currentCategory ===
                        "all"
                    ) {

                        return true;
                    }


                    return (
                        getObjectCategory(
                            object
                        ) ===
                        state.currentCategory
                    );
                }
            );


        menu.innerHTML = "";


        if(
            filtered.length === 0
        ) {

            menu.innerHTML = `
                <div class="p-4 text-xs text-neutral-500">
                    No objects here.
                </div>
            `;

            return;
        }


        for(
            const object of filtered
        ) {

            const card =
                document.createElement(
                    "button"
                );


            card.className = `
                object-card
                group
                w-full
                text-left
                p-3
                rounded-xl
                border
                border-neutral-800
                bg-neutral-950
                hover:bg-neutral-900
                hover:border-neutral-600
                transition
                duration-150
                select-none
            `;


            card.dataset.objectId =
                object.id;


            const cost =
                Number(
                    object.cost || 0
                );


            const selected =
                state.selectedDefinition &&
                state.selectedDefinition.id ===
                object.id;


            if(selected) {

                card.classList.add(
                    "selected",
                    "border-neutral-300"
                );
            }


            card.innerHTML = `

                <div class="flex items-center gap-3">

                    <div
                        class="
                            object-icon
                            w-10
                            h-10
                            shrink-0
                            rounded-lg
                            bg-neutral-900
                            border
                            border-neutral-800
                            flex
                            items-center
                            justify-center
                            text-lg
                        "
                    >
                        ${object.icon || "?"}
                    </div>


                    <div class="min-w-0 flex-1">

                        <div
                            class="
                                object-name
                                text-sm
                                font-semibold
                                text-neutral-200
                                truncate
                            "
                        >
                            ${
                                object.name ||
                                capitalize(object.id)
                            }
                        </div>


                        <div
                            class="
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-neutral-600
                                mt-0.5
                            "
                        >
                            ${
                                capitalize(
                                    getObjectCategory(
                                        object
                                    )
                                )
                            }
                        </div>

                    </div>


                    <div
                        class="
                            object-cost
                            text-xs
                            font-mono
                            text-neutral-400
                        "
                    >
                        ${formatMoney(cost)}
                    </div>

                </div>
            `;


            card.addEventListener(
                "click",
                () => {

                    selectBuildObject(
                        object
                    );
                }
            );


            menu.appendChild(
                card
            );
        }
    }


    /* ============================================================
       SELECT BUILD OBJECT
    ============================================================ */

    function selectBuildObject(
        object
    ) {

        if(!object)
            return;


        state.selectedDefinition =
            object;


        state.selectedObject =
            null;


        engine.setBuildObject(
            object
        );


        updateSelectedBuildUI();

        renderObjectMenu();

        closeInspector();


        showMessage(
            `${object.name || capitalize(object.id)} selected`
        );
    }


    function cancelBuild() {

        state.selectedDefinition =
            null;


        engine.cancelBuild();


        renderObjectMenu();

        updateSelectedBuildUI();
    }


    function updateSelectedBuildUI() {

        const label =
            $(
                "#selectedObject"
            ) ||
            $(
                "#selectedBuild"
            );


        if(!label)
            return;


        if(
            !state.selectedDefinition
        ) {

            label.textContent =
                "SELECT OBJECT";

            return;
        }


        label.textContent =
            state.selectedDefinition.name ||
            capitalize(
                state.selectedDefinition.id
            );
    }


    /* ============================================================
       CATEGORIES
    ============================================================ */

    function renderCategories() {

        const container =
            $(
                "#categories"
            ) ||
            $(
                "#categoryList"
            );


        if(!container)
            return;


        const categories =
            getCategories();


        container.innerHTML = "";


        for(
            const category of categories
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.className = `
                category-button
                px-3
                py-2
                rounded-lg
                text-xs
                uppercase
                tracking-widest
                whitespace-nowrap
                transition
            `;


            if(
                category ===
                state.currentCategory
            ) {

                button.classList.add(
                    "bg-neutral-100",
                    "text-neutral-950"
                );

            } else {

                button.classList.add(
                    "bg-neutral-900",
                    "text-neutral-500",
                    "hover:text-neutral-200"
                );
            }


            button.textContent =
                capitalize(
                    category
                );


            button.addEventListener(
                "click",
                () => {

                    state.currentCategory =
                        category;

                    renderCategories();

                    renderObjectMenu();
                }
            );


            container.appendChild(
                button
            );
        }
    }


    /* ============================================================
       SEARCH
    ============================================================ */

    function setupSearch() {

        const search =
            $(
                "#objectSearch"
            ) ||
            $(
                "#searchObjects"
            );


        if(!search)
            return;


        search.addEventListener(
            "input",
            () => {

                const query =
                    search.value
                        .trim()
                        .toLowerCase();


                $$(".object-card")
                    .forEach(
                        card => {

                            const id =
                                String(
                                    card.dataset.objectId ||
                                    ""
                                )
                                .toLowerCase();


                            const object =
                                getObjectList()
                                    .find(
                                        x =>
                                            x.id ===
                                            card.dataset.objectId
                                    );


                            const name =
                                String(
                                    object?.name ||
                                    ""
                                )
                                .toLowerCase();


                            card.style.display =
                                !query ||
                                id.includes(query) ||
                                name.includes(query)
                                    ? ""
                                    : "none";
                        }
                    );
            }
        );
    }


    /* ============================================================
       STATS
    ============================================================ */

    function updateStats() {

        const moneyElements = [

            "#money",

            "#moneyValue",

            "#cash",

            "#cashValue"
        ];


        for(
            const selector of moneyElements
        ) {

            const element =
                $(selector);


            if(element) {

                element.textContent =
                    formatMoney(
                        engine.money
                    );
            }
        }


        const productionElements = [

            "#production",

            "#productionValue",

            "#income",

            "#incomeValue",

            "#moneyPerSecond"
        ];


        for(
            const selector of
            productionElements
        ) {

            const element =
                $(selector);


            if(element) {

                element.textContent =
                    formatMoney(
                        engine.production
                    ) +
                    "/s";
            }
        }


        const objectElements = [

            "#objectCount",

            "#objectsCount",

            "#machineCount"
        ];


        for(
            const selector of
            objectElements
        ) {

            const element =
                $(selector);


            if(element) {

                element.textContent =
                    engine.objects.length;
            }
        }


        const itemElements = [

            "#itemCount",

            "#itemsCount"
        ];


        for(
            const selector of
            itemElements
        ) {

            const element =
                $(selector);


            if(element) {

                element.textContent =
                    engine.items.length;
            }
        }


        const floorElements = [

            "#floor",

            "#floorNumber",

            "#currentFloor"
        ];


        for(
            const selector of
            floorElements
        ) {

            const element =
                $(selector);


            if(element) {

                element.textContent =
                    state.currentFloor;
            }
        }
    }


    /* ============================================================
       INSPECTOR
    ============================================================ */

    function setupInspector() {

        const deleteButton =
            $(
                "#deleteObject"
            ) ||
            $(
                "#deleteSelected"
            );


        if(deleteButton) {

            deleteButton.addEventListener(
                "click",
                () => {

                    if(
                        engine.selectedObject
                    ) {

                        engine.deleteSelected();

                        closeInspector();
                    }
                }
            );
        }


        const rotateButton =
            $(
                "#rotateObject"
            ) ||
            $(
                "#rotateSelected"
            );


        if(rotateButton) {

            rotateButton.addEventListener(
                "click",
                () => {

                    if(
                        engine.selectedObject
                    ) {

                        engine.rotateObject(
                            engine.selectedObject
                        );

                        renderInspector(
                            engine.selectedObject
                        );
                    }
                }
            );
        }


        const closeButton =
            $(
                "#closeInspector"
            );


        if(closeButton) {

            closeButton.addEventListener(
                "click",
                closeInspector
            );
        }
    }


    function renderInspector(
        object
    ) {

        const inspector =
            $(
                "#inspector"
            );


        if(!inspector)
            return;


        if(!object) {

            closeInspector();

            return;
        }


        const data =
            object.data || {};


        inspector.classList.remove(
            "hidden"
        );


        inspector.innerHTML = `

            <div
                class="
                    p-4
                    space-y-4
                "
            >

                <div class="flex items-start justify-between gap-3">

                    <div>

                        <div
                            class="
                                text-[10px]
                                uppercase
                                tracking-[0.2em]
                                text-neutral-600
                            "
                        >
                            INSPECTOR
                        </div>


                        <div
                            class="
                                text-lg
                                font-semibold
                                text-neutral-100
                                mt-1
                            "
                        >
                            ${
                                data.name ||
                                capitalize(data.id)
                            }
                        </div>

                    </div>


                    <button
                        id="closeInspector"
                        class="
                            w-8
                            h-8
                            rounded-lg
                            bg-neutral-900
                            text-neutral-500
                            hover:text-white
                        "
                    >
                        ×
                    </button>

                </div>


                <div
                    class="
                        grid
                        grid-cols-2
                        gap-2
                    "
                >

                    <div
                        class="
                            rounded-lg
                            border
                            border-neutral-800
                            bg-neutral-950
                            p-3
                        "
                    >

                        <div
                            class="
                                text-[9px]
                                uppercase
                                tracking-widest
                                text-neutral-600
                            "
                        >
                            POSITION
                        </div>

                        <div
                            class="
                                text-xs
                                font-mono
                                text-neutral-300
                                mt-1
                            "
                        >
                            ${object.x / engine.grid},
                            ${object.y / engine.grid}
                        </div>

                    </div>


                    <div
                        class="
                            rounded-lg
                            border
                            border-neutral-800
                            bg-neutral-950
                            p-3
                        "
                    >

                        <div
                            class="
                                text-[9px]
                                uppercase
                                tracking-widest
                                text-neutral-600
                            "
                        >
                            ROTATION
                        </div>

                        <div
                            class="
                                text-xs
                                font-mono
                                text-neutral-300
                                mt-1
                            "
                        >
                            ${object.rotation || 0}°
                        </div>

                    </div>

                </div>


                ${
                    data.multiplier
                    ? `
                        <div
                            class="
                                p-3
                                rounded-lg
                                border
                                border-neutral-800
                                bg-neutral-950
                            "
                        >

                            <div
                                class="
                                    text-[9px]
                                    uppercase
                                    tracking-widest
                                    text-neutral-600
                                "
                            >
                                MULTIPLIER
                            </div>

                            <div
                                class="
                                    text-xl
                                    font-bold
                                    text-neutral-200
                                    mt-1
                                "
                            >
                                ×${data.multiplier}
                            </div>

                        </div>
                    `
                    : ""
                }


                <div
                    class="
                        flex
                        gap-2
                    "
                >

                    <button
                        id="rotateObject"
                        class="
                            flex-1
                            py-2.5
                            rounded-lg
                            bg-neutral-900
                            border
                            border-neutral-800
                            text-xs
                            text-neutral-300
                            hover:bg-neutral-800
                        "
                    >
                        ROTATE
                    </button>


                    <button
                        id="deleteObject"
                        class="
                            flex-1
                            py-2.5
                            rounded-lg
                            bg-neutral-900
                            border
                            border-neutral-800
                            text-xs
                            text-neutral-400
                            hover:bg-neutral-800
                            hover:text-white
                        "
                    >
                        DELETE
                    </button>

                </div>

            </div>
        `;


        inspector
            .querySelector(
                "#closeInspector"
            )
            ?.addEventListener(
                "click",
                closeInspector
            );


        inspector
            .querySelector(
                "#rotateObject"
            )
            ?.addEventListener(
                "click",
                () => {

                    engine.rotateObject(
                        object
                    );

                    renderInspector(
                        object
                    );
                }
            );


        inspector
            .querySelector(
                "#deleteObject"
            )
            ?.addEventListener(
                "click",
                () => {

                    engine.deleteAt(
                        object.x,
                        object.y
                    );

                    closeInspector();
                }
            );
    }


    function closeInspector() {

        const inspector =
            $(
                "#inspector"
            );


        if(inspector) {

            inspector.classList.add(
                "hidden"
            );
        }
    }


    /* ============================================================
       FLOOR SYSTEM
    ============================================================ */

    function saveCurrentFloor() {

        state.floors[
            state.currentFloor
        ] =
            engine.exportFloor();
    }


    function loadFloor(
        floorNumber
    ) {

        saveCurrentFloor();


        state.currentFloor =
            Math.max(
                1,
                Number(
                    floorNumber
                )
            );


        const floorData =
            state.floors[
                state.currentFloor
            ] || [];


        engine.importFloor(
            floorData
        );


        closeInspector();

        cancelBuild();

        updateStats();

        showMessage(
            `Floor ${state.currentFloor}`
        );
    }


    function createFloor() {

        saveCurrentFloor();


        const floors =
            Object.keys(
                state.floors
            )
            .map(Number);


        const next =
            floors.length
                ? Math.max(...floors) + 1
                : state.currentFloor + 1;


        state.floors[next] = [];


        loadFloor(next);

        renderFloors();

        saveGame();
    }


    function renderFloors() {

        const container =
            $(
                "#floorList"
            );


        if(!container)
            return;


        const floorNumbers =
            Object.keys(
                state.floors
            )
            .map(Number)
            .sort(
                (a, b) =>
                    a - b
            );


        if(
            !floorNumbers.includes(
                state.currentFloor
            )
        ) {

            floorNumbers.push(
                state.currentFloor
            );
        }


        container.innerHTML = "";


        for(
            const floor of floorNumbers
        ) {

            const button =
                document.createElement(
                    "button"
                );


            const active =
                floor ===
                state.currentFloor;


            button.className = `
                w-full
                flex
                items-center
                justify-between
                px-3
                py-2
                rounded-lg
                text-xs
                transition
                ${
                    active
                    ? "bg-neutral-100 text-neutral-950"
                    : "bg-neutral-900 text-neutral-500 hover:text-neutral-200"
                }
            `;


            button.innerHTML = `

                <span>
                    FLOOR ${floor}
                </span>

                <span
                    class="
                        opacity-50
                        font-mono
                    "
                >
                    ${
                        (
                            state.floors[floor] ||
                            []
                        ).length
                    }
                </span>
            `;


            button.addEventListener(
                "click",
                () => {

                    loadFloor(
                        floor
                    );

                    renderFloors();
                }
            );


            container.appendChild(
                button
            );
        }
    }


    function setupFloors() {

        const add =
            $(
                "#addFloor"
            ) ||
            $(
                "#newFloor"
            );


        if(add) {

            add.addEventListener(
                "click",
                createFloor
            );
        }


        state.floors[1] = [];

        renderFloors();
    }


    /* ============================================================
       SAVE / LOAD
    ============================================================ */

    const SAVE_KEY =
        "factory_game_save_v1";


    function saveGame() {

        if(!state.autoSave)
            return;


        saveCurrentFloor();


        const save = {

            money:
                engine.money,

            currentFloor:
                state.currentFloor,

            floors:
                state.floors,

            floorNames:
                state.floorNames,

            version: 1,

            savedAt:
                Date.now()
        };


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(save)
            );

        } catch(error) {

            console.warn(
                "Could not save game.",
                error
            );
        }
    }


    function loadGame() {

        try {

            const raw =
                localStorage.getItem(
                    SAVE_KEY
                );


            if(!raw)
                return false;


            const save =
                JSON.parse(raw);


            if(
                !save ||
                save.version !== 1
            ) {

                return false;
            }


            engine.money =
                Number(
                    save.money || 500
                );


            state.floors =
                save.floors || {};


            state.floorNames =
                save.floorNames || {};


            state.currentFloor =
                Number(
                    save.currentFloor || 1
                );


            if(
                !state.floors[
                    state.currentFloor
                ]
            ) {

                state.floors[
                    state.currentFloor
                ] = [];
            }


            engine.importFloor(
                state.floors[
                    state.currentFloor
                ]
            );


            renderFloors();

            updateStats();

            return true;

        } catch(error) {

            console.warn(
                "Could not load save.",
                error
            );

            return false;
        }
    }


    function resetGame() {

        const confirmed =
            window.confirm(
                "Delete your entire factory?"
            );


        if(!confirmed)
            return;


        localStorage.removeItem(
            SAVE_KEY
        );


        engine.clearFactory();


        engine.money =
            500;


        state.currentFloor =
            1;


        state.floors = {
            1: []
        };


        state.selectedDefinition =
            null;


        state.selectedObject =
            null;


        engine.cancelBuild();


        renderFloors();

        updateStats();

        renderObjectMenu();

        closeInspector();


        showMessage(
            "Factory reset"
        );
    }


    function setupSaveButtons() {

        const save =
            $(
                "#saveGame"
            );


        if(save) {

            save.addEventListener(
                "click",
                () => {

                    saveCurrentFloor();

                    localStorage.setItem(
                        SAVE_KEY,
                        JSON.stringify({

                            money:
                                engine.money,

                            currentFloor:
                                state.currentFloor,

                            floors:
                                state.floors,

                            floorNames:
                                state.floorNames,

                            version: 1,

                            savedAt:
                                Date.now()
                        })
                    );


                    showMessage(
                        "Game saved"
                    );
                }
            );
        }


        const reset =
            $(
                "#resetGame"
            );


        if(reset) {

            reset.addEventListener(
                "click",
                resetGame
            );
        }
    }


    /* ============================================================
       MESSAGE SYSTEM
    ============================================================ */

    function showMessage(
        message
    ) {

        let toast =
            $(
                "#toast"
            );


        if(!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "toast";


            toast.className = `
                fixed
                left-1/2
                bottom-6
                -translate-x-1/2
                z-[9999]
                pointer-events-none
                px-4
                py-2.5
                rounded-xl
                border
                border-neutral-700
                bg-neutral-950
                text-neutral-200
                text-xs
                font-mono
                shadow-2xl
                transition
                duration-200
            `;


            document.body.appendChild(
                toast
            );
        }


        toast.textContent =
            message;


        toast.style.opacity =
            "1";


        clearTimeout(
            state.messageTimeout
        );


        state.messageTimeout =
            setTimeout(
                () => {

                    toast.style.opacity =
                        "0";

                },
                1400
            );
    }


    /* ============================================================
       ENGINE EVENTS
    ============================================================ */

    window.addEventListener(
        "factorySelect",
        event => {

            const object =
                event.detail;


            state.selectedObject =
                object;


            state.selectedDefinition =
                null;


            engine.cancelBuild();


            renderInspector(
                object
            );


            renderObjectMenu();
        }
    );


    window.addEventListener(
        "factoryDeselect",
        () => {

            state.selectedObject =
                null;

            closeInspector();
        }
    );


    window.addEventListener(
        "factoryObjectPlaced",
        event => {

            const object =
                event.detail;


            state.selectedObject =
                object;


            /*
             * Keep building the same object.
             */

            if(
                state.selectedDefinition
            ) {

                engine.setBuildObject(
                    state.selectedDefinition
                );
            }


            updateStats();
        }
    );


    window.addEventListener(
        "factoryObjectDeleted",
        () => {

            updateStats();

            saveGame();
        }
    );


    window.addEventListener(
        "factoryMessage",
        event => {

            showMessage(
                event.detail.message
            );
        }
    );


    window.addEventListener(
        "factoryTick",
        event => {

            const data =
                event.detail;


            updateStats();


            /*
             * Autosave every ~5 seconds.
             */

            if(
                state.autoSave
            ) {

                autoSaveTimer +=
                    1 / 60;


                if(
                    autoSaveTimer >= 5
                ) {

                    autoSaveTimer = 0;

                    saveGame();
                }
            }
        }
    );


    let autoSaveTimer = 0;


    /* ============================================================
       KEYBOARD
    ============================================================ */

    function setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                /*
                 * Don't trigger shortcuts
                 * while typing.
                 */

                const tag =
                    event.target?.tagName;


                if(
                    tag === "INPUT" ||
                    tag === "TEXTAREA"
                ) {

                    return;
                }


                /*
                 * ESC
                 */

                if(
                    event.key ===
                    "Escape"
                ) {

                    cancelBuild();

                    closeInspector();

                    return;
                }


                /*
                 * R
                 */

                if(
                    event.key.toLowerCase() ===
                    "r"
                ) {

                    if(
                        engine.selectedObject
                    ) {

                        engine.rotateObject(
                            engine.selectedObject
                        );

                        renderInspector(
                            engine.selectedObject
                        );

                    } else if(
                        state.selectedDefinition
                    ) {

                        /*
                         * Rotation of future
                         * conveyor placements.
                         */

                        engine.buildRotation =
                            (
                                engine.buildRotation ||
                                0
                            ) + 90;
                    }

                    return;
                }


                /*
                 * DELETE / BACKSPACE
                 */

                if(
                    event.key ===
                    "Delete" ||
                    event.key ===
                    "Backspace"
                ) {

                    if(
                        engine.selectedObject
                    ) {

                        engine.deleteSelected();

                        closeInspector();
                    }

                    return;
                }


                /*
                 * SPACE
                 */

                if(
                    event.code ===
                    "Space"
                ) {

                    event.preventDefault();

                    engine.running =
                        !engine.running;


                    showMessage(
                        engine.running
                            ? "Factory resumed"
                            : "Factory paused"
                    );
                }


                /*
                 * Number keys = floors
                 */

                if(
                    /^[1-9]$/.test(
                        event.key
                    )
                ) {

                    const floor =
                        Number(
                            event.key
                        );


                    if(
                        state.floors[floor]
                    ) {

                        loadFloor(
                            floor
                        );

                        renderFloors();
                    }
                }
            }
        );
    }


    /* ============================================================
       PAUSE BUTTON
    ============================================================ */

    function setupPause() {

        const button =
            $(
                "#pauseButton"
            ) ||
            $(
                "#pause"
            );


        if(!button)
            return;


        button.addEventListener(
            "click",
            () => {

                engine.running =
                    !engine.running;


                button.textContent =
                    engine.running
                        ? "Ⅱ"
                        : "▶";


                showMessage(
                    engine.running
                        ? "Factory resumed"
                        : "Factory paused"
                );
            }
        );
    }


    /* ============================================================
       CAMERA CONTROLS
    ============================================================ */

    function setupCameraButtons() {

        const zoomIn =
            $(
                "#zoomIn"
            );


        const zoomOut =
            $(
                "#zoomOut"
            );


        const resetCamera =
            $(
                "#resetCamera"
            );


        if(zoomIn) {

            zoomIn.addEventListener(
                "click",
                () => {

                    engine.camera.zoom =
                        Math.min(
                            3.5,
                            engine.camera.zoom *
                            1.15
                        );
                }
            );
        }


        if(zoomOut) {

            zoomOut.addEventListener(
                "click",
                () => {

                    engine.camera.zoom =
                        Math.max(
                            .25,
                            engine.camera.zoom /
                            1.15
                        );
                }
            );
        }


        if(resetCamera) {

            resetCamera.addEventListener(
                "click",
                () => {

                    engine.camera.x = 0;

                    engine.camera.y = 0;

                    engine.camera.zoom = 1;
                }
            );
        }
    }


    /* ============================================================
       DELETE MODE
    ============================================================ */

    function setupDeleteMode() {

        const button =
            $(
                "#deleteMode"
            );


        if(!button)
            return;


        let active = false;


        button.addEventListener(
            "click",
            () => {

                active =
                    !active;


                button.classList.toggle(
                    "bg-neutral-100",
                    active
                );


                button.classList.toggle(
                    "text-neutral-950",
                    active
                );


                if(active) {

                    state.selectedDefinition =
                        null;

                    engine.cancelBuild();

                    showMessage(
                        "Delete mode"
                    );

                } else {

                    showMessage(
                        "Delete mode off"
                    );
                }
            }
        );


        canvas.addEventListener(
            "mousedown",
            event => {

                if(
                    !active ||
                    event.button !== 0
                )
                    return;


                const world =
                    engine.screenToWorld(
                        event.clientX,
                        event.clientY
                    );


                const point =
                    engine.snapPoint(
                        world.x,
                        world.y
                    );


                engine.deleteAt(
                    point.x,
                    point.y
                );
            }
        );
    }


    /* ============================================================
       MOBILE PANEL
    ============================================================ */

    function setupMobileMenu() {

        const toggle =
            $(
                "#buildToggle"
            ) ||
            $(
                "#toggleBuild"
            );


        const panel =
            $(
                "#buildPanel"
            ) ||
            $(
                "#objectPanel"
            );


        if(
            !toggle ||
            !panel
        )
            return;


        toggle.addEventListener(
            "click",
            () => {

                panel.classList.toggle(
                    "hidden"
                );
            }
        );
    }


    /* ============================================================
       QUICK BUILD BUTTONS
    ============================================================ */

    function setupQuickButtons() {

        $$(
            "[data-build]"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.build;


                        const object =
                            getObjectList()
                                .find(
                                    x =>
                                        x.id === id
                                );


                        if(object) {

                            selectBuildObject(
                                object
                            );
                        }
                    }
                );
            }
        );
    }


    /* ============================================================
       FLOOR HOTKEY BUTTONS
    ============================================================ */

    $$(
        "[data-floor]"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    loadFloor(
                        Number(
                            button.dataset.floor
                        )
                    );

                    renderFloors();
                }
            );
        }
    );


    /* ============================================================
       SOUND
    ============================================================ */

    function setupSound() {

        const button =
            $(
                "#soundToggle"
            ) ||
            $(
                "#muteButton"
            );


        if(!button)
            return;


        button.addEventListener(
            "click",
            () => {

                state.muted =
                    !state.muted;


                button.textContent =
                    state.muted
                        ? "MUTE"
                        : "SOUND";


                showMessage(
                    state.muted
                        ? "Sound muted"
                        : "Sound enabled"
                );
            }
        );
    }


    /* ============================================================
       FULLSCREEN
    ============================================================ */

    function setupFullscreen() {

        const button =
            $(
                "#fullscreen"
            ) ||
            $(
                "#fullscreenButton"
            );


        if(!button)
            return;


        button.addEventListener(
            "click",
            async () => {

                try {

                    if(
                        !document.fullscreenElement
                    ) {

                        await document.documentElement
                            .requestFullscreen();

                    } else {

                        await document
                            .exitFullscreen();
                    }

                } catch(error) {

                    console.warn(
                        "Fullscreen failed",
                        error
                    );
                }
            }
        );
    }


    /* ============================================================
       NEW FACTORY
    ============================================================ */

    function setupNewFactory() {

        const button =
            $(
                "#newFactory"
            );


        if(!button)
            return;


        button.addEventListener(
            "click",
            () => {

                resetGame();
            }
        );
    }


    /* ============================================================
       OBJECT COUNT LIMIT
    ============================================================ */

    function checkFactoryLimit() {

        const MAX_OBJECTS =
            10000;


        if(
            engine.objects.length >=
            MAX_OBJECTS
        ) {

            engine.cancelBuild();


            showMessage(
                "Factory object limit reached"
            );


            return false;
        }


        return true;
    }


    /*
     * Wrap placement so we can enforce
     * the limit without touching Engine.js.
     */

    const originalPlace =
        engine.place.bind(
            engine
        );


    engine.place =
        function(x, y) {

            if(
                !checkFactoryLimit()
            ) {

                return false;
            }


            const result =
                originalPlace(
                    x,
                    y
                );


            if(result) {

                updateStats();
            }


            return result;
        };


    /* ============================================================
       DEBUG API
    ============================================================ */

    window.FactoryApp = {

        state,

        engine,

        save:
            saveGame,

        load:
            loadGame,

        reset:
            resetGame,

        newFloor:
            createFloor,

        select:
            selectBuildObject,

        cancel:
            cancelBuild,

        showMessage
    };


    /* ============================================================
       INITIALIZE
    ============================================================ */

    function init() {

        console.log(
            "%cFACTORY ENGINE ONLINE",
            "font-weight:bold;font-size:18px"
        );


        const loaded =
            loadGame();


        if(!loaded) {

            state.floors = {
                1: []
            };


            state.currentFloor =
                1;


            /*
             * Starting cash
             */

            if(
                typeof engine.money !==
                "number"
            ) {

                engine.money =
                    500;
            }
        }


        renderCategories();

        renderObjectMenu();

        renderFloors();

        updateSelectedBuildUI();

        updateStats();


        setupSearch();

        setupInspector();

        setupFloors();

        setupSaveButtons();

        setupKeyboard();

        setupPause();

        setupCameraButtons();

        setupDeleteMode();

        setupMobileMenu();

        setupQuickButtons();

        setupSound();

        setupFullscreen();

        setupNewFactory();


        /*
         * Start centered.
         */

        if(
            !loaded
        ) {

            engine.camera.x = 0;

            engine.camera.y = 0;

            engine.camera.zoom = 1;
        }


        /*
         * Initial message.
         */

        setTimeout(
            () => {

                showMessage(
                    "Build your factory."
                );

            },
            500
        );
    }


    /* ============================================================
       DOM READY
    ============================================================ */

    if(
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
