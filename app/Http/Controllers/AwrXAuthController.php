<?php

namespace App\Http\Controllers;

use App\Services\AwrAppManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\TokenRepository;
use App\Exchange;
use Illuminate\Support\Facades\Hash;
use League\OAuth2\Server\ResourceServer;
use Illuminate\Contracts\Encryption\Encrypter;
use Carbon\Carbon;
use App\Traits\UserCredentialExchange;
use App\Traits\CTRUtils;
use App\User;
use App\Jobs\ResetPasswordEmail;
use Symfony\Bridge\PsrHttpMessage\Factory\DiactorosFactory;
use App\Services\RoleHelper;


class AwrXAuthController extends Controller
{
    use UserCredentialExchange, CTRUtils;
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

    /**
     * The encrypter implementation.
     *
     * @var \Illuminate\Contracts\Encryption\Encrypter
     */
    protected $encrypter;

    /**
     * @var RoleHelper
     */
    protected $roleHelper;

    /**
     * @var AwrAppManager
     */
    protected $appManager;

    /**
     * AwrXAuthController constructor.
     * @param ResourceServer $server
     * @param TokenRepository $tokenRepository
     * @param ClientRepository $clientRepository
     * @param Encrypter $encrypter
     * @param RoleHelper $roleHelper
     * @param AwrAppManager $appManager
     */
    public function __construct(ResourceServer $server, TokenRepository $tokenRepository,
                                ClientRepository $clientRepository, Encrypter $encrypter,
                                RoleHelper $roleHelper, AwrAppManager $appManager)
    {
        $this->server = $server;
        $this->tokenRepository = $tokenRepository;
        $this->clientRepository = $clientRepository;
        $this->encrypter = $encrypter;
        $this->roleHelper = $roleHelper;
        $this->appManager = $appManager;
    }

