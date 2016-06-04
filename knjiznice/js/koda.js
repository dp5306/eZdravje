var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
            "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
    ehrId = "";

    // TODO: Potrebno implementirati

    return ehrId;
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija


function kreirajEHRzaBolnika() {
    sessionId = getSessionId();

    var ime = $("#kreirajIme").val();
    var priimek = $("#kreirajPriimek").val();
    var datumRojstva = $("#kreirajDatumRojstva").val();
    var spol = $("#spol").val();

    var casNosecnosti = $("#casNosecnosti").val();
    var starostMatere = $("#starostMatere").val();
    var APGAR = $("#").val();
    var Dolzina = $("#APGAR").val();
    var Teza = $("#teza").val();
    console.log(Teza);

    if (!spol || !ime || !priimek || !datumRojstva || spol.trim().length == 0 || ime.trim().length == 0 ||
        priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
        $("#kreirajSporocilo").html("<span class='obvestilo label " +
            "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    }
    else {
        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });

        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function(data) {
                var ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datumRojstva,
                    partyAdditionalInfo: [{
                        key: "ehrId",
                        value: ehrId
                    }, {
                        "key": "sex",
                        "value": spol
                    }, {
                        "key": "timePregnant",
                        "value": casNosecnosti
                    }, {
                        "key": "ageMother",
                        "value": starostMatere
                    }, {
                        "key": "APG",
                        "value": APGAR
                    }, {
                        "key": "length",
                        "value": Dolzina
                    }, {
                        "key": "weight",
                        "value": Teza
                    }]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function(party) {
                        if (party.action == 'CREATE') {
                            $("#kreirajSporocilo").html("<span class='obvestilo " +
                                "label label-success fade-in'>Uspešno kreiran EHR '" +
                                ehrId + "'.</span>");
                            $("#dodajVitalnoEHR").val(ehrId);
                        }
                    },
                    error: function(err) {
                        $("#kreirajSporocilo").html("<span class='obvestilo label " +
                            "label-danger fade-in'>Napaka '" +
                            JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
    }
}

/*
function preberiZgodovinoMeritev() {
    sessionId = getSessionId();
    var EHRid = ;
    
    if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	}
	else{
	    var searchData = [{
	        key: "ehrId"
	        value: EHRid
	    }];
	    $.ajax({
	        url: baseUrl + "/demographics/party/query",
	        type: "POST",
	        contentType: "application/json",
	        data: JSON.stringify(searchData),
	        headers: {"Ehr-Session": sessionId},
	        success: function(res){
	            var results = "";
	            
	            
	            
	            
	            
	            for(i in res.parties){
	              var party = res.parties[i];
	              
	              
	              
	              
	              for(j in party.partyAdditionalInfo){
	                if (party.partyAdditionalInfo[j].key === "timePregnant"){
	                    
	                }
	              };
	            };
	        },
	        error: function(err){}
	    });
	}
}
*/



var riskPritisk = 0;
var riskKisik = 0;
var riskKoza = 0;
var riskDihanje = 0;
var riskTemperatura = 0;
var riskCPR = 0;
var skupnoRizik = 0;



function dodajMeriteVitalnihZnakov() {

    sessionId = getSessionId();

    var ehrId = $("#dodajVitalnoEHR").val();
    var Pulz = $("#dodajVitalnoPulz").val();
    var dist = $("#dodajVitalnoKrvniTlakDiastolicni").val();
    var sist = $("#dodajVitalnoKrvniTlakSistolicni").val();
    var dihanje = $("#dodajVitalnoFrekvencaDihanja").val();
    var kisik = $("#dodajVitalnoNasicenostKrviSKisikom").val();
    var temperatura = $("#dodajVitalnoTelesnaTemperatura").val();
    var CPR = $("#dodajVitalnoCPR").val();
    var barvaKoze = $("#dodajVitalnoBarvaKoze").val();
    riskPritisk = 1;
    riskKisik = 1;
    riskKoza = 0;
    riskDihanje = 1;
    riskTemperatura = 1;
    riskCPR = 1;
    skupnoRizik = 0;
    if (dist < 25 || dist > 55 || sist < 45 || sist > 75) {
        riskPritisk = 100;
        skupnoRizik += 100;
    }
    else if (dist < 30 || dist > 50 || sist < 50 || sist > 70) {
        riskPritisk = 60;
        skupnoRizik += 50;
    }
    else if (dist < 35 || dist > 45 || sist < 55 || sist > 65) {
        riskPritisk = 30;
        skupnoRizik += 10;
    }

    if (kisik < 80) {
        riskKisik = 100;
        skupnoRizik += 100;
    }
    else if (kisik < 87) {
        riskKisik = 60;
        skupnoRizik += 50;
    }
    else if (kisik < 95) {
        riskKisik = 30;
        skupnoRizik += 10;
    }

    if (barvaKoze == "Modra" || barvaKoze == "Bleda") {
        riskKoza = 100;
        skupnoRizik += 50;
    }

    if (dihanje < 17 || dihanje > 45) {
        riskDihanje = 60;
        skupnoRizik += 10;
    }
    else if (dihanje < 25 || dihanje > 40) {
        riskDihanje = 30;
        skupnoRizik += 40;
    }

    if (temperatura > 38 || temperatura < 36) {
        riskTemperatura = 100;
        skupnoRizik += 80;
    }
    else if (temperatura > 37.4 || temperatura < 36.7) {
        riskTemperatura = 50;
        skupnoRizik += 30;
    }

    if (CPR > 9) {
        riskCPR = 100;
        skupnoRizik += 100;
    }
    else if (CPR > 7) {
        riskCPR = 60;
        skupnoRizik += 50;
    }
    else if (CPR > 5) {
        riskCPR = 30;
        skupnoRizik += 10;
    }

    
    


    if (!ehrId || ehrId.trim().length == 0 || !Pulz || Pulz.trim().length == 0 || !dist || dist.trim().length == 0 || !sist || sist.trim().length == 0 || !dihanje || dihanje.trim().length == 0 || !kisik || kisik.trim().length == 0 || !temperatura || temperatura.trim().length == 0 || !CPR || CPR.trim().length == 0){ //|| !barvaKoze || barvaKoze.trim().length == 0) {
        $("#vnesi4").html("<span class='obvestilo " +
            "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    }
    else {
        
        if(skupnoRizik > 150){
            $("#Napotki").collapse("show");
            setTimeout(tmout, 20000);
        }
        function tmout(){
            $("#Napotki").collapse("hide");
        }

        var chart1 = $("#container").highcharts();
        chart1.series[0].setData([riskPritisk, riskKisik, riskKoza, riskDihanje, riskTemperatura, riskCPR], true);

        var chart2 = $("#container-speed").highcharts();
        chart2.series[0].setData([skupnoRizik], true);


        $("#vnesi4").html("<span class='obvestilo " +
            "label label-success fade-in'>Uspešno vnesene meritve!</span>");
        console.log("dodal meritve vitalnih znakov");
        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });
        var podatki = {
            // Struktura predloge je na voljo na naslednjem spletnem naslovu:
            // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example

            "partyAdditionalInfo": [{
                "key": "EHR",
                "value": ehrId
            }, {
                "key": "Pulse",
                "value": Pulz
            }, {
                "key": "distolic",
                "value": dist
            }, {
                "key": "sistolic",
                "value": sist
            }, {
                "key": "breeathing",
                "value": dihanje
            }, {
                "key": "oxygen",
                "value": kisik
            }, {
                "key": "temp",
                "value": temperatura
            }, {
                "key": "CPRv",
                "value": CPR
            }, {
                "key": "skinColour",
                "value": barvaKoze
            }]
        };

        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatki),
            success: function(res) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-success fade-in'>" +
                    res.meta.href + ".</span>");
            },
            error: function(err) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
            }
        });
    }
}



