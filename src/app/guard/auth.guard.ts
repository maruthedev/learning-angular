import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let accessToken = localStorage.getItem('accessToken');
  if(accessToken){
    return true;
  } else {
    return inject(Router).navigate(["/login"]);
  }
};
