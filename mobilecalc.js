// JavaScript Document

var penciltrade = 0;
var pencilprice = 0;
var pencildown = 0;
var pencilpayment = 0;
var timer;
var dialogs = new Array();
var zipcode = 0;
var nadaaction;
var kbbvalues = new Array();
var diag = 0;
var atype;
var origin = "customer";
var defs;
var defaultdown;
var needsaving = 0;
var checker;
var doit;
var showcardetails = 0;

var host = "https://www.fsanywhere.com:/myfsa/";
var df = host + "data";
var ka = host + "kbbapi";
var na = host + "nadaapi";

var scratchedpenciltrade = 0;
var scratchedpencilprice = 0;
var scratchedpencildown = 0;
var scratchedpencilpayment = 0;

var openingprice = 0;
var changehappened = 0;
var coredealid = 0;

$( window ).resize(
	function()
	{
		changeHeights();
	}
);

function acceptqs()
{
	$.post( df, { job: "acceptqs", dealid: coredealid }, function ( data )
	{
		data = removescripting( data );
		eval( data );
	} );
}

function checkforupdate()
{
	if ( coredealid > 0 )
	{
		$.post( df, { job: "checkforupdate", dealid: coredealid }, function ( data )
		{
			data = removescripting( data );
			eval( data );
		} );
	}
}

$(document).ready(function() {
    $(".numbersonly").keydown(function(event) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ( $.inArray(event.keyCode,[46,8,9,27,13]) !== -1 ||
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39 )) {
                 // let it happen, don't do anything
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });
    $(".numbersonlywithdec").keydown(function(event) {
	
        if ( $.inArray(event.keyCode,[46,8,9,27,13,110,190]) !== -1 ||
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39 ))
		{
                 // let it happen, don't do anything
			return;
        }
        else
		{
            // Ensure that it is a number and stop the keypress
				//alert(event.keyCode + " : " + parts);

            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });
    $(".numbersonlywithdec").keyup(function(event) {

		if ( this.value > 99 )
		{
			$("#" + this.id).val( 99 );	
		}
		
		var parts = this.value.split('.').length-1;
		if ( parts > 1 && ( event.keyCode == 110 || event.keyCode == 190 ) )
		{
			$("#" + this.id).val( this.value.substring(0,this.value.length - 1)  );	
		}
		else
		{
			return;
		}
	});
	checker = setInterval( function () { checkforupdate(); }, 15000 );
});

function tradeouts( newitem )
{
	if ( $( "#price" ).html().length > 3 )
	{
		showcardetails++;
		$( ".tradeouts" ).hide();
		if ( showcardetails == 1 )
		{
			$( "#dealinfo" ).show();
			$( "#dealstock" ).select();
		}
		else
		{
			$( "#" + newitem ).show();
		}
	}
	else
	{
		$( "#modalprice" ).show();
		$( "#proposedprice" ).select();
	}
}

function updateallcurrency ()
{
	$(".currency").each( function( key, field )
	{
		if ( $("#" + field.id).is("input") )
		{
			$("#" + field.id).val( currency($("#" + field.id).val( )) );
		}
		else
		{
			$("#" + field.id).html( currency($("#" + field.id).html( )) );
		}
	} );
	updatescratched( 'price' );
	updatescratched( 'down' );
	updatescratched( 'payment' );
	$( "#minitradeasking" ).html( $( "#tradeasking" ).html() );
	$( "#miniprice" ).html( $( "#price" ).html() );
	$( "#minidown" ).html( $( "#down" ).html() );
	$( "#minipayment" ).html( $( "#payment" ).html() );
}

function stripnumber ( number )
{
	number = number + " ";
	if ( number )
	{
		var x = parseInt ( Math.round( number.replace(/[^0-9.]/g, ""), 0 ));
		x++;
		x--;
		return x;
	}
}

function currency ( number )
{
	if ( parseInt( number ) == false )
	{
		number = 0;	
	}
	number = parseInt( stripnumber( number ) );
	number = "$" + number;
	//number = number.replace(/[^0-9.]/g, "");
	if ( number.length > 4 )
	{
		if ( number.length > 5 )
		{
			if ( number.length > 6 )
			{
				return number.substr(0,4) + "," + number.substr(4,3);
			}
			else
			{
				return number.substr(0,3) + "," + number.substr(3,3);
			}
		}
		else
		{
				return number.substr(0,2) + "," + number.substr(2,3);
		}
	}
	else
	{
		if ( number.length == 1 )
		{
			return "$0";
		}
		else
		{
			return number;
		}
	}
}

