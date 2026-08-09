export const getAlbumCover = async (artist, album) => {
    try {
        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(
                `${artist} ${album}`
            )}&entity=album&limit=25`
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        // First try exact-ish artist + album matching
        let match = data.results.find((item) => {
            const resultArtist = item.artistName?.toLowerCase() || "";
            const resultAlbum = item.collectionName?.toLowerCase() || "";

            return (
                resultArtist.includes(artist.toLowerCase()) &&
                resultAlbum.includes(album.toLowerCase())
            );
        });

        // Fallback: album title only
        if (!match) {
            match = data.results.find((item) =>
                item.collectionName
                    ?.toLowerCase()
                    .includes(album.toLowerCase())
            );
        }

        if (!match?.artworkUrl100) {
            return null;
        }

        return match.artworkUrl100.replace(
            "100x100bb",
            "600x600bb"
        );

    } catch (error) {
        console.error(
            `Unable to load cover for ${artist} - ${album}`,
            error
        );

        return null;
    }
};