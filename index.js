import express from 'express';
import bodyParser from 'body-parser';
import * as tf from '@tensorflow/tfjs';
import diseaseData from './data/disease_symptoms.json' assert { type: 'json' };

console.log("Loaded Disease Data:", diseaseData);

const allSymptoms = [...new Set(diseaseData.flatMap(d => d.symptoms))];
const outputClasses = [...new Set(diseaseData.map(d => d.disease))];
console.log("Unique Symptoms:", allSymptoms);
console.log("Output Classes:", outputClasses);

const encodeSymptoms = (symptoms) => {
    return allSymptoms.map(s => symptoms.includes(s) ? 1 : 0);
};

const inputData = diseaseData.map(d => encodeSymptoms(d.symptoms));
const outputData = diseaseData.map(d => outputClasses.indexOf(d.disease));
const xs = tf.tensor2d(inputData);
const ys = tf.oneHot(tf.tensor1d(outputData, 'int32'), outputClasses.length);

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [allSymptoms.length], units: 64, activation: 'relu' }));
model.add(tf.layers.dropout({ rate: 0.3 }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: outputClasses.length, activation: 'softmax' }));

model.compile({
    optimizer: tf.train.adam(0.0005),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});

async function trainModel() {
    console.log("Starting model training...");
    await model.fit(xs, ys, {
        epochs: 150,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(4)}, Accuracy = ${logs.acc.toFixed(4)}`);
                console.log(`Validation Loss = ${logs.val_loss.toFixed(4)}, Validation Accuracy = ${logs.val_acc.toFixed(4)}`);
            },
        },
    });
    console.log("Model training complete!");
}

trainModel();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/main", (req, res) => {
    res.render("main.ejs");
});

app.post("/submit-symptoms", async (req, res) => {
    const symptoms = req.body.symptoms.split(',').map(symptom => symptom.trim());
    console.log("Symptoms received:", symptoms);

    const encodedSymptoms = encodeSymptoms(symptoms);
    const inputTensor = tf.tensor2d([encodedSymptoms]);

    const prediction = model.predict(inputTensor);
    const predictionArray = await prediction.array();

    const sortedPredictions = predictionArray[0]
        .map((prob, index) => ({ disease: outputClasses[index], probability: prob }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

    console.log("Predictions:", sortedPredictions);
    res.render('output.ejs', { results: sortedPredictions });

    inputTensor.dispose();
    prediction.dispose();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