function changeHeights ()
{
	var height = $( window ).height();
	var width = $( window ).width();
	var header = $( "#header" ).height();
	var footer = ( ( height - header ) / 3 ) - 2;
	$( "#footer" ).height( footer );
	$( "#container" ).height( ( height - header - footer ) - 30 );
	$( "#dealinfocontent" ).height( height - header - footer - 30 );
	$( "#footer td" ).height( footer / 2 );
	$( "#footer .title" ).css( "line-height", ( ( $( "#footer td" ).height() / 4 ) - 2 ) + "px" );
	$( "#footer .title" ).css( "font-size", ( ( $( "#footer td" ).height() / 4 ) * .5 ) + "px" );
	$( "#footer .minivalue" ).css( "line-height", ( ( ( $( "#footer td" ).height() / 4 ) * 2 ) - 2 ) + "px" );
	$( "#footer .minivalue" ).css( "font-size", ( ( ( $( "#footer td" ).height() / 4 ) * 3 ) * .5 ) + "px" );

	$( ".sqbox" ).height( height - header - footer - 30 );
	$( ".sqbox" ).width( width - 30 );

	$( ".sqdetails" ).width( width - 30 );
	var sqboxheight = $( ".sqbox" ).height() - 60;
	$( ".sqtitle" ).height( sqboxheight * .1 );
	$( ".sqdollars" ).height( sqboxheight * .2 );
	$( ".scratched" ).height( sqboxheight * .6 );
	$( ".sqdetails" ).css( "margin-top", $( ".sqbox" ).height() - 60 );
	$( "#paymentincludes" ).css( "margin-top", $( ".sqbox" ).height() - 90 );
	$( ".sqclickable" ).height( $( ".sqbox" ).height() - $( ".sqdetails" ).height() );
	

	$( ".modal" ).width( $( ".sqbox" ).width() - 30 );
	
	$( ".ui-header h1" ).css( "width", "90%" );
	$( ".ui-header h1" ).css( "margin-left", "10px" );

	$( "#chatdesk" ).height( ( $( ".sqbox" ).height() - 200 ) / 2 );
	$( "#chatcustomer" ).height( ( $( ".sqbox" ).height() - 200 ) / 2 );
	
	$( "#chat table" ).width( $( ".sqbox" ).width() - 30 );

	$( "#historycontent" ).height( $( ".sqbox" ).height() - 50 );
	$( "#customerinformation" ).height( $( ".sqbox" ).height() - 135 );

	$( ".areacode" ).width( ( $( ".sqbox" ).width() - 30 ) * .2 );
	$( ".phonenumber" ).width( ( $( ".sqbox" ).width() - 30 ) * .7 );

	$( ".areacode" ).parent().width( ( $( ".sqbox" ).width() - 30 ) * .2 );
	$( ".phonenumber" ).parent().width( ( $( ".sqbox" ).width() - 30 ) * .7 );

 	$( "#offeraccepted" ).width( $( ".sqbox" ).width() - 30 );
	$( "#offeraccepted" ).height( $( ".sqbox" ).height() - 30 );

	if ( $( ".sqbox" ).width() < 350 )
	{
		$( ".ui-btn-inner" ).css( "font-size", "11px" );
	}

}

function changeTradebox ( action )
{
	$("#tradebox .pencil-field").each(
	function ( key, field )
	{
		$("#" + field.id ).html( $("#temp" + field.id).val() );	
		$("#temp" + field.id).val( '' );
	} );
	balancedeal( 'payment' );

	if ( action != "none" )
	{
		tradeouts( "tradebox" );
	}
}

function changeRate ()
{
	$("#rate").html( $("#temprate" ).val(  ) );	
	balancedeal( 'payment' );
	tradeouts( "paymentbox" );
}

function changeTerm ()
{
	$("#term").html( $("#tempterm" ).val(  ) + " months" );	
	balancedeal( 'payment' );
	tradeouts( "paymentbox" );
}

function updatescratched( field )
{
	if ( eval("pencil" + field) != eval("scratchedpencil" + field) && eval("pencil" + field) > 0 )
	{
		if ( $("#" + field + "box .scratched").html() != $("#" + field + "box .sqdollars").html() && eval("scratchedpencil" + field) > 0 )
		{
			$("#" + field + "box .scratched").html( currency( eval("scratchedpencil" + field) ) );
		}
	}
	
}


function changePricebox ()
{
	if ( $("#proposedprice").val() < 100 ) 
	{
		getprice();
	}
	else
	{
		if ( openingprice == 0 )
		{
			openingprice = $("#proposedprice").val();
			$( "#price" ).html( openingprice );
			$( "#tradeasking" ).html( Math.round( .01 ) );
			$( "#down" ).html( Math.round( ( openingprice * 1.1 ) * ( defaultdown / 100 ) ) );
			updateallcurrency();
			balancedeal( 'payment' );
			tradeouts( "pricebox" );
		}
		else
		{
			$("#pricebox .sqdollars").html( currency( $("#proposedprice").val() ) );
			$("#proposedprice").val( '' );
			balancedeal( 'payment' );
			tradeouts( "pricebox" );
		}
	}
}

function changeDownbox ()
{
	updatescratched( "down" );
	$("#downbox .sqdollars").html( currency( $("#proposeddown").val() ) );
	$("#proposeddown").val( '' );
	balancedeal('payment');
	tradeouts( "downbox" );
}

function changePaycash ()
{
	updatescratched( "payment" );
	balancedeal( rollto );
	tradeouts( "paymentbox" );
}

function changePayment ( rollto )
{
	updatescratched( "payment" );
	$("#paymentbox .sqdollars").html( currency( $("#temppayment").val() ) );
	$("#temppayment").val( '' );
	balancedeal( rollto );
	tradeouts( "paymentbox" );
}

function openDialog( popupid )
{
	tradeouts( popupid );
	//$( "#" + popupid ).popup( "open" );
}




