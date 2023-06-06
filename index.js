upload_button("uploader", load_dataset);

/*  rate slider */
const container = document.querySelector('.slider__box');
const btn = document.querySelector('.slider__btn');
const color = document.querySelector('.slider__color');
const tooltip = document.querySelector('.slider__tooltip');

$('input[type=checkbox]').removeAttr('checked');

dragElement = (target, btn) => {
    target.addEventListener('mousedown', (e) => {
        onMouseMove(e);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });
  
    onMouseMove = (e) => {
        e.preventDefault();
        let targetRect = target.getBoundingClientRect();
        let x = e.pageX - targetRect.left + 10;
        if (x > targetRect.width) { x = targetRect.width};
        if (x < 0){ x = 0};
        btn.x = x - 10;
        btn.style.left = btn.x + 'px';
  
        // get the position of the button inside the container (%)
        let percentPosition = (btn.x + 10) / targetRect.width * 100;
        
        // color width = position of button (%)
        color.style.width = percentPosition + "%";
  
        // move the tooltip when button moves, and show the tooltip
        tooltip.style.left = btn.x - 5 + 'px';
        tooltip.style.opacity = 1;
  
        // show the percentage in the tooltip
        tooltip.textContent = Math.round(percentPosition) + '%';
        let roundedN= Math.round((percentPosition)/3)
        changeSize(roundedN)
    };
  
    onMouseUp  = (e) => {
        window.removeEventListener('mousemove', onMouseMove);
        tooltip.style.opacity = 0;
  
        btn.addEventListener('mouseover', function() {
          tooltip.style.opacity = 1;
        });
        
        btn.addEventListener('mouseout', function() {
          tooltip.style.opacity = 0;
        });
    };
  };
  
  dragElement(container, btn);

var width = 890;
var height =650; 

var active = d3.select(null);

var proy = d3.geoMercator()
  .center([-101,23.7])
  .scale(width * 1.8)
  .translate([width / 1.9, height / 2.2]);

var camino = d3.geoPath()
      .projection(proy);


