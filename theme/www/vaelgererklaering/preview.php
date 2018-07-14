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
		<div class="scene preview i:preview">

			<h1>Vælgererklæring</h1>

			<div id="vcard-alternativet" class="vcard" itemscope itemtype="http://schema.org/Organization">	<div class="name fn org" itemprop="name">Alternativet</div>	<div class="adr" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">		<div class="po-box" itemprop="postOfficeBoxNumber">Under Elmene 9</div>		<div class="postallocality"><span class="postal-code" itemprop="postalCode">2300</span> <span class="locality" itemprop="addressLocality">København S</span></div>	</div>	<div class="url" itemprop="url">www.alternativet.dk</div>	<div class="email" itemprop="email"><a href="mailto:alternativet@alternativet.dk">alternativet@alternativet.dk</a></div>	<div class="telephone" itemprop="telephone">(+45) 5191 1133</div></div>
			<div class="signatureform">
				<div class="name"><?= $name ?></div>
				<div class="address1"><?= $address1 ?></div>
				<div class="address2"><?= $address2 ?></div>
				<div class="postal"><span><?= implode("</span><span>", str_split($postal)) ?></span></div>
				<div class="city"><?= $city ?></div>
				<div class="municipality"><?= $municipality ?></div>
				<div class="cpr_1"><span><?= implode("</span><span>", str_split($cpr_1)) ?></span></div>
				<div class="cpr_2"><span><?= implode("</span><span>", str_split($cpr_2)) ?></span></div>

				<div class="date_data" id="date_data"><?= $date_data ?></div>
				<div class="signature_data" id="signature_data"><?= $signature_data ?></div>
			</div>

			<form name="approve" action="/vaelgererklaering/receipt" method="post">
				<input type="hidden" id="approved" name="approved" value="1" />

				<ul class="actions">
					<li class="preview"><input type="submit" value="Send vælgererklæring"></li>
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
