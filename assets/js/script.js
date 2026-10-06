document.getElementById('imageInput')?.addEventListener('change', function() {
    const label = document.querySelector('[data-js-label]');
    const fileName = this.files[0]?.name;
    label.textContent = fileName ? fileName : 'No file selected';
});

document.getElementById('category')?.addEventListener('change', function() {
    const subcategoryGroup = document.getElementById('subcategory-group');
    const subcategorySelect = document.getElementById('subcategory');
    
    subcategoryGroup.style.display = 'block';
    subcategorySelect.innerHTML = ''; // Clear previous options
    
    const options = {
        'Quick & Easy': ['Quick Dinners', 'Easy & Healthy', 'Quick Vegetarian', 'Easy Pastas', 'Easy Chicken'],
        'Personalized Dietary': ['Low Carb Diet', 'High Protein Diet', 'Vegetarian Diet', 'Vegan Diet', 'Keto Diet']
    };
    
    options[this.value]?.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        subcategorySelect.appendChild(opt);
    });
});

document.getElementById('previewButton')?.addEventListener('click', function() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const title = document.getElementById('imageTitle').value;
    const description = document.getElementById('imageDescription').value;
    const price = document.getElementById('imagePrice').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;

    if (file && title && description && price && category && subcategory) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').style.display = 'block';
            document.getElementById('preview').src = e.target.result;
            document.getElementById('showConfirmModal').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please complete all fields before previewing.');
    }
});

document.getElementById('showConfirmModal')?.addEventListener('click', function() {
    $('#confirmModal').modal('show');
});

document.getElementById('confirmUploadButton')?.addEventListener('click', function() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const title = document.getElementById('imageTitle').value;
    const description = document.getElementById('imageDescription').value;
    const price = document.getElementById('imagePrice').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;

    if (file && title && description && price && category && subcategory) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Determine the correct localStorage key
            let storageKey;
            if (category === 'Quick & Easy') {
                storageKey = `sharedImagesQuickEasy_${subcategory}`;
            } else if (category === 'Personalized Dietary') {
                storageKey = `sharedImagesPersonalizedDietary_${subcategory}`;
            }

            // Get existing images from localStorage
            let images = JSON.parse(localStorage.getItem(storageKey)) || [];

            // Add new image data to the array
            const imageData = {
                src: e.target.result,
                title: title,
                description: description,
                price: price,
                category: category,
                subcategory: subcategory
            };
            images.push(imageData);
            
            // Save updated images back to localStorage
            localStorage.setItem(storageKey, JSON.stringify(images));

            // Clear form fields and reset preview
            document.getElementById('imageForm').reset();
            document.querySelector('[data-js-label]').textContent = 'No file selected';
            document.getElementById('subcategory-group').style.display = 'none';
            document.getElementById('preview').style.display = 'none';
            document.getElementById('showConfirmModal').style.display = 'none';

            // Hide the modal
            $('#confirmModal').modal('hide');
        };
        reader.readAsDataURL(file);
    }
});

function validateTitle() {
    var input = document.getElementById('imageTitle');
    var warning = document.getElementById('titleWarning');
    var words = input.value.trim().split(/\s+/); // Split by spaces and trim

    // Check if there are more than 2 words or any word exceeds 8 characters
    if (words.length > 2 || words.some(word => word.length > 8)) {
        warning.style.display = 'block';
        input.setCustomValidity("Invalid");
    } else {
        warning.style.display = 'none';
        input.setCustomValidity("");
    }
}

function enforceTitleLength(event) {
    var input = event.target;
    var words = input.value.trim().split(/\s+/); // Split by spaces and trim

    // Prevent input if more than 2 words or any word exceeds 8 characters
    if (words.length > 2 || words.some(word => word.length > 8)) {
        event.preventDefault();
        return false;
    }
}




function validateInput() {
    var input = document.getElementById('imagePrice');
    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3); // Limit to 3 digits
    }
}


// clearStorageButton
document.getElementById('clearStorageButton')?.addEventListener('click', function() {
    // Clear specific items from localStorage
    // localStorage.removeItem('sharedImagesQuickEasy_drwo1');
    // localStorage.removeItem('sharedImagesQuickEasy_drwo2');
    // localStorage.removeItem('sharedImagesPersonalizedDietary_drwo4');
    // Add other keys as necessary

    // Optionally, clear all localStorage items
    localStorage.clear();

    // Refresh the gallery
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.innerHTML = '<p>No images shared yet.</p>';
    }
});

function toggleFavorite(icon) {
    const card = icon.closest('.card');
    const isFavorite = card.classList.contains('favorite');
    icon.classList.toggle('favorite');
    card.classList.toggle('favorite');
    
    // Get the item details to store in localStorage
    const imageSrc = card.querySelector('img').src;
    const title = card.querySelector('h3').innerText;
    const description = card.querySelector('.card-text').innerText;
    const price = card.querySelector('.text-body-secondary').innerText;
    const category = card.querySelector('.group p:first-child').innerText;
    const subcategory = card.querySelector('.group p:last-child').innerText;
    
    // Initialize favorites array from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!isFavorite) {
        // Add to favorites
        favorites.push({ imageSrc, title, description, price, category, subcategory });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
        // Remove from favorites
        favorites = favorites.filter(item => item.imageSrc !== imageSrc);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}
