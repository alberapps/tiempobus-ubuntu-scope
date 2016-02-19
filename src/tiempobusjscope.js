/**
 *  TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 *  Copyright (C) 2016 Alberto Montiel
 *
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var scopes = require('unity-js-scopes')
var http = require('http');
var XML = require('pixl-xml');

var query_host = "isaealicante.subus.es"
var query_path_dinamica =  "/services/dinamica.asmx";
var query_path_estructura =  "/services/estructura.asmx";

//Datos lineas
LINEAS_DESC = ["21 ALICANTE-P.S.JUAN-EL CAMPELLO", "22 ALICANTE-C. HUERTAS-P.S. JUAN", "23 ALICANTE-SANT JOAN-MUTXAMEL", "24 ALICANTE-UNIVERSIDAD-S.VICENTE", "25 ALICANTE-VILLAFRANQUEZA", "26 ALICANTE-VILLAFRANQUEZA-TANGEL", "27 ALICANTE(O.ESPLA) - URBANOVA", "30 SAN VICENTE-LA ALCORAYA", "C-55 EL CAMPELLO-UNIVERSIDAD", "35 ALICANTE-PAULINAS-MUTXAMEL", "36 SAN GABRIEL-UNIVERSIDAD", "38 P.S.JUAN-H.ST.JOAN-UNIVERSIDAD", "39 EXPLANADA - C. TECNIFICACIÓN", "21N ALICANTE- P.S.JUAN-EL CAMPELLO", "22N ALICANTE- PLAYA SAN JUAN", "23N ALICANTE-SANT JOAN- MUTXAMEL", "24N ALICANTE-UNIVERSIDAD-S.VICENTE", "01 S. GABRIEL-JUAN XXIII  (1ºS)", "02 LA FLORIDA-SAGRADA FAMILIA", "03 CIUDAD DE ASIS-COLONIA REQUENA", "04 CEMENTERIO-TOMBOLA", "05 EXPLANADA-SAN BLAS-RABASA", "06 AV.ÓSCAR ESPLÁ - COLONIA REQUENA", "07 AV.ÓSCAR ESPLÁ-EL REBOLLEDO", "8A EXPLANADA -VIRGEN REMEDIO", "09 AV.ÓSCAR ESPLÁ - AV. NACIONES", "10 EXPLANADA - VIA PARQUE", "11 V.REMEDIO-AV DENIA (JESUITAS)", "11H V.REMEDIO-AV. DENIA-HOSP.ST JOAN", "12 AV. CONSTITUCION-S. BLAS(PAUI)", "16 PZA. ESPAÑA-MERCADILLO TEULADA", "17 ZONA NORTE-MERCADILLO TEULADA", "8B EXPLANADA-VIRGEN DEL REMEDIO", "191 PLA - CAROLINAS - RICO PEREZ", "192 C. ASIS - BENALUA - RICO PEREZ", "M MUTXAMEL-URBANITZACIONS", "136 MUTXAMEL - CEMENTERIO", "C2 VENTA LANUZA - EL CAMPELLO", "C-51 MUTXAMEL - BUSOT", "C-52 BUSOT - EL CAMPELLO", "C-53 HOSPITAL SANT JOAN - EL CAMPELLO", "C-54 UNIVERSIDAD-HOSP. SANT JOAN", "C-6 ALICANTE-AEROPUERTO", "45 HOSPITAL-GIRASOLES-MANCHEGOS", "46A HOSPITAL-VILLAMONTES-S.ANTONIO", "46B HOSPITAL-P.CANASTELL-P.COTXETA", "TURI BUS TURÍSTICO (TURIBUS)", "31 MUTXAMEL-ST.JOAN-PLAYA S. JUAN", "30P SAN VICENTE-PLAYA SAN JUAN", "C-6* ALICANTE-URBANOVA-AEROPUERTO", "123 ESPECIAL SANTA FAZ", "13 ALICANTE - VILLAFRANQUEZA", "SE ESPECIAL SAN VICENTE", "TRANSPORTE URBANO XIXONA","13N ALICANTE - VILLAFRANQUEZA"];
LINEAS_NUM =  ["21", "22", "23", "24", "25", "26", "27", "30", "C-55", "35", "36", "38", "39", "21N", "22N", "23N", "24N", "01", "02", "03", "04", "05", "06", "07", "8A", "09", "10", "11", "11H", "12", "16", "17", "8B", "191", "192", "M", "136", "C2", "C-51", "C-52", "C-53", "C-54", "C-6", "45", "46A", "46B", "TURI", "31", "30P", "C-6*", "123", "13", "SE","U-1","13N"];
LINEAS_URBANAS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "11H", "12", "13", "16", "17", "191", "192", "22", "22N", "27", "39", "45", "13N"];

var INFOLINEAS_TEMPLATE =
        {
    "schema-version": 1,
    "template": {
        "category-layout": "horizontal-list",
        "card-size": "small",
        "card-background": "color:///#4f5d73"
    },
    "components": {
        "title": "parada",
        "subtitle": "datos"
    }
}

var TIEMPOS_TEMPLATE =
        {
    "schema-version": 1,
    "template": {
        "category-layout": "vertical-journal",
        "card-layout": "vertical",
        "card-size": "medium",
        "card-background": "color:///white"
    },
    "components": {
        "title": "linea",
        "subtitle": "destino",
        "summary" : "tiempo",
        "background" : "background"

    }
}


var DATOS_TEMPLATE =
        {
    "schema-version": 1,
    "template": {
        "category-layout": "vertical-journal",
        "card-layout": "vertical",
        "card-size": "large",
        "card-background": "color:///white"

    },
    "components": {
        "title": "titulo",
        "summary" : "sumario",
        "subtitle": "subtitulo",
        "mascot": {
            "field": "art_tb", "aspect-ratio":1.6
        }

    }
}

var ERROR_TEMPLATE =
        {
    "schema-version": 1,
    "template": {
        "category-layout": "vertical-journal",
        "card-layout": "vertical",
        "card-size": "large",
        "card-background": "color:///white"

    },
    "components": {
        "title": "titulo",
        "summary" : "sumario"

    }
}


/*"art": {
    "field": "art", "aspect-ratio":1.6
}*/

