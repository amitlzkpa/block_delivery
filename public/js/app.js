$(document).ready(() => {
	
	const el = $('#app');
	const errorTemplate = Handlebars.compile($('#error-template').html());
	const reqDeliveryTemplate = Handlebars.compile($('#reqest-delivery-template').html());

	reqDeliveryTemplate.init = () => {
		let $srcInpBox = $('#src-address');

	    var delay = 0;
		var srcTimer;
	    $srcInpBox.bind('input', function() {
	    	let v = $(this).val();
	    	if(v.length < 3) return;
	    	window.clearTimeout(srcTimer);
	    	srcTimer = window.setTimeout(async () => {
	    		let resp = await $.get(`/api/maps/autocomplete/?query=${v}`);
	    		let suggestions = resp.suggestions;
	    		let ss = suggestions.reduce((a, b) => {
	    			// shape it for materialize dropdown
	    			a[b.label] = null;
	    			return a;
	    		}, {});
	    		$('#src-address').autocomplete({
	    			data: ss,
					onAutocomplete: function(val) {
						console.log(val);
					},
				});

	    	}, delay);
	    })


	    let $dstInpBox = $('#dst-address');

		var dstTimer;
	    $dstInpBox.bind('input', function() {
	    	let v = $(this).val();
	    	if(v.length < 3) return;
	    	window.clearTimeout(dstTimer);
	    	dstTimer = window.setTimeout(async () => {
	    		let resp = await $.get(`/api/maps/autocomplete/?query=${v}`);
	    		let suggestions = resp.suggestions;
	    		let ss = suggestions.reduce((a, b) => {
	    			a[b.label] = null;
	    			return a;
	    		}, {});
	    		$('#dst-address').autocomplete({
	    			data: ss,
					onAutocomplete: function(val) {
						console.log(val);
					},
				});

	    	}, delay);
	    })


	    $('#req-button').on('click', async (e) => {
	    	e.preventDefault();
	    	let srcLoc = $srcInpBox.val();
	    	let dstLoc = $dstInpBox.val();
	    	let amount = $('#amount').val();
	    	let rideSize = $('#ride-size').val();
	    	await $.post(`/delivery/request?src=${srcLoc}&dst=${dstLoc}&amt=${amount}&rSz=${rideSize}`);
	    	console.log('posteddd');
	    });

	}




	// Routing
	const router = new Router({
		mode: 'history',
		page404: (path) => {
			const html = errorTemplate({
				title: 'Error 404 - Page NOT Found!',
				message: `The path '/${path}' does not exist on this site`,
			});
			el.html(html);
		},
	});

	router.add('/', () => {
		let html = reqDeliveryTemplate();
		el.html(html);
		reqDeliveryTemplate.init();
	});














	var myLat = 40.730610;
	var myLong = -73.935242;


	navigator.geolocation.getCurrentPosition(
		(p) => { 
			[myLat, myLong] = [p.coords.latitude, p.coords.longitude];
		},
		(err) => {
		});




	// let html = reqDeliveryTemplate();
	// el.html(html);
	router.navigateTo('');
	// el.html("Hi there!");


});