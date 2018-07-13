Util.Objects["download"] = new function() {
	this.init = function(node) {
		u.ce(node);
		node.clicked = function() {
			window.open(this.url);
			u.t.setTimer(node, node.reload, 2000);
		}
		node.reload = function() {
			location.reload();
		}
	}
}