var linea;
var sentido;
var parada;
var resultadoParadas = {};

scopes.self.initialize(
            {}
            ,
            {
                run: function() {
                    console.log('Running...')
                },
                start: function(scope_id) {
                    console.log('Starting scope id: '
                                + scope_id
                                + ', '
                                + scopes.self.scope_directory);


                    linea = '24';
                    sentido = 'IDA';
                },
                search: function(canned_query, metadata) {
                    return new scopes.lib.SearchQuery(
                                canned_query,
                                metadata,
                                // run
                                function(search_reply) {

                                    var qs = canned_query.query_string();

                                    //Parada incial
                                    var parada_ini = scopes.self.settings['ini_parada'].get_string();

                                    //Linea inicial
                                    linea = scopes.self.settings['ini_linea'].get_string();

                                    //Sentido inicial
                                    if(scopes.self.settings['ini_sentido'].get_int() === 0){
                                        sentido = 'IDA';
                                    }else{
                                        sentido = 'VUELTA';
                                    }



                                    //console.log("busqueda: " + qs);
                                    console.log("parada inicial: " + sentido);

                                    //Mantener la parada actual en caso de ya tenerla
                                    if(!qs && parada){
                                        qs = parada;
                                    }else if(!qs){
                                        qs = parada = parada_ini;
                                    }



                                    //Configuracion de la seccion de 'department' con lista de lineas y sentido del recorrido
                                    var root_department = new scopes.lib.Department("", canned_query, "Bus Lines");

                                    LINEAS_NUM.forEach(function(linea, i){
                                        var child_department = new scopes.lib.Department(linea, canned_query, LINEAS_DESC[i]);
                                        root_department.add_subdepartment(child_department);

                                        //Ida y vuelta
                                        var child_department_ida = new scopes.lib.Department(linea + "_IDA", canned_query, "Ida");
                                        var child_department_vuelta = new scopes.lib.Department(linea + "_VUELTA", canned_query, "Vuelta");
                                        child_department.add_subdepartment(child_department_ida);
                                        child_department.add_subdepartment(child_department_vuelta);

                                    });

                                    search_reply.register_departments(root_department);

                                    //Control de la seleccion de un 'department'
                                    if(canned_query.department_id()){

                                        if(canned_query.department_id().indexOf("_IDA") > -1){

                                            var lineaSelIda = canned_query.department_id().substring(0, canned_query.department_id().indexOf("_IDA"));

                                            linea = lineaSelIda;
                                            sentido = 'IDA';

                                        } else if(canned_query.department_id().indexOf("_VUELTA") > -1){

                                            var lineaSelVuelta = canned_query.department_id().substring(0, canned_query.department_id().indexOf("_VUELTA"));

                                            linea = lineaSelVuelta;
                                            sentido = 'VUELTA';

                                        }


                                    }
                                    ////Department



                                    //Uri para cargar los tiempos de la parada seleccionada
                                    var parada_uri = function(valor){

                                        canned_query.set_query_string(valor);

                                        return canned_query.to_uri();
                                    }

                                    var seccion_paradas_cargado = false;

                                    //Mostrar resultados en funcion del sentido indicado
                                    var mostrar_resultados_paradas = function(){

                                        var resultado = [];
                                        if(sentido === 'VUELTA'){
                                            resultado = arrayControl(resultadoParadas.vuelta);
                                        }else{
                                            resultado = arrayControl(resultadoParadas.ida);
                                        }

                                        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(INFOLINEAS_TEMPLATE));
                                        var category = search_reply.register_category("current", resultado[0].linea + " -> " + resultado[0].sentido, "", category_renderer);

                                        for (i = 0; i < resultado.length; i++) {

                                            var categorised_result = new scopes.lib.CategorisedResult(category);
                                            categorised_result.set_uri(parada_uri(resultado[i].codigo));
                                            categorised_result.set("parada",resultado[i].codigo);
                                            categorised_result.set("datos", resultado[i].nombre);

                                            search_reply.push(categorised_result);

                                        }


                                        seccion_paradas_cargado = true;

                                        console.log('Datos paradas cargados en pantalla');

                                    }


                                    //Cargar los datos de paradas devueltos por el servicio
                                    var cargar_paradas_cb = function(response) {
                                        var res = '';

                                        // Another chunk of data has been recieved, so append it to res
                                        response.on('data', function(chunk) {
                                            res += chunk;
                                        });

                                        // The whole response has been recieved
                                        response.on('end', function() {

                                            //console.log("Res: " + res );

                                            r = XML.parse(res);

                                            //Para almancenar los resultados                                            
                                            resultadoParadas.ida = [];
                                            resultadoParadas.vuelta = [];
                                            resultadoParadas.linea = linea;

                                            //Ir a resultados
                                            var soapBody = r['soap:Body'];
                                            var getRutasSublineaResponse = soapBody['GetRutasSublineaResponse'];
                                            var getRutasSublineaResult = getRutasSublineaResponse['GetRutasSublineaResult'];

                                            //Resultados
                                            var infoRuta = arrayControl(getRutasSublineaResult['InfoRuta']);

                                            for (i = 0; i < infoRuta.length; i++) {

                                                var nombre = infoRuta[i].nombre;

                                                //secciones
                                                var secciones = infoRuta[i].secciones;
                                                var infoSeccion = arrayControl(secciones.InfoSeccion);

                                                for (j = 0; j < infoSeccion.length; j++) {

                                                    var seccion = infoSeccion[j].seccion;
                                                    var longitud = infoSeccion[j].longitud;
                                                    var nodos = infoSeccion[j].nodos;

                                                    //Listado de nodos
                                                    var infoNodoSeccion = arrayControl(nodos.InfoNodoSeccion);

                                                    for (k = 0; k < infoNodoSeccion.length; k++) {

                                                        var nodo = infoNodoSeccion[k].nodo;
                                                        var tipo = infoNodoSeccion[k].tipo;
                                                        var nombreNodo = infoNodoSeccion[k].nombre;

                                                        //Filtrar por el tipo adecuado
                                                        if (tipo === '3' || tipo === '1') {

                                                            var parada = {};
                                                            parada.nombre = nombreNodo;
                                                            parada.codigo = nodo;
                                                            parada.sentido = nombre;
                                                            parada.linea = linea;

                                                            //Guardar en funcion de si es ida o vuelta
                                                            if(i === 0){
                                                                resultadoParadas.ida.push(parada);
                                                            }else{
                                                                resultadoParadas.vuelta.push(parada);
                                                            }


                                                        }


                                                    }


                                                }


                                            }

                                            mostrar_resultados_paradas();
                                            lanzar_cargar_tiempos();




                                            console.log('Resultados de paradas parseados');

                                        });
                                    }



                                    //Llamada al servicio con los datos de las paradas
                                    var lanzar_carga_paradas = function(){

                                        //Datos POST para montar la cabecera soap del servicio
                                        var sr_paradas = '<?xml version="1.0" encoding="utf-8"?>'
                                                + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
                                                + '<soap:Body>' + '<GetRutasSublinea xmlns="http://tempuri.org/">'
                                                + '<label>' + linea + '</label>' + '<sublinea>1</sublinea>'
                                                //+ '<label>24</label>' + '<sublinea>1</sublinea>'
                                                + '</GetRutasSublinea>' + '</soap:Body>' + '</soap:Envelope>';

                                        console.log("Llamadar servicio de paradas");

                                        http.request({
                                                        host: query_host,
                                                        path: query_path_estructura,
                                                        method: 'POST',
                                                         headers: {
                                                             'Content-Type': 'text/xml; charset=utf-8',
                                                             'Content-Length': sr_paradas.length
                                                         }
                                                     },
                                                     cargar_paradas_cb
                                                    ).end(sr_paradas);
                                    }

                                    if(resultadoParadas !== undefined && resultadoParadas != null && resultadoParadas.linea === linea){
                                        mostrar_resultados_paradas();
                                    }else{
                                        lanzar_carga_paradas();
                                    }

                                    /////////////////////


                                    //Carga de tiempos de la parada
                                    var cargar_tiempos_cb = function(response) {
                                        var res = '';

                                        // Another chunk of data has been recieved, so append it to res
                                        response.on('data', function(chunk) {
                                            res += chunk;
                                        });

                                        // The whole response has been recieved
                                        response.on('end', function() {
                                            try {

                                                //console.log("Res: " + res );

                                                r = XML.parse(res);

                                                //Ir a resultados
                                                var soapBody = r['soap:Body'];
                                                var getPasoParadaResponse = soapBody['GetPasoParadaResponse'];
                                                var getPasoParadaResult = getPasoParadaResponse['GetPasoParadaResult'];

                                                //Status
                                                var status = getPasoParadaResponse['status'];
                                                console.log("Status: " + status);

                                                //Resultado
                                                var pasoParada = arrayControl(getPasoParadaResult['PasoParada']);

                                                //console.log("Resultados: " + pasoParada.length);

                                                var resultados = [];
                                                resultados = pasoParada;

                                                var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(TIEMPOS_TEMPLATE));
                                                var category = search_reply.register_category("lista_tiempos", "Bus Stop: " + parada, "", category_renderer);

                                                var tiempo_id = 1000000;
                                                for (i = 0; i < resultados.length; i++) {
                                                    var categorised_result = new scopes.lib.CategorisedResult(category);
                                                    categorised_result.set_uri((tiempo_id++).toString());

                                                    //categorised_result.set_art("http://openweathermap.org/img/w/" + r.forecast.time[i].symbol.var + ".png");
                                                    categorised_result.set("linea", "Bus Line: " + resultados[i].linea);
                                                    categorised_result.set("tiempo", formatearTiempos(resultados[i].e1.minutos,resultados[i].e2.minutos));
                                                    categorised_result.set("destino", resultados[i].ruta);


                                                    if(LINEAS_URBANAS.indexOf(resultados[i].linea) > -1){
                                                        //#ef5350
                                                        categorised_result.set("background", "color:///#ef5350");
                                                    }else{
                                                        //#42a5f5
                                                        categorised_result.set("background", "color:///#42a5f5");
                                                    }


                                                    categorised_result.set_intercept_activation();

                                                    search_reply.push(categorised_result);
                                                }

                                                if(resultados.length < 1){
                                                    mostrar_error();
                                                }

                                                // We are done, call finished() on our search_reply
                                                //search_reply.finished();
                                            }
                                            catch(e) {
                                                // Forecast not available
                                                console.log("Information for '" + qs + "' is unavailable: " + e);
                                                mostrar_error();
                                            }

                                            mostrar_datos();

                                            // We are done, call finished() on our search_reply
                                            search_reply.finished();

                                        });
                                    }


                                    //Llamada al servicio de tiempos
                                    var lanzar_cargar_tiempos = function(){
                                        if(qs && qs.length === 4){

                                            console.log("RECARGAR TIEMPOS: " + qs);

                                            parada = qs;

                                            var sr = '<?xml version="1.0" encoding="utf-8"?>'
                                                    + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' + '<soap:Body>'
                                                    + '<GetPasoParada xmlns="http://tempuri.org/">' + //'<linea>24</linea>'+
                                                    //'<parada>2947</parada>'+
                                                    '<parada>' + parada + '</parada>'
                                                    + '<status>0</status>'
                                                    + '</GetPasoParada>' + '</soap:Body>' + '</soap:Envelope>'

                                            //console.log("Llamada servicio: " + sr);

                                            http.request({
                                                            host: query_host,
                                                            path: query_path_dinamica,
                                                            method: 'POST',
                                                             headers: {
                                                                 'Content-Type': 'text/xml; charset=utf-8',
                                                                 'Content-Length': sr.length
                                                             }
                                                         },
                                                         cargar_tiempos_cb
                                                        ).end(sr);
                                        }

                                    }

                                    if(seccion_paradas_cargado){
                                        lanzar_cargar_tiempos();
                                    }

                                    //Pie con datos del desarrollo
                                    var mostrar_datos = function(){
                                        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(DATOS_TEMPLATE));
                                        var category = search_reply.register_category("datos", "", "", category_renderer);
                                        var categorised_result = new scopes.lib.CategorisedResult(category);
                                        categorised_result.set_uri("http://alberapps.blogspot.com");

                                        categorised_result.set("titulo", "Alberto Montiel 2016\nalberapps.blogspot.com");
                                        categorised_result.set("subtitulo", "alberapps@gmail.com");
                                        categorised_result.set("sumario", "This application is UNofficial.\nLines and times data offered and maintained by: alicante.subus.es");



                                        categorised_result.set("art_tb", scopes.self.scope_directory + '/icon.png');

                                        categorised_result.set_intercept_activation();

                                        search_reply.push(categorised_result);
                                    }

                                    //Mostrar aviso de error
                                    var mostrar_error = function(){
                                        var category_renderer = new scopes.lib.CategoryRenderer(JSON.stringify(ERROR_TEMPLATE));
                                        var category = search_reply.register_category("error", "", "", category_renderer);
                                        var categorised_result = new scopes.lib.CategorisedResult(category);
                                        categorised_result.set_uri("error1");

                                        categorised_result.set("titulo", "No Data!");
                                        categorised_result.set("sumario", "Asegurate de que la parada indicada existe y del horario del servicio");

                                        categorised_result.set_intercept_activation();

                                        search_reply.push(categorised_result);
                                    }

                                },
                                // cancelled
                                function() {
                                });
                },
                preview: function(result, action_metadata) {
                    return new scopes.lib.PreviewQuery(
                                result,
                                action_metadata,
                                // run
                                function(preview_reply) {
                                    /*var layout1col = new scopes.lib.ColumnLayout(1);
                                    var layout2col = new scopes.lib.ColumnLayout(2);
                                    var layout3col = new scopes.lib.ColumnLayout(3);
                                    layout1col.add_column(["image", "header", "summary"]);

                                    layout2col.add_column(["image"]);
                                    layout2col.add_column(["header", "summary"]);

                                    layout3col.add_column(["image"]);
                                    layout3col.add_column(["header", "summary"]);
                                    layout3col.add_column([]);

                                    preview_reply.register_layout([layout1col, layout2col, layout3col]);

                                    var header = new scopes.lib.PreviewWidget("header", "header");
                                    header.add_attribute_mapping("title", "title");
                                    header.add_attribute_mapping("subtitle", "subtitle");

                                    var image = new scopes.lib.PreviewWidget("image", "image");
                                    image.add_attribute_mapping("source", "art");

                                    var description = new scopes.lib.PreviewWidget("summary", "text");
                                    description.add_attribute_mapping("text", "description");

                                    preview_reply.push([image, header, description ]);
                                    preview_reply.finished();*/
                                },
                                // cancelled
                                function() {
                                });
                }
            }
            );

