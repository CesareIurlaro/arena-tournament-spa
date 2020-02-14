import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {IsLoggedInUseCase} from '../domain/usecases/login/is-logged-in-use-case';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(
    private isLoggedInUseCase: IsLoggedInUseCase,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedInUseCase.buildAction().pipe(
      map((isLoggedIn) => {
        console.log(`homeGuard login State intercepted is: ${isLoggedIn}`);
        if (isLoggedIn) {
          return true;
        } else {
          return this.router.parseUrl('login');
        }
      })
    );
  }

}
