
// custom initializations
Util.Form.customInit["postalcity"] = function(form, field) {

	u.bug("fisk")
	field._input = u.qs("input.postal", field);
	field._input_city = u.qs("input.city", field);

	field._input.field = field;
	field._input_city.field = field;


	// add input to fields array
	form.fields[field._input.name] = field._input;
	form.fields[field._input_city.name] = field._input_city;

	u.bug("fisk2")

	// get input label (only label for first input)
	field._input._label = u.qs("label[for="+field._input.id+"]", field);

	// get/set value function
	field._input.val = u.f._value;
	field._input_city.val = u.f._value;

	u.bug("fisk3")

	// change/update events
	u.e.addEvent(field._input, "keyup", u.f._updated);
	u.e.addEvent(field._input, "change", u.f._changed);
	u.e.addEvent(field._input_city, "keyup", u.f._updated);
	u.e.addEvent(field._input_city, "change", u.f._changed);

	// submit on enter (checks for autocomplete etc)
	u.f.inputOnEnter(field._input);
	u.f.inputOnEnter(field._input_city);

	// activate input
	u.f.activateInput(field._input);
	u.f.activateInput(field._input_city);

	// validate field now
	u.f.validate(field._input);
	u.f.validate(field._input_city);

}


// custom initializations
Util.Form.customInit["cpr"] = function(form, field) {

	field._input = u.qs("input.cpr1", field);

	// jump to next field when length is 6
	field._input.updated = function() {
		if(this.val().length == 6) {
			this.field._input_cpr2.focus();
		}
	}

	field._input_cpr2 = u.qs("input.cpr2", field);

	field._input.autocomplete = "Off";
	field._input_cpr2.autocomplete = "Off";

	field._input.field = field;
	field._input_cpr2.field = field;

	// add input to fields array
	form.fields[field._input.name] = field._input;
	form.fields[field._input_cpr2.name] = field._input_cpr2;

	// get input label (only label for first input)
	field._input._label = u.qs("label[for="+field._input.id+"]", field);

	// get/set value function
	field._input.val = u.f._value;
	field._input_cpr2.val = u.f._value;

	// change/update events
	u.e.addEvent(field._input, "keyup", u.f._updated);
	u.e.addEvent(field._input, "change", u.f._changed);
	u.e.addEvent(field._input_cpr2, "keyup", u.f._updated);
	u.e.addEvent(field._input_cpr2, "change", u.f._changed);

	// submit on enter (checks for autocomplete etc)
	u.f.inputOnEnter(field._input);
	u.f.inputOnEnter(field._input_cpr2);

	// activate input
	u.f.activateInput(field._input);
	u.f.activateInput(field._input_cpr2);

	// validate field now
	u.f.validate(field._input);
	u.f.validate(field._input_cpr2);
}


// custom validations
Util.Form.customValidate["postalcity"] = function(iN) {

	if(u.hc(iN, "postal")) {

		// min and max length
		min = 1000;
		max = 9999;

		if(
			!isNaN(iN.val()) && 
			iN.val() >= min && 
			iN.val() <= max
		) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}

	}

	if(u.hc(iN, "city")) {

		// min and max length
		min = 1;
		max = 255;

		if(
			iN.val().length >= min &&
			iN.val().length <= max
		) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}

	}

}




// custom validations
Util.Form.customValidate["cpr"] = function(iN) {

	if(u.hc(iN, "cpr1")) {

		// min and max length
		min = 10101;
		max = 311299;

		if(
			!isNaN(iN.val()) && 
			iN.val() >= min && 
			iN.val() <= max
		) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}

	}

	if(u.hc(iN, "cpr2")) {

		// min and max length
		min = 0;
		max = 9999;

		if(
			!isNaN(iN.val()) && 
			iN.val() >= min && 
			iN.val() <= max
		) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}

	}

}