/// graf

$(function() {


    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    $('#container').highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'


        },
        title: {
            text: 'Delež rizičnosti posameznih meritev'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Brands',
            data: [{
                name: 'Pritisk',
                y: riskPritisk,
                sliced: true,
                selected: true
            }, {
                name: 'Kisik',
                y: riskKisik
            }, {
                name: 'Barva kože',
                y: riskKoza
            }, {
                name: 'Dihanje',
                y: riskDihanje
            }, {
                name: 'Temperatura',
                y: riskTemperatura
            }, {
                name: 'CPR',
                y: riskCPR
            }]
        }]
    });
});









//graf 2
$(function() {
    var skupnoRizik = 0;

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: {
            text: 'Skupni faktor rizičnosti'
        },

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 600,
            title: {
                text: ''
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [skupnoRizik],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">ocena rizičnosti</span></div>'
            },
            tooltip: {
                valueSuffix: 'ocena rizičnosti'
            }
        }]

    }));

});


$(function() {
    $('#containerx').highcharts({

        title: {
            text: 'Spremljanje skupne rizičnosti'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: {
            minorTickInterval: 1
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}'
        },

        series: [{
            data: [],
            pointStart: 0
        }]
    });
});



$(function() {
    $('#containery').highcharts({

        title: {
            text: 'Spremljanje izbrane vrednosti'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: {},

        tooltip: {
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}'
        },

        series: [{
            data: [],
            pointStart: 0
        }]
    });
});

