export default class Item {
    public id;
    public title;
    public relations;
    public parent;
    public children;
    public htmlElement;
    public initialItem;
    public activeItem;
    public disabledRelations = {};

    constructor(id, title, relations) {
        this.id = id;
        this.title = title;
        this.relations = relations || {};
    }

    setRelation(direction, element) {
        this.relations[direction] = element;
    }

    public set setParent(parent) {
        this.parent = parent;
    }

    public set setChildren(children) {
        this.children = children;
    }

    public set setHtmlElement(el) {
        this.htmlElement = el;
    }

    public set setInitItem(item) {
        this.initialItem = item;
    }

    public set setActiveItem(item) {
        this.activeItem = item;
    }

}
