import { User } from "./user.model";

export class Member extends User {
    public id: string;
    public name: string;
    public gender?: string;
    public age: number;
    public tel?: string;
    public role: string;

    constructor(
        id: string,
        name: string,
        gender: string | undefined,
        age: number,
        tel: string | undefined,
        role: string,
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
        this.email = email;
        this.password = password;
    }
}