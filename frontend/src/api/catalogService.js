import api from "./axiosConfig";

export const catalogService = {

    // ==========================
    // ALBUMS
    // ==========================

    getAllAlbums: async () => {
        const response = await api.get("/catalog/albums");
        return response.data;
    },

    getAlbumById: async (id) => {
        const response = await api.get(`/catalog/albums/${id}`);
        return response.data;
    },

    addAlbum: async (album) => {
        const response = await api.post("/catalog/albums", album);
        return response.data;
    },

    updateAlbum: async (id, album) => {
        const response = await api.put(`/catalog/albums/${id}`, album);
        return response.data;
    },

    deleteAlbum: async (id) => {
        const response = await api.delete(`/catalog/albums/${id}`);
        return response.data;
    },

    // ==========================
    // MERCH
    // ==========================

    getAllMerch: async () => {
        const response = await api.get("/catalog/merch");
        return response.data;
    }

};