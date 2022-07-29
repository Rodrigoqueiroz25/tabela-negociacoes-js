import { currentInstance } from "./controllers/NegociacaoController.js";

const controller = currentInstance();

const form = document.querySelector('form').onsubmit = controller.adiciona.bind(controller);
const apaga = document.querySelector('button').onsubmit = controller.apaga.bind(controller);