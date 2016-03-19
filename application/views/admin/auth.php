<div id="login">
  <h1>Authenticate</h1>
  <?php echo form_open('login?backUrl='.urlencode($backUrl));?>
  <p><label>Username:</label> <?php echo form_input('user');?></p>
  <p><label>Password:</label> <?php echo form_password('password');?></p>
  <?php echo form_hidden('posted', 'true');?>

  <?php echo form_submit('login', 'Login');?>
  <p><b style="color:red"><?php if (isset($error)) echo $error;?></b></p>
</div>
