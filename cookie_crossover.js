(function () {
    // Wait for the game to finish loading
    var check = setInterval(function () {
        if (typeof Game === "undefined" || !Game.ready) return;
        clearInterval(check);
        init();
    }, 200);

    function init() {
        console.log("[Cookie Crossover] Loaded");

        // --- Add resource ---
        Game.resources.cookies = {
            name: "Cookies",
            amount: 0,
            display: 1,
            icon: [0, 0],
            color: "#d28b47"
        };

        // --- Add building ---
        var id = Game.buildings.length;
        Game.buildings.push({
            id: id,
            name: "Cursor",
            desc: "Clicks the cookie for you. Produces 0.1 cookies per second.",
            icon: [0, 0],
            amount: 0,
            baseCost: 50,

            cost: function () {
                return Math.floor(this.baseCost * Math.pow(1.15, this.amount));
            },

            buy: function () {
                var price = this.cost();
                if (Game.resources.food.amount >= price) {
                    Game.resources.food.amount -= price;
                    this.amount++;
                }
            },

            tick: function (delta) {
                Game.resources.cookies.amount += 0.1 * this.amount * delta;
            },

            draw: function () {
                return (
                    "<div class='building'>" +
                    "<div class='name'>" + this.name + "</div>" +
                    "<div class='desc'>" + this.desc + "</div>" +
                    "<div class='line'>Owned: " + this.amount + "</div>" +
                    "<button onclick='Game.buildings[" + id + "].buy()'>Buy (" + this.cost() + " food)</button>" +
                    "</div>"
                );
            }
        });

        // --- Add tab ---
        Game.tabs.push({
            name: "Cookie Clicker",
            id: "cookieTab",
            draw: function () {
                var cursor = Game.buildings[id];
                return (
                    "<div class='title'>Cookie Crossover</div>" +
                    "<div class='block'>" +
                    "<button onclick='Game.resources.cookies.amount++' " +
                    "style='width:150px;height:150px;border-radius:75px;font-size:20px;'>🍪</button>" +
                    "<div class='line'>Cookies: " + Math.floor(Game.resources.cookies.amount) + "</div>" +
                    "<div class='line'>Cookies/sec: " + (cursor.amount * 0.1).toFixed(2) + "</div>" +
                    "<div class='subsection'><div class='title'>Cursor</div>" +
                    cursor.draw() +
                    "</div></div>"
                );
            }
        });

        // --- Hook logic ---
        var oldLogic = Game.Logic;
        Game.Logic = function () {
            oldLogic();
            var delta = Game.fps / 30;
            Game.buildings[id].tick(delta);
        };
    }
})();
