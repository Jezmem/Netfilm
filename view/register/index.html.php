<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="inscription.css">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Bebas+Neue?query=bebas+neue">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Inter?query=inter">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription</title>
</head>

<body>

    <h1 class="brand">NETFILM</h1>
    <div class="form">
        <div class="form-container">
            <h2 class="title">S'inscrire</h2>
            <form method="post" action="/register/add">
                <div class="name">
                    <div id="last-name" class="form-content">
                        <label for="last_name">Nom:</label>
                        <input type="text" id="last_name" name="last_name" required><br>
                    </div>
                    <div id="first-name" class="form-content">
                        <label for="first_name">Prénom:</label>
                        <input type="text" id="first_name" name="first_name" required><br>
                    </div>
                </div>
                <div class="form-content">
                    <label for="username">Nom d'utilisateur:</label>
                    <input type="text" id="username" name="username" required><br>
                </div>
                <div class="form-content">
                    <label for="password">Mot de passe:</label>
                    <input type="password" id="password" name="password" required><br>
                </div>

                <button class="sign-in" type="submit">S'inscrire</button>
            </form>
        </div>
    </div>