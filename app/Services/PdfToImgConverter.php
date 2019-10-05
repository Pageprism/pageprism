<?php
/**
 * Author: Kavan Soleimanbeigi
 * Date: 6/8/18
 * Time: 7:07 PM
 */

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class PdfToImgConverter
{

    /**
     * @param $pdfFile
     * @param $outputDir
     * @param $firstPage
     * @param $lastPage
     * @param array $resolutions
     * @return array
     */
    public function makePagesByRange(
        $pdfFile, $outputDir, $firstPage,
        $lastPage, $resolutions = [300]
    )
    {
        if (!(file_exists($pdfFile) || file_exists($outputDir))) {
            return [];
        }
        $maxRes = array_shift($resolutions);
        $largeFileDir = "$outputDir/pages/$maxRes";

        if (!(is_dir($largeFileDir) || is_file($largeFileDir))) {
            try{
                mkdir($largeFileDir, 0777, true);
            }catch(\Exception $e){

            }
        }

        set_time_limit(300);

        $commandLine = sprintf(
            "gs -sDEVICE=png16m -sOutputFile=%s" .
            " -dTextAlphaBits=2 -dGraphicsAlphaBits=2" .
            " -dFirstPage=%s -dLastPage=%s" .
            " -r%d -dBATCH -dNOPAUSE %s",
            escapeshellarg("$largeFileDir/grp-${firstPage}-${lastPage}-p%d.png"),
            $firstPage, $lastPage,
            (int)$maxRes,
            escapeshellarg($pdfFile)
        );
        $output = $return_var = false;

        exec($commandLine, $output, $return_var);

        if ($return_var !== 0) {
            return [];
        }

        $srcPages = glob($largeFileDir . '/*.png');
        $pageFiles = array($maxRes => array());
        foreach ($srcPages as $path) {
            $file = basename($path, '.png');
            $parts = explode('-', $file);
            if (!(Str::startsWith($file, "grp-${firstPage}-${lastPage}") && count($parts) === 4)) {
                continue;
            }
            $lastPart = end($parts);
            $pageNr = intval(substr($lastPart, 1)) + ($firstPage - 1);

            if ($pageNr >= $firstPage && $pageNr <= $lastPage) {
                $newPath = "${largeFileDir}/p${pageNr}.png";
                if (is_file($newPath)) {
                    unlink($newPath);
                }
                rename($path, $newPath);
                $pageFiles[$maxRes][$pageNr] = $newPath;
            }
        }

        foreach ($resolutions as $resolution) {
            $factor = (int)$resolution / $maxRes * 100;
            $dir = "$outputDir/pages/$resolution";
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
            foreach ($pageFiles[$maxRes] as $pageNr => $src) {
                if (!($pageNr >= $firstPage && $pageNr <= $lastPage)) {
                    continue;
                }
                set_time_limit(30);
                $dest = "$dir/" . basename($src);
                $this->makeThumbnail($src, $dest, $factor . '%');
                $pageFiles[$resolution][$pageNr] = $dest;
            }
        }

        return $pageFiles;
    }


    /**
     * @param $pdfFile
     * @param $outputDir
     * @param array $resolutions
     * @return array
     */
    public function makePages($pdfFile, $outputDir, $resolutions = [300])
    {
        //absolute path should come in
        if (!(file_exists($pdfFile) || file_exists($outputDir))) {
            return [];
        }
        $maxRes = array_shift($resolutions);
        $largeFileDir = "$outputDir/pages/$maxRes";
        if (file_exists($largeFileDir)) {
            $this->rmdirRecursive($largeFileDir);
        }

        mkdir($largeFileDir, 0777, true);

        set_time_limit(300);

        $commandLine = sprintf(
            "gs -sDEVICE=png16m -sOutputFile=%s" .
            " -dTextAlphaBits=2 -dGraphicsAlphaBits=2" .
            " -r%d -dBATCH -dNOPAUSE %s",
            escapeshellarg($largeFileDir . '/p%d.png'),
            (int)$maxRes,
            escapeshellarg($pdfFile)
        );

        $output = $return_var = false;

        exec($commandLine, $output, $return_var);

        if ($return_var !== 0) {
            return [];
        }

        $srcPages = glob($largeFileDir . '/*.png');
        $pageFiles = array($maxRes => array());
        foreach ($srcPages as $path) {
            $file = basename($path, '.png');
            $pageNr = substr($file, 1);

            $pageFiles[$maxRes][$pageNr] = $path;
        }

        foreach ($resolutions as $resolution) {
            $factor = (int)$resolution / $maxRes * 100;
            $dir = "$outputDir/pages/$resolution";
            if (file_exists($dir)) {
                $this->rmdirRecursive($dir);
            }

            mkdir($dir, 0777, true);

            foreach ($pageFiles[$maxRes] as $pageNr => $src) {
                set_time_limit(30);
                $dest = "$dir/" . basename($src);
                $this->makeThumbnail($src, $dest, $factor . '%');
                $pageFiles[$resolution][$pageNr] = $dest;
            }
        }

        return $pageFiles;
    }

    /**
     * @param $src
     * @param $dest
     * @param $size
     * @return bool
     */
    public function makeThumbnail($src, $dest, $size)
    {
        $commandLine = sprintf("convert %s -background white -alpha remove -resize %s %s",
            escapeshellarg($src), $size, escapeshellarg($dest)
        );

        $output = $return_var = false;
        exec($commandLine, $output, $return_var);

        return $return_var === 0;
    }

    private function rmdirRecursive($dir)
    {
        if (!is_dir($dir)) {
            return;
        }
        foreach (scandir($dir) as $file) {
            if ('.' === $file || '..' === $file) {
                continue;
            }
            if (is_dir("$dir/$file")) {
                $this->rmdirRecursive("$dir/$file");
            } else {
                unlink("$dir/$file");
            }
        }
        rmdir($dir);
    }
}