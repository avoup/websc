// @ts-ignore
const STC = window.stc.STC;
// @ts-ignore
const classes = window.stc.classes;
// @ts-ignore
const STC_UI = window.stcUI
const MODEL_URL = 'public/model/model.json';


(async () => {

    // Menu item
    class Item {
        public id;
        public title;
        public relations;

        constructor(id, title, relations?) {
            this.id = id;
            this.title = title;
            this.relations = relations || {};
        }

        hit() {
            console.log(this.title)
        }

        setRelation(direction, element) {
            this.relations[direction] = element;
        }
    }

    let ACTIVE;

    /**
     * Create html element
     * @param {Item} param0 - menu item
     * @param {string} classes - initial classes for html element
     * @returns html element
     */
    const createHtmlEl = ({id, title, onHit}, classes) => {
        const div = document.createElement("div");
        div.innerText = title;
        div.id = id;
        div.className = classes
        div.addEventListener("click", onHit);
        return div;
    };
    /**
     * Create menu items and corresponding html elements
     *
     * @param {number} x - elements in column
     * @param {number} count - element count
     * @returns map of menu items and html elements
     */
    const createItems = (x, count) => {
        const items = {};
        const htmlElements = {};

        for (let i = 0; i < count; i++) {
            const currId = `item${i}`
            const prevId = `item${i - 1}`
            items[currId] = new Item('item' + i, 'Item ' + i);
            htmlElements[currId] = createHtmlEl(items[currId], 'grid-item');

            if (i % x > 0) {
                items[currId].setRelation('left', items[prevId]);
                items[prevId].setRelation('right', items[currId]);
            }
            if (Math.trunc(i / x) > 0) {
                items[currId].setRelation('up', items[`item${i - x}`])
                items[`item${i - x}`].setRelation('down', items[currId])
            }

        }
        return {items, htmlElements}
    }

    /**
     *
     * @param {Item} active - currently active element
     * @param {string} direction - change direction
     * @param {*} htmlElements - menu item html elements' map
     * @returns next active element
     */
    const changeActive = (active, direction, htmlElements) => {
        if (!active.relations[direction]) return active

        htmlElements[active.id].classList.remove("active");
        htmlElements[active.relations[direction].id].classList.add("active");

        return active.relations[direction];
    };

// Create menu items
    const {items: menuItems, htmlElements} = createItems(3, 11);

// Populate menu
    const gridMenu = document.getElementById("grid-menu")!;
    for (let key in htmlElements) {
        gridMenu.appendChild(htmlElements[key]);
    }

// Make first element active
    ACTIVE = menuItems[Object.keys(menuItems)[0]];
    htmlElements[ACTIVE.id].classList.add('active');

    // Initialize speech recognition
    const stc = new STC();
    await stc.loadModel(MODEL_URL, classes);
    stc.addEventListener('predict', ({detail}) => {
        const activator = (direction) => ACTIVE = changeActive(ACTIVE, direction, htmlElements)
        switch (detail.predictedWord) {
            case "მარცხნივ":
                return activator("left");
            case "მარჯვნივ":
                return activator("right");
            case "ზევით":
                return activator("up");
            case "ქვევით":
                return activator("down");
            case "წინ":
                return ACTIVE.hit();
        }
    })

    new STC_UI.default(stc, {threshold: 0.58});
// Listen to keyboard press events
    document.addEventListener("keydown", (event) => {
        const activator = (direction) => ACTIVE = changeActive(ACTIVE, direction, htmlElements)
        switch (event.key) {
            case "ArrowLeft":
                return activator("left");
            case "ArrowRight":
                return activator("right");
            case "ArrowUp":
                return activator("up");
            case "ArrowDown":
                return activator("down");
            case "Enter":
                return ACTIVE.hit();
        }
    });

})()

