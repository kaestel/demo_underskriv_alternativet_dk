u.bug_force = true;
//u.bug_console_only = false;

Util.Objects["dataform"] = new function() {
	this.init = function(scene) {


		// resize scene
		scene.resized = function() {

			var calc_width = this.form.offsetWidth;

			u.as(this.form.fields["name"], "width", (calc_width - 8) + "px");
			u.as(this.form.fields["address1"], "width", (calc_width - 8) + "px");
			u.as(this.form.fields["address2"], "width", (calc_width - 8) + "px");

			u.as(this.form.fields["postal"], "width", Math.floor(calc_width - 29)*0.2 + "px");
			u.as(this.form.fields["city"], "width", Math.floor(calc_width - 28)*0.8 + "px");

			u.as(this.form.fields["municipality"], "width", (calc_width - 8) + "px");

			u.as(this.form.fields["cpr_1"], "width", Math.floor(calc_width - 28)*0.6 + "px");
			u.as(this.form.fields["cpr_2"], "width", Math.floor(calc_width - 28)*0.4 + "px");
		
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scrolled")

		}


		scene.ready = function() {


			page.cN.scene = this;

			this.form = u.qs("form", this);
			u.f.init(this.form);

			this.resized();
		}
		
		scene.ready();

	}
}

Util.Objects["signature"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))
		
		// resize scene
		scene.resized = function() {

			this.canvas_date._context.clearRect(0, 0, this.canvas_date.offsetWidth, this.canvas_date.offsetHeight);
			this.canvas_date._offsetLeft = u.absX(this.canvas_date);
			this.canvas_date._offsetTop = u.absY(this.canvas_date);
			this.canvas_date.width = this.div_date.offsetWidth - 4;
			this.canvas_date.height = this.canvas_date.width/this.canvas_date._proportion;
			this.canvas_date._factor_x = this.canvas_date.width/133;
			this.canvas_date._factor_y = this.canvas_date.height/22;
			this.canvas_date.repeat();


			this.canvas_signature._context.clearRect(0, 0, this.canvas_signature.offsetWidth, this.canvas_signature.offsetHeight);
			this.canvas_signature._offsetLeft = u.absX(this.canvas_signature);
			this.canvas_signature._offsetTop = u.absY(this.canvas_signature);
			this.canvas_signature.width = this.div_signature.offsetWidth - 4;
			this.canvas_signature.height = this.canvas_signature.width/this.canvas_signature._proportion;
			this.canvas_signature._factor_x = this.canvas_signature.width/250;
			this.canvas_signature._factor_y = this.canvas_signature.height/41;
			this.canvas_signature.repeat();

			this.validateSignature();
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scrolled")

		}


		scene.ready = function() {

			page.cN.scene = this;


			// reference main elements
			this._signatureform = u.qs("div.signatureform", this);
			this._form = u.qs("form", this);
			this.actions = u.qs(".actions", this);


			this.validateSignature = function() {
//				u.bug("validate:" + this.canvas_date.paths.paths + ", " + this.canvas_signature.paths.paths)

				if(this.canvas_date.paths.paths.length > 20) {
					u.ac(this.canvas_date, "correct");
				}
				else {
					u.rc(this.canvas_date, "correct");
				}

				if(this.canvas_signature.paths.paths.length > 20) {
					u.ac(this.canvas_signature, "correct");
				}
				else {
					u.rc(this.canvas_signature, "correct");
				}


				if(this.canvas_date.paths.paths.length > 20 && this.canvas_signature.paths.paths.length > 20) {
					u.rc(this.bn_preview, "disabled");
					this.bn_preview.value = "Godkend";
				}
				else {
					u.ac(this.bn_preview, "disabled");
					this.bn_preview.value = "Underskriv";
				}
			}


			// inject help text
			u.ae(this, "h2", {"html":"Undertegnede erklærer at ville deltage i anmeldelsen af ovenstående parti, som agter at deltage i kommende folketingsvalg."});

			// append user data to end
			this._signatureform = u.ae(this, this._signatureform);



			// date input
			this.div_date = u.ae(this, "div", {"class":"date"});
			this.div_signature = u.ae(this, "div", {"class":"signature"});


			// append form to end of page
			this._form = u.ae(this, this._form);



			// enable drawing
			this._beginDrawing = function(event) {
				u.e.kill(event);

				this.scene.activeElement = this;


				u.e.addMoveEvent(this.scene, this.scene._draw);
//				u.e.addMoveEvent(this, this.scene._draw);

				this._bx = u.eventX(event)-this._offsetLeft;
				this._by = u.eventY(event)-this._offsetTop;

//				u.bug("begin drawing: x=" + this._bx + ", y=" + this._by + ", this._offsetLeft:" + this._offsetLeft);


				this._context.moveTo(this._bx, this._by);
				this._context.beginPath();


				this.paths.paths.push(0);
				this.paths.x_paths.push(u.round(this._bx/this._factor_x, 3));
				this.paths.y_paths.push(u.round(this._by/this._factor_y, 3));
			}

			this._endDrawing = function(event) {
//				u.bug("event in end:" + event + ", " + this.activeElement)

				// this._cx = u.eventX(event)-this._offsetLeft;
				// this._cy = u.eventY(event)-this._offsetTop;

				// end-event does not have eventX/Y
				if(this.activeElement) {

					this.activeElement._cx = this.activeElement._bx;
					this.activeElement._cy = this.activeElement._by;

	//				u.bug("end drawing: x=" + this._cx + ", y=" + this._cy);

					this.activeElement._context.closePath();

					this.activeElement.paths.paths.push(0);
					this.activeElement.paths.x_paths.push(u.round(this.activeElement._cx/this.activeElement._factor_x, 3));
					this.activeElement.paths.y_paths.push(u.round(this.activeElement._cy/this.activeElement._factor_y, 3));

//					u.e.removeMoveEvent(this.activeElement, this.activeElement.scene._draw);
					u.e.removeMoveEvent(this, this._draw);

					this.activeElement._input.value = encodeURIComponent(JSON.stringify(this.activeElement.paths));


					this.activeElement.scene.validateSignature();

					this.activeElement = false;

				}



// 				this._cx = this._bx;
// 				this._cy = this._by;
//
// //				u.bug("end drawing: x=" + this._cx + ", y=" + this._cy);
//
// 				this._context.closePath();
//
// 				this.paths.paths.push(0);
// 				this.paths.x_paths.push(u.round(this._cx/this._factor_x, 3));
// 				this.paths.y_paths.push(u.round(this._cy/this._factor_y, 3));
//
// 				u.e.removeMoveEvent(this, this.scene._draw);
//
// 				this._input.value = encodeURIComponent(JSON.stringify(this.paths));
//
//
// 				this.scene.validateSignature();

			}

			this._draw = function(event) {
//				u.bug("event in draw:" + event)

				u.e.kill(event);

				if(this.activeElement) {

					this.activeElement._cx = u.eventX(event)-this.activeElement._offsetLeft;
					this.activeElement._cy = u.eventY(event)-this.activeElement._offsetTop;

					this.activeElement._bx = this.activeElement._cx;
					this.activeElement._by = this.activeElement._cy;

	//				u.bug("drawing in progress: x=" + this._cx + " ("+u.round(this._cx/this._factor_x, 3)+", "+this._factor_x+"), y=" + this._cy + " ("+u.round(this._cy/this._factor_y, 3)+", "+this._factor_y+")");

					this.activeElement._context.lineTo(this.activeElement._cx, this.activeElement._cy);
					this.activeElement._context.stroke();

					this.activeElement.paths.paths.push(this.activeElement._context.strokeStyle);
					this.activeElement.paths.x_paths.push(u.round(this.activeElement._cx/this.activeElement._factor_x, 3));
					this.activeElement.paths.y_paths.push(u.round(this.activeElement._cy/this.activeElement._factor_y, 3));

				}
// 				this._cx = u.eventX(event)-this._offsetLeft;
// 				this._cy = u.eventY(event)-this._offsetTop;
//
// 				this._bx = this._cx;
// 				this._by = this._cy;
//
// //				u.bug("drawing in progress: x=" + this._cx + " ("+u.round(this._cx/this._factor_x, 3)+", "+this._factor_x+"), y=" + this._cy + " ("+u.round(this._cy/this._factor_y, 3)+", "+this._factor_y+")");
//
// 				this._context.lineTo(this._cx, this._cy);
// 				this._context.stroke();
//
// 				this.paths.paths.push(this._context.strokeStyle);
// 				this.paths.x_paths.push(u.round(this._cx/this._factor_x, 3));
// 				this.paths.y_paths.push(u.round(this._cy/this._factor_y, 3));

			}



			// date drawing
			u.ae(this.div_date, "p", {"html":"Dags dato"});
			this.canvas_date = u.ae(this.div_date, "canvas", {"class":"date"});

			this.canvas_date._offsetLeft = u.absX(this.canvas_date);
			this.canvas_date._offsetTop = u.absY(this.canvas_date);

			// canvas proportion
			this.canvas_date._proportion = 133/22;
			this.canvas_date.width = this.div_date.offsetWidth - 4;
			this.canvas_date.height = this.canvas_date.width/this.canvas_date._proportion;

			// canvas scale factor
			this.canvas_date._factor_x = this.canvas_date.width/133;
			this.canvas_date._factor_y = this.canvas_date.height/22;

			this.canvas_date._context = this.canvas_date.getContext("2d");
//			this.canvas_date._context.strokeStyle = "#009f00";
			this.canvas_date._context.lineWidth = 1;
			this.canvas_date.scene = this;

			this.canvas_date.paths = {"x_paths":[], "y_paths":[], "paths":[]};
			this.canvas_date._input = u.qs("#date_data");

			// repeat drawing in date field
			this.canvas_date.repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {

						this._context.moveTo(this.paths.x_paths[i]*this._factor_x, this.paths.y_paths[i]*this._factor_y);
						this._context.lineTo(this.paths.x_paths[i+1]*this._factor_x, this.paths.y_paths[i+1]*this._factor_y);

						this._context.strokeStyle = this.paths.paths[i];
						this._context.stroke();
					}
					else {
						this._context.closePath();
						if(i < this.paths.paths.length-2) {
							this._context.beginPath();
						}
					}
				}

			}

			// drawing controls
			u.e.addStartEvent(this.canvas_date, this._beginDrawing);
