u.bug_force = true;

Util.Objects["dataform"] = new function() {
	this.init = function(scene) {

		var form = u.qs("form", scene);
		u.f.init(form);

	}
}

Util.Objects["signature"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))
		
		// resize scene
		scene.resized = function() {

			if(scene.canvas_input) {
				scene.canvas_input._offsetLeft = u.absX(scene.canvas_input);
				scene.canvas_input._offsetTop = u.absY(scene.canvas_input);
			}
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scrolled")

		}


		scene.ready = function() {


			// set resize handler
			u.e.addEvent(window, "resize", this.resized);
			// set scroll handler
			u.e.addEvent(window, "scroll", this.scrolled);


			this._signatureform = u.qs("div.signatureform", this);
//			this._slug = u.qs("#slug").value;
//			this._approved_input = u.qs("#approved")

			// inject help text
			u.ae(this, "h2", {"html":"Underskriv vælgererklæringen"});
			u.ae(this, "p", {"html":"Både DAGS DATO og UNDERSKRIFT skal skrives med hånden/musen.<br />Klik på de røde felter i formularen ovenfor, for at vælge hvilket felt du vil skrive i."});


			// signature input
			this.div_signature = u.ae(this._signatureform, "div", {"class":"signature"});
			this.canvas_signature = u.ae(this.div_signature, "canvas", {"class":"signature"});
			this.canvas_signature._offsetLeft = u.absX(this.canvas_signature);
			this.canvas_signature._offsetTop = u.absY(this.canvas_signature);
			this.canvas_signature.width = this.canvas_signature.offsetWidth;
			this.canvas_signature.height = this.canvas_signature.offsetHeight;
			this.canvas_signature._context = this.canvas_signature.getContext("2d");
			this.canvas_signature._context.strokeStyle = "#009f00";
			this.canvas_signature._context.lineWidth = 0.5;
			this.canvas_signature.scene = this;
			this.canvas_signature.paths = {"x_paths":[], "y_paths":[], "paths":[]};
			this.canvas_signature._input = u.qs("#signature_data");

			u.e.click(this.canvas_signature);
			this.canvas_signature.clicked = function() {
				u.ac(this, "selected");
				u.rc(this.scene.canvas_date, "selected");

				if(this.scene.canvas_date.paths.paths.length > 20) {
					u.ac(this.scene.canvas_date, "correct");
				}
				else {
					u.rc(this.scene.canvas_date, "correct");
				}

				this.scene.selected_input = this;

				this.scene.createCanvasInput();

				u.ac(this.scene.canvas_input, "signature");
				u.rc(this.scene.canvas_input, "date");

				this.scene.canvas_reset.clicked();
			}


			// date input
			this.div_date = u.ae(this._signatureform, "div", {"class":"date"});
			this.canvas_date = u.ae(this.div_date, "canvas", {"class":"date"});
			this.canvas_date._offsetLeft = u.absX(this.canvas_date);
			this.canvas_date._offsetTop = u.absY(this.canvas_date);
			this.canvas_date.width = this.canvas_date.offsetWidth;
			this.canvas_date.height = this.canvas_date.offsetHeight;
			this.canvas_date._context = this.canvas_date.getContext("2d");
			this.canvas_date._context.strokeStyle = "#009f00";
			this.canvas_date._context.lineWidth = 0.5;
			this.canvas_date.scene = this;
			this.canvas_date.paths = {"x_paths":[], "y_paths":[], "paths":[]};
			this.canvas_date._input = u.qs("#date_data");


			u.e.click(this.canvas_date);
			this.canvas_date.clicked = function() {
				u.ac(this, "selected");
				u.rc(this.scene.canvas_signature, "selected");

				if(this.scene.canvas_signature.paths.paths.length > 20) {
					u.ac(this.scene.canvas_signature, "correct");
				}
				else {
					u.rc(this.scene.canvas_signature, "correct");
				}

				this.scene.selected_input = this;

				this.scene.createCanvasInput();

				u.ac(this.scene.canvas_input, "date");
				u.rc(this.scene.canvas_input, "signature");


				this.scene.canvas_reset.clicked();

				this.scene.bn_preview.value = "Godkend";

			}


			// inject active signing canvas
			this.div_input = u.ae(this, "div", {"class":"input"});
			this._form = u.ae(this, u.qs("form", this));


			// inject reset button
			this.actions = u.qs(".actions", this);


			// create canvas for signing document
			this.createCanvasInput = function() {

				if(!this.canvas_input) {
					u.as(this.div_input, "display", "block");

					this.canvas_input = u.ie(this.div_input, "canvas", {"class":"canvas_input"});
					this.canvas_input.intro = u.ie(this.div_input, "h2", {"html":"Skriv med din mus, <br>finger eller pen"});

					// canvas settings
					this.canvas_input._offsetLeft = u.absX(this.canvas_input);
					this.canvas_input._offsetTop = u.absY(this.canvas_input);
					this.canvas_input.width = 733;
					this.canvas_input.height = 121;
					this.canvas_input._context = this.canvas_input.getContext("2d");
					this.canvas_input._context.strokeStyle = "#009f00";
					this.canvas_input._context.lineWidth = 2;
					this.canvas_input.scene = this;


					// enable drawing
					this.canvas_input._beginDrawing = function(event) {
						u.e.kill(event);

						u.e.addMoveEvent(this, this._draw);

						this._bx = u.eventX(event)-this._offsetLeft;
						this._by = u.eventY(event)-this._offsetTop;

//						u.bug("begin drawing: x=" + this._bx + ", y=" + this._by + ", this._offsetLeft:" + this._offsetLeft);

						this._context.moveTo(this._bx, this._by);
						this._context.beginPath();


						this.scene.selected_input.paths.paths.push(0);
						this.scene.selected_input.paths.x_paths.push(u.round(this._bx/this.scene.selected_input._factor, 3));
						this.scene.selected_input.paths.y_paths.push(u.round(this._by/this.scene.selected_input._factor, 3));
					}

					this.canvas_input._endDrawing = function(event) {
//						u.bug("event in end:" + event)

						// this._cx = u.eventX(event)-this._offsetLeft;
						// this._cy = u.eventY(event)-this._offsetTop;

						// end-event does not have eventX/Y

						this._cx = this._bx;
						this._cy = this._by;

		//				u.bug("end drawing: x=" + this._cx + ", y=" + this._cy);

						this._context.closePath();

						this.scene.selected_input.paths.paths.push(0);
						this.scene.selected_input.paths.x_paths.push(u.round(this._cx/this.scene.selected_input._factor, 3));
						this.scene.selected_input.paths.y_paths.push(u.round(this._cy/this.scene.selected_input._factor, 3));

						u.e.removeMoveEvent(this, this._draw);

						this.scene.selected_input._input.value = encodeURIComponent(JSON.stringify(this.scene.selected_input.paths));
					}

					this.canvas_input._draw = function(event) {
//						u.bug("event in draw:" + event)

						u.e.kill(event);

						this._cx = u.eventX(event)-this._offsetLeft;
						this._cy = u.eventY(event)-this._offsetTop;

						this._bx = this._cx;
						this._by = this._cy;

//						u.bug("drawing in progress: x=" + this._cx + ", y=" + this._cy);

						this._context.lineTo(this._cx, this._cy);
						this._context.stroke();


//						this.scene.selected_input.paths.paths.push(1);
						this.scene.selected_input.paths.paths.push(this._context.strokeStyle);
						this.scene.selected_input.paths.x_paths.push(u.round(this._cx/this.scene.selected_input._factor, 3));
						this.scene.selected_input.paths.y_paths.push(u.round(this._cy/this.scene.selected_input._factor, 3));

						this.scene.selected_input._repeat();
					}

					// adding event controls
					// remove intro
					this.canvas_input._clearIntro = function() {
						u.e.removeStartEvent(this, this._clearIntro);
						u.as(this.intro, "display", "none");
					}
					u.e.addStartEvent(this.canvas_input, this.canvas_input._clearIntro);
					// drawing controls
					u.e.addStartEvent(this.canvas_input, this.canvas_input._beginDrawing);
					u.e.addEndEvent(this.canvas_input, this.canvas_input._endDrawing);
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(this.canvas_input, "mouseout", this.canvas_input._endDrawing);
					}

					// calculate drawing conversion factor
					this.canvas_date._factor = this.canvas_input.offsetWidth/this.canvas_date.offsetWidth;
					this.canvas_signature._factor = this.canvas_input.offsetWidth/this.canvas_signature.offsetWidth;

					this.canvas_reset = u.ie(this.actions, "li", {"class":"reset", "html":"Slet"});

					// assign actions to tools
					this.canvas_reset.scene = this;
					u.e.click(this.canvas_reset);
					this.canvas_reset.clicked = function() {

						// clear selected canvas
						this.scene.selected_input._context.clearRect(0, 0, this.scene.selected_input.offsetWidth, this.scene.selected_input.offsetHeight);
						this.scene.selected_input._input.value = "";

						// clear input canvas
						this.scene.canvas_input._context.clearRect(0, 0, this.scene.canvas_input.offsetWidth, this.scene.canvas_input.offsetHeight);
						this.scene.selected_input.paths = {"x_paths":[], "y_paths":[], "paths":[]};
					}

				}
			}


			// repeat drawing in signature field
			this.canvas_signature._repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {

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
			this.canvas_date._repeat = function(event) {
				var i, draw;

				this._context.beginPath();

				for(i = 0; i < this.paths.paths.length-1; i++) {
					if(this.paths.paths[i]) {

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

			// enable Preview button
			this.bn_preview = u.qs(".preview input", this._form);
			this.bn_preview.scene = this;
			this.bn_preview.onclick = function(event) {
				u.e.kill(event);


				// store input data in form
				// var date_data_input = u.qs("#date_data");
				// var signature_data_input = u.qs("#signature_data");

				// u.bug("this.scene.canvas_date.paths.paths.length:" + this.scene.canvas_date.paths.paths.length)
				// u.xInObject(this.scene.canvas_date.paths.paths);
				// u.bug("this.scene.canvas_signature.paths.paths.length:" + this.scene.canvas_signature.paths.paths.length)
				// u.xInObject(this.scene.canvas_date.paths.paths);

				// make sure both fields have been updated
				if(this.scene.canvas_date.paths.paths.length < 20) {
					this.value = "Godkend";

					this.scene.canvas_date.clicked();
				}
				else if(this.scene.canvas_signature.paths.paths.length < 20) {
					this.value = "Godkend";

					this.scene.canvas_signature.clicked();
				}
				else {

//					this.scene._approved_input.value = 1;
					this.scene._form.submit();
				}

			}


			// inject back button
			this.bn_back = u.ae(this, "div", {"class":"back", "html":"Ret personlige oplysninger"});
			this.bn_back.scene = this;

			u.e.click(this.bn_back);
			this.bn_back.clicked = function(event) {
//				this.scene._approved_input.value = 0;

				this.scene._form.action = "/";
//				this.scene._form.action = "/"+this.scene._slug;
				this.scene._form.submit();
			}


			// existing data
			if(this.canvas_signature._input.value || this.canvas_date._input.value) {

//				this.createCanvasInput();

				if(this.canvas_signature._input.value) {
					this.canvas_signature.paths = JSON.parse(decodeURIComponent(this.canvas_signature._input.value).replace(/\\/g, ""));
					this.canvas_signature._repeat();
				}

				if(this.canvas_date._input.value) {
					this.canvas_date.paths = JSON.parse(decodeURIComponent(this.canvas_date._input.value).replace(/\\/g, ""));
					this.canvas_date._repeat();
				}

				if(this.canvas_signature.paths.paths.length > 20) {
					u.ac(this.canvas_signature, "correct");
				}
				if(this.canvas_date.paths.paths.length > 20) {
					u.ac(this.canvas_date, "correct");
				}


			}

			// all data available
			if(!(this.canvas_signature._input.value && this.canvas_date._input.value)) {

				this.bn_preview.value = "Underskriv";

			}

			this.resized();
		}

		scene.ready();
	}
}

Util.Objects["preview"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))
		

		scene.ready = function() {


			this._signatureform = u.qs("div.signatureform", this);
			this._form = u.qs("form", this);
			this._approved_input = u.qs("#approved")

			// signature input
			this.div_signature = u.ae(this._signatureform, "div", {"class":"signature"});
			this.canvas_signature = u.ae(this.div_signature, "canvas", {"class":"signature"});
			this.canvas_signature._offsetLeft = u.absX(this.canvas_signature);
			this.canvas_signature._offsetTop = u.absY(this.canvas_signature);
			this.canvas_signature.width = this.canvas_signature.offsetWidth;
			this.canvas_signature.height = this.canvas_signature.offsetHeight;
			this.canvas_signature._context = this.canvas_signature.getContext("2d");
			this.canvas_signature._context.strokeStyle = "#009f00";
			this.canvas_signature._context.lineWidth = 0.5;
			this.canvas_signature.scene = this;
			if(u.qs("#signature_data").innerHTML) {
				this.canvas_signature.paths = JSON.parse(decodeURIComponent(u.qs("#signature_data").innerHTML).replace(/\\/g, ""));
			}
			else {
				this.canvas_signature.paths = {paths:{}};
			}


			// date input
			this.div_date = u.ae(this._signatureform, "div", {"class":"date"});
			this.canvas_date = u.ae(this.div_date, "canvas", {"class":"date"});
			this.canvas_date._offsetLeft = u.absX(this.canvas_date);
			this.canvas_date._offsetTop = u.absY(this.canvas_date);
			this.canvas_date.width = this.canvas_date.offsetWidth;
			this.canvas_date.height = this.canvas_date.offsetHeight;
			this.canvas_date._context = this.canvas_date.getContext("2d");
			this.canvas_date._context.strokeStyle = "#009f00";
			this.canvas_date._context.lineWidth = 0.5;
			this.canvas_date.scene = this;
			if(u.qs("#date_data").innerHTML) {
				this.canvas_date.paths = JSON.parse(decodeURIComponent(u.qs("#date_data").innerHTML).replace(/\\/g, ""));
			}
			else {
				this.canvas_date.paths = {paths:{}};
			}



			// repeat drawing in signature field
			this.canvas_signature._repeat = function(event) {
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
			this.canvas_date._repeat = function(event) {
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

			this.canvas_date._repeat();
			this.canvas_signature._repeat();


			// inject back button
			this.bn_back = u.ae(this, "div", {"class":"back", "html":"Ret underskrift eller oplysninger"});
			this.bn_back.scene = this;

			u.e.click(this.bn_back);
			this.bn_back.clicked = function(event) {
				this.scene._approved_input.value = 0;
				this.scene._form.action = "/vaelgererklaering/signature";
				this.scene._form.submit();
			}

		}


		scene.ready();
	}
}

u.e.addDOMReadyEvent(u.init);