/*
* Formatea los tiempos de salida
*/
function formatearTiempos(minutos1, minutos2) {

    //1. 20 min - 19:40\n2. 30 min - 19:50"

    var dato = ''

    if (minutos1 !== '0') {

        //Tiempo
        dato += "1. " + addZero(minutos1) + " min"

        //Hora
        var dateTime = new Date();
        var minutos1Int = parseInt(minutos1);
        dateTime.setMinutes(new Date().getMinutes() + minutos1Int);
        dato += " - " + formatHour(dateTime);
    } else {
        dato += "1. At bus stop";
    }

    if (minutos2 !== '-1') {

        dato += "\n2. " + addZero(minutos2) + " " + "min"

        //Hora
        var dateTime2 = new Date();
        var minutos2Int = parseInt(minutos2);
        dateTime2.setMinutes(new Date().getMinutes() + minutos2Int);
        dato += " - " + formatHour(dateTime2);
    } else {
        dato += " - " + "2. No data";
    }

    return dato
}

//Formato de hora
function formatHour(date){

    var h = addZero(date.getHours());
    var m = addZero(date.getMinutes());

    return h + ":" + m;

}

//Cero a la izquierda
function addZero(i){
    if( i<10){
        i = "0" + i;
    }
    return i;
}



//Controla si solo hay un resultado o varios
function arrayControl(object){

    if(object !== undefined && object !== null){

         if(Array.isArray(object)){
            return object;
         }else{
            var temp = object;
            object = [temp];
            return object;
        }

    }else{
        return [];
    }

}

