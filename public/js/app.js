window.addEventListener('load', () => {
	const el = $('#app');
	const errorTemplate = Handlebars.compile($('#error-template').html());


	const APP_ID = 'JV3aky6KwOlRaB9UDq49';
	const APP_CODE = 'V0lXUTYhyEqnV5A_t6fCxg';


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


	var platform = new H.service.Platform({
	  'app_id': APP_ID,
	  'app_code': APP_CODE
	});

	var map;
	var myLat = 40.730610;
	var myLong = -73.935242;
	var zoomLvl = 14;

	var defaultLayers = platform.createDefaultLayers();
	var $mapContainer = $('#mapContainer');

	function loadMap() {
		$mapContainer.empty();
		// Instantiate (and display) a map object:
		map = new H.Map(
			$mapContainer[0],
			defaultLayers.normal.map,
			{
				zoom: zoomLvl,
				center: { lat: myLat, lng: myLong }
			});
		$('#latitude').val(myLat);
		$('#longitude').val(myLong);
	}

	navigator.geolocation.getCurrentPosition(
		(p) => { 
			[myLat, myLong] = [p.coords.latitude, p.coords.longitude];
			loadMap();
		},
		(err) => {
			loadMap();
		});

	$('#mapButton').on('click', (event) => {
		// Block browser page load
		event.preventDefault();
		myLat = $('#latitude').val();
		myLong = $('#longitude').val();

		loadMap();
	});





	var srcTimer;
    var delay = 0;
    $('#src-address').bind('input', function() {
    	let v = $(this).val();
    	if(v.length < 3) return;
    	window.clearTimeout(srcTimer);
    	srcTimer = window.setTimeout(async () => {
    		let resp = await $.get(`http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?query=${v}&app_id=${APP_ID}&app_code=${APP_CODE}`);
    		let suggestions = resp.suggestions;
    		let ss = suggestions.reduce((a, b) => {
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

	var dstTimer;
    $('#dst-address').bind('input', function() {
    	let v = $(this).val();
    	if(v.length < 3) return;
    	window.clearTimeout(dstTimer);
    	dstTimer = window.setTimeout(async () => {
    		let resp = await $.get(`http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?query=${v}&app_id=${APP_ID}&app_code=${APP_CODE}`);
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

	// router.navigateTo('');
	// el.html("Hi there!");
});