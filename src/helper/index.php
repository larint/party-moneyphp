<?php
function redirect($url) {
    header("Location: $url");
    die();
}

function writeF($name, $txt) {
    $file = fopen($name, "w") or die("Unable to open file!");
    fwrite($file, $txt);
    fclose($file);
}

function resJson($data) {
    header("Content-Type: application/json");
    echo json_encode($data);
    exit();
}