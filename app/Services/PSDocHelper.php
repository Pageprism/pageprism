<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use App\File;

class PSDocHelper
{

    public function makeSubSets($pdfFileId, $chunkSize = 50)
    {
        $maxPages = $this->getPageCount(
            Storage::path(File::find($pdfFileId)->path)
        );
        return $this->makeRangeSet(
            1,
            $maxPages,
            $chunkSize
        );
    }

    public function makeRangeSet($start, $end, $chunkSize)
    {
        $max = ($end - $start);
        if ($max <= $chunkSize) {
            return [
                [
                    'start' => $start,
                    'end' => $max
                ]
            ];
        }
        $rounds = intval(floor($max / $chunkSize));
        $remains = intval($max % $chunkSize);
        $set = [];
        $pointer = $start;
        $head = $start + ($chunkSize - 1);
        for ($i = 0; $i < $rounds; $i++) {
            $set[] = [
                'start' => $pointer,
                'end' => $head
            ];
            $pointer = $head + 1;
            $head += $chunkSize;
        }
        if ($remains > 0) {
            $set[] = [
                'start' => $pointer,
                'end' => min([$head + $remains, $end])
            ];
        }
        return $set;
    }

    public function getPageCount($pdfFilePath)
    {
        $commandLine = sprintf(
            "gs -q -dNODISPLAY -c \"(%s) (r) file runpdfbegin pdfpagecount = quit\" -f %s",
            $pdfFilePath,
            $pdfFilePath
        );

        $output = $return_var = false;

        exec($commandLine, $output, $return_var);
        return intval($output[0]);
    }

}