import Item from './Item';
import ImageItem from './ImageItem';
import MenuItem from './MenuItem';

// @ts-ignore
const STC = window.stc.STC;
// @ts-ignore
const classes = window.stc.classes;
// @ts-ignore
const STC_UI = window.stcUI
const MODEL_URL = 'public/model/model.json';

const imageList = [
    "https://i.picsum.photos/id/962/700/500.jpg?hmac=FDh1QUr0zBRSyBvYCw1LHj5bFY47ZUZGcTVoz8-28v8",
    "https://i.picsum.photos/id/131/700/500.jpg?hmac=ApQ1hoHDisaPxCZSiEcaXLWwHyZxLTksEmvCpcgGCpc",
    "https://i.picsum.photos/id/75/700/500.jpg?hmac=fyRrQqcixhfx7joEvfduoaq6pR3IJbcTr_cp9uPYYaQ",
    "https://i.picsum.photos/id/240/700/500.jpg?hmac=zhzfdgYwXWbwhn4vKJAarbPkItAEZf2qMM-_r_fQbqs",
    "https://i.picsum.photos/id/110/700/500.jpg?hmac=u-cK9_PTu0IgVE8zol4ngwnkJgB6TWtyw0xR6F5twrc",
    "https://i.picsum.photos/id/181/700/500.jpg?hmac=SxckdjSH1ZYJIDJkiVVWXcCG3WBhTFKnBL27IlpMdLw",
    "https://i.picsum.photos/id/910/700/500.jpg?hmac=eNr6KGg-ucKS-ZC60-2jZLOdnWRewYXZQE9wZz7Rr2o",
    "https://i.picsum.photos/id/594/700/500.jpg?hmac=RJvCwoVlC9_MJEunoM7lkmVUIRuOwog4MTGe80F-ziM",
    "https://i.picsum.photos/id/445/700/500.jpg?hmac=ERbG1ETtO-7DADWe5QgtlXOj32GFboxHuF7cxJYj8-o",
];

const homePage = document.getElementById('mainPage')!;
const galleryPage = document.getElementById('galleryPage')!;
const contactPage = document.getElementById('contactPage')!;
homePage.style.display = 'block';
galleryPage.style.display = 'none';
contactPage.style.display = 'none';

