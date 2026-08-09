const BASE_KEY = "vinylr_favorites";

const getUserKey = () => {
    const username =
        localStorage.getItem("vinylr_user");

    return username
        ? `${BASE_KEY}_${username}`
        : `${BASE_KEY}_guest`;
};

export const getFavorites = () => {
    try {
        return JSON.parse(
            localStorage.getItem(
                getUserKey()
            ) || "[]"
        );
    } catch (error) {
        console.error(
            "Unable to load favourites:",
            error
        );

        return [];
    }
};

export const isFavorite = (id, type) => {
    const favorites = getFavorites();

    return favorites.some(
        (item) =>
            String(item.id) ===
                String(id) &&
            item.type === type
    );
};

export const toggleFavorite = (item) => {
    const favorites =
        getFavorites();

    const exists = favorites.some(
        (favorite) =>
            String(favorite.id) ===
                String(item.id) &&
            favorite.type === item.type
    );

    let updatedFavorites;

    if (exists) {
        updatedFavorites =
            favorites.filter(
                (favorite) =>
                    !(
                        String(favorite.id) ===
                            String(item.id) &&
                        favorite.type ===
                            item.type
                    )
            );
    } else {
        updatedFavorites = [
            ...favorites,
            item
        ];
    }

    localStorage.setItem(
        getUserKey(),
        JSON.stringify(
            updatedFavorites
        )
    );

    window.dispatchEvent(
        new Event("favoritesUpdated")
    );

    return !exists;
};

export const removeFavorite = (
    id,
    type
) => {
    const updatedFavorites =
        getFavorites().filter(
            (item) =>
                !(
                    String(item.id) ===
                        String(id) &&
                    item.type === type
                )
        );

    localStorage.setItem(
        getUserKey(),
        JSON.stringify(
            updatedFavorites
        )
    );

    window.dispatchEvent(
        new Event("favoritesUpdated")
    );
};

export const clearFavorites = () => {
    localStorage.removeItem(
        getUserKey()
    );

    window.dispatchEvent(
        new Event("favoritesUpdated")
    );
};