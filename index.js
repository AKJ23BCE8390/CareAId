import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import csv from 'csv-parser';
import * as tf from '@tensorflow/tfjs';

const results = [];
const data = [
    { disease: "Fungal infection", symptoms: ["itching", "skin_rash", "nodal_skin_eruptions", "dischromic _patches"] },
    { disease: "Allergy", symptoms: ["continuous_sneezing", "shivering", "chills", "watering_from_eyes"] },
    { disease: "Common Cold", symptoms: ["cough", "high_fever", "headache", "runny_nose"] },
];

const allSymptoms = [...new Set(data.flatMap(d => d.symptoms))];
const encodeSymptoms = (symptoms) => {
    return allSymptoms.map(s => symptoms.includes(s) ? 1 : 0);
};

const inputData = data.map(d => encodeSymptoms(d.symptoms));
const outputData = data.map(d => allSymptoms.indexOf(d.disease));
const outputClasses = [...new Set(data.map(d => d.disease))];

const xs = tf.tensor2d(inputData);
const ys = tf.oneHot(tf.tensor1d(outputData, 'int32'), outputClasses.length);

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [allSymptoms.length], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: outputClasses.length, activation: 'softmax' }));

model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

async function trainModel() {
    await model.fit(xs, ys, { epochs: 100 });
    console.log('Model trained!');
}

trainModel();

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

fs.createReadStream('data/disease.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log('data connected');
  });

app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/main", (req, res) => {
    res.render("main.ejs");
});

app.post("/submit-symptoms", async (req, res) => {
    const symptoms = req.body.symptoms.split(',').map(symptom => symptom.trim());
    const encodedSymptoms = encodeSymptoms(symptoms);
    const inputTensor = tf.tensor2d([encodedSymptoms]);

    const prediction = model.predict(inputTensor);
    const predictionArray = await prediction.array();
    const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    const predictedDisease = outputClasses[predictedIndex];
    res.render('output.ejs', { symptoms: predictedDisease });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
