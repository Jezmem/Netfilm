<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="connexion.css">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Bebas+Neue?query=bebas+neue">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Inter?query=inter">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
</head>
<body>
    <section class="connexion">
        <h1 class="brand">NETFILM</h1>
        <div class="form-container">
            <div class="form">
                <h2 class="title">S'identifier</h2>
                <form action="connexion.php" method="post">
        <div class="id-container">
            <p>Nom d'utilisateur</p>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="password-container">
            <p>Mot de passe</p>
            <div class="password-element">
            <input type="password" id="password" name="password" required>
            <a id="toggleButton" onclick="togglePassword()">Afficher</a>
            </div>
        </div>
        <button class="id" type="submit">S'identifier</button>
    </form>
                <div class="helpbar">
                    <div class="checkbox">
                        <input type="checkbox">
                        <p>Se souvenir de moi</p>
                    </div>
                    <a href="erreur404.html" class="help">Besoin d'aide ?</a>
                </div>
                <div class="firstVisit">
                    <p>Première visite sur NetFilm ?</p>
                    <a href="inscription.php" class="signIn">Inscrivez-vous</a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>
