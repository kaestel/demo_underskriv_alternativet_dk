u.bug_console_only = true;

Util.Objects["page"] = new function() {
	this.init = function(page) {
		
		//if(u.hc(page, "i:page")) {
			
			// header reference
			page.hN = u.qs("#header");

			// content reference
			page.cN = u.qs("#content");

			// // navigation reference
			// page.nN = u.qs("#navigation");
			// page.nN = u.ie(page.hN, page.nN);

			// footer reference
			page.fN = u.qs("#footer");


			// global resize handler 
			page.resized = function() {

				if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
					page.cN.scene.resized();
				}

			}

			// global scroll handler 
			page.scrolled = function() {
//				u.bug("scrolled");

				if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
					page.cN.scene.scrolled();
				}

			}

			// Page is ready - called from several places, evaluates when page is ready to be shown
			page.ready = function() {

				// page is ready to be shown - only initalize if not already shown
				if(!u.hc(this, "ready")) {

					// page is ready
					u.addClass(this, "ready");

					// set resize handler
					u.e.addEvent(window, "resize", page.resized);
					// set scroll handler
					u.e.addEvent(window, "scroll", page.scrolled);

					// resize / scroll straight away!
					this.resized();
					this.scrolled();
				}
			}

			// ready to start page builing process
			page.ready();

		//}
	}
}

u.e.addDOMReadyEvent(u.init);




