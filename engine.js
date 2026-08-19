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

        this.lastTime = performance.now();

        this.money = 500;

        this.production = 0;

        this.selectedObject = null;

        this.draggingCamera = false;

        this.lastMouse = {
            x: 0,
            y: 0
        };

        this.resize();

        window.addEventListener(
            "resize",
            () => this.resize()
        );

        this.bindMouse();

        requestAnimationFrame(
            t => this.loop(t)
        );
    }


    resize() {

        const rect =
            this.canvas.getBoundingClientRect();

        this.canvas.width =
            rect.width * devicePixelRatio;

        this.canvas.height =
            rect.height * devicePixelRatio;

        this.ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );
    }


    screenToWorld(x,y) {

        const rect =
            this.canvas.getBoundingClientRect();

        const sx = x - rect.left;
        const sy = y - rect.top;

        return {
            x:
                (sx -
                rect.width / 2) /
                this.camera.zoom +
                this.camera.x,

            y:
                (sy -
                rect.height / 2) /
                this.camera.zoom +
                this.camera.y
        };
    }


    snap(value) {

        return Math.round(
            value / this.grid
        ) * this.grid;
    }


    worldToScreen(x,y) {

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


    bindMouse() {

        this.canvas.addEventListener(
            "mousedown",
            e => {

                const p =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );

                if(e.button === 2) {

                    this.deleteAt(
                        this.snap(p.x),
                        this.snap(p.y)
                    );

                    return;
                }

                if(e.button === 1) {

                    this.draggingCamera = true;

                    this.lastMouse.x =
                        e.clientX;

                    this.lastMouse.y =
                        e.clientY;

                    return;
                }

                if(
                    this.selectedObject
                ) {

                    this.place(
                        this.snap(p.x),
                        this.snap(p.y)
                    );

                } else {

                    const found =
                        this.getObjectAt(
                            this.snap(p.x),
                            this.snap(p.y)
                        );

                    if(found) {

                        this.select(
                            found
                        );

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


        window.addEventListener(
            "mousemove",
            e => {

                if(
                    !this.draggingCamera
                ) return;

                const dx =
                    e.clientX -
                    this.lastMouse.x;

                const dy =
                    e.clientY -
                    this.lastMouse.y;

                this.camera.x -=
                    dx /
                    this.camera.zoom;

                this.camera.y -=
                    dy /
                    this.camera.zoom;

                this.lastMouse.x =
                    e.clientX;

                this.lastMouse.y =
                    e.clientY;

            }
        );


        this.canvas.addEventListener(
            "contextmenu",
            e => e.preventDefault()
        );


        this.canvas.addEventListener(
            "wheel",
            e => {

                e.preventDefault();

                const old =
                    this.camera.zoom;

                this.camera.zoom *=
                    e.deltaY < 0
                    ? 1.1
                    : .9;

                this.camera.zoom =
                    Math.max(
                        .25,
                        Math.min(
                            3,
                            this.camera.zoom
                        )
                    );

                const before =
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    );

                this.camera.x +=
                    before.x -
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    ).x;

                this.camera.y +=
                    before.y -
                    this.screenToWorld(
                        e.clientX,
                        e.clientY
                    ).y;

            },
            {
                passive:false
            }
        );
    }


    place(x,y) {

        const data =
            this.selectedObject;

        if(!data) return;

        if(
            this.objects.some(
                o =>
                    o.x === x &&
                    o.y === y
            )
        ) return;

        if(
            this.money <
            data.cost
        ) return;

        this.money -=
            data.cost;

        const object = {

            uid:
                crypto.randomUUID(),

            id:
                data.id,

            x,
            y,

            rotation:0,

            data

        };

        this.objects.push(object);

        this.select(object);
    }


    deleteAt(x,y) {

        const index =
            this.objects.findIndex(
                o =>
                    o.x === x &&
                    o.y === y
            );

        if(index === -1)
            return;

        const object =
            this.objects[index];

        this.money +=
            Math.floor(
                object.data.cost *
                .5
            );

        this.objects.splice(
            index,
            1
        );
    }


    getObjectAt(x,y) {

        return this.objects.find(
            o =>
                o.x === x &&
                o.y === y
        );
    }


    select(object) {

        this.selectedObject =
            null;

        window.dispatchEvent(
            new CustomEvent(
                "factorySelect",
                {
                    detail: object
                }
            )
        );
    }


    update(dt) {

        if(!this.running)
            return;

        let income = 0;

        for(
            const object
            of this.objects
        ) {

            const d =
                object.data;

            if(
                d.type === "spawner"
            ) {

                object.timer =
                    (object.timer || 0)
                    + dt;

                if(
                    object.timer >=
                    d.interval
                ) {

                    object.timer = 0;

                    this.items.push({

                        x: object.x,
                        y: object.y,

                        value:
                            d.value || 1,

                        progress:0,

                        speed:1,

                        alive:true
                    });
                }
            }

            if(
                d.type === "bank"
            ) {

                income +=
                    dt * 2;
            }
        }


        for(
            const item
            of this.items
        ) {

            item.progress +=
                dt * .8;

            if(
                item.progress >= 1
            ) {

                item.progress = 0;

                const next =
                    this.findNextConveyor(
                        item
                    );

                if(next) {

                    item.x =
                        next.x;

                    item.y =
                        next.y;

                } else {

                    const collector =
                        this.findCollector();

                    if(collector) {

                        let multiplier = 1;

                        for(
                            const object
                            of this.objects
                        ) {

                            if(
                                object.data.type ===
                                "multiplier"
                            ) {

                                if(
                                    this.distance(
                                        object,
                                        item
                                    ) < 120
                                ) {

                                    multiplier *=
                                        object.data.multiplier ||
                                        1;
                                }
                            }

                            if(
                                object.data.type ===
                                "machine"
                            ) {

                                if(
                                    this.distance(
                                        object,
                                        item
                                    ) < 100
                                ) {

                                    multiplier *=
                                        object.data.multiplier ||
                                        1;
                                }
                            }

                            if(
                                object.data.type ===
                                "booster"
                            ) {

                                if(
                                    this.distance(
                                        object,
                                        item
                                    ) < 100
                                ) {

                                    multiplier *=
                                        object.data.multiplier ||
                                        1;
                                }
                            }
                        }

                        income +=
                            item.value *
                            multiplier;

                        item.alive = false;
                    }
                }
            }
        }


        this.items =
            this.items.filter(
                i => i.alive
            );

        this.money += income;

        this.production =
            income /
            Math.max(dt, .016);
    }


    findNextConveyor(item) {

        const candidates =
            this.objects.filter(
                o =>
                    o.data.type ===
                    "conveyor"
            );

        let closest = null;

        let distance = 70;

        for(
            const c of candidates
        ) {

            const d =
                this.distance(
                    c,
                    item
                );

            if(d < distance) {

                closest = c;

                distance = d;
            }
        }

        return closest;
    }


    findCollector() {

        return this.objects.find(
            o =>
                o.data.type ===
                "collector"
        );
    }


    distance(a,b) {

        return Math.hypot(
            a.x-b.x,
            a.y-b.y
        );
    }


    draw() {

        const ctx =
            this.ctx;

        const rect =
            this.canvas.getBoundingClientRect();

        ctx.clearRect(
            0,
            0,
            rect.width,
            rect.height
        );

        this.drawGrid();

        ctx.save();

        for(
            const object
            of this.objects
        ) {

            this.drawObject(
                object
            );
        }

        for(
            const item
            of this.items
        ) {

            this.drawItem(
                item
            );
        }

        ctx.restore();

        this.drawGhost();
    }


    drawGrid() {

        const ctx =
            this.ctx;

        const rect =
            this.canvas.getBoundingClientRect();

        const spacing =
            this.grid *
            this.camera.zoom;

        const ox =
            (-this.camera.x *
            this.camera.zoom +
            rect.width/2)
            % spacing;

        const oy =
            (-this.camera.y *
            this.camera.zoom +
            rect.height/2)
            % spacing;

        ctx.strokeStyle =
            "#171717";

        ctx.lineWidth = 1;

        for(
            let x=ox;
            x<rect.width;
            x+=spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                rect.height
            );

            ctx.stroke();
        }

        for(
            let y=oy;
            y<rect.height;
            y+=spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                rect.width,
                y
            );

            ctx.stroke();
        }
    }


    drawObject(object) {

        const ctx =
            this.ctx;

        const p =
            this.worldToScreen(
                object.x,
                object.y
            );

        const size =
            this.grid *
            this.camera.zoom;

        const d =
            object.data;

        ctx.fillStyle =
            "#151515";

        ctx.strokeStyle =
            "#555";

        ctx.lineWidth = 1;

        ctx.fillRect(
            p.x-size/2,
            p.y-size/2,
            size,
            size
        );

        ctx.strokeRect(
            p.x-size/2,
            p.y-size/2,
            size,
            size
        );


        if(
            d.type === "conveyor"
        ) {

            ctx.strokeStyle =
                "#666";

            ctx.lineWidth =
                Math.max(
                    1,
                    2*this.camera.zoom
                );

            ctx.beginPath();

            ctx.moveTo(
                p.x-size*.25,
                p.y
            );

            ctx.lineTo(
                p.x+size*.25,
                p.y
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                p.x+size*.1,
                p.y-size*.12
            );

            ctx.lineTo(
                p.x+size*.25,
                p.y
            );

            ctx.lineTo(
                p.x+size*.1,
                p.y+size*.12
            );

            ctx.stroke();

        } else {

            ctx.fillStyle =
                "#aaa";

            ctx.font =
                `bold ${Math.max(
                    8,
                    10*this.camera.zoom
                )}px monospace`;

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                d.icon || "?",
                p.x,
                p.y
            );
        }


        if(
            object ===
            this.selectedObject
        ) {

            ctx.strokeStyle =
                "#fff";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                p.x-size/2-2,
                p.y-size/2-2,
                size+4,
                size+4
            );
        }
    }


    drawItem(item) {

        const p =
            this.worldToScreen(
                item.x,
                item.y
            );

        const size =
            7 *
            this.camera.zoom;

        ctx.fillStyle =
            "#eee";

        ctx.fillRect(
            p.x-size/2,
            p.y-size/2,
            size,
            size
        );
    }


    drawGhost() {

        if(!this.selectedObject)
            return;

        const rect =
            this.canvas.getBoundingClientRect();

        const mouse =
            this.lastMouseWorld;

        if(!mouse)
            return;

        const p =
            this.worldToScreen(
                this.snap(mouse.x),
                this.snap(mouse.y)
            );

        const size =
            this.grid *
            this.camera.zoom;

        this.ctx.strokeStyle =
            "#777";

        this.ctx.setLineDash([
            4,
            4
        ]);

        this.ctx.strokeRect(
            p.x-size/2,
            p.y-size/2,
            size,
            size
        );

        this.ctx.setLineDash([]);
    }


    loop(time) {

        const dt =
            Math.min(
                .1,
                (time -
                this.lastTime) /
                1000
            );

        this.lastTime =
            time;

        this.update(dt);

        this.draw();

        window.dispatchEvent(
            new CustomEvent(
                "factoryTick",
                {
                    detail:{
                        money:this.money,
                        production:this.production
                    }
                }
            )
        );

        requestAnimationFrame(
            t => this.loop(t)
        );
    }
  }
