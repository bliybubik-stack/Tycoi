class FactoryEngine {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.grid = 48;

        this.camera = {
            x: 0,
            y: 0,
            zoom: 1
        };

        this.objects = [];
        this.items = [];

        this.running = true;

        this.money = 500;
        this.production = 0;

        this.selectedObject = null;
        this.buildDefinition = null;

        this.hoveredObject = null;

        this.lastTime = performance.now();

        this.lastMouse = {
            x: 0,
            y: 0
        };

        this.lastMouseWorld = {
            x: 0,
            y: 0
        };

        this.draggingCamera = false;
        this.dragDistance = 0;

        this.itemCounter = 0;

        this.resize();

        window.addEventListener(
            "resize",
            () => this.resize()
        );

        this.bindMouse();

        requestAnimationFrame(
            time => this.loop(time)
        );
    }


    /* =========================================================
       RESIZE
    ========================================================= */

    resize() {

        const rect =
            this.canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        this.canvas.width =
            Math.floor(rect.width * dpr);

        this.canvas.height =
            Math.floor(rect.height * dpr);

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =========================================================
       COORDINATES
    ========================================================= */

    screenToWorld(x, y) {

        const rect =
            this.canvas.getBoundingClientRect();

        const sx =
            x - rect.left;

        const sy =
            y - rect.top;

        return {

            x:
                (sx - rect.width / 2) /
                this.camera.zoom +
                this.camera.x,

            y:
                (sy - rect.height / 2) /
                this.camera.zoom +
                this.camera.y
        };
    }


    worldToScreen(x, y) {

        const rect =
            this.canvas.getBoundingClientRect();

        return {

            x:
                (x - this.camera.x) *
                this.camera.zoom +
                rect.width / 2,

            y:
                (y - this.camera.y) *
                this.camera.zoom +
                rect.height / 2
        };
    }


    snap(value) {

        return (
            Math.round(
                value / this.grid
            ) * this.grid
        );
    }


    snapPoint(x, y) {

        return {
            x: this.snap(x),
            y: this.snap(y)
        };
    }


    /* =========================================================
       MOUSE
    ========================================================= */

    bindMouse() {

        this.canvas.addEventListener(
            "mousemove",
            e => {

                this.lastMouse.x =
                    e.clientX;

                this.lastMouse.y =
                    e.clientY;

                const world =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );

                this.lastMouseWorld =
                    world;

                const snapped =
                    this.snapPoint(
                        world.x,
                        world.y
                    );

                this.hoveredObject =
                    this.getObjectAt(
                        snapped.x,
                        snapped.y
                    );

                if(
                    this.draggingCamera
                ) {

                    const dx =
                        e.clientX -
                        this.dragStartMouse.x;

                    const dy =
                        e.clientY -
                        this.dragStartMouse.y;

                    this.dragDistance =
                        Math.hypot(dx, dy);

                    this.camera.x =
                        this.dragStartCamera.x -
                        dx / this.camera.zoom;

                    this.camera.y =
                        this.dragStartCamera.y -
                        dy / this.camera.zoom;
                }
            }
        );


        this.canvas.addEventListener(
            "mousedown",
            e => {

                if(e.button === 1) {

                    this.draggingCamera = true;

                    this.dragDistance = 0;

                    this.dragStartMouse = {
                        x: e.clientX,
                        y: e.clientY
                    };

                    this.dragStartCamera = {
                        x: this.camera.x,
                        y: this.camera.y
                    };

                    return;
                }


                const world =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );

                const point =
                    this.snapPoint(
                        world.x,
                        world.y
                    );


                /* RIGHT CLICK = DELETE */

                if(e.button === 2) {

                    this.deleteAt(
                        point.x,
                        point.y
                    );

                    return;
                }


                /* LEFT CLICK */

                if(e.button === 0) {

                    if(
                        this.dragDistance > 5
                    ) return;


                    if(
                        this.buildDefinition
                    ) {

                        this.place(
                            point.x,
                            point.y
                        );

                    } else {

                        const object =
                            this.getObjectAt(
                                point.x,
                                point.y
                            );

                        if(object) {

                            this.select(
                                object
                            );

                        } else {

                            this.clearSelection();
                        }
                    }
                }
            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                this.draggingCamera =
                    false;
            }
        );


        this.canvas.addEventListener(
            "wheel",
            e => {

                e.preventDefault();

                const oldZoom =
                    this.camera.zoom;

                const mouseBefore =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );


                const zoomAmount =
                    e.deltaY < 0
                    ? 1.12
                    : 0.89;

                this.camera.zoom *=
                    zoomAmount;

                this.camera.zoom =
                    Math.max(
                        0.25,
                        Math.min(
                            3.5,
                            this.camera.zoom
                        )
                    );


                const mouseAfter =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );


                this.camera.x +=
                    mouseBefore.x -
                    mouseAfter.x;

                this.camera.y +=
                    mouseBefore.y -
                    mouseAfter.y;
            },
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "contextmenu",
            e => {
                e.preventDefault();
            }
        );


        this.canvas.addEventListener(
            "dblclick",
            e => {

                const world =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );

                const point =
                    this.snapPoint(
                        world.x,
                        world.y
                    );

                const object =
                    this.getObjectAt(
                        point.x,
                        point.y
                    );

                if(object) {

                    this.rotateObject(
                        object
                    );
                }
            }
        );
    }


    /* =========================================================
       BUILD MODE
    ========================================================= */

    setBuildObject(definition) {

        this.buildDefinition =
            definition;

        this.selectedObject =
            null;
    }


    cancelBuild() {

        this.buildDefinition =
            null;
    }


    /* =========================================================
       OBJECT PLACEMENT
    ========================================================= */

    place(x, y) {

        const definition =
            this.buildDefinition;

        if(!definition)
            return false;


        if(
            this.getObjectAt(x, y)
        ) {

            return false;
        }


        const cost =
            Number(
                definition.cost || 0
            );


        if(
            this.money < cost
        ) {

            this.flashMessage(
                "NOT ENOUGH MONEY"
            );

            return false;
        }


        this.money -= cost;


        const object = {

            uid:
                this.createUID(),

            id:
                definition.id,

            x,
            y,

            rotation: 0,

            data:
                definition,

            timer: 0,

            progress: 0,

            direction:
                this.getDefaultDirection(
                    definition
                )
        };


        this.objects.push(
            object
        );


        /*
         * Keep build mode active.
         * This makes placing 50 conveyors
         * extremely fast.
         */

        this.emitObjectPlaced(
            object
        );

        return true;
    }


    getDefaultDirection(definition) {

        if(
            definition.direction
        ) {

            return definition.direction;
        }

        return "right";
    }


    rotateObject(object) {

        if(!object)
            return;

        const directions = [
            "right",
            "down",
            "left",
            "up"
        ];

        const current =
            directions.indexOf(
                object.direction
            );

        object.direction =
            directions[
                (current + 1) %
                directions.length
            ];

        object.rotation =
            directions.indexOf(
                object.direction
            ) * 90;
    }


    /* =========================================================
       DELETE
    ========================================================= */

    deleteAt(x, y) {

        const index =
            this.objects.findIndex(
                object =>
                    object.x === x &&
                    object.y === y
            );

        if(index === -1)
            return false;


        const object =
            this.objects[index];


        const refund =
            Math.floor(
                Number(
                    object.data.cost || 0
                ) * 0.5
            );


        this.money += refund;


        this.objects.splice(
            index,
            1
        );


        if(
            this.selectedObject ===
            object
        ) {

            this.clearSelection();
        }


        this.emitObjectDeleted(
            object
        );

        return true;
    }


    deleteSelected() {

        if(
            !this.selectedObject
        )
            return false;


        return this.deleteAt(
            this.selectedObject.x,
            this.selectedObject.y
        );
    }


    /* =========================================================
       LOOKUPS
    ========================================================= */

    getObjectAt(x, y) {

        return this.objects.find(
            object =>
                object.x === x &&
                object.y === y
        ) || null;
    }


    getObjectsByType(type) {

        return this.objects.filter(
            object =>
                object.data.type === type
        );
    }


    getObjectById(id) {

        return this.objects.find(
            object =>
                object.id === id
        ) || null;
    }


    /* =========================================================
       SELECTION
    ========================================================= */

    select(object) {

        this.selectedObject =
            object;

        window.dispatchEvent(
            new CustomEvent(
                "factorySelect",
                {
                    detail: object
                }
            )
        );
    }


    clearSelection() {

        this.selectedObject =
            null;

        window.dispatchEvent(
            new CustomEvent(
                "factoryDeselect"
            )
        );
    }


    /* =========================================================
       GAME UPDATE
    ========================================================= */

    update(dt) {

        if(!this.running)
            return;


        let income = 0;


        /*
         * SPAWNERS
         */

        for(
            const object of this.objects
        ) {

            const data =
                object.data;


            if(
                data.type === "spawner"
            ) {

                object.timer += dt;


                const interval =
                    Math.max(
                        0.05,
                        Number(
                            data.interval || 1
                        )
                    );


                if(
                    object.timer >=
                    interval
                ) {

                    object.timer -=
                        interval;

                    this.spawnItem(
                        object
                    );
                }
            }


            /*
             * BANK
             */

            if(
                data.type === "bank"
            ) {

                income +=
                    dt * 2;
            }
        }


        /*
         * MOVE ITEMS
         */

        this.updateItems(
            dt
        );


        /*
         * COLLECTOR MONEY
         */

        const collected =
            this.processCollectors();


        income += collected;


        /*
         * PASSIVE INCOME
         */

        this.money +=
            income;


        /*
         * PRODUCTION STAT
         */

        const safeDt =
            Math.max(
                dt,
                0.001
            );


        this.production =
            income / safeDt;
    }


    /* =========================================================
       SPAWN ITEM
    ========================================================= */

    spawnItem(spawner) {

        const data =
            spawner.data;


        const item = {

            id:
                ++this.itemCounter,

            x:
                spawner.x,

            y:
                spawner.y,

            previousX:
                spawner.x,

            previousY:
                spawner.y,

            progress: 0,

            value:
                Number(
                    data.value || 1
                ),

            speed: 1,

            alive: true,

            lastObject:
                spawner.uid,

            direction:
                spawner.direction ||
                "right"
        };


        this.items.push(
            item
        );
    }


    /* =========================================================
       ITEM UPDATE
    ========================================================= */

    updateItems(dt) {

        for(
            const item of this.items
        ) {

            if(!item.alive)
                continue;


            const conveyor =
                this.findConveyorForItem(
                    item
                );


            if(!conveyor) {

                /*
                 * Items can sit on the
                 * spawner tile until a
                 * conveyor is available.
                 */

                continue;
            }


            const speed =
                this.calculateItemSpeed(
                    item,
                    conveyor
                );


            item.progress +=
                dt * speed;


            if(
                item.progress >= 1
            ) {

                item.progress -= 1;


                item.previousX =
                    item.x;

                item.previousY =
                    item.y;


                const next =
                    this.getNextTile(
                        conveyor
                    );


                if(!next) {

                    /*
                     * No connected conveyor.
                     * Item waits at end.
                     */

                    item.progress = 0;

                    continue;
                }


                const nextObject =
                    this.getObjectAt(
                        next.x,
                        next.y
                    );


                item.x =
                    next.x;

                item.y =
                    next.y;


                item.direction =
                    conveyor.direction;


                item.lastObject =
                    conveyor.uid;


                /*
                 * MACHINE PROCESSING
                 */

                if(nextObject) {

                    this.processItemAtObject(
                        item,
                        nextObject
                    );
                }
            }
        }


        this.items =
            this.items.filter(
                item =>
                    item.alive
            );
    }


    /* =========================================================
       FIND CONVEYOR
    ========================================================= */

    findConveyorForItem(item) {

        const current =
            this.getObjectAt(
                item.x,
                item.y
            );


        if(
            current &&
            current.data.type ===
            "conveyor"
        ) {

            return current;
        }


        /*
         * Look around the current tile
         * for an entrance conveyor.
         */

        const directions = [
            {
                x: this.grid,
                y: 0,
                opposite: "left"
            },

            {
                x: -this.grid,
                y: 0,
                opposite: "right"
            },

            {
                x: 0,
                y: this.grid,
                opposite: "up"
            },

            {
                x: 0,
                y: -this.grid,
                opposite: "down"
            }
        ];


        for(
            const direction
            of directions
        ) {

            const object =
                this.getObjectAt(
                    item.x +
                    direction.x,

                    item.y +
                    direction.y
                );


            if(
                object &&
                object.data.type ===
                "conveyor"
            ) {

                if(
                    object.direction ===
                    direction.opposite
                ) {

                    return object;
                }
            }
        }


        return null;
    }


    /* =========================================================
       NEXT TILE
    ========================================================= */

    getNextTile(conveyor) {

        const direction =
            conveyor.direction ||
            "right";


        const vectors = {

            right: {
                x: this.grid,
                y: 0
            },

            left: {
                x: -this.grid,
                y: 0
            },

            up: {
                x: 0,
                y: -this.grid
            },

            down: {
                x: 0,
                y: this.grid
            }
        };


        const vector =
            vectors[direction] ||
            vectors.right;


        const nextX =
            conveyor.x +
            vector.x;

        const nextY =
            conveyor.y +
            vector.y;


        const nextObject =
            this.getObjectAt(
                nextX,
                nextY
            );


        /*
         * Collector / processing machines
         * can receive the item.
         */

        if(
            nextObject &&
            this.canReceiveItem(
                nextObject
            )
        ) {

            return {
                x: nextX,
                y: nextY
            };
        }


        /*
         * Conveyor must exist and be
         * correctly connected.
         */

        if(
            nextObject &&
            nextObject.data.type ===
            "conveyor"
        ) {

            const requiredDirection =
                this.getOpposite(
                    direction
                );


            /*
             * A conveyor can receive
             * from the previous direction.
             */

            return {
                x: nextX,
                y: nextY
            };
        }


        return null;
    }


    canReceiveItem(object) {

        const types = [

            "machine",
            "collector",
            "multiplier",
            "booster",
            "storage",
            "splitter",
            "merger",
            "router",
            "teleporter",
            "charger",
            "repair",
            "cooler",
            "blackhole",
            "clone",
            "bank",
            "core",
            "secret"
        ];


        return types.includes(
            object.data.type
        );
    }


    getOpposite(direction) {

        const map = {

            right: "left",
            left: "right",
            up: "down",
            down: "up"
        };


        return (
            map[direction] ||
            "left"
        );
    }


    /* =========================================================
       ITEM SPEED
    ========================================================= */

    calculateItemSpeed(
        item,
        conveyor
    ) {

        let speed =
            Number(
                conveyor.data.speed ||
                1
            );


        /*
         * Nearby speed boosters
         */

        const boosters =
            this.objects.filter(
                object =>
                    object.data.type ===
                    "booster"
            );


        for(
            const booster
            of boosters
        ) {

            if(
                this.distance(
                    booster,
                    conveyor
                ) <= 100
            ) {

                speed *=
                    Number(
                        booster.data.multiplier ||
                        1
                    );
            }
        }


        /*
         * Time booster
         */

        const timeBoosters =
            this.objects.filter(
                object =>
                    object.id ===
                    "time_booster"
            );


        if(
            timeBoosters.length
        ) {

            speed *= 1.25;
        }


        return speed;
    }


    /* =========================================================
       MACHINE PROCESSING
    ========================================================= */

    processItemAtObject(
        item,
        object
    ) {

        const type =
            object.data.type;


        if(
            type === "machine"
        ) {

            item.value *=
                Number(
                    object.data.multiplier ||
                    1
                );

            return;
        }


        if(
            type === "multiplier"
        ) {

            item.value *=
                Number(
                    object.data.multiplier ||
                    1
                );

            return;
        }


        if(
            type === "booster"
        ) {

            item.value *=
                1.05;

            return;
        }


        if(
            type === "clone"
        ) {

            const clone =
                this.cloneItem(
                    item
                );

            this.items.push(
                clone
            );

            return;
        }


        if(
            type === "blackhole"
        ) {

            item.value *=
                Number(
                    object.data.multiplier ||
                    1
                );

            return;
        }


        if(
            type === "secret"
        ) {

            item.value *=
                Number(
                    object.data.multiplier ||
                    1
                );

            return;
        }


        if(
            type === "storage"
        ) {

            object.stored =
                (object.stored || 0)
                + item.value;

            item.alive = false;

            return;
        }


        if(
            type === "teleporter"
        ) {

            this.teleportItem(
                item,
                object
            );

            return;
        }


        if(
            type === "splitter"
        ) {

            item.direction =
                this.getAlternateDirection(
                    item.direction
                );

            return;
        }
    }


    cloneItem(item) {

        return {

            id:
                ++this.itemCounter,

            x:
                item.x,

            y:
                item.y,

            previousX:
                item.previousX,

            previousY:
                item.previousY,

            progress:
                item.progress,

            value:
                item.value,

            speed:
                item.speed,

            alive: true,

            lastObject:
                item.lastObject,

            direction:
                item.direction
        };
    }


    teleportItem(
        item,
        portal
    ) {

        const portals =
            this.objects.filter(
                object =>
                    object.data.type ===
                    "portal"
            );


        if(
            portals.length < 2
        )
            return;


        const other =
            portals.find(
                object =>
                    object.uid !==
                    portal.uid
            );


        if(other) {

            item.x =
                other.x;

            item.y =
                other.y;

            item.progress =
                0;
        }
    }


    getAlternateDirection(
        direction
    ) {

        if(
            direction === "right"
        )
            return "down";

        if(
            direction === "down"
        )
            return "left";

        if(
            direction === "left"
        )
            return "up";

        return "right";
    }


    /* =========================================================
       COLLECTORS
    ========================================================= */

    processCollectors() {

        let income = 0;


        const collectors =
            this.objects.filter(
                object =>
                    object.data.type ===
                    "collector"
            );


        if(
            collectors.length === 0
        ) {

            return 0;
        }


        for(
            const item
            of this.items
        ) {

            if(!item.alive)
                continue;


            for(
                const collector
                of collectors
            ) {

                if(
                    this.distance(
                        item,
                        collector
                    ) <=
                    this.grid * 0.8
                ) {

                    let value =
                        item.value;


                    /*
                     * Nearby multipliers
                     */

                    const multipliers =
                        this.objects.filter(
                            object =>
                                object.data.type ===
                                "multiplier"
                        );


                    for(
                        const multiplier
                        of multipliers
                    ) {

                        if(
                            this.distance(
                                multiplier,
                                collector
                            ) <= 150
                        ) {

                            value *=
                                Number(
                                    multiplier
                                        .data
                                        .multiplier ||
                                    1
                                );
                        }
                    }


                    /*
                     * Luck
                     */

                    const luck =
                        this.objects.filter(
                            object =>
                                object.id ===
                                "luck"
                        );


                    if(
                        luck.length
                    ) {

                        if(
                            Math.random() <
                            0.05
                        ) {

                            value *= 5;
                        }
                    }


                    /*
                     * Jackpot
                     */

                    const jackpots =
                        this.objects.filter(
                            object =>
                                object.id ===
                                "jackpot"
                        );


                    if(
                        jackpots.length
                    ) {

                        if(
                            Math.random() <
                            0.01
                        ) {

                            value *= 10;

                            this.flashMessage(
                                "JACKPOT!"
                            );
                        }
                    }


                    income +=
                        value;


                    item.alive =
                        false;


                    break;
                }
            }
        }


        return income;
    }


    findNearestCollector(
        x,
        y
    ) {

        const collectors =
            this.getObjectsByType(
                "collector"
            );


        let nearest =
            null;

        let best =
            Infinity;


        for(
            const collector
            of collectors
        ) {

            const distance =
                Math.hypot(
                    collector.x - x,
                    collector.y - y
                );


            if(
                distance < best
            ) {

                best =
                    distance;

                nearest =
                    collector;
            }
        }


        return nearest;
    }


    /* =========================================================
       DRAW
    ========================================================= */

    draw() {

        const rect =
            this.canvas.getBoundingClientRect();


        this.ctx.clearRect(
            0,
            0,
            rect.width,
            rect.height
        );


        this.drawBackground();

        this.drawGrid();

        this.drawFactory();

        this.drawItems();

        this.drawGhost();

        this.drawHover();
    }


    /* =========================================================
       BACKGROUND
    ========================================================= */

    drawBackground() {

        const rect =
            this.canvas.getBoundingClientRect();


        const gradient =
            this.ctx.createRadialGradient(
                rect.width / 2,
                rect.height / 2,
                0,
                rect.width / 2,
                rect.height / 2,
                Math.max(
                    rect.width,
                    rect.height
                )
            );


        gradient.addColorStop(
            0,
            "#151515"
        );


        gradient.addColorStop(
            1,
            "#080808"
        );


        this.ctx.fillStyle =
            gradient;


        this.ctx.fillRect(
            0,
            0,
            rect.width,
            rect.height
        );
    }


    /* =========================================================
       GRID
    ========================================================= */

    drawGrid() {

        const rect =
            this.canvas.getBoundingClientRect();


        const spacing =
            this.grid *
            this.camera.zoom;


        let offsetX =
            (
                -this.camera.x *
                this.camera.zoom +
                rect.width / 2
            ) % spacing;


        let offsetY =
            (
                -this.camera.y *
                this.camera.zoom +
                rect.height / 2
            ) % spacing;


        if(offsetX < 0)
            offsetX += spacing;

        if(offsetY < 0)
            offsetY += spacing;


        this.ctx.strokeStyle =
            "#171717";

        this.ctx.lineWidth = 1;


        for(
            let x = offsetX;
            x < rect.width;
            x += spacing
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                Math.round(x) + .5,
                0
            );

            this.ctx.lineTo(
                Math.round(x) + .5,
                rect.height
            );

            this.ctx.stroke();
        }


        for(
            let y = offsetY;
            y < rect.height;
            y += spacing
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                0,
                Math.round(y) + .5
            );

            this.ctx.lineTo(
                rect.width,
                Math.round(y) + .5
            );

            this.ctx.stroke();
        }
    }


    /* =========================================================
       FACTORY
    ========================================================= */

    drawFactory() {

        for(
            const object
            of this.objects
        ) {

            this.drawObject(
                object
            );
        }
    }


    /* =========================================================
       OBJECT DRAW
    ========================================================= */

    drawObject(object) {

        const ctx =
            this.ctx;


        const position =
            this.worldToScreen(
                object.x,
                object.y
            );


        const size =
            this.grid *
            this.camera.zoom;


        const half =
            size / 2;


        const data =
            object.data;


        /*
         * Base
         */

        ctx.fillStyle =
            "#111111";


        ctx.fillRect(
            position.x - half,
            position.y - half,
            size,
            size
        );


        /*
         * Border
         */

        ctx.strokeStyle =
            object ===
            this.selectedObject
            ? "#eeeeee"
            : "#373737";


        ctx.lineWidth =
            object ===
            this.selectedObject
            ? 2
            : 1;


        ctx.strokeRect(
            position.x - half,
            position.y - half,
            size,
            size
        );


        /*
         * Conveyor
         */

        if(
            data.type ===
            "conveyor"
        ) {

            this.drawConveyor(
                object,
                position,
                size
            );

            return;
        }


        /*
         * Spawner
         */

        if(
            data.type ===
            "spawner"
        ) {

            this.drawSpawner(
                object,
                position,
                size
            );

            return;
        }


        /*
         * Collector
         */

        if(
            data.type ===
            "collector"
        ) {

            this.drawCollector(
                object,
                position,
                size
            );

            return;
        }


        /*
         * Generic machine
         */

        this.drawMachine(
            object,
            position,
            size
        );
    }


    /* =========================================================
       CONVEYOR DRAW
    ========================================================= */

    drawConveyor(
        object,
        position,
        size
    ) {

        const ctx =
            this.ctx;


        const direction =
            object.direction ||
            "right";


        ctx.save();

        ctx.translate(
            position.x,
            position.y
        );


        const angle = {

            right: 0,

            down:
                Math.PI / 2,

            left:
                Math.PI,

            up:
                -Math.PI / 2

        }[direction] || 0;


        ctx.rotate(
            angle
        );


        /*
         * Belt lines
         */

        ctx.strokeStyle =
            "#303030";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(
            -size * .35,
            -size * .17
        );

        ctx.lineTo(
            size * .35,
            -size * .17
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            -size * .35,
            size * .17
        );

        ctx.lineTo(
            size * .35,
            size * .17
        );

        ctx.stroke();


        /*
         * Direction arrow
         */

        ctx.strokeStyle =
            "#999";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(
            -size * .2,
            0
        );

        ctx.lineTo(
            size * .2,
            0
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            size * .05,
            -size * .1
        );

        ctx.lineTo(
            size * .2,
            0
        );

        ctx.lineTo(
            size * .05,
            size * .1
        );

        ctx.stroke();


        ctx.restore();
    }


    /* =========================================================
       SPAWNER DRAW
    ========================================================= */

    drawSpawner(
        object,
        position,
        size
    ) {

        const ctx =
            this.ctx;


        ctx.fillStyle =
            "#252525";


        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
            size * .27,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#aaaaaa";

        ctx.lineWidth = 2;


        ctx.stroke();


        /*
         * Spawn pulse
         */

        const timer =
            object.timer || 0;


        const interval =
            Number(
                object.data.interval || 1
            );


        const progress =
            Math.min(
                1,
                timer / interval
            );


        ctx.strokeStyle =
            "#666";


        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
            size * .38,
            -Math.PI / 2,
            -Math.PI / 2 +
            Math.PI * 2 *
            progress
        );

        ctx.stroke();
    }


    /* =========================================================
       COLLECTOR DRAW
    ========================================================= */

    drawCollector(
        object,
        position,
        size
    ) {

        const ctx =
            this.ctx;


        ctx.fillStyle =
            "#222";


        ctx.fillRect(
            position.x -
            size * .3,

            position.y -
            size * .3,

            size * .6,
            size * .6
        );


        ctx.strokeStyle =
            "#ddd";

        ctx.lineWidth = 2;


        ctx.strokeRect(
            position.x -
            size * .3,

            position.y -
            size * .3,

            size * .6,
            size * .6
        );


        ctx.fillStyle =
            "#eee";


        ctx.font =
            `bold ${
                Math.max(
                    8,
                    size * .25
                )
            }px monospace`;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            "$",
            position.x,
            position.y
        );
    }


    /* =========================================================
       MACHINE DRAW
    ========================================================= */

    drawMachine(
        object,
        position,
        size
    ) {

        const ctx =
            this.ctx;


        const data =
            object.data;


        const inset =
            size * .14;


        ctx.fillStyle =
            "#191919";


        ctx.fillRect(
            position.x -
            size / 2 +
            inset,

            position.y -
            size / 2 +
            inset,

            size -
            inset * 2,

            size -
            inset * 2
        );


        ctx.strokeStyle =
            "#454545";

        ctx.lineWidth = 1;


        ctx.strokeRect(
            position.x -
            size / 2 +
            inset,

            position.y -
            size / 2 +
            inset,

            size -
            inset * 2,

            size -
            inset * 2
        );


        /*
         * Icon
         */

        ctx.fillStyle =
            "#bdbdbd";


        ctx.font =
            `bold ${
                Math.max(
                    7,
                    size * .22
                )
            }px monospace`;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            data.icon ||
            "?",

            position.x,
            position.y
        );
    }


    /* =========================================================
       ITEMS
    ========================================================= */

    drawItems() {

        for(
            const item of this.items
        ) {

            if(!item.alive)
                continue;


            const position =
                this.getInterpolatedItemPosition(
                    item
                );


            const screen =
                this.worldToScreen(
                    position.x,
                    position.y
                );


            const size =
                Math.max(
                    4,
                    7 *
                    this.camera.zoom
                );


            this.ctx.fillStyle =
                "#eeeeee";


            this.ctx.fillRect(
                screen.x -
                size / 2,

                screen.y -
                size / 2,

                size,
                size
            );
        }
    }


    getInterpolatedItemPosition(
        item
    ) {

        const t =
            Math.max(
                0,
                Math.min(
                    1,
                    item.progress
                )
            );


        return {

            x:
                item.x,

            y:
                item.y
        };
    }


    /* =========================================================
       GHOST
    ========================================================= */

    drawGhost() {

        if(
            !this.buildDefinition
        )
            return;


        const world =
            this.lastMouseWorld;


        if(!world)
            return;


        const point =
            this.snapPoint(
                world.x,
                world.y
            );


        const screen =
            this.worldToScreen(
                point.x,
                point.y
            );


        const size =
            this.grid *
            this.camera.zoom;


        const occupied =
            !!this.getObjectAt(
                point.x,
                point.y
            );


        this.ctx.save();


        this.ctx.strokeStyle =
            occupied
            ? "#666"
            : "#aaa";


        this.ctx.setLineDash([
            5,
            4
        ]);


        this.ctx.strokeRect(
            screen.x -
            size / 2,

            screen.y -
            size / 2,

            size,
            size
        );


        this.ctx.setLineDash([]);


        this.ctx.globalAlpha =
            occupied
            ? .25
            : .55;


        this.ctx.fillStyle =
            "#aaa";


        this.ctx.fillRect(
            screen.x -
            size / 2,

            screen.y -
            size / 2,

            size,
            size
        );


        this.ctx.globalAlpha =
            1;


        this.ctx.fillStyle =
            "#fff";


        this.ctx.font =
            `bold ${
                Math.max(
                    8,
                    size * .22
                )
            }px monospace`;


        this.ctx.textAlign =
            "center";


        this.ctx.textBaseline =
            "middle";


        this.ctx.fillText(
            this.buildDefinition.icon ||
            "?",

            screen.x,
            screen.y
        );


        this.ctx.restore();
    }


    /* =========================================================
       HOVER
    ========================================================= */

    drawHover() {

        if(
            !this.hoveredObject ||
            this.buildDefinition
        )
            return;


        const screen =
            this.worldToScreen(
                this.hoveredObject.x,
                this.hoveredObject.y
            );


        const size =
            this.grid *
            this.camera.zoom;


        this.ctx.strokeStyle =
            "#555";


        this.ctx.lineWidth = 1;


        this.ctx.strokeRect(
            screen.x -
            size / 2 -
            3,

            screen.y -
            size / 2 -
            3,

            size + 6,
            size + 6
        );
    }


    /* =========================================================
       DISTANCE
    ========================================================= */

    distance(a, b) {

        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    /* =========================================================
       CLEAR
    ========================================================= */

    clearFactory() {

        this.objects = [];

        this.items = [];

        this.selectedObject = null;
    }


    /* =========================================================
       FLOOR DATA
    ========================================================= */

    exportFloor() {

        return this.objects.map(
            object => ({

                id:
                    object.id,

                x:
                    object.x,

                y:
                    object.y,

                rotation:
                    object.rotation,

                direction:
                    object.direction
            })
        );
    }


    importFloor(data) {

        this.objects = [];

        this.items = [];


        if(
            !Array.isArray(data)
        )
            return;


        for(
            const saved of data
        ) {

            const definition =
                OBJECTS.find(
                    object =>
                        object.id ===
                        saved.id
                );


            if(!definition)
                continue;


            this.objects.push({

                uid:
                    this.createUID(),

                id:
                    saved.id,

                x:
                    saved.x,

                y:
                    saved.y,

                rotation:
                    saved.rotation ||
                    0,

                direction:
                    saved.direction ||
                    this.getDefaultDirection(
                        definition
                    ),

                data:
                    definition,

                timer: 0,

                progress: 0
            });
        }
    }


    /* =========================================================
       EVENTS
    ========================================================= */

    emitObjectPlaced(
        object
    ) {

        window.dispatchEvent(
            new CustomEvent(
                "factoryObjectPlaced",
                {
                    detail: object
                }
            )
        );
    }


    emitObjectDeleted(
        object
    ) {

        window.dispatchEvent(
            new CustomEvent(
                "factoryObjectDeleted",
                {
                    detail: object
                }
            )
        );
    }


    flashMessage(
        message
    ) {

        window.dispatchEvent(
            new CustomEvent(
                "factoryMessage",
                {
                    detail: {
                        message
                    }
                }
            )
        );
    }


    /* =========================================================
       UID
    ========================================================= */

    createUID() {

        if(
            typeof crypto !==
            "undefined" &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();
        }


        return (
            Date.now()
            .toString(36)
            +
            Math.random()
                .toString(36)
                .slice(2)
        );
    }


    /* =========================================================
       MAIN LOOP
    ========================================================= */

    loop(time) {

        let dt =
            (time -
            this.lastTime) /
            1000;


        this.lastTime =
            time;


        /*
         * Prevent giant jumps after
         * tab switching.
         */

        dt =
            Math.min(
                dt,
                0.1
            );


        this.update(
            dt
        );


        this.draw();


        window.dispatchEvent(
            new CustomEvent(
                "factoryTick",
                {
                    detail: {

                        money:
                            this.money,

                        production:
                            this.production,

                        objectCount:
                            this.objects.length,

                        itemCount:
                            this.items.length
                    }
                }
            )
        );


        requestAnimationFrame(
            nextTime =>
                this.loop(
                    nextTime
                )
        );
    }
    }
