-- Check and Fix Pet Database Issues
-- This script helps debug why pets aren't showing in the gallery

-- 1. Check all pets in the database
SELECT 
    id,
    pet_name,
    species,
    breed,
    age,
    adopted,
    photo_urls,
    shelter_id,
    created_at
FROM app_pet
ORDER BY id;

-- 2. Check pets that are marked as adopted (these won't show in gallery)
SELECT 
    id,
    pet_name,
    species,
    adopted
FROM app_pet 
WHERE adopted = true;

-- 3. Check pets that are NOT adopted (these should show in gallery)
SELECT 
    id,
    pet_name,
    species,
    adopted,
    photo_urls
FROM app_pet 
WHERE adopted = false;

-- 4. Check pets without photos
SELECT 
    id,
    pet_name,
    species,
    photo_urls
FROM app_pet 
WHERE photo_urls IS NULL OR photo_urls = '';

-- 5. Check shelter information
SELECT 
    p.id as pet_id,
    p.pet_name,
    p.species,
    p.shelter_id,
    s.shelter_name
FROM app_pet p
LEFT JOIN app_shelter s ON p.shelter_id = s.id
WHERE p.adopted = false;

-- 6. Fix pets that might be incorrectly marked as adopted
-- Uncomment the following lines if you want to reset adopted status to false
-- UPDATE app_pet SET adopted = false WHERE adopted = true;

-- 7. Check if there are any pets at all
SELECT COUNT(*) as total_pets FROM app_pet;
SELECT COUNT(*) as available_pets FROM app_pet WHERE adopted = false;
SELECT COUNT(*) as adopted_pets FROM app_pet WHERE adopted = true;

-- 8. Check species distribution
SELECT 
    species,
    COUNT(*) as count,
    SUM(CASE WHEN adopted = false THEN 1 ELSE 0 END) as available,
    SUM(CASE WHEN adopted = true THEN 1 ELSE 0 END) as adopted
FROM app_pet
GROUP BY species; 