function getkbb()
{
		if ( $("#temptradeyearkbb").html().length < 37 )
		{
			populatetempyearskbb();
		}
		tradeouts( 'modalkbb' );
		$( "#temptrademileagekbb" ).val( $( "#temptrademileage" ).val() );
		$( "#temptrademileagekbb" ).focus();
}

function usekbbvalues()
{
	if ( stripnumber( $("#temptradeaskingkbb").html() ) > 0 )
	{
		$("#temptradeasking").val( parseInt( $("#temptradeaskingkbb").html().replace( "$", "" ).replace( ",", "" ) ) );
		$("#temptrademileage").val( $("#temptrademileagekbb").val() );
		$("#temptradeyear").val( $("#temptradeyearkbb option:selected").text() );
		$("#temptrademake").val( $("#temptrademakekbb option:selected").text() );
		$("#temptrademodel").val( $("#temptrademodelkbb option:selected").text() );
		if ( $( "#kbbconditiondiv :radio:checked" ).val() == "TradeInExcellent" )
		{
			$("#temptradecondition").val( 'Excellent' );
		}
		else if ( $( "#kbbconditiondiv :radio:checked" ).val() == "TradeInVeryGood" )
		{
			$("#temptradecondition").val( 'Very Good' );
		}
		else if ( $( "#kbbconditiondiv :radio:checked" ).val() == "TradeInGood" )
		{
			$("#temptradecondition").val( 'Good' );
		}
		else if ( $( "#kbbconditiondiv :radio:checked" ).val() == "TradeInFair" )
		{
			$("#temptradecondition").val( 'Fair' );
		}
		tradeouts( "modaltrade" );
		//changeTradebox( "none" );
	}
}

function kbbgetvalue()
{
	if ( $( "#temptrademileagekbb" ).val().length == 0 )
	{
		$( "#temptrademileagekbb" ).focus();
		$( "#temptrademileagekbb" ).scrollTop( 0 );
		$( "#temptrademileagekbb" ).parent().addClass( 'kbbrequired' );
		$( "#temptrademileagekbb" ).select();
	}
	else if ( $( "#temptradeaskingkbb" ).html() == "get value" )
	{
		$( "#temptradeaskingkbb" ).html( "Loading..." );
		$.post( ka, {
				job: 'kbbgetvalue',
				kbboptiongroup: $( ".kbboptiongroup :radio:checked" ).serializeArray( ),
				kbboptions: $( ".kbboptions :radio:checked" ).serializeArray( ),
				VehicleId: $("#temptradetrimkbb").val(),
				mileage:  $("#temptrademileagekbb").val(),
				zipcode: zipcode
			}, function ( data )
			{
				data = removescripting( data );
				kbbvalues = $.parseJSON( data );
				kbbchoosevalue();
				usekbbvalues();
			} );	
	}
}

function kbbclearprice()
{
	$( '#temptradeaskingkbb' ).html( 'get value' );
}

function kbbchoosevalue()
{
	$("#temptradeaskingkbb").html( kbbvalues[$( "#kbbconditiondiv :radio:checked" ).val()] );
	updateallcurrency();
		
}

function kbbgetconfig()
{
	$( "#kbboptions" ).html( "Loading Optional Equipment..." );
	//$( "#kbbgetvaluebuttontd" ).html( "<button onclick='kbbgetvalue();' id='kbbgetvaluebutton' data-theme='a'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonkbbtd" ).html( "<button onclick='usekbbvalues();' id='buttonkbb' data-theme='a'>USE THESE VALUES</button>" ).trigger( "create" );
	$( "#temptradeaskingkbb" ).html( '...' );
	
	$.post( ka, { job: 'kbbgetconfigmobile', VehicleId: $( "#temptradetrimkbb" ).val(), zipcode: zipcode }, function ( data )
	{
		data = removescripting( data );
		$( "#kbboptions" ).html( data ).trigger( "create" );
		kbbclearprice();
		//kbbgetvalue();
	} );
	
}

function populatetemptradetrimkbb( )
{
	$( "#kbboptions" ).html( "" );
	$( "#temptradetrimkbbtd" ).html( "<select disabled='disabled'><option value=''>Loading...</option></select>" ).trigger( "create" );
	//$( "#kbbgetvaluebuttontd" ).html( "<button onclick='kbbgetvalue();' id='kbbgetvaluebutton' data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonkbbtd" ).html( "<button onclick='usekbbvalues();' id='buttonkbb' data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );
	$( "#temptradeaskingkbb" ).html( '...' );

	$.post( ka, { job: 'kbbgettrims', year: $("#temptradeyearkbb").val(), model: $("#temptrademodelkbb").val() }, function ( data )
	{
		data = removescripting( data );
		$("#temptradetrimkbbtd").html( "<select id='temptradetrimkbb' onchange='kbbgetconfig();' data-theme='a'>" + data + "</select>" ).trigger( "create" );
	} );
	
}

