<?php include_once($_SERVER["LOCAL_PATH"]."/includes/segment.php") ?>
<?php include_once($_SERVER["LOCAL_PATH"]."/includes/functions.inc.php") ?>
<?

$name            = getPost("name");
$address1        = getPost("address1");
$address2        = getPost("address2");
$postal          = getPost("postal");
$city            = getPost("city");
$municipality    = getPost("municipality");
$cpr_1           = getPost("cpr_1");
$cpr_2           = getPost("cpr_2");

$date_data       = getPost("date_data");
$signature_data  = getPost("signature_data");

?>
<!DOCTYPE html>
<html lang="DA">
<head>
	<title>Vælgererklæring</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<meta name="keywords" content="Vælgererklæring parti valg folketinget demokrati" />
	<meta name="description" content="Støt demokratiet ved at hjælpe nye partier med at stille op til folketingsvalget. Skriv under online." />
	<meta name="viewport" content="initial-scale=1, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<link type="text/css" rel="stylesheet" media="all" href="/css/seg_<?= $_SESSION["segment"] ?>.css" />
	<script type="text/javascript" src="/js/seg_<?= $_SESSION["segment"] ?>.js"></script>
</head>

<body class="declaration">

<div id="page" class="i:page">
	<div id="header">
		<ul class="servicenavigation">
			<li class="keynav navigation nofollow"><a href="#navigation">To navigation</a></li>
		</ul>
	</div>

	<div id="content">

		<div class="scene dataform i:dataform">

			<h1>Vælgererklæring</h1>
			<p>Hjælp Alternativet med at blive opstillingsberettiget til næste folketingsvalg!<br />Udfyld vælgererklæringen og underskriv med musen eller på touch screen.<br />Vi sender erklæringen videre ind til folkeregisteret i din kommune.</p>	<p>Indtast dine personlige oplysninger i formularen herunder:</p>

			<form name="declaration" action="/vaelgererklaering/signature" method="post">
				<input type="hidden" name="date_data" id="date_data" value="<?= $date_data ?>" />
				<input type="hidden" name="signature_data" id="signature_data" value="<?= $signature_data ?>" />
		
				<fieldset>

					<div class="field string required">
						<label for="name">Navn</label>
						<input type="text" name="name" id="name" value="<?= $name ?>" />
					</div>

					<div class="field string required">
						<label for="address1">Adresse 1</label>
						<input type="text" name="address1" id="address1" value="<?= $address1 ?>" />
					</div>

					<div class="field string">
						<label for="address2">Adresse 2</label>
						<input type="text" name="address2" id="address2" value="<?= $address2 ?>" />
					</div>

					<div class="field postalcity required">
						<label for="postal">Postnr. og by</label>
						<input type="tel" name="postal" class="postal" id="postal" value="<?= $postal ?>" />
						<input type="text" name="city" class="city" value="<?= $city ?>" />
					</div>

					<div class="field string required">
						<label for="municipality">Kommune</label>
						<input type="text" name="municipality" id="municipality" value="<?= $municipality ?>" />
					</div>

					<div class="field cpr required">
						<label for="cpr">CPR</label>
						<input type="tel" name="cpr_1" value="<?= $cpr_1 ?>" id="cpr" class="cpr1" /><span>-</span><input type="tel" name="cpr_2" value="<?= $cpr_2 ?>" class="cpr2" />
					</div>

				</fieldset>

				<ul class="actions">
					<li><input type="submit" value="Fortsæt"></li>
				</ul>
			</form>

		</div>


	</div>

	<div id="footer">

		<div class="about">
			<ul class="contacts">
				<li class="contact" itemscope itemtype="http://schema.org/Organization">
					<h4>Kontakt os</h4>
					<div class="address" itemscope itemtype="http://schema.org/PostalAddress">
						<h5 itemprop="name">ALTERNATIVET</h5>
						<p itemprop="streetAddress">Under Elmene 9</p>
						<p><span itemprop="postalCode">2300 </span><span itemprop="addressLocality">København S</span></p>
					</div>
					<p><a itemprop="email" href="#">alternativet@alternativet.dk</a></p>
					<p itemprop="telephone">+45 5191 1133</p>
				</li>
			</ul>
		</div>
	</div>

</div>

</body>
</html>
