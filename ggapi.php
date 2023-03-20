<?php
require __DIR__.'/vendor/autoload.php';

class GGAPI {

    public $client;
    public $tokenPath = 'token.json';
    function  __construct() {
        $this->client = new \Google_Client();
        $this->client->setApplicationName('Google Sheets API PHP Quickstart');
        $this->client->setScopes(Google_Service_Sheets::SPREADSHEETS);
        $this->client->setAuthConfig('credentials.json');
        $this->client->setAccessType('offline');
    }

    function getGooogleClient()
    {
        $this->tokenPath = 'token.json';
        if (file_exists($this->tokenPath)) {
            try {
                $accessToken = json_decode(file_get_contents($this->tokenPath), true);
                $this->client->setAccessToken($accessToken);
            } catch (Exception $e) {
                $authUrl = $this->client->createAuthUrl();
                redirect($authUrl);
            }
        }
 
        if ($this->client->isAccessTokenExpired()) {
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            } else {
                $authUrl = $this->client->createAuthUrl();
                redirect($authUrl);
            }
        }
        return $this->client;
    }

    function saveToken($authCode) {
        // Exchange authorization code for an access token.
        $accessToken = $this->client->fetchAccessTokenWithAuthCode($authCode);
        $this->client->setAccessToken($accessToken);

        writeF($this->tokenPath, json_encode($this->client->getAccessToken()));
    }
 
}
