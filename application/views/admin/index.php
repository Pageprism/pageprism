<!-- Container -->
<div class="container-fluid admin" id="the-container">
<h2>ADMIN AREA :: Logged in as <?php echo $this->session->userdata('user_name');?></h2>

<a href="/admin/document/upload/">Upload document</a> <br />
<a href="/admin/document/documentlist">Modify document</a> <br />
<a href="/admin/shelf/">Shelf</a> <br />
<a href="/admin/content">Edit content</a><br />
<a href="/admin/logout/">Logout</a>

</div>