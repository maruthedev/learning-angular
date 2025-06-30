export class Product{
    public id: string;
    public name: string;
    public price: number;
    public image_url: string;
    constructor(
        id: string,
        name: string,
        price: number,
        image_url: string
    ){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image_url = image_url;
    }
}