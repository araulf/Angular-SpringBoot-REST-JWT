import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { ProductService } from '../../services/api/product.service';
import { Router } from '@angular/router';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Component({
	selector: 's-products-pg',
	templateUrl: './products.component.html',
    styleUrls: [ './products.scss'],
})

export class ProductsComponent implements OnInit {

    @ViewChild('productDiscontinuedTpl') productDiscontinuedTpl: TemplateRef<any>;

    //ngx-Datatable Variables
    columns:any[];
    rows:any[];
    selectedFiles: FileList
    currentFileUpload: File
    progress: { percentage: number } = { percentage: 0 }

    showFile = false
    fileUploads: Observable<any>;

    constructor( private router: Router, private productService: ProductService) {}
    ngOnInit() {
        var me = this;
        me.getPolicyData();
        this.columns=[
            {prop:"productCode"  , name: "Code"         , width:60  },
            {prop:"productName"  , name: "Name"         , width:200 },
            {prop:"standardCost" , name: "Standard Cost", width:100 },
            {prop:"listPrice"    , name: "List Price"   , width:100 },
            {prop:"category"     , name: "Category"     , width:100 },
            {prop:"targetLevel"  , name: "Target Level" , width:100 },
            {prop:"reorderLevel" , name: "Reorder Level", width:100 },
            {prop:"minimumReorderQuantity", name: "Min Order", width:100 },
            {prop:"discontinued" , name: "Discontinued" , width:90, cellTemplate: this.productDiscontinuedTpl}
        ];

    }

    getPolicyData() {
        this.productService.getProducts().subscribe( (policyData) => {
            this.rows = policyData;
        });
    }

    selectFile(event) {
        this.showFile = false;      
        this.selectedFiles = event.target.files;
      }
     
      upload() {
        this.progress.percentage = 0;
     
        this.currentFileUpload = this.selectedFiles.item(0)
        this.productService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!');
          }
        })
     
        this.selectedFiles = undefined
      }

      showFiles(enable: boolean) {
        this.showFile = enable
     
        if (enable) {
          this.fileUploads = this.productService.getFiles();
        }
      }

      downloadFile(file: any) {
        console.log(file);
        var filename = file.split('/').pop();
        console.log(filename);
        this.productService.downloadFile(filename).subscribe(res => {
            console.log('start download:',res);
            var url = window.URL.createObjectURL(res);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove(); // remove the element
          }, error => {
            console.log('download error:', JSON.stringify(error));
          }, () => {
            console.log('Completed file download.')
        });
      }

}
