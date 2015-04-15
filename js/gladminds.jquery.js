/* jQuery Gladminds
 * @anil @gladminds
 * 2015
 * gladminds.co
 */

/* Global Variables
 * ==============================
 */

/* ==============================
 * TODO -- Add and Edit the user Details.
 */

(function($, undefined) {

	// defaults
	var defaults = {
		editable: false,
		edit: function(){}
	};

	$.fn.usersTable = function( options ){
		// Extend
		options = $.extend(true, {},
	        defaults,
	        options
	    );
	    // returning html
	    this.each(function(i, _element) {
	    	var element = $(_element);
	    	var users_table = new UsersTable(element, options);
	    	users_table.render(); // It'll render elements
	    });

	    return this;
	};

	function UsersTable(element, options){
		var t = this; // Ref Object

		// exports
		t.options = options;
		t.render = render;

		//locals
		var _element = element[0];
		var content;
		var header;
		var modalPopUp = getModalPopup();
		var addButton;
		var userTable;
		var fields = options.fields;
		var headers = options.headers;
		var editable = options.editable;

		// html locals
		var form = $("<form/>");
		var div = $("<div/>");
		var input = $("<input/>");
		var a = $("<a/>");
		var table = $("<table/>");
		var tbody = $("<tbody/>");
		var thead = $("<thead/>");
		var tr = $("<tr/>");
		var th = $("<th/>");
		var td = $("<td/>");


		function render(){
			if (!content) {
	            initialRender();
	        }//
		}
		// First Time Render
		function initialRender(){
			element.addClass('ut'); // TODO

			content = div.clone().addClass('ut-content').css({'position':'relative'});

			$.ajax({
				url: options.apiUrl,
				method: 'GET',
				success: function(result){

					getContent(result);

					element.html(content);
				},
				error: function(e){
					alert("API ERROR");
				}
			});

			
			// modalPopUp.appendTo($('body')); // Modal Popup

			header = div.clone().addClass('ut-header').css({'position':'header'});
			getHeader();
			header.prependTo(element);

		}

		// Header
		function getHeader(){
			addButton = a.clone().attr({'href':'#'}).addClass('btn btn-lg btn-success');

			addButton.click(function(){
				modalPopUp.modal('show');
			});
		}


		// Get Content
		function getContent(data){
			userTable = table.clone().addClass('table');
			
			// Header Done
			userTableHead = thead.clone();
			userTableHead.append(getTableHead());
			userTableHead.appendTo(userTable);
			
			// Body
			userTable.append(getTableBody(data));

			// Append Table
			userTable.appendTo(content);
		}
		
		// Table Header
		function getTableHead(){
			u_tr = tr.clone();
			for(var i=0; i<headers.length;i++){
				var fieldName = headers[i];				
				var t_th = th.clone().addClass('ut-uppercase').text(fieldName); // 
				u_tr.append(t_th);
			}
			if(editable)
				(th.clone().addClass('ut-uppercase').text("Actions")).appendTo(u_tr);
			return u_tr;
		}

		// Table Body
		function getTableBody(data){
			u_tbody = tbody.clone();
			$.each(data.objects, function(index, userDetails){
				u_tr = tr.clone();
				for (var i=0;i<fields.length;i++) {
					var x = fields[i];
					x = x.split('.');
					
					var obj_str = "userDetails";

					for(var k=0;k<x.length;k++){
						obj_str += "['"+x[k]+"']";
					}
					// field_obj.push(obj_str);
					var fieldValue = eval(obj_str);				
					var t_th = td.clone().text(fieldValue); // 
					u_tr.append(t_th);
				};
				if(editable)
					(td.clone().html(a.clone().attr({'href':'#'}).text('Edit').click(function(){options.edit(userDetails)}))).appendTo(u_tr);
				u_tbody.append(u_tr);
			})
			
			return u_tbody;
		}


		// Genarate Modal popup
		function getModalPopup(){
			str = '<div class="modal fade" id="myModal"> \
					  <div class="modal-dialog"> \
					    <div class="modal-content"> \
					      <div class="modal-header"> \
					        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
					        <h4 class="modal-title" id="modal_head">Modal title</h4> \
					      </div> \
					      <div class="modal-body" id="modal_body"> \
					        <p>One fine body&hellip;</p> \
					      </div>';

					      // <div class="modal-footer"> \
					      //   <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
					      //   <button type="button" class="btn btn-primary">Save changes</button> \
					      // </div> \
			str += 	'</div> \
					  </div> \
					</div>';
			return str;
		}
	}


})(jQuery);
