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
    var Teza = $("#Teza").val();
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
                            $("#preberiEHRid").val(ehrId);
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
	
	if(dist<25 || dist>55 || sist<45 || sist>75){riskPritisk = 100; skupnoRizik+= 100;}
	else if(dist<30 || dist>50 || sist<50 || sist>70){riskPritisk = 60; skupnoRizik+= 50;}
	else if(dist<35 || dist>45 || sist<55 || sist>65){riskPritisk = 30; skupnoRizik+= 10;}
	
	if(kisik<80){riskKisik = 100; skupnoRizik+= 100;}
	else if(kisik<87){riskKisik = 60; skupnoRizik+= 50;}
	else if(kisik<95){riskKisik = 30; skupnoRizik+= 10;}
	
	if(barvaKoze == "Modra" || barvaKoze == "Bleda"){riskKoza = 100; skupnoRizik+=50;}
	
	if(dihanje < 17 || dihanje > 45){riskDihanje = 60; skupnoRizik+= 10;}
	else if(dihanje < 25 || dihanje > 40){riskDihanje = 30; skupnoRizik+= 40;}
	
	if(temperatura > 38 || temperatura < 36){riskTemperatura = 100; skupnoRizik+= 80;}
	else if(temperatura > 37.4 || temperatura < 36.7){riskTemperatura = 50; skupnoRizik+= 30;}
	
	if(CPR > 9){riskCPR = 100; skupnoRizik+= 100;}
	else if(CPR > 7){riskCPR = 60; skupnoRizik+= 50;}
	else if(CPR > 5){riskCPR = 30; skupnoRizik+= 10;}
	
	
	var chart1 = $("#container").highcharts();
    chart1.series[0].setData([riskPritisk, riskKisik, riskKoza, riskDihanje, riskTemperatura, riskCPR],true);
    
    var chart2 = $("#container-speed").highcharts();
    chart2.series[0].setData([skupnoRizik],true);

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
	    console.log("dodal meritve vitalnih znakov");
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		
		    "partyAdditionalInfo": [{
		        "key": "EHR",
		        "value": ehrId
		    },
		    {
		        "key": "Pulse",
		        "value": Pulz
		    },
		    {
		        "key": "distolic",
		        "value": dist
		    },
		    {
		        "key": "sistolic",
		        "value": sist
		    },
		    {
		        "key": "breeathing",
		        "value": dihanje
		    },
		    {
		        "key": "oxygen",
		        "value": kisik
		    },
		    {
		        "key": "temp",
		        "value": temperatura
		    },
		    {
		        "key": "CPRv",
		        "value": CPR
		    },
		    {
		        "key": "skinColour",
		        "value": barvaKoze
		    }]
		};

		$.ajax({
		    url: baseUrl + "/demographics/party",
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
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

$(function () {
           

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
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
            data: [
                {
                    name: 'Pritisk', y: riskPritisk, 
                    sliced: true, 
                    selected: true
                },
                { name: 'Kisik', y: riskKisik },
                { name: 'Barva kože', y: riskKoza },
                { name: 'Dihanje', y: riskDihanje },
                { name: 'Temperatura', y: riskTemperatura },
                { name: 'riskCPR', y: riskCPR }
            ]
        }]
    });
});









//graf 2
$(function () {
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
            max: 100,
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


$(function () {
    $('#containerx').highcharts({

        title: {
            text: 'Logarithmic axis demo'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 0.1
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}'
        },

        series: [{
            data: [1, 8, 4, 8, 16, 32, 64, 128, 256, 512],
            pointStart: 0
        }]
    });
});



$(function () {
    $('#containery').highcharts({

        title: {
            text: 'Logarithmic axis demo'
        },

        xAxis: {
            tickInterval: 1
        },

        yAxis: {
            type: 'arithmetic',
            minorTickInterval: 1
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}'
        },

        series: [{
            data: [1, 8, 4, 8, 8, 32, 8, 18, 29, 8],
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


function Osvezi(){
    var chart1 = $("#container").highcharts();
    chart1.series[0].setData(data,true);
    
    var chart2 = $("#container-speed").highcharts();
    chart2.series[0].setData(data,true);
}