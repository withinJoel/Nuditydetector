document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');
    const actionButtons = document.getElementById('actionButtons');
    const seeAnotherBtn = document.getElementById('seeAnother');
    const tryAgainBtn = document.getElementById('tryAgain');

    let model;  // Global variable to hold the NSFW model

    // Load the NSFWJS model from the local directory
    nsfwjs.load('/nsfw-model/').then((loadedModel) => {
        model = loadedModel;
        console.log('NSFWJS model loaded successfully from local storage');
    });

    // Drag and Drop functionality
    uploadArea.addEventListener('click', () => imageUpload.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#eaf5ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.backgroundColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    });

    imageUpload.addEventListener('change', function() {
        const file = imageUpload.files[0];
        if (file) processImage(file);
    });

    async function processImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            analyzeImage(previewImage);
        };
        reader.readAsDataURL(file);
    }

    async function analyzeImage(imageElement) {
        if (!model) {
            alert('Model not loaded yet. Please wait.');
            return;
        }

        // Use the model to predict the content of the image
        const predictions = await model.classify(imageElement);
        const nudityPrediction = predictions.find(pred => pred.className === 'Porn' || pred.className === 'Sexy');
        const isNude = nudityPrediction && nudityPrediction.probability > 0.5;
        const confidence = (nudityPrediction ? nudityPrediction.probability : 0).toFixed(2);

        // Update UI based on results
        if (isNude) {
            previewImage.style.borderColor = '#d73a49';  // Red border for "nude"
        } else {
            previewImage.style.borderColor = '#28a745';  // Green border for "not nude"
        }
        previewImage.style.borderWidth = '5px';
        previewImage.style.borderStyle = 'solid';

        gsap.to(actionButtons, { opacity: 1, duration: 0.5 });
        actionButtons.classList.remove('hidden');
    }

    // Button actions
    seeAnotherBtn.addEventListener('click', () => imageUpload.click());
    tryAgainBtn.addEventListener('click', () => {
        previewImage.src = '';
        previewImage.classList.add('hidden');
        previewImage.style.border = 'none';
        actionButtons.classList.add('hidden');
    });
});