    /**
     * Delete < revoke > the given access token
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $token = $this->tokenRepository->findForUser(
            $user->token()->id, $request->user()->getKey()
        );
        if (!is_null($token)) {
            $token->revoke();
        }
        return response()->json(['message' => 'Access token revoked'], 200);
    }

    /**
     * Get all of the access tokens for the authenticated user.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function forUser(Request $request)
    {
        $tokens = $this->tokenRepository->forUser($request->user()->getKey());
        $res = $tokens->filter(function ($token) {
            $token->client;
            return $token->revoked === false;
        })->values();
        return response()->json($res, 200);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changeEmail(Request $request)
    {
        $user = $request->user();
        $user->makeVisible('password');
        $data = $request->all();
        $currentPassOk = !empty($data['password']) ? Hash::check($data['password'], $user->password) : false;
        $emailValid = !empty($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL);

        if ($emailValid && $currentPassOk) {
            $user['email'] = $data['email'];
            $user->save();
            return response()->json(['message' => 'email changed successfully'], 200);
        }
        return response()->json(['forbidden' => 'not allowed!', 'email_valid' => $emailValid, 'current_password_accepted' => $currentPassOk], 403);
    }

    /**
     * @param Request $request
     * @param $key
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function confirmEmail(Request $request, $key)
    {
        $res = static::confirmUserEmail($key);
        $res['next'] = $this->getNextLinks();
        $context = $this->appManager->makeApp('home');
        $context->config['message'] = $res['message'];
        $context->config['notFound'] = $res['notFound'];
        $context->config['next'] = $res['next'];

        return view('email_confirm', $context->config);
    }

    /**
     * Cancel a password reset link
     *
     * @param Request $request
     * @param $key
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function cancelPasswordReset(Request $request, $key)
    {
        $cancelOk = $this->cancelPasswordResetKey($key);
        $message = $cancelOk ? 'The password reset link canceled' : 'Bad password reset link or the link is already expired!';
        $context = $this->appManager->makeApp('home');
        $context->config['message'] = $message;
        $context->config['cancelOk'] = $cancelOk;
        $context->config['next'] = $this->getNextLinks();

        return view('cancel_password_reset', $context->config);
    }

    /**
     * Check the reset link is valid
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPasswordResetKey(Request $request)
    {
        $data = $request->all();
        $resetKeyOk = $this->passwordResetKeyOk($data['key']);
        if ($resetKeyOk) {
            return response()->json(['message' => 'password reset key is valid.'], 200);
        }
        return response()->json(['notFound' => 'password reset key is expired or not found',
            'reset_key_accepted' => false], 404);
    }

    /**
     * Send new password reset link via email
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function passwordResetLink(Request $request)
    {
        $data = $request->all();
        $emailValid = User::where('email', $data['email'])->count() > 0;
        if ($emailValid) {
            $user = User::where('email', $data['email'])->first();
            $this->sendPasswordResetLink($user);
            return response()->json(['message' => 'Password reset link sent successfully'], 200);
        }
        return response()->json(['notFound' => 'No account associated with the email',
            'email_found' => $emailValid], 404);
    }

    /**
     * Handle the password reset process
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function passwordReset(Request $request)
    {

        $data = $request->all();
        $resetKeyOk = $this->passwordResetKeyOk($data['key']);
        $handleOk = false;
        if ($this->passwordChangeParamsOk($data) && $resetKeyOk) {
            $handleOk = $this->handlePasswordResetKey($data['key']);
        }

        if ($this->passwordChangeParamsOk($data) && $resetKeyOk && $handleOk) {
            $user = $this->getPasswordResetUser($data['key']);
            $user['password'] = Hash::make($data['new_password']);
            $user->save();
            return response()->json(['message' => 'password changed successfully'], 200);
        }
        return response()->json(['forbidden' => 'not allowed!',
            'reset_key_accepted' => $resetKeyOk,
            'reset_key_handle_ok' => $handleOk,
            'new_password_accepted' => $this->passwordChangeParamsOk($data)], 403);
    }

    /**
     * Change user password by requiring current password
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();
        $user->makeVisible('password');
        $data = $request->all();
        $currentOk = !empty($data['current_password']) ? Hash::check($data['current_password'], $user->password) : false;
        if ($this->passwordChangeParamsOk($data) && $currentOk) {
            $user['password'] = Hash::make($data['new_password']);
            $user->save();
            return response()->json(['message' => 'password changed successfully'], 200);
        }
        return response()->json(['forbidden' => 'not allowed!', 'current_password_accepted' => $currentOk], 403);
    }

    /**
     * Check whether an email address is already associated with an account
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function emailAvailable(Request $request)
    {
        $data = $request->all();
        $existingEmail = User::where('email', $data['email'])->count();
        if ($existingEmail < 1) {
            return response()->json(['message' => 'the email address is not taken and can be used with new account'],
                200);
        }
        return response()->json(['forbidden' => 'The email address is already taken by another user'], 403);
    }

    /**
     * Check if the user's password is correct
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPassword(Request $request)
    {
        $user = $request->user();
        $user->makeVisible('password');
        $data = $request->all();
        $currentOk = !empty($data['password']) ? Hash::check($data['password'], $user->password) : false;
        if ($currentOk) {
            return response()->json(['message' => 'password accepted'], 200);
        }
        return response()->json(['forbidden' => 'not accepted'], 403);
    }


    /**
     * Get the user authenticated by the access token.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function tokenUser(Request $request)
    {
        $user = $request->user();
        $user->roles = $this->roleHelper->convertUserRoles($user);
        $user->setupMainSeries();
        $user->is_email_confirmed = $this->isEmailConfirmed($user);
        return response()->json($user, 200);
    }

    /**
     * Token exchange allows enables safe redirects after
     * successful authentication. The client which requested
     * the authentication will receive the encrypted exchange
     * key from the authenticator client as an URL attribute.
     * Client can then use this exchange key (max 1 time)
     * by requesting the actual issued access_token. The exchange keys are
     * created after each successful issueToken call in the middleware.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function tokenExchange(Request $request)
    {
        $key = $request['key'];
        $exchange = Exchange::where('type', 'access_token')->where('key', $key)->validKey()->first();
//      $exchange = Exchange::where('type', 'access_token')->where('key', $key)->first();
        if (!empty($exchange)) {
            $exchange->used = 1;
            $exchange->save();
            return response()->json([
                'token_type' => 'Bearer',
                'access_token' => $exchange->value
            ], 200);
        }
        return response()->json(['forbidden' => 'Bad exchange key'], 403);
    }

    /**
     * Only apps which belong to Awr admin app group
     * are allowed to generate new token exchanges
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function makeExchange(Request $request)
    {
        $groupKey = $request['app_group'];
        $isAdminApp = Hash::check(env('AWR_ADMIN_APP_GROUP', 'default'), $groupKey);
        $token = $request->header('authorization');
        $tokenParts = explode('Bearer ', $token);
        if (!$isAdminApp) {
            return response()->json(['forbidden' => 'Action is not allowed for this app'], 403);
        }
        $exchange = factory(Exchange::class, 1)->create([
            'type' => 'access_token',
            'value' => count($tokenParts) > 1 ? $tokenParts[1] : $token
        ])->first();
        return response()->json(['key' => $exchange->key, 'expires' => empty($exchange->expires) ? 'never' : $exchange->expires], 201);
    }

    private function getNextLinks()
    {
        $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $hash = '';
        if (is_string($server_root) && strrpos($server_root, 'localhost') !== false) {
            $hash = '#';
        }
        return [
            0 => (object)[
                'name' => 'Awiar Profile',
                'href' => $server_root . '/profile/' . $hash . 'welcome',
                'icon_img' => $server_root . '/assets/img/icons/profile_icon.png?v=33',
            ],
            1 => (object)[
                'name' => 'Awiar Read',
                'href' => $server_root . '/read/' . $hash . 'index/everything?v=all&it_type=none&it_next=none&it=none',
                'icon_img' => $server_root . '/assets/img/icons/read_icon.png',
            ]
        ];
    }

    private function passwordChangeParamsOk($data)
    {
        return !empty($data['new_password']) &&
            !empty($data['password_confirm']) && $data['new_password'] === $data['password_confirm'];
    }

    private function sendPasswordResetLink($user)
    {
        $server_root = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $exchange = new Exchange();
        $exchange->fill([
            'key' => uniqid($user->id . '_'),
            'value' => $user->email,
            'type' => 'password_reset'
        ]);
        $exchange->save();
        $key = CTRUtils::encodeItemShareId($exchange->key, $user->id);
        $hash = '';
        if (is_string($server_root) && strrpos($server_root, 'localhost') !== false) {
            $hash = '#';
        }
        $link = $server_root . '/insider/' . $hash . 'resets/password/' . $key;
        $cancel_link = $server_root . '/cancel/r/p/' . $key;
        $this->dispatch(new ResetPasswordEmail($user, [
            'link' => $link,
            'cancel_link' => $cancel_link,
            'server_root' => $server_root
        ]));
    }
}