//			u.e.addEndEvent(this.canvas_date, this._endDrawing);
			if(u.e.event_pref == "mouse") {
//				u.e.addEvent(this.canvas_date, "mouseout", this._endDrawing);
			}



			// signature drawing
			u.ae(this.div_signature, "p", {"html":"Underskrift"});
			this.canvas_signature = u.ae(this.div_signature, "canvas", {"class":"signature"});

			this.canvas_signature._offsetLeft = u.absX(this.canvas_signature);
			this.canvas_signature._offsetTop = u.absY(this.canvas_signature);

			// canvas proportion
			this.canvas_signature._proportion = 250/41;

			this.canvas_signature.width = this.div_signature.offsetWidth - 4;
			this.canvas_signature.height = this.canvas_signature.width/this.canvas_signature._proportion;

			// canvas scale factor
			this.canvas_signature._factor_x = this.canvas_signature.width/250;
			this.canvas_signature._factor_y = this.canvas_signature.height/41;


			this.canvas_signature._context = this.canvas_signature.getContext("2d");

//			this.canvas_signature._context.strokeStyle = "#009f00";

			this.canvas_signature._context.lineWidth = 1;
			this.canvas_signature.scene = this;

			this.canvas_signature.paths = {"x_paths":[], "y_paths":[], "paths":[]};
			this.canvas_signature._input = u.qs("#signature_data");

			// repeat drawing in date field
			this.canvas_signature.repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {

						this._context.moveTo(this.paths.x_paths[i]*this._factor_x, this.paths.y_paths[i]*this._factor_y);
						this._context.lineTo(this.paths.x_paths[i+1]*this._factor_x, this.paths.y_paths[i+1]*this._factor_y);

						this._context.strokeStyle = this.paths.paths[i];
						this._context.stroke();
					}
					else {
						this._context.closePath();
						if(i < this.paths.paths.length-2) {
							this._context.beginPath();
						}
					}
				}

			}

			// drawing controls
			u.e.addStartEvent(this.canvas_signature, this._beginDrawing);
