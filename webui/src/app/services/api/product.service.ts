import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TranslateService } from './translate.service';
import { ApiRequestService } from './api-request.service';
import { HttpParams, HttpEvent, HttpRequest, HttpClient} from "@angular/common/http";

@Injectable()
export class ProductService {
    constructor(
        private apiRequest: ApiRequestService,
        private translate:TranslateService,
        private http: HttpClient
    ) {}

    getProducts(page?:number, size?:number): Observable<any> {
        //Create Request URL params
        let me = this;
        let params: HttpParams = new HttpParams();
        params = params.append('page', typeof page === "number"? page.toString():"0");
        params = params.append('size', typeof size === "number"? size.toString():"1000");

        let productList = new Subject<any>(); // Will use this subject to emit data that we want
        this.apiRequest.get('api/products',params)
            .subscribe(jsonResp => {
                let returnObj = jsonResp.items.map(function(v, i, a){
                    let newRow = Object.assign({}, v, {
                        listPrice   : me.translate.getCurrencyString(v.listPrice),
                        standardCost: me.translate.getCurrencyString(v.standardCost)
                    });
                    return newRow;
                });
                productList.next(returnObj); // incidentList is a Subject and emits an event thats being listened to by the components
            });

        return productList;
    }


    getProductStatsByQuantityOrdered(): Observable<any> {
        const url = 'api/product-stats-by-quantity';
        return this.apiRequest.get(url);
    }

    pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
        const url = 'api/product/uploadFile';
        return this.apiRequest.pushFileToStorage(url,file);
    }
     
    getFiles(): Observable<any> {
      const url = 'api/product/getallfiles';
      return this.apiRequest.get(url)
    }

    downloadFile(filename: string): Observable<any>{
        let params: HttpParams = new HttpParams();
        params = params.append('filename', filename);
        const url = 'api/product/files';
        return this.apiRequest.getFile(url, params);
    }
}
