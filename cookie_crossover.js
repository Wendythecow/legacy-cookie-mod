(function () {
    function waitForGame() {
        if (typeof Game === "undefined" || !Game.ready) {
            setTimeout(waitForGame, 200);
            return;
        }
        initMod();
    }
    waitForGame();

    function initMod() {
        const CookieMod = {
            id: "cookieCrossover",
            name: "Cookie Crossover",
            version: "1.0",

            cookies: 0,
            cookiesPs: 0,

            init() {
                this.addResource();
                this.addBuilding();
                this.addTab();
                this.hookLogic();
                Game.mods[this.id] = this;
                console.log("[Cookie Crossover] Loaded");
            },

            addResource() {
                Game.resources.cookies = {
                    name: "Cookies",
                    amount: 0,
                    display: 1,
                    icon: [0, 0],
                    color: "#d28b47",
                    gain: function (amt) {
                        this.amount += amt;
                    },
                    lose: function (amt) {
                        this.amount = Math.max(0, this.amount - amt);
                    }
                };
            },

            addBuilding() {
                const id = Game.buildingsN;
                Game.buildingsN++;

                Game.buildings[id] = {
                    id: id,
                    name: "Cursor",
                    desc: "Clicks the cookie for you. Produces 0.1 cookies per second.",
                    icon: [0, 0],
                    amount: 0,
                    baseCost: 50,
                    requireTech: "",
                    unlockReq: 0,

                    cost() {
                        return Math.floor(this.baseCost * Math.pow(1.15, this.amount));
                    },

                    buy() {
                        const price = this.cost();
                        if (Game.resources.food.amount >= price) {
                            Game.resources.food.amount -= price;
                            this.amount++;
                            Game.Gui.refresh();
                        }
                    },

                    tick() {
                        CookieMod.cookies += 0.1 * this.amount * Game.delta;
                    },

                    draw() {
                        return `
                            <div class="building">
                                <div class="name">${this.name}</div>
                                <div class="desc">${this.desc}</div>
                                <div class="line">Owned: ${this.amount}</div>
                                <button onclick="Game.buildings[${id}].buy()">Buy (${this.cost()} food)</button>
                            </div>
                        `;
                    }
                };
            },

            addTab() {
                Game.Gui.addTab("Cookie Clicker", () => {
                    return `
                        <div class="title">Cookie Crossover</div>
                        <div class="block">
                            <div style="margin:20px;">
                                <button onclick="CookieMod.clickCookie()" style="
                                    width:150px;height:150px;border-radius:75px;
                                    font-size:20px;">🍪</button>
                            </div>

                            <div class="line">Cookies: ${Math.floor(this.cookies)}</div>
                            <div class="line">Cookies/sec: ${this.cookiesPs.toFixed(2)}</div>

                            <div class="subsection">
                                <div class="title">Cursor</div>
                                ${Game.buildings.find(b => b.name === "Cursor").draw()}
                            </div>
                        </div>
                    `;
                });
            },

            clickCookie() {
                this.cookies += 1;
            },

            hookLogic() {
                const oldLogic = Game.Logic;
                Game.Logic = () => {
                    oldLogic();
                    this.logicTick();
                };
            },

            logicTick() {
                const cursor = Game.buildings.find(b => b.name === "Cursor");
                if (cursor) {
                    this.cookiesPs = cursor.amount * 0.1;
                    this.cookies += this.cookiesPs * Game.delta;
                }

                Game.resources.cookies.amount = this.cookies;
            }
        };

        CookieMod.init();
        window.CookieMod = CookieMod;
    }
})();
