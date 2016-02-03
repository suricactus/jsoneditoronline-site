(function($) {
	var API_URL = '';
	var $codeContainer = $('#je-code');
	var $treeContainer = $('#je-tree');
	var codeOptions = {
		mode: 'code',
		onChange: function() {
			if(state.keepInSync) {
				code2tree();
			}
		}
	};
	var treeOptions = {
		mode: 'tree',
		modes: [
			'tree',
			'form'
		],
		onChange: function() {
			if(state.keepInSync) {
				tree2code();
			}
		}
	};
	var state = {
		keepInSync: false,
		codeEditorContent: '',
		treeEditorContent: '',
	};

	var codeEditor = new JSONEditor($codeContainer[0], codeOptions);
	var treeEditor = new JSONEditor($treeContainer[0], treeOptions);

	$('#je-btn-sync').on('change', function() {
		state.keepInSync = this.checked;
	});

	$('#je-btn-code2tree').on('click', function() {
		code2tree();
	});

	$('#je-btn-tree2code').on('click', function() {
		tree2code();
	});

	$('#je-form-save').on('submit', function(e) {
		e.preventDefault();
		var $this = $(this);
		var data = $this.serializeArray();

		data.push({
			name: 'json',
			value: JSON.stringify(codeEditor.get()),
		});

		// TODO validate data

	$.post( API_URL + 'api/files', data)
		.then(function(result) {
			// TODO show success
			showAlert('Success!');

			$('#je-dlg-save').modal('hide');
			history.pushState(null, null, location.origin + location.pathname + '?id=' + result);
		}, function() {
			// TODO show correct error
			showAlert('Error while saving, try again!');
		});
	});


	$('#je-menu-open a').on('click', function() {
		var tab = $(this).data('jeTab');

		$('#je-dlg-open').on('show.bs.modal', function() {
			var a = $('#' + tab).tab('show');

			setTimeout(function() {
				$('a[href=' + tab + ']').tab('show');
				console.log(2)
			}, 1000)
			// console.log(a, tab, document.getElementById(tab));
		});
	});

	var queryParams = parseQueryParams();
	if(queryParams.id) {
		$.get(API_URL + 'api/files/' + queryParams.id, {
			// type: json
		})
			.then(function(result) {
				codeEditor.setText(result);
				treeEditor.setText(result);
			}, function() {
				showAlert('Error while loading, try again!');
			})
	}


	var tree2code = function() {
		try {
			codeEditor.set(treeEditor.get());
			return true;
		} catch(e) {
			showAlert('Not a valid JSON!');
		}
		return false;
	};

	var code2tree = function() {
		try {
			treeEditor.set(codeEditor.get());
			return true;
		} catch(e) {
			showAlert('Not a valid JSON!');
		}
		return false;
	};

	var showAlert = function() {

	};

	function parseQueryParams() {
	  var search = /([^&;=]+)=?([^&;]*)/g;
	  var decode = function( s ) {
	    return decodeURIComponent( s.replace( /\+/g, ' ' ) );
	  };
	  var query = window.location.search.substring( 1 );
	  var urlParams = {};
	  var match;

	  while ( match = search.exec( query ) ) {
	    urlParams[ decode( match[1] ) ] = decode( match[2] );
	  }

	  return urlParams;
	};



})(jQuery);