function prikazi() {
    $("#Graf2").collapse("show");
    $("#Graf3").collapse("show");
}

function prikazi2() {
    $("#Graf1").collapse("show");
}


function Osvezi() {
    var chart1 = $("#container").highcharts();
    chart1.series[0].setData(data, true);

    var chart2 = $("#container-speed").highcharts();
    chart2.series[0].setData(data, true);
}






var EHRID11 = "0d7f6757-dcf7-4a37-87ad-a2ff4c6ed47b";
var EHRID22 = "b994dc94-565c-4d42-8955-715883894e74";
var EHRID33 = "4d6d1ca8-f841-46a9-a9a4-384e310fcc2c";

var a = [];

function preberiMeritveVitalnihZnakov() {

console.log(EHRID33);

    $("#vnesi3").html("<span class='obvestilo " +
        "label label-success fade-in'></span>");

    console.log("berem");
    sessionId = getSessionId();
console.log("berem2");
    a0 = [];
    a1 = [];
    a2 = [];
    a3 = [];
    a4 = [];
    a5 = [];
    a6 = [];
    a7 = [];
    a8 = [];

    var EHR1 = $("#EHRRR").val();

    if (!EHR1 || EHR1.trim().length == 0) {
        console.log("vnesi");
        $("#vnesi3").html("<span class='obvestilo " +
            "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
    }
    else {



        var searchData = [{
            key: "EHR",
            value: EHR1
        }];
        $.ajax({
            url: baseUrl + "/demographics/party/query",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(searchData),
            headers: {
                "Ehr-Session": sessionId
            },
            success: function(res) {
                for (i in res.parties) {
                    var party = res.parties[i];
                    var Pulz = "";
                    var dis = "";
                    var sis = "";
                    var frek = "";
                    var nasicenost = "";
                    var tempa = "";
                    var CPRx = "";
                    var barva = "";

                    for (j in party.partyAdditionalInfo) {
                        if (party.partyAdditionalInfo[j].key === "Pulse") {
                            Pulz = party.partyAdditionalInfo[j].value;
                            a0.push(parseInt(Pulz));
                            console.log("prebrano");
                            
                        }
                        if (party.partyAdditionalInfo[j].key === "distolic") {
                            dis = party.partyAdditionalInfo[j].value;
                            a1.push(parseInt(dis));
                        }
                        if (party.partyAdditionalInfo[j].key === "sistolic") {
                            sis = party.partyAdditionalInfo[j].value;
                            a2.push(parseInt(sis));
                        }
                        if (party.partyAdditionalInfo[j].key === "breeathing") {
                            frek = party.partyAdditionalInfo[j].value;
                            a3.push(parseInt(frek));
                        }
                        if (party.partyAdditionalInfo[j].key === "oxygen") {
                            nasicenost = party.partyAdditionalInfo[j].value;
                            a4.push(parseInt(nasicenost));
                        }
                        if (party.partyAdditionalInfo[j].key === "temp") {
                            tempa = party.partyAdditionalInfo[j].value;
                            a5.push(parseInt(tempa));
                        }
                        if (party.partyAdditionalInfo[j].key === "CPRv") {
                            CPRx = party.partyAdditionalInfo[j].value;
                            a6.push(parseInt(CPRx));
                        }
                        if (party.partyAdditionalInfo[j].key === "skinColour") {
                            barva = party.partyAdditionalInfo[j].value;
                            a7.push(parseInt(barva));
                        }
                        if (Pulz != "" && dis != "" && sis != "" && nasicenost != "" && tempa != "" && CPRx != "" && barva != "" && frek != "") {
                            
                            
                            console.log("prebrano");
                            var skupno = 0;

                            if (dis < 25 || dis > 55 || sis < 45 || sis > 75) {
                                skupno += 100;
                            }
                            else if (dis < 30 || dis > 50 || sis < 50 || sis > 70) {;
                                skupno += 50;
                            }
                            else if (dis < 35 || dis > 45 || sis < 55 || sis > 65) {
                                skupno += 10;
                            }

                            if (nasicenost < 80) {
                                skupno += 100;
                            }
                            else if (nasicenost < 87) {
                                skupno += 50;
                            }
                            else if (nasicenost < 95) {
                                skupno += 10;
                            }

                            if (barva == "Modra" || barva == "Bleda") {
                                skupno += 50;
                            }

                            if (frek < 17 || frek > 45) {
                                skupno += 10;
                            }
                            else if (frek < 25 || frek > 40) {
                                skupno += 40;
                            }

                            if (tempa > 38 || tempa < 36) {
                                skupno += 80;
                            }
                            else if (tempa > 37.4 || tempa < 36.7) {
                                skupno += 30;
                            }

                            if (CPRx > 9) {
                                skupno += 100;
                            }
                            else if (CPRx > 7) {
                                skupno += 50;
                            }
                            else if (CPRx > 5) {
                                skupno += 10;
                            }

                            a8.push(parseInt(skupno));

                            break;
                        }
                    }
                }

                $("#vnesi3").html("<span class='obvestilo " +
                    "label label-success fade-in'>Podatki o pacientu uspešno prebrani!</span>");

                console.log(a4[0]);
                console.log(a4[1]);
                console.log(a4[2]);
                

                var chart1 = $("#containerx").highcharts();
                chart1.series[0].setData(a8, true);

                var az = $("#izberitee").val();
                
                if(az=="Pulz"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a0, true);
                }
                else if(az=="Diastolični"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a1, true);
                }
                else if(az=="Sistolični"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a2, true);
                }
                else if(az=="Frekvenca Dihanja"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a3, true);
                }
                else if(az=="Nasičenost s Kisikom"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a4, true);
                }
                else if(az=="Temperatura"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a5, true);
                }
                else if(az=="CPR"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a6, true);
                }
                else if(az=="Skupna Rizičnost"){
                var chart1 = $("#containery").highcharts();
                chart1.series[0].setData(a8, true);
                }
            },
            error: function(err) {

            }
        });
    }
}


