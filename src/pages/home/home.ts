import { HttpservicesProvider } from './../../providers/httpservices/httpservices';
import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng
 } from '@ionic-native/google-maps';
 declare const google;
 var map;
 var service;
 var infowindow;
 declare const ActiveXObject;
 import 'rxjs/add/operator/map';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  // @ViewChild('map') mapRef:ElementRef;
  public lat: any;
  public lng:any;
  public abas:String="op1";
  public ocorrencia = {codigo_usuario:"",
                       comentario: "",
                       lat: "" ,
                       lng: "",
                       avaliacao: ""       
            }

  constructor(public navCtrl: NavController,
              private http: HttpservicesProvider,
              private geolocation: Geolocation,) {
                
                
           

  }

  ngOnInit(){
    this.carregaLocalizacao(this.lat,this.lng);
    // if(this.abas == "op1"){
      this.initMap();
    // }
   
  }
  like(ocorrencia){
    console.log(ocorrencia);
    let dados_ocorrencia = {
                      codigo_usuario:"1",
                      comentario: ocorrencia.comentario,
                      lat: this.lat ,
                      lng: this.lng,
                      avaliacao: "Boa"  

    }
    this.http.save('elivre', dados_ocorrencia)     
      .subscribe(data => {
        this.ocorrencia.comentario = '';
        this.initMap();
      });

  }

  dislike(ocorrencia){
    console.log(ocorrencia);
    let dados_ocorrencia = {
                      codigo_usuario:"1",
                      comentario: ocorrencia.comentario,
                      lat: this.lat ,
                      lng: this.lng,
                      avaliacao: "Ruim"  

    }
    this.http.save('/elivre', dados_ocorrencia)
      .subscribe(data => {
      this.ocorrencia.comentario = ''
      this.initMap();
      
    });

  }

  carregaLocalizacao(lat,long) {
    this.geolocation.getCurrentPosition().then((resp) => {
    
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      
      console.log(this.lat, this.lng)
  
    }).catch((error) => {
      console.log('Error getting location', error);
  });
}


  initMap() {   
    
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-33.863276, 151.207977),
      zoom: 13,
      streetViewControl:false,
      radius: 10,
      
     
      
    });
    var infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          
        };      

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function() {
        this.handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, map.getCenter());
    }
   

      // Change this depending on the name of your PHP or XML file
      this.downloadUrl('http://zaitetecnologia1.tempsite.ws/myPetAPI/elivre.php', function(data) {
        var xml = data.responseXML;
        var elivre = xml.documentElement.getElementsByTagName('elivre');
        Array.prototype.forEach.call(elivre, function(markerElem) {
          var codigo_usuaro = markerElem.getAttribute('codigo_usuaro');
          var comentario = markerElem.getAttribute('comentario');
          var avaliacao = markerElem.getAttribute('avaliacao');
          var point = new google.maps.LatLng(
              parseFloat(markerElem.getAttribute('lat')),
              parseFloat(markerElem.getAttribute('lng')));

          var infowincontent = document.createElement('div');
          var strong = document.createElement('strong');
          strong.textContent = comentario
          infowincontent.appendChild(strong);
          infowincontent.appendChild(document.createElement('br'));

          var text = document.createElement('text');
          text.textContent = avaliacao
          infowincontent.appendChild(text);
          infowincontent.appendChild(document.createElement('br'));

          // var text = document.createElement('text');
          // text.textContent = type
          // infowincontent.appendChild(text);
          // infowincontent.appendChild(document.createElement('br'));


         
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon:{
              'url': 'assets/icon/cone.png',
            },
            animation: google.maps.Animation.DROP,
            
            
            
           
          });
          marker.addListener('click', function() {
            infoWindow.setContent(infowincontent);
            infoWindow.open(map, marker);
          });
        });
      });
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }
  
  downloadUrl(url, callback) {
    var request = 
        new XMLHttpRequest;

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        
        callback(request, request.status);
      }
    };

    request.open('GET', url, true);
    request.send(null);
  }
  
  doNothing() {}

}