function populatetemptrademodelkbb( )
{
	$( "#kbboptions" ).html( "" );
	$( "#temptradetrimkbbtd" ).html( "<select id='temptradetrimkbb' disabled='disabled'><option value=''>Choose a Style</option></select>" ).trigger( "create" );
	$( "#temptrademodelkbbtd" ).html( "<select disabled='disabled'><option value=''>Loading...</option></select>" ).trigger( "create" );
	//$( "#kbbgetvaluebuttontd" ).html( "<button onclick='kbbgetvalue();' id='kbbgetvaluebutton' data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonkbbtd" ).html( "<button onclick='usekbbvalues();' id='buttonkbb' data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );
	$( "#temptradeaskingkbb" ).html( '...' );

	$.post( ka, { job: 'kbbgetmodels', year: $("#temptradeyearkbb").val(), make: $("#temptrademakekbb").val() }, function ( data )
	{
		data = removescripting( data );
		$("#temptrademodelkbbtd").html( "<select id='temptrademodelkbb' onchange='populatetemptradetrimkbb();' data-theme='a'>" + data + "</select>" ).trigger( "create" );
	} );
	
}

function populatetemptrademakekbb( year )
{
	$( "#kbboptions" ).html( "" );
	$( "#temptradetrimkbbtd" ).html( "<select id='temptradetrimkbb' disabled='disabled'><option value=''>Choose a Style</option></select>" ).trigger( "create" );
	$( "#temptrademodelkbbtd" ).html( "<select id='temptrademodelkbb' disabled='disabled'><option value=''>Choose a Model</option></select>" ).trigger( "create" );
	$( "#temptrademakekbbtd" ).html( "<select disabled='disabled'><option value=''>Loading...</option></select>" ).trigger( "create" );
	//$( "#kbbgetvaluebuttontd" ).html( "<button onclick='kbbgetvalue();' id='kbbgetvaluebutton' data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonkbbtd" ).html( "<button onclick='usekbbvalues();' id='buttonkbb' data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );
	$( "#temptradeaskingkbb" ).html( '...' );
	
	$.post( ka, { job: 'kbbgetmakes', year: $("#temptradeyearkbb").val() }, function ( data )
	{
		data = removescripting( data );
		$("#temptrademakekbbtd").html( "<select id='temptrademakekbb' onchange='populatetemptrademodelkbb();' data-theme='a'>" + data + "</select>" ).trigger( "create" );
	} );
	
}

function populatetempyearskbb()
{
	$("#kbboptions").html( "" );
	$("#temptradetrimkbbtd").html( "<select id='temptradetrimkbb' disabled='disabled'><option value=''>Choose a Style</option></select>" ).trigger( "create" );
	$("#temptrademodelkbbtd").html( "<select id='temptrademodelkbb' disabled='disabled'><option value=''>Choose a Model</option></select>" ).trigger( "create" );
	$("#temptrademakekbbtd").html( "<select id='temptrademakekbb' disabled='disabled'><option value=''>Choose a Make</option></select>" ).trigger( "create" );
	$("#temptradeyearkbbtd").html( "<select disabled='disabled'><option value=''>Loading...</option></select>" ).trigger( "create" );
	//$( "#kbbgetvaluebuttontd" ).html( "<button onclick='kbbgetvalue();' id='kbbgetvaluebutton' data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonkbbtd" ).html( "<button onclick='usekbbvalues();' id='buttonkbb' data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );
	$( "#temptradeaskingkbb" ).html( '...' );

	$.post( ka, { job: 'kbbgetyears' }, function ( data )
	{
		data = removescripting( data );
		$("#temptradeyearkbb").prop( "disabled", false );
		$("#temptradeyearkbbtd").html( "<select id='temptradeyearkbb' onchange='populatetemptrademakekbb( this.value );' data-theme='a'>" + data + "</select>" ).trigger( "create" );
	} );
	
}

function nadaclearprice()
{
	$( '#temptradeaskingnada' ).html( 'get value' );
}

function getnada()
{
		if ( $( "#temptradeaskingnada" ).html() == "$0" )
		{
			$( "#temptradeaskingnada" ).html( '...' );
		}
		tradeouts( "modalnada" );
		$( "#temptrademileagenada" ).val( $( "#temptrademileage" ).val() );
		//$( "#temptrademileagenada" ).focus();
}


function usenadavalues()
{
	if ( stripnumber( $("#temptradeaskingnada").html() ) > 0 )
	{
		$("#temptradeasking").val( parseInt( $("#temptradeaskingnada").html().replace( "$", "" ).replace( ",", "" ) ) );
		$("#temptrademileage").val( $("#temptrademileagenada").val() );
		$("#temptradeyear").val( $("#temptradeyearnada option:selected").text() );
		$("#temptrademake").val( $("#temptrademakenada option:selected").text() );
		$("#temptrademodel").val( $("#temptrademodelnada option:selected").text() );
		tradeouts( "modaltrade" );
		//changeTradebox( "none" );
	}
}

function nadagetvalue()
{
	if ( $( "#temptrademileagenada" ).val().length == 0  && $( "#temprvtypenada" ).val() == 3 )
	{
		$( "#temptrademileagenada" ).focus();
		$( "#temptrademileagenada" ).scrollTop( 0 );
		$( "#temptrademileagenada" ).parent().addClass( 'kbbrequired' );
		$( "#temptrademileagenada" ).select();
	}
	else
	{
		if ( $( "#temptradeaskingnada" ).html() == "get value" ) 
		{
			$("#temptradeaskingnada").html( "Loading..." );
			$.post( na, { job: 'nadashowvalue', modelTrimID: $("#temptrademodelnada").val(), mileage:  $("#temptrademileagenada").val(), data: $(".nadaoptions :radio:checked").serializeArray( )  }, function ( data )
			{
				data = removescripting( data );
				if ( data == "exceeded" )
				{
					$( "#temptradeaskingnada" ).html( data );
				}
				else
				{
					$("#temptradeaskingnada").html( data );
					usenadavalues();
					updateallcurrency();
				}
			} );
		}
	}
}

