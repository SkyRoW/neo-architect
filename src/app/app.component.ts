import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { NgModule } from '@angular/core';

declare var jquery:any;
declare var $ :any;
declare var require :any;

@NgModule({
	imports: [
		HttpModule
	]
})


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  @ViewChild('initBlock') initBlock: ElementRef;
  @ViewChild('splashScreen') splashScreen: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild('responseArea') responseArea: ElementRef;
  @ViewChild('loader') loader: ElementRef;
  @ViewChild('responseAreaText') responseAreaText: ElementRef;

  constructor(private http: Http) { }

  title = 'neo-architect';
  initMsg = "";
  query = "";
  response = "";
  responseData;

  composeResponse(responseData) {

  	$('.responseAreaText').css('fontSize', 60);
  	var responses = require('./responses.json');
  	var page = require('./pages/ZeepinPage.html');

  	console.log(responseData.length);
  	if (responseData.intent == null) {
  		var responseList = responses['undefined'];
  		var response = responseList[Math.floor(Math.random() * responseList.length)];	
  		return response;
	}
  	
  	var confidence = responseData.intent[0].confidence;
  	var value = responseData.intent[0].value;

  	switch (value) {
  		case "zeepin_description":
  			var page = require('./pages/ZeepinPage.html');
  			return page;
  		
  		case "trinity_description":
  			var page = require('./pages/TrinityPage.html');
  			return page;
  		default:
			var responseList = responses[value];
		  	var response = responseList[Math.floor(Math.random() * responseList.length)];	
  			return response;
  	}
  }

  resize_to_fit() {
  var fontsize = $('.responseAreaText').css('font-size');
  $('.responseAreaText').css('fontSize', parseFloat(fontsize) - 1);

  if ($('.responseAreaText').height() >= $('.responseArea').height()) {
    this.resize_to_fit();
  	}
  }

  doPOST() {
  		let url = 'https://api.wit.ai/message';
  		var question = this.textArea.nativeElement.value;
  		var token = "YE7TQH244HU7XFKGCLC2TGPQNBZ73UXU"

  		if (question === "") return;
  		$('.loader').show();

  		this.http.get(url, {
      params: {
        q: question,
        access_token: token
      }}).subscribe(res => { console.log(res.json().entities);
                   this.responseData = res.json().entities;
                   $('.loader').hide();
                   this.showResponse(this.composeResponse(this.responseData));

      						 //this.responseAreaText.nativeElement.innerHTML = this.composeResponse(this.responseData);
      						 //this.resize_to_fit();
      						});
  }

  showResponse(response) {

    console.log(response);

    if (!(response instanceof Array))
    {
      this.responseAreaText.nativeElement.innerHTML = response;
      this.resize_to_fit();
    }
    else
    {
      response.forEach((item, index) => {

        setTimeout(() => 
      {
         this.responseAreaText.nativeElement.innerHTML = response[index];
         this.resize_to_fit();
      },
      1200*index);
      });
    }
    
  }

  ngOnInit() {

  	this.initialize();
  }

  onKeydown(event) {
  	if (event.key === "Enter") {
  		event.preventDefault();
  		this.doPOST();
  	}
  }

  initialize() {
  	this.initMsg = "Initializing core modules";

  	setTimeout(() => 
	{
    	this.initMsg = "Waking Up";
	},
	2000);

	setTimeout(() => 
	{
    	this.initMsg = "Meet the Architect";
    	this.initBlock.nativeElement.classList.add('loading');
    	this.initBlock.nativeElement.classList.remove('loading-pulsate');
    	this.initBlock.nativeElement.style["font-size"] = "60px";

	},
	4000);  	

	setTimeout(() => 
	{
    	this.initMsg = "";
    	this.splashScreen.nativeElement.style.display = "none";
    	this.textArea.nativeElement.focus();
    	this.response = "Hi, I am the Architect, you can ask me anything you want about NEO and I will answer as best as I can.";

	},
	6000);

  }

}
