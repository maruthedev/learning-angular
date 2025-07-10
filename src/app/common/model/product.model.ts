export class Product{
    public id: string;
    public name: string;
    public price: number;
    public image_url: string;
    public is_active: number;
    public is_discount_available: number;
    constructor(
        id: string,
        name: string,
        price: number,
        image_url: string,
        is_active: number,
        is_discount_available: number
    ){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image_url = image_url;
        this.is_active = is_active;
        this.is_discount_available = is_discount_available;
    }

    public static getEmptyProduct(): Product{
        return new Product("", "", 0, "", 1, 0);
    }
}