function nadagetconfig()
{
	$( "#temptradeaskingnada" ).html( "get value" );						
	//$( "#nadagetvaluebuttontd" ).html( "<button data-theme='a' id='nadagetvaluebutton' onclick='nadagetvalue();'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonnadatd" ).html( "<button data-theme='a' id='buttonnada' onclick='usenadavalues();'>USE THESE VALUES</button>" ).trigger( "create" );


	$("#nadaoptions").html( "Loading Optional Equipment..." );
	$.post( na, { job: 'nadagetconfigmobile', modelTrimID: $("#temptrademodelnada").val() }, function ( data )
		{
			data = removescripting( data );
			$("#nadaoptions").html( data ).trigger( "create" );
			nadaaction = "yes";
			//$( "#nadaoptions" ).scroll();
		} );
	
}

function populatetemptrademodelnada( )
{
	$("#nadaoptions").html( "" );
	$( "#temptradeaskingnada" ).html( '...' );
	nadaaction = "no";
	$("#temptrademodelnadatd").html( "<select disabled='disabled'><option value='' selected>Loading...</option></select>" ).trigger( "create" );
	//$( "#nadagetvaluebuttontd" ).html( "<button data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonnadatd" ).html( "<button data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );

	$.post( na, { job: 'nadagetmodels', year: $("#temptradeyearnada").val(), MakeID: $("#temptrademakenada").val() }, function ( data )
		{
			data = removescripting( data );
			$("#temptrademodelnadatd").html( "<select id='temptrademodelnada' onchange='nadagetconfig();' data-theme='a'>" + data + "</select>" ).trigger( "create" );
		} );
	
}

function populatetempyearsnada()
{
	$("#nadaoptions").html( "" );
	$( "#temptradeaskingnada" ).html( '...' );
	nadaaction = "no";
	$("#temptrademodelnadatd").html( "<select disabled='disabled'><option value='' selected>Choose a Model</option></select>" ).trigger( "create" );
	$("#temptradeyearnadatd").html( "<select disabled='disabled'><option value='' selected>Loading...</option></select>" ).trigger( "create" );
	//$( "#nadagetvaluebuttontd" ).html( "<button data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonnadatd" ).html( "<button data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );

	$.post( na, { job: 'nadagetyears', makeID: $("#temptrademakenada").val() }, function ( data )
		{
			data = removescripting( data );
			$("#temptradeyearnadatd").html( "<select id='temptradeyearnada' onchange='populatetemptrademodelnada( this.value );' data-theme='a'>" + data + "</select>" ).trigger( "create" );
		} );
	
}

function populatetemptrademakenada( category )
{
	$( "#temptradeaskingnada" ).html( '...' );
	$( "#nadaoptions" ).html( "" );
	nadaaction = "no";

	$( "#temptradeyearnadatd" ).html( "<select disabled='disabled'><option value='' selected>Choose a Year</option></select>" ).trigger( "create" );
	$( "#temptrademodelnadatd" ).html( "<select disabled='disabled'><option value='' selected>Choose a Model</option></select>" ).trigger( "create" );
	$( "#temptrademakenadatd" ).html( "<select disabled='disabled'><option value='' selected>Loading...</option></select>" ).trigger( "create" );
	//$( "#nadagetvaluebuttontd" ).html( "<button data-theme='a' disabled='disabled'>GET VALUE</button>" ).trigger( "create" );
	//$( "#buttonnadatd" ).html( "<button data-theme='a' disabled='disabled'>USE THESE VALUES</button>" ).trigger( "create" );

	if ( $( "#temprvtypenada" ).val() > 1 )
	{
		if ( $( "#temprvtypenada" ).val() == 3 )
		{
			$( ".nadamileagetr" ).show();
			$( "#temptrademileagenada" ).select();
		}
		else
		{
			$( ".nadamileagetr" ).hide();
		}
		$.post( na, { job: 'nadagetmakes', category: $("#temprvtypenada").val() }, function ( data )
		{
			data = removescripting( data );
			$("#temptrademakenadatd").html( "<select id='temptrademakenada' onchange='populatetempyearsnada();' data-theme='a'>" + data + "</select>" ).trigger( "create" );
		} );
	}
}


function bookit( job )
{
	if ( job == '' )
	{
		job = $( "#temptradetype" ).val();
	}
	
	if ( job == "RV" )
	{
		$( "#bookit" ).show();
		getnada();
		if ( $( ".sqbox" ).height() < ( $( "#nadaheader" ).height() * 2.5 ) )
		{
			$( "#nadaheader" ).css( "position", "relative" );
			$( "#nadaheader" ).css( "z-index", "" );
		}
		else
		{
			$( "#nadalookupspacer" ).height( $( "#nadaheader" ).height() );
		}
		$( "#nadaheader" ).width( $( "#nadaheader" ).parent().width() );
	}
	else if( job == "AUTO" )
	{
		$( "#bookit" ).show();
		getkbb();
		if ( $( ".sqbox" ).height() < ( $( "#kbbheader" ).height() * 2.5 ) )
		{
			$( "#kbbheader" ).css( "position", "relative" );
			$( "#kbbheader" ).css( "z-index", "" );
		}
		else
		{
			$( "#kbblookupspacer" ).height( $( "#kbbheader" ).height() );
		}
		$( "#kbbheader" ).width( $( "#kbbheader" ).parent().width() );
	}
	else
	{
		$( "#bookit" ).hide();
	}


}

