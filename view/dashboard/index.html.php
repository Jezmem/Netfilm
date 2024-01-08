<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Inter?query=inter">
    <link rel="stylesheet" href="https://fonts.google.com/specimen/Bebas+Neue?query=bebas+neue">
    <script src="https://kit.fontawesome.com/7871bf468e.js" crossorigin="anonymous"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
</head>

<body>
    <nav class="navbar">
        <div class="navbar-container">
            <div class="leave">
                <a href="connexion.php"><i class="fa-solid fa-arrow-left"></i></a>
                <h1 class="brand">NETFILM</h1>
            </div>
            <!-- <div class="searchbar">
                <form method="GET">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="search" placeholder="Rechercher" name="searchbar" id="">
                    <button type="submit">Rechercher</button>
                </form>
            </div> -->
            <div class="modification">
                <div class="delete">
                    <div class="delete-container">
                        <i class="fa-solid fa-x"></i>
                        <button id="deleteMovies" class="delete-button" type="button">Supprimer les films sélectionnés</button>
                    </div>
                </div>
                <div class="open-addModal">
                    <i class="fa-solid fa-plus"></i>
                    <a href="#">Ajouter</a>
                </div>

                <div class="edit">
                    <i class="fa-solid fa-pen"></i>
                    <a class="manage-link" href="#">Gérer</a>
                </div>
            </div>
        </div>
    </nav>
    <div class="user">
        <img src="assets/user.png" alt="user-image">
        <h2>Username</h2>
    </div>

    <!-- Modale d'ajout d'un film -->
    <div class="add-movie">
        <dialog class="add-modal" id="add-modal">
            <form method="post" enctype="multipart/form-data">
                <div class="add-movie-image">
                    <i id="close-addModal" class="fa-solid fa-xmark"></i>
                    <div class="add-image-file">
                        <input id="add-image" type="file" name="image" accept="image/*" required>
                    </div>
                    <input class="add-title" type="text" placeholder="Nom du film" name="title" required>
                </div>
                <div class="add-type-movie">
                    <input type="text" placeholder="Année de sortie" name="release_year" required>
                    <input type="text" placeholder="Genre" id="genre" name="genre" required>
                </div>
                <div class="add-picture-file">
                    <p>Ajoutez une image de présentation du film : <input id="add-image" type="file" name="picture" accept="image/*" required></p>
                </div>
                <input class="add-synopsis" type="text" placeholder="Ajoutez un synopsis..." name="synopsis" required>
                <div class="add-realisation">
                    <p>Réalisateur : <input type="text" placeholder="Nom du réalisateur" name="producer" required></p>
                    <p>Scénariste : <input type="text" placeholder="Nom du scénariste" name="scriptwriter" required></p>
                    <p>Production : <input type="text" placeholder="Nom de la société de production" name="production" required></p>
                </div>
                <div class="add-button">
                    <button type="submit">Ajouter un nouveau film</button>
                </div>
            </form>
        </dialog>
    </div>

    <div class="movies-container">
        <?php if (isset($movies) && !empty($movies)) : ?>
            <?php foreach ($allMovie as $element) { ?>
                <div class="movie">
                    <dialog class="modale" id="modal<?= $element['id'] ?>">
                        <div class="movie-image" style="background-image: url(assets/<?= $element['picture'] ?>);">
                            <i id="closemodal<?= $element['id'] ?>" class="fa-solid fa-xmark"></i>
                            <h2 class="title"><?= $element['title'] ?></h2>
                        </div>
                        <div class="type-movie">
                            <p><?= $element['release_year'] ?></p>
                            <p><?= $element['genre'] ?></p>
                        </div>
                        <p class="synopsis"><?= $element['synopsis'] ?></p>
                        <div class="realisation">
                            <p>Réalisateur : <?= $element['producer'] ?></p>
                            <p>Scénariste : <?= $element['scriptwriter'] ?></p>
                            <p>Production : <?= $element['production'] ?></p>
                        </div>
                        <a class="update" href="#"><i class="fa-solid fa-pen-to-square"></i>Modifier le film</a>
                    </dialog>
                    <div class="select">
                        <a class="movie-link" href="#">
                            <img id="openmodal<?= $element['id'] ?>" src="assets/<?= $element['image'] ?>" alt="image-movie">
                        </a>
                        <p><?= $element['genre'] ?></p>
                        <div class="chekcbox">
                            <input class="checkbox-element hidden" type="checkbox" name="selectedMovies[]" value="<?= $element['id'] ?>">
                        </div>
                    </div>
                </div>
            <?php } ?>
        <?php endif; ?>
    </div>
</body>