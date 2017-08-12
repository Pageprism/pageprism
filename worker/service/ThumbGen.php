<?php

class ThumbGen
{

    public function makePdfPages($pdfFile, $outputDir, $resolutions)
    {
        $maxRes = array_shift($resolutions);
//        $maxRes = 300;

        $largeFileDir = "$outputDir/pages-$maxRes";
//        if (file_exists($largeFileDir)) {
//            $old_dirname = $largeFileDir . "-" . (new DateTime())->getTimeStamp()."old";
//            rename($largeFileDir, $old_dirname);
//        }
        mkdir($largeFileDir, 0777, true);

        set_time_limit(300);
        $commandLine = sprintf("gs -sDEVICE=png16m -sOutputFile=%s -dTextAlphaBits=2 -dGraphicsAlphaBits=2 -r%d -dBATCH -dNOPAUSE %s",
            escapeshellarg($largeFileDir . '/p%d.png'),
            (int)$maxRes,
            escapeshellarg($pdfFile)
        );
        $output = $return_var = false;
        exec($commandLine, $output, $return_var);

        if ($return_var !== 0) return false;

        $srcPages = glob($largeFileDir . '/*.png');
        $pageFiles = array($maxRes => array());
        foreach ($srcPages as $path) {
            $file = basename($path, '.png');
            $pageNr = substr($file, 1);

            $pageFiles[$maxRes][$pageNr] = $path;
        }


        foreach ($resolutions as $resolution) {
            $factor = (int)$resolution / $maxRes * 100;
            $dir = "$outputDir/pages-$resolution";
//            if (file_exists($dir)) {
//                $old_dirname =$dir . "-" . (new DateTime())->getTimeStamp().".old";
//                rename($dir, $old_dirname);
//            }
            mkdir($dir, 0777, true);

            foreach ($pageFiles[$maxRes] as $pageNr => $src) {
                set_time_limit(30);
                $dest = "$dir/" . basename($src);
                $this->makeThumbnail($src, $dest, $factor . '%');
                $pageFiles[$resolution][$pageNr] = $dest;
//                log_message('debug', 'New file generated for resolution[' . $resolution . '] in '
//                    . $dest);
            }
        }

        return $pageFiles;
    }

    public function makeThumbnail($src, $dest, $size)
    {
        $commandLine = sprintf("convert %s -background white -alpha remove -resize %s %s",
            escapeshellarg($src), $size, escapeshellarg($dest)
        );

        $output = $return_var = false;
        exec($commandLine, $output, $return_var);

        return $return_var === 0;
    }

}