function gettrade()
{

	$("#tradebox .pencil-field").each(
	function ( key, field )
	{
		
		var str = $( "#temp" + field.id ).attr( "class" ) + "test";
		if ( str.match(/numbersonly/gi) != null )
		{
			if ( stripnumber( $("#" + field.id).html() ) == 0 )
			{
				$("#temp" + field.id ).val( "" );
			}
			else
			{
				$("#temp" + field.id ).val( stripnumber( $("#" + field.id).html() ) );
			}
		}
		else
		{
			if ( field.id == "tradetype" )
			{
				//$("#temp" + field.id ).val( $("#" + field.id).html() ).selectmenu( "refresh", true );
			}
			else
			{
				$("#temp" + field.id ).val( $("#" + field.id).html() );
			}
		}
	}
	);
	tradeouts( 'modaltrade' ); 
	$("#temptradeasking" ).select();
}

function getprice()
{
	$("#proposedprice").val(  stripnumber( $("#pricebox .sqdollars").html() ) );
	openDialog( 'modalprice' );
	$("#proposedprice" ).select();
}

function getdown ()
{
	$("#proposeddown").val( stripnumber( $("#downbox .sqdollars").html() ) );
	openDialog( 'modaldown' );
	$("#proposeddown" ).select();
}

function getpayment ()
{
	$("#paymentbox .pencil-field").each(
	function ( key, field )
	{
		$("#temp" + field.id ).val( stripnumber( $("#" + field.id).html() ) );	
	}
	);

	openDialog( 'modalpayment' ); 
	$("#temppayment" ).select();
}

function getterm ()
{

	$("#tempterm" ).val( $("#term").html().replace(" months","") );	
	openDialog( 'modalterm' ); 
}

function getrate ()
{
	$("#temprate" ).val( $("#rate" ).html() );	
	openDialog( 'modalrate' ); 
	$("#temprate" ).focus();
	$("#temprate" ).select();
}

function getchat ()
{
	tradeouts( 'chat' );
	//openDialog( 'chat' );
	$("#chat input[type=text]").select();
	$("#dealicons").html( $("#dealicons").html().replace("icon-chat-updated.png", "icon-chat.png") );
}

function getcustomer ()
{
	tradeouts( 'customer' );
}


function newDeal( invid )
{
	$.post( df, { app: 1, myfsa: window.localStorage['myfsa'], myfsaapp: window.localStorage['myfsaapp'], job: 'newDeal', invid: invid }, function ( data )
	{
		data = removescripting( data );
		location.reload();
	}
	);	
}


function checkcustinfo()
{
	if ( origin == "customer" )
	{
		if( $("#primaryfirst").val().length == 0 || $("#primarylast").val().length == 0 || ( $("#primaryemail").val().length < 6 && atype == "single" ) )
		{
			tradeouts( 'customer' );
			$("#primaryfirst").parent().addClass( "ui-state-error" );
			$("#primarylast").parent().addClass( "ui-state-error" );
			if ( atype == "single" ) 
			{
				$("#primaryemail").parent().addClass( "ui-state-error" );
			}
			if ( $("#primaryfirst").val().length == 0 )
			{
				$("#primaryfirst").focus();
			}
			else if ( $("#primarylast").val().length == 0 )
			{
				$("#primarylast").focus();
			}
			else if ( $("#primaryemail").val().length < 6 && atype == "single" )
			{
				$("#primaryemail").focus();
			}
		}
		else
		{
				$("#primaryfirst").removeClass( "ui-state-error" );
				$("#primarylast").removeClass( "ui-state-error" );
				$("#primaryemail").removeClass( "ui-state-error" );
		}
	}
}

function getPencil( recid )
{
	$.post( df, { app: 1, myfsa: window.localStorage['myfsa'], myfsaapp: window.localStorage['myfsaapp'], job: 'getPencil', recid: recid  }, function ( data )
	{
		data = removescripting( data );
		eval( data );
	} );
}

