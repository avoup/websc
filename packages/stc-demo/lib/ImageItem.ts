import Item from './Item';

export default class MenuItem extends Item {
    public img;
    public text;

    constructor(id, title, relations, img, text) {
        super(id, title, relations);
        this.img = img;
        this.text = text;
    }

    hit() {
        // @ts-ignore
        document.getElementById("img01")!.src = this.img;
        document.getElementById("modal01")!.style.display = "block";
        const captionText = document.getElementById("caption")!;
        captionText.innerHTML = this.text;
    }

}