function kreirajOsnovnePodatke() {
    var o = $("#selectx").val();
    console.log(o);
    if (o == "a") {
        $("#kreirajIme").val("Mikasa");
        $("#kreirajPriimek").val("Ackerman");
        $("#kreirajDatumRojstva").val("2016-02-10T09:08");
        $("#spol").val("Ženski");

        $("#casNosecnosti").val("39");
        $("#starostMatere").val("22");
        $("#APGAR").val("10");
        $("#dolzina").val("39");
        $("#teza").val("3000");
    }
    else if (o == "b") {
        $("#kreirajIme").val("Touka");
        $("#kreirajPriimek").val("Kirishima");
        $("#kreirajDatumRojstva").val("2016-01-22T09:08");
        $("#spol").val("Moški");

        $("#casNosecnosti").val("35");
        $("#starostMatere").val("17");
        $("#APGAR").val("7");
        $("#dolzina").val("33");
        $("#teza").val("2300");
    }
    else if (o == "c") {
        $("#kreirajIme").val("Claire");
        $("#kreirajPriimek").val("Clay");
        $("#kreirajDatumRojstva").val("2015-10-22T09:08");
        $("#spol").val("Moški");

        $("#casNosecnosti").val("42");
        $("#starostMatere").val("33");
        $("#APGAR").val("5");
        $("#dolzina").val("29");
        $("#teza").val("2222");
    }
}

