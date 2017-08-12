<script type="application/javascript">
    /**
     * NOTE: This file is intentionally kept empty and works as a default/root trigger to start SPA logic.
     *
     * Theoretically doing anything before the start of the app would be possible here, but not
     * recommended strongly.Note that SPA will override many of the client side variables
     * used by client app. So don't try to manipulate app's main variables here. If you want to provide some
     * default values for any app variable make sure that the appStart logic, under UI module,
     * also knows about your default value settings.
     *
     * The app global variable is defined to be window.pageshare = {};
     *
     * For example:
     *  Currently logged in user: it can be found under window.pageshare.currentUser, and the SPA will automatically
     *  check with server and set the correct value on the start
     *
     *  Currently open document: same as above and under pageshare.currentDoc
     *  Current collection: same as above and under pageshare.currentCollection
     *
     *  Fresh data also always and easily available through API:
     *
     *  All currently available collections: a fresh list always available by using
     *  pageshare.docServer.findAllCollections, similarly all docs for a certain collection can fetched using
     *  docServer.findAllDocsByCollection
     *
     * For all this reasons above and dozens more not mentioned here, do not please bring any unnecessary
     * server side rendered / computed variables and values here or anywhere else in SPA.
     * Any thing new needs designing of a proper API for the SPA by following the convection and structures
     * implemented so far.
     */
</script>