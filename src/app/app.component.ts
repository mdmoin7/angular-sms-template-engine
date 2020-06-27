import { Component, VERSION, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  templateText:string='Hello John Doe';
  editorData:FormControl=new FormControl('Hello %user_name%');
  fieldsAvailable=[
    {key:'user_name',example:'John Doe'},
    {key:'user_age',example:'20 years'},
    {key:'user_email',example:'john@mail.com'},
    {key:'app_name',example:'My App'},
     {key:'app_url',example:'https://google.com'}
  ]
  constructor(private clipboard: Clipboard){}
  ngOnInit(){
    this.editorData.valueChanges
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((v) => this.updateText());
  }
  updateText() {
    if (this.editorData.value !== null) {
      this.templateText = this.editorData.value.replace(
        /%(\w+)%/g, // this is the regex to replace %variable%
        (match, field) => {
          const ex = this.fieldsAvailable.find(
            (f) => f.key === field
          );
          if (ex) {
            return ex.example;
          }
          return match;
        }
      );
      this.templateText.trim();
    }
  }
  copyField(field) {
    this.clipboard.copy(`%${field.key}%`);
  }
}
