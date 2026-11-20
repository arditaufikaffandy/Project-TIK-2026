// CHEMORA - JavaScript untuk menu, materi, kalkulator, kuis, dan fakta kimia.

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Materi singkat yang ditampilkan ketika tombol pada kartu dipilih.
const topicContent = {
  atom: {
    title: "Struktur Atom",
    text: "Atom adalah partikel penyusun materi. Secara sederhana, atom memiliki inti yang berisi proton (bermuatan positif) dan neutron (netral), serta elektron (bermuatan negatif) yang berada di sekitar inti."
  },
  periodik: {
    title: "Sistem Periodik Unsur",
    text: "Tabel periodik menyusun unsur berdasarkan kenaikan nomor atom. Baris disebut periode, sedangkan kolom disebut golongan. Posisi unsur membantu kita mempelajari kemiripan sifat-sifatnya."
  },
  ikatan: {
    title: "Ikatan Kimia",
    text: "Ikatan kimia adalah gaya yang mengikat atom. Ikatan ion berkaitan dengan serah-terima elektron, ikatan kovalen dengan pemakaian pasangan elektron bersama, dan ikatan logam dengan elektron yang terdelokalisasi."
  },
  asam: {
    title: "Asam dan Basa",
    text: "Dalam pengenalan dasar, larutan asam memiliki pH di bawah 7, larutan netral memiliki pH 7, dan larutan basa memiliki pH di atas 7 pada suhu sekitar 25 °C. pH dapat dipelajari menggunakan indikator yang sesuai."
  }
};

document.querySelectorAll("[data-topic]").forEach((button) => {
  button.addEventListener("click", () => {
    const topic = topicContent[button.dataset.topic];
    const panel = document.getElementById("topicDetail");
    panel.innerHTML = `<div><span class="eyebrow">MATERI KIMIA</span><h3>${topic.title}</h3><p>${topic.text}</p></div>`;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

// Kalkulator mol: n = massa / massa molar.
document.getElementById("molForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const mass = Number(document.getElementById("mass").value);
  const molarMass = Number(document.getElementById("molarMass").value);
  const result = document.getElementById("molResult");

  if (!Number.isFinite(mass) || !Number.isFinite(molarMass) || mass < 0 || molarMass <= 0) {
    result.textContent = "Masukkan massa ≥ 0 dan massa molar lebih dari 0.";
    return;
  }

  const moles = mass / molarMass;
  result.textContent = `Hasil: ${moles.toLocaleString("id-ID", { maximumFractionDigits: 4 })} mol`;
});

// Kuis pilihan ganda.
const questions = [
  { question: "Partikel atom yang bermuatan negatif adalah ...", answers: ["Proton", "Neutron", "Elektron", "Nukleus"], correct: 2, explain: "Elektron memiliki muatan negatif." },
  { question: "Simbol kimia untuk oksigen adalah ...", answers: ["Ox", "O", "Og", "Ok"], correct: 1, explain: "Simbol unsur oksigen adalah O." },
  { question: "Larutan dengan pH 7 pada suhu sekitar 25 °C bersifat ...", answers: ["Asam", "Netral", "Basa", "Korosif"], correct: 1, explain: "pH 7 menunjukkan larutan netral dalam konteks pengenalan dasar." },
  { question: "Rumus kimia air adalah ...", answers: ["CO₂", "NaCl", "H₂O", "O₂"], correct: 2, explain: "Satu molekul air tersusun dari dua atom hidrogen dan satu atom oksigen." },
  { question: "Alat untuk mengukur volume cairan dengan ketelitian tertentu di laboratorium adalah ...", answers: ["Gelas ukur", "Spatula", "Neraca", "Termometer"], correct: 0, explain: "Gelas ukur digunakan untuk mengukur volume cairan." }
];

let questionIndex = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const questionCount = document.getElementById("questionCount");
const progressBar = document.getElementById("progressBar");
const quizFeedback = document.getElementById("quizFeedback");
const scoreText = document.getElementById("scoreText");
const nextQuestion = document.getElementById("nextQuestion");

function renderQuestion() {
  const current = questions[questionIndex];
  answered = false;
  questionCount.textContent = `PERTANYAAN ${questionIndex + 1} DARI ${questions.length}`;
  progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  questionText.textContent = current.question;
  answerList.innerHTML = "";
  quizFeedback.textContent = "Pilih satu jawaban.";
  nextQuestion.disabled = true;
  nextQuestion.textContent = questionIndex === questions.length - 1 ? "Lihat hasil →" : "Berikutnya →";

  current.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => selectAnswer(index));
    answerList.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const current = questions[questionIndex];
  const buttons = [...answerList.querySelectorAll("button")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === current.correct) button.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== current.correct) button.classList.add("wrong");
  });

  if (selectedIndex === current.correct) {
    score += 1;
    quizFeedback.textContent = `Benar! ${current.explain}`;
  } else {
    quizFeedback.textContent = `Belum tepat. ${current.explain}`;
  }
  scoreText.textContent = `Skor: ${score}`;
  nextQuestion.disabled = false;
}

nextQuestion.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else {
    questionText.textContent = `Kuis selesai! Skormu ${score} dari ${questions.length}.`;
    answerList.innerHTML = "";
    quizFeedback.textContent = score === questions.length
      ? "Hebat! Semua jawaban benar. Terus pertahankan semangat belajarmu!"
      : "Terima kasih sudah mencoba. Pelajari kembali materi dan coba lagi!";
    questionCount.textContent = "HASIL KUIS";
    progressBar.style.width = "100%";
    nextQuestion.textContent = "Ulangi kuis ↻";
    nextQuestion.disabled = false;
    nextQuestion.onclick = () => {
      questionIndex = 0;
      score = 0;
      scoreText.textContent = "Skor: 0";
      nextQuestion.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();

// Fakta singkat.
const facts = [
  "Garam dapur memiliki nama kimia natrium klorida (NaCl).",
  "Es mengapung di air karena massa jenis es lebih rendah daripada air cair.",
  "Simbol Au pada tabel periodik berasal dari nama Latin emas, yaitu aurum.",
  "Karbon dioksida (CO₂) merupakan salah satu gas yang digunakan tumbuhan dalam fotosintesis.",
  "Air murni tersusun dari molekul H₂O."
];
let factIndex = 0;
document.getElementById("newFact").addEventListener("click", () => {
  factIndex = (factIndex + 1) % facts.length;
  document.getElementById("factText").textContent = facts[factIndex];
});

document.getElementById("year").textContent = new Date().getFullYear();
