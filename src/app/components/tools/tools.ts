import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'tools',
  templateUrl: './tools.html',
  styleUrls: ['./tools.scss'],
  animations: [
    /**********************************************************************************************************/
    /*******                    ANIMATION TO RENDER THE ITEMS FROM DATABASE                             *******/
    /**********************************************************************************************************/
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ]),
    trigger('explainerAnim', [
      transition('* => *', [
        query('.row', style({ opacity: 0, transform: 'translateX(-40px)' })),

        query('.row', stagger('500ms', [
          animate('800ms 1.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ]))
      ])
    ])

  ]
})

/**********************************************************************************************************/
/*******                    GET TOOLS FROM DATABASE AND RENDER IT IN THE PAGE                       *******/
/**********************************************************************************************************/
export class ToolsComponent {

  constructor(public http: Http) { }
  visible= true;
  item = [];
  latitude: number;
  longitude: number;
  lat: number;
  lon: number;
  arr = [];
  arrlog = [];
  // obj={item:Object,distance:Number};
  result=[];
  newArray=[];
  // renter:number;
  ngOnInit() {
    this.arrlog
    let that = this;
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /************************bring inormation for user who logged in now*************** */
    this.http.get('http://localhost:4500/prof')
      .map(res => res.json())
      .subscribe(
      data => {
        this.arrlog = data;
        console.log("yayayayayayayaya"+data[0].username);
      },
      err => console.log("eeeeeeeeeeeeeeeerrrrrrrror", err),
      () => console.log("here is the item ")

      );


    /***************get tools information************ */

    this.http.get('http://localhost:4500/tools')
      .map(res => res.json())
      .subscribe(
      data => {
        console.log(data)
        this.item = data;
        this.lat = this.arrlog[0].latitude;
        this.lon = this.arrlog[0].longitude;
        // console.log('hhhhhhhhhhhhhhhhhhhhhhhh',this.arr,"tttt"); 
        
        const obj1={item:Object,distance:Number};
        // const  result =[]
        for ( var i = 0; i <this.item.length ; i++) {
          // console.log('hhhhhh000hhhhhhhhhh');
          // debugger;
          const obj1={item:Object,distance:Number};
          
          this.latitude = this.item[i].latitude;
          this.longitude = this.item[i].longitude;
          this.getDistanceFromLatLonInKm(this.latitude, this.longitude, this.lat, this.lon);
          //console.log(this.item[i].longitude, this.item[i].latitude)
          obj1['item']=this.item[i];
          obj1['distance']= this.arr[i];
          // console.log("Ahmad", this.arr)
          this.result.push(obj1);
    // console.log('at the end of loop ',this.arr[i]);
          //console.log("hhhhhhhhhhhhh"+this.arrlog[0].latitude);     
        }
        // for(var j=0;j<this.arr.length;j++){
        //   this.obj['distance']=this.arr[j];
        // }
        // this.result.push(this.obj);
        console.log('kkkkkkkkkkkkklllll2222',this.result);
        

      },
      err => console.log(err),
      () => console.log("here is the item ")
      );
      
  }
  activeItem={};
  changeItem (index){
   this.activeItem=index;
 }

  rent(i) {
    console.log(i)
    const that = this;
    console.log(that)
    this.http.post('http://localhost:4500/renter', {
      item_id: i,
      renter: that.arrlog[0].user_id,
      renter_name:that.arrlog[0].username
    })

      .subscribe(
      data => {
        alert('ok');
        console.log(data)
        this.visible=!this.visible
        
      },
      error => {
        console.log(error, "erooooooooooooooooooe");
      }
      )
  }
  /******************************* */
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    this.arr.push(d);
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  bubbleSort = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        if (arr[i] < arr[j]) {
          var x = arr[i];
          arr[i] = arr[j];
          arr[j] = x;
        }
      }
    }
    //console.log(arr);
    return arr;

  };
  
}
