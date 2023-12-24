<script>
    function togglePassword() {
        var passwordInput = document.getElementById("password");

        // Change le type de l'input entre "password" et "text"
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    }
</script>
<script>
    <?php foreach ($allMovie as $element) { ?>
        let openBtn<?= $element['id'] ?> = document.querySelector('#openmodal<?= $element['id'] ?>');
        let closeBtn<?= $element['id'] ?> = document.querySelector('#closemodal<?= $element['id'] ?>');
        let modal<?= $element['id'] ?> = document.querySelector('#modal<?= $element['id'] ?>');

        openBtn<?= $element['id'] ?>.addEventListener("click", () => {
            modal<?= $element['id'] ?>.showModal();
        });

        closeBtn<?= $element['id'] ?>.addEventListener("click", () => {
            modal<?= $element['id'] ?>.close();
        });
    <?php } ?>
</script>

<script>
    let addModal = document.querySelector('#add-modal');
    let openModal = document.querySelector('.open-addModal');
    let closeModal = document.querySelector('#close-addModal');

    openModal.addEventListener('click', () => {
        addModal.showModal();
    })

    closeModal.addEventListener('click', () => {
        addModal.close();
    })
</script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // ... (le script précédent pour le lien "Gérer")

        // Récupérer le bouton "Supprimer"
        var deleteButton = document.getElementById('deleteMovies');

        // Attacher un gestionnaire d'événement au bouton "Supprimer"
        deleteButton.addEventListener('click', function() {
            // Récupérer toutes les cases à cocher sélectionnées
            var selectedCheckboxes = document.querySelectorAll('.checkbox-element:checked');

            // Récupérer les identifiants des films sélectionnés
            var selectedMovieIds = Array.from(selectedCheckboxes).map(function(checkbox) {
                return checkbox.value;
            });

            // Vérifier s'il y a des films sélectionnés
            if (selectedMovieIds.length > 0) {
                // Envoyer une requête AJAX pour supprimer les films côté serveur
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'delete_movies.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // Mettez à jour ou réinitialisez votre interface utilisateur si nécessaire
                        console.log(xhr.responseText);
                    }
                };
                xhr.send('movieIds=' + encodeURIComponent(selectedMovieIds.join(',')));
            } else {
                // Avertissement ou action appropriée si aucune case à cocher n'est sélectionnée
                console.log('Aucun film sélectionné');
            }
        });
    });
</script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Récupérer le lien "Gérer"
        var manageLink = document.querySelector('.manage-link');

        // Attacher un gestionnaire d'événement au lien "Gérer"
        manageLink.addEventListener('click', function(event) {
            // Empêcher le comportement par défaut du lien
            event.preventDefault();

            // Récupérer toutes les cases à cocher
            var checkboxes = document.querySelectorAll('.checkbox-element');

            // Basculer la classe "hidden" pour afficher ou masquer les cases à cocher
            checkboxes.forEach(function(checkbox) {
                checkbox.classList.toggle('hidden');
            });
        });
    });
</script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Récupérer le lien "Gérer"
        var manageLink = document.querySelector('.manage-link');

        // Récupérer le bouton "Supprimer les films sélectionnés"
        var deleteButton = document.querySelector('.delete');

        // Variable pour suivre l'état actuel du bouton
        var isDeleteButtonVisible = false;

        // Attacher un gestionnaire d'événement au lien "Gérer"
        manageLink.addEventListener('click', function(event) {
            // Empêcher le comportement par défaut du lien
            event.preventDefault();

            // Inverser la visibilité du bouton
            isDeleteButtonVisible = !isDeleteButtonVisible;

            // Appliquer la visibilité en fonction de l'état actuel
            deleteButton.style.display = isDeleteButtonVisible ? 'block' : 'none';
        });
    });
</script>