function kreiraj2() {
    console.log("aa");
    var o = $("#selectx2").val();
    console.log(o);
    if (o == "a") {
        $("#dodajVitalnoEHR").val("x");
        $("#dodajVitalnoPulz").val("105");
        $("#dodajVitalnoKrvniTlakSistolicni").val("60");
        $("#dodajVitalnoKrvniTlakDiastolicni").val("40");
        $("#dodajVitalnoFrekvencaDihanja").val("30");
        $("#dodajVitalnoNasicenostKrviSKisikom").val("99");
        $("#dodajVitalnoTelesnaTemperatura").val("37.4");
        $("#dodajVitalnoCPR").val("1");
        $("#dodajVitalnoBarvaKozee").val("Rožnata");
    }
    else if (o == "b") {
        $("#dodajVitalnoEHR").val("y");
        $("#dodajVitalnoPulz").val("90");
        $("#dodajVitalnoKrvniTlakSistolicni").val("50");
        $("#dodajVitalnoKrvniTlakDiastolicni").val("35");
        $("#dodajVitalnoFrekvencaDihanja").val("25");
        $("#dodajVitalnoNasicenostKrviSKisikom").val("88");
        $("#dodajVitalnoTelesnaTemperatura").val("36.4");
        $("#dodajVitalnoCPR").val("3");
        $("#dodajVitalnoBarvaKozee").val("Rožnata");
    }
    else if (o == "c") {
        $("#dodajVitalnoEHR").val("z");
        $("#dodajVitalnoPulz").val("85");
        $("#dodajVitalnoKrvniTlakSistolicni").val("30");
        $("#dodajVitalnoKrvniTlakDiastolicni").val("20");
        $("#dodajVitalnoFrekvencaDihanja").val("17");
        $("#dodajVitalnoNasicenostKrviSKisikom").val("85");
        $("#dodajVitalnoTelesnaTemperatura").val("36");
        $("#dodajVitalnoCPR").val("7");
        $("#dodajVitalnoBarvaKozee").val("Modra");
    }
}

function kreiraj3() {
    var o = $("#selectx3").val();
    if (o == "a") {
        $("#EHRRR").val(EHRID11);
    }
    else if (o == "b") {
        $("#EHRRR").val(EHRID22);
    }
    else if (o == "c") {
         $("#EHRRR").val(EHRID33);
    }
}




