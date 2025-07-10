import { User } from "./user.model";

export class Member extends User {
    public id: string;
    public name: string;
    public gender?: string;
    public age: number;
    public tel?: string;
    public role: string;
    public is_active: number;
    public avatar_image_url: string | null;

    constructor(
        id: string,
        name: string,
        gender: string | undefined,
        age: number,
        tel: string | undefined,
        role: string,
        is_active: number,
        avatar_image_url: string | null,
        email: string,
        password: string | null
    ) {
        super(email, password);
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.tel = tel;
        this.role = role;
        this.is_active = is_active;
        this.avatar_image_url = avatar_image_url;
        this.email = email;
        this.password = password;
    }
}