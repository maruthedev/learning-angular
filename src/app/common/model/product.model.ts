export class Product{
    public id: string;
    public name: string;
    public price: number;
    public image_url: string;
    public is_active: number;
    constructor(
        id: string,
        name: string,
        price: number,
        image_url: string,
        is_active: number
    ){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image_url = image_url;
        this.is_active = is_active;
    }
}