function generiranjePodatkov(){
    
    var imee = ["Mikasa", "Touka", "Claire"];
    var priimekk = ["Ackerman", "Kirishima", "Clay"];
    var datumRojstvaa = ["2016-02-10T09:08", "2016-01-22T09:08", "2015-10-22T09:08"];
    var spoll = ["Moški", "Moški", "Ženski"];
    
    var casNosecnostii = [39, 39, 39];
    var starostMateree = [22, 17, 30];
    var APGARR = [10, 7, 4];
    var Dolzinaa = [39, 35, 30];
    var Tezaa = [3000, 2400, 2000];
    
    
    
    for(var i=0; i < 3; i++){
    
    
    sessionId = getSessionId();

    var ime = imee[i];
    var priimek = priimekk[i];
    var datumRojstva = datumRojstvaa[i];
    var spol = spoll[i];

    var casNosecnosti = casNosecnostii[i];
    var starostMatere = starostMateree[i];
    var APGAR = APGARR[i];
    var Dolzina = Dolzinaa[i];
    var Teza = Tezaa[i];
    
    console.log(Teza);


        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });

        $.ajax({
            async: false,
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function(data) {
                var ehrId = data.ehrId;
                console.log(i);
                if (i == 0){EHRID11 = ehrId; console.log(EHRID11);}
                else if(i == 1){EHRID22 = ehrId; console.log(EHRID22);}
                else if(i == 2){EHRID33 = ehrId; console.log(EHRID33);}
                
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datumRojstva,
                    partyAdditionalInfo: [{
                        key: "ehrId",
                        value: ehrId
                    }, {
                        "key": "sex",
                        "value": spol
                    }, {
                        "key": "timePregnant",
                        "value": casNosecnosti
                    }, {
                        "key": "ageMother",
                        "value": starostMatere
                    }, {
                        "key": "APG",
                        "value": APGAR
                    }, {
                        "key": "length",
                        "value": Dolzina
                    }, {
                        "key": "weight",
                        "value": Teza
                    }]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function(party) {
                        if (party.action == 'CREATE') {
                            $("#kreirajSporocilo").html("<span class='obvestilo " +
                                "label label-success fade-in'>Uspešno kreiran EHR '" +
                                ehrId + "'.</span>");
                            $("#dodajVitalnoEHR").val(ehrId);
                        }
                    },
                    error: function(err) {
                        $("#kreirajSporocilo").html("<span class='obvestilo label " +
                            "label-danger fade-in'>Napaka '" +
                            JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
    
    }
    
    
    
    
    
    
    
    
    
    
    console.log("uspesno1");
    
    var pulzz = [105, 100, 101];
    var distt = [37, 35, 40];
    var sistt = [57, 59, 64];
    var dihanjee = [30, 30, 35];
    var kisikk = [97, 99, 98];
    var temperaturaa = [37, 37.2, 37.4];
    var CPRR = [1,1,1];
    var barvaKozeee = ["Rožnata", "Rožnata", "Rožnata"];
    
    
    for(var i=0; i < 3; i++){
    
     sessionId = getSessionId();

    var ehrId = EHRID11;
    var Pulz = pulzz[i];
    var dist = distt[i];
    var sist = sistt[i];
    var dihanje = dihanjee[i];
    var kisik = kisikk[i];
    var temperatura = temperaturaa[i];
    var CPR = CPRR[i];
    var barvaKoze = barvaKozeee[i];

        $("#vnesi4").html("<span class='obvestilo " +
            "label label-success fade-in'>Uspešno vnesene meritve!</span>");
        console.log("dodal meritve vitalnih znakov");
        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });
        var podatki = {
            // Struktura predloge je na voljo na naslednjem spletnem naslovu:
            // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example

            "partyAdditionalInfo": [{
                "key": "EHR",
                "value": ehrId
            }, {
                "key": "Pulse",
                "value": Pulz
            }, {
                "key": "distolic",
                "value": dist
            }, {
                "key": "sistolic",
                "value": sist
            }, {
                "key": "breeathing",
                "value": dihanje
            }, {
                "key": "oxygen",
                "value": kisik
            }, {
                "key": "temp",
                "value": temperatura
            }, {
                "key": "CPRv",
                "value": CPR
            }, {
                "key": "skinColour",
                "value": barvaKoze
            }]
        };

        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatki),
            success: function(res) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-success fade-in'>" +
                    res.meta.href + ".</span>");
            },
            error: function(err) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
            }
        });
        console.log("uspesno13");
    }
    
    
    
     pulzz = [95, 101, 105];
     distt = [330, 35, 37];
     sistt = [57, 59, 64];
     dihanjee = [20, 30, 30];
     kisikk = [87, 88, 89];
     temperaturaa = [37, 36.9, 36.9];
     CPRR = [6,5,4];
     barvaKozeee = ["Modra", "Rožnata", "Rožnata"];
    
    
    for(var i=0; i < 3; i++){
    
     sessionId = getSessionId();

    var ehrId = EHRID22
    var Pulz = pulzz[i];
    var dist = distt[i];
    var sist = sistt[i];
    var dihanje = dihanjee[i];
    var kisik = kisikk[i];
    var temperatura = temperaturaa[i];
    var CPR = CPRR[i];
    var barvaKoze = barvaKozeee[i];

        $("#vnesi4").html("<span class='obvestilo " +
            "label label-success fade-in'>Uspešno vnesene meritve!</span>");
        console.log("dodal meritve vitalnih znakov");
        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });
        var podatki = {
            // Struktura predloge je na voljo na naslednjem spletnem naslovu:
            // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example

            "partyAdditionalInfo": [{
                "key": "EHR",
                "value": ehrId
            }, {
                "key": "Pulse",
                "value": Pulz
            }, {
                "key": "distolic",
                "value": dist
            }, {
                "key": "sistolic",
                "value": sist
            }, {
                "key": "breeathing",
                "value": dihanje
            }, {
                "key": "oxygen",
                "value": kisik
            }, {
                "key": "temp",
                "value": temperatura
            }, {
                "key": "CPRv",
                "value": CPR
            }, {
                "key": "skinColour",
                "value": barvaKoze
            }]
        };

        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatki),
            success: function(res) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-success fade-in'>" +
                    res.meta.href + ".</span>");
            },
            error: function(err) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
            }
        });
        console.log("uspesno13");
    }
    
    
    
    
    
    pulzz = [80, 94, 78];
    distt = [35, 20, 25];
    sistt = [50, 40, 45];
    dihanjee = [18, 20, 17];
    kisikk = [80, 89, 86];
    temperaturaa = [37, 37.2, 37.4];
    CPRR = [9,7,5];
    barvaKozeee = ["Bleda", "Modra", "Rožnata"];
    
    
    for(var i=0; i < 3; i++){
    
     sessionId = getSessionId();

    var ehrId = EHRID33;
    var Pulz = pulzz[i];
    var dist = distt[i];
    var sist = sistt[i];
    var dihanje = dihanjee[i];
    var kisik = kisikk[i];
    var temperatura = temperaturaa[i];
    var CPR = CPRR[i];
    var barvaKoze = barvaKozeee[i];

        $("#vnesi4").html("<span class='obvestilo " +
            "label label-success fade-in'>Uspešno vnesene meritve!</span>");
        console.log("dodal meritve vitalnih znakov");
        $.ajaxSetup({
            headers: {
                "Ehr-Session": sessionId
            }
        });
        var podatki = {
            // Struktura predloge je na voljo na naslednjem spletnem naslovu:
            // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example

            "partyAdditionalInfo": [{
                "key": "EHR",
                "value": ehrId
            }, {
                "key": "Pulse",
                "value": Pulz
            }, {
                "key": "distolic",
                "value": dist
            }, {
                "key": "sistolic",
                "value": sist
            }, {
                "key": "breeathing",
                "value": dihanje
            }, {
                "key": "oxygen",
                "value": kisik
            }, {
                "key": "temp",
                "value": temperatura
            }, {
                "key": "CPRv",
                "value": CPR
            }, {
                "key": "skinColour",
                "value": barvaKoze
            }]
        };

        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatki),
            success: function(res) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-success fade-in'>" +
                    res.meta.href + ".</span>");
            },
            error: function(err) {
                $("#dodajMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
            }
        });
        console.log("uspesno13");
    }
}