--------------------------------------------------------
-- ALBUMS
--------------------------------------------------------

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Midnight Drive LP',
'The Synthetics',
'Electronic',
'A premium synthwave vinyl with immersive retro electronic sound.',
'',
2024,
1499,
25);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Analog Echoes',
'VinylR Originals',
'Rock',
'Classic rock collection remastered on premium vinyl.',
'',
2023,
1299,
18);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Neon Pulse Boxset',
'Cosmic Wave',
'Pop',
'A deluxe collector edition featuring exclusive bonus tracks.',
'',
2025,
2499,
10);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Moonlight Symphony',
'Orion Dreams',
'Classical',
'Relaxing orchestral vinyl for peaceful evenings.',
'',
2022,
1699,
15);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Urban Frequencies',
'DJ Vertex',
'Hip Hop',
'Limited edition urban beats collection.',
'',
2024,
1899,
20);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Velvet Horizon',
'Aurora Sky',
'Indie',
'Beautiful indie collection pressed on premium vinyl.',
'',
2023,
1599,
22);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Echoes of Tomorrow',
'Nova Pulse',
'Synthwave',
'Retro futuristic soundtrack collection.',
'',
2025,
1999,
14);

INSERT INTO albums
(title, artist, genre, description, image_url, release_year, price, stock)
VALUES
('Crimson Vinyl',
'Eclipse',
'Alternative',
'Collector edition alternative rock album.',
'',
2024,
1799,
17);

--------------------------------------------------------
-- MERCH
--------------------------------------------------------
-- MERCH



MERGE INTO merch
(id, name, category, description, image_url, price, stock, variant)
KEY(id)
VALUES
(
    1,
    'BLACKPINK Official Lightstick',
    'Lightsticks',
    'BLACKPINK concert lightstick collectible for BLINKs.',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Blackpink%20x%20Takashi%20Murakami%20lightstick%20display.jpg',
    3499,
    25,
    'Standard'
);