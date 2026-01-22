(function () {
    // Wait for the game to finish loading
    var wait = setInterval(function () {
        if (typeof Game !== "undefined" && Game.ready) {
            clearInterval(wait);
            startMod();
        }
    }, 200);

    function startMod() {
        console.log("[Cookie Mod] Loaded for old Legacy engine");

        // --- Add new resource ---
        var cookieRes = {
            id: Game.res.length,
            name: "Cookies",
            icon: [0, 0],
            amount: 0,
            max: 0,
            display: 1,
            category: 0
        };
        Game.res.push(cookieRes);

        // --- Add new building ---
        var cursor = {
            id: Game.unit.length,
            name: "Cookie Cursor",
            desc: "Clicks cookies for you.",
            icon: [0, 0],
            amount: 0,
            baseCost: 50,
            cost: function () {
                return Math.floor(this.baseCost * Math.pow(1.15, this.amount));
            },
            buy: function () {
                var price = this.cost();
                if (Game.res[42].amount >= price) { // wood
                    Game.res[42].amount -= price;
                    this.amount++;
                }
            },
            tick: function (delta) {
                Game.res[cookieRes.id].amount += this.amount * 0.1 * delta;
            }
        };
        Game.unit.push(cursor);

        // --- Add new tab ---
        Game.tabs.push({
            id: "cookieTab",
            name: "Cookie Clicker",
            draw: function () {
                var html = "<div class='title'>Cookie Clicker</div>";
                html += "<button onclick='Game.res[" + cookieRes.id + "].amount++' style='width:150px;height:150px;border-radius:75px;font-size:20px;'>🍪</button>";
                html += "<div class='line'>Cookies: " + Math.floor(Game.res[cookieRes.id].amount) + "</div>";
                html += "<div class='line'>Cursors: " + cursor.amount + "</div>";
                html += "<button onclick='Game.unit[" + cursor.id + "].buy()'>Buy Cursor (" + cursor.cost() + " wood)</button>";
                return html;
            }
        });

        // --- Hook into game logic ---
        var oldLogic = Game.Logic;
        Game.Logic = function () {
            oldLogic();
            cursor.tick(Game.fps / 30);
        };
    }
})();
