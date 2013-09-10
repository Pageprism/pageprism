<div id="container admin">
<h1>Auth:</h1>
<?php echo form_open('admin/auth');?>
<p>User: <?php echo form_input('user');?></p>
<p>Pass: <?php echo form_password('password');?></p>
<?php echo form_hidden('posted', 'true');?>

<?php echo form_submit('login', 'Login');?>
<p><b style="color:red"><?php if (isset($error)) echo $error;?></b></p>
</div>