var svg = d3.select("#d2").append("svg")
      .attr("width",width)
      .attr("height",height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("class","viz");

var mapad3=d3.map()

function load_dataset(csv) {
  sessionStorage.clear()

  //document.getElementById("choose_yes").checked = false;
  //document.getElementById("choose_no").checked = true;
  var datosM = d3.csvParse(csv)
  //console.log(datosM)
  //console.log("voy segundo")

sessionStorage.setItem("datoalmc",JSON.stringify(datosM))
  return creaMapa(datosM)
}

function changeColorNewMap(){
  //document.getElementById("choose_yes").checked = false;
  //document.getElementById("choose_no").checked = true;
datosM = JSON.parse(sessionStorage.getItem("datoalmc")|| "[]")
console.log(datosM)
d3.selectAll(".mapa").remove()
 var colormin = d3.select("#myMapColorMin").property("value")
 console.log(colormin)
 var colormax= d3.select("#myMapColorMax").property("value")
 console.log(colormax)
 d3.json("./datos/estmun2.json",function(error,poligonos){
  var estadospoli = topojson.feature(poligonos,poligonos.objects.estados);
  var municipiospoli = topojson.feature(poligonos,poligonos.objects.muns);
  //para escala de colores
  var dataSize = datosM.map(object=>{
    return object.valor
  })
  var maximo= Math.max(...dataSize)
  var minimo= Math.min(...dataSize)

  rangeColor(minimo,maximo,datosM,estadospoli,municipiospoli, colormin,colormax) 
 })

}

function creaMapa(datosX){
    $('input[type=checkbox]').removeAttr('checked');
  d3.selectAll(".mapa").remove()
  d3.json("./datos/estmun2.json",function(error,poligonos){
    var estadospoli = topojson.feature(poligonos,poligonos.objects.estados);
    var municipiospoli = topojson.feature(poligonos,poligonos.objects.muns);
    //para escala de colores
    var dataSize = datosX.map(object=>{
      return object.valor
    })
    var maximo= Math.max(...dataSize)
    var minimo= Math.min(...dataSize)
   // console.log(maximo)
   // console.log(minimo)

  console.log(mapad3)

   var rangMin = d3.select("#myMapColorMin").property("value")
   var rangMax = d3.select("#myMapColorMax").property("value") 
    rangeColor(minimo,maximo,datosX,estadospoli,municipiospoli, rangMin,rangMax)   

  })
}


function rangeColor(minimoS2,maximoS2 ,datosX3, estadodospoli3, municipiospoli3, rangMin,rangMax){
  var scalac= d3.scaleLinear().range([rangMin,rangMax]).domain([minimoS2,maximoS2])
  mapaDibuja(scalac,datosX3,estadodospoli3,municipiospoli3)
}


function mapaDibuja(scalac,estadosM1,estadospoli1,municipiospoli1){
  var estadosM = estadosM1.map(function(ele){return {"valor":ele.identificador_cve, "valor2":ele.valor}});
    estadosM.forEach(function(ele){
      mapad3.set(ele.valor,ele.valor2)
    });
    
    var prueba = estadosM1[0].identificador_cve
    //console.log(prueba)
    //console.log(prueba.length)
    
    var estadospoli= estadospoli1
    var municipiospoli=municipiospoli1 


   function entidades() {
     if (prueba.length == 5) {
       return municipiospoli;
     } return estadospoli
   }

   var divisiones = entidades()

 /*   divisiones.features.forEach(function(ele){
    if(ele.id === "01" || ele.id===1){
      ele.id = "1"
    };
    if(ele.id === "02" || ele.id===2){
      ele.id = "2"
    };
    if(ele.id === "03" || ele.id===3){
      ele.id = "3"
    };
    if(ele.id === "04" || ele.id===4){
      ele.id = "4"
    };
    if(ele.id === "05" || ele.id===5){
      ele.id = "5"
    };
    if(ele.id === "06" || ele.id===6){
      ele.id = "6"
    };
    if(ele.id === "07" || ele.id===7){
      ele.id = "7"
    };
    if(ele.id === "08" || ele.id===8){
      ele.id = "8"
    };
    if(ele.id === "09" || ele.id===9){
      ele.id = "9"
    };
    }) */
     
    d3.select(".viz")
        .append("g").attr("class","mapa")
        .selectAll("poligonos")
        .data(divisiones.features)
        .enter().append("path")
        .attr("class","estados")
        .attr("d",camino)//variable d de path, d nunca cambia
        .style("stroke-width","0.1px")
        .attr("stroke", "#252525")
    
    d3.selectAll(".estados")
      .style("fill",function(d){
        if(mapad3.get(d.id)==0 || mapad3.get(d.id)== NaN || mapad3.get(d.id)==null){
          return "white"
        } else{
        var temporal = mapad3.get(d.id);
          return scalac(temporal)}
    });

    var linear = d3.scaleLinear()
                    .domain([0,10])
                    .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

    var svg = d3.select(".viz");

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(380,550)");
    
    var legendLinear = d3.legendColor()
      .shapeWidth(50)
      .orient('horizontal')
      .scale(scalac);
    
    svg.select(".legendLinear")
      .call(legendLinear);


}

//action buttons
const buttons = d3.selectAll(".opcionradio");
buttons.on('change', function(d) {
  if(this.value=="si"){
    d3.selectAll(".mapaL").remove()
  console.log('aceptaste el boton de: ' + this.value)
  d3.json("./datos/estmun2.json",function(error,poligonosL){
    var estadospoliL = topojson.feature(poligonosL,poligonosL.objects.estados);
  d3.select(".viz")
    .append("g").attr("class","mapaL")
    .selectAll("poligonos")
    .data(estadospoliL.features)
    .enter().append("path")
    .attr("class","estadosL")
    .attr("d",camino)
    .attr("fill","transparent")})
}  
  else{
    d3.selectAll(".mapaL").remove()
  //console.log('muy mal, ecogiste el boton de: '+ this.value)

}
})

function changeColorLine(colorL){
  let coloreaL= colorL
  d3.select(".viz")
    .attr("stroke", coloreaL)
}

// Function that change size by slider
function changeSize(size) {
  //let sizeline = `${(size) / 10}`+'px'
  let sizeline = (size/10)
  d3.select(".viz")
    .attr("stroke-width",sizeline)
}

//Listen stroke color for Map
d3.select("#myColorLine").on("change", function(d){
  selectedValueLineC = this.value
  changeColorLine(selectedValueLineC)
})

/*d3.select("#mySlider").on("change", function(d){
    console.log(this.value)
  selectedValue = this.value
  changeSize(selectedValue)
})*/
          
          

          
          

// handle upload button
function upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
   //console.log("voy tercero")
  };

  uploader.addEventListener("change", handleFiles, false);  
  
  function handleFiles() {
    //console.log("pedir datos")
    //d3.select("#table").text("loading...");
    var file = this.files[0];
    reader.readAsText(file);
    //console.log("voy primero")
    var datosGuardados = sessionStorage["file"]
    
  };
};


