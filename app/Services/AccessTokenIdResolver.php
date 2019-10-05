<?php

namespace App\Services;

use Laravel\Passport\ClientRepository;
use Laravel\Passport\TokenRepository;
use League\OAuth2\Server\ResourceServer;
use Illuminate\Http\Request;
use League\OAuth2\Server\Exception\OAuthServerException;
use Symfony\Bridge\PsrHttpMessage\Factory\DiactorosFactory;




class AccessTokenIdResolver
{

    /**
     * The resource server instance.
     *
     * @var \League\OAuth2\Server\ResourceServer
     */
    protected $server;

    /**
     * The token repository implementation.
     *
     * @var \Laravel\Passport\TokenRepository
     */
    protected $tokenRepository;

    /**
     * The token repository implementation.
     *
     * @var \Laravel\Passport\ClientRepository
     */
    protected $clientRepository;

    public function __construct(ResourceServer $server, TokenRepository $tokenRepository, ClientRepository $clientRepository)
    {
        $this->server = $server;
        $this->tokenRepository = $tokenRepository;
        $this->clientRepository = $clientRepository;
    }


    public function getAccessTokenId(Request $request){
        $user = $request->user();
        $psr = (new DiactorosFactory)->createRequest($request);
        $tokenId = null;
        if (empty($user)) {
            return null;
        }
        try {
            $psr = $this->server->validateAuthenticatedRequest($psr);
            $tokenId = $psr->getAttribute('oauth_access_token_id');
        } catch (OAuthServerException $e) {
            $tokenId = null;
        }
        return $tokenId;
    }
}