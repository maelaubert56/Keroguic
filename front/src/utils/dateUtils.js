/**
 * Formate une date ISO en format lisible français
 * @param {string} dateString - Date au format ISO (ex: "2024-12-24T00:00:00.000Z")
 * @returns {string} Date formatée (ex: "24/12/2024")
 */
export function formatDate(dateString) {
    if (!dateString) return 'Date non définie';

    try {
        const date = new Date(dateString);

        // Vérifier que la date est valide
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Date invalide';
    }
}

/**
 * Formate une date ISO en format datetime lisible français
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date et heure formatées (ex: "24/12/2024 à 14:30")
 */
export function formatDateTime(dateString) {
    if (!dateString) return 'Date non définie';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Date invalide';
    }
}

/**
 * Convertit une date ISO en format YYYY-MM-DD pour les inputs date
 * @param {string} dateString - Date au format ISO
 * @returns {string} Date au format YYYY-MM-DD
 */
export function toInputDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '';
        }

        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Erreur lors de la conversion de la date:', error);
        return '';
    }
}
