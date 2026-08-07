-- Initialize vinylr database with a sample albums table
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  released_at DATE DEFAULT CURRENT_DATE
);

INSERT INTO albums (title, artist) VALUES
('RaGaForge OST (Deluxe)', 'Cinematic Ensemble')
ON CONFLICT DO NOTHING;
