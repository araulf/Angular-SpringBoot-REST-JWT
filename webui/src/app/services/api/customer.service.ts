import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TranslateService } from './translate.service';
import { ApiRequestService } from './api-request.service';
import { HttpParams} from "@angular/common/http";
@Injectable()
export class CustomerService {

    constructor(
        private apiRequest: ApiRequestService,
        private translate:TranslateService
    ) {}

    getCustomers(page?:number, size?:number, company?:string): Observable<any> {
        let me = this;
        let params: HttpParams = new HttpParams();
        params = params.append('page', typeof page === "number"? page.toString():"0");
        params = params.append('size', typeof size === "number"? size.toString():"1000");
        if(company) {
            params = params.append('company', company);
        }
        let customerListSubject = new Subject<any>(); // Will use this subject to emit data that we want

        this.apiRequest.get('api/customers',params)
            .subscribe(jsonResp => {
                let items = jsonResp.items.map(function(v, i, a){
                    let newRow = Object.assign({}, v, {
                        address: `${v.address1}, <br/> ${v.city}, ${v.state} ${v.postalCode} <br/> ${v.country}`
                    });
                    return newRow;
                });

                let returnObj = Object.assign({},jsonResp,{
                    items:items
                })
                customerListSubject.next(returnObj); // incidentList is a Subject and emits an event thats being listened to by the components
            });

        return customerListSubject;
    }
    searchCustomers(name:string): Observable<any> {
        let me = this;
        let params: HttpParams = new HttpParams();
        params = params.append('name', name);

        let customerListSubject = new Subject<any>(); // Will use this subject to emit data that we want

        this.apiRequest.get('api/customers/search',params)
            .subscribe(jsonResp => {
                console.log(jsonResp);
                let items = jsonResp.items.map(function(v, i, a){
                    let newRow = Object.assign({}, v, {
                        address: `${v.address1}, <br/> ${v.city}, ${v.state} ${v.postalCode} <br/> ${v.country}`
                    });
                    return newRow;
                });

                let returnObj = Object.assign({},jsonResp,{
                    items:items
                })
                customerListSubject.next(returnObj); // incidentList is a Subject and emits an event thats being listened to by the components
            });

        return customerListSubject;
    }
}
