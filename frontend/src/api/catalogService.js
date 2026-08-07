import api from './axiosConfig';

export const catalogService = {
  getAllAlbums: async () => {
    try { const response = await api.get('/catalog/albums'); return response.data; } 
    catch (error) { throw error; }
  },
  getAllMerch: async () => {
    try { const response = await api.get('/catalog/merch'); return response.data; } 
    catch (error) { throw error; }
  }
};