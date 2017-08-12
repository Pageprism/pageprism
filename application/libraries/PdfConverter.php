<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class PdfConverter
{
    public function __construct()
    {

    }

    public function startNewTask()
    {
//        ($pdfFile, $outputDir, $resolutions)
//        $this->pdfFile = $pdfFile;
//        $this->outputDir = $outputDir;
//        $this->resolutions = $resolutions;
        log_message('debug', 'already here ');
        $pdfFile = "/home/kavan/content/2017/01/04/DOC_84/Tuovinen_objector.pdf";
        $outputDir = "/home/kavan/content/2017/01/04/DOC_84";
        $resolutions = 120;
        $cmd = "/usr/bin/php /var/www/html/worker/index.php $pdfFile $outputDir $resolutions";
        log_message('debug', '$cmd'. $cmd);
        exec($cmd . " > /home/kavan/work/works.log &");
        log_message('debug', 'wow');

    }
}
