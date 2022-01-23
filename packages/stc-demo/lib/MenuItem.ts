import Item from './Item';

export default class MenuItem extends Item {
    public link;
    public linkTitle;
    public activeMenu;
    public htmlPage;

    constructor(id, title, relations, link) {
        super(id, title, relations);
        this.link = link;
    }

    public set setHtmlPage(page) {
        this.htmlPage = page;
    }

    hit() {
        if (this.parent.activeItem === this) {
            return;
        }
        if (this.title === 'Home') {
            this.parent.disabledRelations['rightGallery'] = this.parent.relations.right;
            this.parent.setRelation('right', null);
        } else if (this.title === 'Gallery') {
            this.parent.setRelation('right', this.parent.disabledRelations['rightGallery'])
            this.parent.disabledRelations['rightGallery'] = null;
        }
        this.htmlPage.style.display = 'block';
        this.parent.activeItem.htmlPage.style.display = 'none';
        this.parent.setActiveItem = this;
    }

}
