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

$(function () {
            var riskPritisk = 0.5;
            var riskKisik = 0.5;
            var riskKoža = 0.3;
            var riskDihanje = 0.2;
            var riskTemperatura = 0.5;
            var preostanek = 0.0;

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
                { name: 'Dihanje', y: riskDihanje },
                { name: 'Kisik', y: riskKisik },
                { name: 'Temperatura', y: riskTemperatura },
                { name: 'Barva kože', y: riskKoža },
                { name: 'Ostalo', y: preostanek }
            ]
        }]
    });
});