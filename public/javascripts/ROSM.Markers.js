ROSM.Markers = function() {
  this.route = [];
  this.tmp = null;
  // markers assorted by category
  this.poi = {};
  // poi clustered markers
  this.poiCluster = new L.MarkerClusterGroup();
  ROSM.G.map.addLayer(this.poiCluster);
}

ROSM.extend(ROSM.Markers, {
  show: function() {
    for(var i = 0; i < this.route.length; i++) {
      this.route[i].show();
    }
  },

  reset: function() {
    for(var i = 0; i < this.route.length; i++) {
      this.route[i].hide();
    }
    this.route.splice(0, this.route.length);
    this.tmp = null;
    /* try to cleat the input in the input
    document.getElementById('input-target');
    document.getElementById('input-source');
    */
  },

  removeRoute: function() {
    for(var i = 0; i < this.route.length; i++) {
      this.route[i].hide();
    }
    this.route.splice(0, this.route.length);
  },

  removeVias: function() {
    for(var i=1; i<this.route.length-1;i++)
      this.route[i].hide();
      this.route.splice(1, this.route.length-2);
  },

  setSource: function(position) {
    var beginIcon = L.MakiMarkers.icon({
      icon: "marker",
      color: "#008000",
      size: "l"
    });

    if(this.route[0] && this.route[0].label == ROSM.CONSTANTS.SOURCE_LABEL) {
      this.route[0].setPosition(position);
    } else {
      this.route.splice(0, 0, new ROSM.Marker(ROSM.CONSTANTS.SOURCE_LABEL, {icon: beginIcon}, position));
    }
    ROSM.G.markers.addPopup();
    return 0;
  },

  setTarget: function(position) {
    var endIcon = L.MakiMarkers.icon({
      icon: "marker",
      color: "#FF0000",
      size: "l"
    });

    if(this.route[this.route.length - 1] && this.route[this.route.length - 1].label == ROSM.CONSTANTS.TARGET_LABEL) {
      this.route[this.route.length - 1].setPosition(position);
    } else {
      this.route.splice(this.route.length, 0, new ROSM.Marker(ROSM.CONSTANTS.TARGET_LABEL, {icon: endIcon}, position));
    }
    ROSM.G.markers.addPopup();
    return this.route.length - 1;
  },

  addVia: function(position) {
    if(this.route.length < 2) {
      return;
    }

    var viaIcon = L.MakiMarkers.icon({
      icon: "marker",
      color: "#8A0829",
      size: "l"
    });
    this.route.splice(this.route.length - 1, 0, new ROSM.Marker(ROSM.CONSTANTS.VIA_LABEL, {icon: viaIcon}, position));
    ROSM.JSON.clear("routing");
    ROSM.G.markers.addPopup();
    ROSM.G.markers.show();
    ROSM.Routing.getRoute();
  },

  hasSource: function() {
    if( this.route[0] && this.route[0].label == ROSM.C.SOURCE_LABEL )
      return true;
    return false;
  },

  hasTarget: function() {
    if(this.route[this.route.length-1] && this.route[this.route.length-1].label == ROSM.C.TARGET_LABEL)
      return true;
    return false;
  },

  removeMarker: function(id) {
    if(id >= this.route.length) {
      return;
    }

    if(id==0 && this.route[0].label == ROSM.C.SOURCE_LABEL) {
      document.getElementById('gui-input-source').value = "";
      ROSM.G.route.reset();
      ROSM.RoutingDescription.reset();
      ROSM.JSON.clear("routing");
      this.route[id].hide();
      this.route.splice(id, 1);
      if(this.route.length > 1) {
        this.route[0].setLabel(ROSM.C.SOURCE_LABEL);
        this.route[0].setDescription("Source");
      }
    } else if(id == this.route.length-1 && this.route[ this.route.length-1 ].label == ROSM.C.TARGET_LABEL) {
      id = this.route.length-1;
      document.getElementById('gui-input-target').value = "";
      ROSM.G.route.reset();
      ROSM.RoutingDescription.reset();
      ROSM.JSON.clear("routing");
      this.route[id].hide();
      this.route.splice(id, 1);
      if(this.route.length > 1) {
        this.route[this.route.length - 1].setLabel(ROSM.C.TARGET_LABEL);
        this.route[this.route.length - 1].setDescription("Target");
      }
    } else {
      ROSM.G.route.reset();
      ROSM.RoutingDescription.reset();
      ROSM.JSON.clear("routing");
      this.route[id].hide();
      this.route.splice(id, 1);

    }

    ROSM.G.markers.addPopup();

    if(this.route.length > 1) {
      ROSM.Routing.getRoute();
    }
  },

  // set tmp marker : tmp marker is used when search location in search
  setTmp: function(position) {
    var viewIcon = L.MakiMarkers.icon({
      icon: "marker",
      color: "#FFBF00",
      size: "m"
    });
    this.tmp = new ROSM.Marker("view", {icon: viewIcon}, position);
  },

  setPOI: function(cat, iconStyle) {
    if(!ROSM.G.POI[cat] || ROSM.G.POI[cat].length === 0) {
      return;
    }

    var markers = [];
    for(var i = 0; i < ROSM.G.POI[cat].length; i++) {
      var poi = ROSM.G.POI[cat][i];
      // console.log(poi);
      var marker = new ROSM.Marker(cat, iconStyle, new L.LatLng(poi.location.lat, poi.location.lng));
      marker.addPopup("<div class='ui grid'>" +
      "<h3 class='ui center aligned header'>" +
      "<i class='map marker large icon'></i>" +
      "<div class='content'>" + poi.name + "</div>" +
      "</h3>" +
      "<div class='ui divider'></div>" +
      "<div class='ui center aligned basic segment'>" +
      "<div class='ui poi marker green button' onclick=" +
        "ROSM.GUI.addVia(" + "\"" + cat + "\"," + i + "," + poi.location.lat + "," + poi.location.lng + ")>" +
      "<i class='plus icon'></i>Add to Trip</div>" +
      "</div></div>");
      markers.push(marker);
    }
    ROSM.G.markers.poi[cat] = markers;
    // ROSM.G.markers.poi[cat] = new L.LayerGroup(markers);
  },

  showPOI: function(cat) {
    // ROSM.G.markers.poiCluster.addLayer(ROSM.G.markers.poi[cat]);
    var markers = [];
    for(var i = 0; i < ROSM.G.markers.poi[cat].length; i++) {
      markers.push(ROSM.G.markers.poi[cat][i].marker);
    }
    ROSM.G.markers.poiCluster.addLayer(new L.LayerGroup(markers));
  },

  hidePOI: function(cat) {
    // ROSM.G.markers.poiCluster.removeLayer(ROSM.G.markers.poi[cat]);
    var markers = [];
    for(var i = 0; i < ROSM.G.markers.poi[cat].length; i++) {
      markers.push(ROSM.G.markers.poi[cat][i].marker);
    }
    ROSM.G.markers.poiCluster.removeLayer(new L.LayerGroup(markers));
  },

  addPopup: function() {
    for(var i = 0; i < this.route.length; i++) {
      this.route[i].addPopup("<div class='ui grid'>" +
      "<h3 class='ui center aligned header'>" +
      "<i class='map marker large icon'></i>" +
      "<div class='content'>" + this.route[i].label + "</div>" +
      "</h3>" +
      "<div class='ui divider'></div>" +
      "<div class='ui center aligned basic segment'>" +
      "<div class='ui red button' onclick=ROSM.GUI.removeMarker('route'," + i + ")>" +
      "<i class='minus icon'></i>Remove</div>" +
      "</div></div>");
    }
  }
});
