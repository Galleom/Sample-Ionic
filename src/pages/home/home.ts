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
    markers: any[];
    local: string;

    constructor(public navCtrl: NavController, private storage: Storage) {
        this.markers = new Array<any>();
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
        
        this.storage.get("num").then((n) => {
            for (var i = 0; i < n; i++) {
                Promise.all([this.storage.get('lc' + i), this.storage.get('lat' + i), this.storage.get('lng' + i)])
                        .then(values => {
                    let marker = new google.maps.Marker({
                        map: this.map,
                        //animation: google.maps.Animation.BOUNCE,
                        position: new google.maps.LatLng(Number(values[1]), Number(values[2]))
                    });

                    let content = "<h4>" + values[1] + ":" + values[2] + " - " + i + ": " + values[0] + "</h4>";
                                    
                    this.addInfoWindow(marker, content);
                    this.markers.push(marker);
                });
            }
        });
        
    }

    addMarker() {
        if (this.local) {
            if (this.local.length > 0) {
                let marker = new google.maps.Marker({
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    position: this.map.getCenter()
                });
                this.storage.get("num").then((n) => {
                    if (!n) {
                        n = 0;
                    }
                    //let content = "<h4>" + String(this.map.getCenter().lat()) + ":" + String(this.map.getCenter().lng()) + " - " + (n + 1) + ": " + this.local + "</h4>";
                    let content = "<h4>" + this.map.getCenter().toString()+ " - " + (n + 1) + ": " + this.local + "</h4>";
                    this.addInfoWindow(marker, content);
                    this.markers.push(marker);

                    this.storage.set('lc' + n, this.local);
                    this.storage.set('lat' + n, String(this.map.getCenter().lat()));
                    this.storage.set('lng' + n, String(this.map.getCenter().lng()));
                    this.storage.set("num", n + 1);
                })
            }
        }
    }
    eraseMarkers() {
        this.storage.clear();
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
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