(async () => {
    let ACTIVE_ITEM;

    const createImgEl = ({id, title, onHit, img: imgSrc}, classes) => {
        const img = document.createElement('img');
        img.id = id;
        img.className = classes;
        img.addEventListener("click", onHit);
        img.src = imgSrc;
        return img;
    };

    const changeActive = (active, direction, items) => {
        if (!active.relations[direction]) {
            if (active.parent && active.parent.relations[direction]) {
                if (active.parent.relations[direction].initialItem) {
                    active.htmlElement.classList.remove('active');
                    active.parent.relations[direction].initialItem.htmlElement.classList.add('active');
                    return active.parent.relations[direction].initialItem;
                }
            }
            return active
        }

        items[active.id].htmlElement.classList.remove("active");
        items[active.relations[direction].id].htmlElement.classList.add("active");

        return active.relations[direction];
    };

    function closeModal() {
        document.getElementById('modal01')!.style.display = 'none';
    }

    // Create parent items
    const menuParent = new Item('menuParent', 'Menu Parent', {})
    const galleryParent = new Item('galleryParent', 'Gallery Parent', {})

    menuParent.disabledRelations['rightGallery'] = galleryParent;
    galleryParent.setRelation('left', menuParent);

    // Create navigation menu ----------------
    const createLinkEl = ({id, title, onHit}, classes) => {
        const el = document.createElement('a');
        el.id = id;
        el.className = classes;
        el.addEventListener("click", onHit);
        el.href = '#' + id;
        el.innerText = title;
        return el;
    };

    const createMenuItems = (parent) => {
        const items = {};

        items['item0'] = new MenuItem('item0', 'Home', {}, 'homePage');
        items['item0'].setHtmlElement = createLinkEl(items['item0'], `w3-bar-item w3-button w3-hover-white`);
        items['item0'].setParent = parent;
        items['item0'].setHtmlPage = homePage;

        items['item1'] = new MenuItem('item1', 'Gallery', {}, 'galleryPage');
        items['item1'].setHtmlElement = createLinkEl(items['item1'], `w3-bar-item w3-button w3-hover-white`);
        items['item1'].setParent = parent;
        items['item1'].setHtmlPage = galleryPage;

        items['item2'] = new MenuItem('item2', 'Contact', {}, 'contactPage');
        items['item2'].setHtmlElement = createLinkEl(items['item2'], `w3-bar-item w3-button w3-hover-white`);
        items['item2'].setParent = parent;
        items['item2'].setHtmlPage = contactPage;

        items['item0'].setRelation('down', items['item1'])
        items['item1'].setRelation('up', items['item0'])
        items['item1'].setRelation('down', items['item2'])
        items['item2'].setRelation('up', items['item1'])

        menuParent.setInitItem = items['item0'];
        menuParent.setChildren = items;
        menuParent.setActiveItem = items['item0'];
        return items
    }

    const menuItems = createMenuItems(menuParent);
    const navMenu = document.getElementById('stc-menu')!;
    for (let key in menuItems) {
        navMenu.appendChild(menuItems[key].htmlElement);
    }

    // Create gallery items ---------------------
    const createGalleryItems = (x, count, parent) => {
        const items = {};

        for (let i = 0; i < count; i++) {
            const currId = `item${i}`
            const prevId = `item${i - 1}`
            items[currId] = new ImageItem('item' + i, 'Item ' + i, null, imageList[i], "Some caption");
            items[currId].setHtmlElement = createImgEl(items[currId], `w3-col m${12 / x} grid-item`);
            items[currId].setParent = parent;

            if (i === 0) {
                galleryParent.setInitItem = items[currId];
            }

            if (i % x > 0) {
                items[currId].setRelation('left', items[prevId]);
                items[prevId].setRelation('right', items[currId]);
            }
            if (Math.trunc(i / x) > 0) {
                items[currId].setRelation('up', items[`item${i - x}`])
                items[`item${i - x}`].setRelation('down', items[currId])
            }

        }

        galleryParent.setChildren = items;
        return items
    }

    const galleryItems = createGalleryItems(3, 9, galleryParent);

    const gridMenu = document.getElementById("stc-gallery-menu")!;
    for (let key in galleryItems) {
        gridMenu.appendChild(galleryItems[key].htmlElement);
    }

    // Make first element active
    ACTIVE_ITEM = menuItems[Object.keys(galleryItems)[0]];
    menuItems[ACTIVE_ITEM.id].htmlElement.classList.add('active');

    // Initialize speech recognition
    const stc = new STC();
    await stc.loadModel(MODEL_URL, classes);
    stc.addEventListener('onPrediction', ({detail}) => {
        const activator = (direction) => {
            ACTIVE_ITEM = changeActive(ACTIVE_ITEM, direction, ACTIVE_ITEM.parent.children)
            ACTIVE_ITEM.parent.setInitItem = ACTIVE_ITEM;
            ACTIVE_ITEM.parent.children[ACTIVE_ITEM.id].htmlElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
        switch (detail.predictedWord) {
            case "მარცხნივ":
                return activator("left");
            case "მარჯვნივ":
                return activator("right");
            case "ზევით":
                return activator("up");
            case "ქვევით":
                return activator("down");
            case "უკან":
                return closeModal();
            case "წინ":
                return ACTIVE_ITEM.hit();
        }
    })

    new STC_UI.default(stc, {threshold: 0.58});
// Listen to keyboard press events
//     document.addEventListener("keydown", (event) => {
//         const activator = (direction) => ACTIVE = changeActive(ACTIVE, direction, htmlElements)
//         switch (event.key) {
//             case "ArrowLeft":
//                 return activator("left");
//             case "ArrowRight":
//                 return activator("right");
//             case "ArrowUp":
//                 return activator("up");
//             case "ArrowDown":
//                 return activator("down");
//             case "Enter":
//                 return ACTIVE.hit();
//         }
//     });

})()