function putPencil( param )
{
	var values = {};

	$(".pencil-field").each(
	function ( key, field )
	{
		if ( field.id == "tradeasking" || field.id == "tradepayment" || field.id == "tradepayoff" || field.id == "price" || field.id == "down" || field.id == "payment" )
		{
			values[field.id] =  stripnumber( $("#" + field.id).html() );
		}
		else
		{
			if ( $( "#" + field.id ).is( "input" ) )
			{
				values[field.id] = $("#" + field.id).val();
			}
			else
			{
				values[field.id] = $("#" + field.id).html();
			}
		}
	} );
	if ( param == "quicksend" )
	{
		var req = Array();
		var doit = "no";
		if ( values[ "dealstock" ] == "" ) { req[ "dealstock" ] = "false"; doit = "yes"; } else { req[ "dealstock" ] = "true"; }
		if ( values[ "dealyear" ] == "" ) { req[ "dealyear" ] = "false"; doit = "yes"; } else { req[ "dealyear" ] = "true"; }
		if ( values[ "dealmake" ] == "" ) { req[ "dealmake" ] = "false"; doit = "yes"; } else { req[ "dealmake" ] = "true"; }
		if ( values[ "dealmodel" ] == "" ) { req[ "dealmodel" ] = "false"; doit = "yes"; } else { req[ "dealmodel" ] = "true"; }
		if ( doit == "yes" )
		{
			$( "#qscsstatement" ).html( "<tr><td colspan='2'><h3>For the quick send feature to work,<br>the following items are required:</h3></td></tr>" );
			if ( req[ "dealstock" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Stock Number</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Stock Number</td></tr>" );
			}
			
			if ( req[ "dealyear" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Year</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Year</td></tr>" );
			}
			
			if ( req[ "dealmake" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Make</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Make</td></tr>" );
			}
			
			if ( req[ "dealmodel" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Model</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Model</td></tr>" );
			}

			$( "#qscsstatement" ).wrapInner( "<table border='0'></table>" );

			$.mobile.changePage( "#qscsfailed", { role: "dialog" } );
			setTimeout( function () { $("#qscsfailed").dialog( "close" ); tradeouts( 'dealinfo' ); }, 1000 );
			return false;
		}
		
		values["quicksend"] = "yes";
	}
	else if ( param == "sendtocust" )
	{
		var req = Array();
		var doit = "no";
		var nextscreen = "";
		if ( values[ "dealstock" ] == "" ) { req[ "dealstock" ] = "false"; nextscreen = "dealinfo"; doit = "yes"; } else { req[ "dealstock" ] = "true"; }
		if ( values[ "dealyear" ] == "" ) { req[ "dealyear" ] = "false"; nextscreen = "dealinfo"; doit = "yes"; } else { req[ "dealyear" ] = "true"; }
		if ( values[ "dealmake" ] == "" ) { req[ "dealmake" ] = "false"; nextscreen = "dealinfo"; doit = "yes"; } else { req[ "dealmake" ] = "true"; }
		if ( values[ "dealmodel" ] == "" ) { req[ "dealmodel" ] = "false"; nextscreen = "dealinfo"; doit = "yes"; } else { req[ "dealmodel" ] = "true"; }

		if ( values[ "primaryfirst" ] == "" ) { req[ "primaryfirst" ] = "false"; doit = "yes"; } else { req[ "primaryfirst" ] = "true"; }
		if ( values[ "primarylast" ] == "" ) { req[ "primarylast" ] = "false"; doit = "yes"; } else { req[ "primarylast" ] = "true"; }
		if ( values[ "primaryemail" ] == "" ) { req[ "primaryemail" ] = "false"; doit = "yes"; } else { req[ "primaryemail" ] = "true"; }
		if ( doit == "yes" )
		{
			$( "#qscsstatement" ).html( "<tr><td colspan='2'><h3>For the send to customer feature to work,<br>the following items are required:</h3></td></tr>" );
			if ( req[ "primaryfirst" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Customer First Name</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Customer First Name</td></tr>" );
			}
			
			if ( req[ "primarylast" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Customer Last Name</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Customer Last Name</td></tr>" );
			}
			
			if ( req[ "primaryemail" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Customer E-Mail Address</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Customer E-Mail Address</td></tr>" );
			}
			if ( req[ "dealstock" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Stock Number</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Stock Number</td></tr>" );
			}
			
			if ( req[ "dealyear" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Year</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Year</td></tr>" );
			}
			
			if ( req[ "dealmake" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Make</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Make</td></tr>" );
			}
			
			if ( req[ "dealmodel" ] == "false" )
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/failed-large.png' border='0'></td><td>Model</td></tr>" );
			}
			else
			{
				$( "#qscsstatement" ).append( "<tr><td width='50%' align='right' style='text-align: right;'><img src='images/checkmark-large.png' border='0'></td><td>Model</td></tr>" );
			}

			$( "#qscsstatement" ).wrapInner( "<table border='0'></table>" );

			$.mobile.changePage( "#qscsfailed", { role: "dialog" } );
			setTimeout( function () { $("#qscsfailed").dialog( "close" ); if ( nextscreen == "dealinfo" ) { tradeouts( "dealinfo" ); } }, 1000 );
			return false;
		}
		
		values["sendtocust"] = "yes";
	}

	$.post( df, { app: 1, myfsa: window.localStorage['myfsa'], myfsaapp: window.localStorage['myfsaapp'], job: 'putPencil', origin: origin, dealid: coredealid, status: status, data: values  }, function ( data )
	{
		data = removescripting( data );

		if ( data == "updated" )
		{
			$( "#container" ).html( "<div id='updatesqsent'><br><br>Thank you, the update has been sent.<div id='updatesqsentlower'>( you may close the window )</div></div>" );
		}
		else
		{
			comms( "<span style='color: #fff;'>Done!</span>" );
			coredealid = data;
			needsaving = 0;
		}
	} );
}

function getDefaults()
{
	getSettings();
}

function getSettings()
{
	$.post( df, { app: 1, myfsa: window.localStorage['myfsa'], myfsaapp: window.localStorage['myfsaapp'], job: 'getSettings', dealid: coredealid }, function ( data )
	{
		data = removescripting( data );
		eval( data );
		$( "#temprate" ).selectmenu("refresh");
		$( "#tempterm" ).selectmenu("refresh");
	} );
	var gets = " " + document.location;
	if ( gets.search( "deal=" ) > -1 )
	{
		var deal = gets.substr( gets.search( "deal=" ) + 5 );
		getPencil( deal );
	}
	else
	{
		getprice();
	}
}

function balancedeal ( rollto )
{
 	var values = new Array();	
	$(".balance-field").each(
	function ( key, field ) 
	{
		values.push( field.id + ":" + stripnumber($("#" + field.id).html()));
	});
		values.push( "rate:" + $("#rate").html());

	var down = stripnumber( $( "#down" ).html() );
	var tradeasking = stripnumber( $( "#tradeasking" ).html() );
	var tradepayoff = stripnumber( $( "#tradepayoff" ).html() );

	var rate = stripnumber( $( "#rate" ).html() );
	var term = stripnumber( $( "#term" ).html() );
	var payment = stripnumber( $( "#payment" ).html() );
	var price = stripnumber( $( "#price" ).html() );
	var totalsale = price * 1.1;
	$( "#totalsale" ).html( totalsale );

	var tradecredit = tradeasking - tradepayoff;
	var financing = totalsale - down - tradecredit;
	var cashprice = totalsale - tradecredit;

	penciltrade = tradeasking;
	pencilprice = price;
	pencildown = down;
	pencilpayment = payment;
	
	if ( rollto == "payment" )
	{
	
		var int = rate/1200; 
		var int1 = 1 + int; 
		var r1 = Math.pow( int1, term ); 
		  
		if ( rate == 0 )
		{
			var pmt = financing / term; 
		}
		else
		{
			var pmt = financing * ( int * r1 ) / ( r1 - 1 ); 
		}
		if ( pmt < 1 ) { pmt = 0; }
		$("#paymentbox .sqdollars").html( Math.round( pmt ) );
		pencilpayment = Math.round( pmt );
	}
	else if ( rollto == "trade" )
	{
		var top = gettop( payment, rate, term );
		$("#tradebox .sqdollars").html( Math.round( totalsale - down - top ) );
		penciltrade = Math.round( totalsale - down - top );
	}
	else if ( rollto == "down" )
	{
		var top = gettop( payment, rate, term );
		if ( top > 0 )
		{
			$("#downbox .sqdollars").html(  totalsale - tradecredit - top );
			pencildown = Math.round( totalsale - tradecredit - top );
		}
		else
		{
			$("#downbox .sqdollars").html( '$0' );
			pencildown = Math.round( 0 );
			balancedeal( 'payment' );
		}
		
	}
	else if ( rollto == "price" )
	{
		var top = gettop( payment, rate, term );
		
		$("#pricebox .sqdollars").html( Math.round( ( down +  tradecredit + top ) - price * .1 ) );
		pencilprice = Math.round( ( down +  tradecredit + top ) - price * .1 );
	}
	else if ( rollto == "paycash" )
	{
		$("#downbox .sqdollars").html( cashprice );
		$("#paymentbox .sqdollars").html( '$0' );
	}
	updateallcurrency();

	updatescratched( 'price' );
	updatescratched( 'down' );
	updatescratched( 'payment' );

	scratchedpencilprice = pencilprice;
	scratchedpencildown = pencildown;
	scratchedpencilpayment = pencilpayment;

}

function gettop( payment, rate, term )  // TOP = Total Of Payments
{
	var xxx = 0;
	for ( var t = 1; t <= term; t++ )
	{
		xxx += payment;
		if ( rate == 0 )
		{
			var interest = 0;
		}
		else
		{
			var monthlyrate = rate / 1200;
			var interest = xxx * monthlyrate;
		}
		
		xxx -= interest;
	}
	return xxx;
}

function comms( msg )
{


	$( "#commsstatement" ).html( msg );
	$.mobile.changePage( "#comms", { role: "dialog" } );
	setTimeout( function () { $("#comms").dialog( "close" ); }, 1000 );
}

function removescripting( data )
{
	var pieces = Array();
	var returndata = "";
	data = data.replace( /<script>/g, '|||||<scr' + 'ipt>' );
	pieces = data.split( "|||||" );
	$.each( pieces, function( key, value )
	{
		if ( value.search( "</scr" + "ipt>" ) > -1 ) 
		{
			 eval( value.substr( 0, value.search( "</scr" + "ipt>" ) + 9 ).replace( "<scr" + "ipt>", "" ).replace( "</scr" + "ipt>", "" ) );
			 returndata += value.substr( value.search( "</scr" + "ipt>" ) + 9 );
		}
		else
		{
			returndata += value;;
		}
	} );
	return returndata;
}

function signoff()
{
	localStorage.removeItem('myfsa');
	localStorage.removeItem('myfsaapp');
	location = "signon.html";
}

function exit()
{
	if ( confirm( "Are you sure?" ) )
	{
		location.href='index.html';
	}
}








df=df + ".php";
ka=ka + ".php";
na=na + ".php";