//			u.e.addEndEvent(this.canvas_signature, this._endDrawing);
			if(u.e.event_pref == "mouse") {
//				u.e.addEvent(this.canvas_signature, "mouseout", this._endDrawing);
			}


			// end drawing event on scene
			u.e.addEndEvent(this, this._endDrawing);


			this.canvas_reset = u.ae(this.actions, "li", {"class":"reset", "html":"Slet"});

			// assign actions to tools
			this.canvas_reset.scene = this;
			u.e.click(this.canvas_reset);
			this.canvas_reset.clicked = function() {

				// clear selected canvas
				this.scene.canvas_date._context.clearRect(0, 0, this.scene.canvas_date.offsetWidth, this.scene.canvas_date.offsetHeight);
				this.scene.canvas_date._input.value = "";
				this.scene.canvas_date.paths = {"x_paths":[], "y_paths":[], "paths":[]};

				this.scene.canvas_signature._context.clearRect(0, 0, this.scene.canvas_signature.offsetWidth, this.scene.canvas_signature.offsetHeight);
				this.scene.canvas_signature._input.value = "";
				this.scene.canvas_signature.paths = {"x_paths":[], "y_paths":[], "paths":[]};
			}


			// enable Preview button
			this.bn_preview = u.qs(".preview input", this._form);
			this.bn_preview.scene = this;
			this.bn_preview.onclick = function(event) {
				u.e.kill(event);

				if(!u.hc(this, "disabled")) {
					this.scene._form.submit();
				}

			}


			// inject back button
			this.bn_back = u.ae(this, "div", {"class":"back", "html":"Ret personlige oplysninger"});
			this.bn_back.scene = this;

			u.e.click(this.bn_back);
			this.bn_back.clicked = function(event) {
				this.scene._form.action = "/vaelgererklaering";
				this.scene._form.submit();
			}


			if(this.canvas_signature._input.value) {
				this.canvas_signature.paths = JSON.parse(decodeURIComponent(this.canvas_signature._input.value).replace(/\\/g, ""));
			}

			if(this.canvas_date._input.value) {
				this.canvas_date.paths = JSON.parse(decodeURIComponent(this.canvas_date._input.value).replace(/\\/g, ""));
			}


			// update drawinds to current size
			this.resized();
		}

		scene.ready();
	}
}

