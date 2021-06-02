<?php
/* Developer    Cristian Livella
 * Website      https://cristianlivella.com
 * Project      PALEObooks
 * Repository   https://github.com/itispaleocapa/paleobooks
 *
 * This script is part of the PALEObooks scraping tool.
*/

$ignoreSslErrors = false;

function getJson($url, $attempt = 1) {
    global $ignoreSslErrors;
    sleep(rand(1, 3));
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, !$ignoreSslErrors);

    $result = curl_exec($ch);

    if (curl_errno($ch) || curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200 || json_decode($result) === null) {
        logMessage('API request failed, attempt ' . (($attempt - 1) % 3 + 1) . ' of 3.');
        if (curl_errno($ch) === 60) {
            askCertificateCheck();
        }
        if ($attempt % 3 === 0) {
            $retry = askNewIp($attempt > 3);
            if (!$retry) {
                return null;
            }
            logMessage('Retrying...');
        }
        sleep(5);
        return getJson($url, $attempt + 1);
    }

    curl_close($ch);

    return json_decode($result, true);
}

function logMessage($message, $newLine = true) {
    echo date('H:i:s') . ' | ' . $message . ($newLine ? PHP_EOL : '');
}

function askNewIp($suggestSkip = false) {
    logMessage('Maybe it\'s time to get a new IP address! Reboot your router or change your VPN server and press enter.', $suggestSkip);
    if ($suggestSkip) {
        logMessage('If instead you want to skip this request type "s" or "skip" and press enter: ', false);
    }
    $command = trim(strtolower(readline()));
    if ($command === 's' || $command === 'skip') {
        return false;
    }
    return true;
}

function askCertificateCheck() {
    global $ignoreSslErrors;
    logMessage('There seems to be an issue with the SSL certificate of '. ALS_HOST . '. Please check that it is valid, and press enter to continue anyway.', false);
    readline();
    $ignoreSslErrors = true;
}
