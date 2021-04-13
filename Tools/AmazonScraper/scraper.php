<?php
/* Developer    Cristian Livella
 * Website      https://cristianlivella.com
 * Project      PALEObooks
 * Repository   https://github.com/itispaleocapa/paleobooks
 *
 * This script extract the list of classes and the list of books from the site adozionilibriscolastici.it.
 *
 * Due to the API rate limit, you'll need to change your public IP address several times
 * to complete the execution of the script. When prompted, change the IP address and press enter.
 * If you your provider offers you a dynamic IP, you need to reboot your router.
 * If you have a static IP address, you can use a VPN, such as ProtonVPN (free) or NordVPN (paid),
 * and change the server every time you need a new IP.
 *
 * Sections of the first two years of the branch 'SISTEMA MODA' are usually combined
 * with sections of another branch. In the school years 2019/2020 and 2020/2021 it was
 * 'INFORMATICA E TELECOMUNICAZIONI'. The section names were 1TI and 2TI.
 * If this changes, you would like to check end edit line 55.
 *
 * This script is meant to be run from the command line, not from a web server.
 * Tested and working on PHP 7.4.16.
 *
 * Output files:
 * - classi_diurno_[TIMESTAMP].json
 * - classi_serale_[TIMESTAMP].json
 * - libri_[TIMESTAMP].json
*/

require 'functions.php';
const SCHOOL_CODES = ['diurno' => 'BGTF010003', 'serale' => 'BGTF01050C'];

const ALS_HOST = 'https://www.adozionilibriscolastici.it/v1';

if (PHP_SAPI !== 'cli') {
    die('You need to run this script from the command line!');
}

$timestamp = dechex(time());
$globalBooks = [];

logMessage('Starting scraping!');

foreach (SCHOOL_CODES AS $course => $schoolCode) {
    $classes = getJson(ALS_HOST . '/classi/' . $schoolCode);
    if ($classes === null) {
        logMessage('Unable to get ' . $course . ' classes. Skipping it.');
        continue;
    }
    logMessage('Found ' . count($classes) . ' classes (' . $course . ').');

    $classes = array_map(function($class) use ($course) {
        $branch = substr($class['DESCOMB'], 0, 1);
        if ($branch == 'S') $branch = 'T';
        if ($class['DESCOMB'] == 'ENERGIA') $branch = 'M';
        if ($class['DESCOMB'] == 'SISTEMA MODA - BIENNIO COMUNE') $class['SEZION'] = 'I';
        if ($course === 'serale' && $class['CLASSE'] < 3) $branch = '';
        return [
            'id' => $class['CLID'],
            'name' => $class['CLASSE'] . $branch . $class['SEZION'] . ($course === 'serale' ? 'S' : ''),
            'books' => []
        ];
    }, $classes);

    usort($classes, function($a, $b) {
        return strcmp($a['name'], $b['name']);
    });

    foreach ($classes AS $index => $class) {
        logMessage($class['name'] . ': retrieving books list...');
        $books = getJson(ALS_HOST . '/libri/' . $class['id'] . '/' . $schoolCode);
        if ($books === null) {
            logMessage('Unable to get ' . $class['name'] . ' books list. Skipping it.');
            continue;
        }
        $classes[$index]['books'] = $books;
        foreach ($books AS $book) {
            $isbn = $book['ISBN'];
            if (!in_array($isbn, $globalBooks)) {
                $globalBooks[$isbn] = [];
            }
        }
        logMessage($class['name'] . ': ' . count($books) . ' books found!');
    }

    $outputArray = [];
    foreach ($classes AS $class) {
        $outputArray[$class['name']] = $class['books'];
    }
    file_put_contents('classi_' . $course . '_' . $timestamp . '.json', json_encode($outputArray));
}

logMessage('Found ' . count($globalBooks) . ' books in total, retrieving details...');

$booksChunks = array_chunk(array_keys($globalBooks), 4);
$chunksCount = count($booksChunks);

foreach ($booksChunks AS $index => $chunk) {
    logMessage('Retrieving chunk ' . ($index +1) . ' of ' . $chunksCount . '...');
    $chunkString = implode(',', $chunk);
    $books = getJson(ALS_HOST . '/lookup/' . $chunkString);
    if ($books === null) {
        logMessage('Unable to get books chunk ' . ($index + 1) . ' details. Skipping ' . $chunkString . '.');
        continue;
    }
    foreach ($books AS $index => $book) {
        $globalBooks[$chunk[$index]] = $book;
    }
}

file_put_contents('libri_' . $timestamp . '.json', json_encode($globalBooks));

logMessage('Script execution terminated!');