//--------------------------------------------Export SVG to PNG --------------------------------------------//


d3.select('#saveButton').on('click', function(){
  var svgString = getSVGString(d3.select('svg').node());
  svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
  function save( dataBlob, filesize ){
     saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
  }
});

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  var cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );
  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix
  return svgString;
  function getCSSStyles( parentElement ) {
     var selectorTextArr = [];
     // Add Parent element Id and Classes to the list
     selectorTextArr.push( '#'+parentElement.id );
     for (var c = 0; c < parentElement.classList.length; c++)
           if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
              selectorTextArr.push( '.'+parentElement.classList[c] );
     // Add Children element Ids and Classes to the list
     var nodes = parentElement.getElementsByTagName("*");
     for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if ( !contains('#'+id, selectorTextArr) )
           selectorTextArr.push( '#'+id );
        var classes = nodes[i].classList;
        for (var c = 0; c < classes.length; c++)
           if ( !contains('.'+classes[c], selectorTextArr) )
              selectorTextArr.push( '.'+classes[c] );
     }
     // Extract CSS Rules
     var extractedCSSText = "";
     for (var i = 0; i < document.styleSheets.length; i++) {
        var s = document.styleSheets[i];
        try {
            if(!s.cssRules) continue;
        } catch( e ) {
               if(e.name !== 'SecurityError') throw e; // for Firefox
               continue;
            }
        var cssRules = s.cssRules;
        for (var r = 0; r < cssRules.length; r++) {
           if ( contains( cssRules[r].selectorText, selectorTextArr ) )
              extractedCSSText += cssRules[r].cssText;
        }
     }
     return extractedCSSText;
     function contains(str,arr) {
        return arr.indexOf( str ) === -1 ? false : true;
     }
  }
  function appendCSS( cssText, element ) {
     var styleElement = document.createElement("style");
     styleElement.setAttribute("type","text/css");
     styleElement.innerHTML = cssText;
     var refNode = element.hasChildNodes() ? element.children[0] : null;
     element.insertBefore( styleElement, refNode );
  }
}
function svgString2Image( svgString, width, height, format, callback ) {
  var format = format ? format : 'png';
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  var image = new Image();
  image.onload = function() {
     context.clearRect ( 0, 0, width, height );
     context.drawImage(image, 0, 0, width, height);
     canvas.toBlob( function(blob) {
        var filesize = Math.round( blob.length/1024 ) + ' KB';
        if ( callback ) callback( blob, filesize );
     });
  };
  image.src = imgsrc;
}
