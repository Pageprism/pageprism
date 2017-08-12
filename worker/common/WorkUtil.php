<?php

/**
 * Created by IntelliJ IDEA.
 * User: kavan
 * Date: 5.1.2017
 * Time: 16:25
 */
class WorkUtil
{

    public function work_log($msg, $log_file)
    {
        if (!empty($log_file)) {
            $file = $log_file;
            // Open the file to get existing content
            $current = file_get_contents($file);
            // Append a new person to the file
            $current .= "\n" . $msg;
            // Write the contents back to the file
            file_put_contents($file, $current);
            return true;
        }
        return false;
    }

    public function startsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }

    public function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }

    public function logDate($short = true)
    {
        if($short){
            return "[ " . date('H:i:s') . " ]";
        }
        return "[ " . date('Y-m-d H:i:s') . " ]";
    }

    public function rowToTask($row)
    {
        $task = new stdClass();
        $task->id = $row["id"];;
        $task->type = $row["type"];
        $task->doc_id = $row["doc_id"];
        $task->created = $row["created"];
        $task->status = $row["status"];
        $task->level = $row["level"];
        $task->staterd = $row["started"];
        $task->ended = $row["ended"];
        return $task;
    }

}