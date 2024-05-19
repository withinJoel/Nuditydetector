import cv2
import tensorflow as tf
import tensorflow_hub as hub

def detect_nudity(image_path):
    # Load the pre-trained nudity detection model from TensorFlow Hub
    model = hub.load('https://tfhub.dev/google/imagenet/mobilenet_v2_130_224/classification/4')

    # Load the image using OpenCV
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = tf.image.resize(image, (224, 224)) / 255.0  # Resize and normalize

    # Make predictions
    predictions = model.predict(tf.expand_dims(image, axis=0))

    # Get the predicted label and score
    predicted_label = 'nude' if predictions[0][0] > 0.5 else 'not nude'
    confidence_score = predictions[0][0] if predicted_label == 'nude' else 1 - predictions[0][0]

    return predicted_label, confidence_score

# Example usage
image_file = 'path/to/your/image.jpg'
label, confidence = detect_nudity(image_file)
print(f'The image is {label} with confidence {confidence:.2f}')
