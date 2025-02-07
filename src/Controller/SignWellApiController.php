<?php

namespace App\Controller;

use GuzzleHttp\Client;

class SignWellApiController
{

    private $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => $_ENV['BASE_URL'],
            'headers' => [
                'X-Api-Key' => $_ENV['API_KEY'],
                'Accept' => 'application/json',
            ],
        ]);
    }

    public function me()
    {
        $response = $this->client->get('me');
        return json_decode($response->getBody(), true);
    }

    public function createDocument($file_url, $signers)
    {
        $response = $this->client->post('documents', [
            'json' => [
                'file_url' => $file_url,
                'test_mode' => true,
                'signers' => $signers
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getDocuments()
    {
        $response = $this->client->get('documents');

        return json_decode($response->getBody(), true);
    }

    public function getDocument($document_id)
    {
        $response = $this->client->get('documents/' . $document_id);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function downloadDocument($document_id, $save_path)
    {
        $response = $this->client->get('documents/' . $document_id . '/download', [
            'sink' => $save_path
        ]);

        return $response->getBody()->getContents();
    }

    public function deleteDocument($document_id)
    {
        $response = $this->client->delete('documents/' . $document_id);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function createSigner($document_id, $signer)
    {
        $response = $this->client->post('documents/' . $document_id . '/signers', [
            'json' => $signer
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getSigner($document_id, $signer_id)
    {
        $response = $this->client->get('documents/' . $document_id . '/signers/' . $signer_id);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function deleteSigner($document_id, $signer_id)
    {
        $response = $this->client->delete('documents/' . $document_id . '/signers/' . $signer_id);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function createSignature($document_id, $signer_id, $signature)
    {
        $response = $this->client->post('documents/' . $document_id . '/signers/' . $signer_id . '/signature', [
            'json' => $signature
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getSignature($document_id, $signer_id)
    {
        $response = $this->client->get('documents/' . $document_id . '/signers/' . $signer_id . '/signature');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function deleteSignature($document_id, $signer_id)
    {
        $response = $this->client->delete('documents/' . $document_id . '/signers/' . $signer_id . '/signature');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function createInitials($document_id, $signer_id, $initials)
    {
        $response = $this->client->post('documents/' . $document_id . '/signers/' . $signer_id . '/initials', [
            'json' => $initials
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getInitials($document_id, $signer_id)
    {
        $response = $this->client->get('documents/' . $document_id . '/signers/' . $signer_id . '/initials');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function deleteInitials($document_id, $signer_id)
    {
        $response = $this->client->delete('documents/' . $document_id . '/signers/' . $signer_id . '/initials');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function createText($document_id, $signer_id, $text)
    {
        $response = $this->client->post('documents/' . $document_id . '/signers/' . $signer_id . '/text', [
            'json' => $text
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getText($document_id, $signer_id)
    {
        $response = $this->client->get('documents/' . $document_id . '/signers/' . $signer_id . '/text');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function deleteText($document_id, $signer_id)
    {
        $response = $this->client->delete('documents/' . $document_id . '/signers/' . $signer_id . '/text');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function createCheckbox($document_id, $signer_id, $checkbox)
    {
        $response = $this->client->post('documents/' . $document_id . '/signers/' . $signer_id . '/checkbox', [
            'json' => $checkbox
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function getCheckbox($document_id, $signer_id)
    {
        $response = $this->client->get('documents/' . $document_id . '/signers/' . $signer_id . '/checkbox');

        return json_decode($response->getBody()->getContents(), true);
    }

    public function deleteCheckbox($document_id, $signer_id)
    {
        $response = $this->client->delete('documents/' . $document_id . '/signers/' . $signer_id . '/checkbox');

        return json_decode($response->getBody()->getContents(), true);
    }
}
