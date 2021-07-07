<?php
// This script is used as CORS proxy for the new full-automatic scraper

// This key must be kept secret, to avoid that someone can use our server to flood other servers with requests,
// and in general make request using our ip address.
// Consider regenerating it and moving it to a .env file before making the project public.
const KEY = "ENexnG5uYYU23429w8ftGSe7vC6T2Seq";

const PROXIES_LISTS = [
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt'
];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if (!isset($_GET['key']) || strcmp(KEY, $_GET['key']) !== 0) {
    http_response_code(401);
    die('Unauthorized');
}

// if the proxies list doesn't exist, or is older than 5 minutes, reload it
if (true || !file_exists('last-update.txt') || !file_exists('proxies.txt') || intval(file_get_contents('last-update.txt')) < (time() - 300)) {
    $proxies = '';
    foreach (PROXIES_LISTS AS $proxyList) {
        $proxies .= @file_get_contents($proxyList) . PHP_EOL;
    }
    file_put_contents('proxies.txt', $proxies);
    file_put_contents('last-update.txt', time());
}

$proxies = explode(PHP_EOL, trim(file_get_contents('proxies.txt')));

$url = $_GET['url'] ?? '';
$proxy = $_GET['proxy'] ?? null;

while (true) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_PROXY, "socks4://" . $proxies[array_rand($proxies)]);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (!curl_errno($ch)) {
        break;
    }

    curl_close($ch);
}


http_response_code($httpCode);
echo $result;
