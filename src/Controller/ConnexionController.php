<?php

use App\Database\UserDatabase;

require '../config/autoloader.php';



if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Appelle la méthode verifyPassword du UserDatabase pour vérifier les informations
    if (UserDatabase::verifyPassword($username, $password)) {
        // L'utilisateur est authentifié avec succès
        // Redirige vers la page de tableau de bord ou effectue d'autres actions nécessaires
        header('Location: /dashboard');
        exit;
    } else {
        // L'authentification a échoué
        // Définis un message d'erreur
        $errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
}

// Charge la vue
include '../../views/dashboard/index.html.php';
