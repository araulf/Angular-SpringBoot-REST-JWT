import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/api/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of } from 'rxjs/observable/of';

@Component({
	selector   : 's-login-pg',
	templateUrl: './login.component.html',
    styleUrls  : [ './login.scss'],
})

export class LoginComponent implements OnInit {
    model: any = {};
    errMsg:string = '';
    registerUser = false;
    registerForm: FormGroup;
    submitted = false;


    constructor(
        private router: Router,
        private loginService: LoginService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        // reset login status
        this.loginService.logout(false);
        this.registerForm = this.formBuilder.group({
            username: ['',[Validators.required, Validators.minLength(4)],[this.checkUsernameAvailable.bind(this)]],
            password: ['',[Validators.required, Validators.minLength(4)]]
        })
    }

    login() {
        this.loginService.getToken(this.model.username, this.model.password)
            .subscribe(resp => {
                    if (resp.user === undefined || resp.user.token === undefined || resp.user.token === "INVALID" ){
                        this.errMsg = 'Username or password is incorrect';
                        return;
                    }
                    this.router.navigate([resp.landingPage]);
                },
                errResponse => {
                  switch(errResponse.status){
                    case 401:
                      this.errMsg = 'Username or password is incorrect';
                      break;
                    case 404:
                      this.errMsg = 'Service not found';
                    case 408:
                      this.errMsg = 'Request Timedout';
                    case 500:
                      this.errMsg = 'Internal Server Error';
                    default:
                      this.errMsg = 'Server Error';
                  }
                }
            );
    }

    onSignUp(){
      this.router.navigate(['signup']);
    }

    checkUsernameAvailable(control: AbstractControl) {
        console.log(control.value);
        return of(null);
        // return this.loginService.checkUsernameAvailable(control.value).then(res => {
        //     console.log(res);
        //   return res ? null : { usernameTaken: true };
        // });
      }

    get f() { return this.registerForm.controls; }

    onRegisterSubmit(){
        this.submitted = true;
        console.log("Register submitted", this.f.username.errors, this.registerForm.status);
        // return this.loginService.registerUser(control.value).then(res => {
        //     console.log(res);
        // });
    }

    showRegistrationScreen(){
        this.registerUser = true;
    }

    showLoginScreen(){
        this.submitted = false;        
        this.registerUser = false;
    }
}