Util.Objects["preview"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))
		
		// resize scene
		scene.resized = function() {
			
			// adjust preview to screen
			u.a.origin(this._preview, 0, 0);
			u.a.scale(this._preview, (this._form.offsetWidth / this._preview.offsetWidth));

			u.a.setHeight(this._preview_wrapper, this._preview.offsetHeight * (this._form.offsetWidth / this._preview.offsetWidth));

		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scrolled")

		}

		scene.ready = function() {

			page.cN.scene = this;


			// reference existing elements
			this._vcard = u.qs("div.vcard", this);
			this._signatureform = u.qs("div.signatureform", this);

			this._form = u.qs("form", this);
			this._approved_input = u.qs("#approved")


			// add preview div
			this._preview_wrapper = u.ae(this, "div", {"class":"wrapper"});
			this._preview = u.ae(this._preview_wrapper, "div", {"class":"preview"});

			// append vcard and signatureform to preview div
			u.ae(this._preview, this._vcard);
			u.ae(this._preview, this._signatureform);


			// append form to end
			u.ae(this, this._form);




			// signature input
			this.div_signature = u.ae(this._signatureform, "div", {"class":"signature"});
			this.canvas_signature = u.ae(this.div_signature, "canvas", {"class":"signature"});
			this.canvas_signature._offsetLeft = u.absX(this.canvas_signature);
			this.canvas_signature._offsetTop = u.absY(this.canvas_signature);
			this.canvas_signature.width = this.canvas_signature.offsetWidth;
			this.canvas_signature.height = this.canvas_signature.offsetHeight;
			this.canvas_signature._context = this.canvas_signature.getContext("2d");
//			this.canvas_signature._context.strokeStyle = "#009f00";
			this.canvas_signature._context.lineWidth = 1;
			this.canvas_signature.scene = this;
			this.canvas_signature.paths = JSON.parse(decodeURIComponent(u.qs("#signature_data").innerHTML).replace(/\\/g, ""));
			


			// date input
			this.div_date = u.ae(this._signatureform, "div", {"class":"date"});
			this.canvas_date = u.ae(this.div_date, "canvas", {"class":"date"});
			this.canvas_date._offsetLeft = u.absX(this.canvas_date);
			this.canvas_date._offsetTop = u.absY(this.canvas_date);
			this.canvas_date.width = this.canvas_date.offsetWidth;
			this.canvas_date.height = this.canvas_date.offsetHeight;
			this.canvas_date._context = this.canvas_date.getContext("2d");
//			this.canvas_date._context.strokeStyle = "#009f00";
			this.canvas_date._context.lineWidth = 1;
			this.canvas_date.scene = this;
			this.canvas_date.paths = JSON.parse(decodeURIComponent(u.qs("#date_data").innerHTML).replace(/\\/g, ""));



			// repeat drawing in signature field
			this.canvas_signature.repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {
//						this._context.moveTo(this._x_paths[i], this._y_paths[i]);

						this._context.moveTo(this.paths.x_paths[i], this.paths.y_paths[i]);
						this._context.lineTo(this.paths.x_paths[i+1], this.paths.y_paths[i+1]);

						this._context.strokeStyle = this.paths.paths[i];
						this._context.stroke();
					}
					else {
						this._context.closePath();
						if(i < this.paths.paths.length-2) {
							this._context.beginPath();
						}
					}
				}

			}

			// repeat drawing in date field
			this.canvas_date.repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {
//						this._context.moveTo(this._x_paths[i], this._y_paths[i]);

						this._context.moveTo(this.paths.x_paths[i], this.paths.y_paths[i]);
						this._context.lineTo(this.paths.x_paths[i+1], this.paths.y_paths[i+1]);

						this._context.strokeStyle = this.paths.paths[i];
						this._context.stroke();
					}
					else {
						this._context.closePath();
						if(i < this.paths.paths.length-2) {
							this._context.beginPath();
						}
					}
				}

			}

			this.canvas_date.repeat();
			this.canvas_signature.repeat();




			// inject back button
			this.bn_back = u.ae(this, "div", {"class":"back", "html":"Ret din underskrift"});
			this.bn_back.scene = this;

			u.e.click(this.bn_back);
			this.bn_back.clicked = function(event) {
				this.scene._approved_input.value = 0;
				this.scene._form.action = "/vaelgererklaering/signature";
				this.scene._form.submit();
			}


			this.resized();
		}


		scene.ready();
	}
}
