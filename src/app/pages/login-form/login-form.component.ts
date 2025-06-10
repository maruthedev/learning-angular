import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  adminUser: any = {
    id: "1",
    name: "admin",
    gender: "male",
    age: "25",
    tel: "123456",
    email: "admin@domain.com",
    password: "admin"
  }

  loginUser: any ={
    email: "",
    password: ""
  }

  onSubmit(): void{
    if(this.loginUser.email == this.adminUser.email && this.loginUser.password == this.adminUser.password){
      confirm(`logged in as ${this.adminUser.name}`);
    }else{
      alert("Wrong email or password");
    }
  }
}
