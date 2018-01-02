import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

declare var google;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    local: '';

    constructor(public navCtrl: NavController, private storage: Storage) {
    }

    ionViewDidLoad() {
        this.loadMap();
    }
    loadMap() {
        let latLng = new google.maps.LatLng(-3.09, -60.01);
        let mapOptions = {
            center: latLng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //this.storage.clear();
        /*
        this.storage.forEach((value, key, index) => {

            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.BOUNCE,
                position: value[0]
            });

            let content = "<h4>" + value[1] + "</h4>";
            this.addInfoWindow(value[0], value[1]);
        })*/
        
    }

    addMarker() {
        if (this.local != "") {
            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });
            let content = "<h4>" + this.local + "</h4>";
            this.addInfoWindow(marker, content);
            //this.storage.set(String(this.storage.length()), this.map.getCenter());
            //this.storage.set('yes', this.map.getCenter());
        }
    } 

    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

}
