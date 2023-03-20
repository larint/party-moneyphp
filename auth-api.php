<?php
require __DIR__.'/src/helper/index.php';
require __DIR__.'/ggapi.php';
require __DIR__.'/src/config.php';

$ggapi = new GGAPI;

$authCode = $_GET['code'];

$ggapi->saveToken($authCode);

redirect($urlsite);