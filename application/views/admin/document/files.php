<fieldset>
  <legend>Files</legend>
	<p><span class="label">PDF File: </span><?php echo form_upload('pdffile');?></p>
  <p><span class="label">PDF Rendering Accuracy: </span><?php echo form_dropdown('pdf_resolution_dpi', array(
    //'120' => 'Fast (120)', 
    '300' => 'Normal (300)', 
    '600' => 'Double (600)', 
    '900' => 'Huge (900)', 
  ), '300');?></p>
	<p><span class="label">ePub File: </span><?php echo form_upload('epubfile');?></p>
	<p><span class="label">MP3 File or MP3 Zip File: </span><?php echo form_upload('audiozipfile');?></p>
<fieldset>
